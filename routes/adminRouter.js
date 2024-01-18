const express = require("express")
const adminController = require("../controllers/adminController")
const {adminIsLoggedIn,adminIsLoggedOut} = require("../middlewares/auth_middleware");

const router = express.Router()
const upload = require('../middlewares/multer')



router.get("/login",adminIsLoggedOut,adminController.renderLogin)
router.post("/login",adminController.adminLogin)


router.use(adminIsLoggedIn)
router.get("/",adminController.renderAdminPanel)

router.get("/customers",adminController.renderCustomers)
router.get("/block/:id",adminController.block)
router.get("/unblock/:id",adminController.unblock)

router.get("/category",adminController.renderCategory)
router.post("/category",adminController.addCategory)

router.get("/category/list/:id",adminController.listCategory)
router.get("/category/unlist/:id",adminController.unlistCategory)

router.get("/category/edit/:id",adminController.rendereditCategory)
router.post("/category/edit",adminController.editCategory)

router.get("/products",adminController.renderProducts)
router.get("/addProduct",adminController.renderaddProduct)

router.post("/product",upload.array('images',4),adminController.addProduct)
module.exports = router;