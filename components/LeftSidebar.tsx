"use client";

import React, { useState, useEffect } from 'react';
import { Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { SIDEBAR_CONFIGS } from '@/constants';
import { DemoConfig } from '@/types/demo.config';

const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const [sidebarConfig, setSidebarConfig] = useState<DemoConfig>({
    description: "",
    howto: [],
    industries: [],
    use_cases: [],
    demo_url: "/",
    details: []
  });

  useEffect(() => {
    // Ensure SIDEBAR_CONFIGS exists and is an array
    if (!SIDEBAR_CONFIGS || !Array.isArray(SIDEBAR_CONFIGS) || SIDEBAR_CONFIGS.length === 0) {
      console.error('SIDEBAR_CONFIGS is not properly defined');
      return;
    }

    // Find the configuration that matches the current pathname
    const matchedConfig = SIDEBAR_CONFIGS.find((config) => {
      // Handle potential undefined pathname
      if (!pathname) return false;

      // Normalize pathname and config.demo_url comparisons
      const normalizedPathname = pathname.replace(/^\//, '');
      const normalizedDemoUrl = config.demo_url.replace(/^\//, '');

      return normalizedPathname.includes(normalizedDemoUrl) ||
        (config.demo_url === "/" && (pathname === "/" || normalizedPathname === ""));
    }) || SIDEBAR_CONFIGS[SIDEBAR_CONFIGS.length - 1];

    setSidebarConfig(matchedConfig);
  }, [pathname]);

  return (
    <aside className="w-80 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full p-6 shadow-lg shadow-gray-300/50 dark:shadow-none overflow-y-auto">
      <div className="flex items-center py-4">
        <img src="/demos-page/neuralseek_logo.png" alt="Demo Logo" className="h-12 w-12" />
      </div>

      <div className="space-y-6">
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{sidebarConfig.description}</p>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">How to use?</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {sidebarConfig.howto?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Industries</h3>
        <div className="flex flex-wrap gap-2">
          {sidebarConfig.industries.map((industry, index) => (
            <div key={index} className="px-3 py-1 border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
              {industry}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Use Cases</h3>
        <div className="flex flex-wrap gap-2">
          {sidebarConfig.use_cases.map((useCase, index) => (
            <div key={index} className="px-3 py-1 border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
              {useCase}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <a
          href="/files/sec-demo.zip"
          download="sample-files.zip"
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Download Sample Files</span>
        </a>
      </div>
    </aside>
  );
};

export default LeftSidebar;