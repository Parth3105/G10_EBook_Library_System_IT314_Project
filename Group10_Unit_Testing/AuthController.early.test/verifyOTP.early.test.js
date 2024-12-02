// Unit tests for: verifyOTP

const { verifyOTP } = require("../AuthController");
const userModel = require("../../Models/UserModel");
const bcrypt = require("bcryptjs");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("../../Utils/emailTemplates");
const otpVerification = require("../../Models/otpVerification");
jest.mock("../../Models/otpVerification");
jest.mock("../../Models/UserModel");
jest.mock("bcryptjs");

describe("verifyOTP() verifyOTP method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should verify OTP and register user successfully", async () => {
      // Arrange
      const req = {
        body: {
          email: "test@example.com",
          otp: "1234",
          username: "testuser",
          password: "password123",
          userRole: "user",
        },
      };
      const res = {
        send: jest.fn(),
      };
      const otpRecord = {
        expiresAt: Date.now() + 10000,
        otp: "hashedOTP",
      };
      otpVerification.find.mockResolvedValue([otpRecord]);
      bcrypt.compare.mockResolvedValue(true);
      userModel.prototype.save = jest.fn().mockResolvedValue({});

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 200,
        msg: "Registered Successfully!",
      });
      expect(otpVerification.deleteMany).toHaveBeenCalledWith({
        email: req.body.email,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return error if email or OTP is missing", async () => {
      // Arrange
      const req = {
        body: {
          email: "",
          otp: "",
        },
      };
      const res = {
        json: jest.fn(),
      };

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: "FAILED",
        msg: "Email and OTP are required",
      });
    });

    it("should return error if OTP has expired", async () => {
      // Arrange
      const req = {
        body: {
          email: "test@example.com",
          otp: "1234",
        },
      };
      const res = {
        send: jest.fn(),
      };
      const otpRecord = {
        expiresAt: Date.now() - 10000,
        otp: "hashedOTP",
      };
      otpVerification.find.mockResolvedValue([otpRecord]);

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 101,
        msg: "Code has expired. Please request again.",
      });
      expect(otpVerification.deleteMany).toHaveBeenCalledWith({
        email: req.body.email,
      });
    });

    it("should return error if OTP is invalid", async () => {
      // Arrange
      const req = {
        body: {
          email: "test@example.com",
          otp: "1234",
        },
      };
      const res = {
        send: jest.fn(),
      };
      const otpRecord = {
        expiresAt: Date.now() + 10000,
        otp: "hashedOTP",
      };
      otpVerification.find.mockResolvedValue([otpRecord]);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 102,
        msg: "Invalid OTP. Please try again.",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      const req = {
        body: {
          email: "test@example.com",
          otp: "1234",
        },
      };
      const res = {
        json: jest.fn(),
      };
      otpVerification.find.mockRejectedValue(new Error("Unexpected error"));

      // Act
      await verifyOTP(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: "FAILED",
        msg: "Unexpected error",
      });
    });
  });
});

// End of unit tests for: verifyOTP
