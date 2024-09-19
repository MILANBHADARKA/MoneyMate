require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db'); // Import the database connection
const upload = require('./config/multerconfig');

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const session = require('express-session');


// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;  
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const userModel = require('./models/user.model.js');


// Add session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // Store a random secret key in .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Should be true if using HTTPS
}));


// Send OTP via email
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    }
});

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP
}

// Connect to MongoDB
connectDB();

// Set the view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', isLoggedIn , (req, res) => {
    res.redirect('/profile');
})

app.get('/registration', (req,res) => {
    res.render('registration');
})

app.post('/registration', upload.single('profilepic'), async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        // return res.status(400).send('All fields are required');
        return res.render('registration', { error: 'All fields are required', username, email });         //6
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
        // return res.status(400).send('User already exists');
        return res.render('registration', { error: 'User already exists', username, email });      //5
    }

    if (password !== confirmPassword) {
        // return res.status(400).send('Passwords do not match');
        return res.render('registration', { error: 'Passwords do not match', username, email });      //7
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP(); // Random 6-digit OTP
    const otpexpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Temporarily store user details (in session)
    req.session.tempUser = null;

    req.session.tempUser = {
        username,
        email,
        password: hash,
        profilepic: req.file ? req.file.filename : "profilepicture.png",
        otp,
        otpexpires
    };

    let mailOptions = {
        from: GMAIL_USER,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for registration is ${otp}. This OTP will expire in 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.redirect(`/verify-otp?email=${email}`);
    });
});

app.get('/verify-otp', (req, res) => {
    const { email } = req.query;

    // Check if tempUser exists in session
    if (!req.session.tempUser || req.session.tempUser.email !== email) {
        // return res.status(400).send('Session expired or invalid email');
        // return res.render('verify-otp', { error: 'Session expired or invalid email', email });                    //1
        return res.render('registration', { error: 'Session expired or invalid email'} );                    //1
    }

    res.render('verify-otp', { email });
    // res.render('/registration', { email });
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    // Check if tempUser exists in session
    if (!req.session.tempUser || req.session.tempUser.email !== email) {
        // return res.status(400).send('Session expired or invalid email');
        // return res.render('verify-otp', { error: 'Session expired or invalid email', email });          //4
        return res.render('registration', { error: 'Session expired or invalid email'} );        //4
    }

    const tempUser = req.session.tempUser;

    if (tempUser.otpexpires < Date.now()) {
        // return res.status(400).send('OTP expired');
        // return res.render('verify-otp', { error: 'OTP expired', email });           //2
        return res.render('registration', { error: 'OTP expired'} );           //2
    }

    if (tempUser.otp !== parseInt(otp)) {
        // return res.status(400).send('Invalid OTP');
        return res.render('verify-otp', { error: 'Invalid OTP', email });            //3
    }

    // OTP is valid, create the user in the database
    let newUser = new userModel({
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password,
        profilepic: tempUser.profilepic,
    });

    await newUser.save();

    // Clear session
    req.session.tempUser = null;

    // Generate JWT token after successful OTP verification
    let token = jwt.sign({ email: tempUser.email, userid: newUser._id }, JWT_SECRET);
    res.cookie('token', token);
    res.redirect('/profile');
});

app.get('/login', (req,res) => {
    res.render('login');
})

app.post('/login', async (req,res) => {
    const {email, password} = req.body;

    let user = await userModel.findOne({ email: email });

    if(!user){
        // res.status(400).send('User not found');
        return res.render('login', { error: 'Invalid credentials', email });          //1
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        // res.status(400).send('Invalid credentials');
        return res.render('login', { error: 'Invalid credentials', email });          //2
    }

    const otp = generateOTP(); // Random 6-digit OTP
    const otpexpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    //store in database
    user.otp = otp;
    user.otpexpires = otpexpires;
    await user.save();

    let mailOptions = {
        from: GMAIL_USER,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for registration is ${otp}. This OTP will expire in 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.redirect(`/verify-otp-login?email=${email}`);
    });

})

app.get('/verify-otp-login', (req,res) => {
    const { email } = req.query;

    res.render('verify-otp-login', { email });
});

app.post('/verify-otp-login', async (req,res) => {
    const { email, otp } = req.body;

    let user = await userModel.findOne({ email: email });

    if(!user){
        // res.status(400).send('User not found');
        return res.render('login', { error: 'User not found', email });          //1
    }

    if (user.otpexpires < Date.now()) {
        // return res.status(400).send('OTP expired');
        // return res.render('verify-otp', { error: 'OTP expired', email });           //2
        return res.render('login', { error: 'OTP expired'} );           //2
    }

    if (user.otp !== parseInt(otp)) {
        // return res.status(400).send('Invalid OTP');
        return res.render('verify-otp-login', { error: 'Invalid OTP', email });            //3
    }

    user.otp = null;
    user.otpexpires = null;
    await user.save();

    //login
    let token = jwt.sign({ email: email, userid: user._id }, JWT_SECRET);
    res.cookie('token', token);
    res.redirect('/profile');
});

app.get('/profile', isLoggedIn , async (req,res) => {
    let user = await userModel.findOne({ email: req.user.email });

    res.render('profile', { user: user });
} )

app.post('/logout', (req,res) => {
    res.clearCookie('token');
    res.redirect('/');
})

function isLoggedIn (req, res, next) {
    let token = req.cookies.token;

    if (!token) return res.redirect('/login');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
}

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
  })