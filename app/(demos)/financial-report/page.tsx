'use client';

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from 'chart.js';
import clsx from 'clsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const trendsData = {
    labels: Array.from({ length: 60 }, (_, i) => `${i + 1}`),
    datasets: [
        {
            label: 'Tasks',
            data: Array(60).fill(1),
            backgroundColor: (ctx: any) => {
                const i = ctx.dataIndex;
                if (i < 10) return '#a3bffa'; // early
                if (i < 40) return '#7f9cf5'; // late
                return '#5a67d8'; // on-time
            },
        },
    ],
};

const alertsData = {
    labels: ['09/21', '09/24', '09/26', '10/05', '10/06', '10/07', '10/09', '10/11', '10/14'],
    datasets: [
        {
            label: 'Alerts',
            data: [165, 108, 66, 71, 32, 64, 97, 43, 19],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            tension: 0.3,
        },
    ],
};

export default function FinancialReport() {
    const handleNewAssessment = () => {
        const id = uuidv4();
        router.push(`/financial-report/${id}`);
    };
    const router = useRouter();
    return (
        <main className="min-h-screen bg-gray-100 text-gray-800 p-6 space-y-6">
            {/* Header */}
            <img src="logo_kyc.png" alt="Company Logo" className="h-20" />
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Customer Assessment Agent</h1>
                    <p className="text-sm text-gray-600">
                        Status of onboarding assessments and ongoing monitoring of alerts along with status by region and time period. Start a new assessment.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow" onClick={handleNewAssessment}>
                        New Assessment
                    </button>
                    {/* <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                        <img src="/avatar.jpg" alt="User" className="object-cover w-full h-full" />
                    </div> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <select className="p-2 border border-gray-300 rounded-md">
                    <option>All Regions</option>
                </select>
                <select className="p-2 border border-gray-300 rounded-md">
                    <option>30 Days</option>
                </select>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overview */}
                <section className="bg-white p-4 rounded-md shadow space-y-4">
                    <h2 className="text-xl font-semibold">Overview</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 border rounded text-center">
                            <div className="text-sm text-gray-500">Total Open / Closed</div>
                            <div className="text-2xl font-bold">6 / 89</div>
                            <a href="#" className="text-blue-500 text-sm">View All</a>
                        </div>
                        <div className="p-4 border rounded text-center">
                            <div className="text-sm text-gray-500">Average Time Open</div>
                            <div className="text-2xl font-bold">3.1</div>
                            <div className="text-sm">Days</div>
                        </div>
                        <div className="p-4 border rounded text-center">
                            <div className="text-sm text-gray-500">Percent Late</div>
                            <div className="text-2xl font-bold">23%</div>
                        </div>
                    </div>

                    <table className="w-full text-sm border-t mt-4">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Entity Name</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Next Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: '2472791', name: 'Avaya Inc.', status: 'yellow', action: '2 Flags in investigation' },
                                { id: '3232406', name: 'Brown Inc', status: 'green', action: 'On track' },
                                { id: '3177968', name: 'Rasmussen Group', status: 'red', action: 'On track' },
                                { id: '6692466', name: 'Stanley Group', status: 'yellow', action: '1 Flag under review' },
                                { id: '8992480', name: 'Synergy, Inc.', status: 'green', action: 'On track' },
                            ].map((row, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-2">{row.id}</td>
                                    <td className="p-2">{row.name}</td>
                                    <td className="p-2">
                                        <span
                                            className={clsx(
                                                'w-3 h-3 rounded-full inline-block',
                                                row.status === 'green' && 'bg-green-500',
                                                row.status === 'yellow' && 'bg-yellow-400',
                                                row.status === 'red' && 'bg-red-500'
                                            )}
                                        />
                                    </td>
                                    <td className="p-2">{row.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Trends & Alerts */}
                <section className="space-y-6">
                    <div className="bg-white p-4 rounded-md shadow">
                        <h2 className="text-xl font-semibold mb-2">Trends</h2>
                        <p className="text-sm text-gray-500 mb-4">Click graph to view specific tasks</p>
                        <Bar data={trendsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                        <div className="flex justify-between text-xs mt-2 text-center">
                            <span className="text-blue-300">Early</span>
                            <span className="text-blue-400">Late</span>
                            <span className="text-blue-600">On-Time</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-md shadow">
                        <h2 className="text-xl font-semibold mb-2">Alerts</h2>
                        <p className="text-sm text-gray-500 mb-2">(adverse media, reviews, negative c-suite posts)</p>
                        <Line data={alertsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </section>
            </div>
        </main>
    );
}

