const expressAsyncHandler = require("express-async-handler");
const Order = require("../../models/ordersModel");
const ordersModel = require("../../models/ordersModel");


const getSalesReport = expressAsyncHandler(async(req,res)=>{
    
    const salesReport = await Order.find().populate('items.productId')
    .populate('userId','name').sort({ createdAt: -1 });
    
    const productsData = salesReport.map(order => {
        return order.items.map(item => {
            return {
                name: item?.productId?.name,
                quantity: item.qty
            };
        });
    });
    res.render("salesReport", { salesReport, productsData });
});




const filterSalesReport = expressAsyncHandler(async (req, res) => {
    let { startDate, endDate } = req.body;
    const paymentMethods = Object.keys(req.body).slice(0, 3).filter(method => req.body[method]);
    let query = { paymentMethod: { $in: paymentMethods } };
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        query.createdAt = { $gte: start, $lt: end };
    } else if (startDate) {
        const start = new Date(startDate);
        query.createdAt = { $gte: start };
    } else if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        query.createdAt = { $lt: end };
    }
    const orders = await Order.find(query).populate('userId');
    res.status(200).json(orders);
});

module.exports = { getSalesReport,filterSalesReport };
