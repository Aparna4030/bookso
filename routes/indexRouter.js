const express = require('express')
const userController = require('../controllers/userController');
const router = express.Router()


router.get("/login",userController.renderLogin)
router.get("/signup",userController.renderSignup)
router.post("/signup",userController.register)
router.post("/otp",userController.validateOtp)
module.exports = router