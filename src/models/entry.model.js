import mongoose, { Schema } from "mongoose";
import { Customer } from "./customer.model.js";

const entrySchema = new Schema({
    amount: {
        type: Number,
        required: [true, "Amount is required!"],
    },
    entryType: {
        type: String,
        required: [true, "EntryType is required!"],
        enum: ["You Gave", "You Get"],
    },
    reason: {
        type: String,
    },
    customer: {
        type: Schema.ObjectId,
        ref: Customer,
    }
},{
    timestamps: true
});

// Indexes
entrySchema.index({ customer: 1 });                // Retrieve entries for a specific customer
entrySchema.index({ customer: 1, createdAt: -1 }); // Retrieve recent entries for a customer
entrySchema.index({ entryType: 1 });               // Filter by entry type
entrySchema.index({ createdAt: 1 });               // Filter by time range

export const Entry = mongoose.model("Entry", entrySchema)