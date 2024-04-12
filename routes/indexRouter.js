const express = require('express');
const userController = require('../controllers/user/userController');
const productUserController = require("../controllers/user/productUserController");
const addressController = require("../controllers/user/addressController");
const orderController = require("../controllers/user/orderController");
const wishlistController = require("../controllers/user/wishlistController");
const cartController = require("../controllers/user/cartController");
const couponController = require("../controllers/user/couponController")
const Product = require("../models/productModel");
const { isLoggedin,isLoggedOut} = require("../middlewares/auth_middleware");
const router = express.Router();

router.get("/search",userController.renderSearch)


router.get("/", async (req, res) => {
    const products = await Product.find({isListed:true}).limit().populate('category_id')
    const filteredProducts = products.filter(product=>{
        return product.category_id.isListed && product.stock > 0     
      })
    res.render("landing",{products:filteredProducts})
})
router.get("/logout",userController.logout)
router.get("/wallet/razorpay",userController.renderRazorPay)
router.post("/wallet/add/:amount",userController.addWalletMoney)
router.get("/product/:id",productUserController.renderProduct)

router.get("/profile",isLoggedin,userController.renderProfile)
router.get("/userDetails",isLoggedin,userController.renderUserDetails)
router.post("/user/edit",userController.editUser)

router.get("/bookShop",userController.renderBook)
router.get("/wishlist/delete/:id",wishlistController.removeWishlist)
router.get("/wishlist",wishlistController.renderWishlist)
router.post("/wishlist/:id",isLoggedin,wishlistController.addToWishlist)
router.get("/addCoupon/:couponCode",couponController.availCoupon)
router.get("/transactions",isLoggedin,orderController.transactionList)

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