const mongoose = require("mongoose")
const wishlistSchema = new mongoose.Schema({

    userId: {
        type: mongoose.mongo.ObjectId,
        required: true,
        ref: "User"
    },
    productId: {
        type: mongoose.mongo.ObjectId,
        required: true,
        ref: "Product"
    },

}, { timestamps: true })

const wishlistModel = mongoose.model('Wishlist', wishlistSchema)
module.exports = wishlistModel;