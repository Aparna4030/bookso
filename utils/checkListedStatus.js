const productModel = require("../models/productModel")

module.exports = async (productId)=>{
    const product = await productModel.findOne({_id:productId});
    
    return product? product.isListed: false;
}