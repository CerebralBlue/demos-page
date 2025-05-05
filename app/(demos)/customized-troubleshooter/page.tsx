"use client";

import React, { useState } from "react";
import Icon from "@/components/Icon";
import ChatHeader from "../../components/ChatHeader";
import axios from "axios";
import SeekModal from "../../components/SeekModal";
export default function DocAnalyzerDemo() {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chatHistory, setChatHistory] = useState<
  { sender: string; message: string; document?: string; modalData?: { directAnswer: string; passages: any[] } }[]
>([]);
  const [isLoading, setLoading] = useState(false);

  const models = [
    { label: "BI36UORH", image: "cea9b0c0-d682-4025-92a8-b1a19fd90942.jpg" },
    { label: "BI42UFDO", image: "6ce1b325-93ff-41eb-bcd5-d92d241f53c6.png" },
    { label: "BI48SO", image: "13e5f339-25b6-4be2-ae04-4db3267ecbd4.png" },
    { label: "SHS863WD5N", image: "a0b6c171-0d5f-4149-8be7-87fad0c35e85.png" },
    { label: "GFW850SPNRS", image: "e20e06dc-0950-455b-8e5f-b5ab86fccf8a.jpg" },
    { label: "GFW650SSNWW", image: "78bee15a-7ed5-42be-b995-4bbff69268f3.jpg" },
    { label: "GFW850SSNWW", image: "c2994215-d11d-4b78-871f-558f0a3bb503.jpg" },
    { label: "SHP865ZP5N", image: "3d7b5f55-b31c-4ecd-8510-3a95d3888f19.jpg" },
    { label: "SHP878ZP5N", image: "fc82a6bb-e9c7-4327-b26e-ab327cc63692.jpg" },
  ];

  const selectedModelObj = models.find((m) => m.label === selectedModel);
  const imageUrl = selectedModelObj ? `https://linqcdn.avbportal.com/images/${selectedModelObj.image}` : null;
  const [modelSearch, setModelSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalData, setModalData] = useState<{ directAnswer: string; passages: any[] }>({
          directAnswer: "",
          passages: []
      });
  // Filtrado
  const filteredModels = models.filter((model) =>
    model.label.toLowerCase().includes(modelSearch.toLowerCase())
  );
  function convertTextToList(text: any) {
    const lines = text
        .split("\n")
        .map((line: any) => line.trim())
        .filter((line: any) => line !== "");
    let htmlContent = "";
    let ulLevel = 0;

    lines.forEach((line: any) => {
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

  const performSearch = async () => {
    if (!selectedModel || !query) return;
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const urlMaistro = `${baseUrl}/neuralseek/seek`;

      const formattedQuery = `\"${selectedModel}\": ${query}`;

      const maistroCallBody = {
        url_name: "customized-troubleshooter",
        question: formattedQuery,
      };

      const response = await axios.post(urlMaistro, maistroCallBody, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.data;
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", message: formattedQuery },
        {
          sender: "bot",
          message: data.answer || "No response",
          document: data.document,
          modalData: {
            directAnswer: convertTextToList(data.ufa),
            passages: data.passages.map((el: any) => ({
              ...el,
              url: "https://linqcdn.avbportal.com/documents/" + el.url,
            })),
          },
        },
      ]);
      setModalData({ directAnswer: convertTextToList(data.ufa), passages: data.passages });
      console.log(data)
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
    setQuery("");
  };

  return (
    <section className="h-[100%] w-2/3 m-auto flex flex-col dark:bg-gray-900 dark:text-white">
      {/* Chat e Imagen */}
      <div className="flex flex-1">
        {/* Imagen del modelo */}
        <div className="w-1/3 flex items-center justify-center p-4 border-r dark:border-gray-700">
          {imageUrl ? (
            <img src={imageUrl} alt={selectedModel} className="max-w-[90%] object-contain rounded shadow" />
          ) : (
            <p className="text-gray-400">Select a model to view its image</p>
          )}
        </div>

        {/* Chat */}
        <div className="w-2/3 flex flex-col overflow-y-auto p-4">
          {chatHistory.length === 0 ? (
            <ChatHeader
              title="NeuralSeek Chat"
              subtitle="Troubleshoot appliance issues"
              image=""
              handlePrePromptClick={() => {}}
            />
          ) : (
            <div className="space-y-4">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg w-fit max-w-[80%] ${
                    msg.sender === "user"
                      ? "p-3 me-0 ms-auto bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  <p>{msg.message}</p>
                  {msg.document && (
                    <div
                    className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => {
                      setModalData({
                        directAnswer: msg.modalData?.directAnswer || "",
                        passages: msg.modalData?.passages || [],
                      });
                      setIsModalOpen(true);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 012 0v4a1 1 0 11-2 0v-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>See the Seek and Knowledge base analysis.</span>
                </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inputs abajo */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex gap-2 items-center w-full">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="p-3 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg w-1/3 text-sm"
          >
            <option value="" disabled>
              Select Model
            </option>
            {models.map((model) => (
              <option key={model.label} value={model.label}>
                {model.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Describe the issue"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-3 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          />

          <button
            onClick={performSearch}
            disabled={isLoading || !selectedModel || !query}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <Icon name="loader" className="w-5 h-5 animate-spin" />
            ) : (
              <Icon name="paper-plane" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <SeekModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                directAnswer={modalData.directAnswer}
                passages={modalData.passages}
            />
    </section>
    
  );
}
