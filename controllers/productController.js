const Product = require("../models/productModel")


const renderProduct = async (req,res)=>{
    res.render("landing")
}

module.exports ={renderProduct}