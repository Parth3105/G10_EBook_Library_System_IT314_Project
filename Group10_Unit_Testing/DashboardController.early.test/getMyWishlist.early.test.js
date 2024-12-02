// Unit tests for: getMyWishlist
const { getMyWishlist } = require("../DashboardController");
const bookPreferenceModel = require("../../Models/BookPreferenceModel");

jest.mock("../../Models/BookPreferenceModel");

describe("getMyWishlist() getMyWishlist method", () => {
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
    it("should return wishlist for a valid user", async () => {
      // Arrange: Mock the bookPreferenceModel to return a sample wishlist
      const sampleWishlist = [
        { bookTitle: "Book 1", author: "Author 1", coverImage: "Image1.jpg" },
        { bookTitle: "Book 2", author: "Author 2", coverImage: "Image2.jpg" },
      ];
      bookPreferenceModel.find.mockResolvedValue(sampleWishlist);

      // Act: Call the getMyWishlist function
      await getMyWishlist(req, res);

      // Assert: Check if the response is as expected
      expect(res.send).toHaveBeenCalledWith({
        code: 300,
        wishlist: sampleWishlist,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return an empty wishlist if no books are found for the user", async () => {
      // Arrange: Mock the bookPreferenceModel to return an empty array
      bookPreferenceModel.find.mockResolvedValue([]);

      // Act: Call the getMyWishlist function
      await getMyWishlist(req, res);

      // Assert: Check if the response is as expected
      expect(res.send).toHaveBeenCalledWith({ code: 300, wishlist: [] });
    });

    it("should handle errors gracefully and return a fetch error message", async () => {
      // Arrange: Mock the bookPreferenceModel to throw an error
      bookPreferenceModel.find.mockRejectedValue(new Error("Database error"));

      // Act: Call the getMyWishlist function
      await getMyWishlist(req, res);

      // Assert: Check if the response is as expected
      expect(res.send).toHaveBeenCalledWith({ code: 301, msg: "Fetch error!" });
    });

    it("should handle missing username parameter gracefully", async () => {
      // Arrange: Set req.params.username to undefined
      req.params.username = undefined;

      // Act: Call the getMyWishlist function
      await getMyWishlist(req, res);

      // Assert: Check if the response is as expected
      expect(res.send).toHaveBeenCalledWith({ code: 301, msg: "Fetch error!" });
    });
  });
});

// End of unit tests for: getMyWishlist
