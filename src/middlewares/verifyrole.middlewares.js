import {User} from "../models/user.models.js";



export const verifyRole = (req, res, next) => {
    if (req.user.role === "regular") {
        return res.status(403).json({
            success: false,
            message: "You are not permitted!"
        });
    }
    next();
};
