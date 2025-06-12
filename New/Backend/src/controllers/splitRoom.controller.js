import { SplitExpenses } from "../models/splitExpenses.model.js";
import { SplitRoom } from "../models/splitRoom.model.js";
import { User } from "../models/user.model.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSplitRoom = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || name.toString().trim() === "") {
            throw new ApiError(400, 'Split Room name is required!');
        }

        const splitRoom = await SplitRoom.create({
            name,
            createdBy: req.user._id,
            users: [req.user._id]
        });

        const createdSplitRoom = await SplitRoom.findById(splitRoom._id);

        if (!createdSplitRoom) {
            throw new ApiError(500, 'Room not created!');
        }

        const user = await User.findById(req.user._id);
        user.splitRooms.push(createdSplitRoom._id);
        await user.save();

        return res.status(201).json(new ApiResponse(201, "Room created successfully!", createdSplitRoom));
    }
    catch (error) {
        next(error);
    }
}

const joinSplitRoom = async (req, res, next) => {
    try{
        const { roomId } = req.body;

        if(!roomId || roomId.toString().trim() === ""){
            throw new ApiError(400, 'Room ID is required!');
        }

        const splitRoom = await SplitRoom.findById(roomId);

        if(!splitRoom){
            throw new ApiError(404, 'Room not found!');
        }

        if(splitRoom.users.includes(req.user._id)){
            throw new ApiError(400, 'You are already a member of this room!');
        }

        splitRoom.users.push(req.user._id);
        await splitRoom.save();

        const user = await User.findById(req.user._id);
        user.splitRooms.push(splitRoom._id);
        await user.save();

        return res.status(200).json(new ApiResponse(200, 'Room joined successfully!', splitRoom));
    }
    catch(error){
        next(error);
    }
}

const getSplitRooms = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id).populate('splitRooms');
        
        return res.status(200).json(new ApiResponse(200, 'Rooms fetched successfully!', user.splitRooms));
    }
    catch(error){
        next(error); 
    }
}

const getSplitRoom = async (req, res, next) => {
    try{
        const { roomId } = req.params;
        const populate = req.query.populate === 'true';

        if(!roomId || roomId.toString().trim() === ""){
            throw new ApiError(400, 'Room ID is required!');
        }

        let splitRoom;
        
        if (populate) {
            splitRoom = await SplitRoom.findById(roomId)
                .populate({
                    path: 'expenses',
                    populate: {
                        path: 'paidBy users',
                        select: 'username email'
                    }
                });
        } else {
            splitRoom = await SplitRoom.findById(roomId);
        }

        if(!splitRoom){
            throw new ApiError(404, 'Room not found!');
        }

        const user = await User.findById(req.user._id);

        if(!splitRoom.users.includes(user._id)){
            throw new ApiError(400, 'You are not a member of this room!');
        }

        return res.status(200).json(new ApiResponse(200, 'Room fetched successfully!', splitRoom));
    }
    catch(error){
        next(error);
    }
}

const getRoomUsers = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        if(!roomId || roomId.toString().trim() === ""){
            throw new ApiError(400, 'Room ID is required!');
        }

        const splitRoom = await SplitRoom.findById(roomId);

        if(!splitRoom){
            throw new ApiError(404, 'Room not found!');
        }

        if(!splitRoom.users.includes(req.user._id)){
            throw new ApiError(400, 'You are not a member');
        }

        // Get user details for everyone in the room
        const users = await User.find({ _id: { $in: splitRoom.users } })
            .select('username email profilePicture');

        // return res.status(200).json({
        //     message: 'Room users fetched successfully!',
        //     data: {
        //         room: splitRoom,
        //         users: users
        //     }
        // });
        return res.status(200).json(new ApiResponse(200, 'Room users fetched successfully!', { room: splitRoom, users }));
    } catch (error) {
        next(error);
    }
}

const calculateBalance = async(req,res,next) => {
    try{
        const { roomId } = req.params;
        const user = req.user._id;

        const splitRoom = await SplitRoom.findById(roomId)
        .populate({
            path: 'expenses',
            populate: {
                path: 'paidBy splits.user',         
                select: 'username'
            }
        });

        if(!splitRoom){
            throw new ApiError(404, 'Room not found!');
        }

        const checksplitRoom = await SplitRoom.findById(roomId);

        if(!checksplitRoom.users.includes(req.user._id)){
            throw new ApiError(400, 'You are not a member of this room!');
        }

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

        const userIdStr = user.toString();

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

        return res.status(200).json(new ApiResponse(200, 'Balances calculated successfully!', userBalances));  
    }
    catch(error){
        next(error);
    }
}

