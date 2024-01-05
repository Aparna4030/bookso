const User = require("../models/userModal")
const sendOTPemail = require("../utils/sendEmail")
const bcrypt = require("bcrypt")



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
    const valid = await bcrypt.compare(req.body.password,existingUser.password)
    if(valid){
        req.session.userId = existingUser._id
        console.log(req.session.userId);
        res.redirect("/")
    }else{
        req.session.message = "Invalid credentials"
        res.redirect("/login")
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
    }
    const otp = await sendOTPemail(req.body.email)
    req.session.user = req.body
    req.session.user.otp = otp
    res.render("emailOtp")
}


const validateOtp = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.session.user.password, 10)

    try {
        if (req.session.user.otp.toString() === req.body.otp.toString()) {
            console.log(req.session.user)
            const newUser = new User({
                name: req.session.user.name,
                email: req.session.user.email,
                phone: req.session.user.phone * 1, //multiplying by one to change the type string to number in this case.
                password: hashedPassword
            })

            const data = await newUser.save();
            res.redirect("/login")
        } else {
            req.session.message = "Invalid OTP"
            res.redirect("/signup")
        }
    }
    catch(error){
        console.log(error)
        req.session.message = "Something went wrong"
        res.redirect("/signup")
    }
}





module.exports = { renderLogin, renderSignup, register, validateOtp, userLogin}