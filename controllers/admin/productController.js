const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const asynchandler = require("express-async-handler")

const renderProducts = asynchandler(async(req, res) => {
    const products = await Product.find().populate('category_id')
    let message = null
    if(req.session.message){
        message=req.session.message;
        req.session.message=null
    }
    console.log(products)
   const filteredProducts = products.filter(pro=>{
       return pro.category_id.isListed;  
    })


    res.render("products",{filteredProducts,message:message})
})

const renderaddProduct = asynchandler( async (req, res) => {
    const categories = await Category.find({isListed:true},{name:1})
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

    await product.save()
    res.redirect("/admin/products")

})

const renderEditProduct = asynchandler(async(req,res)=>{
    const product = await Product.findOne({ _id: req.params.id })
    const categories = await Category.find()
    console.log(product);
    console.log(categories)
    res.render("editProduct",{product,categories})
})

const editProduct = asynchandler( async (req, res) => {
    //  const { name, description,} = req.body
    console.log(req.files)
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

const searchProduct = asynchandler(async(req,res)=>{
    const searchString = req.query.search
    const products = await Product.find({name:{$regex: searchString}})
    res.json(products);
})

module.exports ={searchProduct,listProducts,unlistProducts,renderProducts,renderaddProduct,addProduct,renderEditProduct,editProduct}