// Unit tests for: getMyProfile

const { getMyProfile } = require("../DashboardController");
const userModel = require("../../Models/UserModel");

jest.mock("../../Models/UserModel");

describe("getMyProfile() getMyProfile method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        username: "testuser",
      },
    };
    res = {
      send: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should return user profile when user exists", async () => {
      // Arrange
      const mockUserProfile = { username: "testuser", name: "Test User" };
      userModel.findOne.mockResolvedValue(mockUserProfile);

      // Act
      await getMyProfile(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(res.send).toHaveBeenCalledWith({
        code: 100,
        user: mockUserProfile,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return an error code when user does not exist", async () => {
      // Arrange
      userModel.findOne.mockResolvedValue(null);

      // Act
      await getMyProfile(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(res.send).toHaveBeenCalledWith({ code: 100, user: null });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const mockError = new Error("Database error");
      userModel.findOne.mockRejectedValue(mockError);

      // Act
      await getMyProfile(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(res.send).toHaveBeenCalledWith({ code: 101, msg: "Fetch error!" });
    });

    it("should handle missing username parameter", async () => {
      // Arrange
      req.params.username = undefined;

      // Act
      await getMyProfile(req, res);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ username: undefined });
      expect(res.send).toHaveBeenCalledWith({ code: 100, user: null });
    });
  });
});

// End of unit tests for: getMyProfile
