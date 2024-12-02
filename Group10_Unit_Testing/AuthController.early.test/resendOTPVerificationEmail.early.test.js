// Unit tests for: resendOTPVerificationEmail

const { resendOTPVerificationEmail } = require("../AuthController");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("../../Utils/emailTemplates");
const otpVerification = require("../../Models/otpVerification");
const {
  sendOTPVerificationEmail,
} = require("../AuthController");
jest.mock("../../Models/otpVerification");
jest.mock("../AuthController", () => ({
  ...jest.requireActual("../AuthController"),
  sendOTPVerificationEmail: jest.fn(),
}));

describe("resendOTPVerificationEmail() resendOTPVerificationEmail method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
      },
    };
    res = {
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should delete expired OTP records and send a new OTP email", async () => {
      // Arrange
      otpVerification.deleteMany.mockResolvedValueOnce({});
      sendOTPVerificationEmail.mockResolvedValueOnce({});

      // Act
      await resendOTPVerificationEmail(req, res);

      // Assert
      expect(otpVerification.deleteMany).toHaveBeenCalledWith({
        email: req.body.email,
      });
      expect(sendOTPVerificationEmail).toHaveBeenCalledWith(req.body, res);
    });
  });

  describe("Edge Cases", () => {
    it("should handle errors during OTP deletion gracefully", async () => {
      // Arrange
      const errorMessage = "Database error";
      otpVerification.deleteMany.mockRejectedValueOnce(new Error(errorMessage));

      // Act
      await resendOTPVerificationEmail(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: "FAILED",
        msg: errorMessage,
      });
    });

    it("should handle errors during OTP email sending gracefully", async () => {
      // Arrange
      otpVerification.deleteMany.mockResolvedValueOnce({});
      const errorMessage = "Email service error";
      sendOTPVerificationEmail.mockRejectedValueOnce(new Error(errorMessage));

      // Act
      await resendOTPVerificationEmail(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: "FAILED",
        msg: errorMessage,
      });
    });

    it("should handle missing email in request body", async () => {
      // Arrange
      req.body.email = undefined;

      // Act
      await resendOTPVerificationEmail(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        status: "FAILED",
        msg: "Email is required",
      });
    });
  });
});

// End of unit tests for: resendOTPVerificationEmail
