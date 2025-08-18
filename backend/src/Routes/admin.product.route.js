import express from "express"
import {protectRoute} from "../Middleware/auth.middleware.js"
import {isAdmin} from "../Middleware/admin.middleware.js"
import {newProduct,updateProduct,Admin,deleteProduct} from "../Controllers/admin.product.controller.js"

const router = express.Router()

router.post("/Products",protectRoute,isAdmin,newProduct)
router.put("/Products/:id",protectRoute,isAdmin,updateProduct)
router.get("/IsAdmin",protectRoute,isAdmin,Admin)
router.delete("/:id",protectRoute,isAdmin,deleteProduct)

export default router