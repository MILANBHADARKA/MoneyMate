import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
    cors({
        // origin: process.env.CORS_ORIGIN, 
        origin: ["http://localhost:5173", "http://192.168.43.230:5173"], 
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
import splitRoomRouter from "./routes/splitRoom.route.js"
import splitExpensesRouter from "./routes/splitExpenses.route.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/entry", entryRouter);
app.use("/api/v1/splitroom", splitRoomRouter);
app.use("/api/v1/splitexpenses", splitExpensesRouter);

app.use(errorHandler);

export {app}