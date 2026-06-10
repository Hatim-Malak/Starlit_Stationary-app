import React from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Store, ShieldCheck } from 'lucide-react';
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
    if(!formData.email.trim()) return toast.error("📧 Please enter your email address")
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("📧 Please enter a valid email address")
    if(!formData.password.trim()) return toast.error("🔒 Please enter your password")
    if(formData.password.length<6) return toast.error("🔒 Password must be at least 6 characters long")
    return true;
  }
  
  const handleSubmit=(e)=>{
    e.preventDefault()
    const success = validateForm()
    if(success===true) signIn(formData)
  }

  return (
    <PageTransition>
      <div className='flex flex-col min-h-screen bg-warm'>
        <Navbar/>
        
        <div className="flex-1 flex flex-col lg:flex-row w-full">
          {/* Left Side - Welcome Section */}
          <div className='relative bg-gradient-to-br from-primary via-secondary to-primary lg:w-2/5 w-full lg:min-h-screen min-h-[400px] flex flex-col gap-6 justify-center items-center px-8 py-12 lg:py-0 overflow-hidden'>
            {/* Decorative Elements */}
            <div className='absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
            <div className='absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl'></div>
            
            {/* Content */}
            <div className='relative z-10 flex flex-col gap-6 items-center text-center max-w-md'>
              {/* Icon */}
              <div className='p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20'>
                <Store className='text-white' size={48} />
              </div>
              
              {/* Text */}
              <div className='space-y-3'>
                <h1 className='text-white font-bold text-4xl lg:text-5xl leading-tight'>
                  Hello, Welcome Back!
                </h1>
                <p className='text-accent text-lg lg:text-xl leading-relaxed'>
                  Don't have an account yet? Join our community today.
                </p>
              </div>
              
              {/* Sign Up Button */}
              <Link 
                to='/signup' 
                className='group mt-4 flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300'
              >
                <span>Sign Up</span>
                <ArrowRight className='group-hover:translate-x-1 transition-transform' size={20} />
              </Link>

              {/* Trust Indicators */}
              <div className='mt-8 flex items-center gap-2 text-accent text-sm'>
                <ShieldCheck size={20} />
                <span>Secure & encrypted connection</span>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className='lg:w-3/5 w-full flex flex-col gap-8 justify-center items-center px-6 py-12 lg:py-0'>
            <div className='w-full max-w-md space-y-8'>
              {/* Header */}
              <div className='text-center lg:text-left space-y-2'>
                <h1 className='font-bold text-4xl text-gray-800'>Sign In</h1>
                <p className='text-gray-500 text-lg'>Welcome back! Please enter your details.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Email Field */}
                <div className='space-y-2'>
                  <label htmlFor="email" className='block font-semibold text-gray-700 text-sm ml-1'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <Mail className='text-gray-400' size={20} />
                    </div>
                    <input 
                      id="email"
                      type="text" 
                      value={formData.email} 
                      onChange={(e)=>setformData({...formData,email:e.target.value})} 
                      placeholder='Enter your email'
                      className='w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all'
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <label htmlFor="password" className='block font-semibold text-gray-700 text-sm ml-1'>
                    Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <Lock className='text-gray-400' size={20} />
                    </div>
                    <input 
                      id="password"
                      type={showpassword ? "text" : "password"}  
                      value={formData.password} 
                      onChange={(e)=>setformData({...formData,password:e.target.value})} 
                      placeholder='Enter your password'
                      className='w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all'
                    />
                    <button 
                      type='button' 
                      onClick={() => setshowpassword(prev => !prev)}
                      className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors'
                    >
                      {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center gap-3"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Link */}
              <div className='text-center pt-4'>
                <p className='text-gray-600'>
                  New to Starlit Stationary?{' '}
                  <Link to='/signup' className='text-primary font-semibold hover:text-primary hover:underline transition-colors'>
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default SignInPage
