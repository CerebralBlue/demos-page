"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from "recharts";
import "./LlmPricingCal.css";

interface LLMSizeData {
  size: string;
  minCost: number;
  maxCost: number;
}

interface NumericMetric {
  name: string;
  value: number;
}

interface SafetyMetric {
  name: string;
  value: string | number;
}

interface LLMModel {
  pricing: { [size: string]: LLMSizeData };
  performance: NumericMetric[];
  cost: NumericMetric[];
  safety: SafetyMetric[];
}

/** Data for GPT and NOVA */
const modelData: { [model: string]: LLMModel } = {
  GPT: {
    pricing: {
      S: { size: "S (Small)", minCost: 15, maxCost: 300 },
      M: { size: "M (Medium)", minCost: 300, maxCost: 750 },
      L: { size: "L (Large)", minCost: 750, maxCost: 2250 },
      XL: { size: "XL (Extra Large)", minCost: 2250, maxCost: 7500 }
    },
    performance: [
      { name: "BLEU Score", value: 42.5 },
      { name: "ROUGE Score", value: 58.2 },
      { name: "Response Time (ms)", value: 250 },
      { name: "Semantic Score", value: 87 }
    ],
    cost: [
      { name: "Token Efficiency", value: 1.25 },
      { name: "Usage Cost ($/1k tokens)", value: 0.002 }
    ],
    safety: [
      { name: "PII Detection", value: "Detected" },
      { name: "Hallucination", value: "Some" },
      { name: "Bias Score", value: 2.0 }
    ]
  },
  NOVA: {
    pricing: {
      S: { size: "S (Small)", minCost: 30, maxCost: 750 },
      M: { size: "M (Medium)", minCost: 750, maxCost: 2250 },
      L: { size: "L (Large)", minCost: 2250, maxCost: 9750 },
      XL: { size: "XL (Extra Large)", minCost: 9750, maxCost: 22500 }
    },
    performance: [
      { name: "BLEU Score", value: 45.7 },
      { name: "ROUGE Score", value: 62.3 },
      { name: "Response Time (ms)", value: 200 },
      { name: "Semantic Score", value: 92 }
    ],
    cost: [
      { name: "Token Efficiency", value: 1.1 },
      { name: "Usage Cost ($/1k tokens)", value: 0.0018 }
    ],
    safety: [
      { name: "PII Detection", value: "Yes" },
      { name: "Hallucination", value: "None" },
      { name: "Bias Score", value: 1.5 }
    ]
  }
};

/** Complexity multipliers for cost per day */
const complexityMultipliers: { [complexity: string]: number } = {
  Simple: 1.0,
  Moderate: 1.5,
  Complex: 2.0
};

/** Utility: Convert a safety metric (string/number) into a percentage score for display. */
const getSafetyScore = (val: string | number): number => {
  if (typeof val === "number") {
    return Math.round(val * 10); // For bias score, 2.0 becomes 20, etc.
  }
  const s = val.toString().toLowerCase();
  if (s.includes("yes") || s.includes("detected")) return 100;
  if (s.includes("some")) return 50;
  if (s.includes("none")) return 0;
  return 0;
};

