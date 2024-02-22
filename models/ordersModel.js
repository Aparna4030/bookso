const mongoose = require("mongoose")
const ordersSchema = new mongoose.Schema({

    userId:{
        type:mongoose.mongo.ObjectId,
        required:true,
        ref:"User"
    },
    items:[{
        productId:{
            type:mongoose.mongo.ObjectId,
            required:true,
            ref:"Product"
        },
        qty:{
            type:Number,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        }
    }],
    address:{
        type:mongoose.mongo.ObjectId,
        required:true,
        ref:"Address"
    },
    paymentMthod:{
        type:String,
        required:true,
    },
    deliveryChrg:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    totalAmt:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum: ["Placed","Shipped","Delivered","Cancelled", "Returned"],
        default: "Placed",
    }

},{timestamps:true})

const ordersModel = mongoose.model('Orders',ordersSchema)
module.exports = ordersModel;