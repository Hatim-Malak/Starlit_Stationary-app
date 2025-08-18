import Cart from "../Models/cart.model.js"
import Product from "../Models/product.model.js"

export const getCart = async(req,res)=>{
    try {
        const cart = await Cart.findOne({user:req.user._id}).populate("items.product")
        if(!cart){
            return res.status(200).json({items:[]})
        }
        res.status(200).json(cart);
    } catch (error) {
        console.log("Error in getCart controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const addToCart = async(req,res)=>{
    try{
        const {productId,quantity} = req.body
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message:"No product found"})
        }
        if(product.stock<quantity){
            return res.status(400).json({message:"Not enough stock"})
        }
        let cart = await Cart.findOne({user:req.user._id});
        if(!cart){
            cart = new Cart({user:req.user._id,items:[]})
        }
        const existingItem = cart.items.find(item=>item.product.toString() === productId)
        if(existingItem){
            existingItem.quantity += quantity
        }else{
            cart.items.push({product:productId,quantity})
        }
        product.stock = product.stock-quantity;
        await product.save()
        await cart.save();
        res.status(200).json({message:"Added to cart"})
    }catch(error){
        console.log("error in addToCart route",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const updateCartItem = async(req,res) =>{
    try {
        const {quantity} = req.body
        const {itemsId} = req.params

        let cart = await Cart.findOne({user:req.user._id})
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        const item = cart.items.id(itemsId)
        if(!item){
            return res.status(404).json({message:"Item not found in cart"})
        }
        const product = await Product.findById(item.product)
        if(!product){
            return res.status(404).json({message:"Product no longer exist"})
        }
        if(product.stock<quantity){
            return res.status(400).json({message:"Not enough stock"})
        }
        item.quantity = quantity
        await cart.save()
        res.status(200).json({ message: "Cart item updated successfully" });
    } catch (error) {
        console.log("error in addToCart route",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const removeCartItem = async(req,res) =>{
    try {
        const {itemId} = req.params

        let cart = await Cart.findOne({user:req.user._id})
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        cart.items = cart.items.filter(item=>item._id.toString() !== itemId);
        await cart.save()
        res.status(200).json({message:"Item removed"})
    } catch (error) {
        console.log("error in removeCartItem",error)
        res.status(500).json({message:"Internal server error"})
    }
}
export const deleteCart = async(req,res)=>{
    try {
        const {id} = req.params
        if(!id){
            return res.status(400).json({message:"cartId is required"})
        }
        await Cart.findByIdAndDelete(id)
        res.status(200).json({message:"the cart is removed"})
    } catch (error) {
        console.log("error in removeCartItem",error)
        res.status(500).json({message:"Internal server error"})         
    }
}