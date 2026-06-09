import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./Routes/auth.route.js";
import productRoutes from "./Routes/product.route.js"
import adminProductRoute from "./Routes/admin.product.route.js"
import cartRoute from "./Routes/cart.route.js"
import orderRoute from "./Routes/order.route.js"
import {connectdb} from "./lib/db.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const allowedOrigins = [
    "http://localhost:5173",//for development
    "https://starlit-stationary-frontend.vercel.app"
]

app.use(cookieParser())
app.use(cors({
    origin:allowedOrigins ,
    credentials: true,
}))

app.use(express.json({ limit: "5mb" }))
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/Products",productRoutes)
app.use("/api/admin",adminProductRoute)
app.use("/api/Cart",cartRoute)
app.use("/api/order",orderRoute)

app.listen(PORT,()=>{
    console.log("The server is running on the port ",PORT)
    connectdb();
})