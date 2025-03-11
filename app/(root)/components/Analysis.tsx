import { X } from 'lucide-react';
import React from 'react';
import Chart from './Chart';

interface AnalysisModalProps {
    content: string;
    onClose: () => void;
}

type ChartType = "line" | "bar" | "doughnut";

interface ChartContent {
    labels: string[];
    datasets: any[];
    type?: ChartType;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ content, onClose }) => {
    let parsedContent: ChartContent | null = null;
    let isJson = false;
    let chartType: ChartType | null = null;

    try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === "object" && parsed.labels && parsed.datasets) {
            parsedContent = parsed;
            isJson = true;
            chartType = parsed.type || "line";
        }
    } catch {
        isJson = false;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90vw] h-[85vh] min-w-[400px] min-h-[500px] max-w-6xl max-h-[90vh]">
                <div className="flex justify-between items-center border-b pb-2 mb-4 border-gray-300 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Analysis Agent Response
                    </h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[calc(85vh-80px-56px)] pr-2">
                    {isJson && parsedContent && chartType ? (
                        <Chart type={chartType} data={parsedContent} />
                    ) : (
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{content}</p>
                    )}
                </div>
            </div>
        </div>

    );
};
