"use client";

import React, { useState, useEffect } from 'react';
import { Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { SIDEBAR_CONFIGS } from '@/constants';
import { DemoConfig } from '@/types/demo.config';
import Icon from './Icon';

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
    <aside className="w-96 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full p-4 shadow-lg shadow-gray-300/50 dark:shadow-none overflow-y-auto">
      <div className="flex items-center py-3">
        <img src="/demos-page/neuralseek_logo.png" alt="Demo Logo" className="h-10 w-10" />
      </div>

      <div className="space-y-4">
        <div className="p-2">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Description</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{sidebarConfig.description}</p>
        </div>

        <div className="p-2">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">How to use?</h3>
          <ul className="list-disc pl-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {sidebarConfig.howto?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Industries</h3>
        <div className="flex flex-wrap gap-1.5">
          {sidebarConfig.industries.map((industry, index) => (
            <div key={index} className="px-2 py-0.5 border border-gray-400 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
              {industry}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Use Cases</h3>
        <div className="flex flex-wrap gap-1.5">
          {sidebarConfig.use_cases.map((useCase, index) => (
            <div key={index} className="px-2 py-0.5 border border-gray-400 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
              {useCase}
            </div>
          ))}
        </div>
      </div>

      {sidebarConfig.sample_files && sidebarConfig.sample_files.length > 0 && (
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-2 mt-2">
            {sidebarConfig.sample_files.map((file, index) => (
              <a
                key={index}
                href={file.path}
                download
                className="inline-flex items-center py-2 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer w-fit"
              >
                <Icon
                  name="document-text"
                  className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2 shrink-0"
                />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {file.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

    </aside>

  );
};

export default LeftSidebar;