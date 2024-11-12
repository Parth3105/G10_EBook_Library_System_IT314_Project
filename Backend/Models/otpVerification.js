const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpVerificationSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true 
        },
        otp: { 
            type: String, 
            required: true 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        expiresAt: { 
            type: Date, 
            required: true 
        },
    }
);

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);