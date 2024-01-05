const mongoose = require("mongoose")
const productSchema= new mongoose.schema({
    name:{
        type:string,
        required:true,
    },
    publication:{
        type:string,
        required:true,
    },
    category_id:{
        type:mongoose.mongo.ObjectId,
        required:true,
    },
    author:{
        type:string,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    isListed:{
        type:Boolean,
        default:false,
    },
    image:{
        type:string,
        required:true,
    },
    description:{
        type:string,
        required:true,
    }
},{timestamps:true})

const productModal = mongoose.model('Product',productSchema)
module.exports = productModal