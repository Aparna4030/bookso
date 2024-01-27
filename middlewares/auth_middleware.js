const User = require("../models/userModel")

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

module.exports = {isLoggedin,isLoggedOut,adminIsLoggedIn,adminIsLoggedOut,isBlockedMiddleware}