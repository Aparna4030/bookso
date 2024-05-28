const express = require('express');
const userController = require('../controllers/user/userController');
const productUserController = require("../controllers/user/productUserController");
const addressController = require("../controllers/user/addressController");
const orderController = require("../controllers/user/orderController");
const wishlistController = require("../controllers/user/wishlistController");
const cartController = require("../controllers/user/cartController");
const couponController = require("../controllers/user/couponController")
const Product = require("../models/productModel");
const { isLoggedin, isLoggedOut } = require("../middlewares/auth_middleware");
const router = express.Router();
const Order = require("../models/ordersModel")

router.get("/search", userController.renderSearch)
router.post("/search", userController.renderFilterSearch)


router.get("/", async (req, res) => {
  const products = await Order.aggregate([{ $unwind: "$items" }, { $group: { _id: "$items.productId", count: { $sum: 1 } } }, { $project: { "items.productId": 1, count: 1 } }, { $lookup: { from: "products", localField: '_id', foreignField: '_id', as: 'product' } }, { $sort: { count: -1 } }])
  const filteredProducts = products.map(product =>{
    return product.product[0]
  })
  res.render("landing", { products: filteredProducts })
})
router.get("/logout",isLoggedin,userController.logout)
router.get("/wallet/razorpay",isLoggedin,userController.renderRazorPay)
router.post("/wallet/add/:amount",isLoggedin,userController.addWalletMoney)

router.get("/product/:id",productUserController.renderProduct)

router.get("/profile", isLoggedin, userController.renderProfile)
router.get("/userDetails", isLoggedin, userController.renderUserDetails)
router.post("/user/edit",  isLoggedin,userController.editUser)

router.get("/bookShop", userController.renderBook)
router.get("/wishlist/delete/:id",  isLoggedin,wishlistController.removeWishlist)
router.get("/wishlist",  isLoggedin,wishlistController.renderWishlist)
router.post("/wishlist/:id", isLoggedin, wishlistController.addToWishlist)
router.get("/addCoupon/:couponCode",  isLoggedin,couponController.availCoupon)
router.get("/transactions", isLoggedin, orderController.transactionList)
router.get("/userOrders",isLoggedin,orderController.renderUserOrders)
router.get("/userOrderDetails/:id", isLoggedin,orderController.renderUserOderDetails)


router.use(isLoggedOut)

router.get("/login", userController.renderLogin)
router.post("/login", userController.userLogin)

router.post("/sendForgotLink", userController.sendForgotLink)
router.get("/forgotPasswordEmail", userController.renderForgotPasswordEmail)

router.post("/updatePassword", userController.updatePassword)

router.get('/resetPassword/:id', userController.renderResetPassword)

router.get("/signup", userController.renderSignup)
router.post("/signup", userController.register)

router.get("/otp", userController.renderEmailOtp)
router.post("/otp", userController.validateOtp)

router.get("/resend", userController.resendOtp)



module.exports = router