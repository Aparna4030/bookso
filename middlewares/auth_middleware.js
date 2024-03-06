const User = require("../models/userModel")
const Cart = require("../models/cartModel")
const session = require("express-session")

const isBlockedMiddleware = async(req,res,next)=>{
    if(req.session.userId){
        const user = await User.findOne({_id:req.session.userId})
        if(user.isBlocked){
            req.session.userId = null;
            req.session.message = "User is Blocked"
            res.redirect("/login")     
        }else{
            next();
        }
    }else{
        next();
    }
}

const isLoggedin = (req,res,next)=>{
    if(req.session.userId ){
        next();
    }else{
        res.redirect("/")
    }
}

const isLoggedOut = (req,res,next)=>{
    if(!req.session.userId ){
        next();
    }else{
        res.redirect("/")
    }
}


const adminIsLoggedIn = (req,res,next)=>{
    if(req.session.isAdmin){
        next();
    }else{
        res.redirect("/admin/login")
    }
}

const adminIsLoggedOut = (req,res,next)=>{
    if(!req.session.isAdmin){
        next();
    }else{
        res.redirect("/admin")
    }
}



const disableCacheMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

const loggedInCart = (async(req, res, next) => {
    if (req.session.userId || req.session.isAdmin) {
        res.locals.isLoggedin = true;
        const cart = await Cart.findOne({userId:req.session.userId})
        res.locals.cartQty = cart?.products?.length
    } else {
        res.locals.isLoggedin = false;
        res.locals.cartQty = null;
    }
    next();
})



module.exports = {loggedInCart,
disableCacheMiddleware,
isLoggedin,
isLoggedOut,
adminIsLoggedIn,
adminIsLoggedOut,
isBlockedMiddleware}