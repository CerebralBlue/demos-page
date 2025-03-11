"use client";

import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black p-2 shadow-lg fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/neuralseek_logo.png" alt="NS Automation Logo" className="h-8 w-8" />
          <a href="/" className="text-xl font-bold text-[#6A67CE]">
            Web Agentic Automation
          </a>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="text-black block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Links and CTA Button - Hidden on mobile, shown on larger screens */}
        <div className="hidden md:flex space-x-6 items-center">
          <ul className="flex space-x-6">
            <li>
              <a href="/about" className="hover:text-gray-600">
                About
              </a>
            </li>
          </ul>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="bg-gray-800 text-white px-4 py-2 rounded transition-all transform hover:bg-purple-600 hover:scale-105 hover:shadow-lg"
          >
            Login
          </button>

        </div>
      </div>

      {/* Mobile Menu - Shown when isOpen is true */}
      <div
        className={`md:hidden transition-transform transform ${isOpen ? 'translate-y-0' : '-translate-y-full'
          } bg-white w-full fixed top-16 left-0 z-10`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li>
            <a
              href="#contact-form"
              className="hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </a>
          </li>
          <li>
            <button
              onClick={() => window.location.href = '/sign-up'}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Únete al Programa
            </button>
          </li>
        </ul>
      </div>
    </nav>

  );
};

export default Navbar;
