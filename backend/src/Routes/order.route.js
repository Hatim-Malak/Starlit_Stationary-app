import express from "express"
import {placeOrder,specificOrder,myOrder,allOrders,verifyOTP,cancelOrder} from "../Controllers/order.controller.js"
import {protectRoute} from "../Middleware/auth.middleware.js"
import {isAdmin} from "../Middleware/admin.Middleware.js"
import {validateDistance} from "../lib/map.js"

const router = express.Router();

router.post("/",protectRoute,validateDistance,placeOrder)
router.get("/customer/:slug",protectRoute,specificOrder)
router.get("/my-order",protectRoute,myOrder)
router.get("/",protectRoute,allOrders)
router.post("/customer/:id/otp/verify",protectRoute,isAdmin,verifyOTP)
router.delete("/:id/delete",protectRoute,cancelOrder)

export default router;