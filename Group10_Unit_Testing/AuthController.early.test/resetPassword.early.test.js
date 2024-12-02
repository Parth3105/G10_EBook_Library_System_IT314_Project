const { resetPassword } = require("../AuthController");
const userModel = require("../../Models/UserModel");
const bcrypt = require("bcryptjs");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("../../Utils/emailTemplates");

jest.mock("../../Models/UserModel");
jest.mock("bcryptjs");

describe("resetPassword() resetPassword method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "newPassword123",
        confirmPass: "newPassword123",
      },
    };

    res = {
      send: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should reset the password successfully when inputs are valid", async () => {
      // Arrange
      const user = { email: "test@example.com", verified: true };
      userModel.findOne.mockResolvedValue(user);
      bcrypt.hash.mockResolvedValue("hashedPassword");

      // Act
      await resetPassword(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { email: "test@example.com" },
        { password: "hashedPassword" }
      );
      expect(res.send).toHaveBeenCalledWith({
        code: 700,
        msg: "Password has been reset successfully.",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return an error if passwords do not match", async () => {
      // Arrange
      req.body.confirmPass = "differentPassword";

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 701,
        msg: "Passwords do not match.",
      });
    });

    it("should return an error if no user is found with the given email", async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);

      // Act
      await resetPassword(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(res.send).toHaveBeenCalledWith({
        code: 702,
        msg: "No account associated with this email.",
      });
    });

    it("should return an error if the user email is not verified", async () => {
      // Arrange
      const user = { email: "test@example.com", verified: false };
      userModel.findOne.mockResolvedValue(user);

      // Act
      await resetPassword(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(res.send).toHaveBeenCalledWith({
        code: 703,
        msg: "Email hasn't been verified. Please check your inbox.",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      userModel.findOne.mockRejectedValue(new Error("Unexpected error"));

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 704,
        msg: "Unexpected error",
      });
    });
  });
});
