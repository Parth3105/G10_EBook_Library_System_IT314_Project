// Unit tests for: rmFromWishlist

const { rmFromWishlist } = require("../DashboardController");
const bookPreferenceModel = require("../../Models/BookPreferenceModel");

jest.mock("../../Models/BookPreferenceModel");

describe("rmFromWishlist() rmFromWishlist method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testUser",
        bookTitle: "testBook",
        author: "testAuthor",
      },
    };

    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("Happy Paths", () => {
    it("should delete the wishlist entry successfully and send success message", async () => {
      // Arrange
      bookPreferenceModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      // Act
      await rmFromWishlist(req, res);

      // Assert
      expect(bookPreferenceModel.deleteOne).toHaveBeenCalledWith({
        username: "testUser",
        bookTitle: "testBook",
        author: "testAuthor",
      });
      expect(res.send).toHaveBeenCalledWith("Deleted Successfully!!");
    });

    it('should send "Entry not found!!" if no entry is deleted', async () => {
      // Arrange
      bookPreferenceModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      // Act
      await rmFromWishlist(req, res);

      // Assert
      expect(bookPreferenceModel.deleteOne).toHaveBeenCalledWith({
        username: "testUser",
        bookTitle: "testBook",
        author: "testAuthor",
      });
      expect(res.send).toHaveBeenCalledWith("Entry not found!!");
    });
  });

  describe("Edge Cases", () => {
    it("should handle database errors gracefully", async () => {
      // Arrange
      const errorMessage = "Database error";
      bookPreferenceModel.deleteOne.mockRejectedValue(new Error(errorMessage));

      // Act
      await rmFromWishlist(req, res);

      // Assert
      expect(bookPreferenceModel.deleteOne).toHaveBeenCalledWith({
        username: "testUser",
        bookTitle: "testBook",
        author: "testAuthor",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle missing fields in request body", async () => {
      // Arrange
      req.body = {}; // Empty body

      // Act
      await rmFromWishlist(req, res);

      // Assert
      expect(bookPreferenceModel.deleteOne).toHaveBeenCalledWith({
        username: undefined,
        bookTitle: undefined,
        author: undefined,
      });
      expect(res.send).toHaveBeenCalledWith("Entry not found!!");
    });
  });
});

// End of unit tests for: rmFromWishlist
