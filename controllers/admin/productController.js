const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const asynchandler = require("express-async-handler")

const renderProducts = asynchandler(async(req, res) => {
    const products = await Product.find()
    let message = null
    if(req.session.message){
        message=req.session.message;
        req.session.message=null
    }
    res.render("products",{products:products,message:message})
})

const renderaddProduct = asynchandler( async (req, res) => {
    const categories = await Category.find()
    res.render("addProduct", { categories })
})
const addProduct = asynchandler( async (req, res) => {

    const product = new Product({
        name: req.body.name,
        publication: req.body.Publisher,
        category_id: req.body.category,
        author: req.body.author,
        price: parseInt(req.body.price),
        language:req.body.language,
        discount: parseInt(req.body.discount),
        stock: parseInt(req.body.stock),
        image: req.files.map(file => {
            return file.filename
        }),
        description: req.body.description,
    })

    console.log(product)
    const data = await product.save()
    res.redirect("/admin/products")

})

module.exports ={renderProducts,renderaddProduct,addProduct,}