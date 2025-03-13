import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";


export const isUserLoggedin = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            throw new ApiError(401, "Token not found! Please login to continue");
        }

        // console.log("token:", token);

        try {
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(id);

            if (!user) {
                throw new ApiError(404, "User not found!")
            }
            req.user = user;
            next();
        }
        catch (error) {
            throw new ApiError(401, "Unauthorized! Please login to continue");
        }
    }
    catch (error) {
        next(error);
    }
}
