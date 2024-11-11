const express = require(`express`);
const router = express.Router();
const authController = require("../Controllers/AuthController");

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/verifyOTP', authController.verifyOTP);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/resendOTP', authController.resendOTPVerificationEmail);

module.exports = router;