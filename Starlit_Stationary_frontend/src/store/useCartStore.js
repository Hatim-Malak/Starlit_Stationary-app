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
    addingProductId:null,
    updatingItemId:null,
    removingItemId:null,

    addToCart:async(data)=>{
        set({addingProductId:data.productId})
        try {
            const res = await axiosInstance.post("Cart/add",data)
            toast.success("Item added to cart")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({addingProductId:null})
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
        set({updatingItemId:itemId})
        try {
            const res = await axiosInstance.put(`Cart/update/${itemId}`,data)
            toast.success("Cart updated successfully")
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
        }finally{
            set({updatingItemId:null})
        }
    },
    removeCart:async(itemId)=>{
        set({removingItemId:itemId})
        try {
            const res = await axiosInstance.delete(`Cart/remove/${itemId}`)
            toast.success("Item removed from cart")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({removingItemId:null})
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