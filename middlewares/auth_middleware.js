
const isLoggedin = (req,res,next)=>{
    console.log('in middleware')
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

module.exports = {isLoggedin,isLoggedOut,adminIsLoggedIn,adminIsLoggedOut}