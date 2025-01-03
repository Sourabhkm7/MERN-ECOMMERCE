import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js"; // Middleware for wrapping asynchronous functions to catch errors
import { Coupon } from "../models/coupon.js"; // Mongoose model for interacting with the "coupon" collection
import ErrorHandler from "../utils/utilty-class.js"; // Custom utility class for handling and throwing errors

export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;

    if (!amount) 
        return next(new ErrorHandler("Please Enter amount", 400));

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: "inr",   
        })

    return res.status(201).json({
        success: true, 
        clientSecret: paymentIntent.client_secret, 
    });
});


export const newCoupon = TryCatch(async (req, res, next) => {
    // Extracting the `coupon` code and `amount` from the request body
    const { coupon, amount } = req.body;

    // Validate input: If either `coupon` or `amount` is missing, throw an error
    if (!coupon || !amount) 
        return next(new ErrorHandler("Please Enter both coupon and amount", 400));

    // Create a new coupon in the database with the provided code and amount
    await Coupon.create({ code: coupon, amount });

    // Send a success response with status code 201 (Created)
    return res.status(201).json({
        success: true, // Indicates the operation was successful
        message: `Coupon ${coupon} Created Successfully`, // Message to inform the client
    });
});


export const applyDiscount = TryCatch(async (req, res, next) => {

    const { coupon } = req.query;

    const discount = await Coupon.findOne({code: coupon})

    if(!discount) return next(new ErrorHandler(" Invalid Coupon Code", 400))

    return res.status(200).json({
        success: true, // Indicates the operation was successful
        discount: discount.amount,
    });
});


export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({})

    return res.status(200).json({
        success: true, // Indicates the operation was successful
        coupons,
    });
});


export const deleteCoupon = TryCatch(async (req, res, next) => {

    const {id} = req.params;

    const coupon = await Coupon.findByIdAndDelete(id)

    if(!coupon) return next(new ErrorHandler("Invalid Coupon Id", 400))

    return res.status(200).json({
        success: true, // Indicates the operation was successful
        message: `Coupon ${coupon?.code} Deleted Successfully`,
    });
});
