import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import SplitRoom from "@/model/splitRoom";
import SplitExpenses from "@/model/splitExpenses";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";

export async function GET(request, { params }) {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        const user = verifyToken(token);
        // console.log("User from token:", user);

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid token" }), { status: 401 });
        }

        const mongoUser = await User.findById({ _id: user.id });

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        const { id } = await params;

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Room ID is required" }), { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        if (!type) {    //add all type in if condition
            return new Response(JSON.stringify({ success: false, error: "Invalid type parameter" }), { status: 400 });
        }

        if (type == "room-details") {    //done

            const splitRoom = await SplitRoom.findById(id)
                .populate({
                    path: 'expenses',
                    populate: [
                        {
                            path: 'paidBy',
                            select: 'username email'
                        },
                        {
                            path: 'users',
                            select: 'username email'
                        }
                    ]
                });

            if (!splitRoom) {
                return new Response(JSON.stringify({ success: false, error: "Split room not found" }), { status: 404 });
            }

            if (!splitRoom.users.includes(user.id)) {
                return new Response(JSON.stringify({ success: false, error: "You are not a member of this split room" }), { status: 403 });
            }

            return new Response(JSON.stringify({ success: true, splitRoom }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (type == "room-users") {    //done

            const splitRoom = await SplitRoom.findById(id);

            if (!splitRoom) {
                return new Response(JSON.stringify({ success: false, error: "Split room not found" }), { status: 404 });
            }

            if (!splitRoom.users.includes(user.id)) {
                return new Response(JSON.stringify({ success: false, error: "You are not a member of this split room" }), { status: 403 });
            }

            // Get user details for everyone in the room
            const users = await User.find({ _id: { $in: splitRoom.users } })
                .select('username email profilePicture');

            if (!users || users.length === 0) {
                return new Response(JSON.stringify({ success: false, error: "No users found in this split room" }), { status: 404 });
            }

            return new Response(JSON.stringify({ success: true, users }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (type == "calculate-balance") {    //done
            const splitRoom = await SplitRoom.findById(id)
                .populate({
                    path: 'expenses',
                    populate: {
                        path: 'paidBy splits.user',
                        select: 'username'
                    }
                });

            if (!splitRoom) {
                return new Response(JSON.stringify({ success: false, error: "Split room not found" }), { status: 404 });
            }

            if (!splitRoom.users.includes(user.id)) {
                return new Response(JSON.stringify({ success: false, error: "You are not a member of this split room" }), { status: 403 });
            }

            // Calculate balance for each user in the split room
            const balances = {};

            splitRoom.expenses.forEach(expense => {
                const payerId = expense.paidBy._id.toString();

                // Process each split in the expense
                expense.splits.forEach(split => {
                    const owerId = split.user._id.toString();

                    // Skip if payer and ower are the same
                    if (payerId === owerId) return;

                    // Initialize balance between these users if not exists
                    if (!balances[payerId]) balances[payerId] = {};
                    if (!balances[owerId]) balances[owerId] = {};

                    if (!balances[payerId][owerId]) balances[payerId][owerId] = 0;
                    if (!balances[owerId][payerId]) balances[owerId][payerId] = 0;

                    // Update the balance: payer gets, ower gives
                    balances[payerId][owerId] += split.amount;
                    balances[owerId][payerId] -= split.amount;
                });
            });

            const userBalances = {
                toReceive: [],
                toPay: [],
                settled: []
            }

            const userIdStr = user.id.toString();

            Object.keys(balances[userIdStr] || {}).forEach(otherUserId => {
                const balance = balances[userIdStr][otherUserId];
                const otherUser = splitRoom.expenses.find(e =>
                    e.splits.some(s => s.user._id.toString() === otherUserId)
                )?.splits.find(s => s.user._id.toString() === otherUserId)?.user;

                if (!otherUser) return;

                // console.log(balance, otherUser);

                if (balance > 0) {
                    userBalances.toReceive.push({
                        user: otherUser,
                        amount: balance
                    });
                } else if (balance < 0) {
                    userBalances.toPay.push({
                        user: otherUser,
                        amount: Math.abs(balance)
                    });
                } else {
                    userBalances.settled.push({
                        user: otherUser
                    });
                }
            });

            return new Response(JSON.stringify({ success: true, balances: userBalances }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (type == 'room-summary') {      //done
            const splitRoom = await SplitRoom.findById(id)
                .populate('users', 'username')
                .populate({
                    path: 'expenses',
                    populate: {
                        path: 'paidBy splits.user',
                        select: 'username'
                    }
                });

            if (!splitRoom) {
                return new Response(JSON.stringify({ success: false, error: "Split Room not found1" }), { status: 403 });
            }

            // console.log("Split Room:", splitRoom.users);

            const checkSplitRoom = await SplitRoom.findById(id);
            if (!checkSplitRoom.users.includes(user.id)) {
                return new Response(JSON.stringify({ success: false, error: "You are not a member of this split room!" }), { status: 403 });
            }

            // Total expenses in the room
            const totalRoomExpense = splitRoom.expenses.reduce(
                (sum, expense) => sum + expense.amount, 0
            );

            // per-user expenses and balances
            const userSummaries = {};

            splitRoom.users.forEach(user => {
                const userId = user._id.toString();
                userSummaries[userId] = {
                    user,
                    paid: 0,
                    owes: 0,
                    netBalance: 0
                };
            });

            // what each user paid and owes
            splitRoom.expenses.forEach(expense => {
                const payerId = expense.paidBy._id.toString();

                // Add to payer's paid amount
                if (userSummaries[payerId]) {
                    userSummaries[payerId].paid += expense.amount;
                }

                // Add to each user's owed amount
                expense.splits.forEach(split => {
                    const userId = split.user._id.toString();
                    if (userSummaries[userId]) {
                        userSummaries[userId].owes += split.amount;
                    }
                });
            });

            // Calculate net balance for each user
            Object.values(userSummaries).forEach(summary => {
                summary.netBalance = summary.paid - summary.owes;
            });

            return new Response(JSON.stringify({
                success: true,
                room: {
                    name: splitRoom.name,
                    totalExpense: totalRoomExpense
                },
                users: Object.values(userSummaries)
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (type == 'leave-room') {
            const splitRoom = await SplitRoom.findById(id);

            if (!splitRoom) {
                return new Response(JSON.stringify({ success: false, error: "Split Room not found1" }), { status: 403 });
            }

            if (!splitRoom.users.includes(user.id)) {
                return new Response(JSON.stringify({ success: false, error: "You are not a member of this split room" }), { status: 403 });
            }

            if (splitRoom.createdBy.toString() === user.id.toString()) {
                if (splitRoom.users.length == 1) {

                    const splitRoom = await SplitRoom.findById(id);

                    if (!splitRoom) {
                        return new Response(JSON.stringify({ success: false, error: "Split Room not found!" }), { status: 403 });
                    }

                    //delete all expenses of this room
                    for (const expenseId of splitRoom.expenses) {
                        const expense = await SplitExpenses.findByIdAndDelete(expenseId);
                        if (!expense) {
                            return new Response(JSON.stringify({ success: false, error: "Failed to delete expenses!" }), { status: 403 });
                        }
                    }

                    //delete the room
                    const deleteRoom = await SplitRoom.findByIdAndDelete(id);

                    if (!deleteRoom) {
                        return new Response(JSON.stringify({ success: false, error: "failed To delete Room!" }), { status: 390 });
                    }

                    mongoUser.splitRooms = mongoUser.splitRooms.filter(room => room.toString() !== id);
                    await mongoUser.save();

                    return new Response(JSON.stringify({ success: true, message: "As you only one member of this room, Room deleted successfully!" }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                }

                const newAdmin = splitRoom.users[1];
                splitRoom.createdBy = newAdmin;
                await splitRoom.save();

                mongoUser.splitRooms = mongoUser.splitRooms.filter(room => room.toString() !== id);
                await mongoUser.save();

                splitRoom.users = splitRoom.users.filter(oneuser => oneuser.toString() !== user.id.toString());
                await splitRoom.save();

                return new Response(JSON.stringify({ success: true, message: "Room left successfully" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
            mongoUser.splitRooms = mongoUser.splitRooms.filter(room => room.toString() !== id);
            await mongoUser.save();

            splitRoom.users = splitRoom.users.filter(oneuser => oneuser.toString() !== user.id.toString());
            await splitRoom.save();

            return new Response(JSON.stringify({ success: true, message: "Room left successfully" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

    } catch (error) {
        console.log('Error fetching split room:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error!!!!!!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function PUT(req, { params }) {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        const user = verifyToken(token);
        // console.log("User from token:", user);

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid token" }), { status: 401 });
        }

        const mongoUser = await User.findById({ _id: user.id });

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Room ID is required" }), { status: 400 });
        }

        const { name } = await req.json();

        if (!name || name.toString().trim() === "") {
            return new Response(JSON.stringify({ success: false, error: "Room name is required!" }), { status: 401 });
        }

        const splitRoom = await SplitRoom.findById(id);

        if (!splitRoom) {
            return new Response(JSON.stringify({ success: false, error: "Split Room not found1" }), { status: 403 });
        }

        if (!splitRoom.users.includes(user.id)) {
            return new Response(JSON.stringify({ success: false, error: "You are not a member of this split room" }), { status: 403 });
        }

        if (splitRoom.createdBy.toString() != user.id.toString()) {
            return new Response(JSON.stringify({ success: false, error: "You are not the Admin of this room!" }), { status: 390 });
        }

        splitRoom.name = name;
        await splitRoom.save();

        return new Response(JSON.stringify({ success: true, message: "Split room Updated successfully", splitRoom }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log('Error edit split room:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error!!!!!" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}