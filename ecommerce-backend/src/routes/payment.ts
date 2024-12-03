import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newCoupon } from "../controllers/payment.js";

const app = express.Router();

//route - /api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon );

//route - /api/v1/payment/discount/new
app.post("/discount", newCoupon );


export default app;

