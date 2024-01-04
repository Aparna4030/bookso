const express = require('express')
const session = require("express-session")
const indexRouter = require('./routes/indexRouter')
const path = require("path")
require('dotenv').config();
const app = express()
const connectdb = require("./config/connection");




connectdb()

app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

app.use(session({
    secret: "1234",
    resave: false,
    saveUninitialized: true,
}))

const disableCacheMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

app.use(disableCacheMiddleware);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter)

app.listen(process.env.PORT, () => {
    console.log("http://localhost:8888")
})
