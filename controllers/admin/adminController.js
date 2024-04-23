const asynchandler = require("express-async-handler")
const User = require("../../models/userModel")
const Order = require("../../models/ordersModel")
const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")



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

const renderAdminPanel = asynchandler(async (req, res) => {
    const customersCount = await User.find().count()
    const orders = await Order.find().count()

    
  

    const orderGraph = await Order.find()
    const createdAtValues = orderGraph.map(order => order.createdAt.getMonth())
    const counts ={}
    createdAtValues.forEach(number=>{
        if(counts[number]){
            counts[number]++;
        }else{
            counts[number]=1;
        }
    })
    const countsArray = [];
    for(let key in counts){
        countsArray[(key*1)] = counts[key]
    }
    // console.log({countsArray})

    // console.log({counts})
    // console.log("hhhhhhheeeeeeellllloooo",createdAtValues)

    // console.log("oooooooooooooooooo",orders)
    const category = await Category.find().count()
    const productsCount = await Product.find().count()
    const bestProducts = await Order.aggregate([{ $unwind: "$items" }, { $group: { _id: "$items.productId", count: { $sum: 1 } } }, { $project: { "items.productId": 1, count: 1 } }, { $lookup: { from: "products", localField: '_id', foreignField: '_id', as: 'product' } }, { $sort: { count: -1 } }])
    const bestSellingProducts = bestProducts.map(product =>{
      return {...product.product[0],count:product.count}
    })
    console.log("heeeeeeeeellll",bestSellingProducts)
    const bestCatIds = bestSellingProducts.map(product => product.category_id);
    const bestSellingCats = await Category.find({_id:{$in:bestCatIds}},{name:1});
    
    console.log(bestSellingCats);
    console.log({bestProducts
    })
    res.render("adminpanel",{customersCount,orders,category,productsCount,counts,countsArray,bestSellingProducts,bestSellingCats})
})

const categoryCount = asynchandler(async(req,res)=>{
    let categoryProductCount = await Product.aggregate([
        {
            $group:{_id:"$category_id",count:{$sum:1}}
        },
        {
            $lookup:{
                from:"categories",
                as: "category",
                localField:"_id",
                foreignField:"_id"
            }
        },
        {
            $unwind:"$category"
        },
        {
            $addFields:{category:"$category.name"}
        },
        {
            $project:{category:1,count:1}
        }
    ])

    res.status(200).json(categoryProductCount)

})

const renderCustomers = asynchandler( async (req, res) => {
    const users = await User.find({}, { password: 0 })
    res.render("customers", { users })
})

const block = asynchandler( async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: true } })
    res.status(200).json({success:true})
})

const unblock = asynchandler( async (req, res) => {
    const userId = req.params.id
    const userData = await User.updateOne({ _id: userId }, { $set: { isBlocked: false } })
    res.status(200).json({success:true})
})

const searchUser = asynchandler(async(req,res)=>{
    const searchString = req.query.search
    const users = await User.find({name:{$regex: searchString}})
    res.json(users);
})

module.exports = {
    renderLogin,
    adminLogin,
    renderAdminPanel,
    renderCustomers,
    block,
    unblock,
    searchUser,
    categoryCount
}
