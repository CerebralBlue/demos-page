import React, { useState } from "react";
import Icon from "@/components/Icon";

interface ChatHistoryBayCrestProps {
    messages: { message: string; type: "agent" | "user"; query?: string; isFile?: boolean; fileName?: string; reportId?: string }[];
    setChatHistory: React.Dispatch<React.SetStateAction<
        {
            message: string;
            type: "agent" | "user";
            query?: string;
            isFile?: boolean;
            fileName?: string
        }[]
    >>;
    chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatHistoryBayCrest: React.FC<ChatHistoryBayCrestProps> = ({ messages, setChatHistory, chatEndRef }) => {
    const baseAppUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

    const [expandedMessages, setExpandedMessages] = useState<Record<number, boolean>>({});

    const toggleExpanded = (index: number) => {
        setExpandedMessages(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <div className="w-full p-4 rounded-lg mb-4 max-h-[700px] bg-transparent">
            {messages.length > 0 && (
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-2 max-w-[75%] ${msg.type === "user"
                                ? "px-8 py-2 rounded-3xl  bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-end ml-auto text-right w-fit max-w-[75%]"
                                : "p-2 rounded-md  text-black dark:text-white self-start mr-auto text-left"
                                }`}
                        >
                            {msg.isFile ? (
                                <></>
                                // <div className={`flex items-center gap-2 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                                //     <Icon name="document" className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                                //     <p className="text-sm font-semibold">{msg.fileName}</p>
                                //     {msg.reportId && (
                                //         <a
                                //             href={`${baseAppUrl}/reports/${msg.reportId}`}
                                //             className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                //         >
                                //             <Icon name="eye" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                                //             <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">View Report</p>
                                //         </a>
                                //     )}
                                // </div>
                            ) : (
                                <div className="relative w-full mb-5">
                                    <p
                                        className={`${msg.type === "user" ? "text-right" : "text-left"} whitespace-pre-wrap w-full`}
                                    >
                                        {msg.message}
                                    </p>

                                    {msg.type !== "user" && msg.query && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => toggleExpanded(index)}
                                                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none text-sm"
                                                aria-expanded={expandedMessages[index] || false}
                                            >
                                                {expandedMessages[index] ? (
                                                    <>
                                                        <Icon name="chevron-up" className="w-5 mr-1" />
                                                        Hide SQL
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon name="chevron-down" className="w-5 mr-1" />
                                                        Show SQL
                                                    </>
                                                )}
                                            </button>

                                            {expandedMessages[index] && (
                                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                    {msg.query}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                    <div ref={chatEndRef} />
                </ul>
            )}
        </div>
    );
};

export default ChatHistoryBayCrest;
