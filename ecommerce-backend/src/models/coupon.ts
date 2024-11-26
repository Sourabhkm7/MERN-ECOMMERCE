import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema({
    
    coupon: {
        type: String,
        required: [true, "Please enter the coupon code"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "Please enter the discount amount"],
    },

})

export const Coupon = mongoose.model("Coupon", schema);