import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(async(req,res,next) =>{

    let stats ={};
    if(myCache.has("admin-stats")) 
        stats = JSON.parse(myCache.get("admin-stats" )as string)

    else{
        const today = new Date();
        const sixMonthsAgo = new Date();

        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

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
    });

    const lastSixMonthOrdersPromise =  Order.find({
        createdAt:{
            $gte: sixMonthsAgo,
            $lte: today,
        },
    });
    const latestTransactionPromise = Order.find({})
    .select(["orderItems","discount","total","status"])
    .limit(4);



    const [thisMonthProducts,
        thisMonthUsers,
        thisMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        lastMonthOrders,
        productsCount,
        usersCount,
        allOrders,
        lastSixMonthOrders,
        categories,
        femaleUsersCount,
        latestTransaction,
        ] = await Promise.all([
        thisMonthProductsPromise, 
        thisMonthUsersPromise, 
        thisMonthOrdersPromise,
        lastMonthProductsPromise,
        lastMonthUsersPromise,
        lastMonthOrdersPromise,
        Product.countDocuments(),
        User.countDocuments(),
        Order.find({}).select("total"),
        lastSixMonthOrdersPromise,
        Product.distinct("category"),
        User.countDocuments({gender:"female"}),
        latestTransactionPromise
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
        (total, order) => total + (order.total || 0),0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
        (total, order) => total + (order.total || 0),0
    );


    const ChangePercent ={
        revenue: calculatePercentage(thisMonthRevenue,lastMonthRevenue),

        product: calculatePercentage(
            thisMonthProducts.length, 
            lastMonthProducts.length
        ),
        user:calculatePercentage(
            thisMonthUsers.length, 
            lastMonthUsers.length
        ),
        order:calculatePercentage(
            thisMonthOrders.length, 
            lastMonthOrders.length
        )
    }

    const revenue = allOrders.reduce(
        (total, order) => total + (order.total || 0),0
    );
    const count = {
        revenue,
        user: usersCount,
        product: productsCount,
        order: allOrders.length
    };

    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevenue= new Array(6).fill(0)

    lastSixMonthOrders.forEach((order)=>{
        const creationDate = order.createdAt;
        const monthDiff = today.getMonth() - creationDate.getMonth();

        if(monthDiff < 6){
            orderMonthCounts[6-monthDiff-1] += 1;
            orderMonthRevenue[6-monthDiff-1] += order.total;
        }
    });

    const categoryCount: Record<string,number> [] = [] = await getInventories({categories,productsCount})


    const UserRatio = {
        male: usersCount - femaleUsersCount,
        female: femaleUsersCount,
    };

    const modifiedLatestTransaction = latestTransaction.map((i)=>({
        _id: i._id,
        discount: i.discount,
        amount: i.total,
        quantity: i.orderItems.length,
        status: i.status,


    }));

    stats = {
        categoryCount,
        ChangePercent,
        count,
        chart:{
            order: orderMonthCounts,
            revenue: orderMonthRevenue,
        },
        UserRatio,
        latestTransaction:modifiedLatestTransaction,
    };
    myCache.set("admin-stats", JSON.stringify(stats))

    }
    return res.status(200).json({
        success: true,
        stats
    })
})






export const getPieCharts = TryCatch(async(req,res,next) =>{
    let charts;

    if(myCache.has("admin-pie-charts"))charts = JSON.parse(myCache.get("admin-pie-charts")as string);

    else{

        const [processingOrder,shippedOrder,deliveredOrder, categories,productsCount] = await Promise.all([
            Order.countDocuments({status:"Processing"}),
            Order.countDocuments({status:"Shipped"}),
            Order.countDocuments({status:"Delivered"}),
            Product.distinct("category"),
            Product.countDocuments()
        ])

        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
        const productCategories = await getInventories({
            categories,productsCount
        })


        charts ={
            orderFullfillment,
            productCategories,

        };

        
        myCache.set("admin-pie-charts", JSON.stringify(charts));

    }

    return res.status(200).json({
        success: true,
        charts,
    })
})

export const getBarCharts = TryCatch(async() =>{
    
})

export const getLineCharts = TryCatch(async() =>{
    
})