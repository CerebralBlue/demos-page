"use client";
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHeader from '../../components/ChatHeader';
import ChatHistoryDerrickLaw from '@/app/components/ChatHistoryDerrickLaw';

const derrickPrompts = [
    {
        "Record_Type": "EMS/Medical Transport Record",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from an EMS or medical transport provider that transported our client from the scene of the accident. Please use all of the information provided to you to draft a detailed summary of the narrative report in the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well.\n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "Hospital ER Record",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from an emergency room (ER) visit or same-day hospital visit. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider name \n2. Client Name & DOB\n3. Complaint and/or Reason for visit\n4. History of present illness \n5. Preexisting conditions related to present complaints \n6. Tests performed with interpretation (imaging, lab work, etc) \n7. Discharge plan, to include medications prescribed and/or treatment recommended, referrals or follow ups\n8. Assignment of benefits or liens\n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "Routine Office Visit Record",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from an routine medical office visit after their accident. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name & DOB\n3. Complaints and/or Reason for visit\n4. Preexisting conditions related to present complaints \n5. Type of tests performed with interpretation (imaging), \n6. In-office/hospital treatment performed on that date of service\n7. Treatment plan, to include the medications prescribed, referrals to specialist, physical therapy, follow-up appointment, and if a client is at MMI (maximum medical improvement) or has been released from treatment\n8. Assignment of benefits or liens \n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "Therapy Record",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from therapy appointments after their accident. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider name \n2. Client Name & DOB\n3. Presenting concerns and/or chief complaints \n4. Initial assessment\n5. Discharge assessment \n6. Assignment of benefits or liens \n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "Hospital Admission Record",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from their overnight hospital admission after their accident. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name & DOB\n3. Complaint and/or reason for visit\n4. History of present illness \n5. Preexisting conditions related to present complaints \n6. Tests performed with interpretation (imaging, lab work, etc) \n7. Consults – name of physician consulted \n8. Surgery performed (if applicable) \n9. Treatment plan for hospital stay\n10. Discharge plan, to include medications prescribed, follow-up appointments, and referrals \n11. Assignment of benefits or liens \n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "Special Evaluation Record (IME, Questionnaires, FCE)",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from a special evaluation done after the accident, which can include an independent medical exam (IME) by a physician, a physician questionnaire, or a functional capacity evaluation. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name and DOB \n3. Reason for evaluation \n4. Presenting concerns and/or complaints \n5. Preexisting conditions related to current complaints \n6. Provider impression, recommendations, and treatment plan\n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "Imaging Only Report",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from imaging results, review, and interpretations done by a physician after X-Rays, MRI, CT scan, or other related imaging is done. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name and DOB \n3. Reason for evaluation \n4. Results or impression of interpreting doctor \n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "Client Communication Notes",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you a copy of the Medical Liaison Paralegal's notes from their calls with our clients while our clients are treating. I need you to summarize those call notes by date, in chronological order, and provide a timeline by month of the highlights across the client's treatment period. If there are any red flags, please identify those as well. We specifically want these items addressed:\n\n1. Date of each call, text, or email\n2. Summary of all notes in chronological order starting with the oldest and going to the newest, separated by month and in a timeline format\n\nFormat -- Put the draft into a document."
    },
    {
        "Record_Type": "All Medical Record",
        "DLF_Dept_Category": "ML",
        "Project_Instructions": "Instructions -- I am going to give you a collection of all the medical records related to the treatment of our personal injury client. Please use all of the information provided to you to draft a chronological summary of the records provided. We specifically want these items addressed in any/all record summaries:\n\n1. Date of Service\n2. Provider Name \n3. Complaint and/or reason for visit\n4. Treatment Plan\n\nFormat -- Please put them in chronological order from oldest to newest by date of service. Please include the Date of Service as the first item on the chronology. \n\nTimeline -- After the summary, I want you to create a timeline of medical treatment noting each date of service, along with the date of accident noted in a different colored dot on the graph. "
    },
    {
        "Record_Type": "All Medical Record",
        "DLF_Dept_Category": "WC",
        "Project_Instructions": "Instructions -- I am going to give you a collection of all the medical records related to the treatment of our personal injury client. Please use all of the information provided to you to draft a chronological summary of the records provided. We specifically want these items addressed in any/all record summaries:\n\n1. Date of Service\n2. Provider Name \n3. Complaint and/or reason for visit\n4. Rating\n5. If MMI (Maximum Medical Improvement) has been reached, to a reasonable degree of medical certainty noted by the physician\n6. Diagnosis\n7. Prior medical history mentioned\n8. Key words \"more likely than not\" and the word \"aggravated\"\n\nFormat -- Please put them in chronological order from oldest to newest by date of service. Please include the Date of Service as the first item on the chronology. After the summary, I want you to create a time series graph of each date of service noted, along with the date of accident noted in a different colored dot on the graph. "
    }
];

