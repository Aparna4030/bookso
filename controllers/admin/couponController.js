const mongoose = require ('mongoose')
const asynchandler = require("express-async-handler")
const Coupon=require("../../models/couponModel")
const formatDate = require('../../utils/formatDate')
const convertToDate = require('../../utils/converttoDate')




const renderaddCoupon = asynchandler((req,res)=>{

    res.render('couponAdmin')
})


const addCoupon = asynchandler(async(req,res)=>{
    console.log(req.body)
    const startDate = convertToDate(req.body.start_date)
    const endDate = convertToDate(req.body.expiry_date)
    const coupon = new Coupon({
        startDate,
        endDate,
        discount_value:req.body.discount,
        usedUserCount:req.body.used_coupon,
        couponCodes:req.body.coupon_code,
        PurchaseLimit:req.body.max_count,
    })
    const coupondata = await coupon.save()
    res.redirect("/admin/listCoupon")
})

const listCoupon = asynchandler(async(req,res)=>{
    
    const coupons = await Coupon.find({}).lean()
    console.log("ooooooooooooooookkkkkkkkkkkkkkkeeeeeeeeeeeeee",coupons)
   coupons.forEach(coupon=>{
   coupon.startDate=formatDate(coupon.startDate)
   coupon.endDate=formatDate(coupon.endDate)
   })
    console.log("hellllllllloooooooo",coupons)
    res.render("couponAdminList",{coupons})
})


module.exports = {renderaddCoupon,addCoupon,listCoupon}