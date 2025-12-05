import React from 'react';
import { Link } from 'react-router-dom';
import { imageProvider } from '@/imageProvider/ImageProvider'

const Footer = () => {
  return (
    <div className='bg-[#03A9F4] text-white py-12 px-4 sm:px-8'>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-4xl flex items-center justify-center mx-auto mb-4">
            <img src={imageProvider.logo} className=' rounded-xl ' alt="" />
          </div>
          <h3 className="text-2xl font-bold mb-4">We'd love to hear from you!</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Want to feature your course, post an internship, adverts or make general enquiries? Get in touch with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>+2348135479257</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <span>admin@jobdockets.com </span>
            </div> 
          </div>
          <p className="text-blue-100 text-sm mt-4">We typically respond within 24-48 hours.</p>
        </div>
        
        <div className="border-t border-blue-300 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex gap-6 text-sm">
            <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link>
            <Link to="/terms" className="hover:text-blue-200 transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-blue-200 transition-colors">Privacy Policy</Link>
          </div>
          <div className="text-sm text-blue-100 py-3 ">
            ©2025 Let's Work Together. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;