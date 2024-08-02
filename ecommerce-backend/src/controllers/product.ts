import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utilty-class.js";
import { rm } from "fs";



export const newProduct = TryCatch(
        async (req:Request<{},{},NewProductRequestBody>,res,next)=>{
            const {name,category,price, stock} = req.body;
            const photo = req.file;

            if (!photo) return next (new ErrorHandler("Please add Photo",400));

            if(!name || !category || !price || !stock) {
                rm(photo.path,()=>{
                    console.log("Deleted")
                });
                return next (new ErrorHandler("Please Enter All Fields",400));
            }
        await Product.create({
            name,
            category: category.toLowerCase(),
            price, 
            stock,
            photo: photo.path
        });

        return res.status(201).json({
            success: true,
            message: "Product Created Successfully"
        })
    }
);

export const getlatestProducts = TryCatch(async (req,res,next)=>{
    const products = await Product.find({}).sort({createdAt:-1}).limit(5);

        return res.status(200).json({
            success: true,
            products,
        })
    }
);

export const getAllCategories = TryCatch(async (req,res,next)=>{

        const categories = await Product.distinct("category")

        return res.status(200).json({
            success: true,
            categories,
        })
    }
);