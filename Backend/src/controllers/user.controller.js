import {User} from "../models/user.models.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try{
    //obj destructre from req.body
    const {username,fullname,email,address,phoneNumber,password} = req.body;

    //check for required fields (role removed - defaults to regular)
    if(!username || !email || !phoneNumber ||!fullname ||!address ||!password){
        return res.status(401).json({
            message: "All fields are required"
        });
    }

    //user already exists?
    const existeduser = await User.findOne({
        $or:[{username: username.toLowerCase()},{phoneNumber}]
    });
    if(existeduser){
        return res.status(500).json({
            message:"User already exists"
        })
    }

    //enccrypt password through bcryptjs 
    //Done in user.models.js pre save middleware

    //save to db - role defaults to "regular" in schema
    const user = await User.create({
        fullname,
        email,
        username:username.toLowerCase(),
        address,
        phoneNumber,
        role: "regular", // Always set to regular for new registrations
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
const getAllUsers = async(req,res)=>{
    try {
        // Get all users but exclude sensitive data
        const users = await User.find({}).select('-password -refreshToken').sort({ createdAt: -1 });
        
        return res.status(200).json({
            users: users
        });
    } catch(error) {
        console.error('getAllUsers - Error:', error);
        return res.status(500).json({
            message: "An error occurred while fetching users",
            error: error.message
        });
    }
}

const updateUserRole = async(req,res)=>{
    try {
        const {userId, role} = req.body;
        
        if (!userId || !role) {
            return res.status(400).json({
                message: "User ID and role are required"
            });
        }

        // Validate role
        if (role !== 'admin' && role !== 'regular') {
            return res.status(400).json({
                message: "Role must be either 'admin' or 'regular'"
            });
        }

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = role.toLowerCase();
        await user.save();

        return res.status(200).json({
            message: "User role updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch(error) {
        console.error('updateUserRole - Error:', error);
        return res.status(500).json({
            message: "An error occurred while updating user role",
            error: error.message
        });
    }
}

export default registerUser;
export {loginuser};
export {getAllUsers};
export {updateUserRole};