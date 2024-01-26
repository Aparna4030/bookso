const asynchandler = require("express-async-handler")
const User = require("../../models/userModel")


const renderLogin = asynchandler( (req, res) => {
    let message = null
    if(req.session.message){
        message = req.session.message
        req.session.message = null
    }
    res.render("adminLogin",{message:message})
})

const adminLogin = asynchandler((req, res) => {
    if (req.body.email === "admin42069@bookso.com" && req.body.password === "Admin@123") {
        req.session.isAdmin = true;
        res.redirect("/admin")
    }
    else{
        req.session.message = "Invalid Credentials"
        res.redirect('/admin/login')
    }
})

const renderAdminPanel = asynchandler( (req, res) => {
    res.render("adminpanel")
})

const renderCustomers = asynchandler( async (req, res) => {
    const users = await User.find({}, { password: 0 })
    console.log(users)
    res.render("customers", { users })
})

const block = asynchandler( async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: true } })
    res.redirect("/admin/customers")
})

const unblock = asynchandler( async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: false } })
    res.redirect("/admin/customers")
})

module.exports = {
    renderLogin,
    adminLogin,
    renderAdminPanel,
    renderCustomers,
    block,
    unblock,
   
}
