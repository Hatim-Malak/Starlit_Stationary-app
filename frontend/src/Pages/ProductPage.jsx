import React, { useState } from 'react'
import { useEffect } from 'react';
import {useProduct} from "../store/useProductStore.js"
import Navbar from "../Components/Navbar.jsx"
import {Loader,SearchX} from "lucide-react"
import {useCart} from "../store/useCartStore.js"

const ProductPage = () => {
  const {searchedProduct,searchingProduct,searchProduct,getCategoryProduct,categoryProduct,gettingCategoryProduct,gettingProduct,getProduct,product} = useProduct()
  const [searchQuery, setsearchQuery] = useState("")
  const [category, setcategory] = useState("")
  const [view,setview] = useState("all")
  const [quantities, setQuantities] = useState({});
  const {addToCart,addingToCart} = useCart()
  const [openDescriptions, setOpenDescriptions] = useState({});
  useEffect(() => {
    if (view === "all") getProduct();
  }, [view, getProduct]);

  const handleCategoryChange = async(e)=>{
    const selectedCategory = e.target.value;
    setcategory(selectedCategory);
    setsearchQuery("");
    setview("category");
    if(!selectedCategory.trim()) return;
    await getCategoryProduct(selectedCategory);
  }
  const handleSearchChange=(e)=>{
    setsearchQuery(e.target.value)
    setcategory("")
  }
  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) + delta, 0)
    }));
  };
  const handleCartSubmit=async(product)=>{
    const qty = quantities[product._id] || 1;
    await addToCart({ productId: product._id, quantity: qty });
    setQuantities({})
  }
  const handleToggleDescription = (productId) => {
    setOpenDescriptions(prevStates => ({
      ...prevStates,
      [productId]: !prevStates[productId]
    }));
  };

  let content
  const handleSearch =async(e)=>{
    e.preventDefault()
    if (!searchQuery.trim()) return;
    await searchProduct(searchQuery)
    setview("search")   
  }
  if(view === "search"){
    content = searchedProduct.map((sproduct)=>(
      <div key={sproduct._id} className='flex flex-col h-[220px] w-[170px] justify-center items-center pt-1  rounded-xl shd bg-white'>
        {openDescriptions[sproduct._id] ? (
      <div className='relative w-full h-full flex flex-col p-2'>
        <button
          onClick={() => handleToggleDescription(sproduct._id)}
          className='absolute top-1 right-1 p-1 text-gray-500 hover:text-black'
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h3 className='font-bold text-md mb-2 border-b pb-1'>Description</h3>
        <p className='text-sm text-gray-700 flex-grow overflow-y-auto'>
          {sproduct.description || "No description available."}
        </p>
      </div>
    ) : (
      <>
        <div className='w-[150px] h-[95px]'>
          <img className='w-full h-full object-cover rounded-xl' src={sproduct.image||"defaultProduct.png"} alt="img" />
        </div>
        <div className='w-full h-1/2 flex flex-col justify-center items-center gap-1 '>
          <h1 className='font-medium text-md'>{sproduct.name}</h1>
          <h1 className='font-medium text-xs'>Rs {sproduct.price}</h1>
          <button onClick={() => handleToggleDescription(sproduct._id)} className="text-xs text-blue-600 hover:underline">
            Description
          </button>
           <div className='flex items-center gap-2 p-2 rounded-md bg-blue-900'>
              {(!quantities[sproduct._id] || quantities[sproduct._id] === 0)&&(
                <img className='size-[20px]' src="/shop.svg" alt="shop" />
              )}
              {!(!quantities[sproduct._id] || quantities[sproduct._id] === 0)&&(
                <button onClick={() => handleQuantityChange(sproduct._id, -1)}>
                  <img src="/minus.svg" className='size-[20px]' alt="minus" />
                </button>
              )}
              <button onClick={(!quantities[sproduct._id] || quantities[sproduct._id] === 0)?(() => handleQuantityChange(sproduct._id, 1)):(() => handleCartSubmit(sproduct))} className='text-white text-md font-medium'>{quantities[sproduct._id] > 0?`Add ${quantities[sproduct._id] || 0}`:`Add Cart`}</button>
              {!(!quantities[sproduct._id] || quantities[sproduct._id] === 0)&&(
                <button onClick={() => handleQuantityChange(sproduct._id, 1)}>
                  <img src="/plus.svg" className='size-[20px]' alt="plus" />
                </button>
              )}
            </div>
        </div>
        </>
        )}
      </div>
    ))
  }
  else if(view === "category"){
    content = categoryProduct.map((cproduct)=>(
      <div key={cproduct._id} className='flex flex-col h-[220px] w-[170px] justify-center items-center pt-1  rounded-xl shd bg-white'>
        {openDescriptions[cproduct._id] ? (
      <div className='relative w-full h-full flex flex-col p-2'>
        <button
          onClick={() => handleToggleDescription(cproduct._id)}
          className='absolute top-1 right-1 p-1 text-gray-500 hover:text-black'
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h3 className='font-bold text-md mb-2 border-b pb-1'>Description</h3>
        <p className='text-sm text-gray-700 flex-grow overflow-y-auto'>
          {cproduct.description || "No description available."}
        </p>
      </div>
    ) : (
      <>
        <div className='w-[150px] h-[95px] '>
          <img className='w-full h-full object-cover rounded-xl' src={cproduct.image||"defaultProduct.png"} alt="img" />
        </div>
        <div className='w-full h-1/2 flex flex-col justify-center items-center gap-1 '>
          <h1 className='font-medium text-md'>{cproduct.name}</h1>
          <h1 className='font-medium text-xs'>Rs {cproduct.price}</h1>
          <button onClick={() => handleToggleDescription(cproduct._id)} className="text-xs text-blue-600 hover:underline">
            Description
          </button>
          <div className='flex items-center gap-2 p-2 rounded-md bg-blue-900'>
            {(!quantities[cproduct._id] || quantities[cproduct._id] === 0)&&(
              <img className='size-[20px]' src="/shop.svg" alt="shop" />
            )}
            {!(!quantities[cproduct._id] || quantities[cproduct._id] === 0)&&(
              <button onClick={() => handleQuantityChange(cproduct._id, -1)}>
                <img src="/minus.svg" className='size-[20px]' alt="minus" />
              </button>
            )}
            <button onClick={(!quantities[cproduct._id] || quantities[cproduct._id] === 0)?(() => handleQuantityChange(cproduct._id, 1)):(() => handleCartSubmit(cproduct))} className='text-white text-md font-medium'>{quantities[cproduct._id] > 0?`Add ${quantities[cproduct._id] || 0}`:`Add Cart`}</button>
            {!(!quantities[cproduct._id] || quantities[cproduct._id] === 0)&&(
              <button onClick={() => handleQuantityChange(cproduct._id, 1)}>
                <img src="/plus.svg" className='size-[20px]' alt="plus" />
              </button>
            )}
          </div>
        </div>
        </>
    )}
      </div>
    ))
  }
  else{
    content = product.map((pro)=>(
      <div key={pro._id} className='flex flex-col h-[220px] w-[170px] justify-center items-center pt-1 rounded-xl shd bg-white'>
     {openDescriptions[pro._id] ? (
      <div className='relative w-full h-full flex flex-col p-2'>
        <button
          onClick={() => handleToggleDescription(pro._id)}
          className='absolute top-1 right-1 p-1 text-gray-500 hover:text-black'
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h3 className='font-bold text-md mb-2 border-b pb-1'>Description</h3>
        <p className='text-sm text-gray-700 flex-grow overflow-y-auto'>
          {pro.description || "No description available."}
        </p>
      </div>
    ) : (
      <>
        <div className='w-[150px] h-[95px] '>
          <img className='w-full h-full object-cover rounded-xl' src={pro.image||"defaultProduct.png"} alt="img" />
        </div>
        <div className='w-full h-1/2 flex flex-col justify-center items-center gap-1 '>
          <h1 className='font-medium text-md'>{pro.name}</h1>
          <h1 className='font-medium text-xs'>Rs {pro.price}</h1>
          <button onClick={() => handleToggleDescription(pro._id)} className="text-xs text-blue-600 hover:underline">
            Description
          </button>
          <div className='flex items-center gap-2 p-2 rounded-md bg-blue-900'>
            {(!quantities[pro._id] || quantities[pro._id] === 0)&&(
              <img src="/shop.svg" className='size-[20px]' alt="shop" />
            )}
            {!(!quantities[pro._id] || quantities[pro._id] === 0)&&(
              <button onClick={() => handleQuantityChange(pro._id, -1)}>
                <img src="/minus.svg" className='size-[20px]' alt="minus" />
              </button>
            )}
            <button onClick={(!quantities[pro._id] || quantities[pro._id] === 0)?(() => handleQuantityChange(pro._id, 1)):(() => handleCartSubmit(pro))} className='text-white text-md font-medium'>{quantities[pro._id] > 0?`Add ${quantities[pro._id] || 0}`:`Add Cart`}</button>
            {!(!quantities[pro._id] || quantities[pro._id] === 0)&&(
              <button onClick={() => handleQuantityChange(pro._id, 1)}>
                <img src="/plus.svg" className='size-[20px]' alt="plus" />
              </button>
            )}
          </div>
        </div>
        </>
       )}
      </div>
    ))
  }
  

  return (
    <>
    <div className='h-screen flex flex-col'>
    <Navbar/>
    <div className='h-[calc(100vh-49px)] w-full flex flex-col bg-gradient-to-br from-blue-800 to-blue-400'>
      <div className='w-full py-3 flex justify-between gap-3 items-center lg:px-12 px-4'>
        <form className='w-3/5 relative' onSubmit={handleSearch}>
          <input type="text" placeholder={searchingProduct?"Searching...":"Search"} value={searchingProduct?"":searchQuery} onChange={handleSearchChange} className='w-full rounded-full py-2 px-6 shd'/>
          <button type='submit' className='absolute right-[20px] top-[8px] size-[25px]' disabled={searchingProduct}><img src="/search.svg" alt="search" /></button>
        </form>
        <div className="relative w-2/5">
        {/* The Select Input */}
        <select
          name="category"
          value={category}
          onChange={handleCategoryChange}
          disabled={gettingCategoryProduct}
          id="category"
          className="lg:w-full w-[150px] appearance-none bg-blue-600/80 text-white py-1 pl-4 pr-10 rounded-lg border-2 border-blue-700 focus:outline-none focus:border-blue-400 transition-colors"
        >
          {/* Add a default, disabled option */}
          <option disabled value="">Select a category</option>
          
          <option value="Writing Instruments">Writing Instruments</option>
          <option value="Paper Products">Paper Products</option>
          <option value="Files and Folders">Files and Folders</option>
          <option value="Art and Craft Supplies">Art and Craft Supplies</option>
          <option value="Desk and Office Supplies">Desk and Office Supplies</option>
          <option value="Adhesives and Corrections">Adhesives and Corrections</option>
          <option value="Gift and Packaging">Gift and Packaging</option>
          <option value="Organizers and Storage">Organizers and Storage</option>
        </select>
        
        {/* The Custom Arrow Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
      </div>
      <div className='grid lg:pl-16 pl-4 pb-10 pt-4 items-center justify-center gap-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-2 overflow-y-auto flex-1'>
        {(() => {
          let productsToDisplay = [];
          const isLoading = gettingProduct || gettingCategoryProduct || searchingProduct;

          if (view === 'search') {
            productsToDisplay = searchedProduct;
          } else if (view === 'category') {
            productsToDisplay = categoryProduct;
          } else {
            productsToDisplay = product;
          }

          if (isLoading) {
            return (
              <div className='flex justify-center items-center h-full w-full col-span-full'>
                <Loader className="size-10 animate-spin" />
              </div>
            );
          }

          // 2. After loading, check if the product list is empty
          if (!productsToDisplay || productsToDisplay.length === 0) {
            return (
              <div className='flex w-[95%] flex-col items-center justify-center gap-4 p-10 text-center bg-gray-50/80 border-2 border-dashed border-gray-300 rounded-2xl col-span-full'>
                <SearchX className='w-16 h-16 text-gray-400' strokeWidth={1} />
                <div className='mt-2'>
                  <h3 className='text-xl font-semibold text-gray-700'>No Products Found</h3>
                  <p className='text-gray-500 mt-1'>
                    We couldn't find any products. Please try a different search or category.
                  </p>
                </div>
              </div>
            );
          }
          return content;
        })()}
      </div>
    </div>
    </div>
    </>
    
  )
}

export default ProductPage
