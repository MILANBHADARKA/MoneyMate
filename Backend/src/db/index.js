import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDb = async () => {
    try {
        const connectionInstanse = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

        console.log("Database connected succesfully with host -> " + connectionInstanse.connection.host);
    } catch (error) {
        console.log("MongoDB connection error!!!" + "," + error);
        process.exit(1);
    }
}

export default connectDb;