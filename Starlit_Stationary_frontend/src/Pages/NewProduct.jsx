import React from 'react'
import { useState } from 'react'
import { useIsAdmin } from '../store/useIsAdminStore.js'
import {toast} from "react-hot-toast"
import { Loader2, Upload, Package, Camera } from 'lucide-react';
import Navbar from "../Components/Navbar.jsx"

const NewProduct = () => {
  const {addProduct,addingProduct} = useIsAdmin()  
  const [product, setproduct] = useState({
    name:"",
    description:"",
    price:0,
    stock:0,
    image:"",
    category:"",
    featured:"No"
  })
  const handleImage = async(e) =>{
    const file = e.target.files[0]
    if(!file) return;
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async()=>{
      const base64Image = reader.result;
      setproduct({...product,image:base64Image})
    }
  }
  const validateForm = () =>{
    if(!product.name.trim()) return toast.error("Name is required")
    if(!product.price) return toast.error("Price is required")
    if(!product.stock) return toast.error("Stock is required")
    if(!product.category.trim()) return toast.error("Category is required")
    if (isNaN(product.price)) return toast.error("Price should be a number");
    if (isNaN(product.stock)) return toast.error("Stock should be a number");
    if(product.price>10000) return toast.error("The price should be less than 10000")
    if(!product.featured.trim()) return toast.error("Featured is required")
    return true
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    const success = validateForm()
    if(success === true) {
        addProduct(product);
        setproduct({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          image: "",
          category: "",
          featured: "No"
        });
      }
  }  
  return (
    <>
    <div className='min-h-screen flex flex-col bg-gradient-to-r from-primary to-secondary'>
      <Navbar/>
      
      <div className='flex-1 w-full py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-5xl mx-auto'>
          {/* Header Section */}
          <div className='mb-8 text-center'>
            <div className='flex items-center justify-center gap-3 mb-3'>
              <div className='p-3 bg-white rounded-xl shadow-lg'>
                <Package className='w-8 h-8 text-primary' />
              </div>
              <h1 className='text-4xl font-bold text-white'>Add New Product</h1>
            </div>
            <p className='text-accent text-lg'>Fill in the product details below to add it to your inventory</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Product Image Section */}
            <div className='mb-6'>
              <div className='bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl'>
                <div className='flex flex-col items-center'>
                  <h2 className='text-white font-semibold text-xl mb-8 flex items-center gap-2'>
                    <Camera className='w-5 h-5' />
                    Product Image
                  </h2>
                  <div className='relative group'>
                    {/* Outer glow ring */}
                    <div className='absolute -inset-2 bg-gradient-to-r from-secondary to-primary rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity'></div>
                    
                    {/* Main image container */}
                    <div className='relative size-[240px] rounded-full bg-white shadow-2xl overflow-hidden border-[6px] border-white'>
                      {product.image ? (
                        <img src={product.image} className='h-full w-full object-cover' alt="product preview" />
                      ) : (
                        <div className='h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-warm-100 via-warm-50 to-warm'>
                          <div className='bg-primary p-6 rounded-full mb-4'>
                            <Upload className='w-12 h-12 text-white' />
                          </div>
                          <span className='font-semibold text-primary'>Upload Photo</span>
                          <span className='text-sm text-secondary mt-1'>Click button below</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload button */}
                    <label 
                      htmlFor='avatar-upload' 
                      className='absolute bottom-2 right-2 cursor-pointer bg-gradient-to-r from-primary to-secondary rounded-full p-4 shadow-2xl border-4 border-white hover:scale-110 hover:rotate-12 transition-all duration-300 disabled:opacity-50'
                    >
                      <Camera className='w-7 h-7 text-white' />
                      <input
                        type="file"
                        id='avatar-upload'
                        className='hidden'
                        accept='image/*'
                        onChange={handleImage}
                        disabled={addingProduct}
                      />
                    </label>
                  </div>
                  <p className='text-white text-sm mt-8 bg-white/10 px-6 py-2 rounded-full border border-white/20'>
                    JPG, PNG or GIF • Max 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className='bg-white rounded-3xl shadow-2xl p-8 mb-6'>
              <h2 className='font-bold text-2xl text-primary mb-6 pb-4 border-b-2 border-accent flex items-center gap-2'>
                <Package className='w-6 h-6' />
                Product Information
              </h2>
              
              {/* Row 1 - Basic Info */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <div className='flex flex-col'>
                  <label htmlFor="name" className='mb-2 font-semibold text-primary text-sm'>
                    Product Name <span className='text-red-500'>*</span>
                  </label>
                  <input 
                    className='bg-warm border-2 border-accent py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all hover:border-accent/50' 
                    value={product.name} 
                    onChange={(e)=>setproduct({...product,name:e.target.value})} 
                    placeholder='Enter product name' 
                    type="text" 
                    id="name" 
                  />
                </div>
                
                <div className='flex flex-col'>
                  <label htmlFor="price" className='mb-2 font-semibold text-primary text-sm'>
                    Price ($) <span className='text-red-500'>*</span>
                  </label>
                  <input 
                    className='bg-warm border-2 border-accent py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all hover:border-accent/50' 
                    value={product.price} 
                    onChange={(e)=>setproduct({...product,price:Number(e.target.value)})} 
                    placeholder='0.00' 
                    type="number" 
                    id="price" 
                  />
                </div>
                
                <div className='flex flex-col'>
                  <label htmlFor="stock" className='mb-2 font-semibold text-primary text-sm'>
                    Stock Quantity <span className='text-red-500'>*</span>
                  </label>
                  <input 
                    className='bg-warm border-2 border-accent py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all hover:border-accent/50' 
                    value={product.stock} 
                    onChange={(e)=>setproduct({...product,stock:Number(e.target.value)})} 
                    placeholder='0' 
                    type="number" 
                    id="stock" 
                  />
                </div>
              </div>

              {/* Row 2 - Description */}
              <div className='mb-6'>
                <label htmlFor="description" className='mb-2 font-semibold text-primary text-sm block'>
                  Product Description
                </label>
                <textarea 
                  className='w-full bg-warm border-2 border-accent py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all resize-none hover:border-accent/50' 
                  value={product.description} 
                  onChange={(e)=>setproduct({...product,description:e.target.value})} 
                  placeholder='Enter a detailed description of the product...' 
                  id="description"
                  rows="4"
                />
              </div>

              {/* Row 3 - Category and Featured */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col'>
                  <label htmlFor="category" className='mb-2 font-semibold text-primary text-sm'>
                    Category <span className='text-red-500'>*</span>
                  </label>
                  <select 
                    name="category" 
                    value={product.category} 
                    onChange={(e)=>setproduct({...product,category:e.target.value})} 
                    id="category" 
                    className='bg-warm border-2 border-accent py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all cursor-pointer hover:border-accent/50'
                  >
                    <option value="">Select a category</option>
                    <option value="Writing Instruments">Writing Instruments</option>
                    <option value="Paper Products">Paper Products</option>
                    <option value="Files and Folders">Files and Folders</option>
                    <option value="Art and Craft Supplies">Art and Craft Supplies</option>
                    <option value="Desk and Office Supplies">Desk and Office Supplies</option>
                    <option value="Adhesives and Corrections">Adhesives and Corrections</option>
                    <option value="Gift and Packaging">Gift and Packaging</option>
                    <option value="Organizers and Storage">Organizers and Storage</option>
                  </select>
                </div>
                
                <div className='flex flex-col'>
                  <label className='mb-2 font-semibold text-primary text-sm'>
                    Featured Product <span className='text-red-500'>*</span>
                  </label>
                  <div className='flex items-center gap-8 h-[50px]'>
                    <label className='flex items-center gap-2 cursor-pointer group'>
                      <input 
                        type="radio" 
                        name='Yesno' 
                        onChange={(e)=>setproduct({...product,featured:e.target.value})} 
                        checked={product.featured === "Yes"} 
                        value='Yes'
                        className='w-5 h-5 text-primary border-accent/50 focus:ring-secondary cursor-pointer'
                      />
                      <span className='text-gray-700 font-medium group-hover:text-primary transition-colors'>Yes</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer group'>
                      <input 
                        type="radio" 
                        name='Yesno' 
                        onChange={(e)=>setproduct({...product,featured:e.target.value})} 
                        checked={product.featured === "No"} 
                        value='No'
                        className='w-5 h-5 text-primary border-accent/50 focus:ring-secondary cursor-pointer'
                      />
                      <span className='text-gray-700 font-medium group-hover:text-primary transition-colors'>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={addingProduct}
              className='w-full p-5 rounded-2xl font-bold text-lg text-primary bg-white hover:bg-warm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 transition-all shadow-2xl hover:shadow-white/30 hover:scale-[1.02]'
            >
              {addingProduct ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <Package className="w-6 h-6" />
                  <span>Add Product to Inventory</span>
                </>
              )}
            </button>

            {/* Helper Text */}
            <p className='text-center text-white text-sm mt-6 bg-white/10 backdrop-blur-sm rounded-xl py-3 px-4 border border-white/20'>
              All fields marked with <span className='text-yellow-300 font-semibold'>*</span> are required
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default NewProduct
