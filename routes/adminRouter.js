const express = require("express")
const adminController = require("../controllers/admin/adminController")
const categoryController = require("../controllers/admin/categoryController")
const productController = require("../controllers/admin/productController")
const couponController = require("../controllers/admin/couponController")
const salesController = require("../controllers/admin/salesController")
const {adminIsLoggedIn,adminIsLoggedOut} = require("../middlewares/auth_middleware");
const orderController = require("../controllers/admin/orderController")
const upload = require('../middlewares/multer')
const router = express.Router()



router.get("/login",adminIsLoggedOut,adminController.renderLogin)
router.post("/login",adminIsLoggedOut,adminController.adminLogin)






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

router.get("/delete-image/:productId/:index",productController.deleteImage)

router.get("/orders",orderController.renderAdminOrders)
router.get("/details/:id",orderController.renderOderDetails)

router.get("/status",orderController.changeStatus)

router.get("/category/count",adminController.categoryCount)

router.get("/coupons",couponController.renderaddCoupon)
router.post("/coupons",couponController.addCoupon)
router.get("/delete/:id",couponController.deleteCoupon)

router.get("/listCoupon",couponController.listCoupon)

router.get("/salesreport",salesController.getSalesReport);

router.post("/filterReport",salesController.filterSalesReport);

module.exports = router;


