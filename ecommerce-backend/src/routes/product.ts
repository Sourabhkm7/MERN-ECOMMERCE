import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getAllCategories, getlatestProducts, newProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct);


app.get("/latest", getlatestProducts);


app.get("/category", getAllCategories);


export default app;

