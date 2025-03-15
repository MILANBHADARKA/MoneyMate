import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN, 
        credentials: true, 
        methods: ["GET", "POST", "PUT", "DELETE"], 
        allowedHeaders: ["Content-Type", "Authorization"], 
    })
);

app.use(express.json({
    limit: '16kb'
}))

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))

app.use(express.static('public'))

app.use(cookieParser())



//router declaration

import userRouter from "./routes/user.route.js";
import customerRouter from "./routes/customer.route.js"
import entryRouter from "./routes/entry.route.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/entry", entryRouter);

app.use(errorHandler);

export {app}