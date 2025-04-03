"use client";
import React, { useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHeader from '../../components/ChatHeader';
import ChatHistoryBayCrest from '@/app/components/ChatHistoryBayCrest';
import { headers2 } from '@/constants';

const BayCrestDemo = () => {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user", isFile?: boolean, fileName?: string }[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const handlePrePromptClick = (message: string) => {
        setQuery(message);
        handleChat(message);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleChat = async (message?: string) => {
        const queryToUse = message ?? query;
        if (!queryToUse.trim()) return;

        // Update chat history with the user message
        setChatHistory((prev) => [...prev, { message: queryToUse, type: "user" }]);
        scrollToBottom();

        setQuery("");
        setIsLoading(true);

        try {
            const maistroCallBody = {
                agent: "Main",
                params: [
                    { name: "userQuestion", value: queryToUse },
                    { name: "userContext", value: "" }
                ],
                options: {
                    returnVariables: true,
                    returnVariablesExpanded: false
                }
            };

            if (chatHistory.length != 0) {
                maistroCallBody.params[1].value = JSON.stringify(chatHistory);
            }

            const responseNs = await axios.post(
                "https://stagingapi.neuralseek.com/v1/baycrest/maistro",
                maistroCallBody,
                { headers: headers2 }
            );

            if (responseNs.data.answer && responseNs.data.variables.query) {
                setChatHistory((prev) => [...prev, { message: responseNs.data.answer, type: "agent", query: responseNs.data.variables.query }]);
                scrollToBottom();
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white"
        >
            {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <ChatHeader title="BayCrest Demo" subtitle="What analysis would you like to run?" image="baycrest_logo.svg" handlePrePromptClick={handlePrePromptClick} />
                </div>
            ) : (
                <div className="flex-grow w-full max-w-3xl mx-auto overflow-y-auto h-[500px]">
                    <ChatHistoryBayCrest messages={chatHistory} setChatHistory={setChatHistory} chatEndRef={chatEndRef} />
                </div>
            )}

            <div className={`w-full ${chatHistory.length > 0 ? "mb-4 flex justify-center" : "flex items-center justify-center h-full"}`}>
                <div className="relative w-full max-w-3xl">
                    <textarea
                        id="query"
                        rows={4}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleChat();
                            }
                        }}
                        className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
                        placeholder="Message NeuralSeek"
                    />

                    <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end p-4">
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => { handleChat() }}
                                disabled={isLoading}
                                className={`p-2 rounded-lg transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                                    }`}
                                title={isLoading ? "Processing..." : files.length === 0 && query.trim().length === 0 ? "Enter a message or upload files" : "Send"}
                            >
                                {isLoading ? (
                                    <Icon name="loader" className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Icon name="paper-plane" className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </section >
    );
};


export default BayCrestDemo;
