const mongoose = require ('mongoose')
const asynchandler = require("express-async-handler")
const Coupon=require("../../models/couponModel")
const formatDate = require('../../utils/formatDate')
const convertToDate = require('../../utils/converttoDate')


const availCoupon = asynchandler(async(req,res)=>{
    // console.log(req.params.couponCode)

    const coupon = await Coupon.findOne({couponCodes:req.params.couponCode})
    // console.log({coupon})
    if(!coupon){
        return res.status(404).json({success:false,message:"Coupon does not exist"})
    }else if(coupon.PurchaseLimit <= 0){
        return res.status(404).json({success:false,message:"Coupon Expired"})
    }else if(Date.now()<=coupon.startDate){
        return res.status(404).json({success:false,message:"Coupon Not Available"})
    }else if(Date.now()>=coupon.endDate){
        return res.status(404).json({success:false,message:"Coupon Available"})
    }
    coupon.PurchaseLimit = coupon.PurchaseLimit-1
    await coupon.save()
    return res.status(200).json({success:true,message:"Coupon Applied",discount:coupon.discount_value})
})


module.exports ={availCoupon}