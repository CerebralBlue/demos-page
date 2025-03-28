"use client";
import React, { useState } from 'react';
import Icon from "@/components/Icon";

const SearchEngineDemo: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>({ passages: [], ufa: "" });
  const apiKey = "9320844f-01af58ad-8e5b20da-c078403b";
  const endpoint = "https://stagingapi.neuralseek.com/v1/neuralseek-search-engine-demo/seek";

  async function performSearch() {
    setIsLoading(true);
    try {
      const data = await getAnswerFromAPI(query);
      setResults(data);
    } catch (error) {
      console.error("Error fetching data from NeuralSeek API:", error);
      setResults({ passages: [], ufa: "Sorry, an error occurred while fetching the answer." });
    } finally {
      setIsLoading(false);
    }
  }

  function formatDirectAnswer(text: string) {
    if (!text) return null;
    
    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");
    
    return (
      <div className="whitespace-pre-line">
        {lines.map((line, index) => {
          if (line.startsWith("-")) {
            return <li key={index} className="ml-6 list-disc">{line.substring(1).trim()}</li>;
          } else {
            return <p key={index} className="mb-2">{line}</p>;
          }
        })}
      </div>
    );
  }

  const getAnswerFromAPI = async (query: string) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        question: query,
        options: {
          minConfidenceURL: -1,
          includeSourceResults: true,
          includeHighlights: true,
          sourceResultsNumber: 10,
          sourceResultsSummaryLength: 1000,
        },
      })
    });
    return response.json();
  };

  const handlePrePromptClick = (message: string) => {
    setQuery(message);
    setTimeout(() => {
      performSearch();
    }, 100);
  };

  return (
    <div className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center justify-center h-full">
        <header className="flex flex-col items-center space-y-3 mb-8">
          <div className="flex items-center space-x-3">
            <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
            <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">Search Engine</h1>
          </div>
          <p className="text-center text-lg">What would you like to ask Seek?</p>
          <div className="flex flex-wrap gap-4 w-full max-w-3xl justify-center mb-4">
            <div
              className="flex items-center py-1 px-2 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
              onClick={() => handlePrePromptClick("What is the Seek tab used for in NeuralSeek UI?")}
            >
              <Icon name="document-chart-bar" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">What is the Seek tab used for in NeuralSeek UI?</p>
            </div>
          </div>
        </header>
      </div>
      
      <div className="relative w-full max-w-3xl m-auto">
        <textarea
          id="query"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (query.trim().length > 0 && !isLoading) {
                performSearch();
              }
            }
          }}
          className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16 h-14"
          placeholder="Message NeuralSeek"
        />
        <div className="flex gap-2 m-auto me-0 mb-2">
          <button
            onClick={performSearch}
            disabled={isLoading || (query.trim().length === 0)}
            className={`p-2 rounded-lg transition absolute bottom-6 right-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : query.trim().length > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-not-allowed'
            }`}
            title={isLoading ? "Processing..." : query.trim().length === 0 ? "Enter a message or upload files" : "Send"}
          >
            {isLoading ? (
              <Icon name="loader" className="w-5 h-5 animate-spin" />
            ) : (
              <Icon name="paper-plane" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Results Container */}
      <div className="flex items-center justify-center w-full max-w-3xl m-auto mt-4">
        <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {/* Direct Answer Section */}
          {results.ufa && (
            <div className="font-bold mb-4">
              {formatDirectAnswer(results.ufa)}
            </div>
          )}

          {/* Results List */}
          <ul className="max-h-96 overflow-y-auto">
            {results.passages && results.passages.map((passage: any, index: number) => (
              <li key={index} className="mb-4 p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="m-0">
                    <a href={passage.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:underline">
                      {passage.document}
                    </a>
                  </h3>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {passage.score}%
                  </span>
                </div>
                <a href={passage.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 text-sm hover:underline">
                  {passage.url}
                </a>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {passage.highlights ? (
                    <span dangerouslySetInnerHTML={{ 
                      __html: passage.highlights.replace(
                        /<highlight>(.*?)<\/highlight>/g, 
                        '<span class="text-white bg-blue-600 bg-opacity-80 px-1 py-0 m-0 rounded-lg">$1</span>'
                      ) 
                    }} />
                  ) : passage.passage}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchEngineDemo;