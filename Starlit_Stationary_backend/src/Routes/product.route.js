import express from "express"
import {allProducts,searchProduct,getProductByCategory,getFeaturedProduct} from "../Controllers/product.controller.js"

const router = express.Router()

router.get("/all",allProducts)
router.get("/search",searchProduct)
router.get("/category/:slug",getProductByCategory)
router.get("/Feature",getFeaturedProduct)

export default router;