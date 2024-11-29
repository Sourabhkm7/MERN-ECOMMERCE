import { TryCatch } from "../middlewares/error.js"; // Middleware for wrapping asynchronous functions to catch errors
import { Coupon } from "../models/coupon.js"; // Mongoose model for interacting with the "coupon" collection
import ErrorHandler from "../utils/utilty-class.js"; // Custom utility class for handling and throwing errors

// Controller function for creating a new coupon
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
