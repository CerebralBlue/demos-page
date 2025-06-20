"use client";
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import { Check, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import SeekModal from '@/app/components/SeekModal';
import { CONTRACT_RULES } from '@/constants';

interface Rule {
    id: number;
    rule: string;
    is_applied?: boolean;
}

interface Analysis {
    id: number;
    seek_reponse: any;
}

interface CheckedState {
    [key: number]: boolean;
}

const PDFViewer = dynamic(
    () => import('../../components/PDFViewer'),
    { ssr: false }
);

const AgreementAnalyzerDemo = () => {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [ingestions, setIngestions] = useState<{ key: string, doc_count: number }[]>([]);

    const [pdfURL, setPdfURL] = useState<string | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [ingestProgress, setIngestProgress] = useState<{ [key: string]: number }>({});

    const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user", seek_data?: any }[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const [rules, setRules] = useState<Rule[]>(CONTRACT_RULES);

    const [rulesAnalysis, setRulesAnalysis] = useState<Analysis[]>([]);
    const fileCache: { [key: string]: Blob } = {};

    // This state would track which rules are checked (for future functionality)
    const [checkedRules, setCheckedRules] = useState<CheckedState>({});
    const checkedCount = Object.values(checkedRules).filter(Boolean).length;
    const uncheckedCount = rules.length - checkedCount;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ directAnswer: string; passages: any[] }>({
        directAnswer: "",
        passages: []
    });

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
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            const maistroCallBody = {
                url_name: "staging-agreement-analyzer",
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
            formData.append("url_name", "staging-agreement-analyzer");

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
                    url_name: "staging-agreement-analyzer",
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
            url_name: "staging-agreement-analyzer",
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

    const handleSeek = async (rule: Rule) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlSeek = `${baseUrl}/neuralseek/seek`;

        const seekCallBody = {
            url_name: "staging-agreement-analyzer",
            question: rule.rule,
            // filter: selectedFile
        };

        const seekResponse = await axios.post(urlSeek, seekCallBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Update chat history with the result
        setChatHistory((prev) => [...prev, { message: `Rule ${rule.id} - ${seekResponse.data.answer}`, type: "agent", seek_data: seekResponse.data }]);
        scrollToBottom();

        return seekResponse.data;
    };

    const handleAnalysis = async () => {
        setIsLoadingAnalysis(true);
        try {
            // const updatedRulesAnalysis = [];
            const newCheckedRules: CheckedState = {};

            for (const rule of rules) {
                const response = await handleSeek(rule);

                const answer = response?.answer || "";

                const isApplicable = !answer.includes("NOT_APPLICABLE");

                // Update newCheckedRules
                newCheckedRules[rule.id] = isApplicable;

                rulesAnalysis.push({
                    id: rule.id,
                    seek_reponse: response
                });
            }

            setCheckedRules(newCheckedRules);

        } catch (err) {
            console.error("Error processing analysis for rules:", err);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    const triggerDownload = (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleDownload = async (fileName: string, triggerBrowserDownload = true) => {
        try {
            const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            // const downloadFileName = safeFileName.replace('-redacted.pdf', '.pdf');

            if (fileCache[safeFileName]) {
                const blob = fileCache[safeFileName];
                const url = window.URL.createObjectURL(blob);
                if (triggerBrowserDownload) triggerDownload(url, safeFileName);
                return blob;
            }

            const fileUrl = `https://stagingconsoleapi.neuralseek.com/amalgamated-bank/maistro/octet-stream/${safeFileName}`;

            const response = await axios.get(fileUrl, {
                responseType: 'blob',
                headers: {
                    'accept': '*/*',
                    'apikey': 'd1803004-192bff32-c49fbecc-2a4bdfad',
                    'Content-Type': 'application/json',
                },
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            fileCache[safeFileName] = blob;

            const url = window.URL.createObjectURL(blob);
            if (triggerBrowserDownload) triggerDownload(url, safeFileName);

            return blob;
        } catch (err) {
            console.error('Error fetching file:', err);
            throw err;
        }
    };

    const selectFile = async (fileName: string) => {
        if (selectedFile === fileName) {
            setSelectedFile(null);
            setPdfURL(null);
        } else {
            setSelectedFile(fileName);

            const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const cachedBlob = fileCache[safeFileName];

            if (cachedBlob) {
                const url = URL.createObjectURL(cachedBlob);
                setPdfURL(url);
            } else {
                try {
                    const blob = await handleDownload(fileName, false);
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        setPdfURL(url);
                    }
                } catch (err) {
                    console.error('Error downloading and setting PDF:', err);
                }
            }
        }
    };

    const handleClick = (ruleId: number) => {
        console.log("Clicked Rule ID:", ruleId);
        console.log("Checked Rules:", checkedRules);
        console.log("Rules Analysis:", rulesAnalysis);
        const a = rulesAnalysis[ruleId - 1]?.seek_reponse
        const b = rulesAnalysis[ruleId - 1]
        handleSeeSeekData(b);
    };

    function convertTextToList(text: any) {
        const lines = text
            .split("\n")
            .map((line: any) => line.trim())
            .filter((line: any) => line !== "");
        let htmlContent = "";
        let ulLevel = 0;

        lines.forEach((line: any) => {
            if (line.startsWith("-")) {
                if (ulLevel === 0) {
                    htmlContent += "<ul>";
                    ulLevel++;
                }
                htmlContent += `<li>${line.substring(1).trim()}</li>`;
            } else {
                if (ulLevel > 0) {
                    htmlContent += "</ul>";
                    ulLevel = 0;
                }
                htmlContent += `<p>${line}</p>`;
            }
        });

        if (ulLevel > 0) {
            htmlContent += "</ul>";
        }

        return htmlContent;
    }

    function highlightPassages(passages: any, highlights: any) {
        if (passages) {
            for (var i in passages) {
                passages[i].passage = passages[i].passage.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
        }

        if (highlights) {
            for (var h of highlights) {
                if (h.text && h.text.length > 2) {
                    try {
                        var tr = h.text.trim().replace(/^[,.?!] +/, "").replace(/[,.?!]\n*$/, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        var regx = new RegExp("((?<!\\<[^>]*?)|(?<=\\>[^<]*?))(?<=(^|\\. +|\\? +|\\! +|, +|[\\n\\t\\r]|\\b|\\s))(" + flexSpace(esRx(tr)) + ")(?<=($|\\. +|\\b|\\s|\\? +|\\! +|, +|[\\n\\t\\r]|))", "gi");
                        // passages[h.docIndex].passage = passages[h.docIndex].passage.replace(regx, `<strong class="bg-yellow-200 text-black px-1 rounded transition-all duration-200">$3</strong>`);
                        passages[h.docIndex].passage = passages[h.docIndex].passage.replace(
                            regx,
                            `<strong class="bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white px-1 rounded transition-all duration-200">$3</strong>`
                        );

                    } catch (f) {
                        console.log(f);
                    }
                }
            }
        }

        return passages;
    }

    function esRx(string: any) {
        if (string)
            return string.replace(/([-/\\^${}\[\]*?.()+])/g, "\\$1");
    }

    function flexSpace(string: any) {
        if (string)
            return string.replace(/[ ,;:"'!@_=#%&|~`<>]+/g, "[ ,;:\"'!@_=#%&|~`<>]+");
    }

    const handleSeeSeekData = (seekData: any) => {
        // if (seekData?.ufa && seekData?.passages && seekData?.score > 0) {
        if (seekData?.ufa && seekData?.passages) {
            // Prepare the seekData for the modal
            const directAnswerHtml = convertTextToList(seekData.ufa);
            const processedPassages = highlightPassages(seekData.passages, seekData.highlights);

            // Set the modal data and open it
            setModalData({
                directAnswer: directAnswerHtml,
                passages: processedPassages
            });
            setIsModalOpen(true);
        } else {
            // Display a message in the modal for no content
            setModalData({
                directAnswer: "There is no content related to your prompt in the documentation",
                passages: []
            });
            setIsModalOpen(true);
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

                    <div className="p-4 bg-white dark:bg-gray-900 space-y-6 text-gray-800 dark:text-gray-100">

                        {/* Header: Ingested Files */}
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                            <h4 className="text-base font-semibold">Agreement Files</h4>

                        </div>

                        {/* Ingested Files List */}
                        {ingestions && ingestions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                                {ingestions.map((file, index) => {
                                    const isSelected = selectedFile === file.key;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => selectFile(file.key)}
                                            className={`p-3 rounded-lg border flex items-center cursor-pointer transition ${isSelected
                                                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40'
                                                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                                } hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                        >
                                            <div className="flex items-center overflow-hidden">
                                                <Icon name="document-text" className="w-5 h-5 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                                <span className="truncate text-sm">{file.key}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Icon name="inbox" className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">No ingested files</p>
                            </div>
                        )}

                        {pdfURL && (
                            <PDFViewer url={pdfURL} />
                        )}
                    </div>
                </div>
                {/* Rules List Section */}
                <div className="w-full md:w-2/3 flex flex-col h-full p-6">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold">Rules List</h4>
                            <p className="ml-2">({rules.length})</p>
                        </div>
                        <a
                            onClick={() => {
                                if (!isLoadingAnalysis && rulesAnalysis.length === 0) {
                                    handleAnalysis();
                                }
                            }}
                            className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer 
        ${(rulesAnalysis.length > 0 || isLoadingAnalysis)
                                    ? 'bg-gray-400 border-gray-400 pointer-events-none opacity-50'
                                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600'}
      `}
                        >
                            <Icon name="check" className="w-4 h-4 mr-2" />
                            <p className="text-sm font-semibold text-white">Run Rules Analysis</p>
                            {isLoadingAnalysis && (
                                <svg
                                    className="animate-spin ml-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                        </a>
                    </div>

                    {isLoading && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                            <svg
                                className="animate-spin mr-2 h-4 w-4 text-green-600 dark:text-green-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            Loading rules...
                        </div>
                    )}

                    <div className="overflow-y-auto">
                        <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-md">
                            <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">ID</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Rule</th>
                                    <th className="py-3 px-4 text-center font-medium text-gray-700 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map((rule) => (
                                    <tr
                                        key={rule.id}
                                        onClick={() => handleClick(rule.id)}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    >
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{rule.id}</td>
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{rule.rule}</td>
                                        <td className="py-3 px-4 text-center">
                                            {checkedRules[rule.id] === undefined ? (
                                                <span className="text-gray-400 dark:text-gray-500 text-lg">–</span>
                                            ) : (
                                                <button
                                                    className={`p-1 rounded-full ${checkedRules[rule.id]
                                                        ? 'bg-green-100 dark:bg-green-900'
                                                        : 'bg-gray-100 dark:bg-gray-700'
                                                        }`}
                                                >
                                                    {checkedRules[rule.id] ? (
                                                        <Check size={18} className="text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <X size={18} className="text-gray-400 dark:text-gray-500" />
                                                    )}
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div className="flex justify-end gap-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>✅ Checked: {checkedCount}</p>
                        <p>❌ Unchecked: {uncheckedCount}</p>
                    </div>
                </div>
            </div>

            <SeekModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                directAnswer={modalData.directAnswer}
                passages={modalData.passages}
            />
        </section>
    );
};

export default AgreementAnalyzerDemo;