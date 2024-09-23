

const mongoose = require('mongoose');


const entrySchema = new mongoose.Schema({
    entry: {
        type: String,
        required: true
    },
    yougave: {
        type: Boolean,
        default: false,
        required: false
    },
    yougot: {
        type: Boolean,
        default: false,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    reason: {
        type: String,
        required: false
    }
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

// Define the main customer schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    entries: {
        type: [entrySchema], // Use the nested schema here
        default: []
    },
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields to the customer schema
});

module.exports = mongoose.model('Customer', customerSchema);