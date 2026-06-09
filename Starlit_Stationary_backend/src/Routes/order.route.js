import express from "express"
import {placeOrder,specificOrder,myOrder,allOrders,verifyOTP,cancelOrder} from "../Controllers/order.controller.js"
import {protectRoute} from "../Middleware/auth.middleware.js"
import {isAdmin} from "../Middleware/admin.middleware.js"
import {validateDistance} from "../lib/map.js"
import { orderLimiter, orderWriteLimiter, otpLimiter, withRateLimit } from "../lib/rateLimiting.js"

const router = express.Router();

router.post("/", protectRoute, withRateLimit(orderWriteLimiter), validateDistance, placeOrder)
router.get("/customer/:slug", protectRoute, withRateLimit(orderLimiter), specificOrder)
router.get("/my-order", protectRoute, withRateLimit(orderLimiter), myOrder)
router.get("/", protectRoute, withRateLimit(orderLimiter), allOrders)
router.post("/customer/:id/otp/verify", protectRoute, isAdmin, withRateLimit(otpLimiter), verifyOTP)
router.delete("/:id/delete", protectRoute, withRateLimit(orderWriteLimiter), cancelOrder)

export default router;