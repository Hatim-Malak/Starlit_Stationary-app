import Product from "../Models/product.model.js"
import cloudinary from "../lib/cloudinary.js"

export const newProduct = async(req,res) =>{
    const {name,description,category,stock,price,image,featured} = req.body
    try {
        if(!name){
            return res.status(400).json({message:"name is required"})
        }
        if(!description){
            return res.status(400).json({message:"description is required"})
        }
        if(!category){
            return res.status(400).json({message:"category is required"})
        }
        if(!stock){
            return res.status(400).json({message:"stock is required"})
        }
        if(!price){
            return res.status(400).json({message:"price is required"})
        }
        if(!image){
            return res.status(400).json({message:"image is required"})
        }
        let imageUrl
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const dublicate = await Product.findOne({name})
        if(dublicate){
            return res.status(400).json({message:"This name is already occupied by other product"})
        }
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            image:imageUrl,
            category,
            featured
        })
        await newProduct.save()
        res.status(201).json({message:"Item added successfully"})
    } catch (error) {
        console.log("error in new product controller",error.message)
        res.status(500).json({message:"Internal server error"})        
    }
}

export const updateProduct = async(req,res) =>{
    try {
        const {name,description,stock,price,category,image,featured} = req.body
        const productId = req.params.id
        let updatedFields = {
            name,
            description,
            stock,
            price,
            category,
            featured
        }
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            updatedFields.image = uploadResponse.secure_url
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updatedFields,
            {new:true,runValidators:true}
        )
        if(!updatedProduct){
            res.status(400).json({message:"Product not found"})
        }
        res.status(200).json(updatedProduct)
    } catch (error) {
        console.log("error in updateProduct controller",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const Admin = (req,res) =>{
    try{
        res.status(200).json(req.role)
    }catch(error){
        console.log("error in Admin controller",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params
        if(!id){
            return res.status(400).json({message:"product Id id needed"})
        }
        const del = await Product.findByIdAndDelete(id)
        if(!del){
            return res.status(404).json({message:"Product not found"})
        }
        res.status(200).json({message:"product is removed"})
    } catch (error) {
        console.log("error in deleteProduct controller",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}