const Product = require("../../models/productModel")
const asynchandler = require("express-async-handler")


const renderProduct = asynchandler(async (req,res)=>{
    // console.log(req.params.id)
    const product = await Product.findOne({_id:req.params.id})
    console.log(product)
    res.render("productDetail",{product})
})

module.exports = {renderProduct}