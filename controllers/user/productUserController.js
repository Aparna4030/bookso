const Product = require("../../models/productModel")
const Cart = require("../../models/cartModel")
const asynchandler = require("express-async-handler")
const { render } = require("express/lib/response")


const renderProduct = asynchandler(async (req, res) => {
    // console.log(req.params.id)
    let cartQty = null
    const product = await Product.findOne({ _id: req.params.id })
    if (req.session.userId) {
        const cart = await Cart.findOne({ userId: req.session.userId })
        cart.products.forEach(product => {
            if(product.productId.toString() === req.params.id.toString()){
                cartQty = product.qty
            }
        });
    }
    res.render("productDetail", { product,cartQty })
})

module.exports = { renderProduct }