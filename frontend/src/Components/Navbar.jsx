import React from 'react'
import { Link } from 'react-router-dom'
import { useIsAdmin } from '../store/useIsAdminStore.js'
import { useAuth } from '../store/useAuthStore.js'
import {useLocation} from 'react-router-dom'
import {useCart} from '../store/useCartStore.js';
import {Menu,Phone} from 'lucide-react'
import { useEffect, useState } from 'react';

const Navbar = () => {
  const {authUser,logout} = useAuth()
  const {authAdmin} = useIsAdmin()
  const location = useLocation()
  const [open, setopen] = useState(false)
  return (
    <div className='relative'>
    <div className='bg-gradient-to-br from-blue-800 to-blue-400 w-full flex text-white px-3 font-medium fint justify-between items-center'>
        <h1 className='text-xl'>Starlit Stationary</h1>
        <div className='flex items-center justify-center hidden lg:block lg:flex'>
            {(authUser&&authAdmin)&&(
              <>
                <Link to='/newproduct' className={`hover:bg-blue-700 p-3 px-4 flex justify-center items-center gap-1 ${(location.pathname === "/newproduct")&&"bg-blue-500"}`}>
                  <img src="/new.svg" alt="new" className='size-[18px]' />
                  <h1 className='hidden lg:block'>New Product</h1>
                </Link>
                <Link to='/updateproduct' className={`hover:bg-blue-700 p-3 flex justify-center items-center gap-1 px-4 ${(location.pathname === "/updateproduct")&&"bg-blue-500"}`}>
                  <img src="/update.svg" className='size-[20px]' alt="update" />
                  <h1 className='hidden lg:block'>Update Product</h1>
                </Link>
                <Link to='/admin_order' className={`hover:bg-blue-700 flex justify-center items-center gap-1 p-3 px-4 ${(location.pathname === "/admin_order")&&"bg-blue-500"}`}>
                  <img src="/order.svg" className='size-[23px]' alt="order" />
                  <h1 className='hidden lg:block'>Admin Order</h1>
                </Link>
              </>
            )}
            <Link to='/' className={`hover:bg-blue-700 p-3 flex justify-center items-center gap-1 px-4 ${(location.pathname === "/")&&"bg-blue-500"}`}>
                <img className='size-[23px]' src="/home.svg" alt="home" />
                <h1 className='hidden lg:block'>Home</h1>
              </Link>
            <Link to='/product' className={`hover:bg-blue-700 p-3 flex justify-center items-center gap-1 px-4 ${(location.pathname === "/product")&&"bg-blue-500"}`}>
              <img src="/product.svg" className='size-[23px]' alt="product" />
              <h1 className='hidden lg:block'>Product</h1>
            </Link>
            <Link to='/contactUs' className={`hover:bg-blue-700 p-3 flex justify-center items-center gap-1 px-4 ${(location.pathname === "/contactUs")&&"bg-blue-500"}`}>
              <Phone className='size-[20px] text-black' />
              <h1 className='hidden lg:block'>Contact Us</h1>
            </Link>
            {authUser&&(
              <>
                <Link to='/cart' className={`hover:bg-blue-700 flex justify-center items-center gap-1 p-3 px-4 ${(location.pathname === "/cart")&&"bg-blue-500"}`}>
                  <img src="/shop.svg" className='size-[23px]' alt="shop" />
                  <h1 className='hidden lg:block'>Cart</h1>
                </Link>
                <Link to='/yourorder' className={`hover:bg-blue-700 flex justify-center items-center gap-1 p-3 px-4 ${(location.pathname === "/yourorder")&&"bg-blue-500"}`}>
                  <img src="/order.svg" className='size-[23px]' alt="order" />
                  <h1 className='hidden lg:block'>Order</h1>
                </Link>
              </>
            )}
            {!authUser&&(
              <>
                <Link to='/signup' className={`hover:bg-blue-700 p-3 px-4 ${(location.pathname === "/signup")&&"bg-blue-500"}`}>Sign Up</Link>
                <Link to='/signin' className={`hover:bg-blue-700 p-3 px-4 ${(location.pathname === "/signin")&&"bg-blue-500"}`}>Sign In</Link>
              </>
            )}
            {authUser&&(
              <>
                <button onClick={logout} className='flex gap-2 justify-center items-center  hover:bg-blue-700 p-3 px-4'>
                  <img src="/logout.svg" alt="logout" className='size-[25px]' />
                  <h1 className='hidden lg:block'>logout</h1>
                </button>
              </>
            )}
        </div>
        <button className='flex justify-center items-center lg:hidden hover:bg-blue-700 p-3 px-4' onClick={()=>setopen(true)}>
          <Menu/>
        </button>
    </div>
    <div className={`bg-gradient-to-br from-blue-800 to-blue-400 flex flex-col items-center h-screen absolute transition-all z-[9999] top-0 right-0 w-[45%] text-white justify-start ${open?"block":"hidden"} lg:hidden`}>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-xl font-semibold p-3 px-4 text-white'>Menu</h1>
              <button className='hover:bg-blue-700 p-3 px-4' onClick={()=>setopen(false)}><Menu/></button>
            </div>
            {(authUser&&authAdmin)&&(
              <>
                <Link to='/newproduct' onClick={()=>setopen(false)} className={`hover:bg-blue-700 p-3 w-full px-4 flex justify-center items-center gap-1 ${(location.pathname === "/newproduct")&&"bg-blue-500"}`}>
                  <img src="/new.svg" alt="new" className='size-[18px]' />
                  <h1>New Product</h1>
                </Link>
                <Link to='/updateproduct' onClick={()=>setopen(false)} className={`hover:bg-blue-700 p-3 w-full flex justify-center items-center gap-1 px-4 ${(location.pathname === "/updateproduct")&&"bg-blue-500"}`}>
                  <img src="/update.svg" className='size-[20px]' alt="update" />
                  <h1>Update Product</h1>
                </Link>
                <Link to='/admin_order' onClick={()=>setopen(false)} className={`hover:bg-blue-700 flex justify-center items-center w-full gap-1 p-3 px-4 ${(location.pathname === "/admin_order")&&"bg-blue-500"}`}>
                  <img src="/order.svg" className='size-[23px]' alt="order" />
                  <h1>Admin Order</h1>
                </Link>
              </>
            )}
            <Link to='/' onClick={()=>setopen(false)} className={`hover:bg-blue-700 p-3 flex w-full justify-center items-center gap-1 px-4 ${(location.pathname === "/")&&"bg-blue-500"}`}>
                <img className='size-[23px]' src="/home.svg" alt="home" />
                <h1>Home</h1>
              </Link>
            <Link to='/product' onClick={()=>setopen(false)} className={`hover:bg-blue-700 p-3 flex w-full justify-center items-center gap-1 px-4 ${(location.pathname === "/product")&&"bg-blue-500"}`}>
              <img src="/product.svg" className='size-[23px]' alt="product" />
              <h1>Product</h1>
            </Link>
            <Link to='/contactUs' onClick={()=>setopen(false)} className={`hover:bg-blue-700 p-3 flex w-full justify-center items-center gap-1 px-4 ${(location.pathname === "/contactUs")&&"bg-blue-500"}`}>
              <Phone className='size-[20px] text-black'/>
              <h1>Contact Us</h1>
            </Link>
            {authUser&&(
              <>
                <Link to='/cart' onClick={()=>setopen(false)} className={`hover:bg-blue-700 flex justify-center items-center w-full gap-1 p-3 px-4 ${(location.pathname === "/cart")&&"bg-blue-500"}`}>
                  <img src="/shop.svg" className='size-[23px]' alt="shop" />
                  <h1>Cart</h1>
                </Link>
                <Link to='/yourorder' onClick={()=>setopen(false)} className={`hover:bg-blue-700 flex justify-center items-center w-full gap-1 p-3 px-4 ${(location.pathname === "/yourorder")&&"bg-blue-500"}`}>
                  <img src="/order.svg" className='size-[23px]' alt="order" />
                  <h1>Order</h1>
                </Link>
              </>
            )}
            {!authUser&&(
              <>
                <Link to='/signup' onClick={()=>setopen(false)} className={`hover:bg-blue-700 w-full p-3 px-4 ${(location.pathname === "/signup")&&"bg-blue-500"}`}>Sign Up</Link>
                <Link to='/signin' onClick={()=>setopen(false)} className={`hover:bg-blue-700 p-3 px-4 w-full ${(location.pathname === "/signin")&&"bg-blue-500"}`}>Sign In</Link>
              </>
            )}
            {authUser&&(
              <>
                <button onClick={logout} className='flex gap-2 justify-center items-center  hover:bg-blue-700 p-3 px-4'>
                  <img src="/logout.svg" alt="logout" className='size-[25px]' />
                  <h1>logout</h1>
                </button>
              </>
            )}
        </div>
    </div>
  )
}

export default Navbar