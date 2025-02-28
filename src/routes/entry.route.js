import { Router } from "express";
import { createEntry, getEntries, editEntry, deleteEntry } from "../controllers/entry.controller.js"

const router = Router();

router.route("/createentry/:customerId/:entryType").post(
    createEntry
)

router.route("/getentries/:customerId").get(
    getEntries
)

router.route("/editentry/:entryId").post(
    editEntry
)

router.route("/deleteentry/:entryId").delete(
    deleteEntry
)


export default router;