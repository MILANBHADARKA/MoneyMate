import { SplitExpenses } from "../models/splitExpenses.model.js";
import { SplitRoom } from "../models/splitRoom.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSplitExpenses = async (req, res, next) => {
    try {
        const { amount, reason, users } = req.body;
        const { roomId } = req.params;
        const paidBy = req.user._id;

        // console.log(req.body);

        if (!amount || amount <= 0) {
            throw new ApiError(400, 'Amount is required and should be greater than 0!');
        }

        if (!users || users.length === 0) {
            throw new ApiError(400, 'Users are required!');
        }

        const splitRoom = await SplitRoom.findById(roomId);

        if (!splitRoom) {
            throw new ApiError(404, 'Room not found!');
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

        return res.status(201).json(new ApiResponse(201, "Expenses created successfully", splitExpenses));
    }
    catch (error) {
        next(error);
    }
}



export { createSplitExpenses };