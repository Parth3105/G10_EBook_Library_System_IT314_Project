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
                author: wishlistInfo.author
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

module.exports.getMyProfile = async (req,res) => {
    try{
        const reqParams=req.params;
        const userProfile=await userModel.findOne({username: reqParams.username});
    
        res.send(userProfile);
    }
    catch(err){
        console.log(err);
        res.send("Fetch error!");
    }
}

module.exports.getMyReadHistory= async (req,res) => {
    try{
        const reqParams=req.params;
        const readHistory=await readHistoryModel.find({username: reqParams.username});

        res.send(readHistory);
    }
    catch(err){
        console.log(err);
        res.send("Fetch error!");
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
//                 author: wishlistInfo.author
//             }
//         );

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
