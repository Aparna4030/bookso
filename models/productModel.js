const mongoose = require("mongoose")
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    publication:{
        type:String,
        required:true,
    },
    category_id:{
        type:mongoose.mongo.ObjectId,
        required:true,
        ref:'Category'
    },
    author:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    language:{
        type:String,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: "Quantity must be non-negative"
        }
    },
    isListed:{
        type:Boolean,
        default:true,
    },
    image:{
        type:[String],
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
},{timestamps:true})

const productModel = mongoose.model('Product',productSchema)
module.exports = productModel