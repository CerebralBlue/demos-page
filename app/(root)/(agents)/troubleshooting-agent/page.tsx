"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Icon from '@/components/Icon';
const TroubleshootingAgentPage: React.FC = () => {
    const [troubleshootProblem, setTroubleshootProblem] = useState('');
    const [troubleshootTried, setTroubleshootTried] = useState('');
    const [triedList, setTriedList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleAddTried = () => {
        if (troubleshootTried.trim()) {
            setTriedList([...triedList, troubleshootTried]);
            setTroubleshootTried('');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setResult(null);
        try {
            const response = await axios.post('/demos-page/api/proxy', {
                agent: 'troubleshoot_agent',
                params: {
                    troubleshoot_problem: troubleshootProblem,
                    troubleshoot_tried: triedList,
                },
            });
            setResult(response.data.answer);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResult('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="flex items-center space-x-3 w-full justify-center mb-10">
                <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
                <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">Troubleshooting Agent</h1>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Troubleshoot Problem</label>
                <p className="text-sm text-gray-500 mb-2">On this field you can describe your problem</p>
                <textarea
                    value={troubleshootProblem}
                    onChange={(e) => setTroubleshootProblem(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Things Tried</label>
                <p className="text-sm text-gray-500 mb-2">Write everything you've done to solve the problem, then press the button to add it to the list.</p>
                <div className="flex">
                    <input
                        type="text"
                        value={troubleshootTried}
                        onChange={(e) => setTroubleshootTried(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                        onClick={handleAddTried}
                        className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-2">
                    {triedList.map((item, index) => (
                        <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {item}
                            <button
                                onClick={() => {
                                    const newList = triedList.filter((_, i) => i !== index);
                                    setTriedList(newList);
                                }}
                                className="ml-2 text-red-500"
                            >
                                x
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Solve my problem
            </button>
            <div className="mt-4">
                {loading ? (
                    <div className="flex items-center">
                        <Icon name="loader" className="w-5 h-5 animate-spin" />
                        <span className="ml-2">Loading...</span>
                    </div>
                ) : (
                    result && <div className="mt-2 p-4 bg-gray-100 rounded-md">{result}</div>
                )}
            </div>
        </div>
    );
};

export default TroubleshootingAgentPage;