import { Customer } from "../models/customer.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const createCustomer = async (req, res, next) => {

    try {
        const { name } = req.body;
        // console.log(req.body);

        if (name.trim() === "") {
            throw new ApiError(400, "Customer name is required!")
        }

        const customerExists = await Customer.findOne({ name, user: req.user._id });

        if (customerExists) {
            throw new ApiError(409, "Customer with name already exists!")
        }

        const customer = await Customer.create({
            name,
            user: req.user._id
        })

        const user = await User.findById({ _id: req.user._id });
        user.customers.push(customer._id);
        await user.save();

        const createdCustomer = await Customer.findById(customer._id);

        if (!createdCustomer) {
            throw new ApiError(500, "Customer not created!")
        }

        return res.status(201).json(new ApiResponse(201, "Customer created successfully", createdCustomer));
    } catch (error) {
        // console.log(error.success);
        next(error);
    }

}

const getCustomers = async (req, res, next) => {

    try {
        const customers = await Customer.find({ user: req.user._id });

        // console.log(customers);

        if (!customers) {
            throw new ApiError(404, "No customers found!")
        }

        return res.status(200).json(new ApiResponse(200, "Customers found successfully", customers));
    }
    catch (error) {
        next(error);
    }

}

const getCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findOne({ _id: customerId, user: req.user._id });

        if (!customer) {
            throw new ApiError(404, "Customer not found!");
        }

        return res.status(200).json(new ApiResponse(200, "Customer found successfully", customer));
    } catch (error) {
        next(error);
    }
};

const getCustomersCount = async (req, res, next) => {
    try {
        const count = await Customer.countDocuments({ user: req.user._id });

        return res.status(200).json({
            message: "Customers count fetched successfully!",
            data: count
        });
    } catch (error) {
        next(error);
    }
};

const updateCustomer = async (req, res, next) => {

    try {

        const { customerId } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === "") {
            throw new ApiError(400, "Customer name is required!")
        }

        const CustomerExists = await Customer.findOne({ name, user: req.user._id });

        if (CustomerExists) {
            throw new ApiError(409, "Customer with name already exists!")
        }

        const customer = await Customer.findOneAndUpdate({ _id: customerId, user: req.user._id }, { name }, { new: true });

        if (!customer) {
            throw new ApiError(500, "Customer not updated!")
        }

        return res.status(200).json(new ApiResponse(200, "Customer updated successfully", customer));
    }
    catch (error) {
        next(error);
    }

}

const deleteCustomer = async (req, res, next) => {

    try {

        const { customerId } = req.params;

        const customer = await Customer.findOneAndDelete({ _id: customerId, user: req.user._id });

        if (!customer) {
            throw new ApiError(500, "Customer not deleted!")
        }

        const user = await User.findById({ _id: req.user._id });

        user.customers = user.customers.filter((customer) => customer._id.toString() !== customerId);
        await user.save();

        return res.status(200).json(new ApiResponse(200, "Customer deleted successfully"));
    }
    catch (error) {
        next(error);
    }

}

export { 
    createCustomer, 
    getCustomers, 
    getCustomer, 
    updateCustomer, 
    deleteCustomer,
    getCustomersCount 
}