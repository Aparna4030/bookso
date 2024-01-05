

const renderLogin = (req,res)=>{
    res.render("adminLogin")
}

const adminLogin = (req,res)=>{
    if(req.body.email === "admin42069@bookso.com" && req.body.password === "Admin@123"){
            req.session.isAdmin = true;
            res.redirect("/admin")
    }
}

const renderAdminPanel = (req,res)=>{
 res.render("adminpanel")
}

module.exports = {renderLogin,adminLogin,renderAdminPanel}