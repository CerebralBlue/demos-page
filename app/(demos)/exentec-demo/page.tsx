"use client";
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHeader from '../../components/ChatHeader';
import ChatHistoryExentec from '@/app/components/ChatHistoryExentec';

const exentecPrompts = [
    {
        "Record_Type": "Safety Report Prompt",
        "Project_Instructions": "Instructions -- Summarize the provided file content into a detailed safety report. Highlight potential hazards, safety measures, and compliance with relevant safety standards."
    },
    {
        "Record_Type": "Installation SOP Prompt",
        "Project_Instructions": "Instructions -- Based on the file content, create a step-by-step Standard Operating Procedure (SOP) for the installation process. Include tools required, safety precautions, and quality checks."
    },
    {
        "Record_Type": "EPA Checklist Prompt",
        "Project_Instructions": "Instructions -- Analyze the file content and generate an EPA compliance checklist. Include waste management, emissions control, and environmental impact assessments."
    },
    {
        "Record_Type": "Maintenance Checklist Prompt",
        "Project_Instructions": "Instructions -- Review the file content and develop a comprehensive maintenance checklist. Cover routine inspections, preventive maintenance tasks, and troubleshooting steps."
    }
];

const ExentecDemo = () => {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [ingestions, setIngestions] = useState<{ id: string, file_name: string, data: string }[]>([]);
    const allFileNames = ingestions?.map(file => file.file_name) || [];
    const allSelected = selectedFiles.length === allFileNames.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(allFileNames);
        }
    };

    const toggleFile = (fileName: string) => {
        setSelectedFiles(prev =>
            prev.includes(fileName)
                ? prev.filter(name => name !== fileName)
                : [...prev, fileName]
        );
    };

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [ingestProgress, setIngestProgress] = useState<{ [key: string]: number }>({});
    const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user", isFile?: boolean, fileName?: string }[]>([]);
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

    const fetchIngestions = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const url = `${baseUrl}/ingestions?database=exentec_demo`;

            const response = await axios.get(url);
            setIngestions(response.data.data);
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
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...newFiles]);

            // Begin ingestion process for the new files
            await ingestFile(newFiles[0]); // Process first file
        }
    };

    const ingestFile = async (file: File) => {

        setIsIngesting(true);
        setIsLoading(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlUpload = `${baseUrl}/maistro/upload-file`;
        const urlMaistro = `${baseUrl}/maistro`;
        const urlIngestion = `${baseUrl}/ingestions/create`;

        try {
            // Initialize progress for this file
            setIngestProgress(prev => ({
                ...prev,
                [file.name]: 0
            }));

            const fileName = file.name;
            const fileExtension = fileName.split('.').pop();

            // Add file to chat history
            setChatHistory((prev) => [
                ...prev,
                { message: fileName, type: "user", isFile: true, fileName }
            ]);
            scrollToBottom();

            // Create FormData for file upload
            const formData = new FormData();
            formData.append("file", file);
            formData.append("url_name", "staging-exentec-demo");

            // Simulate upload progress
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

            // Use axios for upload
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
            const dataResponse = uploadResponse.data;
            const uploadedFileName = dataResponse.fn;

            // Process the file with OCR if filename exists
            if (uploadedFileName) {
                const maistroCallBody = {
                    url_name: "staging-exentec-demo",
                    agent: "orc_document",
                    params: [
                        { name: "name", value: uploadedFileName },
                    ],
                    options: {
                        returnVariables: false,
                        returnVariablesExpanded: false
                    }
                };

                // OCR file within mAIstro
                const ocrData = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Set progress to 100% after OCR
                setIngestProgress(prev => ({
                    ...prev,
                    [file.name]: 100
                }));

                // Store OCR sheet
                if (ocrData.data.answer && ocrData.data.answer.length > 0) {
                    // Store OCR sheet only if there is meaningful text
                    await axios.post(
                        urlIngestion,
                        { database: "exentec_demo", file_name: fileName, type: fileExtension, data: ocrData.data.answer },
                    );

                    // Show success message
                    setChatHistory((prev) => [...prev, { message: "Ingested file successful!", type: "agent" }]);
                    scrollToBottom();

                    setFiles([]);

                    await fetchIngestions();
                } else {
                    setChatHistory((prev) => [...prev, { message: "Ingestion could not be done!", type: "agent" }]);
                    scrollToBottom();
                }
            } else {
                setChatHistory((prev) => [...prev, { message: "File upload failed. Please try again.", type: "agent" }]);
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
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            await ingestFile(newFiles[0]);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleChat = async (message?: string) => {

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlMaistro = `${baseUrl}/maistro`;

        setIsLoading(true);
        setQuery("");

        const originalQuery = message ?? query;
        let queryToUse = message ?? query;
        if (!queryToUse.trim()) return;

        // Update chat history with the modified query
        setChatHistory((prev) => [...prev, { message: originalQuery, type: "user" }]);
        scrollToBottom();

        // Find matching Record_Type in exentecPrompts
        exentecPrompts.forEach((prompt) => {
            if (queryToUse.includes(`"${prompt.Record_Type}"`)) {
                queryToUse = queryToUse.replace(`"${prompt.Record_Type}"`, `"${prompt.Project_Instructions}"`);
            }
        });

        // Build documentation from ingestions
        let documentation = "### Documentation\n\n";

        if (selectedFiles.length === 0) {
            // Use all ingestions if none are selected
            documentation += ingestions
                .map(ingestion => `### ${ingestion.file_name}\n${ingestion.data}`)
                .join("\n\n");
        } else {
            // Use only selected files
            documentation += ingestions
                .filter(ingestion => selectedFiles.includes(ingestion.file_name))
                .map(ingestion => `### ${ingestion.file_name}\n${ingestion.data}`)
                .join("\n\n");
        }

        const prompt = `### Instructions\n${queryToUse}\n\n### Documentation\n${documentation}`;

        // mAIstro LLM call
        const maistroCallBody = {
            url_name: "staging-exentec-demo",
            agent: "llm_call",
            params: [
                { name: "prompt", value: prompt },
            ],
            options: {
                returnVariables: false,
                returnVariablesExpanded: false,
            },
        };

        const dataResponse = await axios.post(urlMaistro, maistroCallBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Update chat history with the result
        setChatHistory((prev) => [...prev, { message: dataResponse.data.answer, type: "agent" }]);
        scrollToBottom();

        setIsLoading(false);
    };

    // Autocomplete text area with /
    const [showPromptSelect, setShowPromptSelect] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const prompts = exentecPrompts.map(item => item.Record_Type);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        } else if (e.key === "/") {
            setShowPromptSelect(true);
        }
    };

    const handleSelectPrompt = (prompt: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const startPos = textarea.selectionStart;
        const textBefore = query.substring(0, startPos);
        const slashIndex = textBefore.lastIndexOf("/");
        if (slashIndex !== -1) {
            const beforeSlash = textBefore.substring(0, slashIndex);
            const afterSlash = query.substring(startPos);

            setQuery(`${beforeSlash} "${prompt}" ${afterSlash}`);
        }
        setShowPromptSelect(false);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(startPos + prompt.length, startPos + prompt.length);
        }, 0);
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
                        <h4 className="text-sm font-medium mb-2">Ingested Files</h4>
                        {ingestions && ingestions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                {/* Select All Checkbox */}
                                <div className="flex items-center space-x-2 mb-1 px-2">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                                    />
                                    <label className="text-sm font-medium">Select All</label>
                                </div>

                                {/* Files List */}
                                {ingestions.map((file, index) => {
                                    const isSelected = selectedFiles.includes(file.file_name);
                                    return (
                                        <div
                                            key={index}
                                            className={`p-2 border rounded flex items-center cursor-pointer transition${isSelected
                                                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'} hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                            onClick={() => toggleFile(file.file_name)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleFile(file.file_name)}
                                                onClick={e => e.stopPropagation()}
                                                className="form-checkbox mr-2 rounded border-gray-300 dark:border-gray-600"
                                            />
                                            <div className="flex items-center overflow-hidden">
                                                <Icon name="document-text" className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                                <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                                                    {file.file_name}
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
                            <span>Upload Files</span>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {isDragging && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900 border border-blue-500 opacity-80 backdrop-blur-sm pointer-events-none z-10">
                            <div className="flex flex-col items-center text-blue-700 dark:text-blue-300">
                                <Icon name="upload" className="w-10 h-10 mb-2" />
                                <p className="text-lg font-semibold">Drop files here</p>
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
                                title=""
                                subtitle="What analysis would you like to run?"
                                image="exentec_logo.png"
                                handlePrePromptClick={handlePrePromptClick}
                            />
                        </div>
                    ) : (
                        <div className="flex-grow w-full overflow-y-auto h-[500px]">
                            <ChatHistoryExentec
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
                                placeholder="Message NeuralSeek using / for pre saved prompts"
                                disabled={isIngesting}
                            />

                            {showPromptSelect && (
                                <div className="absolute bottom-12 left-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md w-64 p-2 z-10 animate-fade-in max-h-56 overflow-y-auto">
                                    {prompts.length > 0 ? (
                                        prompts.map((prompt, index) => (
                                            <div
                                                key={index}
                                                className="relative p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded truncate"
                                                onClick={() => handleSelectPrompt(prompt)}
                                            >
                                                <span className="truncate block">{prompt}</span>
                                                <div className="absolute left-0 bottom-full mb-1 hidden w-auto bg-black text-white text-xs rounded-md px-2 py-1 shadow-md group-hover:block">
                                                    {prompt}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-2 text-gray-500 dark:text-gray-400">No prompts available</div>
                                    )}
                                </div>
                            )}

                            <div className="absolute bottom-2 right-3 flex items-end p-2">
                                <button
                                    onClick={() => handleChat}
                                    disabled={isLoading && query.trim().length === 0}
                                    className={`p-2 rounded-lg transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"}`}
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

export default ExentecDemo;