const session = require("express-session")
const asynchandler = require("express-async-handler")
const User = require("../../models/userModel")
const Product = require("../../models/productModel")
const wishlist = require("../../models/wishlistModel")
const Category = require("../../models/categoryModel")
const sendOTPemail = require("../../utils/sendEmail")
const sendForgotPasswordLink = require("../../utils/sendForgotEmailLink")
const bcrypt = require("bcrypt")
const { redirect } = require("express/lib/response")



const renderLogin = asynchandler((req, res) => {
    let message = null
    if (req.session.message) {
        message = req.session.message
        req.session.message = null
    }
    res.render("login", { message: message })
})

const userLogin = asynchandler(async (req, res) => {

    const existingUser = await User.findOne({ email: req.body.email })
    if (!existingUser) {
        req.session.message = "User does not exist"
        res.redirect("/login")
    } else {

        let valid = await bcrypt.compare(req.body.password, existingUser.password)

        if (existingUser.isBlocked) {
            valid = false;
        }
        if (valid) {
            req.session.userId = existingUser._id
            res.redirect("/")
        } else {
            req.session.message = "Password don't match"
            if (existingUser.isBlocked) {
                req.session.message = "User Blocked"
            }
            res.redirect("/login")
        }
    }
})

// just rendering the page of email to send the forgot password otp //
const renderForgotPasswordEmail = asynchandler((req, res) => {
    res.render("forgotPasswordEmail")
})

const sendForgotLink = asynchandler(async (req, res) => {
    const email = req.body.email
    req.session.email = email;
    const secret = await sendForgotPasswordLink(email)
    req.session.secret = secret;
    req.session.message = "Email sent successfully"
    res.redirect('/login')
})

const renderResetPassword = asynchandler(async (req, res) => {
    if (req.params.id === req.session.secret) {
        req.session.secret = null;
        res.render('forgotPassword')
    } else {
        req.session.secret = null;
        req.session.message = "Error occured"
        res.redirect('/login')
    }
})

const updatePassword = asynchandler(async (req, res) => {
    const password = req.body.password
    if (!req.session.email) throw new Error;
    const email = req.session.email;
    req.session.email = null;
    const hashedPassword = await bcrypt.hash(password, 10)

    const data = await User.updateOne({ email }, { $set: { password: hashedPassword } });
    req.session.message = "Changed successfully"
    res.redirect('/login')

})



const renderSignup = asynchandler((req, res) => {

    let message = null
    if (req.session.message) {
        message = req.session.message
        req.session.message = null
    }
    res.render("signup", { message: message })
})

const register = asynchandler(async (req, res) => {
    const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] }, {})
    if (existingUser) {
        req.session.message = "User Exist"
        res.redirect("/signup")
    } else {
        const otp = await sendOTPemail(req.body.email)
        req.session.user = req.body
        req.session.user.otp = otp
        req.session.user.time = Date.now()
        res.redirect("/otp")
    }
})

const renderEmailOtp = asynchandler((req, res) => {
    let message = null;
    if (req.session.message) {
        message = req.session.message
        req.session.message = null
    }
    res.render("emailOtp", { message: message })
})


const resendOtp = asynchandler(async (req, res) => {
    const reOtp = await sendOTPemail(req.session.user.email)
    req.session.user.otp = reOtp
    req.session.user.time = Date.now()
    res.redirect("/otp")
})

const renderRazorPay = asynchandler(async(req,res)=>{
    console.log('hahahahhakjfhkehfhabelll')
    const amount = req.query.amount;
    const callback = `http://localhost:8080/wallet/add/${amount}`
    res.render('razorpay',{amount,callback});
})

const addWalletMoney = asynchandler(async(req,res)=>{
    const amount = req.params.amount;
    await User.updateOne({_id:req.session.userId},{$inc:{wallet:amount*1}})
    res.redirect('/profile')
})

const validateOtp = asynchandler(async (req, res) => {
    const expiryTime = Date.now() - req.session.user.time;
    if (expiryTime > 1000 * 60 * 5) {
        req.session.message = "Otp Expired"
        res.redirect("/otp")
    }
    const hashedPassword = await bcrypt.hash(req.session.user.password, 10)
    try {
        if (req.session.user.otp.toString() === req.body.otp.toString()) {
            const newUser = new User({
                name: req.session.user.name,
                email: req.session.user.email,
                phone: req.session.user.phone * 1, //multiplying by one to change the type string to number in this case.
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
    catch (error) {
        console.log(error)
        req.session.message = "Something went wrong"
        res.redirect("/signup")
    }
})


const renderProfile = asynchandler(async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId })
    res.render("profile", { user })
})

const renderUserDetails = asynchandler(async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId })
    console.log(user)
    let message = null;
    if (req.session.message) {
        message = req.session.message
        req.session.message = null;
    }
    res.render("userDetails", { user, message })
})


