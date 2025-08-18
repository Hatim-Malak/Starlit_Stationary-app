import React, { useState } from 'react'
import Navbar from "../Components/Navbar.jsx"
import {useProduct} from "../store/useProductStore.js"
import { useEffect } from 'react';
import {toast} from "react-hot-toast"
import { Loader2 } from 'lucide-react';
import { useIsAdmin } from '../store/useIsAdminStore.js'
import { LayoutList } from 'lucide-react';

const UpdateProduct = () => {
  const {searchedProduct,searchingProduct,searchProduct,getProduct,product} = useProduct()
  const [searchQuery, setsearchQuery] = useState("")
  const [id, setid] = useState("")
  const [view,setview] = useState("all")
  const [productId,setproductId] = useState("")
  const {updateProduct,updatingProduct,deleteProduct,removingProduct} = useIsAdmin()
  useEffect(() => {
    if (view === "all") getProduct();
  }, [view, getProduct]);

  useEffect(() => {
    if (!productId) {
        setupproduct({ name: "", description: "", price: 0, stock: 0, image: "", category: "Writing Instruments", featured: "No" });
        return;
    }

    const allAvailableProducts = [...product, ...searchedProduct];
    const uniqueProducts = [...new Map(allAvailableProducts.map(p => [p._id, p])).values()];
    const selectedProduct = uniqueProducts.find(p => p._id === productId);

    if (selectedProduct) {
        setupproduct({
            name: selectedProduct.name || "",
            description: selectedProduct.description || "",
            price: selectedProduct.price || 0,
            stock: selectedProduct.stock || 0,
            image: selectedProduct.image || "",
            category: selectedProduct.category || "Writing Instruments",
            featured: selectedProduct.featured ? "Yes" : "No",
        });
    }
}, [productId, product, searchedProduct]);

  const handleSearch =async(e)=>{
    e.preventDefault()
    if (!searchQuery.trim()) return;
    await searchProduct(searchQuery)
    setview("search")
  }
  const handleSearchChange=(e)=>{
    setsearchQuery(e.target.value)
    setcategory("")
  }
  const handleDeleteProduct = async(id)=>{
    await deleteProduct(id)
    await getProduct();
    setproductId("");
  }
  let content
  if(view === "search"){
    content = searchedProduct.map((sproduct)=>(
      <div className='flex gap-1'>
        <button key={sproduct._id} className='hover:bg-blue-800 w-[80%] p-2 h-[50px] flex gap-2 items-center' onClick={()=>setproductId(sproduct._id)}>
          <div className='size-[40px] rounded-md'>
            <img src={sproduct.image||"defaultProduct.png"} alt="img" className='w-full h-full object-cover rounded-md' />
          </div>
          <div className='flex flex-col items-start'>
            <h1 className='text-md font-medium text-white pl-2'>{sproduct.name}</h1>
            <p className='text-sm overflow-hidden hidden lg:block h-[20px] w-[140px] text-white'>{sproduct.description}</p>
          </div>
        </button>
        <button onClick={()=>handleDeleteProduct(sproduct._id)}  className=' bg-red-500 w-[20%] p-1 rounded-md'>
          <img src="/cross.svg" alt="cross" className='size-[20px]'/>
        </button>
      </div>
    ))
  }
  else if(view === "all"){
    content = product.map((product)=>(
      <div className='flex gap-1 p-1 justify-center items-center hover:bg-blue-800'>
        <button key={product._id} className=' w-[90%] p-2 h-[50px] flex gap-2 items-center' onClick={()=>setproductId(product._id)}>
          <div className='size-[40px] rounded-md'>
            <img src={product.image||"defaultProduct.png"} alt="img" className='w-full h-full object-cover rounded-md' />
          </div>
          <div className='flex flex-col items-start'>
            <h1 className='text-md font-medium text-white '>{product.name}</h1>
            <p className='text-sm overflow-hidden hidden lg:block h-[20px] w-[140px] text-start text-white'>{product.description}</p>
          </div>
        </button>
        <button onClick={()=>handleDeleteProduct(product._id)}  className=' bg-red-500 size-[25px] w-[10%] rounded-md flex justify-center items-center'>
          <img src="/cross.svg" alt="cross" className='size-[20px]'/>
        </button>
      </div>
    ))
  }
    
  const [upproduct, setupproduct] = useState({
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
      setupproduct({...upproduct,image:base64Image})
    }
  }
  const validateForm = () =>{
    if(!upproduct.name.trim()) return toast.error("Name is required")
    if(!upproduct.price) return toast.error("Price is required")
    if(!upproduct.stock) return toast.error("Stock is required")
    if(!upproduct.category.trim()) return toast.error("Category is required")
    if (isNaN(upproduct.price)) return toast.error("Price should be a number");
    if (isNaN(upproduct.stock)) return toast.error("Stock should be a number");
    if(upproduct.price>10000) return toast.error("The price should be less than 10000")
    if(!upproduct.featured.trim()) return toast.error("Featured is required")
    return true
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    const success = validateForm()
    if(success === true) {
        updateProduct(productId,upproduct);
        setupproduct({
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
    <div className='flex flex-col h-screen'>
    <Navbar/>
    <div className='flex flex-1 w-full'>
      <div className='lg:w-1/5 w-2/5 bg-gradient-to-br flex-1 from-blue-800 to-blue-400 flex flex-col'>
        <form onSubmit={handleSearch} className='w-full py-3 flex justify-center gap-3 items-center relative'>
          <input type="text" placeholder={searchingProduct?"Searching...":"Search"} value={searchingProduct?"":searchQuery} onChange={handleSearchChange} className='w-4/5 rounded-full py-2 px-6 shd'/>
          <button type='submit' className='absolute right-[40px]' disabled={searchingProduct}><img src="/search.svg" alt="search" className='size-[25px]' /></button>
        </form>
        <div className=' bg-gradient-to-br from-blue-800 to-blue-400 w-full h-[calc(100vh-115px)] flex flex-col gap-1 overflow-auto '>
          {content}
        </div>
      </div>
      <div className='lg:w-4/5 w-3/5 h-full relative overflow-x-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-400' style={{
            clipPath:"polygon(0 0,100% 0,0 100%)"
        }}></div>
        <div className='absolute inset-0 bg-white' style={{
            clipPath:"polygon(100% 0,100% 100%,0 100%)"
        }}></div>
        {productId?(<form onSubmit={handleSubmit}>
            <div className='relative z-10 h-full w-full flex flex-col justify-center items-center lg:py-3 py-20'>
                    <div className='w-full h-2/5 flex justify-center items-center relative'>
                        <div className='border-[5px] border-white lg:size-[220px] size-[180px] rounded-full '>
                            <img src={upproduct.image||"defaultProduct.png"} className='h-full w-full object-cover rounded-full' alt="image" />
                        </div>
                        <label htmlFor='avatar-upload' className='cursor-pointer bg-gradient-to-br from-blue-800 to-blue-400 rounded-full p-1 h-[40px] absolute lg:left-[600px] left-[165px] lg:top-[166px] top-[135px] border-2 border-black hover:border-black'>
                            <img src="/camera.svg" disabled={updatingProduct} alt="camera" className='w-[30px] ' />
                            <input
                            type="file"
                            id='avatar-upload'
                            className='hidden'
                            accept='image/*'
                            onChange={handleImage}
                            disabled={updatingProduct}
                            />
                        </label>
                    </div>
                    <div className='w-full h-2/5  flex flex-col'>
                        <div className='lg:flex justify-center fint items-center gap-7 p-3'>
                            <div className='flex flex-col'>
                                <label htmlFor="name" className='ml-3 font-medium'>Name:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md' value={upproduct.name} onChange={(e)=>setupproduct({...upproduct,name:e.target.value})} placeholder='Name' type="text" id="name" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="price" className='ml-3 font-medium'>Price:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md' value={upproduct.price} onChange={(e)=>setupproduct({...upproduct,price:Number(e.target.value)})} placeholder='Price' type="number" id="price" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="stock" className='ml-3 font-medium'>Stock:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md' value={upproduct.stock} onChange={(e)=>setupproduct({...upproduct,stock:Number(e.target.value)})} placeholder='Stock' type="number" id="stock" />
                            </div>
                        </div>
                        <div className='lg:flex justify-center fint items-center gap-10 p-3'>
                            <div className='flex flex-col'>
                                <label htmlFor="description" className='ml-3 font-medium'>Description:-</label>
                                <input className=' bg-gray-300 py-1 px-3 rounded-md lg:w-[400px] w-[240px] h-[100px]' value={upproduct.description} onChange={(e)=>setupproduct({...upproduct,description:e.target.value})} placeholder='description' type="text" id="description" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="category" className='ml-3 font-medium'>Category:-</label>
                                <select name="category" value={upproduct.category} onChange={(e)=>setupproduct({...upproduct,category:e.target.value})} id="category" className=' bg-gray-300 py-1 px-3 rounded-md'>
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
                                <input type="radio" name='Yesno' onChange={(e)=>setupproduct({...upproduct,featured:e.target.value})} checked={upproduct.featured === "Yes"} value='Yes' />
                                <label htmlFor="Yes" className='mr-3 font-medium'>Yes</label>
                                <input type="radio" name='Yesno' onChange={(e)=>setupproduct({...upproduct,featured:e.target.value})} checked={upproduct.featured === "No"} value='No' />
                                <label htmlFor="No" className='mr-3 font-medium'>No</label>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={updatingProduct}
                        className='p-3 rounded-md text-xl mt-2 lg:w-[680px] w-[250px] text-white bg-gradient-to-br from-blue-800 to-blue-400 font-medium flex justify-center items-center gap-2'
                    >
                        {updatingProduct ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                            <span>Loading...</span>
                        </>
                        ) : (
                        "Submit"
                        )}
                    </button>
            </div>
        </form>):
        (
          <div className='relative z-10 w-full h-full flex justify-center items-center p-8'>
              <div className='flex flex-col items-center justify-center gap-4 p-10 text-center bg-gray-50/80 border-2 border-dashed border-gray-300 rounded-2xl'>
                  <LayoutList className='w-16 h-16 text-gray-400' strokeWidth={1} />
                  <div className='mt-2'>
                      <h3 className='text-xl font-semibold text-gray-700'>No Product Selected</h3>
                      <p className='text-gray-500 mt-1'>Please choose an item from the list to edit its details.</p>
                  </div>
              </div>
          </div>
        )}
      </div>
    </div>
    </div>
    </>
  )
}

export default UpdateProduct