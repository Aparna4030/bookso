const express = require('express');
const productController = require("../controllers/productController")
const router = express.Router();
const {adminIsLoggedIn,adminIsLoggedOut} = require("../middlewares/auth_middleware");



router.get("/:id",productController.renderProduct)

module.exports = router;
