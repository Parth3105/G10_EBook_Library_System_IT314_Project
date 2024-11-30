const Book = require('../Models/BookModel');

module.exports.searchEBook = async (req, res) => {
    try {
        // Retrieve query parameters
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const author = req.query.author || "";
        let genre = req.query.genre || "All";
        let language = req.query.language || "All";
        let sort = req.query.sort || "createdAt";

        // Define available genres for filtering
        const genreOptions = [
            "Romance",
            "Fantasy",
            "Mystery",
            "Adventure",
            "Thriller",
            "Sci-fi"
        ];

        // Set up genre filtering
        genre === "All"
            ? (genre = genreOptions)
            : (genre = req.query.genre.split(","));

        // Make genre filtering case-insensitive
        genre = genre.map((g) => new RegExp(`^${g}$`, "i"));

        // Set up sort order
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
        const sortBy = sort[1] ? { [sort[0]]: sort[1] } : { [sort[0]]: "asc" };

        // Construct the filter query
        const filter = {
            title: { $regex: search, $options: "i" },
            author: { $regex: author, $options: "i" },
            genre: { $in: genre }
        };
        if (language !== "All") filter.language = { $regex: `^${language}$`, $options: "i" };

        // Fetch books based on filters
        const books = await Book.find(filter)
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        // Get total document count for pagination
        const total = await Book.countDocuments(filter);

        // Prepare response
        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            genres: genreOptions,
            books
        };

        // Send response
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

module.exports.getRecentBooks = async (req, res) => {
    try {
        const books = await Book.find({})
            .sort({ createdAt: -1 }) // Sort by `createdAt` field in descending order
            .limit(4);              // Limit the result to the 4 most recent books
        res.send(books);
    } catch (error) {
        res.send("Error fetching recent books");
    }
};

module.exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find({})
            .sort({ createdAt: -1 })

        if (!books) {
            return res.status(404).json({
                code: 404,
                msg: "No books found"
            });
        }

        return res.status(200).json({
            code: 200,
            books: books
        });
    } catch (error) {
        console.error("Get Books Error:", error);
        return res.status(500).json({
            code: 500,
            msg: "Error fetching books",
            error: error.message
        });
    }
};