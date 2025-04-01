"use client";
import React, { useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Icon from "@/components/Icon";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

type ChartType = "line" | "bar" | "doughnut";

interface ChartProps<T extends ChartType> {
    type: T;
    data: ChartData<T>;
    options?: ChartOptions<T>;
}

const Chart = <T extends ChartType>({ type, data }: ChartProps<T>) => {
    const chartRef = useRef<any>(null);

    const handleDownload = () => {
        if (chartRef.current) {
            const chartInstance = chartRef.current;
            const url = chartInstance.toBase64Image();
            const link = document.createElement("a");
            link.href = url;
            link.download = "chart.png";
            link.click();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg text-center">
            <div className="flex justify-end gap-4">
                <a
                    onClick={() => { handleDownload(); }}
                    className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                    <Icon name="arrow-down-tray" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Download Chart</p>
                </a>
            </div>
            <div className={type === "doughnut" ? "w-72 h-72 mx-auto" : ""}>
                {type === "line" && <Line ref={chartRef} data={data as ChartData<"line">} />}
                {type === "bar" && <Bar ref={chartRef} data={data as ChartData<"bar">} />}
                {type === "doughnut" && <Doughnut ref={chartRef} data={data as ChartData<"doughnut">} />}
            </div>
        </div>
    );
};

export default Chart;
