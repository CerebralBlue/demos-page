"use client";
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHeader from '../../components/ChatHeader';
import Markdown from 'react-markdown';

const AgentRunnerDemo = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [ingestions, setIngestions] = useState<string[]>([]);

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [agents, setAgents] = useState<Array<{ id: number; name: string; desc: string }>>([]);

    const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
    const [ingestProgress, setIngestProgress] = useState<{ [key: string]: number }>({});
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const [agentOutput, setAgentOutput] = useState<string | null>(null);
    const [agentOutputLoading, setAgentOutputLoading] = useState(false);
    const [variableVals, setVariableVals] = useState<Record<string, string>>({});
    const [variables, setVariables] = useState<Record<string, never[] | string[]>>({});


    const unacceptedAgents = ["list-agents", "query-doc-by-name", "query-aggregated-docs", "ingest-document", "delete-index"];

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

            // send req for each file 
            ingestions.forEach(async fileName => {

                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

                const urlDelete = `${baseUrl}/neuralseek/delete-file`;

                const body = {
                    url_name: "staging-agent-runner",
                    fileName,
                }
                const res = await axios.post(urlDelete, body, {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    }
                })

                if (res.status !== 200) {
                    throw new Error(`Error deleting file ${fileName} status: ${res.status}`);
                }
            });

            // Refetch after deletion (wait 1500 for neuralseek's side)
            setTimeout(async () => await fetchIngestions(), 1000);
            // Clear selected file when cleaning
            setSelectedFile(null);
        } catch (err) {
            console.error("Error deleting ingestions:", err);
        } finally {
            setIsLoading(false);
            setTimeout(async () => await fetchIngestions(), 1000);
            setSelectedFile(null);

        }
    };

    const fetchIngestions = async () => {
        try {

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
            // const baseUrl = "/api";
            const urlExplore = `${baseUrl}/neuralseek/explore-files`;
            console.log(urlExplore);
            const res = await axios.post(urlExplore, 
                {
                    url_name: "staging-agent-runner"
                },
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const uniqueFiles = res.data;
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

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
        const urlUpload = `${baseUrl}/neuralseek/upload-file`;

        try {
            // Initialize progress
            setIngestProgress(prev => ({
                ...prev,
                [file.name]: 0
            }));

            scrollToBottom();

            const formData = new FormData();
            formData.append("file", file);
            formData.append("url_name", "staging-agent-runner");

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

            /**
             * We avoid ingestion and stop as soon as the file was successfully uploaded
             */
            if (uploadedFileName) {

                setIngestProgress(prev => ({
                    ...prev,
                    [file.name]: 100
                }));

                scrollToBottom();

                setTimeout(async () => await fetchIngestions(), 1000);

                setFiles([]);
                setSelectedFile(uploadedFileName);
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

    const getAgentById = (id: number) => {
        return agents.find((agent) => agent.id === id);
    }

    const fetchAgents = async () => {

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
        // const baseUrl = "/api";
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;
        const maistroCallBody = {
            url_name: "staging-agent-runner",
            agent: "list-agents",
            params: [],
        };
        console.log(urlMaistro);
        const res = await axios.post(urlMaistro, maistroCallBody, {
            headers: { 'Content-Type': 'application/json' },
        });


        if (res.status !== 200) {
            throw new Error("Fetch agents failed with status code " + res.status);
        }
        if (res.data.answer == " ") {
            throw new Error("Agent failed to call REST endpoint; check the agent vouch cookie definition");
        }

        const filteredAgents = JSON.parse(res.data.answer).rows.filter((agent: { name: string }) => !unacceptedAgents.includes(agent.name));
        const agentVariables: Record<string, string[]> = {};
        // populate variables for each
        filteredAgents.forEach((agent: { name: string; ntl: string }) => {
            const ntl = agent.ntl;

            // regex for << >>
            const regex = /<<([^>]*)>>/g;
            const captures = [...ntl.matchAll(regex)].map(match => match[1]);

            const f = captures.map(capture => {
                let c = capture.trim();
                let parts = c.split(",");
                let o: Record<any, any> = {}
                parts.forEach((part : string) => {
                    let [key, val]: string[] = part.split(":");
                    key = key.trim();
                    val = val.trim();
                    if (key === "prompt") {
                        o["prompt"] = val === "true" ? true : false;
                    } else {

                        o[key] = val;
                    }
                });

                return o;
            }).filter((v: Record<string, any>) => v.prompt === true) // only variables that require prompting

            const uniqueVariablesMap = new Map();
            f.forEach((v: Record<string, any>) => {
                if (!uniqueVariablesMap.has(v.name)) {
                    uniqueVariablesMap.set(v.name, v);
                }
            });
            const uniqueVariables = Array.from(uniqueVariablesMap.values()).filter(v => v.name !== "docName");
            console.info(uniqueVariables);
            agentVariables[agent.name] = uniqueVariables.map(v => v.name);
        });

        setVariables(agentVariables);

        setAgents(filteredAgents);
        setSelectedAgentId(filteredAgents[0].id);
        setAgentsLoading(false);
    }

    const runAgent = async () => {
        setAgentOutputLoading(true);
        setAgentOutput(null);

        if (selectedAgentId == null) {
            throw new Error("No agent selected");
        } 
        if (selectedFile == null) {
            throw new Error("No file selected");
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        // we use docName to summarize the document
        const agentName = getAgentById(selectedAgentId)!.name;

        const callBody2 = { 
            url_name: "staging-agent-runner",
            agent: agentName,
            params: [{name: "docName", value: selectedFile}, ...(variables[agentName] as string[]).map((variable) => ({name: variable, value: variableVals[variable]}))],
        }

        const res2 = await axios.post(urlMaistro, callBody2, {
            headers: { 'Content-Type': 'application/json' },
        });


        if (res2.status !== 200) {
            throw new Error("Agent running called. Called agent: " + agentName + " and got status code: " + res2.status);
        }

        if (res2.data.answer) {
            setAgentOutput(res2.data.answer);

        }
        setAgentOutputLoading(false);
        
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
                                        const isSelected = selectedFile === file;
                                        return (
                                            <div
                                                key={index}
                                                className={`p-2 border rounded flex items-center cursor-pointer transition ${isSelected
                                                    ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'} hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                                onClick={() => selectFile(file)}
                                            >
                                                <input
                                                    type="radio"
                                                    checked={isSelected}
                                                    onChange={() => selectFile(file)}
                                                    onClick={e => e.stopPropagation()}
                                                    className="form-radio mr-2 rounded-full border-gray-300 dark:border-gray-600"
                                                />
                                                <div className="flex items-center overflow-hidden">
                                                    <Icon name="document-text" className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                                    <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                                                        {file}
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
                    <div className="`w-full flex flex-col h-full border-r border-t dark:border-gray-700 relative p-3">
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
                                {(() => {
                                    const agent = agents.find((agent) => agent.id === selectedAgentId);
                                    return agent && agent.desc && agent.desc.trim().length > 0 ? agent.desc : "No description available";
                                })()}
                            </p>}
                        </>}
                        {
                            agents && selectedAgentId != null && variables[getAgentById(selectedAgentId)!.name] && variables[getAgentById(selectedAgentId)!.name].length > 0 && <>
                                <h5 className="text-xs my-2">Variables</h5>
                                {variables[getAgentById(selectedAgentId)!.name].map((variable) => (
                                    <div key={variable} className="flex items-center mb-2 gap-2">
                                        <span className="text-xs ">
                                            {variable}
                                        </span>
                                        <input type="text" placeholder={variable} onChange={(e) => {setVariableVals({...variableVals, [variable]: e.target.value})}} className="w-full p-2 text-xs outline-none border rounded text-gray-500 dark:text-white dark:bg-gray-800 dark:border-gray-700" />
                                    </div>
                                ))}
                            </>
                        }

                        <div className="mt-2 flex flex-col items-center justify-center">
                            <button disabled={selectedFile == null} className={`w-fit p-2 ${selectedFile == null ? "bg-gray-500" : "bg-blue-500"} text-white rounded-lg ${selectedFile == null ? "opacity-50 cursor-not-allowed" : ""}`} onClick={runAgent}>
                                Run {selectedAgentId != null ? getAgentById(selectedAgentId)?.name : "Agent"} agent
                            </button>
                            {selectedFile == null && <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">select a file to run the agent</span>}
                        </div>

                        
                    </div>
                    
                </div>

                {/* Right Column - Document output */}
                <div className="w-full md:w-2/3 p-5 flex flex-col h-full overflow-y-auto overflow-x-hidden">
                                {agentOutput? <>
                                    {
                                        agentOutput.includes("<!DOCTYPE") ? 
                                        <iframe className="h-full" srcDoc={agentOutput.slice(7, -3)}>

                                        </iframe>
                                        :
                                    <Markdown>
                                        {agentOutput}
                                    </Markdown>

                                    }
                                </> : 
                    <div className="flex flex-col items-center justify-center h-full">
                            <ChatHeader
                                title="Agent Runner"
                                subtitle="What agent would you like to run?"
                                image=""
                                handlePrePromptClick={() => {}}
                            />
                            {agentOutputLoading && <span className="flex items-center justify-center gap-2"><Icon name="loader" className="w-8 h-8 animate-spin" /> Running {selectedAgentId != null ? getAgentById(selectedAgentId)?.name : "Agent"}...</span>}
                        </div>
                        }
                </div>
            </div>
        </section>
    );
};

export default AgentRunnerDemo;