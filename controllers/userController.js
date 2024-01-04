const User = require("../models/userModal")
const sendOTPemail = require("../utils/sendEmail")

const renderLogin = (req, res) => {
    res.render("login")
}

const renderSignup = (req,res)=>{
    res.render("signup",{message:null})
}

const register = async(req,res)=>{
    const existingUser = await User.find({email:req.body.email})
    const otp = await sendOTPemail(req.body.email)
    req.session.user = req.body
    req.session.user.otp = otp
    res.render("emailOtp")
}


const validateOtp = (req,res)=>{
if(req.session.user.otp.toString() === req.body.otp.toString()){
    res.render("signup",{message:"done succeesfully"})
}
console.log(req.session.user)
    console.log(req.body.otp)
}
module.exports = {renderLogin,renderSignup,register,validateOtp}