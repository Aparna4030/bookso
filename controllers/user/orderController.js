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
const checkStockExist = require("../../utils/checkStockExist")
const checkListedStatus = require("../../utils/checkListedStatus")

const orders = [];

const rzpyCallback = asynchandler(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id })
    order.paymentStatus = "successful";
    order.status ="Placed"

    await order.save();
    order.items.forEach(async (item) => {
        await Product.updateOne({ _id: item.productId }, { $inc: { stock: -1 * item.qty } })
    })

    const transaction = new Transaction({
        userId: req.session.userId,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        description: 'Amount Paid',
        type: 'Debit'
    });
    await transaction.save();
    await Cart.deleteOne({ userId: req.session.userId });
    res.redirect('/orders/payment')
})


const addOrder = asynchandler(async (req, res) => {
    const initialAmount = req.body.cartInitialAmount * 1;
    const discount = req.body.discountValue * 1;
    const totalAmount = req.body.totalPrice * 1;
    
    const { discountPercentage, discountValue, totalPrice } = req.body;
    
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId');
    
    if(req.session.cartLastUpdatedAt){
        const lastUpdated = req.session.cartLastUpdatedAt;
        req.session.cartLastUpdatedAt = null;
        if(lastUpdated.toString() !== cart.updatedAt.toISOString() ){

            res.cookie("notify","Cart Updated")
            res.redirect('/cart')
            return;
        }
    }
    const items = cart.products.map((product) => {
        if(product.productId.stock < product.qty)throw new Error("No stock available")
        return { productId: product.productId._id, qty: product.qty, pricePerItem: product.productId.price };
    });

    const cartTotalAmount = cart.products.reduce((acc, product) => {
        return acc + (product.qty * product.productId.price);
    }, 0);

    const deliveryCharge = 0.05;
    const totalDeliveryCharge = cartTotalAmount * deliveryCharge;

    if (req.body.option === 'Card') {
        const order = new Order({
            userId: req.session.userId,
            items: items,
            address: req.body.address,
            paymentMethod: req.body.option,
            discount: discount ? discount : 0,
            amount: initialAmount ? initialAmount : 0,
            totalAmount: totalPrice ? totalPrice : 0,
            deliveryCharge: totalDeliveryCharge,
            paymentStatus: "pending",
            status:"pending"
        });
        const savedOrder = await order.save();
        const callback = `http://localhost:8080/orders/razorpay/success/${savedOrder._id}`;
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
            discount: discount ? discount : 0,
            amount: initialAmount ? initialAmount : 0,
            totalAmount: totalPrice ? totalPrice : 0,
            deliveryCharge: totalDeliveryCharge,
            paymentStatus: "successful"
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

const transactionList = asynchandler(async (req, res) => {
    const transactions = await Transaction.find({ userId: req.session.userId }).populate('userId', 'name').sort({ createdAt: -1 })
    res.render("transactions", { transactions })
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
    const { initialPrice: initialPrice, totalPrice: totalPrice, discountValue: discountValue, deliveryCharge: deliveryCharge, discountPercentage: discountPercentage, totalpriceDiscount: totalpriceDiscount } = req.body;
    const addressesOrder = await Address.find({ userId: req.session.userId })
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId')
    const products = cart.products;
    req.session.cartLastUpdatedAt = cart.updatedAt;

    let productAvailability = true;

    await Promise.all(cart.products.map(async (pro) => {
        const listed = await checkListedStatus(pro.productId._id);
        const stockAvailable = await checkStockExist(pro.productId._id, pro.qty);
        if (!listed || !stockAvailable) {
            productAvailability = false;
        }
    }));
    
    if(!productAvailability){
        res.cookie("notify","Some products are not available")
        res.redirect("/cart");
    }

    const shippingCharge = 0.05
    const user = await User.findOne({ _id: req.session.userId }, { wallet: 1 });
    res.render("placeOrder", { addressesOrder, totalPrice, products, shippingCharge, initialPrice, discountValue, deliveryCharge, discountPercentage, totalpriceDiscount, wallet: user.wallet })
})

const renderUserOrders = asynchandler(async (req, res) => {
    const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 })
        .populate('items.productId')
        .populate('address')
        .populate('userId')
    res.render("userOrders", { orders })
})

const renderUserOderDetails = asynchandler(async (req, res) => {
    const orders = await Order.find({ _id: req.params.id })
        .populate('items.productId')
        .populate('address')
        .populate('userId')
    res.render("userOrderDetails", { orders })
})

const handleReorder = asynchandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId });

    let productStatusOk = true;

    await new Promise(async (res) => {
        order.items.forEach(async (elt, index) => {
            const stockAvailable = await checkStockExist(elt.productId, elt.qty);
            const listed = await checkListedStatus(elt.productId)
            if (!stockAvailable || !listed) {
                productStatusOk = false;  
            }
            if(index === order.items.length -1){
                res();
            }
        })

    })

    if (productStatusOk) {
        const amount = order.totalAmount;
        const callback = `http://localhost:8080/orders/reorder/razorpaycb/${order._id}`
        res.render('razorpay', { amount, callback });

    }
    else {
        res.send("No stock")
    }

})

const updateReorder = asynchandler(async(req,res)=>{
    const order = await Order.findOne({_id:req.params.id});
    const transaction = new Transaction({
        userId: req.session.userId,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        description: 'Amount Paid',
        type: 'Debit'
    });
    await transaction.save();
    order.status="Placed"
    order.paymentStatus = "successful";
    order.save();   
    order.items.forEach(async (item) => {
        await Product.updateOne({ _id: item.productId }, { $inc: { stock: -1 * item.qty } })
    })
    await Cart.deleteOne({ userId: req.session.userId });
    res.redirect('/orders/payment')
})


module.exports = {
    renderUserOderDetails,
    updateReorder,
    renderUserOrders,
    transactionList,
    returnProduct,
    cancelProduct,
    addOrder,
    renderPayment,
    renderPlaceOrder, 
    rzpyCallback,
    handleReorder }