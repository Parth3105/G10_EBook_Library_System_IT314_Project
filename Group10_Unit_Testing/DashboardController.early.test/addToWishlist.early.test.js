// Unit tests for: addToWishlist

const { addToWishlist } = require("../DashboardController");
const bookPreferenceModel = require("../../Models/BookPreferenceModel");

jest.mock("../../Models/BookPreferenceModel");

describe("addToWishlist() addToWishlist method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testUser",
        bookTitle: "Test Book",
        author: "Test Author",
        coverImage: "testImage.jpg",
      },
    };

    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("Happy paths", () => {
    it("should add a new book to the wishlist successfully", async () => {
      // Arrange: Mock the save method to resolve successfully
      bookPreferenceModel.prototype.save = jest.fn().mockResolvedValue({});

      // Act: Call the addToWishlist function
      await addToWishlist(req, res);

      // Assert: Check if the response was sent with the correct message
      expect(res.send).toHaveBeenCalledWith("Added to Wishlist!");
    });
  });

  describe("Edge cases", () => {
    it("should handle errors during save operation", async () => {
      // Arrange: Mock the save method to reject with an error
      const error = new Error("Database error");
      bookPreferenceModel.prototype.save = jest.fn().mockRejectedValue(error);

      // Act: Call the addToWishlist function
      await addToWishlist(req, res);

      // Assert: Check if the response was sent with the error message
      expect(res.send).toHaveBeenCalledWith("Error in adding!!");
      expect(console.log).toHaveBeenCalledWith(error);
    });

    it("should handle missing fields in the request body", async () => {
      // Arrange: Remove a field from the request body
      delete req.body.bookTitle;

      // Act: Call the addToWishlist function
      await addToWishlist(req, res);

      // Assert: Check if the response was sent with an error status
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange: Mock the save method to throw an unexpected error
      const unexpectedError = new Error("Unexpected error");
      bookPreferenceModel.prototype.save = jest.fn().mockImplementation(() => {
        throw unexpectedError;
      });

      // Act: Call the addToWishlist function
      await addToWishlist(req, res);

      // Assert: Check if the response was sent with an error status
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(unexpectedError);
    });
  });
});

// End of unit tests for: addToWishlist
