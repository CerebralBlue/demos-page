import Icon from '@/components/Icon';
import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { Search, X } from 'lucide-react';

const IngestionsList: React.FC = () => {
    // const [files, setFiles] = useState<File[]>([]);
    // const [ingestProgress, setIngestProgress] = useState<{ [key: string]: number }>({});

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [ingestions, setIngestions] = useState<{ id: string, key: string, file_name: string, data: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectFile = (fileName: string) => {
        // If already selected, deselect it
        if (selectedFile === fileName) {
            setSelectedFile(null);
        } else {
            setSelectedFile(fileName);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    // Filter ingestions based on search term
    const filteredIngestions = useMemo(() => {
        if (!searchTerm.trim()) {
            return ingestions;
        }
        return ingestions.filter(file => 
            file.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (file.file_name && file.file_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [ingestions, searchTerm]);

    const fetchIngestions = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            const maistroCallBody = {
                url_name: "prod-admed-demo",
                agent: "query_aggregated_kb_docs",
                params: [],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };
            const serviceResponse = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const uniqueFiles = JSON.parse(serviceResponse.data.answer);
            setIngestions(uniqueFiles.aggregations.unique_names.buckets);

        } catch (err) {
            console.error("Error fetching ingestions:", err);
        }
    };

    useEffect(() => {
        fetchIngestions();
    }, []);

    return (
        <div className="p-3 border-b dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Watsonx Discovery Ingested Files
                </div>
                <button
                    // onClick={handleClean}
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

            {/* Search Filter */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search ingested files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                )}
            </div>

            {filteredIngestions && filteredIngestions.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {/* Files List */}
                    {filteredIngestions.map((file, index) => {
                        const isSelected = selectedFile === file.key;
                        return (
                            <div
                                key={index}
                                className={`p-2 border rounded flex items-center cursor-pointer transition ${isSelected
                                    ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/40' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'} hover:bg-blue-100 dark:hover:bg-blue-800/40`}
                                onClick={() => selectFile(file.key)}
                            >
                                {/* <input
                                    type="radio"
                                    checked={isSelected}
                                    onChange={() => selectFile(file.key)}
                                    onClick={e => e.stopPropagation()}
                                    className="form-radio mr-2 rounded-full border-gray-300 dark:border-gray-600"
                                /> */}
                                <div className="flex items-center overflow-hidden">
                                    <Icon name="document-text" className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                    <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                                        {file.key}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded">
                    <Icon name="inbox" className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">
                        {searchTerm ? `No files found matching "${searchTerm}"` : "No ingested files"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default IngestionsList;