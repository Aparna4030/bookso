const express = require("express")
const adminController = require("../controllers/adminController")
const {isLoggedin} = require("../middlewares/auth_middleware");
const router = express.Router()


router.get("/",adminController.renderAdminPanel)
router.get("/login",adminController.renderLogin)
router.post("/login",adminController.adminLogin)




module.exports = router