const getRoomSummary = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        
        const splitRoom = await SplitRoom.findById(roomId)
            .populate('users', 'username')
            .populate({
                path: 'expenses',
                populate: {
                    path: 'paidBy splits.user',
                    select: 'username'
                }
            });

        if (!splitRoom) {
            throw new ApiError(404, 'Room not found!');
        }

        const checksplitRoom = await SplitRoom.findById(roomId);

        if (!checksplitRoom.users.includes(req.user._id)) {
            throw new ApiError(400, 'You are not a member of this room!');
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

        // return res.status(200).json({
        //     message: 'Room summary fetched successfully',
        //     data: {
        //         room: {
        //             name: splitRoom.name,
        //             totalExpense: totalRoomExpense
        //         },
        //         users: Object.values(userSummaries)
        //     }
        // });
        return res.status(200).json(new ApiResponse(200, 'Room summary fetched successfully', {
            room: {
                name: splitRoom.name,
                totalExpense: totalRoomExpense
            },
            users: Object.values(userSummaries)
        }));
    } catch (error) {
        next(error);
    }
};

const editSplitRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const { name } = req.body;

        if (!name || name.toString().trim() === "") {
            throw new ApiError(400, 'Room name is required!');
        }

        const splitRoom = await SplitRoom.findById(roomId);

        if (!splitRoom) {
            throw new ApiError(404, 'Room not found!');
        }

        if (!splitRoom.users.includes(req.user._id)) {
            throw new ApiError(390, 'You are not a member of this room!');
        }

        if(splitRoom.createdBy.toString() != req.user._id.toString()){
            throw new ApiError(390, 'You are not the Admin of this room!');
        }

        splitRoom.name = name;
        await splitRoom.save();

        return res.status(200).json(new ApiResponse(200, 'Room updated successfully!', splitRoom));
    } catch (error) {
        next(error);
    }
};

const leaveSplitRoom = async (req, res, next) => {
    try{
        const { roomId } = req.params;

        if(!roomId || roomId.toString().trim() === ""){
            throw new ApiError(400, 'Room ID is required!');
        }

        const splitRoom = await SplitRoom.findById(roomId);

        if(!splitRoom){
            throw new ApiError(404, 'Room not found!');
        }

        if(!splitRoom.users.includes(req.user._id)){
            throw new ApiError(400, 'You are not a member of this room!');
        }

        const user = await User.findById(req.user._id);

        if(!user){
            throw new ApiError(404, 'User not found!');
        }

        if(splitRoom.createdBy.toString() === req.user._id.toString()){
            if(splitRoom.users.length == 1){
                const deletedRoom = await SplitRoom.findByIdAndDelete(roomId);

                if(!deletedRoom){
                    return res.status(500).json({
                        message: 'Room not deleted!'
                    });
                }

                user.splitRooms = user.splitRooms.filter(room => room.toString() !== roomId);
                await user.save();

                return res.status(200).json(new ApiResponse(200, 'As you only one member of this room, Room deleted successfully!'));
            }

            const newAdmin = splitRoom.users[1];
            splitRoom.createdBy = newAdmin;
            await splitRoom.save();

            user.splitRooms = user.splitRooms.filter(room => room.toString() !== roomId);
            await user.save();

            splitRoom.users = splitRoom.users.filter(user => user.toString() !== req.user._id.toString());
            await splitRoom.save();

            return res.status(200).json(new ApiResponse(200, 'Room left successfully'));
        }

        user.splitRooms = user.splitRooms.filter(room => room.toString() !== roomId);
        await user.save();

        splitRoom.users = splitRoom.users.filter(user => user.toString() !== req.user._id.toString());
        await splitRoom.save();

        return res.status(200).json(new ApiResponse(200, 'Room left successfully'));
    }
    catch(error){
        next(error);
    }
}

export {
    createSplitRoom,
    joinSplitRoom,
    getSplitRooms,
    getSplitRoom,
    getRoomUsers,  // Add this to the exports
    calculateBalance,
    getRoomSummary,
    editSplitRoom,
    leaveSplitRoom
}


