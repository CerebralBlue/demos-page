"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Icon from "@/components/Icon";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

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

    const autoPlay = () => {
        // setSidebarOpen(!sidebarOpen);
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
                        <Icon
                            name="bars-3"
                            className="size-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-hover:text-gray-900 dark:group-hover:text-white group-hover:-translate-x-1"
                        />
                    )}
                </button>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {theme === "dark" ? (
                            <Icon name="sun" className="size-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                            <Icon name="moon" className="size-5 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                onClick={autoPlay}
                                className="p-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                <Icon name="play" className="size-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="bottom"
                            align="end"
                            className="w-64 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg"
                        >
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">Auto Play</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Automatically play through content sequentially.
                                    Adjust speed and behavior in settings.
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Current Speed: Normal
                                    </span>
                                    <button
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                        onClick={() => {/* Open settings modal */ }}
                                    >
                                        Customize
                                    </button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex-grow w-full overflow-auto">
                {children}
            </div>
        </div>
    </main>
    );
}