import React from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'
import SignUpPage from './Pages/SignUpPage.jsx'
import SignInPage from './Pages/SignInPage.jsx'
import ProductPage from './Pages/ProductPage.jsx'
import HomePage from "./Pages/HomePage.jsx"
import NewProduct from './Pages/NewProduct.jsx'
import UpdateProduct from './Pages/UpdateProduct.jsx'
import { useAuth } from './store/useAuthStore.js'
import { useIsAdmin } from './store/useIsAdminStore.js'
import { useEffect } from 'react'
import {Loader} from "lucide-react"
import { Toaster } from 'react-hot-toast'
import CartPage from "./Pages/CartPage.jsx"
import OrderPage from "./Pages/OrderPage.jsx"
import YourOrderPage from "./Pages/YourOrderPage.jsx"
import AdminOrders from "./Pages/AdminOrders.jsx"
import Contact_Us from './Pages/Contact_Us.jsx'
import {useCart} from './store/useCartStore.js';
import {useOrderStore} from './store/useOrderStore.js'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuth()
  const {authAdmin,isCheckingAdmin,isAdmin} = useIsAdmin()
  useEffect(() => {
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (authUser) {
      isAdmin();
    }
  }, [authUser]);

  if((isCheckingAuth&&!authUser)&&(isCheckingAdmin&&!authAdmin)){
    return(
      <div className=' flex justify-center items-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
    <div className='h-full w-full'>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/product' element={<ProductPage/>}/>
        <Route path='/contactUs' element={<Contact_Us/>}/>
        <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to="/" />}/>
        <Route path='/signin' element={!authUser?<SignInPage/>:<Navigate to="/" />}/>
        <Route path='/cart' element={authUser?<CartPage/>:<Navigate to="/" />}/>
        <Route path='/order' element={authUser?<OrderPage/>:<Navigate to="/" />}/>
        <Route path='/yourorder' element={authUser?<YourOrderPage/>:<Navigate to="/" />}/>
        <Route path='/admin_order' element={authAdmin?<AdminOrders/>:<Navigate to="/" />}/>
        <Route path='/newproduct' element={authAdmin?<NewProduct/>:<Navigate to="/" />}/>
        <Route path='/updateproduct' element={authAdmin?<UpdateProduct/>:<Navigate to="/" />}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
