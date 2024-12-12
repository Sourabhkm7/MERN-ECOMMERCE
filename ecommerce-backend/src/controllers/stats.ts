import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";

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

    const thisMonthProductsPromise =  Product.find({
        createdAt:{
            $gte: thisMonth.start,
            $lte: thisMonth.end,
        },
    })
    const lastMonthProductsPromise =  Product.find({
        createdAt:{
            $gte: lastMonth.start,
            $lte: lastMonth.end,
        },
    })

    const thisMonthUsersPromise =  User.find({
        createdAt:{
            $gte: thisMonth.start,
            $lte: thisMonth.end,
        },
    })
    const lastMonthUsersPromise =  User.find({
        createdAt:{
            $gte: lastMonth.start,
            $lte: lastMonth.end,
        },
    })
    
    const thisMonthOrdersPromise =  Order.find({
        createdAt:{
            $gte: thisMonth.start,
            $lte: thisMonth.end,
        },
    })
    const lastMonthOrdersPromise =  Order.find({
        createdAt:{
            $gte: lastMonth.start,
            $lte: lastMonth.end,
        },
    })
    const [thisMonthProducts,
        thisMonthUsers,
        thisMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        lastMonthOrders ] = await Promise.all([
        thisMonthProductsPromise, 
        thisMonthUsersPromise, 
        thisMonthOrdersPromise,
        lastMonthProductsPromise,
        lastMonthUsersPromise,
        lastMonthOrdersPromise    
    ])

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