"use client";
import React, { DragEvent, useRef, useState } from 'react';
import Icon from "@/components/Icon";

const AgentSearchEngine: React.FC = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user", isFile?: boolean, fileName?: string }[]>([]);
    const apiKey = "9320844f-01af58ad-8e5b20da-c078403b";
    const endpoint =
        "https://stagingapi.neuralseek.com/v1/neuralseek-search-engine-demo/seek";
    async function performSearch() {
        setIsLoading(true);
        const directAnswerContainer = document.getElementById("directAnswer");
        const resultsList = document.getElementById("resultsList");

        directAnswerContainer!.innerHTML = "";
        resultsList!.innerHTML = "";


        try {
            const data = await getAnswerFromAPI(query);
            if (data.ufa) {
                directAnswerContainer!.innerHTML = convertTextToList(data.ufa);
            }
            const styles = `
               

      .highlighted-text {
        color: #FBFDFE;
        background-color: #0d66b4d1;
        padding: 2px;
        padding-top: 0px;
        margin: 0px;
        border-radius: 8px;
        -webkit-box-decoration-break: clone;
        -o-box-decoration-break: clone;
        box-decoration-break: clone;
      }

  
      .search-container {
        text-align: center;
        margin-bottom: 20px;
      }

      #searchInput {
        width: 80%;
        padding: 10px;
        font-size: 16px;
      }

      button {
        padding: 10px;
        font-size: 16px;
        cursor: pointer;
      }

      #resultsContainer {
        margin-top: 20px;
      }

      #directAnswer {
        font-weight: bold;
        margin-bottom: 20px;
        white-space: pre-line;
      }

      #resultsList {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }

      .result-item {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
      }

      .result-header h3 {
        margin: 0;
      }

      .result-item a {
        text-decoration: none;
        color: #1a0dab;
      }

      .result-item p {
        margin: 5px 0 0;
        color: #4d5156;
      }

      .score {
        background-color: #4caf50;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: bold;
      }

      .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: #4caf50;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      #spinnerContainer {
        display: none;
        text-align: center;
        margin-top: 20px;
      }
            `;

            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
              if (data.passages) {
                data.passages.forEach((passage:any) => {
                  const resultItem = document.createElement("li");
                  resultItem.className = "result-item";
                  resultItem.innerHTML = `
                            <div class="result-header">
                                <h3><a href="${passage.url}" target="_blank">${passage.document}</a></h3>
                                <span class="score">${passage.score}%</span>
                            </div>
                            <a href="${passage.url}" target="_blank">${passage.url}</a>
                            <p>${passage.passage}</p>
                        `;
                  resultsList!.appendChild(resultItem);
                });
              }
        } catch (error) {
            console.error("Error fetching data from NeuralSeek API:", error);
            directAnswerContainer!.innerHTML =
                "Sorry, an error occurred while fetching the answer.";
        } finally {
        }
    }
    function convertTextToList(text:any) {
        const lines = text
          .split("\n")
          .map((line:any) => line.trim())
          .filter((line:any) => line !== "");
        let htmlContent = "";
        let ulLevel = 0;
    
        lines.forEach((line:any) => {
          if (line.startsWith("-")) {
            if (ulLevel === 0) {
              htmlContent += "<ul>";
              ulLevel++;
            }
            htmlContent += `<li>${line.substring(1).trim()}</li>`;
          } else {
            if (ulLevel > 0) {
              htmlContent += "</ul>";
              ulLevel = 0;
            }
            htmlContent += `<p>${line}</p>`;
          }
        });
    
        if (ulLevel > 0) {
          htmlContent += "</ul>";
        }
    
        return htmlContent;
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
                  minConfidenceURL: -1  ,
                  includeSourceResults: true,
                  includeHighlights: true,
                  sourceResultsNumber: 10,
                  sourceResultsSummaryLength: 1000,
                },
              })
        });
        setIsLoading(false);
        return response.json();

    };
    return (
        <div className={`w-full grid grid-cols-1 gap-8 max-w-6xl w-full items-center justify-center mt-5 m-auto ${chatHistory.length > 0 ? "mb-4 flex justify-center" : "flex items-center justify-center h-full"}`}>
            <div className="flex items-center space-x-3 w-full justify-center">
                <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
                <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">NeuralSeek Search Engine</h1>
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
                            // handleChat();
                        }
                    }}
                    className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16 h-14"
                    placeholder="Message NeuralSeek"
                />
                <div className="flex gap-2 m-auto me-0 mb-2">

                    <button
                        onClick={() => { performSearch() }}
                        disabled={isLoading || (query.trim().length === 0)}
                        className={`p-2 rounded-lg transition absolute bottom-6 right-2 ${isLoading
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
                <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end p-4 h-100 p-0">
                </div>

            </div>
            <div id="resultsContainer">
                <div id="directAnswer"></div>
                <ul id="resultsList"></ul>
            </div>
            
        </div>
    );
};

export default AgentSearchEngine;