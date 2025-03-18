"use client";

import HeaderBox from '@/components/HeaderBox';
import Icon from "@/components/Icon";
import React, { useState, useEffect } from 'react';
import { IntegrationDetailModal } from '../components/IntegrationDetail';
import axios from 'axios';
import { Ingestion } from '@/types/ingestion';
import { DataSource } from '@/types/data.source';
import { headers } from '@/constants';

const Ingestions = () => {

    const [loadingIngestions, setLoadingIngestions] = useState<boolean>(true);
    const [ingestions, setIngestions] = useState<Ingestion[]>([]);
    const [selectedIngestion, setSelectedIngestion] = useState<Ingestion | null>(null);

    const [loadingDataSources, setLoadingDataSources] = useState<boolean>(true);
    const [dataSources, setDataSources] = useState<DataSource[]>([]);

    const [fetchLoading, setFetchLoading] = useState<{ [key: string]: boolean }>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = `${baseUrl}/ingestions`;
        axios.get(url)
            .then((response) => {
                if (response.data.success) {
                    setIngestions(response.data.data);
                } else {
                    setError("Failed to load ingestions.");
                }
            })
            .catch((error) => setError("Error fetching ingestions: " + error.message))
            .finally(() => setLoadingIngestions(false));
    }, []);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = `${baseUrl}/data-sources`;
        axios.get(url)
            .then((response) => {
                if (response.data.success) {
                    setDataSources(response.data.data);
                } else {
                    setError("Failed to load data sources.");
                }
            })
            .catch((error) => setError("Error fetching data sources: " + error.message))
            .finally(() => setLoadingDataSources(false));
    }, []);

    const handleUpdateData = async (source_id: string, year: string) => {
        setFetchLoading((prev) => ({ ...prev, [source_id]: true }));
        try {
            const maistroCallBody = {
                agent: "get_bank_data_by_year",
                params: [{ name: "year", value: year }],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };

            const responseIngestion = await axios.post(
                "https://stagingapi.neuralseek.com/v1/SEC-demo/maistro",
                maistroCallBody,
                { headers }
            );

            // Ensure Maistro response has valid data before updating the database
            if (!responseIngestion.data || Object.keys(responseIngestion.data).length === 0) {
                throw new Error("Maistro returned empty data");
            }

            const { answer } = responseIngestion.data;

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const url = `${baseUrl}/data-sources`;

            // Call API to update the database
            const updateResponse = await axios.put(url, {
                id: source_id,
                data: answer
            });

            console.log(updateResponse)
        } catch (error) {
            console.error("Error updating data:", error);
        } finally {
            setFetchLoading((prev) => ({ ...prev, [source_id]: false }));
        }
    };

    return (
        <div>
            <section className="home bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <div className="home-content">
                    <header className="home-header">
                        <HeaderBox type="greeting" title="My Ingestions" subtext="Browse ingested documents" />
                    </header>

                    {loadingIngestions ? (
                        <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                            <Icon name="loader" className="w-5 h-5 animate-spin text-blue-500 dark:text-blue-400" />
                            <p className="text-sm font-medium">Loading ingestions...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
                    ) : ingestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <Icon name="document-missing" className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                            <p className="text-lg font-semibold mt-2">No ingestions available</p>
                            <p className="text-sm">Try adding a new ingestion to get started.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6 overflow-y-auto h-[40vh] md:h-[30vh] lg:h-[20vh]">
                            {ingestions.map((ingestion) => (
                                <div
                                    key={ingestion._id}
                                    className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col gap-4 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                            <Icon name="chat-bubble-bottom-center-text" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div className="flex-1">
                                            <h3
                                                className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate w-[150px] cursor-pointer"
                                                title={ingestion.file_name}
                                            >
                                                {ingestion.file_name.length > 15 ? `${ingestion.file_name.slice(0, 15)}...` : ingestion.file_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Updated:</span> {new Date(ingestion.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <div
                                            className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                        >
                                            <Icon name="eye" className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                View data
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <IntegrationDetailModal integration={selectedIngestion} onClose={() => setSelectedIngestion(null)} />
            </section>

            <section className="home bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <div className="home-content">
                    <header className="home-header">
                        <HeaderBox type="greeting" title="My Data Sources" subtext="Browse connected data sources" />
                    </header>
                    {loadingDataSources ? (
                        <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                            <Icon name="loader" className="w-5 h-5 animate-spin text-blue-500 dark:text-blue-400" />
                            <p className="text-sm font-medium">Loading data sources...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
                    ) : ingestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <Icon name="document-missing" className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                            <p className="text-lg font-semibold mt-2">No data sources available</p>
                            <p className="text-sm">Try adding a new data source to get started.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6 overflow-y-auto h-[50vh] md:h-[40vh] lg:h-[30vh]">
                            {dataSources.map((dataSource) => (
                                <div
                                    key={dataSource._id}
                                    className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col gap-4 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                            <Icon name='document' className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div className="flex-1">
                                            <h3
                                                className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate w-[150px] cursor-pointer"
                                                title={dataSource.source_name}
                                            >
                                                {dataSource.source_name.length > 15 ? `${dataSource.source_name.slice(0, 15)}...` : dataSource.source_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Period:</span> {dataSource.year}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Updated:</span> {new Date(dataSource.lastUpdated).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <div
                                            className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                        >
                                            <Icon name="eye" className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                View data
                                            </p>
                                        </div>
                                        <div
                                            className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                            onClick={() => { handleUpdateData(dataSource._id, dataSource.year) }}
                                        >
                                            <Icon name="loader" className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                {fetchLoading[dataSource._id] ? "Updating..." : "Update data"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Ingestions;
