const express = require('express');
const orderController = require("../controllers/user/orderController");
const Order = require("../models/ordersModel");

const { isLoggedin } = require('../middlewares/auth_middleware');
const router = express.Router();


router.get("/",isLoggedin,orderController.renderOrders)
router.post("/placeOrder",isLoggedin,orderController.renderPlaceOrder)
router.post("/razorpay/success",orderController.rzpyCallback)
router.get("/payment",isLoggedin,orderController.renderPayment)
router.post("/addOrder",isLoggedin,orderController.addOrder)
router.post("/cancel",isLoggedin,orderController.cancelProduct)




module.exports = router