const editUser = asynchandler(async (req, res) => {
    console.log("ediiiiiiiiiittttttttt", req.body)
    const { name, email, phone, password, newPassword, confirmPassword } = req.body
    const user = await User.findOne({ _id: req.session.userId })
    // console.log("usssseeeeeeeerrrrrr",user)
    user.name = name;
    user.email = email;
    user.phone = phone;
    if (password) {

        if (await bcrypt.compare(newPassword, user.password)) {
            req.session.message = "This is your old password"
            res.redirect('/userDetails')
        }
        if (!await bcrypt.compare(password, user.password)) {
            // console.log("helloooooo")
            req.session.message = "Invalid Password"
            res.redirect('/userDetails')
        }
        if (newPassword !== confirmPassword) {
            req.session.message = "Password don't match"
            res.redirect('/userDetails')
        }

        user.password = await bcrypt.hash(newPassword, 10);

    }
    await user.save()
    res.redirect('/userDetails')
    // console.log("Usssssseeeeeeeerrrr", user)

})


const renderBook = asynchandler(async (req, res) => {
    const products = await Product.find({ isListed: true }).populate('category_id')
    // console.log("prrrrrrrrooooooooduuucccccccccts",products)
    const filteredProducts = products.filter(product => {
        return product.category_id.isListed && product.stock > 0

    })
    console.log(filteredProducts)
    res.render("book", { products: filteredProducts })
})


// const renderSearch = asynchandler(async (req, res) => {
//     // const searchString = req.query.q;
//     const { q: searchString, cat: category, sort, lang } = req.query;
//     console.log({ searchString, category, sort })
//     console.log({ searchString })
//     const categories = await Category.find()
//     let searchResults = await Product.find({ $or: [{ name: { $regex: new RegExp(searchString, 'i') } }, { description: { $regex: new RegExp(searchString, 'i') } }] });
//     if (category)
//         searchResults = searchResults.filter(prdct => prdct.category_id.toString() === category?.toString())
//     if (sort)
//         searchResults = searchResults.sort((a, b) => {
//             if (sort === 'lth') return a.price - b.price
//             return b.price - a.price
//         })
//     if(lang)
//         searchResults = searchResults.filter(pro => pro.language === lang)    
//     const wishlistProducts = await wishlist.find({ userId: req.session.userId })
//     console.log("ssssssseeeeeeeaaaaaaaaaarrrrrrrccccccchh", searchResults)
//     res.render("searchPage", { searchResults, wishlistProducts, categories, q: searchString, cat: category, sort,lang })
// })


const renderSearch = asynchandler(async (req, res) => {
    const { q: searchString, cat: category, sort, lang } = req.query;
    console.log({ searchString, category, sort });

    const categories = await Category.find();
    let searchResults = await Product.find({ $or: [{ name: { $regex: new RegExp(searchString, 'i') } }, { description: { $regex: new RegExp(searchString, 'i') } }] });

    if (category)
        searchResults = searchResults.filter(prdct => prdct.category_id.toString() === category?.toString());

    if (sort) {
        if (sort === 'lth') {
           
            searchResults.sort((a, b) => a.price - b.price);
        } else if (sort === 'htl') {
            
            searchResults.sort((a, b) => b.price - a.price);
        } else if (sort === 'az') {
            
            searchResults.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'za') {
           
            searchResults.sort((a, b) => b.name.localeCompare(a.name));
        }
    }

    if (lang)
        searchResults = searchResults.filter(pro => pro.language === lang);

    const wishlistProducts = await wishlist.find({ userId: req.session.userId });
    console.log("Search Results:", searchResults);
    res.render("searchPage", { searchResults, wishlistProducts, categories, q: searchString, cat: category, sort, lang });
});




const logout = asynchandler((req, res) => {
    req.session.userId = null
    req.session.isAdmin = null
    res.locals.isLoggedin = null;
    res.redirect("/")
})

module.exports = { renderSearch, editUser, renderBook, renderUserDetails, renderProfile, updatePassword, renderResetPassword, renderLogin, sendForgotLink, renderForgotPasswordEmail, renderSignup, register, validateOtp, userLogin, logout, renderEmailOtp, resendOtp,renderRazorPay,addWalletMoney }