import React from "react";

const Footer = ({ type = "desktop" }: { type?: "desktop" | "mobile" }) => {
  return (
    <footer className="w-full p-4 flex items-center space-x-3">
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-white text-lg font-bold">
        N
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-bold text-gray-700">NeuralSeek</p>
        <h1 className="text-sm truncate font-normal text-gray-600 w-48">
          contact@neuralseek.com
        </h1>
      </div>
    </footer>
  );
};

export default Footer;