import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { Customer } from "./customer.model.js";

const userSchema = new Schema({
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
    customers: [
        {
            type: Schema.ObjectId,
            ref: "Customer"
        }
    ]
},{
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}



export const User = mongoose.model("User", userSchema);