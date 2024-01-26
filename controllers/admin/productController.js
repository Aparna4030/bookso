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

const renderEditProduct = asynchandler(async(req,res)=>{
    const product = await Product.findOne({ _id: req.params.id })
    const categories = await Category.find()
    res.render("editProduct",{product,categories})
})

const editProduct = asynchandler( async (req, res) => {
    //  const { name, description,} = req.body
    console.log("hellohellohello",req.files)
    console.log("okeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",req.body)
    const product = await Product.updateOne({_id:req.params.id}, { $set: { 
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
        description: req.body.description, } })

        console.log('updastessss',product)
     res.redirect("/admin/products")
})


const listProducts = asynchandler (async (req, res) => {
    const productId = req.params.id
    const productData = await Product.updateOne({ _id: productId }, { $set: { isListed: true } })
    res.redirect("/admin/products")
})

const unlistProducts = asynchandler(async (req, res) => {
    const productId = req.params.id
    const productData = await Product.updateOne({ _id: productId }, { $set: { isListed: false } })
    res.redirect("/admin/products")
})


module.exports ={listProducts,unlistProducts,renderProducts,renderaddProduct,addProduct,renderEditProduct,editProduct}