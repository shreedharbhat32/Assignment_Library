import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        lowercase: true,
        default: "reguler user"
    }

}, { timestamps: true })


userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password =  await bcrypt.hash(this.password,10);
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id:this._id,
            username:this.username,
            role:this.role,
            fullname:this.fullname,
            email:this.email,
            address:this.address,
            phoneNumber:this.phoneNumber
        }
        ,process.env.ACCESS_SECRET_KEY,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id:this._id,
            username:this.username,
            role:this.role,
            fullname:this.fullname,
            email:this.email,
            address:this.address,
            phoneNumber:this.phoneNumber
        }
        ,process.env.REFRESH_SECRET_KEY,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User", userSchema);