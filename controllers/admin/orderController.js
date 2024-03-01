const Address = require("../../models/addressModel")
const Product = require("../../models/productModel")
const Cart = require("../../models/cartModel")
const Order = require("../../models/ordersModel")
const asynchandler = require("express-async-handler")
const addressModel = require("../../models/addressModel")


const renderAdminOrders = asynchandler(async(req,res)=>{
    const orders = await Order.find({}).sort({ createdAt: -1 })
    .populate('items.productId')
    .populate('address')
    .populate('userId')
    res.render("adminOrders",{orders})
})


const renderOderDetails = asynchandler(async(req,res)=>{
    const orders = await Order.find({_id:req.params.id})
    .populate('items.productId')
    .populate('address')
    .populate('userId')
    console.log("orderssssssss",orders)
    console.log("itemsssssssssssssssssssssssssss",orders[0].items)
    res.render("adminOrderDetails",{orders})
})

const changeStatus = asynchandler(async(req,res)=>{
    console.log(req.query)
    const order = await Order.updateOne({_id:req.query.orderId},{$set:{status:req.query.newStatus}});
    console.log(order)
    res.status(200).json("Successful")
})


module.exports ={changeStatus,renderAdminOrders,renderOderDetails}