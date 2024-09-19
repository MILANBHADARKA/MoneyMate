const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilepic:{
        type: String,
        default: "profilepicture.png"
    },
    otp:{
        type: Number,
        required: false
    },
    otpexpires:{
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('user', userSchema);