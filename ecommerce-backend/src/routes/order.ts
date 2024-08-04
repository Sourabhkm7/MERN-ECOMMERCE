import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newOrder } from "../controllers/order.js";


const app = express.Router();

//route - /api/v1/order/new
app.post("/new", newOrder );


export default app;

