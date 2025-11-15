import jwt from "jsonwebtoken";



export const verifyAccessToken = function(req,res,next){
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message:"No token provided"
            })
        }
        req.user =  jwt.verify(token,process.env.ACCESS_SECRET_KEY);
        next();
    }catch(error){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}