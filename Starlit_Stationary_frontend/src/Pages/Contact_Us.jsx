import React, { useState } from 'react'
import Navbar from "../Components/Navbar.jsx";
import { Mail, Phone, Github, Linkedin, Info, MessageCircle, Send, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact_Us = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/hatim05042006@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `New Contact Form Submission from ${formData.name}`,
            name: formData.name,
            email: formData.email,
            message: formData.message
        })
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen w-full bg-white flex flex-col font-sans'>
      <Navbar />
      
      {/* Main Content Area - Split Screen Layout */}
      <div className='flex-1 flex flex-col lg:flex-row w-full'>
        
        {/* Left Side - Vertical Blue Container */}
        <div className='w-full lg:w-[40%] xl:w-[35%] bg-gradient-to-b from-secondary to-primary p-8 lg:p-12 xl:p-16 relative flex flex-col justify-center overflow-hidden'>
          {/* Background design */}
          <div className='absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none'></div>
          <div className='absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none'></div>
          
          <div className='relative z-10 text-warm'>
            {/* Get In Touch Header */}
            <div className='mb-12'>
              <div className='inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 mb-6'>
                <MessageCircle className='w-10 h-10 text-warm' />
              </div>
              <h1 className='text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight'>Get In Touch</h1>
              <p className='text-accent-100 text-lg'>
                We're here to help and answer any question you might have.
              </p>
            </div>

            {/* Contact Info */}
            <div className='flex flex-col gap-8'>
              <a href="mailto:hatim05042006@gmail.com" className='group flex items-start gap-5'>
                <div className='p-3 bg-white/10 rounded-xl group-hover:bg-accent/20 transition-colors'>
                  <Mail className='w-6 h-6 text-warm' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg text-white mb-1'>Email Us</h3>
                  <p className='text-warm/80 group-hover:text-warm transition-colors'>hatim05042006@gmail.com</p>
                </div>
              </a>

              <div className='group flex items-start gap-5'>
                <div className='p-3 bg-white/10 rounded-xl group-hover:bg-accent/20 transition-colors'>
                  <Phone className='w-6 h-6 text-warm' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg text-white mb-1'>Call Us</h3>
                  <p className='text-warm/80 group-hover:text-warm transition-colors'>(+91) 930-209-7523</p>
                </div>
              </div>

              <div className='group flex items-start gap-5'>
                <div className='p-3 bg-white/10 rounded-xl group-hover:bg-accent/20 transition-colors'>
                  <MapPin className='w-6 h-6 text-warm' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg text-white mb-1'>Location</h3>
                  <p className='text-warm/80 group-hover:text-warm transition-colors'>Indore, India</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className='mt-12 pt-8 border-t border-white/20'>
              <h3 className='text-lg font-bold text-white mb-4'>Connect With Developer</h3>
              <div className='flex gap-4'>
                <a href="https://github.com/Hatim-Malak/" target="_blank" rel="noopener noreferrer" className='p-3 bg-white/10 hover:bg-white hover:text-primary rounded-xl transition-all duration-300'>
                  <Github className='w-6 h-6' />
                </a>
                <a href="https://www.linkedin.com/in/hatim-malak-8ba254279" target="_blank" rel="noopener noreferrer" className='p-3 bg-white/10 hover:bg-white hover:text-primary rounded-xl transition-all duration-300'>
                  <Linkedin className='w-6 h-6' />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='flex-1 bg-warm-50 p-8 lg:p-12 xl:p-20 flex flex-col justify-center'>
          <div className='max-w-2xl w-full mx-auto'>
            <h2 className='text-3xl font-bold text-primary mb-2'>Send us a Message</h2>
            <p className='text-secondary mb-8'>Fill out the form below and we'll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-primary ml-1'>Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className='w-full px-4 py-3 rounded-xl bg-white border-2 border-accent/30 focus:border-secondary focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary shadow-sm'
                    placeholder="John Doe"
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-primary ml-1'>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className='w-full px-4 py-3 rounded-xl bg-white border-2 border-accent/30 focus:border-secondary focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary shadow-sm'
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-primary ml-1'>Message</label>
                <textarea 
                  required
                  rows="5"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className='w-full px-4 py-3 rounded-xl bg-white border-2 border-accent/30 focus:border-secondary focus:ring-2 focus:ring-accent/20 outline-none transition-all text-primary resize-none shadow-sm'
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className='w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-warm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send className='w-5 h-5' />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Project Info Banner */}
            <div className='mt-12 bg-white border-l-4 border-accent rounded-xl p-6 shadow-md'>
              <div className='flex items-start gap-4'>
                <div className='p-2.5 bg-warm-50 rounded-lg flex-shrink-0'>
                  <Info className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h4 className='font-bold text-primary text-lg mb-1'>Project Purpose</h4>
                  <p className='text-secondary leading-relaxed'>
                    This e-commerce platform is a demonstration project created by an independent developer to showcase modern web development skills. While fully interactive, it is not processing real commercial transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contact_Us
