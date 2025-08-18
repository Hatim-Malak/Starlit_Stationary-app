import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {useAuth} from '../store/useAuthStore'
import {toast} from "react-hot-toast"
import { Loader2 } from 'lucide-react';
import PageTransition from "../Components/PageTransition.jsx";
import Navbar from "../Components/Navbar.jsx";


const SignUpPage = () => {
  const [showpassword, setshowpassword] = useState(false)
  const signUp = useAuth(state => state.signUp);
  const isSigningUp = useAuth(state => state.isSigningUp);
  const [formData,setformData] = useState({
    fullName:"",
    email:"",
    password:""
  })
  const validateForm = () =>{
    if(!formData.fullName.trim()) return toast.error("FullName is required")
    if(!formData.email.trim()) return toast.error("Email is required")
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email Format")
    if(!formData.password.trim()) return toast.error("password is required")
    if(formData.password.length<6) return toast.error("Password must be at least of 6 characters")
    return true;
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    const success = validateForm()
    if(success===true) signUp(formData)
  }
  return (
    <PageTransition>
    <div className='flex flex-col h-screen'>
    <Navbar/>
    <div className='w-full lg:flex-row flex flex-col flex-1 fint'>
      <div className='lg:w-3/5 h-3/5 lg:h-full flex flex-col gap-8 justify-center items-center'>
        <h1 className=' text-4xl font-bold'>Sign up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='relative mb-2'>
            <input type="text" value={formData.fullName} onChange={(e)=>setformData({...formData,fullName:e.target.value})} placeholder='' className='peer border border-gray-400 bg-gray-200 rounded-md h-9 p-4 w-[280px] text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600'/>
            <label htmlFor="name" className='absolute left-3 -top-6 font-medium text-gray-600 text-md transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-md peer-focus:text-blue-600 '>Name</label>
            <img src="/profile.svg" alt="profile" className='absolute size-[30px] top-1 right-2' />
          </div>
          <div className='relative mb-2'>
            <input type="text" value={formData.email} onChange={(e)=>setformData({...formData,email:e.target.value})} placeholder='' className='peer border border-gray-400 bg-gray-200 rounded-md h-9 p-4 w-[280px] text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600'/>
            <label htmlFor="name" className='absolute left-3 -top-6 font-medium text-gray-600 text-md transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-md peer-focus:text-blue-600 '>E-mail</label>
            <img src="/email.svg" alt="profile" className='absolute size-[30px] top-1 right-2' />
          </div>
          <div className='relative'>
            <input type={showpassword?"text":"password"}  value={formData.password} onChange={(e)=>setformData({...formData,password:e.target.value})} placeholder='' className='peer border border-gray-400 bg-gray-200 rounded-md h-9 p-4 w-[280px] text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600'/>
            <label htmlFor="name" className='absolute left-3 -top-6 font-medium text-gray-600 text-md transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-md peer-focus:text-blue-600 '>Password</label>
            <button type='button' className='absolute size-[30px] top-1 right-2' onClick={() => setshowpassword(prev => !prev)}>{!showpassword?<img src="/showpassword.svg" alt="show" />:<img src="/dontshowpassword.svg" alt="unshow" />}</button>
          </div>
          <button
            type="submit"
            disabled={isSigningUp}
            className="bg-gradient-to-br from-blue-800 to-blue-400 p-3 text-white font-bold text-xl rounded-md flex justify-center items-center gap-2"
          >
            {isSigningUp ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Loading...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>

        </form>
      </div>
      <div className='bg-gradient-to-br from-blue-800 to-blue-400 lg:w-2/5 h-2/5 lg:h-full  lg:rounded-l-[160px] lg:rounded-tr-none rounded-t-[160px] flex flex-col gap-4 justify-center items-center'>
        <h1 className='text-white text-5xl font-bold'>Hello,Welcome</h1>
        <p className='text-white text-xl'>Already have an account?</p>
        <Link to='/signin' className=' border-2 text-white border-white text-xl py-3 px-10 rounded-md font-bold'>Sign In</Link>
      </div>
    </div>
    </div>
    </PageTransition>
  )
}

export default SignUpPage 
