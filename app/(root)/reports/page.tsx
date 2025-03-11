"use client";

import HeaderBox from '@/components/HeaderBox';
import React, { useEffect, useState } from 'react';
import ReportDetail from '../components/ReportDetail';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Icon from '@/components/Icon';
import { Report } from '@/types/report';

const Reports: React.FC = () => {
    const router = useRouter();
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get<{ success: boolean; data: Report[] }>('/api/reports');
                if (response.data.success) {
                    setReports(response.data.data);
                } else {
                    setError('Failed to fetch reports');
                }
            } catch (err) {
                setError('Error fetching reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox
                        type="greeting"
                        title="My 10K Reports"
                        subtext="Browse created 10K reports"
                    />
                </header>

                {loading ? (
                    <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-300">
                        <Icon name="loader" className="w-5 h-5 animate-spin text-blue-500" />
                        <p className="text-sm font-medium">Loading reports...</p>
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
                        <Icon name="document-missing" className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        <p className="text-lg font-semibold mt-2">No reports available</p>
                        <p className="text-sm">Try adding a new report to get started.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6 overflow-y-auto h-[90vh] md:h-[80vh] lg:h-[67vh]">

                        {reports.map((report) => (
                            <div
                                key={report._id}
                                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition flex flex-col gap-4 border border-gray-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
                                        <Icon name="char-bar" className="w-6 h-6 text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 cursor-pointer"
                                            title={report.file_name}
                                        >
                                            {report.file_name.length > 23 ? `${report.file_name.slice(0, 23)}...` : report.file_name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Updated:</span> {new Date(report.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">Version: {report?.versions?.length || 1}</p>
                                        <p className="text-sm text-gray-600">Characters: {report.content.length}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <div
                                        className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                        onClick={() => router.push(`/reports/${report._id}`)}
                                    >
                                        <Icon name="edit" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-500">Edit with AI</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <ReportDetail
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </section>
    );
};

export default Reports;

