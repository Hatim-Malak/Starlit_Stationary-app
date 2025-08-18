import React from 'react'
import { useState } from 'react'
import { useIsAdmin } from '../store/useIsAdminStore.js'
import {toast} from "react-hot-toast"
import { Loader2 } from 'lucide-react';
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
    <div className='h-screen flex flex-col'>
    <Navbar/>
    <div className='relative flex-1 w-full overflow-x-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-400' style={{
            clipPath:"polygon(0 0,100% 0,0 100%)"
        }}></div>
        <div className='absolute inset-0 bg-white' style={{
            clipPath:"polygon(100% 0,100% 100%,0 100%)"
        }}></div>
        <form onSubmit={handleSubmit}>
            <div className='relative z-10 h-full w-full flex flex-col justify-center items-center lg:py-3 py-20'>
                    <div className='w-full h-2/5 flex justify-center items-center relative'>
                        <div className='border-[5px] border-white size-[220px] rounded-full '>
                            <img src={product.image||"defaultProduct.png"} className='h-full w-full object-cover rounded-full' alt="image" />
                        </div>
                        <label htmlFor='avatar-upload' className='cursor-pointer bg-gradient-to-br from-blue-800 to-blue-400 rounded-full p-1 h-[40px] absolute lg:left-[739px] lg:top-[166px] top-[155px] left-[270px] border-2 border-black hover:border-black'>
                            <img src="/camera.svg" disabled={addingProduct} alt="camera" className='w-[30px] ' />
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
                    <div className='w-full h-2/5  flex flex-col'>
                        <div className='lg:flex justify-center fint items-center gap-7 p-3'>
                            <div className='flex flex-col'>
                                <label htmlFor="name" className='ml-3 font-medium'>Name:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md' value={product.name} onChange={(e)=>setproduct({...product,name:e.target.value})} placeholder='Name' type="text" id="name" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="price" className='ml-3 font-medium'>Price:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md' value={product.price} onChange={(e)=>setproduct({...product,price:Number(e.target.value)})} placeholder='Price' type="number" id="price" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="stock" className='ml-3 font-medium'>Stock:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md' value={product.stock} onChange={(e)=>setproduct({...product,stock:Number(e.target.value)})} placeholder='Stock' type="number" id="stock" />
                            </div>
                        </div>
                        <div className='lg:flex justify-center fint items-center gap-10 p-3'>
                            <div className='flex flex-col'>
                                <label htmlFor="description" className='ml-3 font-medium'>Description:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md w-[400px] h-[100px]' value={product.description} onChange={(e)=>setproduct({...product,description:e.target.value})} placeholder='description' type="text" id="description" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="category" className='ml-3 font-medium'>Category:-</label>
                                <select name="category" value={product.category} onChange={(e)=>setproduct({...product,category:e.target.value})} id="category" className=' bg-gray-300 py-1 px-3 rounded-md'>
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
                            <div className='flex gap-2'>
                                <label htmlFor="Featured" className='ml-3 font-medium'>Featured:-</label>
                                <input type="radio" name='Yesno' onChange={(e)=>setproduct({...product,featured:e.target.value})} checked={product.featured === "Yes"} value='Yes' />
                                <label htmlFor="Yes" className='mr-3 font-medium'>Yes</label>
                                <input type="radio" name='Yesno' onChange={(e)=>setproduct({...product,featured:e.target.value})} checked={product.featured === "No"} value='No' />
                                <label htmlFor="No" className='mr-3 font-medium'>No</label>
                            </div>
                        </div>
                    </div>
                <button
                    type="submit"
                    disabled={addingProduct}
                    className='p-3 rounded-md text-xl mt-2 lg:w-[680px] w-[300px] text-white bg-gradient-to-br from-blue-800 to-blue-400 font-medium flex justify-center items-center gap-2'
                >
                    {addingProduct ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span>Loading...</span>
                    </>
                    ) : (
                    "Submit"
                    )}
                </button>
            </div>
        </form>
    </div>
    </div>
    </>
  )
}

export default NewProduct