import DoughnutChart from '@/components/DoughnutChart';
import { X } from 'lucide-react';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const ReportDetail = ({ report, onClose }: any) => {
    if (!report) return null;

    const transactionData = report.transactions.map((txn: any) => txn.total);

    const chartData = {
        labels: report.transactions.map((txn: any) => txn.transaction_id),
        datasets: [
            {
                label: 'Total Cost per Transaction',
                data: transactionData,
                backgroundColor: 'rgba(100, 100, 255, 0.6)',
                borderColor: 'rgba(100, 100, 255, 1)',
                borderWidth: 1,
            }
        ],
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">{report.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Render Chart */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Transaction Overview</h3>
                    <div className="mt-2">
                        <DoughnutChart accounts={[]} />
                    </div>
                </div>

                {/* Close Button */}
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="text-[#6A67CE] font-medium hover:underline">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;
