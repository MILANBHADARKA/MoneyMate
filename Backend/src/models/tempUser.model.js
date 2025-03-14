import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { Customer } from "./customer.model.js";

const tempUserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
    profilePicture: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date
    }
},{
    timestamps: true
})

export const TempUser = mongoose.model("TempUser", tempUserSchema);