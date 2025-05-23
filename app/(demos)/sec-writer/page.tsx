"use client";
import React, { DragEvent, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHistorySec from '../../components/ChatHistorySec';
import ChatHeader from '../../components/ChatHeader';

const SECDemo = () => {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user", isFile?: boolean, fileName?: string }[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const handlePrePromptClick = (message: string) => {
        setQuery(message);
        handleChat(message);
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            setFiles([...files, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleChat = async (message?: string) => {

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlUpload = `${baseUrl}/neuralseek/upload-file`;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;
        const urlIngestion = `${baseUrl}/ingestions/create`;

        let maistroCallBody;


        if (files.length > 0) {
            const formData = new FormData();
            const fileName = files[0].name;
            const fileExtension = fileName.split('.').pop();

            setChatHistory((prev) => [
                ...prev,
                { message: fileName, type: "user", isFile: true, fileName }
            ]);
            scrollToBottom();

            formData.append("file", files[0]);

            try {
                // File Upload
                // const response = await axios.post(
                //     "https://stagingconsoleapi.neuralseek.com/SEC-demo/exploreUpload",
                //     formData,
                //     { headers }
                // );

                // const dataResponse = response.data;
                // const fileName = dataResponse.fn;

                // Upload file to mAIstro
                const formData = new FormData();
                formData.append("file", files[0]);
                formData.append("url_name", "staging-SEC-demo");
                const uploadResponse = await axios.post(urlUpload, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const uploadedFileName = uploadResponse.data.fn;

                if (uploadedFileName) {
                    maistroCallBody = {
                        url_name: "staging-SEC-demo",
                        agent: "ocr_document",
                        params: [
                            { name: "name", value: uploadedFileName },
                        ],
                        options: {
                            returnVariables: false,
                            returnVariablesExpanded: false
                        }
                    };
                }

                // OCR file within mAIstro
                const responseOCR = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const ocrText = responseOCR.data.answer;

                // Store OCR sheet only if there is meaningful text
                if (ocrText && ocrText.length > 0) {
                    await axios.post(
                        urlIngestion,
                        { database: "sec_demo", file_name: fileName, type: fileExtension, data: ocrText },
                    );

                    // Show success message
                    setChatHistory((prev) => [...prev, { message: "Ingested file successful!", type: "agent" }]);
                    scrollToBottom();

                    // Clear input fields
                    setQuery("");
                    setFiles([]);
                } else {
                    // Show success message
                    setChatHistory((prev) => [...prev, { message: "Ingestion could not be done!", type: "agent" }]);
                    scrollToBottom();
                }

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }

        } else {
            const queryToUse = message ?? query;
            if (!queryToUse.trim()) return;

            // Update chat history with the user message
            setChatHistory((prev) => [...prev, { message: queryToUse, type: "user" }]);
            scrollToBottom();

            setQuery("");
            setIsLoading(true);

            try {
                maistroCallBody = {
                    url_name: "staging-SEC-demo",
                    agent: "chat_agent",
                    params: [
                        { name: "message", value: queryToUse },
                        { name: "chatHistory", value: JSON.stringify(chatHistory) }
                    ],
                    options: {
                        returnVariables: false,
                        returnVariablesExpanded: false
                    }
                };

                const chatResponse = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (chatResponse.data.answer === "trigger_ingestion") {
                    setChatHistory((prev) => [...prev, { message: "Upload the PDF sheet file", type: "agent" }]);
                    scrollToBottom();
                } else if (chatResponse.data.answer === "trigger_10k_creation") {
                    setChatHistory((prev) => [...prev, { message: "Select the ingested file", type: "agent" }]);
                    scrollToBottom();
                } else if (chatResponse.data.answer === "out_of_reporting_context_request") {
                    setChatHistory((prev) => [...prev, { message: "The request is out of the 10K Reporting context", type: "agent" }]);
                    scrollToBottom();
                }

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

    };

    const prePrompts: any = [
        {
            prompt: "Ingest a balance or income statement file",
            iconName: "document-text",
            label: "Ingest Periods Data"
        },
        {
            prompt: "Generate a detailed AI 10K Report file",
            iconName: "document-chart-bar",
            label: "Generate AI 10K Report"
        }
    ];

    return (
        <section
            className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >

            {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <ChatHeader title="SEC Reporting Demo" subtitle="What reporting task do you want to run today?" image="neuralseek_logo.png" handlePrePromptClick={handlePrePromptClick} prePrompts={prePrompts} />
                </div>
            ) : (
                <div className="flex-grow w-full max-w-3xl mx-auto overflow-y-auto h-[500px]">
                    <ChatHistorySec messages={chatHistory} setChatHistory={setChatHistory} chatEndRef={chatEndRef} />
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
                        {files.length > 0 && (
                            <div className="flex flex-wrap gap-2 max-w-[80%]">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group flex items-center py-1 px-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
                                    >
                                        <Icon name="document" className="w-4 h-4 text-blue-500 dark:text-blue-300 mr-1" />
                                        <div className="relative">
                                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                                                {file.name}
                                            </p>
                                            <div className="absolute left-1/2 -top-7 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                                {file.name}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="ml-2 text-gray-500 hover:text-gray-700 transition"
                                        >
                                            <Icon name="x-circle" className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 justify-end">
                            <label className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer">
                                <Icon name="document-arrow-up" className="w-5 h-5" />
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={(e) => {
                                        const selectedFiles = e.target.files;
                                        if (selectedFiles && selectedFiles.length > 0) {
                                            setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
                                        }
                                    }}
                                />
                            </label>
                            <button
                                onClick={() => { handleChat() }}
                                disabled={isLoading || (files.length === 0 && query.trim().length === 0)}
                                className={`p-2 rounded-lg transition ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : files.length > 0 || query.trim().length > 0
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-not-allowed'
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

            {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900 border border-blue-500 opacity-80 backdrop-blur-sm pointer-events-none z-10">
                    <div className="flex flex-col items-center text-blue-700 dark:text-blue-300">
                        <Icon name="upload" className="w-10 h-10 mb-2" />
                        <p className="text-lg font-semibold">Drop files anywhere in this section</p>
                    </div>
                </div>
            )}

        </section >
    );
};


export default SECDemo;
