const express = require('express');
const userController = require('../controllers/userController');
const adminController = require("../controllers/adminController");
const { isLoggedin } = require("../middlewares/auth_middleware");
const router = express.Router();

router.get("/", (req, res) => {
    console.log(req.session.userId);
    res.send('hello')
})
router.get("/login", isLoggedin, userController.renderLogin)
router.post("/login", userController.userLogin)
router.get("/signup", isLoggedin, userController.renderSignup)
router.post("/signup", userController.register)
router.post("/otp", userController.validateOtp)




// router.get("/admin",adminController.renderLogin)
// router.post("/admin",adminController.adminLogin)
// router.get("/adminpanel",adminController.renderAdminPanel)

module.exports = router