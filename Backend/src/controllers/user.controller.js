import { User } from "../models/user.model.js";
import { TempUser } from "../models/tempUser.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendOTP } from "../config/sendMail.js";

const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // console.log(req.body);

        if (
            [username, email, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required!")
        }

        const userExists = await User.findOne({ $or: [{ username }, { email }] })

        if (userExists) {
            throw new ApiError(409, "User with email or username already exists!")
        }

        let profilePictureLocalPath;
        let profilePicture;
        if (req.file) {
            profilePictureLocalPath = req.file.path;
            profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
        }

        // const user = await User.create({
        //     username,
        //     email,
        //     password,
        //     profilePicture: profilePicture?.url || ""
        // })

        // const createdUser = await User.findById(user._id).select("-password");

        // if (!createdUser) {
        //     throw new ApiError(500, "User not created!")
        // }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const checkTempUser = await TempUser.findOne({ $or: [{ username }, { email }] })

        if (checkTempUser) {
            await TempUser.findByIdAndDelete(checkTempUser._id);
        }

        const tempUser = await TempUser.create({
            username,
            email,
            password,
            profilePicture: profilePicture?.url || "",
            otp,
            otpExpires
        })

        if (!tempUser) {
            throw new ApiError(500, "User not created!")
        }

        const otpResponse = await sendOTP(email, otp, otpExpires);

        if (!otpResponse) {
            throw new ApiError(500, "OTP not sent!")
        }

        return res.status(201).json(new ApiResponse(201, "Otp send Successfully!", { email, otpResponse }));

        // return res.status(201).json(new ApiResponse(201, "User created successfully", createdUser));
    }
    catch (error) {
        next(error);
    }
}

const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (
            [email, otp].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required!")
        }

        const tempUser = await TempUser
            .findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!tempUser) {
            throw new ApiError(404, "Invalid OTP!")
        }

        if (tempUser.email !== email || tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
            throw new ApiError(404, "Invalid OTP!")
        }

        const user = await User.create({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            profilePicture: tempUser.profilePicture
        })

        const deletedTempUser = await TempUser.findByIdAndDelete(tempUser._id);

        if (!user) {
            throw new ApiError(500, "User not created!")
        }

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            throw new ApiError(500, "User not created!")
        }

        return res.status(201).json(new ApiResponse(201, "User created successfully", createdUser));
    }
    catch (error) {
        next(error);
    }
}

const loginUser = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (
            [email, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required!")
        }

        const existsUser = await User.findOne({ email });

        if (!existsUser) {
            throw new ApiError(404, "Invalid credentials!")
        }

        const isPasswordCorrect = await existsUser.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid credentials!")
        }

        const token = jwt.sign({ id: existsUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }

        const currentuser = await User.findById(existsUser._id).select("-password");

        return res
            .status(200)
            .cookie("token", token, options)
            .json(new ApiResponse(200, "Login successful", currentuser));
    }
    catch (error) {
        next(error);
    }

}

const logoutUser = async (req, res, next) => {
    try {

        const options = {
            httpOnly: true,
            secure: true, 
            sameSite: "None", 
            path: "/"
        }

        return res
            .status(200)
            .clearCookie("token", options)
            .json(new ApiResponse(200, "Logout successful"));
    }
    catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id).select("-password -otp -otpExpires");

        if (!user) {
            throw new ApiError(404, "User not found!")
        }

        return res.status(200).json(new ApiResponse(200, "User found", user));
    }
    catch (error) {
        next(error);
    }

}

const updateUser = async (req, res, next) => {
    try {

        const { username, password } = req.body;

        if (username) {
            if (username.trim() === "") {
                throw new ApiError(400, "Username cannot be empty!")
            }

            const userExists = await User.findOne({ username: username.toLowerCase() });

            if (userExists) {
                throw new ApiError(409, "Username already exists!")
            }

            let user = await User.findOne({ _id: req.user.id });
            user.username = username;
            await user.save();

            user = await User.findById(req.user.id).select("-password");

            return res.status(200).json(new ApiResponse(200, "Username updated successfully", user));
        }

        if (password) {
            if (password.trim() === "") {
                throw new ApiError(400, "Password cannot be empty!")
            }

            let user = await User.findById(req.user.id);

            user.password = password;
            await user.save();

            // const updatedUser = await User.findById(req.user.id);
            // console.log(updatedUser);

            return res.status(200).json(new ApiResponse(200, "Password updated successfully"));
        }

        if (req.file) {
            const profilePictureLocalPath = req.file.path;
            const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

            let user = await User.findById(req.user.id);
            user.profilePicture = profilePicture.url;
            await user.save();

            user = await User.findById(req.user.id).select("-password");

            return res.status(200).json(new ApiResponse(200, "Profile picture updated successfully", user));
        }

        throw new ApiError(400, "Invalid request!");
    }
    catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email || email.trim() === "") {
            throw new ApiError(400, "Email is required!")
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found!")
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const otpResponse = await sendOTP(email, otp, otpExpires);

        if (!otpResponse) {
            throw new ApiError(500, "OTP not sent!")
        }

        return res.status(200).json(new ApiResponse(200, "Otp send Successfully!", { email, otpResponse }));
    }
    catch (error) {
        next(error);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { otp, password, email } = req.body.data || req.body;

        // console.log(req.body.data);
        // console.log(req.body.data.email);
        // console.log(otp);

        if (
            [email, otp, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required!")
        }

        // const user = await User
        //     .findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        // if (!user) {
        //     throw new ApiError(404, "Invalid OTP!")
        // }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found!")
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            throw new ApiError(404, "Invalid OTP!")
        }


        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.status(200).json(new ApiResponse(200, "Password reset successfully!"));
    }
    catch (error) {
        next(error);
    }
}



export {
    registerUser,
    verifyOTP,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
    forgotPassword,
    resetPassword
};