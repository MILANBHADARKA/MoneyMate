require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(express.static('public'));

const connectDB = require('./config/db');
const upload = require('./config/multerconfig');

const nodemailer = require('nodemailer');
const crypto = require('crypto');

//feviccon
const favicon = require('serve-favicon');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/fevicon.ico'));


// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;  
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const userModel = require('./models/user.model.js');
const customerModel = require('./models/customer.model.js');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { type } = require('os');

const mongoUrl = process.env.MONGO_URI;

// app.use(session({
//   secret: process.env.SESSION_SECRET,  // Replace with a secure secret
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URI,  // Use the MongoDB Atlas URI
//   })
// }));

app.use(session({
    secret: process.env.SESSION_SECRET,  // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { 
      maxAge: 600000, // Session expiration time (10 minutes)
      secure: false, // Set to true if using HTTPS
      httpOnly: true // Prevent client-side access
    }
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

app.get('/' , (req, res) => {
    // res.redirect('/customers');

    // check token in cookies and verify it using jwt other vise index
    let token = req.cookies.token;

    if (!token) return res.render('index');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.render('index');
        res.redirect('/customers');
    }
    );
})

app.get('/registration', (req,res) => {
    res.render('registration');
})

// Registration Form Submission
app.post('/registration', upload.single('profilepic'), async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check for Required Fields
    if (!username || !email || !password || !confirmPassword) {
        return res.render('registration', { error: 'All fields are required', username, email });
    }

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('registration', { error: 'Invalid email format', username });
    }

    // Check for Unique User
    let user = await userModel.findOne({ $or: [{ username }, { email }] });      
    if (user) {
        return res.render('registration', { error: 'Username or Email already exists', username, email });
    }

    // Check Passwords Match
    if (password !== confirmPassword) {
        return res.render('registration', { error: 'Passwords do not match', username, email });
    }

    // Validate Password Complexity
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.render('registration', { error: 'Your password must include at least one uppercase letter, one lowercase letter, one special character, and one numeric digit.', username, email });
    }

    // Check Profile Picture Upload
    if (req.file) {
        const fileType = req.file.mimetype;
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!validTypes.includes(fileType)) {
            return res.render('registration', { error: 'Invalid file type for profile picture. Please upload JPEG, PNG, or GIF.', username, email });
        }
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP(); 
    const otpexpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Temporarily Store User Details in Session
    req.session.tempUser = {
        username,
        email,
        password: hash,
        profilepic: req.file ? req.file.filename : "profilepicture.png",
        otp,
        otpexpires
    };

    // Send OTP via Email
    let mailOptions = {
        from: GMAIL_USER,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for registration is ${otp}. This OTP will expire in 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.redirect(`/verify-otp?email=${email}`);
    });
});

app.get('/verify-otp', (req, res) => {
    const { email } = req.query;

    // Check if tempUser exists in session
    // if (!req.session.tempUser || req.session.tempUser.email !== email) {
        // return res.render('registration', { error: 'Session expired or invalid email'} );                    //1
    // }

    res.render('verify-otp', { email });

});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    // Check if tempUser exists in session
    // if (!req.session.tempUser || req.session.tempUser.email !== email) {
        // return res.render('registration', { error: 'Session expired or invalid email'} );        //4
    // }

    const tempUser = req.session.tempUser;

    if (tempUser.otpexpires < Date.now()) {
        return res.render('registration', { error: 'OTP expired'} );           //2
    }

    if (tempUser.otp !== parseInt(otp)) {
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
    res.redirect('/introduction');
});

app.get('/login', (req,res) => {
    res.render('login');
})

app.post('/login', async (req,res) => {
    const {email, password} = req.body;

    let user = await userModel.findOne({ email: email });

    if(!user){
        return res.render('login', { error: 'Invalid credentials', email });          //1
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.render('login', { error: 'Invalid credentials', email });          //2
    }

    //login
    let token = jwt.sign({ email: email, userid: user._id }, JWT_SECRET);
    res.cookie('token', token);
    res.redirect('/customers');

})

