import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN, //  Allow frontend origin
        credentials: true, // Required for cookies
        methods: ["GET", "POST", "PUT", "DELETE"], //  Allow these methods
        allowedHeaders: ["Content-Type", "Authorization"], //  Allow necessary headers
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

export {app}