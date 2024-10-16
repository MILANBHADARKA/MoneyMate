const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [4 , "At least username have 4 characters"],
        maxlength: [30 , "At most username have 30 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6 , "password atleast of 6 characters"],
        match : [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ,"Your password must include at least one uppercase letter, one lowercase letter, one special character, and one numeric digit."]
    },
    profilepic: {
        type: String,
        default: "profilepicture.png",
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: props => `${props.value} is not a valid image file!`
        }
    },
    otp:{
        type: Number,
        required: false
    },
    otpexpires:{
        type: Date,
        required: false
    },
    customers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
    ]
})

module.exports = mongoose.model('user', userSchema);
