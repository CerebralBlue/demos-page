"use client";

import React from "react";
import Link from "next/link";
import HeaderBox from "@/components/HeaderBox";

const agents = [
  {
    category: "SEC Reporting Demo",
    label: "SEC Agent",
    route: "/agent-sec",
    icon: "users",
    image: "/demos-page/neuralseek_logo.png",
    creator: "NeuralSeek",
    description: "Handles SEC filings and reports efficiently.",
  },
  {
    category: "Law Demo",
    label: "Depositions Agent",
    route: "/agent-depositions",
    icon: "document-text",
    image: "/demos-page/neuralseek_logo.png",
    creator: "NeuralSeek",
    description: "Manages and analyzes legal depositions.",
  },
  {
    category: "D-ID Demo",
    label: "D-ID Agent",
    route: "/agent-d-id",
    icon: "users",
    image: "/demos-page/neuralseek_logo.png",
    creator: "NeuralSeek",
    description: "AI-powered digital identity assistant.",
  },
  {
    category: "RFP Writer Agent Demo",
    label: "RFP Writer Agent",
    route: "/agent-rfp-writer",
    icon: "users",
    image: "/demos-page/neuralseek_logo.png",
    creator: "NeuralSeek",
    description: "AI-powered RFP writer assistant.",
  },
  {
    category: "Doc Analyzer Agent Demo",
    label: "Doc Analyzer Agent",
    route: "/agent-doc-analyzer",
    icon: "users",
    image: "/demos-page/neuralseek_logo.png",
    creator: "NeuralSeek",
    description: "AI-powered document analyzer assistant.",
  },
  {
    category: "Search Engine Agent Demo",
    label: "Search Engine Agent",
    route: "/agent-doc-analyzer",
    icon: "users",
    image: "/demos-page/neuralseek_logo.png",
    creator: "NeuralSeek",
    description: "AI-powered search engine assistant.",
  }
];

const Home = () => {
  return (
    <section className="flex flex-col h-full w-full p-6 dark:bg-gray-900 dark:text-gray-100">
      <header className="mb-5">
        <HeaderBox type="greeting" title="NeuralSeek Demos" subtext="Explore use cases using AI ready agents." />
      </header>
      <div className="relative flex-1 overflow-hidden max-h-[70vh] pr-4">
        <div className="overflow-y-auto h-full pr-4 mr-[-10px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {agents.map((agent, index) => (
              <Link key={index} href={agent.route} className="group">
                <div className="flex flex-col w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md transition-transform transform hover:scale-105">
                  <img
                    src={agent.image ? agent.image : "/demos-page/neuralseek_logo.png"}
                    alt={agent.label || "Default Image"}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />

                  <div className="p-4 text-left">
                    <h2 className="text-lg font-semibold">{agent.label}</h2>
                    <p className="text-sm text-gray-500">Created by {agent.creator || "Unknown"}</p>
                    <p className="text-sm text-gray-400 mt-2">{agent.description || "No description available."}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


export default Home;

