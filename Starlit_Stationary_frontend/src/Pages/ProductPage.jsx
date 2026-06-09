import React, { useState } from 'react'
import { useEffect } from 'react';
import {useProduct} from "../store/useProductStore.js"
import Navbar from "../Components/Navbar.jsx"
import {Loader, SearchX, Search, Filter, ShoppingBag, Star, Package, X} from "lucide-react"
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

  const handleSearch =async(e)=>{
    e.preventDefault()
    if (!searchQuery.trim()) return;
    await searchProduct(searchQuery)
    setview("search")   
  }

  const handleClearFilters = () => {
    setcategory("");
    setsearchQuery("");
    setview("all");
  }

  // Product Card Component to avoid repetition
  const ProductCard = ({ productData }) => (
    <div className='group relative flex flex-col h-[300px] w-[180px] lg:h-[340px] lg:w-[200px] justify-between rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'>
      {openDescriptions[productData._id] ? (
        <div className='relative w-full h-full flex flex-col p-4 bg-gradient-to-br from-blue-50 to-white'>
          <button
            onClick={() => handleToggleDescription(productData._id)}
            className='absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 z-10'
          >
            <X size={18} />
          </button>
          <div className='flex items-center gap-2 mb-3 pb-2 border-b-2 border-blue-200'>
            <Package className='text-blue-600' size={20} />
            <h3 className='font-bold text-lg text-gray-800'>Description</h3>
          </div>
          <p className='text-sm text-gray-700 flex-grow overflow-y-auto leading-relaxed'>
            {productData.description || "No description available."}
          </p>
        </div>
      ) : (
        <>
          {/* Product Image */}
          <div className='relative w-full p-3'>
            <div className='w-full h-[130px] lg:h-[150px] rounded-xl overflow-hidden bg-gray-50 shadow-sm'>
              <img 
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' 
                src={productData.image || "defaultProduct.png"} 
                alt={productData.name} 
              />
            </div>
            {/* Hover overlay */}
            <div className='absolute inset-3 bg-blue-900/0 group-hover:bg-blue-900/10 rounded-xl transition-all duration-300 pointer-events-none'></div>
          </div>

          {/* Product Info */}
          <div className='w-full flex flex-col justify-end px-3 pb-3 gap-2'>
            <div className='min-h-[70px] lg:min-h-[80px] flex flex-col gap-1.5'>
              <h1 className='font-semibold text-sm lg:text-base text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors'>
                {productData.name}
              </h1>
              <div className='flex items-baseline gap-2'>
                <span className='font-bold text-blue-600 text-lg lg:text-xl'>Rs {productData.price}</span>
              </div>
              <button 
                onClick={() => handleToggleDescription(productData._id)} 
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline text-left font-medium transition-colors flex items-center gap-1"
              >
                <Package size={14} />
                View Details
              </button>
            </div>

            {/* Add to Cart Button */}
            <div className='flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800'>
              {(!quantities[productData._id] || quantities[productData._id] === 0) ? (
                <ShoppingBag className='text-white' size={18} />
              ) : (
                <button 
                  onClick={() => handleQuantityChange(productData._id, -1)}
                  className='hover:bg-white/20 rounded-md p-0.5 transition-colors'
                >
                  <img src="/minus.svg" className='size-[18px]' alt="minus" />
                </button>
              )}
              <button
                onClick={(!quantities[productData._id] || quantities[productData._id] === 0) ? () => handleQuantityChange(productData._id, 1) : () => handleCartSubmit(productData)}
                className='flex-1 text-white text-sm font-semibold'
              >
                {quantities[productData._id] > 0 ? `Add ${quantities[productData._id]}` : `Add to Cart`}
              </button>
              {quantities[productData._id] > 0 && (
                <button 
                  onClick={() => handleQuantityChange(productData._id, 1)}
                  className='hover:bg-white/20 rounded-md p-0.5 transition-colors'
                >
                  <img src="/plus.svg" className='size-[18px]' alt="plus" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  let content
  if(view === "search"){
    content = searchedProduct.map((sproduct)=>(
      <ProductCard key={sproduct._id} productData={sproduct} />
    ))
  }
  else if(view === "category"){
    content = categoryProduct.map((cproduct)=>(
      <ProductCard key={cproduct._id} productData={cproduct} />
    ))
  }
  else{
    content = product.map((pro)=>(
      <ProductCard key={pro._id} productData={pro} />
    ))
  }

  return (
    <>
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50'>
      <Navbar/>
      
      <div className='flex-1 w-full flex flex-col'>
        {/* Enhanced Header Section */}
        <div className='w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'>
          <div className='container mx-auto px-4 lg:px-12 py-6'>
            {/* Title */}
            <div className='mb-4'>
              <h1 className='font-bold text-2xl lg:text-3xl text-white mb-1'>Our Products</h1>
              <p className='text-blue-100 text-sm'>Discover quality stationery for all your needs</p>
            </div>

            {/* Search and Filter Bar */}
            <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
              {/* Search Form */}
              <form className='flex-1 relative' onSubmit={handleSearch}>
                <div className='relative'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                  <input 
                    type="text" 
                    placeholder={searchingProduct ? "Searching..." : "Search for products..."} 
                    value={searchingProduct ? "" : searchQuery} 
                    onChange={handleSearchChange} 
                    className='w-full rounded-xl py-3 pl-12 pr-4 shadow-md border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all bg-white'
                  />
                  {searchQuery && (
                    <button 
                      type='button'
                      onClick={() => {
                        setsearchQuery("");
                        setview("all");
                      }}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>

              {/* Category Dropdown */}
              <div className="relative min-w-[200px] sm:w-auto">
                <Filter className='absolute left-3 top-1/2 -translate-y-1/2 text-white z-10 pointer-events-none' size={18} />
                <select
                  name="category"
                  value={category}
                  onChange={handleCategoryChange}
                  disabled={gettingCategoryProduct}
                  id="category"
                  className="w-full appearance-none bg-white/20 backdrop-blur-sm text-white py-3 pl-10 pr-10 rounded-xl border-2 border-white/30 focus:outline-none focus:border-white focus:bg-white/30 transition-all font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" className='text-gray-800'>All Categories</option>
                  <option value="Writing Instruments" className='text-gray-800'>Writing Instruments</option>
                  <option value="Paper Products" className='text-gray-800'>Paper Products</option>
                  <option value="Files and Folders" className='text-gray-800'>Files and Folders</option>
                  <option value="Art and Craft Supplies" className='text-gray-800'>Art and Craft Supplies</option>
                  <option value="Desk and Office Supplies" className='text-gray-800'>Desk and Office Supplies</option>
                  <option value="Adhesives and Corrections" className='text-gray-800'>Adhesives and Corrections</option>
                  <option value="Gift and Packaging" className='text-gray-800'>Gift and Packaging</option>
                  <option value="Organizers and Storage" className='text-gray-800'>Organizers and Storage</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(category || searchQuery) && (
              <div className='mt-4 flex flex-wrap items-center gap-2'>
                <span className='text-blue-100 text-sm font-medium'>Active filters:</span>
                {category && (
                  <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm border border-white/30'>
                    <span>{category}</span>
                    <button 
                      onClick={() => {
                        setcategory("");
                        setview("all");
                      }}
                      className='hover:bg-white/20 rounded-full p-0.5 transition-colors'
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {searchQuery && (
                  <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm border border-white/30'>
                    <span>Search: "{searchQuery}"</span>
                  </div>
                )}
                <button
                  onClick={handleClearFilters}
                  className='text-white hover:text-blue-100 text-sm underline transition-colors'
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className='flex-1 container mx-auto px-4 lg:px-12 py-8'>
          <div className='grid items-start justify-center gap-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-2 min-h-[400px]'>
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
                  <div className='flex flex-col justify-center items-center h-[400px] w-full col-span-full gap-4'>
                    <Loader className="size-12 animate-spin text-blue-600" />
                    <p className='text-gray-600 font-medium'>Loading products...</p>
                  </div>
                );
              }

              if (!productsToDisplay || productsToDisplay.length === 0) {
                return (
                  <div className='flex w-full flex-col items-center justify-center gap-6 p-12 text-center bg-white border-2 border-dashed border-gray-300 rounded-2xl col-span-full shadow-lg'>
                    <div className='p-6 bg-gray-100 rounded-full'>
                      <SearchX className='w-16 h-16 text-gray-400' strokeWidth={1.5} />
                    </div>
                    <div className='max-w-md'>
                      <h3 className='font-bold text-2xl text-gray-800 mb-2'>No Products Found</h3>
                      <p className='text-gray-500 leading-relaxed'>
                        We couldn't find any products matching your criteria. Try adjusting your search or filters.
                      </p>
                    </div>
                    <button
                      onClick={handleClearFilters}
                      className='mt-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg'
                    >
                      Clear Filters
                    </button>
                  </div>
                );
              }
              return content;
            })()}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProductPage
