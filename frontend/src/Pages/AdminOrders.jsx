import React from 'react'
import Navbar from "../Components/Navbar.jsx";
import {useOrderStore} from '../store/useOrderStore.js'
import { useEffect, useState,useRef } from 'react';
import {toast} from "react-hot-toast"
import { Loader2,Loader,Info,SearchX } from 'lucide-react';

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
        await verifyOTP(orderId, otpValue);
        await getAllOrders("all")
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
      if(!why.trim()) return toast.error("Reason of cancelling order is required")
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
            <div className='flex flex-col p-4 border-2 gap-1 border-black shd rounded-xl w-[99%] '>
                {all.isOrderCanceled.isTrue&&(
                <div className='w-full flex gap-2 p-2 border-y-2 border-red-500 bg-red-300 text-red-500 text-md font-medium'>
                  <Info className='text-red-500'/>
                  <p>This order is canceled due to {all.isOrderCanceled.why}</p>
                </div>)}
                <h1 className='text-xl font-bold'>Order:-</h1>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>To:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.fullName}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Mobile Number:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.mobileNumber}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Address:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.address}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Postal Code:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.postalCode}</h1>
                </div>
                <h1 className='text-xl font-bold'>Product:-</h1>
                <div className='border-2 border-gray-500 shd rounded-xl p-3 my-2'>
                  <div>
                    <div className='flex justify-between items-center'>
                      <h1 className='text-gray-500 text-md font-semibold w-[40%]'>Name</h1>
                      <h1 className='text-gray-500 text-md font-semibold w-[20%] text-center'>Price</h1>
                      <h1 className='text-gray-500 text-md font-semibold w-[20%] text-center'>Quantity</h1>
                      <h1 className='text-gray-500 text-md font-semibold w-[20%] text-center'>Total</h1>
                    </div>
                    <div className='border border-gray-600 w-full'></div>
                  </div>
                  {item.map((pro)=>{
                    return(
                      <div className='flex justify-between items-center'>
                        <h1 className='text-black text-md font-medium w-[40%]'>{pro.product?.name}</h1>
                        <h1 className='text-black text-md font-medium w-[20%] text-center'>{pro.product?.price}</h1>
                        <h1 className='text-black text-md font-medium w-[20%] text-center'>{pro.quantity}</h1>
                        <h1 className='text-black text-md font-medium w-[20%] text-center'>{pro.quantity*pro.product?.price}</h1>
                      </div>
                    )
                  })}
                </div>
                <div className='flex justify-between text-xl font-bold'>
                  <h1 className='text-gray-500'>Grand Total</h1>
                  <h1>{all.totalPrice}</h1>
                </div>
                {!(all.isOrderCanceled.isTrue||all.isDelivered)&&
                (<div className='flex justify-between text-xl font-semibold'>
                  <h1>Verification OTP:-</h1>
                  <div className='flex justify-center gap-3'>
                    {(otp[all._id] || new Array(6).fill("")).map((digit,index) => (
                        <input key={index} type="text" inputMode="numeric" maxLength="1" value={digit} onChange={(e)=>handleChange(e,index,all._id)} onKeyDown={(e)=>handleKeyDown(e,index,all._id)} 
                        ref={(el) => {
                          if (!inputRefs.current[all._id]) {
                            inputRefs.current[all._id] = [];
                          }
                          inputRefs.current[all._id][index] = el;
                        }} 
                        className='lg:size-8 size-6 text-center text-xl border border-gray-400 rounded-lg focus:"border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none ' />
                    ))}
                  </div>
                </div>)}
                <div className='flex justify-between'>
                  <div>
                  {all.isPaid?(
                    <div className='text-md text-green-500 p-2 border-2 border-green-500 rounded-md font-medium'>
                      Paid
                    </div>
                  ):(
                    <div className='text-md text-red-500 p-2 border-2 border-red-500 rounded-md font-medium'>
                      Not Paid
                    </div>
                  )}
                  </div>
                  <div>
                  {all.isDelivered?(
                    <div className='text-md text-green-500 p-2 border-2 border-green-500 rounded-md font-medium'>
                      Delivered
                    </div>
                  ):(
                    <div className='text-md text-red-500 p-2 border-2 border-red-500 rounded-md font-medium'>
                      Not Delivered
                    </div>
                  )}
                  </div>
                </div>
                {!(all.isDelivered||all.isOrderCanceled.isTrue)&&(
                <button onClick={()=>setcancelId(all._id)} className={`flex rounded-md gap-2 justify-center items-center bg-red-500 ${(cancelId === all._id)?"hidden":"block"} w-full p-3 text-xl text-white font-semibold`}>
                    <img src="cross.svg" className='size-[20px]' alt="cross" />
                    <h1>Cancel Order</h1>
                  </button>)}
                  <form className={`flex flex-col ${((cancelId === all._id))?"block":"hidden"} gap-2`} onSubmit={(e)=>{ e.preventDefault(); handleCancelOrder(all._id,cancel[all._id])}}>
                    <input type="text" className='w-full rounded-md p-3 h-[150px] bg-gray-300' placeholder='Type your reason here' value={cancel[all._id]} disabled={cancellingOrder} onChange={(e)=>setcancel((prev)=>({...prev,[all._id]:e.target.value}))} />
                    <button
                      type='submit'
                      disabled={cancellingOrder}
                      className='p-3 rounded-md text-xl mt-2 w-full text-white bg-red-500 font-medium flex justify-center items-center gap-2'
                      >
                      {cancellingOrder ? (
                      <>
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          <span>Loading...</span>
                      </>
                      ) : (
                        <>
                          <img src="cross.svg" className='size-[20px]' alt="cross" />
                          <h1>Cancel Order</h1>
                        </>
                      )}
                    </button>
                  </form>
              </div>
            );
        });
    }  
    if(view === "search"){
        content = specificOrders.map((all)=>{
            const item = all.items;
            return(
            <div key={all._id} className='flex flex-col p-4 border-2 gap-1 border-black shd rounded-xl w-[99%] '>
                {all.isOrderCanceled.isTrue&&(
                <div className='w-full flex gap-2 p-2 border-y-2 border-red-500 bg-red-300 text-red-500 text-md font-medium'>
                  <Info className='text-red-500'/>
                  <p>This order is canceled due to {all.isOrderCanceled.why}</p>
                </div>)}
                <h1 className='text-xl font-bold'>Order:-</h1>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>To:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.fullName}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Mobile Number:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.mobileNumber}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Address:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.address}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Postal Code:-</h1>
                  <h1 className='text-md font-bold'>{all.shippingAddress.postalCode}</h1>
                </div>
                <h1 className='text-xl font-bold'>Product:-</h1>
                <div className='border-2 border-gray-500 shd rounded-xl p-3 my-2'>
                  <div>
                    <div className='flex justify-between items-center'>
                      <h1 className='text-gray-500 text-md font-semibold w-[40%]'>Name</h1>
                      <h1 className='text-gray-500 text-md font-semibold w-[20%] text-center'>Price</h1>
                      <h1 className='text-gray-500 text-md font-semibold w-[20%] text-center'>Quantity</h1>
                      <h1 className='text-gray-500 text-md font-semibold w-[20%] text-center'>Total</h1>
                    </div>
                    <div className='border border-gray-600 w-full'></div>
                  </div>
                  {item.map((pro)=>{
                    return(
                      <div key={pro._id} className='flex justify-between items-center'>
                        <h1 className='text-black text-md font-medium w-[40%]'>{pro.product?.name}</h1>
                        <h1 className='text-black text-md font-medium w-[20%] text-center'>{pro.product?.price}</h1>
                        <h1 className='text-black text-md font-medium w-[20%] text-center'>{pro.quantity}</h1>
                        <h1 className='text-black text-md font-medium w-[20%] text-center'>{pro.quantity*pro.product?.price}</h1>
                      </div>
                    )
                  })}
                </div>
                <div className='flex justify-between text-xl font-bold'>
                  <h1 className='text-gray-500'>Grand Total</h1>
                  <h1>{all.totalPrice}</h1>
                </div>
                {!(all.isOrderCanceled.isTrue||all.isDelivered)&&(<div className='flex justify-between text-xl font-semibold'>
                  <h1>Verification OTP:-</h1>
                  <div className='flex justify-center gap-3'>
                    {(otp[all._id] || new Array(6).fill("")).map((digit,index) => (
                        <input key={index} type="text" inputMode="numeric" maxLength="1" value={digit} onChange={(e)=>handleChange(e,index,all._id)} onKeyDown={(e)=>handleKeyDown(e,index,all._id)} 
                        ref={(el) => {
                          if (!inputRefs.current[all._id]) {
                            inputRefs.current[all._id] = [];
                          }
                          inputRefs.current[all._id][index] = el;
                        }} 
                        className='lg:size-8 size-6 text-center text-xl border border-gray-400 rounded-lg focus:"border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none ' />
                    ))}
                  </div>
                </div>)}
                <div className='flex justify-between'>
                  <div>
                  {all.isPaid?(
                    <div className='text-md text-green-500 p-2 border-2 border-green-500 rounded-md font-medium'>
                      Paid
                    </div>
                  ):(
                    <div className='text-md text-red-500 p-2 border-2 border-red-500 rounded-md font-medium'>
                      Not Paid
                    </div>
                  )}
                  </div>
                  <div>
                  {all.isDelivered?(
                    <div className='text-md text-green-500 p-2 border-2 border-green-500 rounded-md font-medium'>
                      Delivered
                    </div>
                  ):(
                    <div className='text-md text-red-500 p-2 border-2 border-red-500 rounded-md font-medium'>
                      Not Delivered
                    </div>
                  )}
                  </div>
                </div>
                <div>
                  
                </div>
                {!(all.isDelivered||all.isOrderCanceled.isTrue)&&(<button onClick={()=>setcancelId(all._id)} className={`flex rounded-md gap-2 justify-center items-center bg-red-500 ${(cancelId === all._id)?"hidden":"block"} w-full p-3 text-xl text-white font-semibold`}>
                    <img src="cross.svg" className='size-[20px]' alt="cross" />
                    <h1>Cancel Order</h1>
                  </button>)}
                  <form className={`flex flex-col ${(cancelId === all._id)?"block":"hidden"} gap-2`} onSubmit={(e)=>{ e.preventDefault(); handleCancelOrder(all._id,cancel[all._id])}}>
                    <input type="text" className='w-full rounded-md p-3 h-[150px] bg-gray-300' value={cancel[all._id]} placeholder='Type your reason here' disabled={cancellingOrder} onChange={(e)=>setcancel((prev)=>({...prev,[all._id]:e.target.value}))} />
                    <button
                      type='submit'
                      disabled={cancellingOrder}
                      className='p-3 rounded-md text-xl mt-2 w-full text-white bg-red-500 font-medium flex justify-center items-center gap-2'
                      >
                      {cancellingOrder ? (
                      <>
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          <span>Loading...</span>
                      </>
                      ) : (
                        <>
                          <img src="cross.svg" className='size-[20px]' alt="cross" />
                          <h1>Cancel Order</h1>
                        </>
                      )}
                    </button>
                  </form>
              </div>
            );
        });
    }  
  return (
    <div className='h-screen flex flex-col w-full'>
        <Navbar/>
        <div className='bg-gradient-to-br from-blue-800 to-blue-400 fint h-[calc(100vh-49px)] flex justify-center items-center w-full'>
            <div className='h-[95%] lg:w-3/5 w-[95%] p-3 bg-white rounded-md flex flex-col gap-5'>
                <div className='flex gap-3 justify-between w-full'>
                    <form className='relative w-3/5' onSubmit={handleSearch}>
                        <input type="text" placeholder={gettingSpecificOrders?"Searching...":"Search"} value={gettingSpecificOrders?"":search} onChange={handleSearchChange} className='w-full rounded-full py-2 px-6 shd'/>
                        <button type='submit' className='absolute right-3 top-2' disabled={gettingSpecificOrders}><img src="/search.svg" alt="search" className='size-[25px]' /></button>
                    </form>
                    <div className="relative w-2/5">
                        <select
                        name="category"
                        onChange={handleCategoryChange}
                        disabled={gettingAllOrders}
                        id="category"
                        className="w-full appearance-none bg-blue-600/80 text-white py-1 pl-4 pr-10 rounded-lg border-2 border-blue-700 focus:outline-none focus:border-blue-400 transition-colors"
                        >
                        <option value="all">all</option>
                        <option value="pending">pending</option>
                        <option value="delivered">delivered</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className='h-[calc(100%-50px)] w-full overflow-auto flex flex-col gap-4 items-center '>
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
                          <div className='flex justify-center items-center h-full w-full col-span-full'>
                            <Loader className="size-10 animate-spin" />
                          </div>
                        );
                      }

                      if (!productsToDisplay || productsToDisplay.length === 0) {
                        return (
                          <div className='mt-[15%] flex w-[95%] flex-col items-center justify-center gap-4 p-10 text-center bg-gray-50/80 border-2 border-dashed border-gray-300 rounded-2xl col-span-full'>
                            <SearchX className='w-16 h-16 text-gray-400' strokeWidth={1} />
                            <div className='mt-2'>
                              <h3 className='text-xl font-semibold text-gray-700'>No Order Found</h3>
                              <p className='text-gray-500 mt-1'>
                                We couldn't find any order. Please try a different search or order status.
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