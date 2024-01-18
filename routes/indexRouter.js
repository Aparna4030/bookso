const express = require('express');
const userController = require('../controllers/userController');
const adminController = require("../controllers/adminController");
const Product = require("../models/productModel");
const { isLoggedin,isLoggedOut} = require("../middlewares/auth_middleware");
const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find().limit(4)
    console.log(products)
    res.render("landing",{products:products})
})
router.get("/logout",userController.logout)
router.use(isLoggedOut)
router.get("/login",userController.renderLogin)
router.post("/login", userController.userLogin)
router.get("/signup", userController.renderSignup)
router.post("/signup", userController.register)

router.get("/otp",userController.renderEmailOtp)
router.post("/otp", userController.validateOtp)

router.get("/resend",userController.resendOtp)




// router.get("/admin",adminController.renderLogin)
// router.post("/admin",adminController.adminLogin)
// router.get("/adminpanel",adminController.renderAdminPanel)


module.exports = router