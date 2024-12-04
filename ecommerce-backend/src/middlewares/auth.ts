import { User } from "../models/user.js";
import ErrorHandler from "../utils/utilty-class.js";
import { TryCatch } from "./error.js";



//Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req,res, next) =>{

    const { id } = req.query;
    if(!id) return next(new ErrorHandler("Please Login", 401));
    
    const user = await User.findById(id);
    if(!user) 
        return next(new ErrorHandler("Please Stop!! It can be done by Admin Only", 401));
    if(user.role !== "admin") 
        return next(new ErrorHandler("Unauthorized Act, Please contact Admin", 403));
    next();
});