import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";

export const getDashboardStats = TryCatch(async(req,res,next) =>{

    let stats ={};
    if(myCache.has("admin-stats")) 
        stats = JSON.parse(myCache.get("admin-stats" )as string)

    else{
        const today = new Date();

        const thisMonth ={
            start: new Date(today.getFullYear(), today.getMonth(),1),
            end: today,
    };
    const lastMonth = {
        start:new Date(today.getFullYear(), today.getMonth() -1,1),
        end: new Date(today.getFullYear(), today.getMonth(),0)
    };

    const thisMonthProducts = await Product.find({
        createdAt:{
            $gte: thisMonth.start,
            $lte: thisMonth.end,
        },
    })
    }
    return res.status(200).json({
        success: true,
        stats
    })
})






export const getPieCharts = TryCatch(async() =>{
    
})

export const getBarCharts = TryCatch(async() =>{
    
})

export const getLineCharts = TryCatch(async() =>{
    
})