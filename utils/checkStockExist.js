const Product = require("../models/productModel")

module.exports = async(productId,qty)=>{

    const product = await Product.findOne({_id:productId});


    return product? product.stock >= qty : false;
}