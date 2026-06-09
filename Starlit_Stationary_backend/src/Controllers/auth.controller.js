import User from "../Models/user.model.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/util.js"
import { cacheResponse, setCache } from "../lib/cache.js"

export const signup = async (req,res) =>{
  const {fullName,email,password} = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if(password.length < 6){
      return res.status(400).json({message:"Password must be greater than 6 characters"})
    }
    const user = await User.findOne({email})
    if(user) return res.status(400).json({message:"email already exits"})

    const salt = await bcrypt.genSalt(10)
    const hashpassword  = await bcrypt.hash(password,salt)

    const newUser = new User({
      email,
      fullName,
      password:hashpassword
    })
    if(newUser){
      await newUser.save()
      generateToken(newUser._id,res)
      const payload = {_id:newUser._id,fullName:newUser.fullName,email:newUser.email}
      await setCache(`user:${newUser._id}`, payload, 60)
      res.status(201).json(payload)
    } else {
      res.status(400).json({message:"Invalid user data"})
    }
  } catch (error) {
    console.log("error in signup controller",error.message)
    res.status(500).json({message:"Internal server error"})
  }
}

export const login = async (req,res) =>{
  const {email,password} = req.body
  try {
    if(password.length<6) return res.status(400).json({message:"The password must be greater than 6 characters"})
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"Invalid credentials"})
    }
    const ispassword = await bcrypt.compare(password,user.password)
    if(!ispassword) return res.status(400).json({message:"Invalid credentials"})

    generateToken(user._id,res)
    const payload = {_id:user._id,email:user.email,fullName:user.fullName}
    await setCache(`user:${user._id}`, payload, 60)
    res.status(200).json(payload)
  } catch (error) {
    console.log("Error in login controller",error.message)
    res.status(500).json({message:"Internal server error"})
  }
}

export const logout = async (req,res) =>{
  try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Loged out Succesfully"})
  } catch (error) {
    console.log("Error in logout controller ",error.message)
    res.status(500).json({message:"Internal server error"})
  }
}

export const check = async (req,res) =>{
  try {
    const key = `user:${req.user._id}`
    const userData = await cacheResponse(key, 30, async () => ({
      _id:req.user._id,
      fullName:req.user.fullName,
      email:req.user.email,
      isAdmin:req.user.isAdmin
    }))
    res.status(200).json(userData)
  } catch (error) {
    console.log("error in checkAuth controller",error.message)
    res.status(500).json({message:"Internal server error"})
  }
}