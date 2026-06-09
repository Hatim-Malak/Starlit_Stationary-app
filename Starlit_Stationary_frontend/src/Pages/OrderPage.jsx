import React from 'react'
import Navbar from "../Components/Navbar.jsx";
import { useEffect, useState } from 'react';
import { useCart, useTotalPriceStore } from '../store/useCartStore.js';
import { useOrderStore } from '../store/useOrderStore.js'
import { toast } from "react-hot-toast"
import { Loader2, Info, ShoppingBag, MapPin, User, Phone, Mail } from 'lucide-react';
import { Navigate } from 'react-router-dom'

const OrderPage = () => {
  const { Cart, getCart, gettingCart, deleteCart } = useCart();
  const { totalPrice } = useTotalPriceStore()
  const { placeOrder, placingOrder } = useOrderStore()
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const [shippingAddress, setshippingAddress] = useState(
    {
      fullName: "",
      address: "",
      mobileNumber: null,
      postalCode: "",
    }
  )

  const ValidateForm = () => {
    if (!shippingAddress.fullName.trim()) {
      toast.error("fullName is required")
      return false
    }
    if (!shippingAddress.address.trim()) {
      toast.error("Address is required")
      return false
    }
    if (!/^[6-9]\d{9}$/.test(shippingAddress.mobileNumber)) {
      toast.error("Invalid mobile Number")
      return false
    }
    if (shippingAddress.mobileNumber.length < 10) {
      toast.error("A valid mobile Number is required")
      return false
    }
    if (!shippingAddress.postalCode.trim()) {
      toast.error("PostalCode is required")
      return false
    }
    return true;
  }

  const handleSubmit = async () => {
    const id = Cart._id
    const items = Cart.items.map(item => ({
      product: item.product,
      quantity: item.quantity
    }))
    if (!ValidateForm()) return
    const data = { items, shippingAddress, totalPrice }
    const success = await placeOrder(data)
    if (success) {
      await deleteCart(id)
      setOrderSuccess(true);
    }
  }

  if (orderSuccess) {
    return <Navigate to='/' />;
  }

  return (
    <div className='w-full min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <div className='flex-1 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Page Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Checkout</h1>
            <p className='text-gray-600'>Complete your order by filling in your shipping details</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Shipping Information Form */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <ShoppingBag className='w-5 h-5 text-blue-600' />
                  </div>
                  <h2 className='text-2xl font-bold text-gray-900'>Shipping Information</h2>
                </div>

                <form className='space-y-6' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  {/* Full Name */}
                  <div className='space-y-2'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                      <User className='w-4 h-4' />
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder='Enter your full name'
                      value={shippingAddress.fullName}
                      onChange={(e) => setshippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
                    />
                  </div>

                  {/* Address */}
                  <div className='space-y-2'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                      <MapPin className='w-4 h-4' />
                      Delivery Address
                    </label>
                    <textarea
                      placeholder='Enter your complete delivery address'
                      value={shippingAddress.address}
                      onChange={(e) => setshippingAddress({ ...shippingAddress, address: e.target.value })}
                      rows='3'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none'
                    />
                  </div>

                  {/* Mobile and Postal in Grid */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    {/* Mobile Number */}
                    <div className='space-y-2'>
                      <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                        <Phone className='w-4 h-4' />
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder='10-digit mobile number'
                        value={shippingAddress.mobileNumber}
                        onChange={(e) => setshippingAddress({ ...shippingAddress, mobileNumber: e.target.value })}
                        minLength='10'
                        maxLength='10'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
                      />
                    </div>

                    {/* Postal Code */}
                    <div className='space-y-2'>
                      <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                        <Mail className='w-4 h-4' />
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder='Enter postal code'
                        value={shippingAddress.postalCode}
                        onChange={(e) => setshippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
                      />
                    </div>
                  </div>

                  {/* Payment Notice - Mobile */}
                  <div className='lg:hidden mt-6'>
                    <div className='bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4'>
                      <div className='flex gap-3'>
                        <Info className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
                        <div>
                          <h3 className='font-semibold text-yellow-800 mb-1'>Cash on Delivery Only</h3>
                          <p className='text-sm text-yellow-700'>
                            We currently accept Cash on Delivery only. More payment methods will be available soon. 
                            A valid phone number is required as we will call to confirm your order.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Mobile */}
                  <button
                    type='submit'
                    disabled={placingOrder}
                    className='lg:hidden w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200'
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className='w-5 h-5' />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className='lg:col-span-1'>
              <div className='sticky top-8 space-y-6'>
                {/* Order Summary Card */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-6'>Order Summary</h3>
                  
                  <div className='space-y-4 mb-6'>
                    <div className='flex justify-between items-center pb-4 border-b border-gray-200'>
                      <span className='text-gray-600'>Subtotal</span>
                      <span className='font-semibold text-gray-900'>₹{totalPrice}</span>
                    </div>
                    <div className='flex justify-between items-center pb-4 border-b border-gray-200'>
                      <span className='text-gray-600'>Shipping</span>
                      <span className='font-semibold text-green-600'>Free</span>
                    </div>
                    <div className='flex justify-between items-center pt-2'>
                      <span className='text-lg font-bold text-gray-900'>Grand Total</span>
                      <span className='text-2xl font-bold text-blue-600'>₹{totalPrice}</span>
                    </div>
                  </div>

                  {/* Payment Notice - Desktop */}
                  <div className='hidden lg:block mb-6'>
                    <div className='bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4'>
                      <div className='flex gap-3'>
                        <Info className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
                        <div>
                          <h3 className='font-semibold text-yellow-800 mb-1'>Cash on Delivery</h3>
                          <p className='text-sm text-yellow-700'>
                            We currently accept Cash on Delivery only. A valid phone number is required for order confirmation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Desktop */}
                  <button
                    type='button'
                    onClick={handleSubmit}
                    disabled={placingOrder}
                    className='hidden lg:flex w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2 shadow-lg shadow-blue-200'
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className='w-5 h-5' />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Badge */}
                <div className='hidden lg:block bg-gray-50 rounded-xl border border-gray-200 p-4'>
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                      </svg>
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 text-sm mb-1'>Secure Checkout</h4>
                      <p className='text-xs text-gray-600'>Your information is protected and encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage
