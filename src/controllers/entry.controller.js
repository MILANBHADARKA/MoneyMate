import { Entry } from '../models/entry.model.js';
import { Customer } from '../models/customer.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createEntry = async (req, res) => {
    const { amount, reason } = req.body;
    const { customerId, entryType } = req.params;
    //entryType will either "You Gave" or "You Get"

    if (!amount || amount.trim() === "") {
        throw new ApiError(400, 'Amount is required!');
    }

    const entry = await Entry.create({
        amount,
        entryType,
        reason: reason || '',
        customer: customerId,
    });

    const customer = await Customer.findById(customerId);

    customer.entries.push(entry._id);
    await customer.save();

    const createdEntry = await Entry.findById(entry._id);

    if (!createdEntry) {
        throw new ApiError(500, 'Entry not created!');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, 'Entry created successfully', createdEntry));

}

const getEntries = async (req, res) => {
    const { customerId } = req.params;

    const entries = await Entry.find({ customer: customerId });

    if (!entries) {
        throw new ApiError(404, 'No entries found!');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Entries found successfully', entries));
}

const editEntry = async (req, res) => {

    const { entryId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || amount.trim() === "") {
        throw new ApiError(400, 'Amount is required!');
    }

    const entry = await Entry.findByIdAndUpdate(entryId, {
        amount,
        reason: reason || '',
    }, { new: true });

    if (!entry) {
        throw new ApiError(500, 'Entry not updated!');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Entry updated successfully', entry));
}

const deleteEntry = async (req, res) => {
    const { entryId } = req.params;

    const entry = await Entry.findByIdAndDelete(entryId);

    if (!entry) {
        throw new ApiError(500, 'Entry not deleted!');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Entry deleted successfully', entry));
}

export { createEntry, getEntries, editEntry, deleteEntry };