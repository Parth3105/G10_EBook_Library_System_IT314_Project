const jwt = require("jsonwebtoken"); //jwt tokens are required for protected routes...
const userModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs"); // bcryptjs is used in node to encrypt the passwords
const nodemailer = require("nodemailer"); // nodemailer
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } = require("../Utils/emailTemplates"); // email templates
const otpVerification = require("../Models/otpVerification");
const validate = require('../Utils/validateuser');

// nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// function control the registration of the new user.
module.exports.registerUser = async (req, res) => {
    try {
        const registerInput = req.body;

        // Check if email already exists
        const existingUser = await userModel.findOne({ email: registerInput.email });
        if (existingUser) {
            return res.send({code: 400, msg:"User with this email already exists."});
        }

        // Check if username already exists
        const existingUsername = await userModel.findOne({ username: registerInput.username });
        if (existingUsername) {
            return res.send({code: 401,msg: "User with this username already exists. Please enter a unique one."});
        }

        // Validate password length
        if (registerInput.password.length < 8 || registerInput.password.length > 12) {
            return res.send({code: 401, msg:"Password must be between 8 and 12 characters long."});
        }

        // Check if password and confirmPassword match
        if (registerInput.password !== registerInput.confirmPassword) {
            return res.send({code: 402, msg:"Passwords do not match."});
        }

        // Validate other inputs using Joi (assuming validate function exists)
        const { error } = validate(registerInput);
        if (error) {
            return res.send({code: 403, msg:error.details[0].msg});  // Send the validation error msg
        }

        // Hash password
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(registerInput.password, saltRounds);

        // Create a new user
        const newUser ={
            username: registerInput.username,
            password: hashedPass,
            email: registerInput.email,
            userRole: registerInput.userRole,
            verified: false
        };

        await sendOTPVerificationEmail(newUser, res);
    } catch (err) {
        console.log("User Creation Error: " + err);
        res.send({code: 404, msg:"Server error during registration."});
    }
};


// function controls the login of user.
module.exports.loginUser = async (req, res) => {
    const loginInput = req.body;
    const userCredential = await userModel.findOne({ username: loginInput.username });

    if (userCredential == null) {
        res.send({code: 400, msg:"User not found!"});
    }
    else {
        try {
            const isMatch = await bcrypt.compare(loginInput.password, userCredential.password); // Compare the input plain-text password with stored hashed-password.
            if (isMatch) {
                jwt.sign({ userID: userCredential._id }, process.env.JWT_KEY, { expiresIn: "4h" }, (err, token) => {
                    if (err) {
                        res.send({ code: 400, msg: "Error logging in!" });
                    }
                    else {
                        res.send({
                            code: 200,
                            msg: "Login Successfull",
                            userRole: userCredential.userRole,
                            token: token
                        });
                    }
                });
            }
            else res.send({code: 404, msg:"Incorrect Password!"});
        }
        catch (err) {
            res.send({ code: 401, msg: "Error logging in!" })
        }
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) res.send("An email is required.");

        // Check if user exists
        const user = await userModel.findOne({ email: email });
        if (!user) {
            res.send({code: 501, msg: "No account found with the provided email."});
        }

        if (!user.verified) {
            res.send({code: 502, msg: "Email hasn't been verified yet. Please check your inbox."});
        }
        // Send OTP email for password reset
        sendPasswordResetOtpEmail(user, res);
    } catch (error) {
        res.send({ code: 503, msg: error.msg });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPass } = req.body;
        
        if (password !== confirmPass) {
            return res.send({code: 701, msg: "Passwords do not match."});
        }

        // Check if user exists and is verified
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.send({code: 702, msg: "No account associated with this email."});
        }
        if (!user.verified) {
            return res.send({code: 703, msg:"Email hasn't been verified. Please check your inbox."});
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update user's password in the database
        await userModel.updateOne({ email: email }, { password: hashedPassword });

        res.send({
            code:700,
            msg: "Password has been reset successfully."
        });
    } catch (error) {
        res.send({
            code: 704,
            msg: error.msg
        });
    }
};

