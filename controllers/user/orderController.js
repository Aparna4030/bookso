const Address = require("../../models/addressModel")
const Product = require("../../models/productModel")
const Cart = require("../../models/cartModel")
const Order = require("../../models/ordersModel")
const User = require("../../models/userModel")
const Coupon = require("../../models/couponModel")
const asynchandler = require("express-async-handler")
const addressModel = require("../../models/addressModel")
const Transaction = require("../../models/transactionModel")
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Razorpay = require('razorpay');

const orders = [];

const renderOrders = asynchandler(async (req, res) => {
    let orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 })
        .populate('items.productId')
        .populate('address')
        console.log("ooooooooo888888888899999999999",orders)
    res.render("orders", { orders })
})

const rzpyCallback = asynchandler(async (req,res) =>{
    const orderIndex = orders.findIndex(order => order.userId.toString() === req.session.userId.toString())
    const order =await orders[orderIndex].save();
    const items = orders[orderIndex].items;
    items.forEach(async (item) => {
    await Product.updateOne({ _id: item.productId }, { $inc: { stock: -1 * item.qty } })
    })
    orders.splice(orderIndex,1);

        const transaction = new Transaction({
            userId: req.session.userId,
            amount:order.totalAmount,
            paymentMethod: order.paymentMethod,
            description: 'Amount Paid',
            type: 'Debit'
        });
        await transaction.save();
    await Cart.deleteOne({ userId: req.session.userId });
    res.redirect('/')
})


const addOrder = asynchandler(async (req, res) => {
    const initialAmount = req.body.cartInitialAmount * 1;
    const discount = req.body.discountValue * 1;
    const totalAmount = req.body.totalPrice * 1;
    // console.log("///////////////////////////////////////",req.body)
//     address: '6618dd341b91104c3b12561b',
//     initialPrice: '1000',        
//     discountValue: '200',        
//     deliveryCharge: '50',        
//     totalPrice: '850',
//     option: 'COD',
//     cartInitialAmount: '1000',   
//     discountPercentage: '20'     


    // console.log("00000000000000000000000000000000000000",initialAmount)
//   00000000000000000000000000000000000000 1000
    const { discountPercentage,discountValue,totalPrice} = req.body;

    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId');
    const items = cart.products.map((product) => {
        return { productId: product.productId._id, qty: product.qty, pricePerItem: product.productId.price };
    });

    const cartTotalAmount = cart.products.reduce((acc, product) => {
        return acc + (product.qty * product.productId.price);
    }, 0);
 
    const  deliveryCharge = 0.05;
    const totalDeliveryCharge = cartTotalAmount *  deliveryCharge;
   
    if (req.body.option === 'Card') {
        const order = new Order({
            userId: req.session.userId,
            items: items,
            address: req.body.address,
            paymentMethod: req.body.option,
            discount: discount? discount:0,
            amount: initialAmount ? initialAmount : 0,
            totalAmount: totalPrice ? totalPrice : 0,
            deliveryCharge: totalDeliveryCharge,
        });
        const callback = "http://localhost:8080/orders/razorpay/success";
        orders.push(order);
        console.log({totalAmount})
        res.render('razorpay', { amount: totalAmount, callback });
    } else {
        const amount = initialAmount ? initialAmount : totalDeliveryCharge + cartTotalAmount;

        if (req.body.option === 'Wallet') {
            const user = await User.findOne({ _id: req.session.userId });
            if (user.wallet >= amount) {
                await User.updateOne({ _id: req.session.userId }, { $inc: { wallet: -(totalDeliveryCharge + cartTotalAmount) } });
            }
        }

        const order = new Order({
            userId: req.session.userId,
            items: items,
            address: req.body.address,
            paymentMethod: req.body.option,
            discount: discount? discount:0,
            amount: initialAmount? initialAmount:0,
            totalAmount: totalPrice? totalPrice:0,
            deliveryCharge: totalDeliveryCharge,
        });

        await order.save();
        
        if (order.paymentMethod !== 'COD') {
            const transaction = new Transaction({
                userId: req.session.userId,
                amount: totalPrice,
                order: order._id, 
                paymentMethod: req.body.option,
                description: 'Amount Paid',
                type: 'Debit'
            });
            await transaction.save();
        }

        await Cart.deleteOne({ userId: req.session.userId });

        items.forEach(async (item) => {
            await Product.updateOne({ _id: item.productId }, { $inc: { stock: -1 * item.qty } });
        });

        res.redirect("/orders/payment");
    }
});


const renderPayment = asynchandler((req, res) => {
    res.render("payment")
})

const  transactionList = asynchandler(async(req,res)=>{
    const transactions = await Transaction.find().populate('userId', 'name')
    res.render("transactions",{transactions})
})


const cancelProduct = asynchandler(async (req, res) => { 
    const cancelOrder = await Order.updateOne({ _id: req.body.order_id }, { $set: { productCancellation: { cancelStatus: true, description: req.body.description } } })
    res.redirect('/orders')
})
const returnProduct = asynchandler(async (req, res) => {
    const returnOrder = await Order.updateOne({ _id: req.body.order_id }, { $set: { productReturned: { returnStatus: true, description: req.body.description } } }) 
    res.redirect('/orders')
})

const renderPlaceOrder = asynchandler(async (req, res) => {
    // console.log("tttttttiiiiiiiiiii",req.body)
    const { initialPrice: initialPrice, totalPrice: totalPrice, discountValue: discountValue, deliveryCharge: deliveryCharge, discountPercentage: discountPercentage, totalpriceDiscount: totalpriceDiscount} = req.body;
    const addressesOrder = await Address.find({ userId: req.session.userId })
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId')
    const products = cart.products;
    const shippingCharge = 0.05
    const user = await User.findOne({_id:req.session.userId},{wallet:1});
    res.render("placeOrder", { addressesOrder, totalPrice, products, shippingCharge, initialPrice, discountValue, deliveryCharge, discountPercentage, totalpriceDiscount, wallet:user.wallet })
})

module.exports = { transactionList,returnProduct, cancelProduct, addOrder, renderPayment, renderOrders, renderPlaceOrder,rzpyCallback }