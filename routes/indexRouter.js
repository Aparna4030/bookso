const express = require('express');
const userController = require('../controllers/userController');
const adminController = require("../controllers/adminController");
const { isLoggedin,isLoggedOut} = require("../middlewares/auth_middleware");
const router = express.Router();

router.get("/", (req, res) => {
    console.log(req.session.userId);

    res.render("landing")
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