const { searchEBook } = require("../SearchController");
const Book = require("../../Models/BookModel");

jest.mock("../../Models/BookModel");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("searchEBook() method", () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    req = {
      query: {}, // Default request query
    };

    res = {
      status: jest.fn().mockReturnThis(), // Mock res.status chaining
      json: jest.fn(), // Mock res.json
    };
  });

  // Happy Path Tests
  it("should return books with default pagination and sorting when no query parameters are provided", async () => {
    // Arrange
    const mockBooks = [{ title: "Book 1" }, { title: "Book 2" }];
    Book.find.mockResolvedValue(mockBooks);
    Book.countDocuments.mockResolvedValue(2);

    // Act
    await searchEBook(req, res);

    // Assert
    expect(Book.find).toHaveBeenCalledWith({
      title: { $regex: "", $options: "i" },
      author: { $regex: "", $options: "i" },
      genre: {
        $in: [
          "Romance",
          "Fantasy",
          "Mystery",
          "Adventure",
          "Thriller",
          "Sci-fi",
        ],
      },
    });
    expect(Book.find().sort).toHaveBeenCalledWith({ createdAt: "asc" });
    expect(Book.find().skip).toHaveBeenCalledWith(0);
    expect(Book.find().limit).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      total: 2,
      page: 1,
      limit: 5,
      genres: [
        "Romance",
        "Fantasy",
        "Mystery",
        "Adventure",
        "Thriller",
        "Sci-fi",
      ],
      books: mockBooks,
    });
  });

  it("should apply search, author, genre, and language filters correctly", async () => {
    // Arrange
    req.query = {
      search: "Harry",
      author: "Rowling",
      genre: "Fantasy",
      language: "English",
    };
    const mockBooks = [{ title: "Harry Potter" }];
    Book.find.mockResolvedValue(mockBooks);
    Book.countDocuments.mockResolvedValue(1);

    // Act
    await searchEBook(req, res);

    // Assert
    expect(Book.find).toHaveBeenCalledWith({
      title: { $regex: "Harry", $options: "i" },
      author: { $regex: "Rowling", $options: "i" },
      genre: { $in: ["Fantasy"] },
      language: "English",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      total: 1,
      books: mockBooks,
    });
  });

  // Edge Case Tests
  it("should handle invalid page and limit query parameters gracefully", async () => {
    // Arrange
    req.query = { page: "invalid", limit: "invalid" };
    const mockBooks = [{ title: "Book 1" }];
    Book.find.mockResolvedValue(mockBooks);
    Book.countDocuments.mockResolvedValue(1);

    // Act
    await searchEBook(req, res);

    // Assert
    expect(Book.find().skip).toHaveBeenCalledWith(0); // Default skip
    expect(Book.find().limit).toHaveBeenCalledWith(5); // Default limit
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      total: 1,
      page: 1,
      limit: 5,
      books: mockBooks,
    });
  });

  it("should handle an empty result set correctly", async () => {
    // Arrange
    Book.find.mockResolvedValue([]); // No books
    Book.countDocuments.mockResolvedValue(0);

    // Act
    await searchEBook(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      total: 0,
      page: 1,
      limit: 5,
      books: [],
    });
  });
});
