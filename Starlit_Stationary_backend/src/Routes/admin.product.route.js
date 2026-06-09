import express from "express"
import {protectRoute} from "../Middleware/auth.middleware.js"
import {isAdmin} from "../Middleware/admin.middleware.js"
import {newProduct,updateProduct,Admin,deleteProduct} from "../Controllers/admin.product.controller.js"
import { adminLimiter, withRateLimit } from "../lib/rateLimiting.js"

const router = express.Router()

router.post("/Products", protectRoute, isAdmin, withRateLimit(adminLimiter), newProduct)
router.put("/Products/:id", protectRoute, isAdmin, withRateLimit(adminLimiter), updateProduct)
router.get("/IsAdmin", protectRoute, isAdmin, withRateLimit(adminLimiter), Admin)
router.delete("/:id", protectRoute, isAdmin, withRateLimit(adminLimiter), deleteProduct)

export default router