const express = require('express');
const orderController = require("../controllers/user/orderController");
const Order = require("../models/ordersModel");
const { isLoggedin } = require('../middlewares/auth_middleware');
const router = express.Router();


router.get("/",isLoggedin,orderController.renderOrders)
router.get("/placeOrder",isLoggedin,orderController.renderPlaceOrder)
router.get("/payment",isLoggedin,orderController.renderPayment)
router.post("/addOrder",isLoggedin,orderController.addOrder)

module.exports = router