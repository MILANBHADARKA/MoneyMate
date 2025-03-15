import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema({
    name: {
        type: String,
        required: [true, "Customer name is required!"],
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    entries: [
        {
            type: Schema.ObjectId,
            ref: "Entry"
        }  
    ]
},{
    timestamps: true
})


// Ensure customer names are unique per user
customerSchema.index({ name: 1, user: 1 }, { unique: true });

export const Customer = mongoose.model("Customer", customerSchema);