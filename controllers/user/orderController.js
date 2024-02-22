const Address = require("../../models/addressModel")
const Product = require("../../models/productModel")
const Cart = require("../../models/cartModel")
const asynchandler = require("express-async-handler")


const renderOrders = asynchandler((req,res)=>{
    res.render("orders")
})


const renderPlaceOrder = asynchandler(async(req,res)=>{
    const addressesOrder = await Address.find({userId:req.session.userId})
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId')
    console.log("carrrrrrrrrttttttttttttttt",cart)
    const products = cart.products;
    console.log("productssssssssssssssssss",products)
    res.render("placeOrder",{addressesOrder,products})
})
module.exports = {renderOrders,renderPlaceOrder}