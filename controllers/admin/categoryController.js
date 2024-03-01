const asynchandler = require("express-async-handler")
const Category = require("../../models/categoryModel")



const renderCategory = asynchandler( async (req, res) => {
    const categories = await Category.find()
    let message = null
    if(req.session.message){
        message=req.session.message;
        req.session.message=null
    }
    res.render("category", { categories,message })
})

const addCategory = asynchandler( async (req, res) => {

    const catName = req.body.name.trim().toLowerCase()
    const existingCategory = await Category.findOne({name:catName});
    if(existingCategory){
        req.session.message = "Category exists"
        res.redirect('/admin/category')
        return;
    }
    const category = new Category({
        name: catName,
        description: req.body.description
    })
    const data = await category.save()
    res.redirect("/admin/category")
})

const listCategory = asynchandler (async (req, res) => {
    const categoryId = req.params.id
    const categoryData = await Category.updateOne({ _id: categoryId }, { $set: { isListed: true } })
    res.redirect("/admin/category")
})

const unlistCategory = asynchandler(async (req, res) => {
    const categoryId = req.params.id
    const categoryData = await Category.updateOne({ _id: categoryId }, { $set: { isListed: false } })
    res.redirect("/admin/category")
})


const rendereditCategory = asynchandler( async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id })
    res.render("editCategory", { category })
})

const editCategory = asynchandler( async (req, res) => {
    const { name, description, id } = req.body
    const catName = req.body.name.trim().toLowerCase()
    const existingCategory = await Category.findOne({name:catName});
    if(existingCategory){
        req.session.message = "Category exists"
        res.redirect('/admin/category')
        return;
    }
    const category = await Category.updateOne({ _id: id }, { $set: { name, description } })
    res.redirect("/admin/category")
})

module.exports = {renderCategory,addCategory,listCategory,unlistCategory,rendereditCategory,editCategory}