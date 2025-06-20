// src/components/CompanyAssessmentFlow.tsx
"use client";

import React, { useState } from "react";
import Stepper from '../../(root)/components/Stepper';
import axios from "axios";
import Icon from '@/components/Icon';

interface CompanyData {
  duns: string;
  company_name: string;
}

interface APIDetail {
  id: string;
  title: string;
  content: string;
}

const dummyItems = [
  { id: "Adverse_Media_Flag", label: "Adverse media" },
  { id: "Business_Status", label: "Business status" },
  { id: "Sanctions_Flag", label: "Sanctions" },
];


const CompanyAssessmentFlow = () => {
  const [companySummary, setCompanySummary] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [companyQuery, setCompanyQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reportDetails, setReportDetails] = useState<APIDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [fullCompanyData, setFullCompanyData] = useState<any>(null);
  const handleSearch = async () => {
    if (!companyQuery.trim()) return;
    try {
      setIsLoading(true);
      setSelectedCompany(null);
      setSuggestions([]);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const urlMaistro = `${baseUrl}/neuralseek/maistro`;
      const maistroCallBody = {
        url_name: "kyc-demo",
        agent: "search_name",
        params: [
          { name: "companyName", value: companyQuery }
        ],
        options: {
          returnVariables: false,
          returnVariablesExpanded: false
        }
      };
      const response = await axios.post(urlMaistro, maistroCallBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      let cleanedAnswer = response.data.answer.trim();
      if (cleanedAnswer.startsWith('```json')) {
        cleanedAnswer = cleanedAnswer.replace(/^```json/, '').trim();
      }
      if (cleanedAnswer.endsWith('```')) {
        cleanedAnswer = cleanedAnswer.replace(/```$/, '').trim();
      }
      if (cleanedAnswer.startsWith('{')) {
        const singleCompany = JSON.parse(cleanedAnswer);
        setSelectedCompany(singleCompany);
        setSuggestions([]);
      } else {
        const parsed = JSON.parse(cleanedAnswer);
        setSuggestions(parsed);
        setSelectedCompany(null);
      }
    } catch (err) {
      console.error("Error searching companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemToggle = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStepTransition = async () => {
  if (step === 1 && !selectedCompany) return;
  if (step === 2 && selectedItems.length === 0) return;

  if (step === 2) {
    setIsStepLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const urlMaistro = `${baseUrl}/neuralseek/maistro`;

    const results: APIDetail[] = [];

    for (const id of selectedItems) {
  const value = fullCompanyData?.[id];
  const industry = fullCompanyData?.Industry_Description;

  if (!value || !industry) continue;

  const maistroCallBody = {
    url_name: "kyc-demo",
    agent: id,
    params: [
      { value },  // valor del campo correspondiente (p. ej. "Yes", "Active", etc.)
      { value: industry }  // descripción del sector
    ],
    options: {
      returnVariables: false,
      returnVariablesExpanded: false
    }
  };

  try {
    const res = await axios.post(urlMaistro, maistroCallBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    let cleaned = res.data.answer?.trim?.() || "";

    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").trim();
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/```$/, "").trim();
    }

    results.push({
      id,
      title: dummyItems.find(i => i.id === id)?.label ?? id,
      content: cleaned
    });
  } catch (err) {
    console.error(`Error fetching report for ${id}:`, err);
    results.push({
      id,
      title: dummyItems.find(i => i.id === id)?.label ?? id,
      content: "Failed to fetch data"
    });
  }
}

  try {
  const summaryBody = {
    url_name: "kyc-demo",
    agent: "company_resume",
    params: [
      { value: selectedCompany?.company_name || "" },
      { value: fullCompanyData?.Industry_Description || "" }
    ],
    options: {
      returnVariables: false,
      returnVariablesExpanded: false
    }
  };

  const summaryRes = await axios.post(urlMaistro, summaryBody, {
    headers: { 'Content-Type': 'application/json' },
  });

  let cleanedSummary = summaryRes.data.answer?.trim?.() || "";
  if (cleanedSummary.startsWith("```json")) {
    cleanedSummary = cleanedSummary.replace(/^```json/, "").trim();
  }
  if (cleanedSummary.endsWith("```")) {
    cleanedSummary = cleanedSummary.replace(/```$/, "").trim();
  }

  setCompanySummary(cleanedSummary);
} catch (err) {
  console.error("Error fetching company summary:", err);
  setCompanySummary("No Executive Summary avilable.");
}
    setReportDetails(results);
  }
  setIsStepLoading(false);
  setStep(prev => prev + 1);
};

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Stepper currentStep={step} onStepChange={setStep} />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Enter Company Name or DUNS</h2>
          <div className="relative w-full">
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => setCompanyQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter company name or DUNS"
              className="w-full px-4 py-2 pr-10 border rounded-lg dark:bg-gray-800"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !companyQuery.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              {isLoading ? <Icon name="loader" className="animate-spin w-5 h-5" /> : <Icon name="search" className="w-5 h-5" />}
            </button>
          </div>

          {selectedCompany && (
            <div className="border p-4 rounded bg-gray-100 dark:bg-gray-800">
              <h3 className="font-semibold text-lg">Selected Company</h3>
              <p><strong>Name:</strong> {selectedCompany.company_name}</p>
              <p><strong>DUNS:</strong> {selectedCompany.duns}</p>
            </div>
          )}

          {suggestions.length > 0 && !selectedCompany && (
            <div className="space-y-2">
              <p className="text-sm text-yellow-600">Did you mean:</p>
              {suggestions.map((c: any) => (
                <div key={c.duns}>
                  <button
                    onClick={async () => {
                      setSelectedCompany(c);
                      setSuggestions([]);

                      // Fetch full data from DB by DUNS
                      try {
                        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                        const url = `${baseUrl}/company/${c.duns}`;
                        const dbResult = await axios.get(url);
                        console.log(dbResult.data)
                        setFullCompanyData(dbResult.data);
                      } catch (e) {
                        console.error("Error fetching company from DB:", e);
                      }
                    }}
                    className="text-sm underline hover:text-blue-700"
                  >
                    {c.company_name}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleStepTransition}
              disabled={!selectedCompany}
              className="mt-4 p-2 bg-green-600 text-white rounded-full disabled:opacity-50"
            >
              <Icon name="arrow-right" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Step 2: Select Items to Assess</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      You can select one or more items to generate the evaluation report.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dummyItems.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        return (
          <button
            key={item.id}
            onClick={() => handleItemToggle(item.id)}
            className={`w-full p-4 text-left border rounded-lg transition-all duration-200
              ${isSelected
                ? 'bg-green-600 text-white border-green-700 shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.label}</span>
              {isSelected && <Icon name="check" className="w-5 h-5 text-white" />}
            </div>
          </button>
        );
      })}
    </div>

    <div className="flex justify-between mt-4">
            <button
              onClick={handleBack}
              className="p-2 bg-gray-500 text-white rounded-full"
            >
              <Icon name="arrow-left" className="w-5 h-5" />
            </button>
            <button
              onClick={handleStepTransition}
              disabled={selectedItems.length === 0}
              className="p-2 bg-green-600 text-white rounded-full disabled:opacity-50"
            >
              <Icon name="arrow-right" className="w-5 h-5" />
            </button>
          </div>
  </div>
)}

      {isStepLoading && (
        <div className="flex justify-center items-center h-64">
          <Icon name="loader" className="animate-spin w-10 h-10 text-blue-600" />
        </div>
      )}
      {!isStepLoading && step === 3 && (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Step 3: Risk Assessment Report</h2>
    {companySummary && (
  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
    <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-200 mb-2">Executive Summary</h3>
    <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-line">{companySummary}</p>
  </div>
)}
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
      <p className="font-semibold mb-2">Company: {selectedCompany?.company_name ?? "N/A"}</p>
      <p className="mb-4">Assessment Date: {new Date().toLocaleDateString()}</p>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Risk Factor</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Status</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {reportDetails.map(detail => {
              const status = fullCompanyData?.[detail.id] ?? "N/A";
              return (
                <tr key={detail.id} className="border-t dark:border-gray-700">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {detail.title}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {status}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {detail.content}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    <div className="flex justify-start">
      <button
        onClick={handleBack}
        className="p-2 bg-gray-500 text-white rounded-full"
      >
        <Icon name="arrow-left" className="w-5 h-5" />
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default CompanyAssessmentFlow;