// send otp verification email
const sendOTPVerificationEmail = async ( userInput, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        // mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: userInput.email,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp)
        };

        // hash the otp
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new otpVerification({
            email: userInput.email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 120000,
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            msg: "Verification otp email sent",
            data: {
                userInput
            },
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            msg: error.msg,
        });
    }
};

const sendPasswordResetOtpEmail = async (user, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // Mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{otpCode}", otp)
        };

        // Hash the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Save OTP to database
        const otpRecord = new otpVerification({
            email: user.email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000  // 10 minutes
        });
        await otpRecord.save();

        // Send OTP email
        await transporter.sendMail(mailOptions);

        res.send({code: 500, msg: "OTP Sent!"});
    } catch (error) {
        res.json({ status: "FAILED", msg: error.msg });
    }
};


// Verify OTP email function
module.exports.verifyOTP = async (req, res) => {
    try {
        const userInput = req.body;

        if (!userInput.email || !userInput.otp) {
            throw new Error("Email and OTP are required");
        }

        // Find OTP records for the user by email
        const userOTPRecords = await otpVerification.find({email: userInput.email});

        // OTP record exists
        const expiresAt = userOTPRecords[0].expiresAt;
        const hashedOTP = userOTPRecords[0].otp;

        if (expiresAt < Date.now()) {
            // OTP has expired
            await otpVerification.deleteMany({email: userInput.email});
            return res.send({code: 101, msg: "Code has expired. Please request again."});
        }

        // Verify the OTP
        const validOTP = await bcrypt.compare(userInput.otp, hashedOTP);
        if (!validOTP) {
            console.log("invalid");
            return res.send({code: 102, msg: "Invalid OTP. Please try again."});
        }

        // OTP is valid, update user verification status
        const newUser = new userModel({
            username: userInput.username,
            password: userInput.password,
            email: userInput.email,
            userRole: userInput.userRole,
            verified: true
        });

        // Save new user and send OTP verification email
        await newUser.save()
            .then(async (result) => {
                res.send({code: 200 , msg: "Registered Successfully!"});
            })
            .catch((err) => {
                console.log(err);
                res.send({code: 500, msg: "Sign up error."});
            });

        await otpVerification.deleteMany({ email: userInput.email });

    } catch (error) {
        res.json({
            status: "FAILED",
            msg: error.msg,
        });
    }
};

// Verify OTP for reset password
module.exports.verifyOTPReset = async (req, res) => {
    try {
        const userInput = req.body;

        if (!userInput.email || !userInput.otp) {
            throw new Error("Email and OTP are required");
        }

        // Find OTP records for the user by email
        const userOTPRecords = await otpVerification.find({email: userInput.email});

        // OTP record exists
        const expiresAt = userOTPRecords[0].expiresAt;
        const hashedOTP = userOTPRecords[0].otp;

        if (expiresAt < Date.now()) {
            // OTP has expired
            await otpVerification.deleteMany({email: userInput.email});
            res.send({code: 601, msg: "Code has expired. Please request again."});
        }

        // Verify the OTP
        const validOTP = await bcrypt.compare(userInput.otp, hashedOTP);
        if (!validOTP) {
            res.send({code: 602, msg: "Invalid OTP. Please try again."});
        }
        else{
            res.send({code: 600, msg: "OTP Verified"});
        }

        await otpVerification.deleteMany({ email: userInput.email });

    } catch (error) {
        res.json({
            status: "FAILED",
            msg: error.msg,
        });
    }
};


module.exports.resendOTPVerificationEmail = async (req, res) => {
    try {

        const userInput = req.body;
        console.log(userInput.email);

        // Delete any expired OTP record
        await otpVerification.deleteMany({email: userInput.email});
        console.log("Now let's send");

        await sendOTPVerificationEmail(userInput,res);
    } catch (error) {
        res.json({
            status: "FAILED",
            msg: error.msg,
        });
    }
};