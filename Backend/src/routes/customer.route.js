import { Router } from "express";
import { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } from "../controllers/customer.controller.js"
import { isUserLoggedin } from "../middlewares/isUserLoggedin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/createcustomer").post(
    upload.none(),
    isUserLoggedin,
    createCustomer
)

router.route("/getcustomers").get(
    isUserLoggedin,
    getCustomers
)

router.route("/getcustomer/:customerId").get(
    isUserLoggedin,
    getCustomer
)

router.route("/updatecustomer/:customerId").post(
    upload.none(),
    isUserLoggedin,
    updateCustomer
)

router.route("/deletecustomer/:customerId").delete( 
    isUserLoggedin,
    deleteCustomer
)


export default router;