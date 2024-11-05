const jwt=require("jsonwebtoken"); //jwt tokens are required for protected routes...
const userModel=require("../Models/UserModel");
const bcrypt=require("bcryptjs"); // bcryptjs is used in node to encrypt the passwords

// function control the registration of the new user.
module.exports.registerUser=async (req,res)=>{
    try{
        const registerInput=req.body;
        const saltRounds=10; // It is used for more computed or say for making more prone to attacks on increment but less performance/time-cost.
        const hashedPass=await bcrypt.hash(registerInput.password,saltRounds); //password is hashed using bcryptjs.
        
        const newUser=new userModel({
            username: registerInput.username,
            password: hashedPass,
            email: registerInput.email
        });

        newUser.save()
                .then(()=>res.send("New User created Successfully"))
                .catch((err)=>{
                    console.log(err);
                    res.send("Sign up error!!!!");
                });
    }
    catch(err){
        console.log("User Creation Error: "+err);
    }
}

// function controls the login of user.
module.exports.loginUser=async (req,res)=>{
    const loginInput=req.body;
    const userCredential=await userModel.findOne({username: loginInput.username});

    if(userCredential==null){
        res.send("User doesn't exist!!!");
    }
    else{
        try{
            const isMatch=await bcrypt.compare(loginInput.password,userCredential.password); // Compare the input plain-text password with stored hashed-password.
            if(isMatch) {
                jwt.sign({userID: userCredential._id}, process.env.JWT_KEY, {expiresIn: "4h"}, (err, token) => {
                    if (err) {
                        res.send({ msg: "Error logging in!" });
                    }
                    else {
                        res.send({
                            msg: "Login Successfull",
                            token: token
                        });
                    }
                });
            }
            else res.send("Password Incorrect!");
        }
        catch(err){
            console.log(err);
            res.send("Login Error!")
        } 
    }
}
