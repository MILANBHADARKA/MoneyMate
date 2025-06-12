import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    console.error("Error Handler:", err); 

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
    });
};

export default errorHandler;