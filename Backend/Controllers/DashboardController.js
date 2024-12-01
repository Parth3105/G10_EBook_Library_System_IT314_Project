const bookPreferenceModel = require("../Models/BookPreferenceModel");
const readHistoryModel = require("../Models/ReadHistoryModel");
const userModel = require("../Models/UserModel");

module.exports.addToWishlist = async (req, res) => {
    try {
        const wishlistInfo = req.body;

        const existingWish = await bookPreferenceModel.findOne({
            username: wishlistInfo.username,
            bookId: wishlistInfo.bookId

        });

        if (existingWish) {
            return res.send({ code: 302, msg: "Book already in Wishlist!" });
        }

        const newWish = new bookPreferenceModel(
            {
                username: wishlistInfo.username,
                bookTitle: wishlistInfo.bookTitle,
                author: wishlistInfo.author,
                coverImage: wishlistInfo.coverImage,
                bookId: wishlistInfo.bookId
            }
        );

        await newWish.save()
            .then((result) => {
                res.send({ code: 300, msg: "Added to Wishlist!" });
            })
            .catch((err) => {
                res.send({ code: 301, msg: "Error in adding!!" });
                console.log(err);
            })
    }
    catch (err) {
        res.status(500).send(err);
    }
}

module.exports.rmFromWishlist = async (req, res) => {
    try {
        const wishlistInfo = req.body;

        const result = await bookPreferenceModel.deleteOne({
            username: wishlistInfo.username,
            bookId: wishlistInfo.bookId
        });

        if (result.deletedCount == 1) {
            console.log("Deleted Successfully!!");
            res.send({ code: 501, msg: "Deleted Successfully!!" });
        }
        else res.send({ code: 502, msg: "Entry not found!!" });
    }
    catch (err) {
        res.status(500).send(err);
    }
}

module.exports.getMyWishlist = async (req, res) => {
    try {
        const reqParams = req.params;
        const wishlistInfo = await bookPreferenceModel.find({ username: reqParams.username });

        res.send({ code: 300, wishlist: wishlistInfo });
    }
    catch (err) {
        res.send({ code: 301, msg: "Fetch error!" });
    }
}

module.exports.checkWishlist = async (req, res) => {
    try {
        const username = req.query.username;
        const bookId = req.query.bookId;
        const isExists = await bookPreferenceModel.findOne({ username: username, bookId: bookId });

        if (isExists === null) res.send({ code: 700, exists: false });
        else res.send({ code: 700, exists: true });
    }
    catch (err) {
        res.send({ code: 701, msg: "Fetch error!" });
        // console.log(err);
    }
}

module.exports.getMyProfile = async (req, res) => {
    try {
        const reqParams = req.params;
        const userProfile = await userModel.findOne({ username: reqParams.username });

        return res.send({ code: 100, user: userProfile });
    }
    catch (err) {
        return res.send({ code: 101, msg: "Fetch error!" });
    }
}

module.exports.rmHistory = async (req, res) => {
    try {
        const historyInfo = req.body;

        const result = await readHistoryModel.deleteOne({
            username: historyInfo.username,
            bookId: historyInfo.bookId
        });

        if (result.deletedCount == 1) res.send({ code: 600, msg: "Deleted Successfully!!" });
        else res.send({ code: 601, msg: "Entry not found!!" });
    }
    catch (err) {
        res.send({ code: 602, msg: "Request error!!!" });
        console.log(err);
    }
}

module.exports.getMyReadHistory = async (req, res) => {
    try {
        const reqParams = req.params;
        const readHistory = await readHistoryModel.find({ username: reqParams.username }).sort({ lastRead: -1 });

        res.send({ code: 200, history: readHistory });
    }
    catch (err) {
        res.send({ code: 201, msg: "Request error!" });
        console.log(err);
    }
}


/////  Only for testing purpose//////

module.exports.addToHistory = async (req, res) => {
    try {
        const historyInfo = req.body;

        const newHist = {
            username: historyInfo.username,
            bookTitle: historyInfo.bookTitle,
            author: historyInfo.author,
            coverImage: historyInfo.coverImage,
            bookId: historyInfo.bookId
        };

        const updateInfoIfExist = { $set: { lastRead: Date.now() } };

        const options = { upsert: true };

        await readHistoryModel.updateOne(newHist, updateInfoIfExist, options)
            .then((result) => {
                res.send({ code: 800, msg: "Added to history!" });
            })
            .catch((err) => {
                res.send({ code: 801, msg: "Error Saving!!!" });
                console.log(err);
            })
    }
    catch (err) {
        res.send({ code: 802, msg: "Request error!!!" });
        console.log(err);
    }
}