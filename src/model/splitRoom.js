import mongoose, { Schema } from "mongoose";

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


export default mongoose.models.SplitRoom || mongoose.model("SplitRoom", splitRoomSchema);