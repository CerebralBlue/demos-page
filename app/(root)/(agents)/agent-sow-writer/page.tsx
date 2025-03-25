"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Icon from '@/components/Icon';

const AgentSowWriterPage: React.FC = () => {
    const [projectName, setProjectName] = useState('');
    const [keywords, setKeywords] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ answer: string; generation: string; warningMessages: string[] }>({ answer: '', generation: '', warningMessages: [] });

    const handleFetch = async () => {
        setLoading(true);
        setResult({ answer: '', generation: '', warningMessages: [] });
        try {
            const response = await axios.post('/demos-page/api/proxy', {
                agent: "SOW_Agent",
                params: {
                    projectName: projectName,
                    keywords: keywords
                }
            });
            setResult(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResult({ answer: '', generation: '', warningMessages: [] });
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="p-6 w-70 mx-auto rounded-xl space-y-4">
        //     <div className="flex items-center space-x-3 w-full justify-center">
        //             <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
        //             <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">SOW Writer</h1>
        //         </div>
        //         <div className='w-1/2 m-auto'>

        //     <div className="space-y-2">
        //     <label className="block text-sm font-medium text-gray-700">
        //         Project Name:
        //         <input
        //         type="text"
        //         value={projectName}
        //         onChange={(e) => setProjectName(e.target.value)}
        //         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        //         />
        //     </label>
        //     </div>
        //     <div className="space-y-2">
        //     <label className="block text-sm font-medium text-gray-700">
        //         Keywords:
        //         <input
        //             type="text"
        //             value={keywords}
        //             onChange={(e) => setKeywords(e.target.value)}
        //             onKeyDown={(e) => {
        //                 if (e.key === 'Enter' && keywords.trim()) {
        //                     setKeywords((prev) => prev + (prev ? ', ' : '') + keywords.trim());
        //                     setKeywords('');
        //                     e.preventDefault();
        //                 }
        //             }}
        //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        //         />
        //     </label>
        //     <div className="flex flex-wrap mt-2">
        //         {keywords.split(', ').map((keyword, index) => (
        //             <span
        //                 key={index}
        //                 className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm mr-2 mb-2"
        //             >
        //                 {keyword}
        //             </span>
        //         ))}
        //     </div>
        //     </div>
        //     <button
        //     onClick={handleFetch}
        //     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        //     >
        //     Create SOW
        //     </button>
        //         </div>
        //     {loading ? (
        //     <div className="flex justify-center mt-4">
        //         <Icon name="loader" className="w-5 h-5 animate-spin" />
        //     </div>
        //     ) : (
        //     <div className="mt-4 p-4 bg-gray-100 rounded-md">
        //         {result.answer.split('\n').map((line, index) => {
        //             if (line.startsWith('Scopes:')) {
        //                 return <h2 key={index} className="text-xl font-bold mt-4">Scopes:</h2>;
        //             } else if (line.startsWith('Overview:')) {
        //                 return <h2 key={index} className="text-xl font-bold mt-4">Overview:</h2>;
        //             } else if (line.startsWith('Assumptions:')) {
        //                 return <h2 key={index} className="text-xl font-bold mt-4">Assumptions:</h2>;
        //             } else if (line.startsWith('Resources:')) {
        //                 return <h2 key={index} className="text-xl font-bold mt-4">Resources:</h2>;
        //             } else if (line.trim() === '') {
        //                 return <hr key={index} className="my-2" />;
        //             } else {
        //                 return (
        //                     <React.Fragment key={index}>
        //                         {line}
        //                         <br />
        //                     </React.Fragment>
        //                 );
        //             }
        //         })}
        //     </div>
        //     )}
        // </div>
        
        
        
        <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
                <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-12 h-12 mr-3" />
                <h1 className="text-3xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">SOW Writer</h1>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Project Name:
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 
                        bg-white dark:bg-gray-700 
                        text-gray-900 dark:text-gray-100 
                        border border-gray-300 dark:border-gray-600 
                        rounded-md shadow-sm 
                        focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 
                        focus:border-indigo-500 dark:focus:border-indigo-400 
                        sm:text-sm"
                        />
                    </label>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Keywords:
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && keywords.trim()) {
                                    setKeywords((prev) => prev + (prev ? ', ' : '') + keywords.trim());
                                    setKeywords('');
                                    e.preventDefault();
                                }
                            }}
                            className="mt-1 block w-full px-3 py-2 
                        bg-white dark:bg-gray-700 
                        text-gray-900 dark:text-gray-100 
                        border border-gray-300 dark:border-gray-600 
                        rounded-md shadow-sm 
                        focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 
                        focus:border-indigo-500 dark:focus:border-indigo-400 
                        sm:text-sm"
                        />
                    </label>
                    <div className="flex flex-wrap mt-2">
                        {keywords.split(', ').filter(keyword => keyword.trim()).map((keyword, index) => (
                            <span
                                key={index}
                                className="bg-indigo-100 dark:bg-indigo-800 
                            text-indigo-700 dark:text-indigo-200 
                            px-2 py-1 rounded-full text-sm mr-2 mb-2"
                            >
                                {keyword}
                                <button
                                    onClick={() => {
                                        const newKeywords = keywords.split(', ').filter(k => k !== keyword).join(', ');
                                        setKeywords(newKeywords);
                                    }}
                                    className="ml-1 text-indigo-500 dark:text-indigo-300 hover:text-red-500 dark:hover:text-red-400"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleFetch}
                    className="w-full flex justify-center py-2 px-4 
                bg-indigo-600 hover:bg-indigo-700 
                dark:bg-indigo-500 dark:hover:bg-indigo-600 
                text-white 
                rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                    Create SOW
                </button>
            </div>
            {loading ? (
                <div className="flex justify-center mt-4">
                    <Icon name="loader" className="w-5 h-5 animate-spin text-gray-700 dark:text-gray-300" />
                </div>
            ) : (
                result && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-gray-100">
                        {result.answer.split('\n').map((line, index) => {
                            if (line.startsWith('Scopes:')) {
                                return <h2 key={index} className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">Scopes:</h2>;
                            } else if (line.startsWith('Overview:')) {
                                return <h2 key={index} className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">Overview:</h2>;
                            } else if (line.startsWith('Assumptions:')) {
                                return <h2 key={index} className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">Assumptions:</h2>;
                            } else if (line.startsWith('Resources:')) {
                                return <h2 key={index} className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">Resources:</h2>;
                            } else if (line.trim() === '') {
                                return <hr key={index} className="my-2 border-gray-300 dark:border-gray-600" />;
                            } else {
                                return (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                );
                            }
                        })}
                    </div>
                )
            )}
        </div>
    );
};

export default AgentSowWriterPage;