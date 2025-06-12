"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import Icon from "@/components/Icon";

export default function DocAnalyzerDemo() {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [partsResponse, setPartsResponse] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<{
    PartSkuCode: string; Modelo: string; Parte: string 
}[]>([]);
  type PartInfo = { name: string; sku: string };
  const [topParts, setTopParts] = useState<PartInfo[]>([]);
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

  const imageUrl = selectedModel
    ? `https://linqcdn.avbportal.com/images/${models.find((m) => m.label === selectedModel)?.image}`
    : null;

  useEffect(() => {
    fetch("/demos-page/parts-data.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });
        setCsvData(parsed.data as any);
      });
  }, []);

  useEffect(() => {
    if (selectedModel && csvData.length > 0) {
      const filtered = csvData.filter((row) => row.Modelo === selectedModel);
      const countMap: Record<string, { count: number; sku: string }> = {};

      filtered.forEach((row) => {
        if (!countMap[row.Parte]) {
          countMap[row.Parte] = { count: 1, sku: row.PartSkuCode };
        } else {
          countMap[row.Parte].count += 1;
        }
      });

      const sorted = Object.entries(countMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 6)
        .map(([name, { sku }]) => ({ name, sku }));

      setTopParts(sorted);
    } else {
      setTopParts([]);
    }
  }, [selectedModel, csvData]);

  const performSearch = async () => {
    if (!selectedModel || !query) return;
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/neuralseek/seek`;
      const formattedQuery = `${selectedModel}: ${query}`;

      const response = await axios.post(url, {
        url_name: "partsPicker",
        question: formattedQuery,
      });

      let parsedAnswer;
      try {
        parsedAnswer = JSON.parse(response.data.answer);
      } catch (e) {
        parsedAnswer = response.data.answer
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((s: any) => s.trim().replace(/^"|"$/g, ""));
      }

      setPartsResponse(parsedAnswer);
    } catch (error) {
      console.error("Error:", error);
      setPartsResponse(["No response"]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="w-4/5 mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Parts Assistant</h1>

        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* Left Column: Select + Textarea */}
          <div className="space-y-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold">Select a model</h2>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="" disabled>Select model</option>
                {models.map((model) => (
                  <option key={model.label} value={model.label}>{model.label}</option>
                ))}
              </select>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold">Describe the issue</h2>
              <textarea
                placeholder="Example: The freezer won't turn on..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={performSearch}
                disabled={isLoading || !selectedModel || !query}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : "Find Replacement Parts"}
              </button>
            </div>
          </div>

          {/* Right Column: Model Image */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={selectedModel}
                className="w-auto h-[350px] object-contain border rounded shadow-md m-6"
              />
            ) : (
              <p className="italic text-gray-500">Model image will appear here</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Suggested Parts */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Suggested Parts:</h2>
            {partsResponse.length > 0 ? (
              <ul className="list-disc ml-6 space-y-1">
                {partsResponse.map((part, index) => (
                  <li key={index}>{part}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500">No suggestions yet.</p>
            )}
          </div>

          {/* Top Replaced Parts */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Top 6 Most Replaced Parts:</h2>
            {topParts.length > 0 ? (
              <ol className="list-decimal ml-6 space-y-1">
                {topParts.map((part, index) => (
                  <li key={index}>
                    <span className="font-medium">{part.name}</span> – <span className="text-sm text-gray-500">{part.sku}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="italic text-gray-500">Select a model to see stats.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
