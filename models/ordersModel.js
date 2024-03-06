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
        pricePerItem:{
            type:Number,
            required:true,
        }
    }],
    address:{
        type:mongoose.mongo.ObjectId,
        required:true,
        ref:"address"
    },
    paymentMethod:{
        type:String,
        enum:["COD","Card"],
        required:true,
    },
    deliveryChrg:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        // required:true,
    },
    totalAmt:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum: ["Placed","Shipped","Delivered","Cancelled", "Returned"],
        default: "Placed",
    },
    productCancellation:{
        cancelStatus:{
            type:Boolean,
            default:false
        },
        description:{
            type:String,
        }
    },
    productReturned:{
        returnStatus:{
            type:Boolean,
            default:false,
        },
        description:{
            type:String,
        }
    }
    
},{timestamps:true})

const ordersModel = mongoose.model('Orders',ordersSchema)
module.exports = ordersModel;