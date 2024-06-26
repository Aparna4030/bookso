const mongoose  = require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    wallet:{
        type:Number,
        default:0
    }



},{timestamps:true})

const userModel = mongoose.model('User',userSchema)
module.exports = userModel