const mongoose = require ('mongoose')
const couponSchema = new mongoose.Schema({
    couponCodes:{
        type:String,
        required:true,
    },
    discount_value:{
        type:Number,
        required:true,
    },
    PurchaseLimit:{
        type:Number,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    }, 
    usedUserCount:{
        type:Number,
        default:0,
    },
    
    
},{timestamps:true})
const couponModel = mongoose.model('Coupon',couponSchema)
module.exports=couponModel;