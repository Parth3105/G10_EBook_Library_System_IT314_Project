const { forgotPassword } = require("../AuthController");
const userModel = require("../../Models/UserModel");
const nodemailer = require("nodemailer");

jest.mock("../../Models/UserModel");
jest.mock("nodemailer");

describe("forgotPassword() forgotPassword method", () => {
  let res;

  beforeEach(() => {
    res = {
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();  // Reset mocks after each test
  });

  describe("Happy Paths", () => {
    it("should send OTP email if user exists and is verified", async (done) => {
      // Arrange
      const req = { body: { email: "test@example.com" } };
      const user = { email: "test@example.com", verified: true };
      userModel.findOne.mockResolvedValue(user);
      const sendMailMock = jest.fn().mockResolvedValue(true);
      nodemailer.createTransport.mockReturnValue({
        sendMail: sendMailMock,
      });

      // Act
      await forgotPassword(req, res);
      
      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(sendMailMock).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({ code: 500, msg: "OTP Sent!" });

      done(); // Ensure async behavior is finished
    });
  });

  describe("Edge Cases", () => {
    it("should return an error if email is not provided", async () => {
      // Arrange
      const req = { body: {} };

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith("An email is required.");
    });

    it("should return an error if user does not exist", async () => {
      // Arrange
      const req = { body: { email: "nonexistent@example.com" } };
      userModel.findOne.mockResolvedValue(null);

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email: "nonexistent@example.com" });
      expect(res.send).toHaveBeenCalledWith({ code: 501, msg: "No account found with the provided email." });
    });

    it("should return an error if user is not verified", async () => {
      // Arrange
      const req = { body: { email: "unverified@example.com" } };
      const user = { email: "unverified@example.com", verified: false };
      userModel.findOne.mockResolvedValue(user);

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email: "unverified@example.com" });
      expect(res.send).toHaveBeenCalledWith({
        code: 502,
        msg: "Email hasn't been verified yet. Please check your inbox.",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      const req = { body: { email: "error@example.com" } };
      userModel.findOne.mockRejectedValue(new Error("Unexpected error"));

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        code: 503,
        msg: "Unexpected error",
      });
    });
  });
});
