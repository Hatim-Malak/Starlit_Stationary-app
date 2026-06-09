import express from "express"
import {allProducts,searchProduct,getProductByCategory,getFeaturedProduct} from "../Controllers/product.controller.js"
import { productLimiter, searchLimiter, categoryLimiter, featuredLimiter, withRateLimit } from "../lib/rateLimiting.js"

const router = express.Router()

router.get("/all", withRateLimit(productLimiter), allProducts)
router.get("/search", withRateLimit(searchLimiter), searchProduct)
router.get("/category/:slug", withRateLimit(categoryLimiter), getProductByCategory)
router.get("/Feature", withRateLimit(featuredLimiter), getFeaturedProduct)

export default router;