import React from 'react'
import { Link } from 'react-router-dom'
import { useIsAdmin } from '../store/useIsAdminStore.js'
import { useAuth } from '../store/useAuthStore.js'
import {useLocation} from 'react-router-dom'
import {useCart} from '../store/useCartStore.js';
import {Menu, Phone, Home, Package, ShoppingCart, FileText, Plus, Edit, ClipboardList, LogOut, UserPlus, LogIn, X, Store, ChevronDown} from 'lucide-react'
import { useEffect, useState } from 'react';

const Navbar = () => {
  const {authUser,logout,isCheckingAuth} = useAuth()
  const {authAdmin} = useIsAdmin()
  const location = useLocation()
  const [open, setopen] = useState(false)
  const [showAdminDropdown, setShowAdminDropdown] = useState(false)
  
  // Close mobile menu when route changes
  useEffect(() => {
    setopen(false)
  }, [location.pathname])

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAdminDropdown && !event.target.closest('.admin-dropdown-container')) {
        setShowAdminDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showAdminDropdown])

  return (
    <>
      {/* Main Navbar */}
      <nav className='sticky top-0 z-50 bg-gradient-to-r from-primary via-primary to-secondary shadow-lg border-b border-primary-900/30'>
        <div className='w-full px-4 lg:px-6'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo/Brand */}
            <Link to='/' className='flex items-center gap-2 group flex-shrink-0'>
              <div className='p-2 bg-secondary/30 rounded-lg group-hover:bg-secondary/50 transition-all duration-300'>
                <Store className='text-white' size={24} />
              </div>
              <div className='hidden sm:block'>
                <h1 className='font-bold text-xl text-white tracking-wide'>Starlit Stationary</h1>
                <p className='text-xs text-accent'>Quality you can trust</p>
              </div>
              <h1 className='sm:hidden font-bold text-lg text-white'>Starlit</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-1 flex-1 justify-end'>
              {/* Admin Dropdown for Desktop */}
              {(authUser && authAdmin && !isCheckingAuth) && (
                <>
                  <div className='relative admin-dropdown-container'>
                    <button
                      onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                        showAdminDropdown || location.pathname === "/newproduct" || location.pathname === "/updateproduct" || location.pathname === "/admin_order"
                          ? "bg-secondary/40 text-white" 
                          : "text-accent hover:bg-secondary/30 hover:text-warm"
                      }`}
                    >
                      <ClipboardList size={18} />
                      <span>Admin</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${showAdminDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showAdminDropdown && (
                      <div className='absolute top-full mt-2 left-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60]'>
                        <Link 
                          to='/newproduct'
                          onClick={() => setShowAdminDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 hover:bg-accent/20 transition-colors ${
                            location.pathname === "/newproduct" ? "bg-accent/20 text-primary" : "text-gray-700"
                          }`}
                        >
                          <Plus size={18} />
                          <span className='font-medium'>New Product</span>
                        </Link>
                        <Link 
                          to='/updateproduct'
                          onClick={() => setShowAdminDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 hover:bg-accent/20 transition-colors ${
                            location.pathname === "/updateproduct" ? "bg-accent/20 text-primary" : "text-gray-700"
                          }`}
                        >
                          <Edit size={18} />
                          <span className='font-medium'>Update Product</span>
                        </Link>
                        <Link 
                          to='/admin_order'
                          onClick={() => setShowAdminDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 hover:bg-accent/20 transition-colors ${
                            location.pathname === "/admin_order" ? "bg-accent/20 text-primary" : "text-gray-700"
                          }`}
                        >
                          <ClipboardList size={18} />
                          <span className='font-medium'>Admin Orders</span>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className='w-px h-8 bg-white/20 mx-2'></div>
                </>
              )}

              {/* Public Links */}
              <Link 
                to='/' 
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === "/" 
                    ? "bg-secondary/40 text-white" 
                    : "text-accent hover:bg-secondary/30 hover:text-warm"
                }`}
              >
                <Home size={18} />
                <span>Home</span>
                {location.pathname === "/" && (
                  <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-warm rounded-t-full'></div>
                )}
              </Link>
              <Link 
                to='/product' 
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === "/product" 
                    ? "bg-secondary/40 text-white" 
                    : "text-accent hover:bg-secondary/30 hover:text-warm"
                }`}
              >
                <Package size={18} />
                <span>Products</span>
                {location.pathname === "/product" && (
                  <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-warm rounded-t-full'></div>
                )}
              </Link>
              <Link 
                to='/contactUs' 
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === "/contactUs" 
                    ? "bg-secondary/40 text-white" 
                    : "text-accent hover:bg-secondary/30 hover:text-warm"
                }`}
              >
                <Phone size={18} />
                <span>Contact</span>
                {location.pathname === "/contactUs" && (
                  <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-warm rounded-t-full'></div>
                )}
              </Link>

              {/* User Links */}
              {(authUser && !isCheckingAuth) && (
                <>
                  <div className='w-px h-8 bg-white/20 mx-2'></div>
                  <Link 
                    to='/cart' 
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      location.pathname === "/cart" 
                        ? "bg-secondary/40 text-white" 
                        : "text-accent hover:bg-secondary/30 hover:text-warm"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    <span>Cart</span>
                    {location.pathname === "/cart" && (
                      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-warm rounded-t-full'></div>
                    )}
                  </Link>
                  <Link 
                    to='/yourorder' 
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      location.pathname === "/yourorder" 
                        ? "bg-secondary/40 text-white" 
                        : "text-accent hover:bg-secondary/30 hover:text-warm"
                    }`}
                  >
                    <FileText size={18} />
                    <span>Orders</span>
                    {location.pathname === "/yourorder" && (
                      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-warm rounded-t-full'></div>
                    )}
                  </Link>
                </>
              )}

              {/* Auth Links */}
              {isCheckingAuth ? (
                <div className='flex items-center ml-2'>
                  <div className='w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                </div>
              ) : !authUser ? (
                <>
                  <div className='w-px h-8 bg-white/20 mx-2'></div>
                  <Link 
                    to='/signup' 
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                      location.pathname === "/signup" 
                        ? "bg-warm text-primary" 
                        : "bg-warm/20 text-warm hover:bg-warm/30"
                    }`}
                  >
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </Link>
                  <Link 
                    to='/signin' 
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                      location.pathname === "/signin" 
                        ? "bg-warm text-primary" 
                        : "bg-accent/20 text-warm hover:bg-accent/30 border border-warm/30"
                    }`}
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className='w-px h-8 bg-white/20 mx-2'></div>
                  <button 
                    onClick={logout} 
                    className='flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-warm hover:bg-red-500/20 border border-red-400/50 hover:border-red-400 transition-all duration-200 whitespace-nowrap'
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setopen(true)}
              className='lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0'
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {open && (
        <div 
          className='fixed inset-0 bg-primary/80 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300'
          onClick={() => setopen(false)}
        ></div>
      )}

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-gradient-to-br from-primary via-primary to-secondary shadow-2xl z-[101] lg:hidden transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Mobile Menu Header */}
          <div className='flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0'>
            <div className='flex items-center gap-2'>
              <div className='p-2 bg-white/10 rounded-lg'>
                <Store className='text-white' size={20} />
              </div>
              <h2 className='font-bold text-lg text-white'>Menu</h2>
            </div>
            <button 
              onClick={() => setopen(false)}
              className='p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200'
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className='flex-1 overflow-y-auto py-4'>
            <div className='flex flex-col gap-1 px-3'>
              {/* Admin Links */}
              {(authUser && authAdmin && !isCheckingAuth) && (
                <>
                  <div className='px-3 py-2 text-xs font-semibold text-accent uppercase tracking-wider'>
                    Admin Panel
                  </div>
                  <Link 
                    to='/newproduct' 
                    onClick={() => setopen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/newproduct" 
                        ? "bg-secondary/40 text-white shadow-lg" 
                        : "text-accent hover:bg-secondary/30 hover:text-warm"
                    }`}
                  >
                    <Plus size={20} />
                    <span>New Product</span>
                  </Link>
                  <Link 
                    to='/updateproduct' 
                    onClick={() => setopen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/updateproduct" 
                        ? "bg-secondary/40 text-white shadow-lg" 
                        : "text-accent hover:bg-secondary/30 hover:text-warm"
                    }`}
                  >
                    <Edit size={20} />
                    <span>Update Product</span>
                  </Link>
                  <Link 
                    to='/admin_order' 
                    onClick={() => setopen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/admin_order" 
                        ? "bg-secondary/40 text-white shadow-lg" 
                        : "text-accent hover:bg-secondary/30 hover:text-warm"
                    }`}
                  >
                    <ClipboardList size={20} />
                    <span>Admin Orders</span>
                  </Link>
                  <div className='h-px bg-white/20 my-2'></div>
                </>
              )}

              {/* Public Navigation */}
              <div className='px-3 py-2 text-xs font-semibold text-accent uppercase tracking-wider'>
                Navigation
              </div>
              <Link 
                to='/' 
                onClick={() => setopen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === "/" 
                    ? "bg-secondary/40 text-white shadow-lg" 
                    : "text-accent hover:bg-secondary/30 hover:text-warm"
                }`}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link 
                to='/product' 
                onClick={() => setopen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === "/product" 
                    ? "bg-secondary/40 text-white shadow-lg" 
                    : "text-accent hover:bg-secondary/30 hover:text-warm"
                }`}
              >
                <Package size={20} />
                <span>Products</span>
              </Link>
              <Link 
                to='/contactUs' 
                onClick={() => setopen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === "/contactUs" 
                    ? "bg-secondary/40 text-white shadow-lg" 
                    : "text-accent hover:bg-secondary/30 hover:text-warm"
                }`}
              >
                <Phone size={20} />
                <span>Contact Us</span>
              </Link>

              {/* User Links */}
              {(authUser && !isCheckingAuth) && (
                <>
                  <div className='h-px bg-white/20 my-2'></div>
                  <div className='px-3 py-2 text-xs font-semibold text-accent uppercase tracking-wider'>
                    My Account
                  </div>
                  <Link 
                    to='/cart' 
                    onClick={() => setopen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/cart" 
                        ? "bg-secondary/40 text-white shadow-lg" 
                        : "text-accent hover:bg-secondary/30 hover:text-warm"
                    }`}
                  >
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                  </Link>
                  <Link 
                    to='/yourorder' 
                    onClick={() => setopen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === "/yourorder" 
                        ? "bg-secondary/40 text-white shadow-lg" 
                        : "text-accent hover:bg-secondary/30 hover:text-warm"
                    }`}
                  >
                    <FileText size={20} />
                    <span>My Orders</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className='border-t border-white/20 p-4 flex-shrink-0'>
            {isCheckingAuth ? (
              <div className='flex justify-center py-2'>
                <div className='w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
              </div>
            ) : !authUser ? (
              <div className='flex flex-col gap-2'>
                <Link 
                  to='/signup' 
                  onClick={() => setopen(false)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    location.pathname === "/signup" 
                      ? "bg-warm text-primary shadow-lg" 
                      : "bg-warm/20 text-warm hover:bg-warm/30"
                  }`}
                >
                  <UserPlus size={20} />
                  <span>Sign Up</span>
                </Link>
                <Link 
                  to='/signin' 
                  onClick={() => setopen(false)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    location.pathname === "/signin" 
                      ? "bg-warm text-primary shadow-lg" 
                      : "text-warm hover:bg-accent/20 border border-warm/30"
                  }`}
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => {
                  logout();
                  setopen(false);
                }}
                className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white hover:bg-red-500/20 border border-red-400/50 hover:border-red-400 transition-all duration-200'
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar