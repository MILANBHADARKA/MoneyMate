import { Router } from "express";
import { isUserLoggedin } from "../middlewares/isUserLoggedin.middleware.js";
import { 
    createSplitRoom, 
    joinSplitRoom, 
    getSplitRooms, 
    getSplitRoom, 
    getRoomUsers,
    calculateBalance, 
    getRoomSummary,
    editSplitRoom,
    leaveSplitRoom
} from "../controllers/splitRoom.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/createsplitroom").post(
    upload.none(),
    isUserLoggedin,
    createSplitRoom
)

router.route("/joinsplitroom").post(
    upload.none(),
    isUserLoggedin,
    joinSplitRoom
)

router.route("/getsplitrooms").get(
    isUserLoggedin,
    getSplitRooms
)

router.route("/getsplitroom/:roomId").get(
    isUserLoggedin,
    getSplitRoom
)

router.route("/getroomusers/:roomId").get(
    isUserLoggedin,
    getRoomUsers
)

router.route("/calculatebalance/:roomId").get(
    isUserLoggedin,
    calculateBalance
)

router.route("/getroomsummary/:roomId").get(
    isUserLoggedin,
    getRoomSummary
)

router.route("/editsplitroom/:roomId").post(
    upload.none(),
    isUserLoggedin,
    editSplitRoom
)

router.route("/leavesplitroom/:roomId").post(
    upload.none(),
    isUserLoggedin,
    leaveSplitRoom
)

export default router;