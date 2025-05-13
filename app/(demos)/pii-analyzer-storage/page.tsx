"use client";
import React, { DragEvent, useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import axios from "axios";
import dynamic from 'next/dynamic';
import HeaderBox from '@/components/HeaderBox';

const PDFViewer = dynamic(
    () => import('../../components/PDFViewer'),
    { ssr: false }
);

const PIIAnalyzerDemoStorage = () => {

    const [selectedStorage, setSelectedStorage] = useState("sftp");

    const [s3Disabled, setS3Disabled] = useState(true);
    const [boxDisabled, setBoxDisabled] = useState(true);

    const [originalFiles, setOriginalFiles] = useState<File[]>([]);
    const [piiFiles, setPiiFiles] = useState<File[]>([]);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [pdfURL, setPdfURL] = useState<string | null>(null);
    const fileCache: { [key: string]: Blob } = {};

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    const [loadingFile, setLoadingFile] = useState<string | null>(null);

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
        setIsLoading(true);

        const droppedFiles = e.dataTransfer.files;
        if (!droppedFiles || droppedFiles.length === 0) return;

        const filesArray = Array.from(droppedFiles);

        // Optionally set the preview for the first PDF file
        const firstPdf = filesArray.find(file => file.type === 'application/pdf');
        if (firstPdf) {
            const fileURL = URL.createObjectURL(firstPdf);
            setPdfURL(fileURL);
        }

        // Upload and process each file
        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            console.log(`Uploading file ${i + 1} of ${filesArray.length}: ${file.name}`);

            try {
                await uploadAndProcessFile(file);
                console.log(`Successfully uploaded ${file.name}`);
            } catch (error) {
                console.error(`Failed to upload ${file.name}`, error);
            }
        }
        setIsLoading(false);

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
                writeSftp.data.answer;

                // const piiData = piiResponse.data;
                // setPiiVariables(piiData);
                // const uploadReponse = writeSftp.data.answer;
                // console.log("Upload response:", uploadReponse);

                // Re fetch
                fetchFilesByPath("/files/original-files");
            }

        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
        } finally {
            setIsLoading(false);
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
        fetchFilesByPath("/files/original-files");
        fetchFilesByPath("/files/pii-files");
    }, []);

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

    const handleAnalysis = async () => {
        setIsLoadingAnalysis(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            const maistroCallBody = {
                url_name: "staging-sftp-pii-demo",
                agent: "apply_pii",
                params: [],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };
            await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            await fetchFilesByPath("/files/pii-files");
            setIsLoadingAnalysis(false);

        } catch (err) {
            console.error("Error fetching files:", err);
            setIsLoadingAnalysis(false);
        }
    };

    const handleDownload = async (fileName: string, triggerBrowserDownload = true) => {
        try {
            const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const downloadFileName = safeFileName.replace('-redacted.pdf', '.pdf');

            if (fileCache[safeFileName]) {
                const blob = fileCache[safeFileName];
                const url = window.URL.createObjectURL(blob);
                if (triggerBrowserDownload) triggerDownload(url, downloadFileName);
                return blob;
            }

            const fileUrl = `https://stagingconsoleapi.neuralseek.com/sftp-pii/maistro/octet-stream/${safeFileName}`;

            const response = await axios.get(fileUrl, {
                responseType: 'blob',
                headers: {
                    'accept': '*/*',
                    'apikey': '1e971fcb-13812f6b-f1b3b9e5-1c093699',
                    'Content-Type': 'application/json',
                },
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            fileCache[safeFileName] = blob;

            const url = window.URL.createObjectURL(blob);
            if (triggerBrowserDownload) triggerDownload(url, downloadFileName);

            return blob;
        } catch (err) {
            console.error('Error fetching file:', err);
            throw err;
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

    const handleViewOriginalPdf = async (fileName: string) => {
        try {
            const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

            let blob = fileCache[safeFileName];

            if (!blob) {
                const fileUrl = `https://stagingconsoleapi.neuralseek.com/sftp-pii/maistro/octet-stream/${fileName}`;

                const response = await axios.get(fileUrl, {
                    responseType: 'blob',
                    headers: {
                        'accept': '*/*',
                        'apikey': '1e971fcb-13812f6b-f1b3b9e5-1c093699',
                        'Content-Type': 'application/json',
                    },
                });

                blob = new Blob([response.data], { type: 'application/pdf' });
                fileCache[safeFileName] = blob;
            }

            const pdfUrl = window.URL.createObjectURL(blob);
            setPdfURL(pdfUrl);
            setSelectedFile(fileName);
        } catch (err) {
            console.error('Error viewing file:', err);
        }
    };

    const handleViewPdf = async (fileName: string) => {
        setLoadingFile(fileName);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlCreatePdf = `${baseUrl}/create-pdf`;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;

            let maistroAgentName;
            if (fileName.includes("-redacted.pdf")) {
                maistroAgentName = "create_pii_redacted_html";
            } else if (fileName.includes("-pii.pdf")) {
                maistroAgentName = "create_pii_report_html";
            }

            const maistroCallBody = {
                url_name: "staging-sftp-pii-demo",
                agent: maistroAgentName,
                params: [
                    { name: "fileName", value: fileName }
                ],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };

            try {
                const piiResponse = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const htmlContent = piiResponse.data.answer;

                const pdfResponse = await axios.post(urlCreatePdf, { html: htmlContent }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob',
                });

                //Create blob URL
                const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
                const urlFile = window.URL.createObjectURL(blob);

                //Set the state and open the viewer
                setPdfURL(urlFile);

                // OR open in new tab
                // window.open(urlFile, '_blank');

                // Optional: trigger download
                // const a = document.createElement('a');
                // a.href = urlFile;
                // a.download = 'redacted_document.pdf';
                // document.body.appendChild(a);
                // a.click();
                // a.remove();
                // window.URL.revokeObjectURL(urlFile); // Don't revoke if still viewing

            } catch (error: any) {
                if (error.response) {
                    console.error('Maistro Error Response:', error.response.data);
                } else {
                    console.error('Unknown Maistro Error:', error);
                }
            } finally {
                setLoadingFile(null);
            }
        } catch (err) {
            console.error('Error viewing file:', err);
            setLoadingFile(null);
        }
    };

    return (
        <section className="flex flex-col w-full dark:bg-gray-900 dark:text-white">
            <div className="flex flex-col md:flex-row w-full gap-4">
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="border-b dark:border-gray-700 p-3">
                        <div className="mb-3 flex flex-col space-y-4">
                            <header className='home-header'>
                                <HeaderBox
                                    type="greeting"
                                    title="PIPA Redaction Files"
                                    subtext="Browse storage files"
                                />
                            </header>
                            <div className="flex flex-wrap items-center gap-2">
                                <a
                                    onClick={() => setSelectedStorage("sftp")}
                                    className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer ${selectedStorage === "sftp"
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                                        }`}
                                >
                                    <svg
                                        className={`w-5 h-5 ${selectedStorage === "sftp" ? "text-white" : "text-blue-500 dark:text-blue-300"} mr-2`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                                        <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                        <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                    </svg>
                                    <p
                                        className={`text-sm font-semibold ${selectedStorage === "sftp" ? "text-white" : "text-gray-500 dark:text-gray-300"
                                            }`}
                                    >
                                        SFTP
                                    </p>
                                </a>

                                <a
                                    onClick={() => !s3Disabled && setSelectedStorage("s3")}
                                    className={`flex items-center py-1 px-3 border rounded-full transition ${s3Disabled
                                        ? "cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                        : selectedStorage === "s3"
                                            ? "cursor-pointer bg-blue-500 text-white border-blue-500"
                                            : "cursor-pointer border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                                        }`}
                                >
                                    <div className="w-5 h-5 mr-2 bg-gray-200 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-600">S3</span>
                                    </div>
                                    <p
                                        className={`text-sm font-semibold ${s3Disabled
                                            ? "text-gray-400 dark:text-gray-500"
                                            : selectedStorage === "s3"
                                                ? "text-white"
                                                : "text-gray-500 dark:text-gray-300"
                                            }`}
                                    >
                                        AWS S3
                                    </p>
                                </a>

                                <a
                                    onClick={() => !boxDisabled && setSelectedStorage("box")}
                                    className={`flex items-center py-1 px-3 border rounded-full transition ${boxDisabled
                                        ? "cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                        : selectedStorage === "box"
                                            ? "cursor-pointer bg-blue-500 text-white border-blue-500"
                                            : "cursor-pointer border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                                        }`}
                                >
                                    <div className="w-5 h-5 mr-2 bg-blue-100 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600">B</span>
                                    </div>
                                    <p
                                        className={`text-sm font-semibold ${boxDisabled
                                            ? "text-gray-400 dark:text-gray-500"
                                            : selectedStorage === "box"
                                                ? "text-white"
                                                : "text-gray-500 dark:text-gray-300"
                                            }`}
                                    >
                                        Box
                                    </p>
                                </a>

                                <a
                                    onClick={() => {
                                        if (!isLoadingAnalysis && piiFiles.length === 0) {
                                            handleAnalysis();
                                            console.log(`Analyzing ${selectedStorage} files`);
                                        }
                                    }}
                                    className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer 
    ${(piiFiles.length > 0 || originalFiles.length == 0 || isLoadingAnalysis)
                                            ? 'bg-gray-400 border-gray-400 pointer-events-none opacity-50'
                                            : 'bg-green-600 hover:bg-green-700 text-white border-green-600'}
  `}
                                >
                                    <svg
                                        className="w-5 h-5 text-white mr-2"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                    <p className="text-sm font-semibold text-white">
                                        Run PII Analysis
                                    </p>
                                </a>


                                {isLoading || isLoadingAnalysis && (
                                    <svg
                                        className="animate-spin ml-1 h-4 w-4 text-green-600 dark:text-green-400"
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
                            </div>

                        </div>

                        <div className="h-64 flex flex-col">
                            <div className="grid grid-cols-2 gap-4 flex-1">

                                {/* Original Files Column */}
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-medium mb-1">Original Files</h4>
                                    {originalFiles && originalFiles.length > 0 ? (
                                        <div className="overflow-y-auto border rounded bg-white dark:bg-gray-900 h-64">
                                            <div className="grid grid-cols-1 gap-2 p-2">
                                                {originalFiles.map((file, index) => {
                                                    const isSelected = selectedFile === file?.name;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`p-2 border rounded flex center justify-between cursor-pointer transition ${isSelected
                                                                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40'
                                                                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                                                } hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                                            onClick={() => selectFile(file.name)}
                                                        >
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
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded border">
                                            <div>
                                                <Icon name="inbox" className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-sm">No original files uploaded</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* PII Files Column */}
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-medium mb-1">PII Analyzed Files</h4>
                                    {piiFiles && piiFiles.length > 0 ? (
                                        <div className="overflow-y-auto border rounded bg-white dark:bg-gray-900 h-64">
                                            <div className="grid grid-cols-1 gap-2 p-2">
                                                {piiFiles.map((file, index) => {
                                                    const isSelected = selectedFile === file?.name;
                                                    const isThisLoading = loadingFile === file.name;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`p-2 border rounded flex items-center justify-between cursor-pointer transition ${isSelected
                                                                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40'
                                                                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                                                } hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                                            onClick={() => selectFile(file.name)}
                                                        >
                                                            <div className="flex items-center overflow-hidden">
                                                                <Icon name="document-text" className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                                                <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                                                                    {file.name}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewPdf(file.name);
                                                                    }}
                                                                    className="text-green-600 dark:text-green-400 hover:underline text-xs flex items-center"
                                                                    title="View"
                                                                    disabled={isThisLoading}
                                                                >
                                                                    View
                                                                    {isThisLoading && (
                                                                        <svg
                                                                            className="animate-spin ml-1 h-4 w-4 text-green-600 dark:text-green-400"
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
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded border">
                                            <div>
                                                <Icon name="inbox" className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-sm">No files processed</p>

                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <div
                        className={`w-full border-r dark:border-gray-700 relative ${isDragging ? 'border-2 border-dashed border-blue-500' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="p-3 border-b dark:border-gray-700 h-[80vh] flex flex-col justify-center items-center">
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
                                    <p className="text-lg">No selected PDF</p>
                                    <p className="text-sm">Drag and drop a PDF file here or view the existing ones</p>
                                </div>
                            )}
                        </div>

                        {pdfURL && (
                            <PDFViewer url={pdfURL} />
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

export default PIIAnalyzerDemoStorage;