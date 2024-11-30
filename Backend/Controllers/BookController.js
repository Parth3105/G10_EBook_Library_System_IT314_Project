const cloudinary = require('../config/cloudinary');
const books = require('../Models/BookModel');
const userModel = require("../Models/UserModel");
const fs = require("fs");
const { uploadFileToDrive, setViewOnlyPermission } = require('../Utils/googleDrive');
const { oauth2Client, ensureValidAccessToken } = require('../config/googleOAuth');
module.exports.uploadBook = async (req, res) => {
    const { title, subtitle, author, coAuthors, genre, description, language, pages, amount } = req.body;

    // try {
    //     // Ensure a valid access token
    //     await ensureValidAccessToken();

    //     // (Existing code for file upload, book creation, etc.)
    // } catch (error) {
    //     console.error("Error uploading book:", error);
    //     return res.status(403).json({ msg: 'Error uploading book', error: error.message });
    // }

    try {
        // Check if required files (coverImage and bookFile) are provided
        if (!req.files || !req.files.coverImage || !req.files.bookFile) {
            return res.status(400).json({ msg: 'Both cover image and book file are required.' });
        }

        // Check if the book already exists
        const doesExist = await books.exists({ title: title, author: author });
        if (doesExist) {
            return res.send({ code: 402, msg: "Book already exists!!" });
        }

        // Upload cover image to Cloudinary (or use other storage for images)
        const coverImageResult = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
            folder: 'ebooks/covers'
        });

        // Delete the local cover image file after upload
        fs.unlinkSync(req.files.coverImage[0].path);

        const filePath = req.files.bookFile[0].path;
        const fileName = req.files.bookFile[0].originalname;

        // Upload PDF to Google Drive
        const fileId = await uploadFileToDrive(filePath, fileName);

        // Set view-only permission for the PDF file on Google Drive
        await setViewOnlyPermission(fileId);

        // Generate Google Drive view URL
        const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

        // Clean up local file
        fs.unlinkSync(filePath);

        // Format coAuthors as an array of objects with name and email if provided
        const formattedCoAuthors = coAuthors
            ? JSON.parse(coAuthors).map(({ name, email }) => ({ name, email }))
            : [];

        // Create a new book document in MongoDB
        const newBook = new books({
            title,
            subtitle,
            author,
            coAuthors: formattedCoAuthors,
            genre: genre ? genre.split(',') : [], // Convert comma-separated genre into array
            description,
            language,
            pages: pages ? parseInt(pages) : undefined,
            amount: amount ? parseFloat(amount) : undefined,
            coverImage: coverImageResult.secure_url,
            file: fileUrl, // Store the Google Drive link directly
        });

        await newBook.save();
        return res.send({ code: 401, msg: 'Book uploaded successfully', book: newBook });
    } catch (error) {
        console.error("Error uploading book:", error);
        return res.send({ code: 403, msg: 'Error uploading book', error: error });
    }
};

module.exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await books.findById(bookId);

        if (!book) {
            return res.status(404).json({
                code: 404,
                msg: 'Book not found'
            });
        }

        return res.status(200).json({
            code: 200,
            book
        });
    } catch (error) {
        console.error("Error fetching book:", error);
        return res.status(500).json({
            code: 500,
            msg: 'Error fetching book details',
            error: error.message
        });
    }
};