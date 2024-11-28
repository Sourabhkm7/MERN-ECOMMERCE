import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utilty-class.js";



export const newCoupon = TryCatch(async(req,res,next)=>{
    const {coupon, amount} = req.body;

    if(!coupon || !amount) 
        return next(new ErrorHandler("Please Enter both coupon and amount",400))

    await Coupon.create({code: coupon, amount});

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} Created Successfully`,
    });
});