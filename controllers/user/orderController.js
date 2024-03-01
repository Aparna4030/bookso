const Address = require("../../models/addressModel")
const Product = require("../../models/productModel")
const Cart = require("../../models/cartModel")
const Order = require("../../models/ordersModel")
const asynchandler = require("express-async-handler")
const addressModel = require("../../models/addressModel")


const renderOrders = asynchandler(async(req,res)=>{
    let orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 })
    .populate('items.productId')
    .populate('address')
    console.log("orderssssssss",orders)
    // if(orders.length < 1) orders = null; 
    res.render("orders",{orders})
})

const addOrder = asynchandler(async(req,res)=>{
    const cart = await Cart.findOne({userId:req.session.userId}).populate('products.productId')
    const items = cart.products.map((product)=>{
        return {productId:product.productId._id,qty:product.qty,pricePerItem:product.productId.price}
    })

    const totalAmt = cart.products.reduce((acc, product) => {
        return acc + (product.qty*product.productId.price);
    }, 0);
    
    const deliveryChrg= 0.05;
    const totalAmount = totalAmt*deliveryChrg;

    const order = new Order({
        userId:req.session.userId,
        items:items,
        address:req.body.address,
        paymentMethod:req.body.option,
        totalAmt:totalAmt,
        deliveryChrg:totalAmount,      
    })
 
    await order.save()

    await Cart.deleteOne({userId:req.session.userId});

    items.forEach(async (item) =>{
        await Product.updateOne({_id:item.productId},{ $inc: { stock: -1 * item.qty } })
    })
    
    res.redirect("/orders/payment")
})



const renderPayment = asynchandler((req,res)=>{
    res.render("payment")
})



const renderPlaceOrder = asynchandler(async(req,res)=>{
    const addressesOrder = await Address.find({userId:req.session.userId})
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId')
    const products = cart.products;
    const shippingCharge = 0.05
    res.render("placeOrder",{addressesOrder,products,shippingCharge})
})

module.exports = {addOrder,renderPayment,renderOrders,renderPlaceOrder}