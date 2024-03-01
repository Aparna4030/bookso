const Cart = require("../../models/cartModel")
const Product = require("../../models/productModel")
const asynchandler = require("express-async-handler")


const renderCart = asynchandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('products.productId')
    console.log(cart)
    const shippingCharge = 0.05
    res.render("cart", { shippingCharge, products: cart ? cart.products : [] });
})

const addToCart = asynchandler(async (req, res) => {
if(!req.session.userId){
    console.log('no userrrrrrrrrrrrrrrrrrrrrrr')
    res.status(401).json({status:401,message:"User Dosen't Exist"})
}
    const product = await Product.findOne({_id:req.body.productId})
    // console.log(product)

    //req.body => {productId, qty}
    const cart = await Cart.findOne({ userId: req.session.userId})
    // console.log(cart)
    if (cart) {
        const index = cart.products.findIndex(product => product.productId.toString() === req.body.productId.toString())
        if (index === -1) {
            cart.products.push(req.body)
            await cart.save()
        } else {
            if(cart.products[index].qty+req.body.qty>product.stock){
                res.status(400).json({status:400,message:"The requested quantity exceeds available stock."})
            }else{
                cart.products[index].qty = cart.products[index].qty + req.body.qty
                await cart.save()
            }
        }
    } else {
        const newCart = new Cart({
            userId: req.session.userId,
            products: [{ productId: req.body.productId, qty: req.body.qty }],
        })
        await newCart.save()
    }

    res.status(200).message("successful")


})


const increaseQuantity = asynchandler(async (req, res) => {

    console.log('hello')
    // /update qty
    const productId = req.params.productId;
    const currentQty = parseInt(req.params.qty);
    const updatedQty = currentQty + 1;
    const userId = req.session.userId;
    const { stock } = await Product.findOne({ _id: productId }, { stock: 1 })
    if (currentQty >= stock) {
        res.status(406).json({ message: "Out of Stock" })
        return;
    }
    const cart = await Cart.findOne({ userId })
    cart.products.forEach(product => {
        if (product.productId.toString() === productId.toString())
            product.qty = updatedQty
    });
    await cart.save();

    res.status(206).json({ message: updatedQty });

})


const decreaseQuantity = asynchandler(async (req, res) => {
    const productId = req.params.productId;
    const currentQty = parseInt(req.params.qty);
    const updatedQty = currentQty - 1; // Decrease the quantity by 1
    const userId = req.session.userId;
    const { stock } = await Product.findOne({ _id: productId }, { stock: 1 });

    if (updatedQty < 0) { // Prevent quantity from going below 0
        res.status(406).json({ message: "Quantity cannot be less than 0" });
        return;
    }

    const cart = await Cart.findOne({ userId });

    cart.products.forEach(product => {
        if (product.productId.toString() === productId.toString())
            product.qty = updatedQty;
    });

    await cart.save();

    res.status(206).json({ message: updatedQty });
});

const deleteCartItem = asynchandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.session.userId })
    const index = cart.products.findIndex(product => product.productId.toString() === req.params.id.toString())
    cart.products.splice(index, 1)
    await cart.save()
    res.redirect("/cart")
})





module.exports = { increaseQuantity,decreaseQuantity,deleteCartItem,renderCart,addToCart }