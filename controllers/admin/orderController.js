const Address = require("../../models/addressModel")
const Product = require("../../models/productModel")
const User = require("../../models/userModel")
const Cart = require("../../models/cartModel")
const Order = require("../../models/ordersModel")
const Transaction = require("../../models/transactionModel")
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
    res.render("adminOrderDetails",{orders})
})

const changeStatus = asynchandler(async(req,res)=>{
    const order = await Order.findOneAndUpdate(
        { _id: req.query.orderId },
        { $set: { status: req.query.newStatus } },
        { new: true } 
    );
    if((order.status === 'Cancelled'|| order.status === 'Returned') && order.paymentMethod!== 'COD'){
        const transaction = new Transaction({
            userId: req.session.userId,
            amount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            description: 'payment Cancelled',
            type: 'Credit'
        });
        await transaction.save();
       const walletblnc = await User.updateOne({ _id: req.session.userId }, { $inc: { wallet: transaction.amount} });
        order.items.forEach(async(item)=>{
            await Product.updateOne({_id:item.productId},{$inc:{stock:item.qty}})
        })
    }
  
    res.status(200).json("Successful")
})


module.exports ={changeStatus,renderAdminOrders,renderOderDetails}