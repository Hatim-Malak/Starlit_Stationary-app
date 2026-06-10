import React from 'react'
import Navbar from "../Components/Navbar.jsx";
import {useOrderStore} from '../store/useOrderStore.js'
import { useEffect, useState,useRef } from 'react';
import {toast} from "react-hot-toast"
import { Loader2,Loader,Info,SearchX,Search,Package,MapPin,Phone,User,Hash,DollarSign,ShoppingBag,CheckCircle,XCircle,AlertCircle,X } from 'lucide-react';

const AdminOrders = () => {
    const [status, setstatus] = useState("all")
    const [search, setsearch] = useState("")
    const [cancel, setcancel] = useState({})
    const [view,setview] = useState("status")
    const [cancelId,setcancelId] = useState(null)
    const[otp,setOtp] = useState({})
    const inputRefs = useRef({})
    const {getAllOrders,gettingAllOrders,allOrders,specificOrders,getSpecificOrders,gettingSpecificOrders,verifyOTP,cancelOrder,cancellingOrder} = useOrderStore()
    
    const handleCategoryChange = async(e)=>{
      const newstatus = e.target.value;
      setstatus(newstatus);
      setsearch("");
      setview("status");
      if(!newstatus.trim()) return;
      await getAllOrders(newstatus);
    }
    
    const handleChange = async(e,index,orderId)=>{
      const value = e.target.value.replace(/[^0-9]/g, "");
      const currentOtp = otp[orderId] || new Array(6).fill("");
      const newOtp = [...currentOtp];
      newOtp[index] = value;

      setOtp({ ...otp, [orderId]: newOtp });

      if (value && index < 5) {
        inputRefs.current[orderId][index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        const otpValue = newOtp.join("");
        const success = await verifyOTP(orderId, otpValue);
        if (success) {
          await getAllOrders(status);
        } else {
          setOtp({ ...otp, [orderId]: new Array(6).fill("") });
          inputRefs.current[orderId]?.[0]?.focus();
        }
      }
    };
    const handleKeyDown =(e,index,orderId)=>{
      if(e.key==="Backspace"&& !otp[orderId]?.[index] && index>0){
        inputRefs.current[orderId][index-1]?.focus();
      }
    };
    const handleSearchChange=(e)=>{
        setsearch(e.target.value)
    }
    const handleSearch =async(e)=>{
        e.preventDefault()
        if (!search.trim()) return;
        await getSpecificOrders(search)
        setview("search")   
      }
    const handleCancelOrder = async(id,why)=>{
      if(!why.trim()) return toast.error("📋 Please provide a reason for cancelling this order")
      await cancelOrder(id,why)
      await getAllOrders("all")
      setcancelId(null)
      setcancel(prev => {
        const newCancel = { ...prev };
        delete newCancel[id];
        return newCancel;
      });
      await getAllOrders(status);
    }
    useEffect(() => {
      if (status.trim()) getAllOrders(status);
    }, [status, getAllOrders]);
    let content  
    if(view === "status"){
        content = allOrders.map((all)=>{
            const item = all.items;
            return(
            <div key={all._id} className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full'>
                {all.isOrderCanceled.isTrue&&(
                <div className='w-full flex gap-2 p-4 bg-red-50 border-l-4 border-red-500 text-red-700'>
                  <AlertCircle className='w-5 h-5 flex-shrink-0 mt-0.5'/>
                  <p className='font-medium'>This order is canceled due to {all.isOrderCanceled.why}</p>
                </div>)}
                
                <div className='p-6'>
                  <div className='flex items-center gap-2 mb-6 pb-4 border-b-2 border-accent'>
                    <div className='p-2 bg-gradient-to-r from-primary to-secondary rounded-lg'>
                      <Package className='w-5 h-5 text-white' />
                    </div>
                    <h1 className='text-2xl font-bold text-primary'>Order Details</h1>
                  </div>

                  {/* Shipping Information */}
                  <div className='bg-warm rounded-xl p-4 mb-6 space-y-3'>
                    <h2 className='font-semibold text-primary mb-3 flex items-center gap-2'>
                      <MapPin className='w-4 h-4' />
                      Shipping Information
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <div className='flex items-center gap-2'>
                        <User className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Name:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.fullName}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Phone:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.mobileNumber}</span>
                      </div>
                      <div className='flex items-center gap-2 md:col-span-2'>
                        <MapPin className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Address:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.address}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Hash className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Postal Code:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.postalCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className='mb-6'>
                    <h2 className='font-semibold text-primary mb-3 flex items-center gap-2'>
                      <ShoppingBag className='w-4 h-4' />
                      Products
                    </h2>
                    <div className='border-2 border-gray-200 rounded-xl overflow-hidden'>
                      <div className='bg-gradient-to-r from-primary to-secondary text-white'>
                        <div className='flex justify-between items-center p-3'>
                          <h3 className='font-semibold w-[40%]'>Product Name</h3>
                          <h3 className='font-semibold w-[20%] text-center'>Price</h3>
                          <h3 className='font-semibold w-[20%] text-center'>Quantity</h3>
                          <h3 className='font-semibold w-[20%] text-center'>Total</h3>
                        </div>
                      </div>
                      <div className='divide-y divide-gray-200'>
                        {item.map((pro,idx)=>{
                          return(
                            <div key={idx} className='flex justify-between items-center p-3 hover:bg-warm transition-colors'>
                              <h3 className='text-gray-900 font-medium w-[40%]'>{pro.product?.name}</h3>
                              <h3 className='text-gray-700 w-[20%] text-center'>${pro.product?.price}</h3>
                              <h3 className='text-gray-700 w-[20%] text-center'>{pro.quantity}</h3>
                              <h3 className='text-gray-900 font-semibold w-[20%] text-center'>${pro.quantity*pro.product?.price}</h3>
                            </div>
                          )
                        })}
                      </div>
                      <div className='bg-warm p-4 border-t-2 border-accent'>
                        <div className='flex justify-between items-center'>
                          <span className='text-primary font-semibold text-lg flex items-center gap-2'>
                            <DollarSign className='w-5 h-5' />
                            Grand Total
                          </span>
                          <span className='text-2xl font-bold text-primary'>${all.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OTP Verification */}
                  {!(all.isOrderCanceled.isTrue||all.isDelivered)&&(
                  <div className='bg-gradient-to-r from-primary to-secondary rounded-xl p-5 mb-6'>
                    <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
                      <h3 className='font-semibold text-white text-lg'>Delivery Verification OTP</h3>
                      <div className='flex justify-center gap-2'>
                        {(otp[all._id] || new Array(6).fill("")).map((digit,index) => (
                          <input 
                            key={index} 
                            type="text" 
                            inputMode="numeric" 
                            maxLength="1" 
                            value={digit} 
                            onChange={(e)=>handleChange(e,index,all._id)} 
                            onKeyDown={(e)=>handleKeyDown(e,index,all._id)} 
                            ref={(el) => {
                              if (!inputRefs.current[all._id]) {
                                inputRefs.current[all._id] = [];
                              }
                              inputRefs.current[all._id][index] = el;
                            }} 
                            className='w-10 h-10 md:w-12 md:h-12 text-center text-xl font-bold bg-white border-2 border-accent/50 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none transition-all' 
                          />
                        ))}
                      </div>
                    </div>
                  </div>)}

                  {/* Status Badges */}
                  <div className='flex flex-wrap gap-4 mb-6'>
                    <div className='flex-1 min-w-[140px]'>
                      {all.isPaid?(
                        <div className='flex items-center gap-2 text-green-700 bg-green-100 p-3 border-2 border-green-500 rounded-xl font-semibold'>
                          <CheckCircle className='w-5 h-5' />
                          Payment Received
                        </div>
                      ):(
                        <div className='flex items-center gap-2 text-red-700 bg-red-100 p-3 border-2 border-red-500 rounded-xl font-semibold'>
                          <XCircle className='w-5 h-5' />
                          Payment Pending
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-[140px]'>
                      {all.isDelivered?(
                        <div className='flex items-center gap-2 text-green-700 bg-green-100 p-3 border-2 border-green-500 rounded-xl font-semibold'>
                          <CheckCircle className='w-5 h-5' />
                          Delivered
                        </div>
                      ):(
                        <div className='flex items-center gap-2 text-orange-700 bg-orange-100 p-3 border-2 border-orange-500 rounded-xl font-semibold'>
                          <AlertCircle className='w-5 h-5' />
                          In Transit
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancel Order Button */}
                  {!(all.isDelivered||all.isOrderCanceled.isTrue)&&(
                  <button 
                    onClick={()=>setcancelId(all._id)} 
                    className={`flex rounded-xl gap-2 justify-center items-center bg-red-500 hover:bg-red-600 ${(cancelId === all._id)?"hidden":"flex"} w-full p-4 text-white font-semibold transition-all shadow-md hover:shadow-lg`}
                  >
                    <X className='w-5 h-5' />
                    <span>Cancel Order</span>
                  </button>)}

                  {/* Cancel Order Form */}
                  <form 
                    className={`flex flex-col ${((cancelId === all._id))?"block":"hidden"} gap-3`} 
                    onSubmit={(e)=>{ e.preventDefault(); handleCancelOrder(all._id,cancel[all._id])}}
                  >
                    <textarea 
                      className='w-full rounded-xl p-4 h-[120px] bg-red-50 border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none' 
                      placeholder='Type your cancellation reason here...' 
                      value={cancel[all._id] || ''} 
                      disabled={cancellingOrder} 
                      onChange={(e)=>setcancel((prev)=>({...prev,[all._id]:e.target.value}))} 
                    />
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={()=>setcancelId(null)}
                        className='flex-1 p-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all'
                      >
                        Back
                      </button>
                      <button
                        type='submit'
                        disabled={cancellingOrder}
                        className='flex-1 p-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all'
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
                </div>
              </div>
            );
        });
    }  
    if(view === "search"){
        content = specificOrders.map((all)=>{
            const item = all.items;
            return(
            <div key={all._id} className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full'>
                {all.isOrderCanceled.isTrue&&(
                <div className='w-full flex gap-2 p-4 bg-red-50 border-l-4 border-red-500 text-red-700'>
                  <AlertCircle className='w-5 h-5 flex-shrink-0 mt-0.5'/>
                  <p className='font-medium'>This order is canceled due to {all.isOrderCanceled.why}</p>
                </div>)}
                
                <div className='p-6'>
                  <div className='flex items-center gap-2 mb-6 pb-4 border-b-2 border-accent'>
                    <div className='p-2 bg-gradient-to-r from-primary to-secondary rounded-lg'>
                      <Package className='w-5 h-5 text-white' />
                    </div>
                    <h1 className='text-2xl font-bold text-primary'>Order Details</h1>
                  </div>

                  {/* Shipping Information */}
                  <div className='bg-warm rounded-xl p-4 mb-6 space-y-3'>
                    <h2 className='font-semibold text-primary mb-3 flex items-center gap-2'>
                      <MapPin className='w-4 h-4' />
                      Shipping Information
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <div className='flex items-center gap-2'>
                        <User className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Name:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.fullName}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Phone:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.mobileNumber}</span>
                      </div>
                      <div className='flex items-center gap-2 md:col-span-2'>
                        <MapPin className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Address:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.address}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Hash className='w-4 h-4 text-primary' />
                        <span className='text-gray-600 text-sm'>Postal Code:</span>
                        <span className='font-medium text-gray-900'>{all.shippingAddress.postalCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className='mb-6'>
                    <h2 className='font-semibold text-primary mb-3 flex items-center gap-2'>
                      <ShoppingBag className='w-4 h-4' />
                      Products
                    </h2>
                    <div className='border-2 border-gray-200 rounded-xl overflow-hidden'>
                      <div className='bg-gradient-to-r from-primary to-secondary text-white'>
                        <div className='flex justify-between items-center p-3'>
                          <h3 className='font-semibold w-[40%]'>Product Name</h3>
                          <h3 className='font-semibold w-[20%] text-center'>Price</h3>
                          <h3 className='font-semibold w-[20%] text-center'>Quantity</h3>
                          <h3 className='font-semibold w-[20%] text-center'>Total</h3>
                        </div>
                      </div>
                      <div className='divide-y divide-gray-200'>
                        {item.map((pro,idx)=>{
                          return(
                            <div key={idx} className='flex justify-between items-center p-3 hover:bg-warm transition-colors'>
                              <h3 className='text-gray-900 font-medium w-[40%]'>{pro.product?.name}</h3>
                              <h3 className='text-gray-700 w-[20%] text-center'>${pro.product?.price}</h3>
                              <h3 className='text-gray-700 w-[20%] text-center'>{pro.quantity}</h3>
                              <h3 className='text-gray-900 font-semibold w-[20%] text-center'>${pro.quantity*pro.product?.price}</h3>
                            </div>
                          )
                        })}
                      </div>
                      <div className='bg-warm p-4 border-t-2 border-accent'>
                        <div className='flex justify-between items-center'>
                          <span className='text-primary font-semibold text-lg flex items-center gap-2'>
                            <DollarSign className='w-5 h-5' />
                            Grand Total
                          </span>
                          <span className='text-2xl font-bold text-primary'>${all.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OTP Verification */}
                  {!(all.isOrderCanceled.isTrue||all.isDelivered)&&(
                  <div className='bg-gradient-to-r from-primary to-secondary rounded-xl p-5 mb-6'>
                    <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
                      <h3 className='font-semibold text-white text-lg'>Delivery Verification OTP</h3>
                      <div className='flex justify-center gap-2'>
                        {(otp[all._id] || new Array(6).fill("")).map((digit,index) => (
                          <input 
                            key={index} 
                            type="text" 
                            inputMode="numeric" 
                            maxLength="1" 
                            value={digit} 
                            onChange={(e)=>handleChange(e,index,all._id)} 
                            onKeyDown={(e)=>handleKeyDown(e,index,all._id)} 
                            ref={(el) => {
                              if (!inputRefs.current[all._id]) {
                                inputRefs.current[all._id] = [];
                              }
                              inputRefs.current[all._id][index] = el;
                            }} 
                            className='w-10 h-10 md:w-12 md:h-12 text-center text-xl font-bold bg-white border-2 border-accent/50 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none transition-all' 
                          />
                        ))}
                      </div>
                    </div>
                  </div>)}

                  {/* Status Badges */}
                  <div className='flex flex-wrap gap-4 mb-6'>
                    <div className='flex-1 min-w-[140px]'>
                      {all.isPaid?(
                        <div className='flex items-center gap-2 text-green-700 bg-green-100 p-3 border-2 border-green-500 rounded-xl font-semibold'>
                          <CheckCircle className='w-5 h-5' />
                          Payment Received
                        </div>
                      ):(
                        <div className='flex items-center gap-2 text-red-700 bg-red-100 p-3 border-2 border-red-500 rounded-xl font-semibold'>
                          <XCircle className='w-5 h-5' />
                          Payment Pending
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-[140px]'>
                      {all.isDelivered?(
                        <div className='flex items-center gap-2 text-green-700 bg-green-100 p-3 border-2 border-green-500 rounded-xl font-semibold'>
                          <CheckCircle className='w-5 h-5' />
                          Delivered
                        </div>
                      ):(
                        <div className='flex items-center gap-2 text-orange-700 bg-orange-100 p-3 border-2 border-orange-500 rounded-xl font-semibold'>
                          <AlertCircle className='w-5 h-5' />
                          In Transit
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancel Order Button */}
                  {!(all.isDelivered||all.isOrderCanceled.isTrue)&&(
                  <button 
                    onClick={()=>setcancelId(all._id)} 
                    className={`flex rounded-xl gap-2 justify-center items-center bg-red-500 hover:bg-red-600 ${(cancelId === all._id)?"hidden":"flex"} w-full p-4 text-white font-semibold transition-all shadow-md hover:shadow-lg`}
                  >
                    <X className='w-5 h-5' />
                    <span>Cancel Order</span>
                  </button>)}

                  {/* Cancel Order Form */}
                  <form 
                    className={`flex flex-col ${(cancelId === all._id)?"block":"hidden"} gap-3`} 
                    onSubmit={(e)=>{ e.preventDefault(); handleCancelOrder(all._id,cancel[all._id])}}
                  >
                    <textarea 
                      className='w-full rounded-xl p-4 h-[120px] bg-red-50 border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none' 
                      placeholder='Type your cancellation reason here...' 
                      value={cancel[all._id] || ''} 
                      disabled={cancellingOrder} 
                      onChange={(e)=>setcancel((prev)=>({...prev,[all._id]:e.target.value}))} 
                    />
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={()=>setcancelId(null)}
                        className='flex-1 p-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all'
                      >
                        Back
                      </button>
                      <button
                        type='submit'
                        disabled={cancellingOrder}
                        className='flex-1 p-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all'
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
                </div>
              </div>
            );
        });
    }  
  return (
    <div className='min-h-screen flex flex-col w-full bg-gradient-to-r from-primary to-secondary'>
        <Navbar/>
        <div className='flex-1 flex justify-center items-center w-full py-8 px-4'>
            <div className='h-full max-w-6xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden'>
                {/* Header Section */}
                <div className='bg-gradient-to-r from-primary to-secondary p-6'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='p-3 bg-white rounded-xl'>
                      <Package className='w-7 h-7 text-primary' />
                    </div>
                    <h1 className='text-3xl font-bold text-white'>Order Management</h1>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className='flex flex-col md:flex-row gap-3'>
                    <form className='relative flex-1' onSubmit={handleSearch}>
                      <input 
                        type="text" 
                        placeholder={gettingSpecificOrders?"Searching...":"Search by order ID or customer name..."} 
                        value={gettingSpecificOrders?"":search} 
                        onChange={handleSearchChange} 
                        className='w-full rounded-xl py-3 pl-12 pr-4 bg-white border-2 border-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all shadow-md'
                      />
                      <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary' />
                      <button 
                        type='submit' 
                        className='absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-4 py-2 rounded-lg font-medium transition-all' 
                        disabled={gettingSpecificOrders}
                      >
                        Search
                      </button>
                    </form>
                    
                    <div className="relative md:w-48">
                      <select
                        name="category"
                        onChange={handleCategoryChange}
                        disabled={gettingAllOrders}
                        id="category"
                        className="w-full appearance-none bg-white text-primary font-semibold py-3 pl-4 pr-10 rounded-xl border-2 border-white/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 transition-all cursor-pointer shadow-md"
                      >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                <div className='flex-1 overflow-auto p-6 space-y-6'>
                    {(() => {
                      let productsToDisplay = [];
                      const isLoading = gettingAllOrders || gettingSpecificOrders;

                      if (view === "search") {
                        productsToDisplay = specificOrders;
                      } else if (view === "status") {
                        productsToDisplay = allOrders;
                      }

                      if (isLoading) {
                        return (
                          <div className='space-y-6'>
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full animate-pulse'>
                                <div className='p-6'>
                                  {/* Header */}
                                  <div className='flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100'>
                                    <div className='w-9 h-9 bg-gray-200 rounded-lg'></div>
                                    <div className='h-8 bg-gray-200 rounded w-40'></div>
                                  </div>
                                  
                                  {/* Shipping Info */}
                                  <div className='bg-gray-50 rounded-xl p-4 mb-6 space-y-3'>
                                    <div className='h-5 bg-gray-200 rounded w-48 mb-3'></div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                      {[...Array(4)].map((_, idx) => (
                                        <div key={idx} className={`flex items-center gap-2 ${idx === 2 ? 'md:col-span-2' : ''}`}>
                                          <div className='w-4 h-4 bg-gray-200 rounded-full flex-shrink-0'></div>
                                          <div className='h-4 bg-gray-200 rounded w-16'></div>
                                          <div className='h-4 bg-gray-200 rounded w-32'></div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Products Table */}
                                  <div className='mb-6'>
                                    <div className='h-5 bg-gray-200 rounded w-32 mb-3'></div>
                                    <div className='border-2 border-gray-100 rounded-xl overflow-hidden'>
                                      <div className='h-12 bg-gray-200'></div>
                                      <div className='p-3 space-y-4 py-4'>
                                        {[...Array(2)].map((_, idx) => (
                                          <div key={idx} className='flex justify-between items-center px-3'>
                                            <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                                            <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                                            <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                                            <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className='h-16 bg-gray-200 border-t-2 border-gray-100'></div>
                                    </div>
                                  </div>

                                  {/* OTP and Status */}
                                  <div className='h-20 bg-gray-200 rounded-xl mb-6'></div>
                                  <div className='flex gap-4 mb-6'>
                                    <div className='h-14 bg-gray-200 rounded-xl flex-1'></div>
                                    <div className='h-14 bg-gray-200 rounded-xl flex-1'></div>
                                  </div>
                                  {/* Cancel Button */}
                                  <div className='h-14 bg-gray-200 rounded-xl w-full'></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }

                      if (!productsToDisplay || productsToDisplay.length === 0) {
                        return (
                          <div className='flex flex-col items-center justify-center h-full gap-4 p-10 text-center'>
                            <div className='p-6 bg-warm-100 rounded-full'>
                              <SearchX className='w-16 h-16 text-primary' strokeWidth={1.5} />
                            </div>
                            <div className='mt-2'>
                              <h3 className='text-2xl font-bold text-gray-800'>No Orders Found</h3>
                              <p className='text-gray-600 mt-2 max-w-md'>
                                We couldn't find any orders matching your search. Try adjusting your filters or search terms.
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
    </div>
  )
}

export default AdminOrders
