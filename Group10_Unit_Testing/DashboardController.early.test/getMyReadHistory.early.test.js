const { getMyReadHistory } = require("../DashboardController");
const readHistoryModel = require("../../Models/ReadHistoryModel");

jest.mock("../../Models/ReadHistoryModel");

describe("getMyReadHistory() method", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { username: "testuser" } };
    res = {
      send: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should return read history sorted by lastRead in descending order", async () => {
      // Arrange: Mock the readHistoryModel to return a sorted list
      const mockHistory = [
        { bookTitle: "Book A", lastRead: new Date("2023-10-01") },
        { bookTitle: "Book B", lastRead: new Date("2023-09-01") },
      ];
      readHistoryModel.find.mockResolvedValue(mockHistory);

      // Act: Call the function
      await getMyReadHistory(req, res);

      // Assert: Check if the response is correct
      expect(res.send).toHaveBeenCalledWith({
        code: 200,
        history: mockHistory,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return an empty history if no records are found", async () => {
      // Arrange: Mock the readHistoryModel to return an empty list
      readHistoryModel.find.mockResolvedValue([]);

      // Act: Call the function
      await getMyReadHistory(req, res);

      // Assert: Check if the response is correct
      expect(res.send).toHaveBeenCalledWith({ code: 200, history: [] });
    });


    it("should handle missing username parameter gracefully", async () => {
      // Arrange: Set req.params to an empty object (missing username)
      req.params = {};

      // Act: Call the function
      await getMyReadHistory(req, res);

      // Assert: Check if the error response is correct
      expect(res.send).toHaveBeenCalledWith({ code: 201, msg: "Fetch error!" });
    });
  });
});
