import React from 'react'
import Navbar from "../Components/Navbar.jsx";
import { useOrderStore } from '../store/useOrderStore.js'
import { useEffect, useState } from 'react';
import { Loader2, Info, Loader, SearchX, Package, MapPin, Phone, User, Hash, X, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { toast } from "react-hot-toast"

const YourOrderPage = () => {
  const { getUserOrder, gettingOrder, orders, cancelOrder, cancellingOrder } = useOrderStore()
  const [cancel, setcancel] = useState({})
  const [cancelId, setcancelId] = useState(null)

  useEffect(() => {
    getUserOrder();
  }, [getUserOrder]);

  const handleCancelOrder = async (id, why) => {
    if (!why.trim()) return toast.error("Cancellation reason is required")
    await cancelOrder(id, why)
    setcancelId(null)
  }

  return (
    <div className='w-full min-h-screen flex flex-col bg-gradient-to-br from-primary to-secondary'>
      <Navbar />
      <div className='flex-1 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Page Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-white mb-2'>Your Orders</h1>
            <p className='text-accent'>Track and manage all your orders</p>
          </div>

          {/* Loading State */}
          {gettingOrder && (
            <div className='space-y-6'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='bg-white rounded-xl shadow-xl border-2 border-gray-100 overflow-hidden animate-pulse'>
                  <div className='p-6'>
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b-2 border-gray-100 gap-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gray-200 rounded-full flex-shrink-0'></div>
                        <div className='flex flex-col gap-2'>
                          <div className='h-6 bg-gray-200 rounded w-32'></div>
                          <div className='h-4 bg-gray-200 rounded w-24'></div>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <div className='h-8 w-20 bg-gray-200 rounded-full'></div>
                        <div className='h-8 w-24 bg-gray-200 rounded-full'></div>
                      </div>
                    </div>
                    {/* Shipping Info */}
                    <div className='mb-6'>
                      <div className='h-6 bg-gray-200 rounded w-48 mb-4'></div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100'>
                        {[...Array(4)].map((_, idx) => (
                          <div key={idx} className='flex items-start gap-3'>
                            <div className='w-8 h-8 bg-gray-200 rounded-full flex-shrink-0'></div>
                            <div className='flex-1 flex flex-col gap-2 mt-1'>
                              <div className='h-3 bg-gray-200 rounded w-20'></div>
                              <div className='h-4 bg-gray-200 rounded w-32'></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Products Table */}
                    <div className='mb-6'>
                      <div className='h-6 bg-gray-200 rounded w-32 mb-4'></div>
                      <div className='border-2 border-gray-100 rounded-lg overflow-hidden'>
                        <div className='h-10 bg-gray-200'></div>
                        <div className='p-4 space-y-4'>
                          {[...Array(2)].map((_, idx) => (
                            <div key={idx} className='flex justify-between items-center'>
                              <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                              <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                              <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                              <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                            </div>
                          ))}
                        </div>
                        <div className='h-14 bg-gray-200 border-t-2 border-gray-100'></div>
                      </div>
                    </div>
                    {/* Verification OTP */}
                    <div className='h-20 bg-gray-200 rounded-lg mb-6'></div>
                    {/* Cancel Button */}
                    <div className='h-12 w-full bg-gray-200 rounded-lg'></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Orders List */}
          {!gettingOrder && (
            <div className='space-y-6'>
              {orders.length === 0 ? (
                <div className='flex flex-col items-center justify-center gap-4 p-16 text-center bg-white border-2 border-dashed border-accent/50 rounded-2xl shadow-lg'>
                  <div className='w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center'>
                    <SearchX className='w-10 h-10 text-primary' strokeWidth={1.5} />
                  </div>
                  <div className='mt-2'>
                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>No Orders Found</h3>
                    <p className='text-gray-600 max-w-md'>
                      We couldn't find any orders. Place an order to see it here.
                    </p>
                  </div>
                </div>
              ) : (
                orders.map((ord) => {
                  const item = ord.items
                  return (
                    <div key={ord._id} className='bg-white rounded-xl shadow-xl border-2 border-accent/50 overflow-hidden hover:shadow-2xl transition-shadow duration-200'>
                      {/* Cancellation Notice */}
                      {ord.isOrderCanceled.isTrue && (
                        <div className='bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-4'>
                          <div className='flex gap-3'>
                            <XCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                            <div>
                              <h3 className='font-semibold text-red-900 mb-1'>Order Cancelled</h3>
                              <p className='text-sm text-red-700'>This order was cancelled due to: {ord.isOrderCanceled.why}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className='p-6'>
                        {/* Order Header */}
                        <div className='flex items-center justify-between mb-6 pb-4 border-b-2 border-accent'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg'>
                              <Package className='w-6 h-6 text-white' />
                            </div>
                            <div>
                              <h2 className='text-xl font-bold text-gray-900'>Order Details</h2>
                              <p className='text-sm text-gray-500'>Order ID: #{ord._id.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                          
                          {/* Status Badges */}
                          <div className='flex gap-2 flex-wrap justify-end'>
                            {ord.isPaid ? (
                              <div className='flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold'>
                                <CheckCircle className='w-4 h-4' />
                                <span>Paid</span>
                              </div>
                            ) : (
                              <div className='flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold'>
                                <XCircle className='w-4 h-4' />
                                <span>Not Paid</span>
                              </div>
                            )}
                            {ord.isDelivered ? (
                              <div className='flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold'>
                                <CheckCircle className='w-4 h-4' />
                                <span>Delivered</span>
                              </div>
                            ) : (
                              <div className='flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold'>
                                <Clock className='w-4 h-4' />
                                <span>In Transit</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Shipping Information */}
                        <div className='mb-6'>
                          <h3 className='text-lg font-bold text-gray-900 mb-4'>Shipping Information</h3>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-r from-warm to-warm-100 rounded-lg p-4 border border-accent'>
                            <div className='flex items-start gap-3'>
                              <div className='w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0'>
                                <User className='w-4 h-4 text-white' />
                              </div>
                              <div>
                                <p className='text-xs text-primary font-medium mb-1'>Full Name</p>
                                <p className='text-sm font-semibold text-gray-900'>{ord.shippingAddress.fullName}</p>
                              </div>
                            </div>
                            <div className='flex items-start gap-3'>
                              <div className='w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0'>
                                <Phone className='w-4 h-4 text-white' />
                              </div>
                              <div>
                                <p className='text-xs text-primary font-medium mb-1'>Mobile Number</p>
                                <p className='text-sm font-semibold text-gray-900'>{ord.shippingAddress.mobileNumber}</p>
                              </div>
                            </div>
                            <div className='flex items-start gap-3'>
                              <div className='w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0'>
                                <MapPin className='w-4 h-4 text-white' />
                              </div>
                              <div>
                                <p className='text-xs text-primary font-medium mb-1'>Address</p>
                                <p className='text-sm font-semibold text-gray-900'>{ord.shippingAddress.address}</p>
                              </div>
                            </div>
                            <div className='flex items-start gap-3'>
                              <div className='w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0'>
                                <Hash className='w-4 h-4 text-white' />
                              </div>
                              <div>
                                <p className='text-xs text-primary font-medium mb-1'>Postal Code</p>
                                <p className='text-sm font-semibold text-gray-900'>{ord.shippingAddress.postalCode}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Products Table */}
                        <div className='mb-6'>
                          <h3 className='text-lg font-bold text-gray-900 mb-4'>Order Items</h3>
                          <div className='border-2 border-accent rounded-lg overflow-hidden shadow-md'>
                            <div className='overflow-x-auto'>
                              <table className='w-full'>
                                <thead className='bg-gradient-to-r from-primary to-secondary'>
                                  <tr>
                                    <th className='px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider'>Product Name</th>
                                    <th className='px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider'>Price</th>
                                    <th className='px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider'>Quantity</th>
                                    <th className='px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider'>Total</th>
                                  </tr>
                                </thead>
                                <tbody className='divide-y divide-accent bg-white'>
                                  {item.map((pro, index) => (
                                    <tr key={index} className='hover:bg-warm transition-colors'>
                                      <td className='px-4 py-4 text-sm font-medium text-gray-900'>{pro.product?.name}</td>
                                      <td className='px-4 py-4 text-sm text-center text-gray-900'>₹{pro.product?.price}</td>
                                      <td className='px-4 py-4 text-sm text-center text-gray-900'>{pro.quantity}</td>
                                      <td className='px-4 py-4 text-sm text-center font-semibold text-gray-900'>₹{pro.quantity * pro.product?.price}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Grand Total */}
                            <div className='bg-gradient-to-r from-primary to-secondary px-4 py-4 border-t-2 border-primary-900'>
                              <div className='flex justify-between items-center'>
                                <span className='text-lg font-bold text-white'>Grand Total</span>
                                <span className='text-2xl font-bold text-white'>₹{ord.totalPrice}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Verification OTP */}
                        {!(ord.isOrderCanceled.isTrue || ord.isDelivered) && (
                          <div className='mb-6'>
                            <div className='bg-gradient-to-r from-primary to-secondary border-l-4 border-primary-900 rounded-lg p-4 shadow-lg'>
                              <div className='flex items-center gap-3 flex-wrap'>
                                <Shield className='w-6 h-6 text-white flex-shrink-0' />
                                <div className='flex-1 min-w-0'>
                                  <h4 className='font-semibold text-white mb-1'>Delivery Verification OTP</h4>
                                  <p className='text-sm text-accent'>Share this code with the delivery person to confirm delivery</p>
                                </div>
                                <div className='bg-white px-4 py-2 rounded-lg border-2 border-accent/50 shadow-md'>
                                  <span className='text-2xl font-bold text-primary tracking-wider'>{ord.deliveryOTP.code}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Cancel Order Section */}
                        {!(ord.isDelivered || ord.isOrderCanceled.isTrue) && (
                          <div>
                            {cancelId !== ord._id ? (
                              <button
                                onClick={() => setcancelId(ord._id)}
                                className='w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg'
                              >
                                <X className='w-5 h-5' />
                                <span>Cancel Order</span>
                              </button>
                            ) : (
                              <form
                                className='space-y-4'
                                onSubmit={(e) => { e.preventDefault(); handleCancelOrder(ord._id, cancel[ord._id]) }}
                              >
                                <div>
                                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Reason for Cancellation
                                  </label>
                                  <textarea
                                    className='w-full px-4 py-3 border-2 border-accent/50 rounded-lg focus:ring-2 focus:ring-secondary focus:border-accent transition-all outline-none resize-none'
                                    placeholder='Please tell us why you want to cancel this order...'
                                    disabled={cancellingOrder}
                                    value={cancel[ord._id] || ''}
                                    onChange={(e) => setcancel((prev) => ({ ...prev, [ord._id]: e.target.value }))}
                                    rows='4'
                                  />
                                </div>
                                <div className='flex gap-3'>
                                  <button
                                    type='button'
                                    onClick={() => setcancelId(null)}
                                    disabled={cancellingOrder}
                                    className='flex-1 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-md'
                                  >
                                    Keep Order
                                  </button>
                                  <button
                                    type='submit'
                                    disabled={cancellingOrder}
                                    className='flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md'
                                  >
                                    {cancellingOrder ? (
                                      <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Cancelling...</span>
                                      </>
                                    ) : (
                                      <>
                                        <X className='w-5 h-5' />
                                        <span>Confirm Cancellation</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YourOrderPage