"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { MoonIcon, SunIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Icon from "@/components/Icon";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "light";
        setTheme(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }, []);

    const toggleTheme = () => {
        if (!theme) return;
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (theme === null) {
        return <div className="w-screen h-screen bg-white dark:bg-gray-900 transition-colors"></div>;
    }

    return (
        <main className="flex h-screen w-full font-inter bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 overflow-hidden">
            {sidebarOpen && (
                <div className="h-screen sticky top-0 left-0 z-10">
                    <Sidebar />
                </div>
            )}
            
            {/* Main content area */}
            <div className="flex flex-col flex-grow min-h-0 w-full">
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 shadow-md">
                    <button
                        onClick={toggleSidebar}
                        className="p-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {sidebarOpen ? (
                            <Icon
                                name="arrow-left"
                                className="size-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-hover:text-gray-900 dark:group-hover:text-white group-hover:-translate-x-1"
                            />
                        ) : (
                            <Bars3Icon className="size-5 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {theme === "dark" ? (
                            <SunIcon className="size-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                            <MoonIcon className="size-5 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>
                </div>
                
                <div className="flex-grow w-full overflow-auto">
                    {children}
                </div>
            </div>
        </main>
    );
}