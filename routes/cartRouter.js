const express = require('express');
const cartController = require('../controllers/user/cartController');
const Cart = require("../models/cartModel");
const { isLoggedin } = require('../middlewares/auth_middleware');
const router = express.Router();

router.get("/",isLoggedin,cartController.renderCart)
router.post("/",cartController.addToCart)
router.get("/delete/:id",isLoggedin,cartController.deleteCartItem)

router.get("/decreaseQty/:productId/:qty",cartController.decreaseQuantity)
router.get("/increaseQty/:productId/:qty",cartController.increaseQuantity)






module.exports = router;