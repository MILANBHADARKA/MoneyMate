import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerUser = async (req,res) => {
    const { username ,email ,password } = req.body;
    console.log(req.body);

    if(
        [username,email,password].some((field) => field?.trim() === "")
    )
    {
        throw new ApiError(400,"All fields are required!")
    }

    const userExists = await User.findOne({$or: [{username},{email}]})

    if(userExists){
        throw new ApiError(409, "User with email or username already exists!")
    }

    let profilePictureLocalPath;
    let profilePicture;
    if(req.file){
        profilePictureLocalPath = req.file.path;
        profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
    }

    const user = await User.create({
        username,
        email,
        password,
        profilePicture: profilePicture?.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser){
        throw new ApiError(500, "User not created!")
    }

    return res.status(201).json(new ApiResponse(201, "User created successfully", createdUser));
        
}

const loginUser = async (req,res) => {

    const { email ,password } = req.body;
    console.log(req.body);

    if(
        [email,password].some((field) => field?.trim() === "")
    )
    {
        throw new ApiError(400,"All fields are required!")
    }

    const existsUser = await User.findOne({email});

    if(!existsUser){
        throw new ApiError(404, "User not found!")
    }

    const isPasswordCorrect = await existsUser.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid credentials!")
    }  

    const token = jwt.sign({id: existsUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"}); 

    const options = {                          //cookie options for secure and httpOnly 
        httpOnly: true,               //httpOnly is true so that cookie can not be accessed by javascript
        secure: true             //secure is true so that cookie can only be sent over https
    }

    const currentuser = await User.findById(existsUser._id).select("-password");

    return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, "Login successful", currentuser));

}

const logoutUser = async (req,res) => {
    const options = {                          //cookie options for secure and httpOnly 
        httpOnly: true,               //httpOnly is true so that cookie can not be accessed by javascript
        secure: true             //secure is true so that cookie can only be sent over https
    }

    return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, "Logout successful"));
}

const getUser = async (req,res) => {
    const user = await User.findById(req.user.id).select("-password");

    if(!user){
        throw new ApiError(404, "User not found!")
    }

    return res.status(200).json(new ApiResponse(200, "User found", user));

}

const updateUser = async (req,res) => {
    const { username ,password } = req.body;

    if(username){
        if(username.trim() === ""){
            throw new ApiError(400, "Username cannot be empty!")
        }

        const userExists = await User.findOne({username: username.toLowerCase()});

        if(userExists){
            throw new ApiError(409, "Username already exists!")
        }

        let user = await User.findOne({_id: req.user.id});
        user.username = username;
        await user.save();

        user = await User.findById(req.user.id).select("-password");

        return res.status(200).json(new ApiResponse(200, "Username updated successfully", user));
    }

    if(password){
        if(password.trim() === ""){
            throw new ApiError(400, "Password cannot be empty!")
        }

        let user = await User.findById(req.user.id);

        user.password = password;
        await user.save();

        // const updatedUser = await User.findById(req.user.id);
        // console.log(updatedUser);

        return res.status(200).json(new ApiResponse(200, "Password updated successfully"));
    }

    if(req.file){
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



export {registerUser, loginUser, logoutUser, getUser, updateUser}