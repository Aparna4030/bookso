const express = require('express');
const orderController = require("../controllers/user/orderController");
const Order = require("../models/ordersModel");

const { isLoggedin } = require('../middlewares/auth_middleware');
const router = express.Router();


router.post("/placeOrder",isLoggedin,orderController.renderPlaceOrder)
router.post("/razorpay/success/:id",isLoggedin,orderController.rzpyCallback)
router.get("/payment",isLoggedin,orderController.renderPayment)
router.post("/addOrder",isLoggedin,orderController.addOrder)
router.post("/cancel",isLoggedin,orderController.cancelProduct)
router.get("/reorder/:id",isLoggedin,orderController.handleReorder)
router.post("/reorder/razorpaycb/:id",orderController.updateReorder)

module.exports = router