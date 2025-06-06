"use client";
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHeader from '../../components/ChatHeader';
import ChatHistoryDocAnalyzer from '@/app/components/ChatHistoryDocAnalyzer';

const AgentRunnerDemo = () => {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [ingestions, setIngestions] = useState<{ key: string, doc_count: number }[]>([]);

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [agents, setAgents] = useState<any[]>([]);
    const [selectedAgentId, setSelectedAgentId] = useState<number | null>(0);
    const [ingestProgress, setIngestProgress] = useState<{ [key: string]: number }>({});
    const chatEndRef = useRef<HTMLDivElement | null>(null);

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
        fetchAgents();
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

                scrollToBottom();

                await fetchIngestions();
            } else {

            }

        } catch (error) {

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


    const fetchAgents = async () => {
        const res = await axios.post("https://stagingapi.neuralseek.com/v1/leon-agent-running/maistro", {
            "agent": "list-agents"
        }, {
            headers: {
                "apikey": "a1546de3-7c9de1d1-199b588e-c989f680"
            }
        });

        if (res.status !== 200) {
            throw new Error("Fetch agents failed with status code " + res.status);
            return;
        }
        console.info(JSON.parse(res.data.answer));

        setAgents(JSON.parse(res.data.answer).rows);
        setAgentsLoading(false);
    }


    return (
        <section className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white">
            <div className="flex flex-col md:flex-row h-full w-full gap-4">
                {/* Left Column - Agent Selector, File Upload and Grid */}

                <div className="w-full  md:w-1/3 flex flex-col h-full border-r dark:border-gray-700 relative">
                    {/* file ingestion */}
                    <div
                        className={`w-full flex flex-col h-full border-r dark:border-gray-700 relative ${isDragging ? 'border-2 border-dashed border-blue-500' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        
                        {/* ingested files */}
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

                    {/* agent selector panel */}
                    <div className="`w-full flex flex-col h-2/5 border-r border-t dark:border-gray-700 relative p-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Agent Selector</h4>
                            <div className="cursor-pointer" onClick={() => {setAgentsLoading(true); fetchAgents(); setSelectedAgentId(0);}}>
                                <Icon  name="loader" className={`w-5 h-5 ${agentsLoading ? "animate-spin" : ""}`} />
                            </div>
                
                        </div>
                        <h5 className="text-xs my-2 ">Agent Name</h5>
                        {agents && agents.length > 0 && <>
                            <select 
                                className="w-full p-2 outline-none border rounded text-gray-500 dark:text-white dark:bg-gray-800 dark:border-gray-700"
                                onChange={(e) => {setSelectedAgentId(parseInt(e.target.value))}}
                                value={selectedAgentId ?? 0}
                            >
                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                                ))}
                            </select>
                            <h5 className="text-xs my-2">Agent Description</h5>
                            {selectedAgentId != null && <p className="text-xs text-gray-500 dark:text-gray-400">
                                {agents[selectedAgentId]?.desc.trim().length > 0 ? agents[selectedAgentId]?.desc : "No description available"}
                            </p>}
                        </>}

                        <div className="flex items-center justify-center">
                            <button className="w-fit p-2 bg-blue-500 text-white rounded-lg">
                                Run {selectedAgentId != null ? agents[selectedAgentId]?.name : "Agent"} agent
                            </button>
                        </div>
                        
                    </div>
                    
                </div>

                {/* Right Column - Document output */}
                <div className="w-full md:w-2/3 flex flex-col h-full">
                </div>
            </div>
        </section>
    );
};

export default AgentRunnerDemo;