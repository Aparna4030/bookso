const asynchandler = require("express-async-handler")
const Cart = require("../../models/cartModel")
const Product = require("../../models/productModel")
const User = require("../../models/userModel")
const Wishlist = require("../../models/wishlistModel")



const renderWishlist = asynchandler(async(req,res)=>{
const wishlists =(await Wishlist.find({userId:req.session.userId}).populate('productId')).map(item => item.productId);
// console.log(wishlists)

    res.render("wishlist",{wishlists})
})

const addToWishlist = asynchandler(async(req,res)=>{
    const userId = req.session.userId;
    const productId = req.params.id;
    const existingWishlistItem = await Wishlist.findOne({ userId, productId });
    if (existingWishlistItem) {
        return res.status(409).json({ message: "Product already exists in the wishlist" });
    }else{
        const wishlist = new Wishlist({
            userId:req.session.userId,
            productId:req.params.id,
        })
        await wishlist.save()
    res.status(201).json({message:":Added to Wishlist"})
    }
   
    
})

const removeWishlist = asynchandler(async(req, res) => {
    // console.log("incontrrrrrrrrrrrrrroler")
    const removedItem = await Wishlist.deleteOne({
        userId: req.session.userId,
        productId: req.params.id
    });
    // console.log(removedItem)
    res.redirect('/wishlist')
});

module.exports = {renderWishlist,addToWishlist,removeWishlist}
