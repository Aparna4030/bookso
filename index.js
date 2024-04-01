require('dotenv').config();
const connectdb = require("./config/connection");
const express = require('express')
const session = require("express-session")
const path = require("path")
const app = express()

// all the routers files are imported here//
const indexRouter = require('./routes/indexRouter')
const adminRouter = require('./routes/adminRouter')
const addressRouter = require('./routes/addressRouter')
const cartRouter = require('./routes/cartRouter')
const orderRouter = require('./routes/orderRouter')

// all the database connections are imported here//
const Order = require("./models/ordersModel")
const Product = require("./models/productModel")
const Cart = require("./models/cartModel")

// middleware folder is connected here: Auth middlware//
const {isBlockedMiddleware,disableCacheMiddleware,loggedInCart} = require("./middlewares/auth_middleware")


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

// all the main middlewares in auth middleware in middlware folder//
app.use(loggedInCart);
app.use(disableCacheMiddleware);


app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// isblocked middleware is in auth middleware in middlware folder//
app.use(isBlockedMiddleware);



app.use("/orders", orderRouter)
app.use("/cart",cartRouter)
app.use("/address",addressRouter)
app.use("/admin", adminRouter)
app.use("/", indexRouter)


// error handling middleware //

app.use((err, req, res, next) => {
    console.error(err);
    res.render('errorpage')
});


// port settings//

app.listen(process.env.PORT, () => {
    console.log("http://localhost:8080")
})









// Mastercard	5267 3181 8797 5449	
// Visa	4111 1111 1111 1111	