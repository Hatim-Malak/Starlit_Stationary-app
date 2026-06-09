import express from "express"
import {getCart,addToCart,updateCartItem,removeCartItem,deleteCart} from "../Controllers/cart.controller.js"
import {protectRoute} from "../Middleware/auth.middleware.js"
import { cartLimiter, cartWriteLimiter, withRateLimit } from "../lib/rateLimiting.js"

const router = express.Router()

router.get('/', protectRoute, withRateLimit(cartLimiter), getCart)
router.post('/add', protectRoute, withRateLimit(cartWriteLimiter), addToCart)
router.put('/update/:itemsId', protectRoute, withRateLimit(cartWriteLimiter), updateCartItem)
router.delete('/remove/:itemId', protectRoute, withRateLimit(cartWriteLimiter), removeCartItem)
router.delete('/:id/delete', protectRoute, withRateLimit(cartWriteLimiter), deleteCart)

export default router