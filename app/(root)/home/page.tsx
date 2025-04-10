"use client";
import { demoLinkCards } from "@/lib/demoLinks";
import React from "react";
import Link from "next/link";
import HeaderBox from "@/components/HeaderBox";
import Icon from "@/components/Icon";


const Home = () => {
  return (
    <section className="flex flex-col h-full w-full p-6 dark:bg-gray-900 dark:text-gray-100">
      <header className="mb-5">
        <HeaderBox 
          type="greeting" 
          title="NeuralSeek Demos" 
          subtext="Explore use cases using AI-powered demos." 
        />
      </header>
      
      <div className="relative flex-1 overflow-hidden pr-4">
        <div className="overflow-y-auto h-full pr-4 mr-[-10px]">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {demoLinkCards.map((agent, index) => (
              <div 
                key={index} 
                className="group relative m-5"
              >
                <Link 
                  href={agent.route} 
                  className="block"
                >
                  <div className="flex flex-col w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    {/* Icon Section */}
                    <div className="flex justify-center items-center p-6 bg-blue-50 dark:bg-blue-900/20">
                      <Icon 
                        name={agent.icon} 
                        className="w-16 h-16 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110" 
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-5 text-center flex flex-col flex-grow">
                      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                        {agent.label}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        {agent.description}
                      </p>
                      
                      {/* Demos Count */}
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
                        {agent.demoCount} Demos Available
                      </div>

                      {/* Call to Action */}
                      <div className="mt-auto">
                        <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors hover:bg-blue-700">
                          Explore Demo
                        </span>
                      </div>
                    </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
