// Unit tests for: loginUser

const { loginUser } = require("../../Controllers/AuthController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("../../Utils/emailTemplates");

// Mock the UserModel manually if Jest can't resolve the module
jest.mock("../../Models/UserModel", () => ({
  findOne: jest.fn(),
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("loginUser() loginUser method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        password: "testpassword",
      },
    };
    res = {
      send: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should successfully log in a user with correct credentials", async () => {
      // Mock user data
      const userCredential = {
        _id: "userId123",
        username: "testuser",
        password: "hashedpassword",
        userRole: "user",
      };

      // Mock userModel to return a user
      require("../../Models/UserModel").findOne.mockResolvedValue(userCredential);

      // Mock bcrypt to return true for password comparison
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt to return a token
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, "mockedToken");
      });

      await loginUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 200,
        msg: "Login Successfull",
        userRole: "user",
        token: "mockedToken",
      });
    });
  });

  describe("Edge Cases", () => {
    it('should return "User not found!" if the user does not exist', async () => {
      // Mock userModel to return null
      require("../../Models/UserModel").findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 400,
        msg: "User not found!",
      });
    });

    it('should return "Incorrect Password!" if the password is incorrect', async () => {
      // Mock user data
      const userCredential = {
        _id: "userId123",
        username: "testuser",
        password: "hashedpassword",
      };

      // Mock userModel to return a user
      require("../../Models/UserModel").findOne.mockResolvedValue(userCredential);

      // Mock bcrypt to return false for password comparison
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 404,
        msg: "Incorrect Password!",
      });
    });

    it('should return "Error logging in!" if jwt.sign fails', async () => {
      // Mock user data
      const userCredential = {
        _id: "userId123",
        username: "testuser",
        password: "hashedpassword",
      };

      // Mock userModel to return a user
      require("../../Models/UserModel").findOne.mockResolvedValue(userCredential);

      // Mock bcrypt to return true for password comparison
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt to simulate an error
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(new Error("JWT Error"), null);
      });

      await loginUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        code: 400,
        msg: "Error logging in!",
      });
    });
  });
});

// End of unit tests for: loginUser