app.get('/verify-otp-login', (req,res) => {
    const { email } = req.query;     //query is used to get the data from the url after the ?

    res.render('verify-otp-login', { email });
});

app.post('/verify-otp-login', async (req,res) => {
    const { email, otp } = req.body;

    let user = await userModel.findOne({ email: email });

    if(!user){
        return res.render('login', { error: 'User not found', email });          //1
    }

    if (user.otpexpires < Date.now()) {
        return res.render('login', { error: 'OTP expired'} );           //2
    }

    if (user.otp !== parseInt(otp)) {
        return res.render('verify-otp-login', { error: 'Invalid OTP', email });            //3
    }

    user.otp = null;
    user.otpexpires = null;
    await user.save();

    //login
    let token = jwt.sign({ email: email, userid: user._id }, JWT_SECRET);
    res.cookie('token', token);
    res.redirect('/customers');
});

app.get('/profile', isLoggedIn , async (req,res) => {
    let user = await userModel.findOne({ email: req.user.email });

    res.render('profile', { user: user });
} )

app.get('/logout', (req,res) => {   
    res.clearCookie('token');
    res.redirect('/');
})

app.post('/logout', (req,res) => {
    res.clearCookie('token');
    res.redirect('/');
})

app.get('/forgot', (req,res) => {
    res.render('forgot');
})

app.post('/forgot', async (req,res) => {
    const { email } = req.body;

    let user = await userModel.findOne({ email: email });

    if(!user){
        return res.render('forgot', { error: 'User not found', email });          //1
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
        res.redirect(`/verify-otp-forgot?email=${email}`);
    }

    );
});

app.get('/verify-otp-forgot', (req,res) => {
    const { email } = req.query;

    res.render('verify-otp-forgot', { email });
});

app.post('/verify-otp-forgot', async (req,res) => {
    const { email, otp } = req.body;

    let user = await userModel.findOne({
        email: email
    });

    if(!user){
        return res.render('forgot', { error: 'User not found', email });          //1
    }

    if (user.otpexpires < Date.now()) {
        return res.render('forgot', { error: 'OTP expired'} );           //2
    }

    if (user.otp !== parseInt(otp)) {
        return res.render('verify-otp-forgot', { error: 'Invalid OTP', email });            //3
    }

    user.otp = null;

    res.render('resetpassword', { email });
    
});

app.post('/resetpassword', async (req,res) => {
    const { email, password, confirmPassword } = req.body;

    let user = await userModel.findOne({ email: email });

    if(!user){
        return res.render('forgot', { error: 'User not found', email });          //1
    }

    if (password !== confirmPassword) {
        return res.render('resetpassword', { error: 'Passwords do not match', email });      //7
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;

    await user.save();

    res.redirect('/login');
});
    

app.get('/edituser', isLoggedIn , async (req,res) => {
    let user = await userModel.findOne({ email: req.user.email });

    res.render('edituser', { user: user });
})

app.post('/edituser/:id', isLoggedIn , async (req,res) => {
    let user = await userModel.findOne({ email: req.user.email });

    const { newusername } = req.body;

    //check if username already exists
    let user1 = await userModel.findOne({ username: newusername });

    if(user1){
        return res.render('edituser', { error: 'Username already exists', user: user });          //1
    }

    user.username = newusername;
    await user.save();

    res.redirect('/profile');

})

app.get('/deleteuser', isLoggedIn , async (req,res) => {
    let user = await userModel.findOne({ email: req.user.email });

    //ask user to enter password to delete the account
    res.render('deleteuser', { user: user });
})

app.post('/deleteuser', isLoggedIn , async (req,res) => {
    let user = await userModel.findOne({ email: req.user.email });

    const { password } = req.body;

    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.render('deleteuser', { error: 'Invalid password', user: user });          //2
    }

    let customers = await customerModel.find({ user: user._id });

    customers.forEach(async customer => {
        await customerModel.findByIdAndDelete(customer._id);
    }
    );

    await userModel.findByIdAndDelete(user._id);

    res.clearCookie('token');
    res.redirect('/');
})

