import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUser, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isUserLoggedin } from "../middlewares/isUserLoggedin.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("profilePicture"),
    registerUser
)

router.route("/login").post(
    upload.none(),
    loginUser
)

router.route("/logout").post(
    logoutUser
)

router.route("/getuser").get(
    isUserLoggedin,
    getUser
)

router.route("/getuser").get(
    isUserLoggedin,
    getUser
)

router.route("/updateuser").post(
    upload.single("profilePicture"),
    isUserLoggedin,
    updateUser
)


export default router;