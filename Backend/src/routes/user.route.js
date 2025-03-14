import { Router } from "express";
import { registerUser,verifyOTP, loginUser, logoutUser, getUser, updateUser,forgotPassword, resetPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isUserLoggedin } from "../middlewares/isUserLoggedin.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("profilePicture"),
    registerUser
)

router.route("/verifyotp").post(
    upload.none(),
    verifyOTP
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

router.route("/forgotpassword").post(
    upload.none(),
    forgotPassword
)

router.route("/resetpassword").post(
    upload.none(),
    resetPassword
)


export default router;