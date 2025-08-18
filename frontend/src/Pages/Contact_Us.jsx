import React from 'react'
import Navbar from "../Components/Navbar.jsx"; // Adjust path if necessary
import { Mail, Phone, Github, Linkedin, Globe, Info } from 'lucide-react';


const Contact_Us = () => {
  return (
    <div className='w-full h-[100vh] bg-gradient-to-br from-blue-800 to-blue-400'>
      <Navbar />
      <div className='w-full flex justify-center items-center p-4 lg:p-4 '>
        <div className='w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 text-center'>
          
          <h2 className='text-3xl font-bold text-blue-800'>Contact Information</h2>
          <p className='mt-2 text-gray-600'>
            Have a question? We're here to help. Reach out to us via email or phone.
          </p>
          <div className='mt-8 inline-flex flex-col sm:flex-row items-center justify-center gap-8'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-100 p-2 rounded-full'>
                <Mail className='w-6 h-6 text-blue-700' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Email Us</h3>
                <a href="mailto:hatim05042006@gmail.com" className='text-gray-600 hover:text-blue-700'>
                  hatim05042006@gmail.com
                </a>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-100 p-2 rounded-full'>
                <Phone className='w-6 h-6 text-blue-700' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Call Us</h3>
                <p className='text-gray-600'>(+91) 930-209-7523</p>
              </div>
            </div>
          </div>

          <hr className='my-8 border-gray-200' />

          <h2 className='text-2xl font-bold text-gray-800'>About the Creator</h2>
          <p className='mt-2 text-gray-600'>
            This stationery e-commerce platform was brought to life by a passionate developer as a personal project to showcase their skills in web development.
          </p>
          <div className='mt-6 flex justify-center gap-6'>
            <a href="https://github.com/Hatim-Malak/" aria-label="GitHub Profile" className='text-gray-500 hover:text-blue-700 transition-colors'>
              <Github size={28} />
            </a>
            <a href="https://www.linkedin.com/in/hatim-malak-8ba254279" aria-label="LinkedIn Profile" className='text-gray-500 hover:text-blue-700 transition-colors'>
              <Linkedin size={28} />
            </a>
          </div>
          <div className='mt-10 p-3 flex items-start text-left gap-3 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg'>
             <Info className='w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5' />
             <p className='text-sm text-yellow-800'>
                  <strong>Project Purpose:</strong> This website is a demonstration project. While fully functional for testing, please be aware that some bugs may exist.
             </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact_Us