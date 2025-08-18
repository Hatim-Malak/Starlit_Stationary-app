import Product from "../Models/product.model.js"

export const allProducts = async(req,res) =>{
    try {
        const product = await Product.find().select("name description price stock image category")
        if(product.length === 0){
            res.status(404).json({message:"Not a single product found"})
        }
        res.status(201).json(product)
    } catch (error) {
        console.log("error in allProduct controller",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const searchProduct = async(req,res) =>{
    const {query} = req.query
    try {
        if(!query || query.trim()===''){
            return res.status(400).json({message:"Query is required"})
        }
        const regex = new RegExp(query,'i')
        const results = await Product.find({
            $or:[
                {name:regex},
                {description:regex},
                {category:regex}
            ]
        })
        if(results.length === 0){
            return res.status(404).json({message:"Item not found"})
        }
        res.status(200).json(results)
    } catch (error) {
        console.log("error in search controller",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const getProductByCategory = async(req,res) =>{
    const {slug} = req.params
    try {
        if(!slug){
            return res.status(400).json({message:"Category is required"})
        }
        const result = await Product.find({category:slug})
        if(result.length === 0){
            return res.status(404).json({message:"Item not found"})
        }
        res.status(200).json(result)
    } catch (error) {
        console.log("error in getProductByCategory ",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const getFeaturedProduct = async(req,res) =>{
    try {
        const feature = await Product.find({featured:"Yes"})
        if(feature.length === 0){
            return res.status(404).json({message:"Not a single product found"})
        }
        res.status(201).json(feature)
    } catch (error) {
        console.log("Error in getFeaturedProduct controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}