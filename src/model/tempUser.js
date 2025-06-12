import mongoose, {Schema} from "mongoose";

const tempUserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        trim: true,
        lowercase: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter a valid email address!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    profilePicture: {
        type: String,
        default: ""
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required!"]
    },
    verifyCodeExpires: {
        type: Date,
        required: [true, "Verification code expiry is required!"]
    }
}, {
    timestamps: true
});

// Auto delete documents after 15 minutes (900 seconds)
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.models.TempUser || mongoose.model("TempUser", tempUserSchema);