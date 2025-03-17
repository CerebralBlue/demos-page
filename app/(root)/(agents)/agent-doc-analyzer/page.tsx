"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Icon from '@/components/Icon';
const DocAnalyzerAgent = () => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [response, setResponse] = useState<{ answer: string; generation: boolean; warningMessages: string[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = () => {
                handleFileUpload(file.name, file);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid .csv file.');
        }
    };
    const exploreUpload = async (name: any, file: any) => {
        try {
            const form = new FormData();
            if (name) {
                form.append('file', file, name);
            } else {
                console.error('File name is null');
            }
            const remoteResponse = await axios.post("https://stagingconsoleapi.neuralseek.com/NS-ES-V2/exploreUpload", form, {
                headers: {
                    'accept': 'application/json',
                    'apikey': "e907252c-a14c702d-a0ae2b3b-490872cd" // Replace with your API key
                }
            });
            summarize(remoteResponse.data.fn);
        } catch (error) {
            console.error('Error posting to remote server:', error);
        }
    }

    const summarize = async (name: string) => {
        try {
            const response = await fetch('/demos-page/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agent: "summarize_agent",
                    params: {
                        filename: name
                    }
                }),
            });

            const data = await response.json();
            setResponse(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };





    const handleFileUpload = async (filename: string, file: File) => {
        setFileName(filename);
        exploreUpload(filename, file);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                e.target?.result;
                handleFileUpload(file.name, file);
            };
            reader.readAsText(file);
        } else {

        }
    };
    return (
        <div className="grid grid-cols-1 gap-8 w-full items-center justify-center margin-auto mt-5 ">
            <div className='w-1/2 m-auto'>

                <div className="flex items-center space-x-3 w-full justify-center">
                    <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
                    <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">Doc Analyzer</h1>
                </div>
                <div id="upload_section">
                    <br />
                    <div
                        className="border-2 border-dashed border-black p-12 rounded-lg cursor-pointer flex items-center justify-center hover:bg-blue-100 dark:bg-blue-900 border border-blue-500 opacity-80 backdrop-blur-sm"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={(e) => e.currentTarget.classList.add('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-500', 'opacity-80', 'backdrop-blur-sm', 'pointer-events-none')}
                        onDragLeave={(e) => e.currentTarget.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-500', 'opacity-80', 'backdrop-blur-sm', 'pointer-events-none')}
                    >
                        {fileName ? (
                            <span className="text-lg">Selected File: {fileName}</span>
                        ) : (
                            <span className="text-lg">Drag & drop your .csv, .pdf, .doc, .txt, or docx file here or click to upload</span>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                {fileName && !response && (
                    <div className="mt-8 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <div className="loader">
                            <Icon name="loader" className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                )}
                {response && (
                    <div className="mt-8 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                        <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
                        <pre className="whitespace-pre-wrap">{response.answer}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};


export default DocAnalyzerAgent;
