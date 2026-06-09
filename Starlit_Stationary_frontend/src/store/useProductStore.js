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

    getProduct:async()=>{
        set({gettingProduct:true})
        try {
            const res = await axiosInstance.get("Products/all")
            set({product:res.data})
        } catch (error) {
            console.log("error in getProduct",error)
            set({product:null})
        }finally{
            set({gettingProduct:false})
        }
    },

    searchProduct:async(data)=>{
        set({searchingProduct:true})
        try {
            const res = await axiosInstance.get("Products/search",{params: { query: data }})
            set({searchedProduct:res.data})
            toast.success("Product found")    
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({searchingProduct:false})
        }
    },
    getCategoryProduct:async(slug)=>{
        set({gettingCategoryProduct:true})
        try {
            const res = await axiosInstance.get(`Products/category/${slug}`)
            set({categoryProduct:res.data})
            toast.success("Product found")
        } catch (error) {
            toast.error(error.response.data.message)
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