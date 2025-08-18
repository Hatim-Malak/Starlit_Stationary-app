import React from 'react'
import Navbar from "../Components/Navbar.jsx";
import { useEffect, useState } from 'react';
import { useCart,useTotalPriceStore } from '../store/useCartStore.js';
import {useOrderStore} from '../store/useOrderStore.js'
import {toast} from "react-hot-toast"
import { Loader2,Info } from 'lucide-react';
import { Navigate } from 'react-router-dom'

const OrderPage = () => {
  const { Cart, getCart,gettingCart,deleteCart } = useCart();
  const {totalPrice} = useTotalPriceStore()
  const {placeOrder,placingOrder} = useOrderStore()
  const [orderSuccess, setOrderSuccess] = useState(false);
  useEffect(() => {
    getCart();
  }, [getCart]);

  const [shippingAddress, setshippingAddress] = useState(
    {
      fullName:"",
      address:"",
      mobileNumber:null,
      postalCode:"",
    }
  )
  const ValidateForm = () =>{
    if(!shippingAddress.fullName.trim()){ 
      toast.error("fullName is required")
      return false
    } 
    if(!shippingAddress.address.trim()){
      toast.error("Address is required")
      return false
    } 
    if(!/^[6-9]\d{9}$/.test(shippingAddress.mobileNumber)){
      toast.error("Invalid mobile Number")
      return false
    } 
    if(shippingAddress.mobileNumber.length<10){
      toast.error("A valid mobile Number is required")
      return false
    } 
    if(!shippingAddress.postalCode.trim()){
      toast.error("PostalCode is required")
      return false
    } 
    return true;
  }

  const handleSubmit = async () =>{
    const id =  Cart._id
    const items = Cart.items.map(item => ({
      product: item.product,
      quantity: item.quantity
    }))
    if(!ValidateForm()) return
      const data = {items,shippingAddress,totalPrice}
      const success = await placeOrder(data)
      if(success){
        await deleteCart(id)
        setOrderSuccess(true);
      }
  }
  if (orderSuccess) {
    return <Navigate to='/' />;
  } 
  return (
    <div className='w-full h-screen flex flex-col'>
      <Navbar/>
      <div className='h-[calc(100vh-49px)] flex justify-center items-center bg-gradient-to-br from-blue-800 to-blue-400 w-full'>
        <div className=' lg:w-3/5 w-[90%] lg:h-[90%] rounded-md bg-white overflow-auto flex-col p-3'>
          <h1 className='text-2xl font-bold text-black'>Personal Details:-</h1>
          <form className='flex flex-col gap-1' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className='flex-col flex gap-0.5'>
              <h1 className='text-lg font-bold'>full Name:-</h1>
              <input type="text" placeholder='Ex:-John Doe' value={shippingAddress.fullName} onChange={(e)=>setshippingAddress({...shippingAddress,fullName:e.target.value})} className='w-[95%] con rounded-md py-1 px-5' />
            </div>
            <div className='flex-col flex gap-0.5'>
              <h1 className='text-lg font-bold'>Address:-</h1>
              <input type="text" placeholder='Ex:-rajwara opp to abc chok' value={shippingAddress.address} onChange={(e)=>setshippingAddress({...shippingAddress,address:e.target.value})} className='w-[95%] con rounded-md py-1 px-5' />
            </div>
            <div className='flex-col flex gap-0.5'>
              <h1 className='text-lg font-bold'>Mobile Number:-</h1>
              <input type="tel" placeholder='Ex:-7894565555' value={shippingAddress.mobileNumber} onChange={(e)=>setshippingAddress({...shippingAddress,mobileNumber:e.target.value})} minLength='10' maxLength='10' className='w-[95%] con rounded-md py-1 px-5' />
            </div>
            <div className='flex-col flex gap-0.5'>
              <h1 className='text-lg font-bold'>PostalCode:-</h1>
              <input type="text" placeholder='Ex:-20389' value={shippingAddress.postalCode} onChange={(e)=>setshippingAddress({...shippingAddress,postalCode:e.target.value})} className='w-[95%] con rounded-md py-1 px-5' />
            </div>
            <div className='flex flex-col'>
              <div className='border-y-2 border-yellow-600 bg-yellow-200 text-yellow-600 flex gap-2 p-2'>
                <Info className='text-yellow-600 w-10'/>
                <p className='text-md font-medium'>Please note that we currently accept Cash on Delivery only. More payment methods will be available soon. A valid phone number is required as we will call to confirm your order.</p>
              </div>
              <div className='py-3 flex justify-between'> 
                <h1 className='text-2xl font-bold text-gray-500'>Grand Total</h1>
                <h1 className='text-2xl font-bold text-black'>Rs {totalPrice}</h1>
              </div>
            </div>
            <button type='submit' disabled={placingOrder} className='p-3 w-full bg-gradient-to-br from-blue-800 to-blue-400 text-white text-xl font-bold flex justify-center items-center'>
            {placingOrder ? (
              <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Loading...</span>
              </>
              ) : (
              "Place Order"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OrderPage
