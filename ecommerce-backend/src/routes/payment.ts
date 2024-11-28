import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newCoupon } from "../controllers/payment.js";

const app = express.Router();

//route - /api/v1/user/payment/coupon/new
app.post("/coupon/new", newCoupon );


export default app;

