const session = require("express-session")
const User = require("../models/userModel")
const sendOTPemail = require("../utils/sendEmail")
const bcrypt = require("bcrypt")
const { redirect } = require("express/lib/response")



const renderLogin = (req, res) => {
    let message = null
    if(req.session.message){
        message = req.session.message
        req.session.message = null
    }
    res.render("login",{message:message})
}

const userLogin = async (req,res)=>{
    console.log(req.body)
 
    const existingUser = await User.findOne({email:req.body.email})
    console.log(existingUser)
    if(!existingUser){
        console.log('inside the existing..')
        req.session.message = "User does not exist"
        res.redirect("/login")
    }else{

        let valid = await bcrypt.compare(req.body.password,existingUser.password)
        
            if(existingUser.isBlocked){
                valid = false;
            }
            if(valid){
                req.session.userId = existingUser._id
                console.log(req.session.userId);
                res.redirect("/")
            }else{
                req.session.message = "Password don't match"
                if(existingUser.isBlocked){
                    req.session.message = "User Blocked"
                }
                res.redirect("/login")
            }
        }
    }

const renderSignup = (req, res) => {
    let message = null
    if (req.session.message) {
        message = req.session.message
        req.session.message = null
    }
    res.render("signup", { message: message })
}

const register = async (req, res) => {
    const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }]}, {})
    if (existingUser) {
        req.session.message = "User Exist"
        res.redirect("/signup")
    }else{
        const otp = await sendOTPemail(req.body.email)
        req.session.user = req.body
        req.session.user.otp = otp
        req.session.user.time = Date.now()
        res.redirect("/otp")
    }
}

const renderEmailOtp = (req,res)=>{
    let message = null;
     if(req.session.message){
        message = req.session.message
        req.session.message = null
    } 
    res.render("emailOtp",{message:message})
}

const resendOtp =async (req,res)=>{
 const reOtp = await sendOTPemail(req.session.user.email)
 console.log(req.session)
 console.log(req.session.user.email)
 req.session.user.otp = reOtp
 req.session.user.time = Date.now()
 res.redirect("/otp")
}

const validateOtp = async (req, res) => {
    const expiryTime = Date.now()-req.session.user.time;
    if(expiryTime>1000*60*5){
        req.session.message = "Otp Expired"
        res.redirect("/otp")
    }
    const hashedPassword = await bcrypt.hash(req.session.user.password, 10)
    try {
        if (req.session.user.otp.toString() === req.body.otp.toString()) {
            console.log(req.session.user)
            const newUser = new User({
                name: req.session.user.name,
                email: req.session.user.email,
                phone: req.session.user.phone*1, //multiplying by one to change the type string to number in this case.
                password: hashedPassword
            })

            const data = await newUser.save();
            req.session.user = null
            res.redirect("/login")
        } else {
            req.session.message = "Invalid OTP"
            res.redirect("/otp")
            // res.redirect("/signup")
        }
    }
    catch(error){
        console.log(error)
        req.session.message = "Something went wrong"
        res.redirect("/signup")
    }
}


const logout = (req,res)=>{
    console.log('ok')
    console.log(req.session.userId)
    req.session.userId = null
    console.log(req.session.userId)
    res.locals.isLoggedin = null;
    res.redirect("/")
}

module.exports = { renderLogin, renderSignup, register, validateOtp, userLogin,logout,renderEmailOtp,resendOtp}