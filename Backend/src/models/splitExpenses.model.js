import mongoose from "mongoose";
import { User } from "./user.model.js";

const splitExpensesSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "Amount is required!"],
    },
    reason: {
        type: String,
    },
    paidBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User who Paid is required!"],
    },
    users: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    splits: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User"
            },
            amount: {
                type: Number,
                required: [true, "Amount is required!"]
            }
        }
    ]
},{
    timestamps: true
})

export const SplitExpenses = mongoose.model("SplitExpenses",splitExpensesSchema);