// Unit tests for: rmHistory

const { rmHistory } = require("../DashboardController");
const readHistoryModel = require("../../Models/ReadHistoryModel");

jest.mock("../../Models/ReadHistoryModel");

describe("rmHistory() rmHistory method", () => {
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
    it("should delete a history entry successfully and send success message", async () => {
      // Arrange
      readHistoryModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      // Act
      await rmHistory(req, res);

      // Assert
      expect(readHistoryModel.deleteOne).toHaveBeenCalledWith({
        username: "testUser",
        bookTitle: "testBook",
        author: "testAuthor",
      });
      expect(res.send).toHaveBeenCalledWith("Deleted Successfully!!");
    });

    it('should return "Entry not found!!" if no entry is deleted', async () => {
      // Arrange
      readHistoryModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      // Act
      await rmHistory(req, res);

      // Assert
      expect(readHistoryModel.deleteOne).toHaveBeenCalledWith({
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
      readHistoryModel.deleteOne.mockRejectedValue(new Error(errorMessage));

      // Act
      await rmHistory(req, res);

      // Assert
      expect(readHistoryModel.deleteOne).toHaveBeenCalledWith({
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
      await rmHistory(req, res);

      // Assert
      expect(readHistoryModel.deleteOne).toHaveBeenCalledWith({
        username: undefined,
        bookTitle: undefined,
        author: undefined,
      });
      expect(res.send).toHaveBeenCalledWith("Entry not found!!");
    });

    it("should handle null values in request body", async () => {
      // Arrange
      req.body = {
        username: null,
        bookTitle: null,
        author: null,
      };

      // Act
      await rmHistory(req, res);

      // Assert
      expect(readHistoryModel.deleteOne).toHaveBeenCalledWith({
        username: null,
        bookTitle: null,
        author: null,
      });
      expect(res.send).toHaveBeenCalledWith("Entry not found!!");
    });
  });
});

// End of unit tests for: rmHistory
