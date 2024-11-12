const jwt = require("jsonwebtoken"); //jwt tokens are required for protected routes...
const userModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs"); // bcryptjs is used in node to encrypt the passwords
const nodemailer = require("nodemailer"); // nodemailer
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } = require("../Utils/emailTemplates"); // email templates
const otpVerification = require("../Models/otpVerification");
const validate = require('../utils/validateuser');

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
            return res.status(400).send("User with this email already exists.");
        }

        // Check if username already exists
        const existingUsername = await userModel.findOne({ username: registerInput.username });
        if (existingUsername) {
            return res.status(400).send("User with this username already exists. Please enter a unique one.");
        }

        // Validate password length
        if (registerInput.password.length < 8 || registerInput.password.length > 12) {
            return res.status(400).send("Password must be between 8 and 12 characters long.");
        }

        // Check if password and confirmPassword match
        if (registerInput.password !== registerInput.confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        // Validate other inputs using Joi (assuming validate function exists)
        const { error } = validate(registerInput);
        if (error) {
            return res.status(400).send(error.details[0].message);  // Send the validation error message
        }

        // Hash password
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(registerInput.password, saltRounds);

        // Create a new user
        const newUser = new userModel({
            username: registerInput.username,
            password: hashedPass,
            email: registerInput.email,
            verified: false
        });

        // Save new user and send OTP verification email
        newUser.save()
            .then((result) => {
                sendOTPVerificationEmail(result, res);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send("Sign up error.");
            });
    } catch (err) {
        console.log("User Creation Error: " + err);
        res.status(500).send("Server error during registration.");
    }
};


// function controls the login of user.
module.exports.loginUser = async (req, res) => {
    const loginInput = req.body;
    const userCredential = await userModel.findOne({ username: loginInput.username });

    if (userCredential == null) {
        res.send("User doesn't exist!!!");
    }
    else {
        try {
            const isMatch = await bcrypt.compare(loginInput.password, userCredential.password); // Compare the input plain-text password with stored hashed-password.
            if (isMatch) {
                jwt.sign({ userID: userCredential._id }, process.env.JWT_KEY, { expiresIn: "4h" }, (err, token) => {
                    if (err) {
                        res.send({ msg: "Error logging in!" });
                    }
                    else {
                        res.send({
                            msg: "Login Successfull",
                            token: token
                        });
                    }
                });
            }
            else res.send("Password Incorrect!");
        }
        catch (err) {
            console.log(err);
            res.send("Login Error!")
        }
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) res.send("An email is required.");

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            res.send("No account found with the provided email.");
        }

        if (!user.verified) {
            res.send("Email hasn't been verified yet. Please check your inbox.");
        }

        // Send OTP email for password reset
        await sendPasswordResetOtpEmail(user, res);
    } catch (error) {
        res.status(400).json({ status: "FAILED", message: error.message });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        // Check if user exists and is verified
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send("No account associated with this email.");
        }
        if (!user.verified) {
            return res.status(400).send("Email hasn't been verified. Please check your inbox.");
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update user's password in the database
        await userModel.updateOne({ email }, { password: hashedPassword });

        res.json({
            status: "SUCCESS",
            message: "Password has been reset successfully."
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
};

// send otp verification email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        // mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp)
        };

        // hash the otp
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new otpVerification({
            email: email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 120000,
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
                userId: _id,
                email,
            },
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
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
            userId: user._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000  // 10 minutes
        });
        await otpRecord.save();

        // Send OTP email
        await transporter.sendMail(mailOptions);

        res.json({
            status: "PENDING",
            message: "Password reset OTP email sent",
            data: {
                userId: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        res.json({ status: "FAILED", message: error.message });
    }
};


// Verify OTP email function
module.exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new Error("Email and OTP are required");
        }

        // Find OTP records for the user by email
        const userOTPRecords = await otpVerification.find({ email });

        if (userOTPRecords.length <= 0) {
            throw new Error("Account record doesn't exist or has been verified already. Please sign up or log in.");
        }

        // OTP record exists
        const expiresAt = userOTPRecords[0].expiresAt;
        const hashedOTP = userOTPRecords[0].otp;

        if (expiresAt < Date.now()) {
            // OTP has expired
            await otpVerification.deleteMany({ email });
            throw new Error("Code has expired. Please request again.");
        }

        // Verify the OTP
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            throw new Error("Invalid OTP. Please try again.");
        }

        // OTP is valid, update user verification status
        await userModel.updateOne({ email }, { verified: true });

        await otpVerification.deleteMany({ email });

        res.json({
            status: "VERIFIED",
            message: "OTP verified successfully."
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
};

module.exports.resendOTPVerificationEmail = async (req, res) => {
    try {

        const { _id, email } = req.body;

        // Validate email
        if (!email) {
            return res.json({
                status: "FAILED",
                message: "Email is required",
            });
        }

        // Find the existing OTP record for the user
        const existingOTP = await otpVerification.findOne({ email });

        // Check if an OTP exists and if it has expired
        if (existingOTP && existingOTP.expiresAt > Date.now()) {
            return res.json({
                status: "PENDING",
                message: "Please wait for the existing OTP to expire before requesting a new one.",
                data: {
                    userId: _id,
                    email,
                },
            });
        }

        // Delete any expired OTP record
        await otpVerification.deleteMany({ email });

        // Generate a new OTP
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Resend Verification OTP",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp)
        };

        // Hash the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Create new OTP verification record with a new expiration time
        const newOTPVerification = new otpVerification({
            email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 120000, // Expires in 2 minutes
        });

        // Save OTP record and send email
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        res.json({
            status: "PENDING",
            message: "A new OTP has been sent to your email",
            data: {
                userId: _id,
                email,
            },
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
};
