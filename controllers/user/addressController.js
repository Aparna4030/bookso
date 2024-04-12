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


const renderEditAddress = asynchandler(async(req,res)=>{
    const address = await Address.findOne({_id: req.params.id})
    res.render("editAddress",{address})
})

const editAddress = asynchandler(async(req,res)=>{
    const {name,phone,pincode,locality,address,city,landmark} = req.body
    console.log("AddddddRrrrrrrrrreeeeeeesssssssss",req.body)
    const addrss = await Address.updateOne({ _id:req.params.id }, { $set: { name,phone,pincode,locality,address,city,landmark } })
    res.redirect("/address")
})

const deleteAddress = asynchandler(async (req, res) => {
    const deleteAdd = await Address.deleteOne({ _id: req.params.id })
    res.redirect("/address")
})
module.exports = {  renderEditAddress,editAddress,renderaddAddress, addAddress, deleteAddress }
