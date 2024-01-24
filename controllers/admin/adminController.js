const asynchandler = require("express-async-handler")
const User = require("../../models/userModel")


const renderLogin = asynchandler( (req, res) => {
    let message = null
    if(req.session.message){
        message = req.session.message
        req.session.message = null
    }
    res.render("adminLogin",{message:message})
})

const adminLogin = asynchandler((req, res) => {
    if (req.body.email === "admin42069@bookso.com" && req.body.password === "Admin@123") {
        req.session.isAdmin = true;
        res.redirect("/admin")
    }
    else{
        req.session.message = "Invalid Credentials"
        res.redirect('/admin/login')
    }
})

const renderAdminPanel = asynchandler( (req, res) => {
    res.render("adminpanel")
})

const renderCustomers = asynchandler( async (req, res) => {
    const users = await User.find({}, { password: 0 })
    console.log(users)
    res.render("customers", { users })
})

const block = asynchandler( async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: true } })
    res.redirect("/admin/customers")
})

const unblock = asynchandler( async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: false } })
    res.redirect("/admin/customers")
})

// const renderCategory = asynchandler( async (req, res) => {
//     const categories = await Category.find()
//     let message = null
//     if(req.session.message){
//         message=req.session.message;
//         req.session.message=null
//     }
//     res.render("category", { categories,message })
// })

// const addCategory = asynchandler( async (req, res) => {

//     if(req.body.name.trim() === '' || req.body.description.trim() === ''){
//         req.session.message = 'Invalid details'
//         res.redirect('/admin/category')
//         return;
//     }


//     const existingCategory = await Category.find({name:req.body.name});
//     if(existingCategory){
//         req.session.message = "Category exists"
//         res.redirect('/admin/category')
//         return;
//     }
//     const category = new Category({
//         name: req.body.name,
//         description: req.body.description
//     })
//     const data = await category.save()
//     res.redirect("/admin/category")
// })

// const listCategory = asynchandler (async (req, res) => {
//     const categoryId = req.params.id
//     const categoryData = await Category.updateOne({ _id: categoryId }, { $set: { isListed: true } })
//     res.redirect("/admin/category")
// })

// const unlistCategory = asynchandler(async (req, res) => {
//     const categoryId = req.params.id
//     const categoryData = await Category.updateOne({ _id: categoryId }, { $set: { isListed: false } })
//     res.redirect("/admin/category")
// })


// const rendereditCategory = asynchandler( async (req, res) => {
//     const category = await Category.findOne({ _id: req.params.id })
//     console.log(category)
//     res.render("editCategory", { category })
// })

// const editCategory = asynchandler( async (req, res) => {
//     const { name, description, id } = req.body
//     console.log(req.body)
//     const category = await Category.updateOne({ _id: id }, { $set: { name, description } })
//     res.redirect("/admin/category")
// })


// const renderProducts = asynchandler(async(req, res) => {
//     const products = await Product.find()
//     let message = null
//     if(req.session.message){
//         message=req.session.message;
//         req.session.message=null
//     }
//     res.render("products",{products:products,message:message})
// })

// const renderaddProduct = asynchandler( async (req, res) => {
//     const categories = await Category.find()
//     res.render("addProduct", { categories })
// })
// const addProduct = asynchandler( async (req, res) => {

//     const product = new Product({
//         name: req.body.name,
//         publication: req.body.Publisher,
//         category_id: req.body.category,
//         author: req.body.author,
//         price: parseInt(req.body.price),
//         language:req.body.language,
//         discount: parseInt(req.body.discount),
//         stock: parseInt(req.body.stock),
//         image: req.files.map(file => {
//             return file.filename
//         }),
//         description: req.body.description,
//     })

//     console.log(product)
//     const data = await product.save()
//     res.redirect("/admin")


// })

module.exports = {
    renderLogin,
    adminLogin,
    renderAdminPanel,
    renderCustomers,
    block,
    unblock,
    // renderCategory,
    // addCategory,
    // listCategory,
    // unlistCategory,
    // rendereditCategory,
    // editCategory,
    // renderProducts,
    // renderaddProduct,
    // addProduct,
}
