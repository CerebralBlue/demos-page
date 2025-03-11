import Icon from "@/components/Icon";
import React from "react";

interface ChatHeaderProps {
    handlePrePromptClick: (prompt: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ handlePrePromptClick }) => {
    return (
        <header className="flex flex-col items-center space-y-3 mb-8">
            <div className="flex items-center space-x-3">
                <img src="/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
                <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">SEC AI Reporting Chat</h1>
            </div>
            <p className="text-center text-lg">What reporting task do you want to run today?</p>
            <div className="flex flex-wrap gap-4 w-full max-w-3xl justify-center mb-4">
                <div
                    className="flex items-center py-1 px-2 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => handlePrePromptClick("Ingest a balance or income statement file")}
                >
                    <Icon name="document-chart-bar" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Ingest Periods Data</p>
                </div>
                <div
                    className="flex items-center py-1 px-2 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => handlePrePromptClick("Generate a detailed AI 10K Report file")}
                >
                    <Icon name="char-bar" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Generate AI 10K Report</p>
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;