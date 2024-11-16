const express = require(`express`);
const router = express.Router();
const authController = require("../Controllers/AuthController");
const dashboardController = require("../Controllers/DashboardController");
const searchController = require("../Controllers/SearchController");
const bookController = require("../Controllers/BookController");
const { upload } = require('../Utils/fileUpload');

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/resetPass/verifyOTP", authController.verifyOTPReset);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/resendOTP", authController.resendOTPVerificationEmail);
router.post("/addToWishlist", dashboardController.addToWishlist);
router.get("/getWishlist/:username", dashboardController.getMyWishlist);
router.post("/rmFromWishlist", dashboardController.rmFromWishlist);
router.get("/readHistory/:username", dashboardController.getMyReadHistory);
router.post("/rmhistory", dashboardController.rmHistory);
router.get("/myProfile/:username", dashboardController.getMyProfile);
router.get("/getRecentBooks", searchController.getRecentBooks);
router.get("/getAllBooks", searchController.getBooks);

// router.post('/addHistory', dashboardController.addToHistory); // Just for testing not actual route
router.get('/searchBook', searchController.searchEBook);
router.post('/upload', upload.fields([{ name: 'coverImage' }, { name: 'bookFile' }]), bookController.uploadBook);


module.exports = router;
