"use client";
import React, { DragEvent, useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import ChatHeader from '../../components/ChatHeader';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
    () => import('../../components/PDFViewer'),
    { ssr: false }
);

type PiiTypeMatch = {
    pii: string[];
    type: string;
};

type PiiVariables = {
    fileName: string;
    "PII.pii": boolean;
    "PII.possiblePII": string[];
    "PII.piiTypes": string[];
    "PII.piiTypeMatches": PiiTypeMatch[];
};

type MaistroResponse = {
    answer: string;
    variables: PiiVariables;
};

const PIIAnalyzerSFTPDemo = () => {
    // const [files, setFiles] = useState<File[]>([]);

    const [originalFiles, setOriginalFiles] = useState<File[]>([]);
    const [piiFiles, setPiiFiles] = useState<File[]>([]);
    
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    // const [files, setFiles] = useState<{ key: string, doc_count: number }[]>([]);

    const [pdfURL, setPdfURL] = useState<string | null>(null);

    const [piiVariables, setPiiVariables] = useState<MaistroResponse | null>(null);
    const [contentVisible, setContentVisible] = useState(false);
    const answerText = piiVariables?.answer ?? "";

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const [isLoadingDownloadReport, setIsLoadingDownloadReport] = useState(false);

    const handlePrePromptClick = (message: string) => {
        // setQuery(message);
        // handleChat(message);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            // setFiles(prev => [...prev, ...newFiles]);

            // Handle PDF URL for the first file
            const firstFile = newFiles[0];
            if (firstFile && firstFile.type === 'application/pdf') {
                const fileURL = URL.createObjectURL(firstFile);
                setPdfURL(fileURL);
            }

            // Begin ingestion process for the new files
            await uploadAndProcessFile(firstFile);
        }
    };

    const uploadAndProcessFile = async (file: File) => {
        setIsLoading(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlUpload = `${baseUrl}/neuralseek/upload-file`;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("url_name", "staging-sftp-pii-demo");

            // Use axios for upload
            const uploadResponse = await axios.post(urlUpload, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const uploadedFileName = uploadResponse.data.fn;

            if (uploadedFileName) {
                const maistroCallBody = {
                    url_name: "staging-sftp-pii-demo",
                    agent: "write_sftp",
                    params: [
                        { name: "name", value: uploadedFileName },
                    ],
                    options: {
                        returnVariables: true,
                        returnVariablesExpanded: true,
                    },
                };
                const writeSftp = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // const piiData = piiResponse.data;
                // setPiiVariables(piiData);
                const uploadReponse = writeSftp.data.answer;
                console.log("Upload response:", uploadReponse);
            }

        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        setIsLoadingDownload(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlCreatePdf = `${baseUrl}/create-pdf`;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        const maistroCallBody = {
            url_name: "staging-sftp-pii-demo",
            agent: "create-pdf",
            params: [
                { name: "content", value: answerText },
            ],
            options: {
                returnVariables: false,
                returnVariablesExpanded: false
            }
        };

        try {
            // Maistro request
            const piiResponse = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const htmlContent = piiResponse.data.answer;

            // PDF generation request with axios
            const pdfResponse = await axios.post(urlCreatePdf, { html: htmlContent }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            });

            // Trigger file download
            const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
            const urlFile = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlFile;
            a.download = 'redacted_document.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(urlFile);

        } catch (error) {
            console.error('Error downloading PDF:', error);
        } finally {
            setIsLoadingDownload(false);
        }
    };

    const handleDownloadReport = async () => {
        setIsLoadingDownloadReport(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlCreatePdf = `${baseUrl}/create-pdf`;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        const piiPayload = {
            "PII.pii": piiVariables?.variables["PII.pii"],
            "PII.possiblePII": piiVariables?.variables["PII.possiblePII"],
            "PII.piiTypes": piiVariables?.variables["PII.piiTypes"],
            "PII.piiTypeMatches": piiVariables?.variables["PII.piiTypeMatches"],
            "fileName": piiVariables?.variables.fileName
        };

        const maistroCallBody = {
            url_name: "staging-sftp-pii-demo",
            agent: "create-pii-report",
            params: [
                { name: "content", value: JSON.stringify(piiPayload) },
            ],
            options: {
                returnVariables: false,
                returnVariablesExpanded: false
            }
        };

        try {
            // Get HTML content
            const responseHTML = await axios.post(urlMaistro, maistroCallBody, {
                headers: { 'Content-Type': 'application/json' }
            });

            const htmlContent = responseHTML.data.answer;

            // Generate PDF
            const pdfResponse = await axios.post(urlCreatePdf, { html: htmlContent }, {
                headers: { 'Content-Type': 'application/json' },
                responseType: 'blob', // This is how you tell axios to expect a binary file
            });

            // Download PDF
            const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'pii_report.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error downloading PDF:', error);
        } finally {
            setIsLoadingDownloadReport(false);
        }
    };

    const fetchFilesByPath = async (path: string) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            const maistroCallBody = {
                url_name: "staging-sftp-pii-demo",
                agent: "list_sftp_files_by_path",
                params: [
                    {
                        name: "path",
                        value: path
                    }
                ],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };
            const sftpFiles = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const files = JSON.parse(sftpFiles.data.answer);
            if (path === "/files/original-files") {
                setOriginalFiles(files);
            } else if (path === "/files/pii-files") {
                setPiiFiles(files);
            }

        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };

    useEffect(() => {
        fetchFilesByPath("/original-files");
        fetchFilesByPath("/pii-files");
    }, []);

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
            await fetchFilesByPath("/files/original-files");
            await fetchFilesByPath("/files/pii-files");
            // Clear selected file when cleaning
            setSelectedFile(null);
        } catch (err) {
            console.error("Error deleting files:", err);
        } finally {
            setIsLoading(false);
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

    return (
        <section className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white">
            <div className="flex flex-col md:flex-row h-full w-full gap-4">

                <div className="p-3 border-b dark:border-gray-700">

                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">SFTP Storage Files</h4>
                        {/* <button
                            onClick={handleClean}
                            title="Clean ingested files"
                            className="text-red-600 hover:text-red-800"
                        >
                            {isLoading ? (
                                <Icon name="loader" className="w-5 h-5 animate-spin" />
                            ) : (
                                <Icon name="trash" className="w-5 h-5" />
                            )}
                        </button> */}
                    </div>

                    {originalFiles && originalFiles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                            {/* Files List */}
                            {originalFiles.map((file, index) => {
                                const isSelected = selectedFile === file?.name;
                                return (
                                    <div
                                        key={index}
                                        className={`p-2 border rounded flex items-center cursor-pointer transition ${isSelected
                                            ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'} hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                    // onClick={() => selectFile(file.key)}
                                    >
                                        <input
                                            type="radio"
                                            checked={isSelected}
                                            // onChange={() => selectFile(file.key)}
                                            onClick={e => e.stopPropagation()}
                                            className="form-radio mr-2 rounded-full border-gray-300 dark:border-gray-600"
                                        />
                                        <div className="flex items-center overflow-hidden">
                                            <Icon name="document-text" className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                            <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                                                {file.name}
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
                <div
                    className={`w-full md:w-1/2 flex flex-col h-full border-r dark:border-gray-700 relative ${isDragging ? 'border-2 border-dashed border-blue-500' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="p-3 border-b dark:border-gray-700 h-full flex flex-col justify-center items-center">
                        {pdfURL ? (
                            <div style={{ marginTop: '20px', width: '100%', height: '80vh' }}>
                                <embed
                                    src={pdfURL}
                                    type="application/pdf"
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <p className="text-lg">No PDF uploaded</p>
                                <p className="text-sm">Drag and drop a PDF file here or use the upload button</p>
                            </div>
                        )}
                    </div>

                    {pdfURL && (
                        <PDFViewer url={pdfURL} />
                    )}
                </div>

                <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto">
                    <div className="flex flex-col items-center justify-center h-full">
                        <ChatHeader
                            title="PII Analyzer Demo"
                            subtitle="Analyze documents for PII elements"
                            image=""
                            handlePrePromptClick={handlePrePromptClick}
                        />
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center mt-10 text-gray-500 dark:text-gray-400">
                                <Icon name="loader" className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                                <p>Analyzing document for PII...</p>
                            </div>
                        ) : piiVariables ? (
                            <div className="w-full max-w-3xl mt-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-semibold">PII Analysis Summary</h2>
                                </div>
                                <p className="text-sm mb-2">
                                    <span className="font-medium">File:</span> {piiVariables?.variables.fileName ?? "N/A"}
                                </p>
                                <p className={`text-sm font-medium ${piiVariables?.variables?.["PII.pii"] ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                    {piiVariables?.variables?.["PII.pii"] ? "PII detected" : "No PII detected"}
                                </p>
                                {piiVariables?.variables?.["PII.pii"] && (
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <h3 className="font-medium mb-1 text-gray-700 dark:text-gray-300">Detected PII Elements:</h3>
                                            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300">
                                                {piiVariables?.variables?.["PII.possiblePII"]?.map((pii, index) => (
                                                    <li key={index} className="mb-0.5">{pii}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1 text-gray-700 dark:text-gray-300">PII Types:</h3>
                                            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300">
                                                {piiVariables?.variables?.["PII.piiTypes"]?.map((type, index) => (
                                                    <li key={index} className="mb-0.5">{type}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Processed content:</h3>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={handleDownloadReport}
                                                disabled={isLoadingDownloadReport}
                                                className="flex items-center py-1 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-60"
                                            >
                                                {isLoadingDownloadReport ? (
                                                    <Icon name="loader" className="w-4 h-4 text-blue-500 animate-spin mr-2" />
                                                ) : (
                                                    <Icon name="document-chart-bar" className="w-4 h-4 text-blue-500 dark:text-blue-300 mr-1" />
                                                )}
                                                <span className="font-medium text-gray-500 dark:text-gray-300">Download PII Report</span>
                                            </button>

                                            <button
                                                onClick={handleDownloadPdf}
                                                disabled={isLoadingDownload}
                                                className="flex items-center py-1 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-60"
                                            >
                                                {isLoadingDownload ? (
                                                    <Icon name="loader" className="w-4 h-4 text-blue-500 animate-spin mr-2" />
                                                ) : (
                                                    <Icon name="document-text" className="w-4 h-4 text-blue-500 dark:text-blue-300 mr-1" />
                                                )}
                                                <span className="font-medium text-gray-500 dark:text-gray-300">Download Redacted</span>
                                            </button>
                                        </div>
                                    </div>

                                    {contentVisible && (
                                        <div className="pr-1 mt-2 text-xs text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="whitespace-pre-line">{answerText}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setContentVisible((prev) => !prev)}
                                        className="mt-2 text-blue-500 dark:text-blue-400 flex items-center gap-1 text-xs hover:underline"
                                    >
                                        <Icon
                                            name="chevron-down"
                                            className={`w-3 h-3 transition-transform ${contentVisible ? "rotate-180" : "rotate-0"}`}
                                        />
                                        <span>{contentVisible ? "Hide content" : "Show content"}</span>
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 mt-4">
                                Upload a file for PII analysis
                            </div>
                        )}
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
            </div>
        </section>
    );
};

export default PIIAnalyzerSFTPDemo;