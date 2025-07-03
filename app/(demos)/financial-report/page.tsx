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
  const [riskLevel, setRiskLevel] = useState("Yellow (Moderate Risk)");
  const [assessedBy, setAssessedBy] = useState("Jessica Smith – Assessment Analyst");
  const [recommendedActions, setRecommendedActions] = useState<string[]>([
    "Request full UBO structure, including offshore entity documents.",
    "Perform enhanced due diligence on Cayman Islands holding company.",
    "Add to monthly periodic monitoring batch process for media and financial updates."
  ]);
  const [selectedState, setSelectedState] = useState("");
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
  const handleSendToCRM = async () => {
    try {
      const payload = {
        company: selectedCompany,
        state: selectedState,
        summary: companySummary,
        riskLevel,
        assessedBy,
        reportDetails,
        recommendedActions
      };
      // Reemplaza con la URL de tu CRM y la autenticación necesaria
      await axios.post("https://api.tu-crm.com/assessments", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CRM_TOKEN}`
        }
      });
      alert("¡Informe enviado al CRM con éxito!");
    } catch (err) {
      console.error("Error enviando al CRM:", err);
      alert("Falló el envío al CRM. Revisa la consola.");
    }
  };
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
          { name: "companyName", value: companyQuery },
          { name: "state", value: selectedState }
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
  const exportToPDF = () => {
    if (reportRef.current) {
      // @ts-ignore
      // Refer to issue -> https://github.com/eKoopmans/html2pdf.js/issues/644
      import('html2pdf.js').then((html2pdf) => {
        html2pdf.default()
          .set({
            margin: 0.5,
            filename: `report_${selectedCompany?.company_name || "company"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          })
          .from(reportRef.current)
          .save();
      });
    }
  }

  const resetFlow = () => {
    setStep(1);
    setCompanyQuery("");
    setSuggestions([]);
    setSelectedCompany(null);
    setSelectedItems([]);
    setReportDetails([]);
    setCompanySummary(null);
    setFullCompanyData(null);
    setSelectedState("");
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

  const handleSendEmail = async () => {
    try {
      alert("Email succesfully sent");
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Email sending failed.");
    }
  }

  const handleSendToSlack = async () => {
    try {
      alert("Report sent to Slack!");
    } catch (err) {
      console.error("Error sending report to Slack:", err);
      alert("Sending report to Slack failed.");
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  const reportRef = React.useRef<HTMLDivElement | null>(null);
  return (

    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="w-full flex justify-center mb-6">
        <img src="logo_kyc.png" alt="Company Logo" className="h-20" />
      </div>
      <Stepper currentStep={step} onStepChange={setStep} />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Enter Company Name or DUNS</h2>
          <div className="relative w-full">
            <div className="flex items-center w-full">

              <input
                type="text"
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter company name or DUNS"
                className="w-3/5 px-4 m-auto py-2 pr-10 border rounded-lg dark:bg-gray-800"
              />

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-1/4 px-4 m-auto py-2 border rounded-lg dark:bg-gray-800"
              >
                <option value="">Select a US State</option>
                {[
                  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
                ].map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                disabled={isLoading || !companyQuery.trim()}
                className="m-auto transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {isLoading ? <Icon name="loader" className="animate-spin w-5 h-5" /> : <Icon name="search" className="w-5 h-5" />}
              </button>
            </div>

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
        <div>

          <div ref={reportRef} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-300 dark:bg-white dark:text-black">
            <h1 className="text-2xl font-bold text-center mb-2">Risk Assessment Report</h1>

            <div className="text-sm space-y-1">
              <p><strong>Company:</strong> {selectedCompany?.company_name ?? "N/A"}</p>
              <p><strong>Assessment Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Risk Level:</strong> {riskLevel}</p>
              <p><strong>Assessed By:</strong> {assessedBy}</p>
            </div>

            <hr className="border-gray-400 my-4" />

            <h2 className="text-lg font-semibold uppercase text-gray-700">Executive Summary</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed">{companySummary}</p>

            <hr className="border-gray-400 my-4" />

            <h2 className="text-lg font-semibold uppercase text-gray-700">Risk Factor Breakdown</h2>
            <table className="w-full table-fixed border-collapse border border-gray-500 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-500 px-3 py-2 w-1/4">Risk Factor</th>
                  <th className="border border-gray-500 px-3 py-2 w-1/6">Status</th>
                  <th className="border border-gray-500 px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {reportDetails.map(detail => {
                  const status = fullCompanyData?.[detail.id] ?? "N/A";
                  return (
                    <tr key={detail.id}>
                      <td className="border border-gray-400 px-3 py-2 align-top font-medium">{detail.title}</td>
                      <td className="border border-gray-400 px-3 py-2 align-top">{status}</td>
                      <td className="border border-gray-400 px-3 py-2 align-top whitespace-pre-line">{detail.content}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <hr className="border-gray-400 my-4" />

            <h2 className="text-lg font-semibold uppercase text-gray-700">Recommended Actions</h2>
            <ul className="list-disc pl-6 text-sm space-y-1">
              {recommendedActions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBack}
              className="p-2 bg-gray-500 text-white rounded-full"
            >
              <Icon name="arrow-left" className="w-5 h-5" />
            </button>

            <button
              onClick={resetFlow}
              className="p-2 bg-red-600 text-white rounded-full"
            >
              Reset
            </button>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="p-2 border rounded"
              />
              <button
                onClick={handleSendEmail}
                className="p-2 bg-gray-600 text-white rounded-full"
              >
                Send to email
              </button>
            </div>
            <button
              onClick={handleSendToSlack}
              className="p-2 bg-orange-600 text-white rounded-full"
            >
              <Icon name="slack" className="w-4 h-4" />
              Send to Slack
            </button>

            <button
              onClick={exportToPDF}
              className="p-2 bg-blue-600 text-white rounded-full"
            >
              Download PDF
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
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 4: Push to CRM</h2>
          <p className="text-sm text-gray-600">

          </p>

          <textarea
            value={JSON.stringify({
              company: selectedCompany,
              state: selectedState,
              summary: companySummary,
              riskLevel,
              assessedBy,
              reportDetails,
              recommendedActions
            }, null, 2)}
            readOnly
            className="w-full h-64 p-2 border rounded-lg font-mono text-sm bg-gray-50"
          />

          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 bg-gray-500 text-white rounded-full"
            >
              <Icon name="arrow-left" className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendToCRM}
              className="p-2 bg-green-600 text-white rounded-full"
            >
              Send a CRM
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAssessmentFlow;
