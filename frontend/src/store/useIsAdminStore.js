import { axiosInstance } from "../lib/axios.js";
import {toast} from "react-hot-toast"
import {create} from "zustand"

export const useIsAdmin = create((set,get)=>({
    authAdmin:null,
    Products:null,
    updatedProduct:null,
    isCheckingAdmin:true,
    addingProduct:false,
    updatingProduct:false,
    removingProduct:false,

    isAdmin:async()=>{
        try {
            const res = await axiosInstance.get("admin/IsAdmin")
            set({authAdmin:res.data})
        } catch (error) {
            console.log("error in useIsAdmin",error)
            set({authAdmin:null})
        }finally{
            set({isCheckingAdmin:false})
        }  
    },
    addProduct:async(data) =>{
        set({addingProduct:true})
        try {
            const res = await axiosInstance.post("admin/Products",data)
            set({Products:res.data})
            toast.success("New Product Added")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({addingProduct:false})
        }
    },
    updateProduct:async(productId,data)=>{
        set({updatingProduct:true})
        try {
            const res = await axiosInstance.put(`admin/Products/${productId}`,data)
            set({updatedProduct:res.data})
            toast.success("Product Updated")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({updatingProduct:false})
        }
    },
    deleteProduct:async(id)=>{
        set({removingProduct:true})
        try {
            const res = await axiosInstance.delete(`admin/${id}`)
            toast.success("Product is removed")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({removingProduct:false})
        }
    },
}))