import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
import { SplitExpenses } from "./splitExpenses.model.js";

const splitRoomSchema = new Schema({
    name: {
        type: String,
        required: [true, "Room name is required!"],
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "User",
        required: true 
    },
    users: [
        {
            type: Schema.ObjectId,
            ref: "User"
        }
    ],
    expenses: [
        {
            type: Schema.ObjectId,
            ref: "SplitExpenses"
        }
    ],
},{
    timestamps: true
})

export const SplitRoom = mongoose.model("SplitRoom", splitRoomSchema);