app.get('/customers', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate('customers');

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Provide a default value if user.customers is undefined
        let customers = user.customers || [];   

        res.render('customers', { customers: customers });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/addcustomer', isLoggedIn , (req,res) => {
    res.render('addcustomer');
})

app.post('/addcustomer', isLoggedIn , async (req,res) => {

    let user = await userModel.findOne({ email: req.user.email });
    const { name } = req.body;

    let customer = new customerModel({
        name: name,
        user: user._id
    });
    await customer.save();

    user.customers.push(customer._id);
    await user.save();

    res.redirect('/customers');
})

app.get('/customerdetail/:id', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    let totalyougave = 0;
    let totalyougot = 0;

    customer.entries.forEach(entry => {
        if(entry.yougave){
            totalyougave += parseInt(entry.entry);
        }
        if(entry.yougot){
            totalyougot += parseInt(entry.entry);
        }
    });

    res.render('customerdetail', { customer: customer, totalyougave: totalyougave, totalyougot: totalyougot });
})



app.get('/editcustomer/:id', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    res.render('editcustomer', { customer: customer });
})

app.post('/editcustomer/:id', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    const { newname } = req.body;

    customer.name = newname;

    await customer.save();

    res.redirect('/customers');
})

app.get('/deletecustomer/:id', isLoggedIn , async (req,res) => {
    let user = await userModel.findOne({ email: req.user.email });

    user.customers.pull(req.params.id);

    await user.save();

    await customerModel.findByIdAndDelete(req.params.id);

    res.redirect('/customers');
});

// app.get('/addentry/:id', isLoggedIn , async (req,res) => {
//     let customer = await customerModel.findById(req.params.id);

//     res.render('addentry', { customer: customer });
// })

// app.post('/addentry/:id', isLoggedIn , async (req,res) => {
//     let customer = await customerModel.findById(req.params.id);

//     const { entry, reason } = req.body;

//     customer.entries.push({
//         entry: entry,
//         reason: reason
//     });

//     await customer.save();

//     res.redirect(`/customerdetail/${req.params.id}`);
// })

app.get('/addentry/:type/:id', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    if (req.params.type === 'yougave') {
        res.render('addentry', { customer: customer, yougave: true, type: 'yougave' });
    }
    else if (req.params.type === 'yougot') {
        res.render('addentry', { customer: customer, yougot: true , type: 'yougot' });
    }
})

app.post('/addentry/:type/:id', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    const { entry, reason } = req.body;

    if (req.params.type === 'yougave') {
        customer.entries.push({
            entry: entry,
            reason: reason,
            yougave: true,
            type: 'yougave'
        });
    }
    else if (req.params.type === 'yougot') {
        customer.entries.push({
            entry: entry,
            reason: reason,
            yougot: true,
            type: 'yougot'
        });
    }

    await customer.save();

    res.redirect(`/customerdetail/${req.params.id}`);
})


app.get('/editentry/:id/:entryid', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    let entry = customer.entries.id(req.params.entryid);

    res.render('editentry', { customer: customer, entry: entry });
})

app.post('/editentry/:id/:entryid', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    let entrys = customer.entries.id(req.params.entryid);

    const { newentry, newreason } = req.body;

    entrys.entry = newentry;
    entrys.reason = newreason;

    await customer.save();

    res.redirect(`/customerdetail/${req.params.id}`);
})

app.get('/deleteentry/:id/:entryid', isLoggedIn , async (req,res) => {
    let customer = await customerModel.findById(req.params.id);

    customer.entries.pull(req.params.entryid);      //pull is used to remove the entry from the array

    await customer.save();

    res.redirect(`/customerdetail/${req.params.id}`);
})



function isLoggedIn (req, res, next) {
    let token = req.cookies.token;

    if (!token) return res.render('index');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
}

app.get('/introduction', (req,res) => {
    res.render('introduction');
})
app.get('/index', (req,res) => {
    res.render('index');
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
  })
