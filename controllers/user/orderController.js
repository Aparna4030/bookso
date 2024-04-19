const Address = require("../../models/addressModel")
const Product = require("../../models/productModel")
const Cart = require("../../models/cartModel")
const Order = require("../../models/ordersModel")
const User = require("../../models/userModel")
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
            amount:order.deliveryChrg + order.totalAmt,
            paymentMethod: order.paymentMethod,
            description: 'Amount Paid',
            type: 'Debit'
        });
        await transaction.save();
    await Cart.deleteOne({ userId: req.session.userId });
    res.redirect('/')
})

// const addOrder = asynchandler(async (req, res) => {
//     const cTotalAmount = req.body.cTotalAmount * 1;
//     const {discountPercentage} = req.body;
//     const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId')

//     const items = cart.products.map((product) => {
//         return { productId: product.productId._id, qty: product.qty, pricePerItem: product.productId.price }
//     })

//     const totalAmt = cart.products.reduce((acc, product) => {
//         return acc + (product.qty * product.productId.price);
//     }, 0);


//     const deliveryChrg = 0.05;
//     const totalAmount = totalAmt * deliveryChrg;
//     const { products } = cart;

//     console.log({ totalAmount })


//     if (req.body.option === 'Card') {
//         const order = new Order({
//             userId: req.session.userId,
//             items: items,
//             address: req.body.address,
//             paymentMethod: req.body.option,
//             discount:discountPercentage? discountPercentage:0,
//             totalAmt: cTotalAmount? cTotalAmount-totalAmount : totalAmt,
//             deliveryChrg: totalAmount,
//         })
//         const callback = "http://localhost:8080/orders/razorpay/success";
//         orders.push(order);
//         res.render('razorpay',{amount:cTotalAmount?cTotalAmount:totalAmount+totalAmt,callback})
//     } else {

//         const amount = cTotalAmount? cTotalAmount : totalAmount+totalAmt;

//         if(req.body.option === 'Wallet'){
//             const user = await User.findOne({_id:req.session.userId});
//             if(user.wallet >= amount){
//                 await User.updateOne({_id:req.session.userId},{$inc:{wallet:-(totalAmount+totalAmt)}})
//             }
//         }

//         const order = new Order({
//             userId: req.session.userId,
//             items: items,
//             address: req.body.address,
//             paymentMethod: req.body.option,
//             totalAmt: cTotalAmount? cTotalAmount-totalAmount : totalAmt,
//             deliveryChrg: totalAmount,
//         })

//         await order.save()
//         if(order.paymentMethod !== 'COD'){

//             const transaction = new Transaction({
//                 userId: req.session.userId,
//                 amount: totalAmount + totalAmt,
//                 order:req.body.order,
//                 paymentMethod:req.body.option,
//                 description: 'Payment for order',
//                 type: 'debit'
//             });
//             await transaction.save();
//         }

//         await Cart.deleteOne({ userId: req.session.userId });

//         items.forEach(async (item) => {
//             await Product.updateOne({ _id: item.productId }, { $inc: { stock: -1 * item.qty } })
//         })

//         res.redirect("/orders/payment")
//     } 
// })



const addOrder = asynchandler(async (req, res) => {
    const cTotalAmount = req.body.cTotalAmount * 1;
    const { discountPercentage } = req.body;
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId');

    const items = cart.products.map((product) => {
        return { productId: product.productId._id, qty: product.qty, pricePerItem: product.productId.price };
    });

    const totalAmt = cart.products.reduce((acc, product) => {
        return acc + (product.qty * product.productId.price);
    }, 0);

    const deliveryChrg = 0.05;
    const totalAmount = totalAmt * deliveryChrg;

    if (req.body.option === 'Card') {
        const order = new Order({
            userId: req.session.userId,
            items: items,
            address: req.body.address,
            paymentMethod: req.body.option,
            discount: discountPercentage ? discountPercentage : 0,
            totalAmt: cTotalAmount ? cTotalAmount - totalAmount : totalAmt,
            deliveryChrg: totalAmount,
        });
        const callback = "http://localhost:8080/orders/razorpay/success";
        orders.push(order);
        res.render('razorpay', { amount: cTotalAmount ? cTotalAmount : totalAmount + totalAmt, callback });
    } else {
        const amount = cTotalAmount ? cTotalAmount : totalAmount + totalAmt;

        if (req.body.option === 'Wallet') {
            const user = await User.findOne({ _id: req.session.userId });
            if (user.wallet >= amount) {
                await User.updateOne({ _id: req.session.userId }, { $inc: { wallet: -(totalAmount + totalAmt) } });
            }
        }

        const order = new Order({
            userId: req.session.userId,
            items: items,
            address: req.body.address,
            paymentMethod: req.body.option,
            totalAmt: cTotalAmount ? cTotalAmount - totalAmount : totalAmt,
            deliveryChrg: totalAmount,
        });

        await order.save();
        
        if (order.paymentMethod !== 'COD') {
            const transaction = new Transaction({
                userId: req.session.userId,
                amount: totalAmount + totalAmt,
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
    console.log(req.body)
    const cancelOrder = await Order.updateOne({ _id: req.body.order_id }, { $set: { productCancellation: { cancelStatus: true, description: req.body.description } } })
    console.log('caaaaaaaaannnnnnnnnnccccccccccceeeel', cancelOrder)
    res.redirect('/orders')
})
const returnProduct = asynchandler(async (req, res) => {
    console.log(req.body)
    const returnOrder = await Order.updateOne({ _id: req.body.order_id }, { $set: { productReturned: { returnStatus: true, description: req.body.description } } })
    console.log('reeeeeeeeettttttuuuuurrrrn', returnOrder)
    res.redirect('/orders')
})

const renderPlaceOrder = asynchandler(async (req, res) => {
    console.log(req.body)
    const { totalPrice: cTotalPrice, deliveryCharg: cDeliveryCharge, discount: cDiscount, coupon,discountPercentage } = req.body;
    const addressesOrder = await Address.find({ userId: req.session.userId })
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId')
    const products = cart.products;
    const shippingCharge = 0.05
    const user = await User.findOne({_id:req.session.userId},{wallet:1});
    res.render("placeOrder", { addressesOrder, products, shippingCharge, cTotalPrice, cDeliveryCharge, cDiscount, coupon,discountPercentage,wallet:user.wallet })
})

module.exports = { transactionList,returnProduct, cancelProduct, addOrder, renderPayment, renderOrders, renderPlaceOrder,rzpyCallback }