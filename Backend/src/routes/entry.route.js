import { Router } from "express";
import { createEntry, getEntries, editEntry, deleteEntry } from "../controllers/entry.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/createentry/:customerId/:entryType").post(
    upload.none(),
    createEntry
)

router.route("/getentries/:customerId").get(
    getEntries
)

router.route("/editentry/:entryId").post(
    upload.none(),
    editEntry
)

router.route("/deleteentry/:customerId/:entryId").delete(
    deleteEntry
)


export default router;