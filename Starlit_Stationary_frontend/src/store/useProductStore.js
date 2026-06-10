import { axiosInstance } from "../lib/axios.js";
import {toast} from "react-hot-toast"
import {create} from "zustand"

export const useProduct = create((set,get)=>({
    product:[],
    searchedProduct:[],
    categoryProduct:[],
    featureProduct:[],
    gettingCategoryProduct:false,
    searchingProduct:false,
    gettingProduct:false,
    gettingFeatureProduct:false,

    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,

    setPage: (page) => set({ currentPage: page }),
    resetPagination: () => set({ currentPage: 1 }),

    getProduct:async(page = 1, limit = 12)=>{
        set({gettingProduct:true})
        try {
            const res = await axiosInstance.get("Products/all", { params: { page, limit } })
            if (Array.isArray(res.data)) {
                const total = res.data.length;
                const sliced = res.data.slice((page - 1) * limit, page * limit);
                set({ product: sliced, totalProducts: total, totalPages: Math.ceil(total / limit), currentPage: page })
            } else {
                set({ 
                    product: res.data.products || [], 
                    totalProducts: res.data.total || 0, 
                    totalPages: res.data.totalPages || 1, 
                    currentPage: res.data.page || page 
                })
            }
        } catch (error) {
            console.log("error in getProduct",error)
            set({product:null})
        }finally{
            set({gettingProduct:false})
        }
    },

    searchProduct:async(data, page = 1, limit = 12)=>{
        set({searchingProduct:true})
        try {
            const res = await axiosInstance.get("Products/search",{params: { query: data, page, limit }})
            if (Array.isArray(res.data)) {
                const total = res.data.length;
                const sliced = res.data.slice((page - 1) * limit, page * limit);
                set({ searchedProduct: sliced, totalProducts: total, totalPages: Math.ceil(total / limit), currentPage: page })
            } else {
                set({ 
                    searchedProduct: res.data.products || [], 
                    totalProducts: res.data.total || 0, 
                    totalPages: res.data.totalPages || 1, 
                    currentPage: res.data.page || page 
                })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "❌ Couldn't find products. Please try a different search")
        }finally{
            set({searchingProduct:false})
        }
    },
    getCategoryProduct:async(slug, page = 1, limit = 12)=>{
        set({gettingCategoryProduct:true})
        try {
            const res = await axiosInstance.get(`Products/category/${slug}`, { params: { page, limit } })
            if (Array.isArray(res.data)) {
                const total = res.data.length;
                const sliced = res.data.slice((page - 1) * limit, page * limit);
                set({ categoryProduct: sliced, totalProducts: total, totalPages: Math.ceil(total / limit), currentPage: page })
            } else {
                set({ 
                    categoryProduct: res.data.products || [], 
                    totalProducts: res.data.total || 0, 
                    totalPages: res.data.totalPages || 1, 
                    currentPage: res.data.page || page 
                })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "❌ Failed to load category products. Please try again")
        }finally{
            set({gettingCategoryProduct:false})
        }
    },
    getFeatureProduct:async()=>{
        set({gettingFeatureProduct:true})
        try {
            const res = await axiosInstance.get("Products/Feature")
            set({featureProduct:res.data})
        } catch (error) {
            console.log("error in getFeaturedPrduct",error)
        }finally{
            set({gettingFeatureProduct:false})
        }
    }
}))