import React from 'react'
import Navbar from "../Components/Navbar.jsx";
import { Mail, Phone, Github, Linkedin, Info, MessageCircle, User } from 'lucide-react';

const Contact_Us = () => {
  return (
    <div className='min-h-screen w-full bg-gradient-to-r from-blue-600 to-blue-700 flex flex-col'>
      <Navbar />
      <div className='flex-1 w-full flex justify-center items-center p-4 lg:p-8'>
        <div className='w-full max-w-4xl'>
          {/* Header Section */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center gap-3 mb-4'>
              <div className='p-4 bg-white rounded-2xl shadow-xl'>
                <MessageCircle className='w-10 h-10 text-blue-600' />
              </div>
              <h1 className='text-5xl font-bold text-white'>Get In Touch</h1>
            </div>
            <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
              We'd love to hear from you! Feel free to reach out with any questions or feedback.
            </p>
          </div>

          {/* Main Contact Card */}
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden mb-6'>
            {/* Contact Information Section */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center'>
              <h2 className='text-3xl font-bold text-white mb-3'>Contact Information</h2>
              <p className='text-blue-100 text-lg'>
                Have a question? We're here to help. Reach out to us anytime.
              </p>
            </div>

            <div className='p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                {/* Email Card */}
                <a 
                  href="mailto:hatim05042006@gmail.com"
                  className='group bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg'
                >
                  <div className='flex items-center gap-4'>
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl group-hover:scale-110 transition-transform'>
                      <Mail className='w-7 h-7 text-white' />
                    </div>
                    <div className='text-left'>
                      <h3 className='font-bold text-blue-700 text-lg mb-1'>Email Us</h3>
                      <p className='text-gray-700 group-hover:text-blue-600 transition-colors break-all'>
                        hatim05042006@gmail.com
                      </p>
                    </div>
                  </div>
                </a>

                {/* Phone Card */}
                <div className='bg-blue-50 border-2 border-blue-200 rounded-2xl p-6'>
                  <div className='flex items-center gap-4'>
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl'>
                      <Phone className='w-7 h-7 text-white' />
                    </div>
                    <div className='text-left'>
                      <h3 className='font-bold text-blue-700 text-lg mb-1'>Call Us</h3>
                      <p className='text-gray-700 font-medium'>
                        (+91) 930-209-7523
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className='relative my-8'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t-2 border-blue-200'></div>
                </div>
                <div className='relative flex justify-center'>
                  <span className='bg-white px-4 text-blue-600 font-semibold'>About</span>
                </div>
              </div>

              {/* About Creator Section */}
              <div className='text-center mb-6'>
                <div className='inline-flex items-center justify-center gap-3 mb-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <User className='w-6 h-6 text-blue-700' />
                  </div>
                  <h2 className='text-3xl font-bold text-blue-700'>About the Creator</h2>
                </div>
                <p className='text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed'>
                  This stationery e-commerce platform was brought to life by a passionate developer as a personal project to showcase their skills in web development.
                </p>
              </div>

              {/* Social Links */}
              <div className='flex justify-center gap-4 mb-8'>
                <a 
                  href="https://github.com/Hatim-Malak/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile" 
                  className='group p-4 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg'
                >
                  <Github className='w-8 h-8 text-gray-700 group-hover:text-white transition-colors' />
                </a>
                <a 
                  href="https://www.linkedin.com/in/hatim-malak-8ba254279" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile" 
                  className='group p-4 bg-blue-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg'
                >
                  <Linkedin className='w-8 h-8 text-blue-600 group-hover:text-white transition-colors' />
                </a>
              </div>

              {/* Project Info Banner */}
              <div className='bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-5 shadow-md'>
                <div className='flex items-start gap-3'>
                  <div className='p-2 bg-yellow-100 rounded-lg flex-shrink-0'>
                    <Info className='w-5 h-5 text-yellow-700' />
                  </div>
                  <div className='text-left'>
                    <h4 className='font-bold text-yellow-800 mb-1'>Project Purpose</h4>
                    <p className='text-sm text-yellow-800 leading-relaxed'>
                      This website is a demonstration project. While fully functional for testing, please be aware that some bugs may exist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className='text-center'>
            <p className='text-white/80 text-sm bg-white/10 backdrop-blur-sm rounded-xl py-3 px-6 inline-block border border-white/20'>
              Thank you for visiting! We appreciate your interest in this project.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact_Us
