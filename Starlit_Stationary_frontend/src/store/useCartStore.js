import { axiosInstance } from "../lib/axios.js";
import {toast} from "react-hot-toast"
import {create} from "zustand"
import {persist} from "zustand/middleware"

export const useTotalPriceStore = create(
  persist(
    (set) => ({
      totalPrice: 0,
      setTotalPrice: (price) => set({ totalPrice: price }),
      clearTotalPrice: () => set({ totalPrice: 0 }) 
    }),
    {
      name: "total-price-storage", 
      partialize: (state) => ({ totalPrice: state.totalPrice }) // only persist totalPrice
    }
  )
);

export const useCart = create((set,get)=>({
    Cart: { items: [] },
    gettingCart:false,
    addingToCart:false,

    addToCart:async(data)=>{
        set({addingToCart:true})
        try {
            const res = await axiosInstance.post("Cart/add",data)
            toast.success("Added to cart")        
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({addingToCart:false})
        }
    },
    getCart:async()=>{
        set({gettingCart:true})
        try {
            const res = await axiosInstance.get("Cart")
            set({Cart:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({gettingCart:false})
        }
    },
    updateCart:async(itemId,data)=>{
        try {
            const res = await axiosInstance.put(`Cart/update/${itemId}`,data)
            toast.success("Cart Updated")
            set((state) => {
                const updatedItems = state.Cart.items.map((item) =>
                  item._id === itemId ? { ...item, quantity: data.quantity } : item
                );
                return {
                  Cart: { ...state.Cart, items: updatedItems }
                };
            });

        }catch (error) {
            toast.error(error.response.data.message)
        }
    },
    removeCart:async(itemId)=>{
        try {
            const res = await axiosInstance.delete(`Cart/remove/${itemId}`)
            toast.success("item removed")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    deleteCart:async(id)=>{
        try {
            const res = await axiosInstance.delete(`Cart/${id}/delete`)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
}))