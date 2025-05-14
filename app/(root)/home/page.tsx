"use client";
import { classicDemoLinkCards, demoLinkCards } from "@/lib/demoLinks";
import React, { useState } from "react";
import Link from "next/link";
import HeaderBox from "@/components/HeaderBox";
import Icon from "@/components/Icon";

const Home = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showClassicOnly, setShowClassicOnly] = useState(false);

  // Combined demos for category extraction
  const allDemos = [...demoLinkCards, ...classicDemoLinkCards];

  // Extract unique categories (assuming demos have a category property)
  // If your demos don't have categories yet, you'll need to add them to your demoLinks data
  const categories = ["all", ...new Set(allDemos.map(demo => demo.category || "uncategorized"))];

  // Filter demos based on current filters
  const filteredRegularDemos = demoLinkCards.filter(demo => {
    const matchesSearch =
      demo.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      demo.category === selectedCategory;

    return matchesSearch && matchesCategory && !showClassicOnly;
  });

  const filteredClassicDemos = classicDemoLinkCards.filter(demo => {
    const matchesSearch =
      demo.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      demo.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset filters function
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setShowClassicOnly(false);
  };

  return (
    <section className="flex flex-col h-full w-full p-6 dark:bg-gray-900 dark:text-gray-100">
      <header className="mb-5">
        <HeaderBox
          type="greeting"
          title="NeuralSeek Demos"
          subtext="Explore use cases using AI-powered demos."
        />
      </header>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search demos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="min-w-40">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Classic Demo Toggle */}
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showClassicOnly}
                onChange={() => setShowClassicOnly(!showClassicOnly)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Classic demos only</span>
            </label>
          </div>

          {/* Reset Button */}
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>

        {/* Filter Stats */}
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredRegularDemos.length + filteredClassicDemos.length} demos
          {searchTerm && <span> matching "{searchTerm}"</span>}
          {selectedCategory !== "all" && <span> in {selectedCategory}</span>}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden pr-4">
        <div className="overflow-y-auto h-full pr-4 mr-[-10px]">
          {/* Regular Demos Section */}
          {!showClassicOnly && filteredRegularDemos.length > 0 && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredRegularDemos.map((agent, index) => (
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
          )}

          {/* Divider only if both sections are shown */}
          {!showClassicOnly && filteredRegularDemos.length > 0 && filteredClassicDemos.length > 0 && (
            <div className="mx-8 my-8 border-t border-gray-300 dark:border-gray-700"></div>
          )}

          {/* Classic Demos Section */}
          {filteredClassicDemos.length > 0 && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredClassicDemos.map((agent, index) => (
                <div
                  key={index}
                  className="group relative m-5"
                >
                  <Link
                    href={agent.route}
                    target="_blank"
                    className="block"
                  >
                    <div className="flex flex-col w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                      {/* Classic Demo Tag */}
                      <div className="absolute top-2 right-2">
                        <span className="inline-block px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-md">
                          Classic Demo
                        </span>
                      </div>

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
          )}

          {/* No Results Message */}
          {filteredRegularDemos.length === 0 && filteredClassicDemos.length === 0 && (
            <div className="p-8 text-center">
              <div className="mb-4 text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No demos found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Try changing your search criteria or reset filters</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;