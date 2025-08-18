import express from "express"
import {getCart,addToCart,updateCartItem,removeCartItem,deleteCart} from "../Controllers/cart.controller.js"
import {protectRoute} from "../Middleware/auth.middleware.js"

const router = express.Router()

router.get('/',protectRoute,getCart)
router.post('/add',protectRoute,addToCart)
router.put('/update/:itemsId',protectRoute,updateCartItem)
router.delete('/remove/:itemId',protectRoute,removeCartItem)
router.delete('/:id/delete',protectRoute,deleteCart)

export default router