// Unit tests for: verifyOTPReset

const { verifyOTPReset } = require("../AuthController");
const bcrypt = require("bcryptjs");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("../../Utils/emailTemplates");
const otpVerification = require("../../Models/otpVerification");
jest.mock("../../Models/otpVerification");
jest.mock("bcryptjs");

describe("verifyOTPReset() verifyOTPReset method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        otp: "1234",
      },
    };

    res = {
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should verify OTP successfully and return code 600", async () => {
      // Arrange
      const hashedOTP = "hashedOTP";
      otpVerification.find.mockResolvedValue([
        { expiresAt: Date.now() + 10000, otp: hashedOTP },
      ]);
      bcrypt.compare.mockResolvedValue(true);

      // Act
      await verifyOTPReset(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({ code: 600, msg: "OTP Verified" });
      expect(otpVerification.deleteMany).toHaveBeenCalledWith({
        email: req.body.email,
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return error if email or OTP is missing", async () => {
      // Arrange
      req.body.email = "";

      // Act
      await verifyOTPReset(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: "FAILED",
        msg: "Email and OTP are required",
      });
    });

    it("should return error if OTP has expired", async () => {
      // Arrange
      otpVerification.find.mockResolvedValue([
        { expiresAt: Date.now() - 10000, otp: "hashedOTP" },
      ]);

      // Act
      await verifyOTPReset(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 601,
        msg: "Code has expired. Please request again.",
      });
      expect(otpVerification.deleteMany).toHaveBeenCalledWith({
        email: req.body.email,
      });
    });

    it("should return error if OTP is invalid", async () => {
      // Arrange
      const hashedOTP = "hashedOTP";
      otpVerification.find.mockResolvedValue([
        { expiresAt: Date.now() + 10000, otp: hashedOTP },
      ]);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await verifyOTPReset(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 602,
        msg: "Invalid OTP. Please try again.",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      otpVerification.find.mockRejectedValue(new Error("Unexpected error"));

      // Act
      await verifyOTPReset(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: "FAILED",
        msg: "Unexpected error",
      });
    });
  });
});

// End of unit tests for: verifyOTPReset
