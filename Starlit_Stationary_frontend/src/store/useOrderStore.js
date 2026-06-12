import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import {toast} from "react-hot-toast"

export const useOrderStore = create((set,get)=>({
    placingOrder:false,
    orders:[],
    allOrders:[],
    specificOrders:[],
    gettingSpecificOrder:false,
    verifyingOTP:false,
    gettingAllOrders:false,
    gettingOrder:false,
    cancellingOrder:false,
    
    placeOrder:async(data)=>{
        set({placingOrder:true})
        try {
            const res = await axiosInstance.post("order",data)
            toast.success("Order placed successfully")
            return true;
        } catch (error) {
            toast.error(error.response.data.message)
            return false;
        }finally{
            set({placingOrder:false})
        }
    },
    getUserOrder:async()=>{
        set({gettingOrder:true})
        try {
            const res = await axiosInstance.get("order/my-order")
            set({orders:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({gettingOrder:false})
        }
    },
    getAllOrders:async(data)=>{
        set({gettingAllOrders:true})
        try {
            const res = await axiosInstance.get("order",{params: { query: data }})
            set({allOrders:res.data})

        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({gettingAllOrders:false})
        }
    },
    getSpecificOrders:async(slug)=>{
        set({gettingSpecificOrders:true})
        try {
            const res = await axiosInstance.get(`order/customer/${slug}`)
            set({specificOrders:res.data})

        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({gettingSpecificOrders:false})
        }
    },
    verifyOTP:async(id,deliveryOTP)=>{
        set({verifyingOTP:true})
        try {
            const res = await axiosInstance.post(`order/customer/${id}/otp/verify`,{deliveryOTP})
            toast.success("Delivery verified successfully")
            set((state) => ({
                orders: state.orders.map(order => 
                    order._id === id ? { 
                        ...order, 
                        isDelivered: true, 
                        isPaid: true, 
                        deliveryOTP: { ...order.deliveryOTP, verified: true } 
                    } : order
                ),
                allOrders: state.allOrders.map(order => 
                    order._id === id ? { 
                        ...order, 
                        isDelivered: true, 
                        isPaid: true, 
                        deliveryOTP: { ...order.deliveryOTP, verified: true } 
                    } : order
                ),
                specificOrders: state.specificOrders.map(order => 
                    order._id === id ? { 
                        ...order, 
                        isDelivered: true, 
                        isPaid: true, 
                        deliveryOTP: { ...order.deliveryOTP, verified: true } 
                    } : order
                )
            }))
            return true;
        } catch (error) {
            toast.error(error.response.data.message)
            return false;
        }finally{
            set({verifyingOTP:false})
        }
    },
    cancelOrder:async(id,why)=>{
        set({cancellingOrder:true})
        try {
            const res = await axiosInstance.delete(`order/${id}/delete`,{ data: { why } })
            set((state) => ({
                orders: state.orders.map(order => 
                    order._id === id ? { ...order, isOrderCanceled: { isTrue: true, why } } : order
                ),
                allOrders: state.allOrders.map(order => 
                    order._id === id ? { ...order, isOrderCanceled: { isTrue: true, why } } : order
                ),
                specificOrders: state.specificOrders.map(order => 
                    order._id === id ? { ...order, isOrderCanceled: { isTrue: true, why } } : order
                )
            }))
            return true;
        } catch (error) {
            toast.error(error.response.data.message)
            return false;
        }finally{
            set({cancellingOrder:false})
        }
    }
}))