import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utilty-class.js";




export const newOrder = TryCatch(
  async(req:Request <{},{},NewOrderRequestBody>,res,next) =>{
    
    const {
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    } = req.body;
    if (
        !shippingInfo || 
        !orderItems ||
        !user ||
        !subtotal ||
        !tax ||
        !shippingCharges ||
        !discount ||
        !total
    ) return next (new ErrorHandler ("Please Enter All Fields",400));

    await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });

    await reduceStock(orderItems);
    await invalidateCache({ product: true, order:true, admin:true });

    return res.status(201).json ({
        success: true, 
        message: "Order Placed Successfully "
    });
 }
);
