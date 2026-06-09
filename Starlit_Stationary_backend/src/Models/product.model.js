import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            unique:true,
            required:true
        },
        description:{
            type:String,
        },
        price:{
            type:Number,
            required:true,
            min:[0.01,"price must be greater than zero"],
            max:[100000,"Price exceeds max limit"]
        },
        stock:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            default:""
        },
        category:{
            type:String,
            required:true
        },
        featured:{
            type:String,
            enum:["Yes","No"],
            default:"No"
        }
    },
    {timestamps:true}
)

const Product = mongoose.model("Product",productSchema)
export default Product