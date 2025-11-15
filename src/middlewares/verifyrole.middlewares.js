import {User} from "../models/user.models.js";



export const verifyRole = async(req,res,next)=>{
    if(req.user.role !== "admin"){
        throw Error("You are not Permitted!");
    }
    next();
}