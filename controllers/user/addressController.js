const Address = require("../../models/addressModel")
const asynchandler = require("express-async-handler")



const renderaddAddress = asynchandler(async (req, res) => {
    const addresses = await Address.find({ userId: req.session.userId })
    res.render("addAddress", { addresses })
})

const addAddress = asynchandler(async (req, res) => {
    console.log(req.body)
    const address = new Address({
        name: req.body.name,
        userId: req.session.userId,
        phone: req.body.phone * 1,
        pincode: req.body.pincode * 1,
        locality: req.body.locality,
        address: req.body.address,
        city: req.body.city,
        landmark: req.body.landmark,
    })
    await address.save()
    res.redirect("/address")
})


const deleteAddress = asynchandler(async (req, res) => {
    const deleteAdd = await Address.deleteOne({ _id: req.params.id })
    res.redirect("/address")
})
module.exports = { renderaddAddress, addAddress, deleteAddress }
