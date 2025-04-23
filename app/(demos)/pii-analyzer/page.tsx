"use client";
import React, { DragEvent, useState } from 'react';
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

const PIIAnalyzerDemo = () => {
    const [files, setFiles] = useState<File[]>([]);
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
            setFiles(prev => [...prev, ...newFiles]);

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
            formData.append("url_name", "staging-pii-detection-demo");

            // Use axios for upload
            const uploadResponse = await axios.post(urlUpload, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const uploadedFileName = uploadResponse.data.fn;

            if (uploadedFileName) {
                const maistroCallBody = {
                    url_name: "staging-pii-detection-demo",
                    agent: "remove-pii",
                    params: [
                        { name: "name", value: uploadedFileName },
                    ],
                    options: {
                        returnVariables: true,
                        returnVariablesExpanded: true,
                    },
                };
                const piiResponse = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const piiData = piiResponse.data;
                setPiiVariables(piiData);
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
            url_name: "staging-pii-detection-demo",
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
            url_name: "staging-pii-detection-demo",
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

    return (
        <section className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white">
            <div className="flex flex-col md:flex-row h-full w-full gap-4">
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

export default PIIAnalyzerDemo;