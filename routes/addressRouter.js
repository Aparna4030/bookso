const express = require('express');
const addressController = require('../controllers/user/addressController');
const Address = require("../models/addressModel");
const { isLoggedin } = require('../middlewares/auth_middleware');
const router = express.Router();


router.get("/",isLoggedin,addressController.renderaddAddress)
router.post("/",isLoggedin,addressController.addAddress)
router.get("/delete/:id",isLoggedin,addressController.deleteAddress)

module.exports = router;