const mongoose = require ('mongoose')
const couponModel = require('./couponModel')
const couponSchema = new mongoose.Schema({
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    discount_value:{
        type:Number,
        required:true,
    },
    usedUserCount:{
        type:Number,
        default:0,
    },
    couponCodes:{
        type:String,
        required:true,
    },
    PurchaseLimit:{
        type:Number,
    },
})
const couponModel = mongoose.model('Coupon',couponSchema)
module.exports=couponModel;