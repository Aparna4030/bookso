const express = require('express')
const session = require("express-session")
const indexRouter = require('./routes/indexRouter')
const adminRouter = require('./routes/adminRouter')
const addressRouter = require('./routes/addressRouter')
const cartRouter = require('./routes/cartRouter')
const orderRouter = require('./routes/orderRouter')
const Order = require("./models/ordersModel")
const Product = require("./models/productModel")
const Cart = require("./models/cartModel")

const {isBlockedMiddleware} = require("./middlewares/auth_middleware")
const path = require("path")
require('dotenv').config();
const app = express()
const connectdb = require("./config/connection");


connectdb()

app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));

const disableCacheMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

app.use(async(req, res, next) => {
    if (req.session.userId || req.session.isAdmin) {
        res.locals.isLoggedin = true;
        const cart = await Cart.findOne({userId:req.session.userId})
        res.locals.cartQty = cart?.products?.length
    } else {
        res.locals.isLoggedin = false;
        res.locals.cartQty = null;
    }
    next();
})

app.use(disableCacheMiddleware);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(isBlockedMiddleware);



app.use("/orders", orderRouter)
app.use("/cart",cartRouter)
app.use("/address",addressRouter)
app.use("/admin", adminRouter)
app.use("/", indexRouter)

app.use((err, req, res, next) => {
    console.error(err);
    res.render('errorpage')
});



app.listen(process.env.PORT, () => {
    console.log("http://localhost:8080")
})

