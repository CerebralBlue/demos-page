"use client";
import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import HeaderBox from "@/components/HeaderBox";

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const Charts = () => {
    // Line Chart Data
    const lineData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Net interest income",
                data: [55237, 47229],
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                tension: 0.4,
            }
        ],
    };

    // Bar Chart Data
    const barData = {
        labels: ["Product A", "Product B", "Product C", "Product D"],
        datasets: [
            {
                label: "Sales",
                data: [300, 500, 400, 700],
                backgroundColor: ["#FF5733", "#33B5E5", "#FFC107", "#8E44AD"],
            },
        ],
    };

    // Doughnut Chart Data
    const doughnutData = {
        labels: ["Marketing", "Development", "Sales", "Support"],
        datasets: [
            {
                data: [25, 40, 20, 15],
                backgroundColor: ["#F44336", "#2196F3", "#FF9800", "#4CAF50"],
                hoverOffset: 6,
            },
        ],
    };

    return (
        <section className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <HeaderBox type="greeting" title="My Charts" subtext="A showcase of cool charts using Chart.js" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Line Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-2">Revenue Trend</h2>
                        <Line data={lineData} />
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-2">Product Sales</h2>
                        <Bar data={barData} />
                    </div>
                </div>

                {/* Smaller Doughnut Chart */}
                <div className="bg-white p-4 rounded-lg shadow-lg mt-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Budget Allocation</h2>
                    <div className="w-72 h-72">
                        <Doughnut data={doughnutData} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Charts;
