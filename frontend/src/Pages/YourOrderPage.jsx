import React from 'react'
import Navbar from "../Components/Navbar.jsx";
import {useOrderStore} from '../store/useOrderStore.js'
import { useEffect, useState } from 'react';
import { Loader2,Info,Loader,SearchX } from 'lucide-react';

const YourOrderPage = () => {
  const {getUserOrder,gettingOrder,orders,cancelOrder,cancellingOrder} = useOrderStore()
  const [cancel,setcancel] = useState({})
  const [cancelId,setcancelId] = useState(null)
  useEffect(() => {
    getUserOrder();
  }, [getUserOrder]);
  const handleCancelOrder = async(id,why)=>{
    if(!why.trim()) return toast.error("Reason of cancelling order is required")
    await cancelOrder(id,why)
    setcancelId(null)
  }
  return (
    <div className='w-full h-screen flex flex-col'>
      <Navbar/>
      <div className='bg-gradient-to-br from-blue-800 to-blue-400 fint h-[calc(100vh-49px)] flex justify-center items-center w-full'>
        <div className='lg:w-3/5 rounded-md w-[95%] gap-3 shd h-[94%] flex p-3 flex-col items-center bg-white overflow-auto'>
          {gettingOrder&&(
            <div className=' flex justify-center items-center h-full'>
              <Loader className="size-10 animate-spin" />
            </div>
          )}
          {!(orders.length === 0)?(orders.map((ord)=>{
            const item = ord.items
            return(
              <div key={ord._id} className={`flex flex-col p-4 border-2 gap-1 ${gettingOrder?"hidden":"block"} border-black shd rounded-xl w-[99%]`}>
                {ord.isOrderCanceled.isTrue&&(
                <div className='w-full flex gap-2 p-2 border-y-2 border-red-500 bg-red-300 text-red-500 text-md font-medium'>
                  <Info className='text-red-500'/>
                  <p>This order is canceled due to {ord.isOrderCanceled.why}</p>
                </div>)}
                <h1 className='text-xl font-bold'>Order:-</h1>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>To:-</h1>
                  <h1 className='text-md font-bold'>{ord.shippingAddress.fullName}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Mobile Number:-</h1>
                  <h1 className='text-md font-bold'>{ord.shippingAddress.mobileNumber}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Address:-</h1>
                  <h1 className='text-md font-bold'>{ord.shippingAddress.address}</h1>
                </div>
                <div className='flex items-center justify-between'>
                  <h1 className='text-md font-bold'>Postal Code:-</h1>
                  <h1 className='text-md font-bold'>{ord.shippingAddress.postalCode}</h1>
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
                  <h1>{ord.totalPrice}</h1>
                </div>
                {!(ord.isOrderCanceled.isTrue||ord.isDelivered)&&(
                <div className='flex justify-between text-xl font-semibold'>
                  <h1>Verification OTP:-</h1>
                  <h1>{ord.deliveryOTP.code}</h1>
                </div>)}
                <div className='flex justify-between mb-2'>
                  <div>
                  {ord.isPaid?(
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
                  {ord.isDelivered?(
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
                  {!(ord.isDelivered||ord.isOrderCanceled.isTrue)&&(<button onClick={()=>setcancelId(ord._id)} className={`flex rounded-md gap-2 justify-center items-center bg-red-500 ${(cancelId === ord._id)?"hidden":"block"} w-full p-3 text-xl text-white font-semibold`}>
                    <img src="cross.svg" className='size-[20px]' alt="cross" />
                    <h1>Cancel Order</h1>
                  </button>)}
                  <form className={`flex flex-col ${(cancelId === ord._id)?"block":"hidden"} gap-2`} onSubmit={(e)=>{ e.preventDefault(); handleCancelOrder(ord._id,cancel[ord._id])}}>
                    <input type="text" className='w-full rounded-md p-3 h-[150px] bg-gray-300' placeholder='Type your reason here' disabled={cancellingOrder} value={cancel[ord._id]} onChange={(e)=>setcancel((prev)=>({...prev,[ord._id]:e.target.value}))} />
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
            )
          })):(
            <div className={`mt-[17%] flex w-[95%] flex-col items-center justify-center gap-4 p-10 text-center bg-gray-50/80 ${gettingOrder?"hidden":"block"} border-2 border-dashed border-gray-300 rounded-2xl col-span-full`}>
              <SearchX className='w-16 h-16 text-gray-400' strokeWidth={1} />
              <div className='mt-2'>
                <h3 className='text-xl font-semibold text-gray-700'>No Order Found</h3>
                <p className='text-gray-500 mt-1'>
                  We couldn't find any order.Place an order to see one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YourOrderPage