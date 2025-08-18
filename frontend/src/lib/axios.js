import axios from "axios"

export const axiosInstance = new axios.create({
    baseURL:import.meta.env.MODE ==="development"? 'http://localhost:5001/api':"https://Starlit-Stationary.up.railway.app/api",
    withCredentials:true,
})