import Icon from "@/components/Icon";
import React from "react";

interface PrePromptItem {
    prompt: string;
    iconName: string;
    label: string;
}

interface ChatHeaderProps {
    title: string;
    subtitle: string;
    image: string;
    handlePrePromptClick: (prompt: string) => void;
    prePrompts?: PrePromptItem[];
    width?: number | string;
    height?: number | string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    title,
    subtitle,
    image,
    handlePrePromptClick,
    prePrompts,
    width = 120,  // default width
    height = 80,  // default height
}) => {
    return (
        <header className="flex flex-col items-center space-y-3 mb-2">
            <div className="flex items-center space-x-3">
                <img
                    src={`/demos-page/${image || "neuralseek_logo.png"}`}
                    alt="NeuralSeek Logo"
                    style={{ width, height }}
                />
                <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">{title}</h1>
            </div>
            <p className="text-center text-lg">{subtitle}</p>
            <div className="flex flex-wrap gap-4 w-full max-w-3xl justify-center mb-4">
                {prePrompts?.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center py-1 px-2 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                        onClick={() => handlePrePromptClick(item.prompt)}
                    >
                        <Icon name={item.iconName} className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">{item.label}</p>
                    </div>
                ))}
            </div>
        </header>
    );
};

export default ChatHeader;
