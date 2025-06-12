import User from "@/model/user";
import SplitRoom from "@/model/splitRoom";
import SplitExpenses from "@/model/splitExpenses";
import dbConnect from "@/lib/dbConnect";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";

export async function POST(request) {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        const user = verifyToken(token);

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid token" }), { status: 401 });
        }

        const mongoUser = await User.findById({ _id: user.id });

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        const { amount, reason, users } = await request.json();
        
        const { searchParams } = new URL(request.url);
        const roomId = searchParams.get("roomId");
        const paidBy = user.id;

        if (!amount || amount <= 0) {
            return new Response(JSON.stringify({ success: false, error: "Amount is required and should be greater than 0!" }), { status: 400 });
        }

        if (!users || users.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "Users are required!" }), { status: 400 });
        }

        if (!roomId) {
            return new Response(JSON.stringify({ success: false, error: "Room ID is required" }), { status: 400 });
        }

        const splitRoom = await SplitRoom.findById(roomId);

        if (!splitRoom) {
            return new Response(JSON.stringify({ success: false, error: "Room not found!" }), { status: 404 });
        }

        if (!splitRoom.users.includes(user.id)) {
            return new Response(JSON.stringify({ success: false, error: "You are not a member of this split room" }), { status: 403 });
        }

        const splitAmount = amount / users.length;
        let splits = [];

        splits = users.map(userId => ({
            user: userId,
            amount: splitAmount
        }));

        const splitExpenses = await SplitExpenses.create({
            amount,
            reason,
            paidBy,
            users,
            splits
        });

        splitRoom.expenses.push(splitExpenses._id);
        await splitRoom.save();

        return new Response(JSON.stringify({ success: true, message: "Expenses created successfully", splitExpenses }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error adding split expense:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}