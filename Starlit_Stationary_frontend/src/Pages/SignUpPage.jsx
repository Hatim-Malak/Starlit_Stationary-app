import React from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Store, ShieldCheck, User } from 'lucide-react';
import {useAuth} from '../store/useAuthStore'
import {toast} from "react-hot-toast"
import { useState } from 'react'
import PageTransition from "../Components/PageTransition.jsx";
import Navbar from "../Components/Navbar.jsx";

const SignUpPage = () => {
  const [showpassword, setshowpassword] = useState(false)
  const signUp = useAuth(state => state.signUp);
  const isSigningUp = useAuth(state => state.isSigningUp);
  const [formData, setformData] = useState({
    fullName: "",
    email: "",
    password: ""
  })
  
  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full name is required")
    if(!formData.email.trim()) return toast.error("Email is required")
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format")
    if(!formData.password.trim()) return toast.error("Password is required")
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters")
    return true;
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const success = validateForm()
    if(success === true) signUp(formData)
  }

  return (
    <PageTransition>
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <Navbar/>
        
        <div className="flex-1 flex flex-col lg:flex-row-reverse w-full">
          {/* Right Side - Welcome Section */}
          <div className='relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 lg:w-2/5 w-full lg:min-h-screen min-h-[400px] flex flex-col gap-6 justify-center items-center px-8 py-12 lg:py-0 overflow-hidden'>
            {/* Decorative Elements */}
            <div className='absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
            <div className='absolute bottom-20 left-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl'></div>
            
            {/* Content */}
            <div className='relative z-10 flex flex-col gap-6 items-center text-center max-w-md'>
              {/* Icon */}
              <div className='p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20'>
                <Store className='text-white' size={48} />
              </div>
              
              {/* Text */}
              <div className='space-y-3'>
                <h1 className='text-white font-bold text-4xl lg:text-5xl leading-tight'>
                  Welcome to Starlit!
                </h1>
                <p className='text-blue-100 text-lg lg:text-xl leading-relaxed'>
                  Already have an account? Sign in to continue shopping.
                </p>
              </div>
              
              {/* Sign In Button */}
              <Link 
                to='/signin' 
                className='group mt-4 flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300'
              >
                <span>Sign In</span>
                <ArrowRight className='group-hover:translate-x-1 transition-transform' size={20} />
              </Link>

              {/* Trust Indicators */}
              <div className='mt-8 flex items-center gap-2 text-blue-100 text-sm'>
                <ShieldCheck size={20} />
                <span>Secure & encrypted connection</span>
              </div>
            </div>
          </div>

          {/* Left Side - Sign Up Form */}
          <div className='lg:w-3/5 w-full flex flex-col gap-8 justify-center items-center px-6 py-12 lg:py-0'>
            <div className='w-full max-w-md space-y-8'>
              {/* Header */}
              <div className='text-center lg:text-left space-y-2'>
                <h1 className='font-bold text-4xl text-gray-800'>Create Account</h1>
                <p className='text-gray-500 text-lg'>Join us today and start shopping!</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Full Name Field */}
                <div className='space-y-2'>
                  <label htmlFor="fullName" className='block font-semibold text-gray-700 text-sm ml-1'>
                    Full Name
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <User className='text-gray-400' size={20} />
                    </div>
                    <input 
                      id="fullName"
                      type="text" 
                      value={formData.fullName} 
                      onChange={(e)=>setformData({...formData, fullName: e.target.value})} 
                      placeholder='Enter your full name'
                      className='w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all'
                    />
                  </div>
                </div>

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
                      onChange={(e)=>setformData({...formData, email: e.target.value})} 
                      placeholder='Enter your email'
                      className='w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all'
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
                      onChange={(e)=>setformData({...formData, password: e.target.value})} 
                      placeholder='Create a password (min. 6 characters)'
                      className='w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all'
                    />
                    <button 
                      type='button' 
                      onClick={() => setshowpassword(prev => !prev)}
                      className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors'
                    >
                      {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className='text-xs text-gray-500 ml-1'>Must be at least 6 characters long</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center gap-3"
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* Terms */}
                <p className='text-xs text-gray-500 text-center'>
                  By signing up, you agree to our{' '}
                  <span className='text-blue-600 hover:underline cursor-pointer'>Terms of Service</span>
                  {' '}and{' '}
                  <span className='text-blue-600 hover:underline cursor-pointer'>Privacy Policy</span>
                </p>
              </form>

              {/* Footer Link */}
              <div className='text-center pt-4'>
                <p className='text-gray-600'>
                  Already have an account?{' '}
                  <Link to='/signin' className='text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors'>
                    Sign in here
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

export default SignUpPage
