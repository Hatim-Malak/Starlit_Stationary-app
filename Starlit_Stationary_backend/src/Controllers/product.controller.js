import Product from "../Models/product.model.js"
import { cacheResponse } from "../lib/cache.js"

export const allProducts = async(req,res) =>{
  try {
    const products = await cacheResponse("products:all", 60, async () => {
      return await Product.find().select("name description price stock image category")
    })
    if(!products || products.length === 0){
      return res.status(404).json({message:"Not a single product found"})
    }
    res.status(200).json(products)
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
    const key = `products:search:${query}`
    const results = await cacheResponse(key, 30, async () => {
      const regex = new RegExp(query,'i')
      return await Product.find({
        $or:[
          {name:regex},
          {description:regex},
          {category:regex}
        ]
      })
    })
    if(!results || results.length === 0){
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
    const key = `products:category:${slug}`
    const result = await cacheResponse(key, 60, async () => await Product.find({category:slug}))
    if(!result || result.length === 0){
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
    const feature = await cacheResponse("products:featured", 60, async () => await Product.find({featured:"Yes"}))
    if(!feature || feature.length === 0){
      return res.status(404).json({message:"Not a single product found"})
    }
    res.status(200).json(feature)
  } catch (error) {
    console.log("Error in getFeaturedProduct controller",error)
    res.status(500).json({message:"Internal server error"})
  }
}