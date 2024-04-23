const express = require('express');
const addressController = require('../controllers/user/addressController');
const Address = require("../models/addressModel");
const { isLoggedin } = require('../middlewares/auth_middleware');
const router = express.Router();


router.get("/",isLoggedin,addressController.renderaddAddress)
router.post("/",isLoggedin,addressController.addAddress)
router.get("/delete/:id",isLoggedin,addressController.deleteAddress)
router.get("/edit/:id",isLoggedin,addressController.renderEditAddress)
router.post("/edit/:id",isLoggedin,addressController.editAddress)



module.exports = router;