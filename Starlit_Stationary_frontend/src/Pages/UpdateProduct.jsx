import React, { useState } from 'react'
import Navbar from "../Components/Navbar.jsx"
import { useProduct } from "../store/useProductStore.js"
import { useEffect } from 'react';
import { toast } from "react-hot-toast"
import { Loader2, Search, LayoutList, Camera, Trash2, Package, DollarSign, Layers, FileText, Tag, Star, Image as ImageIcon, Menu, X } from 'lucide-react';
import { useIsAdmin } from '../store/useIsAdminStore.js'

const UpdateProduct = () => {
  const { searchedProduct, searchingProduct, searchProduct, getProduct, product, gettingProduct } = useProduct()
  const [searchQuery, setsearchQuery] = useState("")
  const [id, setid] = useState("")
  const [view, setview] = useState("all")
  const [productId, setproductId] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { updateProduct, updatingProduct, deleteProduct, removingProduct } = useIsAdmin()

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

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return;
    await searchProduct(searchQuery)
    setview("search")
  }

  const handleSearchChange = (e) => {
    setsearchQuery(e.target.value)
  }

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id)
    await getProduct();
    setproductId("");
  }

  const handleProductSelect = (id) => {
    setproductId(id);
    setIsSidebarOpen(false); // Close sidebar on mobile when product is selected
  }

  let content
  if (searchingProduct || gettingProduct) {
    content = [...Array(5)].map((_, i) => (
      <div key={i} className='flex gap-1 sm:gap-2 p-1 sm:p-2 rounded-lg animate-pulse'>
        <div className='flex-1 min-w-0 flex gap-2 sm:gap-3 items-center overflow-hidden'>
          <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 flex-shrink-0'></div>
          <div className='flex flex-col items-start flex-1 min-w-0 gap-2'>
            <div className='h-4 bg-white/20 rounded w-3/4'></div>
            <div className='h-3 bg-white/20 rounded w-1/2'></div>
          </div>
        </div>
        <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/20 flex-shrink-0'></div>
      </div>
    ))
  }
  else if (view === "search") {
    if (!searchedProduct || searchedProduct.length === 0) {
      content = (
        <div className='p-4 text-center text-accent text-sm'>
          No products match your search.
        </div>
      )
    } else {
      content = searchedProduct.map((sproduct) => (
        <div key={sproduct._id || Math.random()} className='flex gap-1 sm:gap-2 p-1 sm:p-2 hover:bg-primary/50 transition-colors rounded-lg'>
          <button className='flex-1 min-w-0 flex gap-2 sm:gap-3 items-center overflow-hidden' onClick={() => handleProductSelect(sproduct._id)}>
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white border-2 border-white/20 flex-shrink-0'>
              <img src={sproduct.image || "defaultProduct.png"} alt="img" className='w-full h-full object-cover' />
            </div>
            <div className='flex flex-col items-start flex-1 min-w-0'>
              <h1 className='text-sm font-semibold text-white truncate w-full text-left'>{sproduct.name || "Unknown Product"}</h1>
              <p className='text-xs text-accent truncate w-full text-left'>{sproduct.description || "No description"}</p>
            </div>
          </button>
          <button
            onClick={() => handleDeleteProduct(sproduct._id)}
            className='bg-red-500 hover:bg-red-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0'
          >
            <Trash2 className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
          </button>
        </div>
      ))
    }
  }
  else if (view === "all") {
    if (!product || product.length === 0) {
      content = (
        <div className='p-4 text-center text-accent text-sm'>
          No products available.
        </div>
      )
    } else {
      content = product.map((productItem) => (
        <div key={productItem._id || Math.random()} className='flex gap-1 sm:gap-2 p-1 sm:p-2 hover:bg-primary/50 transition-colors rounded-lg'>
          <button className='flex-1 min-w-0 flex gap-2 sm:gap-3 items-center overflow-hidden' onClick={() => handleProductSelect(productItem._id)}>
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white border-2 border-white/20 flex-shrink-0'>
              <img src={productItem.image || "defaultProduct.png"} alt="img" className='w-full h-full object-cover' />
            </div>
            <div className='flex flex-col items-start flex-1 min-w-0'>
              <h1 className='text-sm font-semibold text-white truncate w-full text-left'>{productItem.name || "Unknown Product"}</h1>
              <p className='text-xs text-accent truncate w-full text-left'>{productItem.description || "No description"}</p>
            </div>
          </button>
          <button
            onClick={() => handleDeleteProduct(productItem._id)}
            className='bg-red-500 hover:bg-red-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0'
          >
            <Trash2 className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
          </button>
        </div>
      ))
    }
  }

  const [upproduct, setupproduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
    category: "",
    featured: "No"
  })

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return;
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64Image = reader.result;
      setupproduct({ ...upproduct, image: base64Image })
    }
  }

  const validateForm = () => {
    if (!upproduct.name.trim()) return toast.error("📝 Please enter a product name")
    if (!upproduct.price) return toast.error("💰 Please set a price for the product")
    if (!upproduct.stock) return toast.error("📦 Please enter the stock quantity")
    if (!upproduct.category.trim()) return toast.error("🏷️ Please select a product category")
    if (isNaN(upproduct.price)) return toast.error("💰 Price must be a valid number");
    if (isNaN(upproduct.stock)) return toast.error("📦 Stock must be a valid number");
    if (upproduct.price > 10000) return toast.error("💰 Price cannot exceed ₹10,000")
    if (!upproduct.featured.trim()) return toast.error("⭐ Please select whether this product is featured")
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = validateForm()
    if (success === true) {
      updateProduct(productId, upproduct);
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
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <Navbar />
        <div className='flex flex-1 w-full overflow-hidden relative'>
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-2xl hover:from-secondary hover:to-primary transition-all'
          >
            {isSidebarOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className='lg:hidden fixed inset-0 bg-black/50 z-30'
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Product List */}
          <div className={`
            fixed lg:relative inset-y-0 left-0 z-40
            w-80 lg:w-[350px]
            bg-gradient-to-br from-primary to-secondary 
            flex flex-col shadow-xl border-r-2 border-primary-900
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Search Section */}
            <div className='p-4 border-b border-accent'>
              <h2 className='text-xl font-bold text-white mb-3 flex items-center gap-2'>
                <Package className='w-6 h-6' />
                <span>Products</span>
              </h2>
              <form onSubmit={handleSearch} className='relative'>
                <input
                  type="text"
                  placeholder={searchingProduct ? "..." : "Search..."}
                  value={searchingProduct ? "" : searchQuery}
                  onChange={handleSearchChange}
                  className='w-full rounded-lg py-2 pl-2 lg:pl-4 pr-8 lg:pr-10 text-xs lg:text-base focus:ring-2 focus:ring-accent transition-all outline-none'
                  disabled={searchingProduct}
                />
                <button
                  type='submit'
                  className='absolute right-2 top-1/2 -translate-y-1/2'
                  disabled={searchingProduct}
                >
                  <Search className='w-4 h-4 lg:w-5 lg:h-5 text-gray-500' />
                </button>
              </form>
            </div>

            {/* Product List */}
            <div className='flex-1 overflow-y-auto p-1 sm:p-2 lg:p-3 space-y-2'>
              {content}
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex-1 overflow-y-auto bg-gradient-to-br from-warm to-warm-100'>
            {productId ? (
              <div className='max-w-5xl mx-auto p-3 sm:p-4 lg:p-6'>
                {/* Header */}
                <div className='mb-4 lg:mb-6'>
                  <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2'>Update Product</h1>
                  <p className='text-xs sm:text-sm lg:text-base text-gray-600'>Edit product details and save changes</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4 lg:space-y-6'>
                  {/* Product Image Section */}
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6'>
                    <h3 className='text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2'>
                      <ImageIcon className='w-4 h-4 lg:w-5 lg:h-5 text-primary' />
                      Product Image
                    </h3>
                    <div className='flex justify-center'>
                      <div className='relative'>
                        <div className='w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-accent overflow-hidden bg-gray-100 shadow-lg'>
                          <img
                            src={upproduct.image || "defaultProduct.png"}
                            className='h-full w-full object-cover'
                            alt="product"
                          />
                        </div>
                        <label
                          htmlFor='avatar-upload'
                          className='absolute bottom-1 right-1 lg:bottom-2 lg:right-2 cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center border-4 border-white shadow-lg transition-all'
                        >
                          <Camera className='w-5 h-5 lg:w-6 lg:h-6 text-white' />
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
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6'>
                    <h3 className='text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2'>
                      <Package className='w-4 h-4 lg:w-5 lg:h-5 text-primary' />
                      Basic Information
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>
                      <div className='space-y-2 sm:col-span-2 lg:col-span-1'>
                        <label htmlFor="name" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700'>
                          <Tag className='w-3 h-3 sm:w-4 sm:h-4' />
                          Product Name
                        </label>
                        <input
                          className='w-full px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none'
                          value={upproduct.name}
                          onChange={(e) => setupproduct({ ...upproduct, name: e.target.value })}
                          placeholder='Enter product name'
                          type="text"
                          id="name"
                        />
                      </div>
                      <div className='space-y-2'>
                        <label htmlFor="price" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700'>
                          <DollarSign className='w-3 h-3 sm:w-4 sm:h-4' />
                          Price (₹)
                        </label>
                        <input
                          className='w-full px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none'
                          value={upproduct.price}
                          onChange={(e) => setupproduct({ ...upproduct, price: Number(e.target.value) })}
                          placeholder='Enter price'
                          type="number"
                          id="price"
                        />
                      </div>
                      <div className='space-y-2'>
                        <label htmlFor="stock" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700'>
                          <Layers className='w-3 h-3 sm:w-4 sm:h-4' />
                          Stock Quantity
                        </label>
                        <input
                          className='w-full px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none'
                          value={upproduct.stock}
                          onChange={(e) => setupproduct({ ...upproduct, stock: Number(e.target.value) })}
                          placeholder='Enter stock'
                          type="number"
                          id="stock"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6'>
                    <h3 className='text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2'>
                      <FileText className='w-4 h-4 lg:w-5 lg:h-5 text-primary' />
                      Additional Details
                    </h3>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
                      <div className='space-y-2 lg:col-span-2'>
                        <label htmlFor="description" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700'>
                          <FileText className='w-3 h-3 sm:w-4 sm:h-4' />
                          Description
                        </label>
                        <textarea
                          className='w-full px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none resize-none'
                          value={upproduct.description}
                          onChange={(e) => setupproduct({ ...upproduct, description: e.target.value })}
                          placeholder='Enter product description'
                          id="description"
                          rows='4'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label htmlFor="category" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700'>
                          <Layers className='w-3 h-3 sm:w-4 sm:h-4' />
                          Category
                        </label>
                        <select
                          name="category"
                          value={upproduct.category}
                          onChange={(e) => setupproduct({ ...upproduct, category: e.target.value })}
                          id="category"
                          className='w-full px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none'
                        >
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
                      <div className='space-y-2'>
                        <label className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700'>
                          <Star className='w-3 h-3 sm:w-4 sm:h-4' />
                          Featured Product
                        </label>
                        <div className='flex items-center gap-4 sm:gap-6 h-10 sm:h-12'>
                          <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                              type="radio"
                              name='Yesno'
                              onChange={(e) => setupproduct({ ...upproduct, featured: e.target.value })}
                              checked={upproduct.featured === "Yes"}
                              value='Yes'
                              className='w-4 h-4 text-primary focus:ring-2 focus:ring-secondary'
                            />
                            <span className='text-xs sm:text-sm font-medium text-gray-700'>Yes</span>
                          </label>
                          <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                              type="radio"
                              name='Yesno'
                              onChange={(e) => setupproduct({ ...upproduct, featured: e.target.value })}
                              checked={upproduct.featured === "No"}
                              value='No'
                              className='w-4 h-4 text-primary focus:ring-2 focus:ring-secondary'
                            />
                            <span className='text-xs sm:text-sm font-medium text-gray-700'>No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={updatingProduct}
                    className='w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-3 lg:py-4 text-sm lg:text-base rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg'
                  >
                    {updatingProduct ? (
                      <>
                        <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Package className='w-4 h-4 lg:w-5 lg:h-5' />
                        <span>Update Product</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className='h-full flex items-center justify-center p-4 sm:p-6 lg:p-8'>
                <div className='flex flex-col items-center justify-center gap-3 lg:gap-4 p-8 lg:p-12 text-center bg-white border-2 border-dashed border-gray-300 rounded-2xl shadow-sm max-w-md'>
                  <div className='w-16 h-16 lg:w-20 lg:h-20 bg-warm-100 rounded-full flex items-center justify-center'>
                    <LayoutList className='w-8 h-8 lg:w-10 lg:h-10 text-primary' strokeWidth={1.5} />
                  </div>
                  <div className='mt-2'>
                    <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2'>No Product Selected</h3>
                    <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                      Please choose a product from the list to edit its details.
                    </p>
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