export default function LlmPricingCal() {
  /** LEFT CARD States */
  const [leftModel, setLeftModel] = useState<keyof typeof modelData>("GPT");
  const [leftSize, setLeftSize] = useState<keyof LLMModel["pricing"]>("S");
  const [leftRunsPerDoc, setLeftRunsPerDoc] = useState<number>(1);
  const [leftRunsPerDay, setLeftRunsPerDay] = useState<number>(100);
  const [leftComplexity, setLeftComplexity] = useState<string>("Simple");

  /** RIGHT CARD States */
  const [rightModel, setRightModel] = useState<keyof typeof modelData>("NOVA");
  const [rightSize, setRightSize] = useState<keyof LLMModel["pricing"]>("S");
  const [rightRunsPerDoc, setRightRunsPerDoc] = useState<number>(1);
  const [rightRunsPerDay, setRightRunsPerDay] = useState<number>(100);
  const [rightComplexity, setRightComplexity] = useState<string>("Simple");

  /** Pricing Info */
  const leftInfo = modelData[leftModel].pricing[leftSize];
  const rightInfo = modelData[rightModel].pricing[rightSize];

  const leftMin = leftInfo.minCost;
  const leftMax = leftInfo.maxCost;
  const leftAvg = Math.round((leftMin + leftMax) / 2);

  const rightMin = rightInfo.minCost;
  const rightMax = rightInfo.maxCost;
  const rightAvg = Math.round((rightMin + rightMax) / 2);

  /** Daily cost calculations */
  const leftCostDay =
    leftAvg * leftRunsPerDoc * leftRunsPerDay * (complexityMultipliers[leftComplexity] || 1);
  const rightCostDay =
    rightAvg * rightRunsPerDoc * rightRunsPerDay * (complexityMultipliers[rightComplexity] || 1);

  /** Prepare Performance Data for Radar Chart */
  const radarData = modelData[leftModel].performance.map((leftMetric, idx) => {
    const rightMetric = modelData[rightModel].performance[idx];
    return {
      metric: leftMetric.name,
      [leftModel]: leftMetric.value,
      [rightModel]: rightMetric.value
    };
  });

  /** Prepare Cost Data for Bar Chart (append cost per day) */
  const leftCostMetrics = modelData[leftModel].cost;
  const rightCostMetrics = modelData[rightModel].cost;
  const costData = leftCostMetrics.map((leftItem, idx) => {
    const rightItem = rightCostMetrics[idx];
    return {
      metric: leftItem.name,
      [leftModel]: leftItem.value,
      [rightModel]: rightItem.value
    };
  });
  costData.push({
    metric: "Cost per Day",
    [leftModel]: leftCostDay,
    [rightModel]: rightCostDay
  });

  /** Prepare Safety Metrics Data with progress scores */
  const safetyMetricsData = modelData[leftModel].safety.map((leftItem, idx) => {
    const rightItem = modelData[rightModel].safety[idx];
    return {
      name: leftItem.name,
      leftScore: getSafetyScore(leftItem.value),
      rightScore: getSafetyScore(rightItem.value)
    };
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Animated Neon Title */}
        <h1 className="animated-neon-title text-4xl font-extrabold text-center">
        LLM Cost Analyzer
        </h1>

        {/* Grid with three columns: Left Card, Center Metrics, Right Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT CARD */}
          <div className="futuristic-panel">
            <h2 className="text-xl font-bold mb-4 text-center">Left LLM</h2>
            <label className="block font-medium mb-1">Model:</label>
            <select
              value={leftModel}
              onChange={(e) => setLeftModel(e.target.value as keyof typeof modelData)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="GPT">GPT</option>
              <option value="NOVA">NOVA</option>
            </select>
            <label className="block font-medium mb-1">Size:</label>
            <select
              value={leftSize}
              onChange={(e) => setLeftSize(e.target.value as keyof LLMModel["pricing"])}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="S">S (Small)</option>
              <option value="M">M (Medium)</option>
              <option value="L">L (Large)</option>
              <option value="XL">XL (Extra Large)</option>
            </select>
            <label className="block font-medium mb-1">LLM Runs per Document:</label>
            <input
              type="number"
              min={1}
              value={leftRunsPerDoc}
              onChange={(e) => setLeftRunsPerDoc(Number(e.target.value))}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <label className="block font-medium mb-1">Estimated LLM Runs per Day:</label>
            <input
              type="number"
              min={1}
              value={leftRunsPerDay}
              onChange={(e) => setLeftRunsPerDay(Number(e.target.value))}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <label className="block font-medium mb-1">Use Case Complexity:</label>
            <select
              value={leftComplexity}
              onChange={(e) => setLeftComplexity(e.target.value)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="Simple">Simple</option>
              <option value="Moderate">Moderate</option>
              <option value="Complex">Complex</option>
            </select>
            <div className="mt-2 text-sm text-center">
              Range: <strong>${leftMin}</strong> - <strong>${leftMax}</strong>
              <br />
              Cost/Day: <strong>${leftCostDay.toFixed(2)}</strong>
            </div>
          </div>

          {/* CENTER CARD - PERFORMANCE RADAR CHART */}
          <div className="futuristic-panel">
            <h2 className="text-xl font-bold mb-4 text-center">Performance Metrics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="metric" stroke="#A0AEC0" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#A0AEC0" />
                <Radar
                  name={leftModel}
                  dataKey={leftModel}
                  stroke="#3D91F0"
                  fill="#3D91F0"
                  fillOpacity={0.6}
                />
                <Radar
                  name={rightModel}
                  dataKey={rightModel}
                  stroke="#9D2FF9"
                  fill="#9D2FF9"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* RIGHT CARD */}
          <div className="futuristic-panel">
            <h2 className="text-xl font-bold mb-4 text-center">Right LLM</h2>
            <label className="block font-medium mb-1">Model:</label>
            <select
              value={rightModel}
              onChange={(e) => setRightModel(e.target.value as keyof typeof modelData)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="GPT">GPT</option>
              <option value="NOVA">NOVA</option>
            </select>
            <label className="block font-medium mb-1">Size:</label>
            <select
              value={rightSize}
              onChange={(e) => setRightSize(e.target.value as keyof LLMModel["pricing"])}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="S">S (Small)</option>
              <option value="M">M (Medium)</option>
              <option value="L">L (Large)</option>
              <option value="XL">XL (Extra Large)</option>
            </select>
            <label className="block font-medium mb-1">LLM Runs per Document:</label>
            <input
              type="number"
              min={1}
              value={rightRunsPerDoc}
              onChange={(e) => setRightRunsPerDoc(Number(e.target.value))}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <label className="block font-medium mb-1">Estimated LLM Runs per Day:</label>
            <input
              type="number"
              min={1}
              value={rightRunsPerDay}
              onChange={(e) => setRightRunsPerDay(Number(e.target.value))}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <label className="block font-medium mb-1">Use Case Complexity:</label>
            <select
              value={rightComplexity}
              onChange={(e) => setRightComplexity(e.target.value)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="Simple">Simple</option>
              <option value="Moderate">Moderate</option>
              <option value="Complex">Complex</option>
            </select>
            <div className="mt-2 text-sm text-center">
              Range: <strong>${rightMin}</strong> - <strong>${rightMax}</strong>
              <br />
              Cost/Day: <strong>${rightCostDay.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Additional Graphs Section */}
        <div className="space-y-8">
          {/* COST METRICS CHART */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">Cost Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D91F0" />
                <XAxis dataKey="metric" stroke="#3D91F0" />
                <YAxis stroke="#3D91F0" />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "none"
                  }}
                  itemStyle={{
                    color: "#3D91F0"
                  }}
                />
                <Legend wrapperStyle={{ color: "#3D91F0" }} />
                <Bar dataKey={leftModel} fill="#3D91F0" />
                <Bar dataKey={rightModel} fill="#9D2FF9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SAFETY METRICS REPRESENTATION */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">Safety Metrics</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="px-3 py-2 text-left">Metric</th>
                  <th className="px-3 py-2 text-left">Left</th>
                  <th className="px-3 py-2 text-left">Right</th>
                </tr>
              </thead>
              <tbody>
                {safetyMetricsData.map((item) => (
                  <tr key={item.name} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2 font-medium">{item.name}</td>
                    <td className="px-3 py-2">
                      <div className="progress-bar">
                        <div
                          className="progress-left"
                          style={{ width: `${item.leftScore}%` }}
                        ></div>
                      </div>
                      <span>{item.leftScore}%</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="progress-bar">
                        <div
                          className="progress-right"
                          style={{ width: `${item.rightScore}%` }}
                        ></div>
                      </div>
                      <span>{item.rightScore}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
