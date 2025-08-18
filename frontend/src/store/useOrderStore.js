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
            toast.success("Order is placed")
        } catch (error) {
            toast.error(error.response.data.message)
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
            toast.success("Order found")
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
            toast.success("Order found")
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
            toast.success("Order is verified")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({verifyingOTP:false})
        }
    },
    cancelOrder:async(id,why)=>{
        set({cancellingOrder:true})
        try {
            const res = await axiosInstance.delete(`order/${id}/delete`,{ data: { why } })
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({cancellingOrder:false})
        }
    }
}))