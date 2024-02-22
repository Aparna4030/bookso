const mongoose = require("mongoose")
const addressSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.mongo.ObjectId,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    pincode:{
        type:Number,
        required:true
    },
    locality:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    landmark:{
        type:String,
        required:true,
    },

},{timestamps:true})

const addressModel = mongoose.model('address',addressSchema)
module.exports = addressModel;