const DerrickDemo = () => {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [ingestions, setIngestions] = useState<{ id: string, file_name: string, data: string }[]>([]);

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
            const url = `${baseUrl}/ingestions?database=derrick_demo`;

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
        const urlUpload = `${baseUrl}/neuralseek/upload-file`;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;
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
            formData.append("url_name", "staging-derrick-law-demo");

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
                    url_name: "staging-derrick-law-demo",
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
                        { database: "derrick_demo", file_name: fileName, type: fileExtension, data: ocrData.data.answer },
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
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;
        
        setIsLoading(true);
        setQuery("");

        const originalQuery = message ?? query;
        let queryToUse = message ?? query;
        if (!queryToUse.trim()) return;

        // Update chat history with the modified query
        setChatHistory((prev) => [...prev, { message: originalQuery, type: "user" }]);
        scrollToBottom();

        // Find matching Record_Type in derrickPrompts
        derrickPrompts.forEach((prompt) => {
            if (queryToUse.includes(`"${prompt.Record_Type}"`)) {
                queryToUse = queryToUse.replace(`"${prompt.Record_Type}"`, `"${prompt.Project_Instructions}"`);
            }
        });

        // Find matching file_name in ingestions
        ingestions.forEach((file) => {
            if (queryToUse.includes(`<${file.file_name}>`)) {
                queryToUse = queryToUse.replace(`<${file.file_name}>`, file.data);
            }
        });

        // mAIstro LLM call
        const maistroCallBody = {
            url_name: "staging-derrick-law-demo",
            agent: "llm_call",
            params: [
                { name: "prompt", value: queryToUse },
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

    // Autocomplete text area with @ and /
    const [showFileSelect, setShowFileSelect] = useState(false);
    const [showPromptSelect, setShowPromptSelect] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const prompts = derrickPrompts.map(item => item.Record_Type);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        } else if (e.key === "@") {
            setShowFileSelect(true);
        } else if (e.key === "/") {
            setShowPromptSelect(true);
        }
    };

    const handleSelectFile = (fileName: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const startPos = textarea.selectionStart;
        const textBefore = query.substring(0, startPos);
        const atIndex = textBefore.lastIndexOf("@");
        if (atIndex !== -1) {
            const beforeAt = textBefore.substring(0, atIndex);
            const afterAt = query.substring(startPos);

            setQuery(`${beforeAt} <${fileName}> ${afterAt}`);
        }
        setShowFileSelect(false);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(startPos + fileName.length, startPos + fileName.length);
        }, 0);
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
                            <div className="grid grid-cols-1 gap-2 max-h-100 overflow-y-auto">
                                {ingestions.map((file, index) => (
                                    <div key={index} className="p-2 border rounded dark:border-gray-700 flex items-center justify-between">
                                        <div className="flex items-center overflow-hidden">
                                            <Icon name="document-text" className="w-4 h-4 mr-2 flex-shrink-0" />
                                            <span className="truncate text-sm">{file.file_name}</span>
                                        </div>
                                    </div>
                                ))}
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
                        {/* File Grid - Shows currently uploaded files */}
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
                                title="Derrick Law Firm Demo"
                                subtitle="What analysis would you like to run?"
                                image="derrick_law_firm_logo.png"
                                handlePrePromptClick={handlePrePromptClick}
                            />
                        </div>
                    ) : (
                        <div className="flex-grow w-full overflow-y-auto h-[500px]">
                            <ChatHistoryDerrickLaw
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
                                placeholder="Message NeuralSeek using @ for files and / for prompts"
                                disabled={isIngesting}
                            />

                            {showFileSelect && (
                                <div className="absolute bottom-12 left-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md w-48 p-2 z-10 animate-fade-in max-h-56 overflow-y-auto">
                                    {ingestions.length > 0 ? (
                                        ingestions.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded truncate"
                                                onClick={() => handleSelectFile(file.file_name)}
                                            >
                                                <span className="truncate block">{file.file_name}</span>
                                                <div className="absolute left-0 bottom-full mb-1 hidden w-auto bg-black text-white text-xs rounded-md px-2 py-1 shadow-md group-hover:block">
                                                    {file.file_name}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-2 text-gray-500 dark:text-gray-400">No files available</div>
                                    )}
                                </div>
                            )}

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
                                    disabled={isLoading}
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

export default DerrickDemo;