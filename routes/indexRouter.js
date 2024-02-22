const express = require('express');
const userController = require('../controllers/user/userController');
const productUserController = require("../controllers/user/productUserController");
const addressController = require("../controllers/user/addressController");
const orderController = require("../controllers/user/orderController");
const cartController = require("../controllers/user/cartController");
const Product = require("../models/productModel");
const { isLoggedin,isLoggedOut} = require("../middlewares/auth_middleware");
const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find().limit(4)
    res.render("landing",{products:products})
})
router.get("/logout",userController.logout)
router.get("/product/:id",productUserController.renderProduct)

router.get("/profile",isLoggedin,userController.renderProfile)
router.get("/userDetails",isLoggedin,userController.renderUserDetails)
router.post("/user/edit",userController.editUser)

router.get("/bookShop",userController.renderBook)

router.get("/orders",orderController.renderOrders)
router.get("/placeOrder",orderController.renderPlaceOrder)


router.use(isLoggedOut)

router.get("/login",userController.renderLogin)
router.post("/login", userController.userLogin)

router.post("/sendForgotLink",userController.sendForgotLink)
router.get("/forgotPasswordEmail",userController.renderForgotPasswordEmail)

router.post("/updatePassword",userController.updatePassword)

router.get('/resetPassword/:id',userController.renderResetPassword)

router.get("/signup", userController.renderSignup)
router.post("/signup", userController.register)

router.get("/otp",userController.renderEmailOtp)
router.post("/otp", userController.validateOtp)

router.get("/resend",userController.resendOtp)

module.exports = router