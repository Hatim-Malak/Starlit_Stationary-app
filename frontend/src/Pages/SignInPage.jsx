import React from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react';
import {useAuth} from '../store/useAuthStore'
import {toast} from "react-hot-toast"
import { useState } from 'react'
import PageTransition from "../Components/PageTransition.jsx";
import Navbar from "../Components/Navbar.jsx";

const SignInPage = () => {
  const [showpassword, setshowpassword] = useState(false)
  const signIn = useAuth(state => state.signIn);
  const isSigningIn = useAuth(state => state.isSigningIn);
  const [formData,setformData] = useState({
    email:"",
    password:""
  })
  const validateForm = () =>{
    if(!formData.email.trim()) return toast.error("Email is required")
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email Format")
    if(!formData.password.trim()) return toast.error("password is required")
    if(formData.password.length<6) return toast.error("Password must be at least of 6 characters")
    return true;
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    const success = validateForm()
    if(success===true) signIn(formData)
  }

  return (
    <PageTransition>
    <div className='flex flex-col h-screen'>
    <Navbar/>
    <div className="lg:flex-row flex flex-col flex-1 w-full fint">
      <div className='bg-gradient-to-br from-blue-800 to-blue-400 lg:w-2/5 lg:h-full h-2/5 lg:rounded-r-[160px] lg:rounded-bl-none rounded-b-[160px] flex flex-col gap-4 justify-center items-center'>
        <h1 className='text-white text-5xl font-bold'>Hello,Welcome</h1>
        <p className='text-white text-xl'>Don't have an account? Create one.</p>
        <Link to='/signup' className=' border-2 text-white border-white text-xl py-3 px-10 rounded-md font-bold'>Sign Up</Link>
      </div>
      <div className='lg:w-3/5 h-3/5 flex flex-col gap-8 justify-start lg:pt-0 pt-10 items-center lg:justify-center lg:h-full'>
        <h1 className=' text-4xl font-bold'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
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
            disabled={isSigningIn}
            className="bg-gradient-to-br from-blue-800 to-blue-400 p-3 text-white font-bold text-xl rounded-md flex justify-center items-center gap-2"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Loading...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
    </div>
    </PageTransition>
  )
}

export default SignInPage