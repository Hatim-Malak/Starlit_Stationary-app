import React, { useState, useEffect, useCallback } from 'react'
import {useProduct} from "../store/useProductStore.js"
import Navbar from "../Components/Navbar.jsx"
import {Loader, SearchX, Search, Filter, ShoppingBag, Star, Package, X, ChevronLeft, ChevronRight} from "lucide-react"
import {useCart} from "../store/useCartStore.js"
import { usePagination } from "../Hooks/usePagination.js"
import { useDebounce } from "../Hooks/useDebounce.js"

const ProductPage = () => {
  const {searchedProduct,searchingProduct,searchProduct,getCategoryProduct,categoryProduct,gettingCategoryProduct,gettingProduct,getProduct,product, totalPages: storeTotalPages, totalProducts} = useProduct()
  const [searchQuery, setsearchQuery] = useState("")
  const [category, setcategory] = useState("")
  const [view,setview] = useState("all")
  const [quantities, setQuantities] = useState({});
  const {addToCart,addingToCart} = useCart()
  const [openDescriptions, setOpenDescriptions] = useState({});
  
  const pagination = usePagination({ initialPage: 1, initialLimit: 12 });
  const { page, limit, totalPages, setPage, setTotal, hasNext, hasPrev, nextPage, prevPage, reset } = pagination;

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (storeTotalPages !== undefined) {
      setTotal(totalProducts || (storeTotalPages * limit), limit);
    }
  }, [storeTotalPages, totalProducts, limit, setTotal]);

  useEffect(() => {
    if (view === "all") getProduct(page, limit);
    else if (view === "category" && category) getCategoryProduct(category, page, limit);
  }, [view, getProduct, getCategoryProduct, category, page, limit]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      setview("search");
      setcategory("");
      searchProduct(debouncedSearch, page, limit);
    }
  }, [debouncedSearch, searchProduct, page, limit]);

  const handleCategoryChange = async(e)=>{
    const selectedCategory = e.target.value;
    setcategory(selectedCategory);
    setsearchQuery("");
    setPage(1);
    if(!selectedCategory.trim()) {
      setview("all");
    } else {
      setview("category");
    }
  }
  
  const handleSearchChange=(e)=>{
    setsearchQuery(e.target.value)
    setPage(1)
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
    setPage(1);
    setview("search");
    await searchProduct(searchQuery, 1, limit);
  }

  const handleClearFilters = () => {
    setcategory("");
    setsearchQuery("");
    setview("all");
    setPage(1);
  }

  // Product Card Component to avoid repetition
  const ProductCard = ({ productData }) => (
    <div className='group relative flex flex-col h-[340px] lg:h-[380px] w-full justify-between rounded-3xl bg-white shadow-xl border border-warm/40 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2'>
      {openDescriptions[productData._id] ? (
        <div className='relative w-full h-full flex flex-col p-5 bg-gradient-to-br from-warm-50 to-warm'>
          <button
            onClick={() => handleToggleDescription(productData._id)}
            className='absolute top-3 right-3 p-2 rounded-full bg-white shadow-md text-secondary hover:text-primary hover:bg-warm-100 transition-all duration-200 z-10'
          >
            <X size={18} />
          </button>
          <div className='flex items-center gap-3 mb-4 pb-3 border-b-2 border-accent'>
            <Package className='text-primary' size={24} />
            <h3 className='font-bold text-xl text-primary'>Description</h3>
          </div>
          <p className='text-sm text-secondary flex-grow overflow-y-auto leading-relaxed pr-2'>
            {productData.description || "No description available."}
          </p>
        </div>
      ) : (
        <>
          {/* Product Image with Premium Badge */}
          <div className='relative w-full p-4 h-[180px] lg:h-[200px]'>
            <div className='w-full h-full rounded-2xl overflow-hidden bg-warm-50 relative group-hover:shadow-inner transition-all duration-500'>
              <img 
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                src={productData.image || "defaultProduct.png"} 
                alt={productData.name} 
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
            </div>
            {/* Optional New Badge or Category */}
          </div>

          {/* Product Info */}
          <div className='w-full flex flex-col justify-end px-5 pb-5 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <h1 className='font-bold text-base lg:text-lg text-primary line-clamp-1 group-hover:text-secondary transition-colors'>
                {productData.name}
              </h1>
              <div className='flex items-center justify-between'>
                <span className='font-extrabold text-primary text-lg lg:text-xl'>Rs {productData.price}</span>
                <button 
                  onClick={() => handleToggleDescription(productData._id)} 
                  className="text-xs text-secondary hover:text-primary hover:underline font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className='flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary shadow-md hover:shadow-lg transition-all duration-300 hover:from-secondary hover:to-primary mt-1 lg:mt-2'>
              {(!quantities[productData._id] || quantities[productData._id] === 0) ? (
                <div className='p-1 bg-white/20 rounded-lg'>
                  <ShoppingBag className='text-warm' size={18} />
                </div>
              ) : (
                <button 
                  onClick={() => handleQuantityChange(productData._id, -1)}
                  className='hover:bg-white/20 rounded-lg p-1 transition-colors'
                >
                  <img src="/minus.svg" className='size-[18px] filter invert brightness-0' alt="minus" />
                </button>
              )}
              <button
                onClick={(!quantities[productData._id] || quantities[productData._id] === 0) ? () => handleQuantityChange(productData._id, 1) : () => handleCartSubmit(productData)}
                className='flex-1 text-warm text-sm font-bold tracking-wide'
              >
                {quantities[productData._id] > 0 ? `Add ${quantities[productData._id]}` : `Add to Cart`}
              </button>
              {quantities[productData._id] > 0 && (
                <button 
                  onClick={() => handleQuantityChange(productData._id, 1)}
                  className='hover:bg-white/20 rounded-lg p-1 transition-colors'
                >
                  <img src="/plus.svg" className='size-[18px] filter invert brightness-0' alt="plus" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Removed premature content evaluation to avoid crashes

  return (
    <>
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-warm to-warm-100'>
      <Navbar/>
      
      <div className='flex-1 w-full flex flex-col'>
        {/* Enhanced Header Section */}
        <div className='w-full bg-gradient-to-r from-secondary to-primary shadow-lg'>
          <div className='container mx-auto px-4 lg:px-12 py-6'>
            {/* Title */}
            <div className='mb-4'>
              <h1 className='font-bold text-2xl lg:text-3xl text-white mb-1'>Our Products</h1>
              <p className='text-accent-100 text-sm'>Discover quality stationery for all your needs</p>
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
                    className='w-full rounded-xl py-3 pl-12 pr-4 shadow-md border-2 border-transparent focus:border-accent focus:outline-none transition-all bg-white text-primary'
                  />
                  {searchQuery && (
                    <button 
                      type='button'
                      onClick={() => {
                        setsearchQuery("");
                        setview("all");
                        setPage(1);
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
                <Filter className='absolute left-3 top-1/2 -translate-y-1/2 text-warm z-10 pointer-events-none' size={18} />
                <select
                  name="category"
                  value={category}
                  onChange={handleCategoryChange}
                  disabled={gettingCategoryProduct}
                  id="category"
                  className="w-full appearance-none bg-accent/20 backdrop-blur-sm text-warm py-3 pl-10 pr-10 rounded-xl border-2 border-warm/30 focus:outline-none focus:border-warm focus:bg-primary/30 transition-all font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <svg className="w-5 h-5 text-warm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(category || searchQuery) && (
              <div className='mt-4 flex flex-wrap items-center gap-2'>
                <span className='text-accent-100 text-sm font-medium'>Active filters:</span>
                {category && (
                  <div className='inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-warm text-sm border border-warm/30'>
                    <span>{category}</span>
                    <button 
                      onClick={() => {
                        setcategory("");
                        setview("all");
                        setPage(1);
                      }}
                      className='hover:bg-warm/20 rounded-full p-0.5 transition-colors'
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {searchQuery && (
                  <div className='inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-warm text-sm border border-warm/30'>
                    <span>Search: "{searchQuery}"</span>
                  </div>
                )}
                <button
                  onClick={handleClearFilters}
                  className='text-warm hover:text-accent text-sm underline transition-colors'
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
                  <>
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className='flex flex-col h-[340px] lg:h-[380px] w-full justify-between rounded-3xl bg-white shadow-xl border border-warm/40 overflow-hidden animate-pulse'>
                        {/* Skeleton Image Area */}
                        <div className='relative w-full p-4 h-[180px] lg:h-[200px]'>
                          <div className='w-full h-full rounded-2xl bg-gray-200'></div>
                        </div>
                        {/* Skeleton Product Info */}
                        <div className='w-full flex flex-col justify-end px-5 pb-5 gap-3'>
                          <div className='flex flex-col gap-2'>
                            {/* Title */}
                            <div className='h-5 bg-gray-200 rounded w-3/4'></div>
                            <div className='flex items-center justify-between'>
                              {/* Price */}
                              <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                              {/* View Details Link */}
                              <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                            </div>
                          </div>
                          {/* Add to Cart Button */}
                          <div className='h-11 rounded-xl bg-gray-200 w-full mt-1 lg:mt-2'></div>
                        </div>
                      </div>
                    ))}
                  </>
                );
              }

              if (!productsToDisplay || productsToDisplay.length === 0) {
                if (view === 'search') {
                  return (
                    <div className='flex w-full flex-col items-center justify-center gap-6 p-12 text-center bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl col-span-full shadow-xl'>
                      <div className='p-5 bg-warm/40 rounded-full shadow-inner'>
                        <SearchX className='w-14 h-14 text-primary' strokeWidth={1.5} />
                      </div>
                      <div className='max-w-md'>
                        <h3 className='font-extrabold text-2xl text-primary mb-3'>No Search Results</h3>
                        <p className='text-secondary text-lg leading-relaxed'>
                          We couldn't find anything matching "<span className='font-semibold text-primary'>{searchQuery}</span>". Try using different keywords or check for typos.
                        </p>
                      </div>
                      <button
                        onClick={handleClearFilters}
                        className='mt-2 px-8 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-warm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1'
                      >
                        Clear Search
                      </button>
                    </div>
                  );
                } else if (view === 'category') {
                  return (
                    <div className='flex w-full flex-col items-center justify-center gap-6 p-12 text-center bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl col-span-full shadow-xl'>
                      <div className='p-5 bg-warm/40 rounded-full shadow-inner'>
                        <Filter className='w-14 h-14 text-primary' strokeWidth={1.5} />
                      </div>
                      <div className='max-w-md'>
                        <h3 className='font-extrabold text-2xl text-primary mb-3'>Category Empty</h3>
                        <p className='text-secondary text-lg leading-relaxed'>
                          There are currently no products available in the <span className='font-semibold text-primary'>{category}</span> category.
                        </p>
                      </div>
                      <button
                        onClick={handleClearFilters}
                        className='mt-2 px-8 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-warm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1'
                      >
                        View All Products
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div className='flex w-full flex-col items-center justify-center gap-6 p-12 text-center bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl col-span-full shadow-xl'>
                      <div className='p-5 bg-warm/40 rounded-full shadow-inner'>
                        <Package className='w-14 h-14 text-primary' strokeWidth={1.5} />
                      </div>
                      <div className='max-w-md'>
                        <h3 className='font-extrabold text-2xl text-primary mb-3'>Catalog Empty</h3>
                        <p className='text-secondary text-lg leading-relaxed'>
                          We are currently updating our store. Please check back later for exciting new stationery products!
                        </p>
                      </div>
                    </div>
                  );
                }
              }
              return (
                <>
                  {productsToDisplay.map((pro) => (
                    <ProductCard key={pro._id || Math.random()} productData={pro} />
                  ))}
                  {totalPages > 1 && (
                    <div className="col-span-full flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => { prevPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={!hasPrev}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-warm font-medium hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={18} />
                        Previous
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const startPage = Math.max(1, page - 2);
                        const pageNum = startPage + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              pageNum === page
                                ? 'bg-primary text-warm shadow-md'
                                : 'bg-warm text-primary hover:bg-accent/30'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => { nextPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={!hasNext}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-warm font-medium hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProductPage
