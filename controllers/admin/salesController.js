const expressAsyncHandler = require("express-async-handler");
const Order = require("../../models/ordersModel");
const ordersModel = require("../../models/ordersModel");


const getSalesReport = expressAsyncHandler(async(req,res)=>{
    
    const salesReport = await Order.find().populate('items.productId').populate('userId', 'name');
    
    const productsData = salesReport.map(order => {
        return order.items.map(item => {
            return {
                name: item.productId.name,
                quantity: item.qty
            };
        });
    });

console.log("sssssssssssaaaaaaaaaalllllllleeeeeeessssss",salesReport)
    res.render("salesReport", { salesReport, productsData });
});




const filterSalesReport = expressAsyncHandler(async(req,res)=>{
    console.log(req.body);
    const paymentMethods = Object.keys(req.body).filter(method => req.body[method])
    console.log(paymentMethods);

    const orders = await Order.find({paymentMethod:{$in:paymentMethods}}).populate('userId');
    console.log(orders)
    res.status(200).json(orders)
})

module.exports = { getSalesReport,filterSalesReport };
