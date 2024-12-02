const { uploadBook } = require("../BookController");
const cloudinary = require("../../config/cloudinary");
const books = require("../../Models/BookModel");
const fs = require("fs");
const {
  uploadFileToDrive,
  setViewOnlyPermission,
} = require("../../Utils/googleDrive");

jest.mock("../../config/cloudinary");
jest.mock("../../Models/BookModel");
jest.mock("fs");
jest.mock("../../Utils/googleDrive");

describe("uploadBook() method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: "Test Book",
        subtitle: "A Subtitle",
        author: "Author Name",
        coAuthors: JSON.stringify([
          { name: "CoAuthor", email: "coauthor@example.com" },
        ]),
        genre: "Fiction,Adventure",
        description: "A great book",
        language: "English",
        pages: "300",
        amount: "19.99",
      },
      files: {
        coverImage: [{ path: "path/to/coverImage.jpg" }],
        bookFile: [
          { path: "path/to/bookFile.pdf", originalname: "bookFile.pdf" },
        ],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    cloudinary.uploader.upload.mockResolvedValue({
      secure_url: "http://cloudinary.com/coverImage.jpg",
    });
    uploadFileToDrive.mockResolvedValue("googleDriveFileId");
    setViewOnlyPermission.mockResolvedValue();
    fs.unlinkSync.mockImplementation(() => {});
    books.prototype.save = jest.fn().mockResolvedValue();
  });

  describe("Happy Paths", () => {
    it("should upload a book successfully", async () => {
      await uploadBook(req, res);

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        "path/to/coverImage.jpg",
        { folder: "ebooks/covers" }
      );
      expect(uploadFileToDrive).toHaveBeenCalledWith(
        "path/to/bookFile.pdf",
        "bookFile.pdf"
      );
      expect(setViewOnlyPermission).toHaveBeenCalledWith("googleDriveFileId");
      expect(fs.unlinkSync).toHaveBeenCalledWith("path/to/coverImage.jpg");
      expect(fs.unlinkSync).toHaveBeenCalledWith("path/to/bookFile.pdf");
      expect(books.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Book uploaded successfully" })
      );
    });
  });

  describe("Edge Cases", () => {
    it("should return 400 if coverImage or bookFile is missing", async () => {
      req.files.coverImage = null;
      await uploadBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Both cover image and book file are required.",
      });

      req.files.coverImage = [{ path: "path/to/coverImage.jpg" }];
      req.files.bookFile = null;
      await uploadBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Both cover image and book file are required.",
      });
    });

    it("should handle undefined pages and amount gracefully", async () => {
      req.body.pages = undefined;
      req.body.amount = undefined;
      await uploadBook(req, res);

      expect(books.prototype.save).toHaveBeenCalledWith(
        expect.objectContaining({
          pages: undefined,
          amount: undefined,
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle invalid coAuthors format gracefully", async () => {
      req.body.coAuthors = "Invalid JSON";
      await uploadBook(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error uploading book" })
      );
    });

    it("should handle errors during cloudinary upload", async () => {
      cloudinary.uploader.upload.mockRejectedValue(new Error("Cloudinary error"));
      await uploadBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error uploading book" })
      );
    });

    it("should handle errors during Google Drive upload", async () => {
      uploadFileToDrive.mockRejectedValue(new Error("Google Drive error"));
      await uploadBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error uploading book" })
      );
    });

    it("should handle errors during setting Google Drive permissions", async () => {
      setViewOnlyPermission.mockRejectedValue(new Error("Permission error"));
      await uploadBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error uploading book" })
      );
    });

    it("should handle errors during book save to database", async () => {
      books.prototype.save.mockRejectedValue(new Error("Database error"));
      await uploadBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error uploading book" })
      );
    });
  });

  describe("Branch Coverage", () => {
    it("should handle empty genre gracefully", async () => {
      req.body.genre = undefined;
      await uploadBook(req, res);

      expect(books.prototype.save).toHaveBeenCalledWith(
        expect.objectContaining({
          genre: [],
        })
      );
    });

    it("should handle valid but empty coAuthors array", async () => {
      req.body.coAuthors = JSON.stringify([]);
      await uploadBook(req, res);

      expect(books.prototype.save).toHaveBeenCalledWith(
        expect.objectContaining({
          coAuthors: [],
        })
      );
    });
  });
});
