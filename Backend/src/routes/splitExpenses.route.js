import { Router } from "express";
import { createSplitExpenses } from "../controllers/splitExpenses.controller.js";
import { isUserLoggedin } from "../middlewares/isUserLoggedin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/createsplitexpenses/:roomId").post(
    upload.none(),
    isUserLoggedin,
    createSplitExpenses
)

export default router;