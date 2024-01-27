const express = require("express")
const adminController = require("../controllers/admin/adminController")
const categoryController = require("../controllers/admin/categoryController")
const productController = require("../controllers/admin/productController")
const {adminIsLoggedIn,adminIsLoggedOut} = require("../middlewares/auth_middleware");
const upload = require('../middlewares/multer')
const router = express.Router()



router.get("/login",adminIsLoggedOut,adminController.renderLogin)
router.post("/login",adminController.adminLogin)

router.use(adminIsLoggedIn)
router.get("/",adminController.renderAdminPanel)

router.get("/customers",adminController.renderCustomers)
router.get("/block/:id",adminController.block)
router.get("/unblock/:id",adminController.unblock)

router.get("/products",productController.renderProducts)
router.get("/addProduct",productController.renderaddProduct)

router.post("/product",upload.array('images',4),productController.addProduct)

router.get("/editProduct/:id",productController.renderEditProduct)
router.post("/editProduct/:id",upload.array('images'),productController.editProduct)

router.get("/product/list/:id",productController.listProducts)
router.get("/product/unlist/:id",productController.unlistProducts)

router.get("/category",categoryController.renderCategory)
router.post("/category",categoryController.addCategory)

router.get("/category/list/:id",categoryController.listCategory)
router.get("/category/unlist/:id",categoryController.unlistCategory)

router.get("/category/edit/:id",categoryController.rendereditCategory)
router.post("/category/edit",categoryController.editCategory)

router.get("/product/search",productController.searchProduct)
router.get("/users",adminController.searchUser)





module.exports = router;