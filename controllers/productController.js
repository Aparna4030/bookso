const Product = require("../models/productModel")


const renderProduct = async (req,res)=>{
    const product = await Product.findOne({_id:req.params.id})
    console.log(product)
    res.render("productDetail",{product})
}

module.exports ={renderProduct}