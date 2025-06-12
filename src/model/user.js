import mongoose, {Schema} from "mongoose";

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
        lowercase: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter a valid email address!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
        // Removed all validations (minlength, maxlength, regex) as these are for hashed passwords
    },
    profilePicture: {
        type: String,
    },
    customers: [
        {
            type: Schema.ObjectId,
            ref: "Customer"
        }
    ],
    splitRooms: [
        {
            type: Schema.ObjectId,
            ref: "SplitRoom"
        }
    ],
    verifyCode: {        //for forgot password
        type: String,
    },
    verifyCodeExpires: {
        type: Date,
    }
},{
    timestamps: true
})

export default mongoose.models.User || mongoose.model("User", userSchema);