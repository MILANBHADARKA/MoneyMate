import { Router } from "express";
import { createEntry, getEntries, editEntry, getEntry, deleteEntry } from "../controllers/entry.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { isUserLoggedin } from "../middlewares/isUserLoggedin.middleware.js";

const router = Router();

router.route("/createentry/:customerId").post(
    isUserLoggedin,
    upload.none(),
    createEntry
)

router.route("/getentries/:customerId").get(
    getEntries
)

router.route("/getentry/:entryId").get(
    getEntry
)

router.route("/editentry/:entryId").post(
    isUserLoggedin,
    upload.none(),
    editEntry
)

router.route("/deleteentry/:customerId/:entryId").delete(
    isUserLoggedin,
    deleteEntry
)


export default router;