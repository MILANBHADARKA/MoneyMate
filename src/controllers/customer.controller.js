import { Customer } from "../models/customer.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createCustomer = async (req,res) => {
    
    const { name } = req.body;

    if(!name){
        throw new ApiError(400, "Customer name is required!")
    }

    

}