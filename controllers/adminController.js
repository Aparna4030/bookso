const User = require("../models/userModel")
const Product = require("../models/productModel")
const Category = require("../models/categoryModel")

const renderLogin = (req, res) => {
    let message = null
    if(req.session.message){
        message = req.session.message
        req.session.message = null
    }
    res.render("adminLogin",{message:message})
}

const adminLogin = (req, res) => {
    if (req.body.email === "admin42069@bookso.com" && req.body.password === "Admin@123") {
        req.session.isAdmin = true;
        res.redirect("/admin")
    }
    else{
        req.session.message = "Invalid Credentials"
        res.redirect('/admin/login')
    }
}

const renderAdminPanel = (req, res) => {
    res.render("adminpanel")
}

const renderCustomers = async (req, res) => {
    const users = await User.find({}, { password: 0 })
    console.log(users)
    res.render("customers", { users })
}

const block = async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: true } })
    res.redirect("/admin/customers")
}

const unblock = async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: false } })
    res.redirect("/admin/customers")
}

const renderCategory = async (req, res) => {
    const categories = await Category.find()
    res.render("category", { categories })
}

const addCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    })
    const data = await category.save()
    res.redirect("/admin/category")
}

const listCategory = async (req, res) => {
    const categoryId = req.params.id
    const categoryData = await Category.updateOne({ _id: categoryId }, { $set: { isListed: true } })
    res.redirect("/admin/category")
}

const unlistCategory = async (req, res) => {
    const categoryId = req.params.id
    const categoryData = await Category.updateOne({ _id: categoryId }, { $set: { isListed: false } })
    res.redirect("/admin/category")
}

const rendereditCategory = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id })
    console.log(category)
    res.render("editCategory", { category })
}

const editCategory = async (req, res) => {
    const { name, description, id } = req.body
    console.log(req.body)
    const category = await Category.updateOne({ _id: id }, { $set: { name, description } })
    res.redirect("/admin/category")
}


const renderProducts = async(req, res) => {
    const products = await Product.find()
    res.render("products",{products})
}

const renderaddProduct = async (req, res) => {
    const categories = await Category.find()
    res.render("addProduct", { categories })
}
const addProduct = async (req, res) => {

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
    res.redirect("/admin")


}

module.exports = {
    renderLogin,
    adminLogin,
    renderAdminPanel,
    renderCustomers,
    block,
    unblock,
    renderCategory,
    addCategory,
    listCategory,
    unlistCategory,
    rendereditCategory,
    editCategory,
    renderProducts,
    renderaddProduct,
    addProduct,
}
