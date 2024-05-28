const mongoose = require ('mongoose')
const asynchandler = require("express-async-handler")
const Coupon=require("../../models/couponModel")
const formatDate = require('../../utils/formatDate')
const convertToDate = require('../../utils/converttoDate')



const renderaddCoupon = asynchandler((req,res)=>{
    res.render('couponAdmin')
})


const addCoupon = asynchandler(async(req,res)=>{
    const existingCoupon = await Coupon.findOne({couponCodes:req.body.coupon_code})
    if(existingCoupon){
        return res.redirect('/admin/listCoupon')
    }
    const coupon = new Coupon({
        startDate:req.body.start_date,
        endDate:req.body.expiry_date,
        discount_value:req.body.discount,
        usedUserCount:req.body.used_coupon,
        couponCodes:req.body.coupon_code,
        PurchaseLimit:req.body.max_count,
    })
    const couponAdded = await coupon.save()
    res.redirect("/admin/listCoupon")
})

const listCoupon = asynchandler(async(req,res)=>{   
    const coupons = await Coupon.find({}).lean().sort({ createdAt: -1 })
   coupons.forEach(coupon=>{
   coupon.startDate=formatDate(coupon.startDate)
   coupon.endDate=formatDate(coupon.endDate)
   })
    res.render("couponAdminList",{coupons})
})

const deleteCoupon = asynchandler(async (req, res) => {
    const deleteCoupo = await Coupon.deleteOne({ _id: req.params.id })
    res.redirect("/admin/listCoupon")
})

module.exports = {deleteCoupon,renderaddCoupon,addCoupon,listCoupon}