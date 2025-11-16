import {User} from "../models/user.models.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try{
    //obj destructre from req.body
    const {username,fullname,email,address,phoneNumber,role,password} = req.body;

    //check for required fields
    if(!username || !email || !role || !phoneNumber ||!fullname ||!address ||!password){
        return res.status(401).message("All fields are required");
    }

    //user already exists?
    const existeduser = await User.findOne({
        $or:[{username},{phoneNumber}]
    });
    if(existeduser){
        return res.status(500).json({
            message:"User already exists"
        })
    }

    //enccrypt password through bcryptjs 
    //Done in user.models.js pre save middleware


    //save to db
    const user = await User.create({
        fullname,
        email,
        username:username.toLowerCase(),
        address,
        phoneNumber,
        role,
        password
    })

    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        return res.status(400).json({
            message: "User registration failed!"
        });
    }
    //return user
    return res
        .status(200)
        .json({
            message: "User Registration Successful",
        })
}catch(error){
    return res.status(500).json({
            message: "An error occurred during registration",
            error: error.message
        });
}
}
const loginuser = async(req,res) =>{
    try{
    const {username,password} = req.body;

    if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
    }
    const user = await User.findOne({username});
    if(!user){
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // await the async password comparison
    const validation = await user.isPasswordCorrect(password);

    if(!validation){
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const access = user.generateAccessToken();
    const refresh = user.generateRefreshToken();
    
    return res.status(200).json({ 
        message: "Login successful",
        access,refresh
    });
}catch(error){
        return res.status(500).json({
            message: "An error occurred during login",
            error: error.message
        });
    }
}
export default registerUser;
export {loginuser};