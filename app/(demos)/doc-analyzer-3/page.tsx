"use client";
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHeader from '../../components/ChatHeader';
import ChatHistoryDocAnalyzer from '@/app/components/ChatHistoryDocAnalyzer';

const DocAnalyzerDemo = () => {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [ingestions, setIngestions] = useState<{ key: string, doc_count: number }[]>([]);

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [ingestProgress, setIngestProgress] = useState<{ [key: string]: number }>({});
    const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user", seek_data?: any }[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const handlePrePromptClick = (message: string) => {
        setQuery(message);
        handleChat(message);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleClean = async () => {
        try {
            setIsLoading(true);
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            const maistroCallBody = {
                url_name: "staging-doc-analyzer-demo",
                agent: "delete_index",
                params: [],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };
            await axios.post(urlMaistro, maistroCallBody, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Refetch after deletion
            await fetchIngestions();
            // Clear selected file when cleaning
            setSelectedFile(null);
        } catch (err) {
            console.error("Error deleting ingestions:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchIngestions = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            const maistroCallBody = {
                url_name: "staging-doc-analyzer-demo",
                agent: "query_aggregated_docs",
                params: [],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };
            const uniqueESFiles = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const uniqueFiles = JSON.parse(uniqueESFiles.data.answer).aggregations.unique_names.buckets;
            setIngestions(uniqueFiles);

        } catch (err) {
            console.error("Error fetching ingestions:", err);
        }
    };

    useEffect(() => {
        fetchIngestions();
    }, []);

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Just take the first file
            const newFile = e.dataTransfer.files[0];
            setFiles([newFile]);
            await ingestFile(newFile);
        }
    };

    const ingestFile = async (file: File) => {
        setIsIngesting(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlUpload = `${baseUrl}/neuralseek/upload-file`;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        try {
            // Initialize progress
            setIngestProgress(prev => ({
                ...prev,
                [file.name]: 0
            }));

            const fileName = file.name;

            setChatHistory((prev) => [
                ...prev,
                { message: fileName, type: "user", isFile: true, fileName }
            ]);
            scrollToBottom();

            const formData = new FormData();
            formData.append("file", file);
            formData.append("url_name", "staging-doc-analyzer-demo");

            const progressInterval = setInterval(() => {
                setIngestProgress(prev => {
                    const currentProgress = prev[file.name] || 0;
                    if (currentProgress < 90) {
                        return {
                            ...prev,
                            [file.name]: currentProgress + 10
                        };
                    }
                    return prev;
                });
            }, 300);

            const uploadResponse = await axios.post(urlUpload, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setIngestProgress(prev => ({
                            ...prev,
                            [file.name]: percentCompleted
                        }));
                    }
                }
            });
            clearInterval(progressInterval);
            setIngestProgress(prev => ({
                ...prev,
                [file.name]: 95
            }));

            const uploadedFileName = uploadResponse.data.fn;

            if (uploadedFileName) {
                const maistroCallBody = {
                    url_name: "staging-doc-analyzer-demo",
                    agent: "ingest_document",
                    params: [{ name: "name", value: uploadedFileName }],
                    options: { returnVariables: false, returnVariablesExpanded: false }
                };

                await axios.post(urlMaistro, maistroCallBody, {
                    headers: { 'Content-Type': 'application/json' },
                });

                setIngestProgress(prev => ({
                    ...prev,
                    [file.name]: 100
                }));

                setChatHistory((prev) => [
                    ...prev,
                    { message: "Ingested file successful!", type: "agent" }
                ]);
                scrollToBottom();

                await fetchIngestions();
            } else {
                setChatHistory((prev) => [
                    ...prev,
                    { message: "File upload failed. Please try again.", type: "agent" }
                ]);
            }

        } catch (error) {
            setChatHistory(prev => [
                ...prev,
                {
                    message: `There was an error processing the file "${file.name}". Please try again.`,
                    type: "agent"
                }
            ]);
        } finally {
            setIngestProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
            });

            setIsIngesting(false);
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Just take the first file
            const newFile = e.target.files[0];
            setFiles([newFile]);
            await ingestFile(newFile);
        }
    };

    const selectFile = (fileName: string) => {
        // If already selected, deselect it
        if (selectedFile === fileName) {
            setSelectedFile(null);
        } else {
            setSelectedFile(fileName);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleChat = async (message?: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlSeek = `${baseUrl}/neuralseek/seek`;

        setIsLoading(true);
        setQuery("");

        const originalQuery = message ?? query;
        let queryToUse = message ?? query;
        if (!queryToUse.trim()) return;

        // Update chat history with the modified query
        setChatHistory((prev) => [...prev, { message: originalQuery, type: "user" }]);
        scrollToBottom();

        // Seek call
        const seekCallBody = {
            url_name: "staging-doc-analyzer-demo",
            question: queryToUse,
            filter: selectedFile
        };

        const seekResponse = await axios.post(urlSeek, seekCallBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Update chat history with the result
        setChatHistory((prev) => [...prev, { message: seekResponse.data.answer, type: "agent", seek_data: seekResponse.data }]);
        scrollToBottom();

        setIsLoading(false);
    };

    // Autocomplete text area with /
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    };

    return (
        <section className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white">
            <div className="flex flex-col md:flex-row h-full w-full gap-4">
                {/* Left Column - File Upload and Grid */}
                <div
                    className={`w-full md:w-1/3 flex flex-col h-full border-r dark:border-gray-700 relative ${isDragging ? 'border-2 border-dashed border-blue-500' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >

                    <div className="p-3 border-b dark:border-gray-700">

                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Ingested Files</h4>
                            <button
                                onClick={handleClean}
                                title="Clean ingested files"
                                className="text-red-600 hover:text-red-800"
                            >
                                {isLoading ? (
                                    <Icon name="loader" className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Icon name="trash" className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {ingestions && ingestions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                {/* Files List */}
                                {ingestions.map((file, index) => {
                                    const isSelected = selectedFile === file.key;
                                    return (
                                        <div
                                            key={index}
                                            className={`p-2 border rounded flex items-center cursor-pointer transition ${isSelected
                                                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'} hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                            onClick={() => selectFile(file.key)}
                                        >
                                            <input
                                                type="radio"
                                                checked={isSelected}
                                                onChange={() => selectFile(file.key)}
                                                onClick={e => e.stopPropagation()}
                                                className="form-radio mr-2 rounded-full border-gray-300 dark:border-gray-600"
                                            />
                                            <div className="flex items-center overflow-hidden">
                                                <Icon name="document-text" className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                                <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                                                    {file.key}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded">
                                <Icon name="inbox" className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">No ingested files</p>
                            </div>
                        )}
                    </div>

                    {/* Current Upload Section */}
                    <div className="flex-grow overflow-y-auto">
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {files.map((file, index) => (
                                <div key={index} className="p-2 border rounded dark:border-gray-700 flex items-center">
                                    <Icon name="file" className="w-4 h-4 mr-2" />
                                    <span className="truncate text-sm">{file.name}</span>
                                    {ingestProgress[file.name] !== undefined && (
                                        <div className="ml-2 w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                            <div
                                                className="bg-blue-500 h-1.5 rounded-full"
                                                style={{ width: `${ingestProgress[file.name]}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* File Input Area */}
                    <div className="p-4 border-t dark:border-gray-700">
                        <label className="block w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 text-center">
                            <Icon name="upload" className="w-5 h-5 mx-auto mb-1" />
                            <span>Upload File</span>
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {isDragging && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900 border border-blue-500 opacity-80 backdrop-blur-sm pointer-events-none z-10">
                            <div className="flex flex-col items-center text-blue-700 dark:text-blue-300">
                                <Icon name="upload" className="w-10 h-10 mb-2" />
                                <p className="text-lg font-semibold">Drop file here</p>
                            </div>
                        </div>
                    )}

                    {isIngesting && (
                        <div className="absolute bottom-20 left-0 right-0 mx-auto w-3/4 p-2 bg-blue-50 dark:bg-blue-900 rounded shadow-md text-center">
                            <div className="flex items-center justify-center">
                                <Icon name="loader" className="w-4 h-4 animate-spin mr-2" />
                                <span className="text-sm">Ingesting document...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Chat */}
                <div className="w-full md:w-2/3 flex flex-col h-full">
                    {chatHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <ChatHeader
                                title="DOC Analyzer"
                                subtitle="What analysis would you like to run?"
                                image=""
                                handlePrePromptClick={handlePrePromptClick}
                            />
                        </div>
                    ) : (
                        <div className="flex-grow w-full overflow-y-auto h-[500px]">
                            <ChatHistoryDocAnalyzer
                                messages={chatHistory}
                                setChatHistory={setChatHistory}
                                chatEndRef={chatEndRef}
                            />
                        </div>
                    )}

                    <div className="mt-auto p-4">
                        <div className="relative w-full">
                            <textarea
                                ref={textareaRef}
                                id="query"
                                rows={4}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16 text-gray-900 dark:text-gray-100"
                                placeholder={selectedFile ? `Ask about ${selectedFile}...` : "Message NeuralSeek about the documents..."}
                                disabled={isIngesting}
                            />

                            <div className="absolute bottom-2 right-3 flex items-end p-2">
                                <button
                                    onClick={() => handleChat()}
                                    disabled={isLoading || query.trim().length === 0}
                                    className={`p-2 rounded-lg transition ${isLoading || query.trim().length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"}`}
                                    title={isLoading ? "Processing..." : query.trim().length === 0 ? "Enter a message" : "Send"}
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
            </div>
        </section>
    );
};

export default DocAnalyzerDemo;