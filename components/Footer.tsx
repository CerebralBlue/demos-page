import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-gradient-to-r from-[#9393D9] to-[#6A67CE] text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold mb-4 md:mb-0">
          NS Web Automation
        </div>

        {/* Links */}
        <ul className="flex space-x-6 mb-4 md:mb-0">
          <li><a href="#hero" className="hover:text-gray-300">Home</a></li>
          <li><a href="#description" className="hover:text-gray-300">Get Started</a></li>
          <li><a href="#contact-form" className="hover:text-gray-300">Contact</a></li>
        </ul>

        {/* <div className="flex space-x-4">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
          </a>
        </div> */}
      </div>

      <div className="text-center mt-6">
        <p>&copy; {new Date().getFullYear()} NS Web Automation | All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
