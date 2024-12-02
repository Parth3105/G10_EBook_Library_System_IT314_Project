const { registerUser } = require("../AuthController");
const userModel = require("../../../Backend/Models/UserModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const validate = require("../../../Backend/utils/validateuser");
const otpVerification = require("../../../Backend/Models/otpVerification");

jest.mock("../../../Backend/Models/UserModel");
jest.mock("bcryptjs");
jest.mock("nodemailer");
jest.mock("../../../Backend/utils/validateuser");
jest.mock("../../../Backend/Models/otpVerification");

describe("registerUser() Unit Tests", () => {
  let req, res, transporterMock;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
        confirmPassword: "password123",
        userRole: "user",
      },
    };

    res = {
      send: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    transporterMock = {
      sendMail: jest.fn().mockResolvedValue(true),
    };

    nodemailer.createTransport.mockReturnValue(transporterMock);
  });

  describe("Happy Paths", () => {
    it("should register a new user successfully", async () => {
      userModel.findOne.mockResolvedValueOnce(null); // No existing user (email check)
      userModel.findOne.mockResolvedValueOnce(null); // No existing user (username check)
      bcrypt.hash.mockResolvedValue("hashedPassword"); // Mock password hash
      validate.mockReturnValue({ error: null }); // No validation errors
      otpVerification.create.mockResolvedValue(true); // OTP created successfully

      console.log("Before calling registerUser");

      await registerUser(req, res);

      console.log("After calling registerUser");

      expect(userModel.findOne).toHaveBeenCalledTimes(2); // Email and username checks
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(res.json).toHaveBeenCalledWith({
        status: "PENDING",
        msg: "Verification otp email sent",
        data: {
          userInput: expect.objectContaining({
            username: req.body.username,
            email: req.body.email,
          }),
        },
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return error if email already exists", async () => {
      userModel.findOne.mockResolvedValue({ email: "test@example.com" });

      await registerUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 400,
        msg: "User with this email already exists.",
      });
    });

    it("should return error if username already exists", async () => {
      userModel.findOne
        .mockResolvedValueOnce(null) // For email check
        .mockResolvedValueOnce({ username: "testuser" }); // For username check

      await registerUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 401,
        msg: "User with this username already exists. Please enter a unique one.",
      });
    });

    it("should return error if password length is invalid", async () => {
      req.body.password = "short";
      req.body.confirmPassword = "short";
      userModel.findOne.mockResolvedValue(null); // No existing user

      await registerUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 401,
        msg: "Password must be between 8 and 12 characters long.",
      });
    });

    it("should return error if passwords do not match", async () => {
      req.body.confirmPassword = "differentPassword";
      userModel.findOne.mockResolvedValue(null); // No existing user

      await registerUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 402,
        msg: "Passwords do not match.",
      });
    });

    it("should return validation error if input is invalid", async () => {
      validate.mockReturnValue({
        error: { details: [{ msg: "Invalid input" }] },
      });
      userModel.findOne.mockResolvedValue(null); // No existing user

      await registerUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 403,
        msg: "Invalid input",
      });
    });

    it("should handle server errors gracefully", async () => {
      userModel.findOne.mockRejectedValue(new Error("Database error"));

      await registerUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 404,
        msg: "Server error during registration.",
      });
    });
  });
});
