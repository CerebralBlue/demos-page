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
        <div className="p-6 w-70 mx-auto rounded-xl space-y-4">
            <div className="flex items-center space-x-3 w-full justify-center">
                    <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
                    <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">SOW Writer</h1>
                </div>
                <div className='w-1/2 m-auto'>

            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Project Name:
                <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </label>
            </div>
            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </label>
            <div className="flex flex-wrap mt-2">
                {keywords.split(', ').map((keyword, index) => (
                    <span
                        key={index}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                    >
                        {keyword}
                    </span>
                ))}
            </div>
            </div>
            <button
            onClick={handleFetch}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Create SOW
            </button>
                </div>
            {loading ? (
            <div className="flex justify-center mt-4">
                <Icon name="loader" className="w-5 h-5 animate-spin" />
            </div>
            ) : (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
                {result.answer.split('\n').map((line, index) => {
                    if (line.startsWith('Scopes:')) {
                        return <h2 key={index} className="text-xl font-bold mt-4">Scopes:</h2>;
                    } else if (line.startsWith('Overview:')) {
                        return <h2 key={index} className="text-xl font-bold mt-4">Overview:</h2>;
                    } else if (line.startsWith('Assumptions:')) {
                        return <h2 key={index} className="text-xl font-bold mt-4">Assumptions:</h2>;
                    } else if (line.startsWith('Resources:')) {
                        return <h2 key={index} className="text-xl font-bold mt-4">Resources:</h2>;
                    } else if (line.trim() === '') {
                        return <hr key={index} className="my-2" />;
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
            )}
        </div>
    );
};

export default AgentSowWriterPage;