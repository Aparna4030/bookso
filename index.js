const express = require('express')
const session = require("express-session")
const indexRouter = require('./routes/indexRouter')
const adminRouter = require('./routes/adminRouter')
const path = require("path")
require('dotenv').config();
const app = express()
const connectdb = require("./config/connection");


connectdb()

app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

const disableCacheMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

app.use((req, res, next) => {
    if (req.session.userId || req.session.isAdmin) {
        res.locals.isLoggedin = true;
    } else {
        res.locals.isLoggedin = false;
    }
    next();
})

app.use(disableCacheMiddleware);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));



app.use("/admin", adminRouter)
app.use("/", indexRouter)


app.use((err, req, res, next) => {
    console.error(err);
    res.render('errorpage')
});



app.listen(process.env.PORT, () => {
    console.log("http://localhost:8888")
})

