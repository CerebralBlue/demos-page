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
import "./LlmCostAnalyzer.css";

interface NumericMetric {
  name: string;
  value: number;
}

interface SafetyMetric {
  name: string;
  value: string | number;
}


interface LLMPricing {
  input: number;
  cachedInput: number;
  output: number;
  batchInput?: number;
  batchOutput?: number;
}

interface LLMModel {
  pricing: LLMPricing;
  performance: NumericMetric[];
  cost: NumericMetric[];
  safety: SafetyMetric[];
}


const modelData: Record<string, LLMModel> = {
  "GPT-4.1": {
    pricing: { input: 2.0, cachedInput: 0.5, output: 8.0 },
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
  "GPT-4.1 mini": {
    pricing: { input: 0.4, cachedInput: 0.1, output: 1.6 },
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
  "GPT-4.1 nano": {
    pricing: { input: 0.1, cachedInput: 0.025, output: 0.4 },
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
  "Nova Micro": {
    pricing: {
      input: 0.000035 * 1000,      // 0.035
      cachedInput: 0.00000875 * 1000, // 0.00875
      output: 0.00014 * 1000,      // 0.14
      batchInput: 0.0000175 * 1000,   // 0.0175
      batchOutput: 0.00007 * 1000      // 0.07
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
  },
  "Nova Lite": {
    pricing: {
      input: 0.00006 * 1000,         // 0.06
      cachedInput: 0.000015 * 1000,  // 0.015
      output: 0.00024 * 1000,        // 0.24
      batchInput: 0.00003 * 1000,    // 0.03
      batchOutput: 0.00012 * 1000    // 0.12
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
  },
  "Nova Pro": {
    pricing: {
      input: 0.0008 * 1000,         // 0.8
      cachedInput: 0.0002 * 1000,   // 0.2
      output: 0.0032 * 1000,        // 3.2
      batchInput: 0.0004 * 1000,    // 0.4
      batchOutput: 0.0016 * 1000    // 1.6
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

const getSafetyScore = (val: string | number): number => {
  if (typeof val === "number") return Math.round(val * 10);
  const s = val.toString().toLowerCase();
  if (s.includes("yes") || s.includes("detected")) return 100;
  if (s.includes("some")) return 50;
  if (s.includes("none")) return 0;
  return 0;
};

export default function LlmPricingCal() {
  /** LEFT SIDE STATE */
  const [leftModel, setLeftModel] = useState<keyof typeof modelData>("GPT-4.1");
  const [leftTokensPerDay, setLeftTokensPerDay] = useState<number>(1_000_000);

  /** RIGHT SIDE STATE */
  const [rightModel, setRightModel] = useState<keyof typeof modelData>("Nova Micro");
  const [rightTokensPerDay, setRightTokensPerDay] = useState<number>(1_000_000);

  /** Shortcut to pricing */
  const leftP = modelData[leftModel].pricing;
  const rightP = modelData[rightModel].pricing;

  /** Average cost per 1M tokens */
  const leftAvg  = (leftP.input + leftP.output)  / 2;
  const rightAvg = (rightP.input + rightP.output) / 2;

  /** Daily cost = avg($/1M) * (tokens/day ÷ 1M) */
  const leftCostDay  = leftAvg  * (leftTokensPerDay  / 1_000_000);
  const rightCostDay = rightAvg * (rightTokensPerDay / 1_000_000);

  /** Radar chart data */
  const radarData = modelData[leftModel].performance.map((m, i) => ({
    metric: m.name,
    [leftModel]: m.value,
    [rightModel]: modelData[rightModel].performance[i].value
  }));

  /** Cost metrics + daily cost */
  const costData = modelData[leftModel].cost.map((c, i) => ({
    metric: c.name,
    [leftModel]: c.value,
    [rightModel]: modelData[rightModel].cost[i].value
  }));
  costData.push({
    metric: "Cost per Day",
    [leftModel]: leftCostDay,
    [rightModel]: rightCostDay
  });

  /** Safety table data */
  const safetyMetricsData = modelData[leftModel].safety.map((s, i) => ({
    name: s.name,
    leftScore:  getSafetyScore(s.value),
    rightScore: getSafetyScore(modelData[rightModel].safety[i].value)
  }));

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="animated-neon-title text-4xl font-extrabold text-center">
          LLM Cost Analyzer
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT CARD */}
          <div className="futuristic-panel">
            <h2 className="text-xl font-bold mb-4 text-center">Left LLM</h2>
            <label className="block font-medium mb-1">Model:</label>
            <select
              value={leftModel}
              onChange={e => setLeftModel(e.target.value as keyof typeof modelData)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              {Object.keys(modelData).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <label className="block font-medium mb-1">Estimated total tokens per day:</label>
            <input
              type="number"
              min={0}
              value={leftTokensPerDay}
              onChange={e => setLeftTokensPerDay(+e.target.value)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <div className="mt-2 text-sm text-center space-y-1">
              <p>Input: <strong>${leftP.input.toFixed(2)} / 1M tokens</strong></p>
              <p>Cached Input: <strong>${leftP.cachedInput.toFixed(2)} / 1M tokens</strong></p>
              <p>Output: <strong>${leftP.output.toFixed(2)} / 1M tokens</strong></p>
              <p>Cost/Day: <strong>${leftCostDay.toFixed(2)}</strong></p>
            </div>
          </div>

          {/* CENTER CARD */}
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
              onChange={e => setRightModel(e.target.value as keyof typeof modelData)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              {Object.keys(modelData).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <label className="block font-medium mb-1">Estimated total tokens per day:</label>
            <input
              type="number"
              min={0}
              value={rightTokensPerDay}
              onChange={e => setRightTokensPerDay(+e.target.value)}
              className="mb-4 w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <div className="mt-2 text-sm text-center space-y-1">
              <p>Input: <strong>${rightP.input.toFixed(2)} / 1M tokens</strong></p>
              <p>Cached Input: <strong>${rightP.cachedInput.toFixed(2)} / 1M tokens</strong></p>
              <p>Output: <strong>${rightP.output.toFixed(2)} / 1M tokens</strong></p>
              <p>Cost/Day: <strong>${rightCostDay.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>

        {/* Region disclaimer */}
        <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
          ℹ️ Prices based on US East (N. Virginia) region for the AWS Models.
        </div>

        {/* COST METRICS CHART */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4 text-center">Cost Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3D91F0" />
              <XAxis dataKey="metric" stroke="#3D91F0" />
              <YAxis stroke="#3D91F0" />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "none" }} itemStyle={{ color: "#3D91F0" }} />
              <Legend wrapperStyle={{ color: "#3D91F0" }} />
              <Bar dataKey={leftModel} fill="#3D91F0" />
              <Bar dataKey={rightModel} fill="#9D2FF9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SAFETY METRICS TABLE */}
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
              {safetyMetricsData.map(item => (
                <tr key={item.name} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-3 py-2 font-medium">{item.name}</td>
                  <td className="px-3 py-2">
                    <div className="progress-bar">
                      <div className="progress-left" style={{ width: `${item.leftScore}%` }} />
                    </div>
                    <span>{item.leftScore}%</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="progress-bar">
                      <div className="progress-right" style={{ width: `${item.rightScore}%` }} />
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
  );
}
