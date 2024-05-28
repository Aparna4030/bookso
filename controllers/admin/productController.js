const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const asynchandler = require("express-async-handler")

const renderProducts = asynchandler(async (req, res) => {
    const products = await Product.find().populate('category_id').sort({ createdAt: -1 })
    let message = null
    if (req.session.message) {
        message = req.session.message;
        req.session.message = null
    }
    const filteredProducts = products.filter(pro => {
        return pro?.category_id?.isListed;
    })


    res.render("products", { filteredProducts, message: message })
})

const renderaddProduct = asynchandler(async (req, res) => {
    const categories = await Category.find({ isListed: true }, { name: 1 })
    res.render("addProduct", { categories })
})


const addProduct = asynchandler(async (req, res) => {
    const product = new Product({
        name: req.body.name,
        publication: req.body.Publisher,
        category_id: req.body.category,
        author: req.body.author,
        price: parseInt(req.body.price),
        language: req.body.language,
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

const renderEditProduct = asynchandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id })
    const categories = await Category.find()
    res.render("editProduct", { product, categories })
})

const editProduct = asynchandler(async (req, res) => {
    let product = await Product.findOne({_id: req.params.id});

    let images;

    if (req.files?.length > 0) {
        images = req.files.map(file => {
            return file.filename
        })
        product.image.push(...images)
    }
    product.name = req.body.name;
    product.publication = req.body.Publisher;
    product.category_id = req.body.category;
    product.author = req.body.author;
    product.price = parseInt(req.body.price);
    product.language = req.body.language;
    product.discount = parseInt(req.body.discount);
    product.stock = parseInt(req.body.stock);
    product.description = req.body.description;

    await product.save();

    res.redirect("/admin/products")
})


const listProducts = asynchandler(async (req, res) => {
    const productId = req.params.id
    const productData = await Product.updateOne({ _id: productId }, { $set: { isListed: true } })
    res.redirect("/admin/products")
})

const unlistProducts = asynchandler(async (req, res) => {
    const productId = req.params.id
    const productData = await Product.updateOne({ _id: productId }, { $set: { isListed: false } })
    res.redirect("/admin/products")
})

const searchProduct = asynchandler(async (req, res) => {
    const searchString = req.query.search
    const products = await Product.find({ name: { $regex: searchString } })
    res.json(products);
})


const fs = require('fs');
const path = require('path');


const deleteImage = asynchandler(async(req, res) => {
    const index = req.params.index;
    const productId = req.params.productId;
    const product = await Product.findOne({ _id: productId });
    const imagePath = product.image[index];
    product.image.splice(index, 1);
    await product.save();

    const fullPath = path.join(__dirname, '..', '../public/uploads', imagePath);
    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
            if (err) {
                return res.status(500).send('Error deleting image' + fullPath);
            }
            res.redirect(`/admin/editProduct/${productId}`);
        });
    } else {
        res.status(404).send('File not found');
    }
});





module.exports = {
    deleteImage, 
    searchProduct, 
    listProducts, 
    unlistProducts, 
    renderProducts, 
    renderaddProduct, 
    addProduct, 
    renderEditProduct, 
    editProduct }