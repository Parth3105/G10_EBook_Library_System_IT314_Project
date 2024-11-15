const bookPreferenceModel = require("../Models/BookPreferenceModel");
const readHistoryModel = require("../Models/ReadHistoryModel");
const userModel = require("../Models/UserModel");

module.exports.addToWishlist= async (req,res) => {
    try{
        const wishlistInfo=req.body;

        const newWish=new bookPreferenceModel(
            {
                username: wishlistInfo.username,
                bookTitle: wishlistInfo.bookTitle,
                author: wishlistInfo.author,
                coverImage: wishlistInfo.coverImage
            }
        );

        await newWish.save()
            .then((result) => {
                res.send("Added to Wishlist!");
            })
            .catch((err) => {
                res.send("Error in adding!!");
                console.log(err);
            })
    }
    catch(err){
        res.status(500).send(err);
    }
}

module.exports.rmFromWishlist= async (req,res) => {
    try{
        const wishlistInfo=req.body;

        const result= await bookPreferenceModel.deleteOne({
            username: wishlistInfo.username,
            bookTitle: wishlistInfo.bookTitle,
            author: wishlistInfo.author
        });

        if(result.deletedCount==1) res.send("Deleted Successfully!!");
        else res.send("Entry not found!!");
    }
    catch(err){
        res.status(500).send(err);
    }
}

module.exports.getMyWishlist= async (req,res) => {
    try{
        const reqParams=req.params;
        const wishlistInfo=await bookPreferenceModel.find({username: reqParams.username});

        res.send({code: 300, wishlist: wishlistInfo});
    }
    catch(err){
        res.send({code: 301, msg: "Fetch error!"});
    }
}

module.exports.rmHistory= async (req,res) => {
    try{
        const historyInfo=req.body;

        const result= await readHistoryModel.deleteOne({
            username: historyInfo.username,
            bookTitle: historyInfo.bookTitle,
            author: historyInfo.author
        });

        if(result.deletedCount==1) res.send("Deleted Successfully!!");
        else res.send("Entry not found!!");
    }
    catch(err){
        res.status(500).send(err);
    }
}

module.exports.getMyProfile = async (req,res) => {
    try{
        const reqParams=req.params;
        const userProfile=await userModel.findOne({username: reqParams.username});
    
        return res.send({code: 100, user:userProfile});
    }
    catch(err){
        return res.send({code: 101, msg: "Fetch error!"});
    }
}

module.exports.getMyReadHistory= async (req,res) => {
    try{
        const reqParams=req.params;
        const readHistory=await readHistoryModel.find({username: reqParams.username}).sort({lastRead:-1});

        res.send({code: 200, history: readHistory});
    }
    catch(err){
        res.send({code: 201, msg: "Fetch error!"});
    }
}


/////  Only for testing purpose//////

// module.exports.addToHistory= async (req,res) => {
//     try{
//         const wishlistInfo=req.body;

//         const newWish=new readHistoryModel(
//             {
//                 username: wishlistInfo.username,
//                 bookTitle: wishlistInfo.bookTitle,
//                 author: wishlistInfo.author,
//                 coverImage: wishlistInfo.coverImage
//             }
//         );

//         // Check if history of that book already present. If present, just update the last created date.

//         await newWish.save()
//             .then((result) => {
//                 res.send("Added to history!");
//             })
//             .catch((err) => {
//                 res.send("Error in adding!!");
//                 console.log(err);
//             })
//     }
//     catch(err){
//         res.status(500).send(err);
//     }
// }
