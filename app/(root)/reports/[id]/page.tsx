"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import HeaderBox from "@/components/HeaderBox";
import Icon from '@/components/Icon';
import { ReportHistoryModal } from "../../../components/ReportHistory";
import { Version } from "@/types/report";
import { saveAs } from "file-saver";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { marked } from "marked";
import { EmailModal } from "../../../components/EmailModal";
import { AnalysisModal } from "../../../components/Analysis";
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const styles = StyleSheet.create({
    page: { padding: 20 },
    heading: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    subheading: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
    paragraph: { fontSize: 12, marginBottom: 6 },
    listItem: { fontSize: 12, marginBottom: 4, marginLeft: 10 },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
});

const ReportEditionPage = () => {
    const params = useParams();
    const id = params?.id as string;

    const [drafts, setDrafts] = useState<Version[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState("analytics");
    const [query, setQuery] = useState("");
    const [wholeText, setWholeText] = useState<string>("");
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [analysisReponse, setAnalysisReponse] = useState<string>("");

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchReportById(id);
        }
    }, [id]);

    const fetchReportById = async (id: string) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlReports = `${baseUrl}/reports/${id}?database=sec_demo`;
            const response = await axios.get(urlReports);
            setWholeText(response.data?.data?.content || "No content available.");
            setDrafts(response.data?.data?.versions || []);
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    const handleTextSelection = () => {
        setTimeout(() => {
            const selection = window.getSelection()?.toString().trim();
            if (selection) setSelectedText(selection);
        }, 10);
    };

    const storeDraftVersion = async (updatedText: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlDrafts = `${baseUrl}/reports/drafts`;

        const responsePost = await axios.post(urlDrafts, { id, content: updatedText });

        drafts.unshift({
            version: responsePost.data.version,
            content: updatedText,
            timestamp: new Date().toLocaleDateString()
        });
    };

    const handleSend = async () => {

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        const maistroCallBody = {
            url_name: "staging-SEC-demo",
            agent: "",
            params: [
                { name: "prompt", value: "" },
                { name: "selectedSection", value: "" },
            ],
            options: {
                returnVariables: true,
                returnVariablesExpanded: true,
            },
        };

        if (query && selectedText) {
            const maistroAgent = selectedMode == "editing" ? "modify_10k" : "generate_analytics";
            maistroCallBody.agent = maistroAgent;
            maistroCallBody.params[0].value = query;
            maistroCallBody.params[1].value = selectedText;

            setIsLoading(true);

            try {
                // Modify fragment with mAIstro
                const responseEdition = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Set output differently
                if (selectedMode == "editing") {
                    const updatedText = wholeText.replace(selectedText, responseEdition.data.answer);
                    setWholeText(updatedText);
                    storeDraftVersion(updatedText);
                    setQuery("");
                    setSelectedText(null);
                } else {
                    setAnalysisReponse(responseEdition.data.answer);
                    setIsAnalysisModalOpen(true);
                    setQuery("");
                    setSelectedText(null);
                }

            } catch (error) {
                console.error("Error in handleSend:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const parseMarkdownToPDF = (markdown: string) => {
        const tokens = marked.lexer(markdown);

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View>
                        {tokens.map((token, i) => {
                            if (token.type === "heading") {
                                return (
                                    <Text key={i} style={token.depth === 1 ? styles.heading : styles.subheading}>
                                        {token.text}
                                    </Text>
                                );
                            }
                            if (token.type === "paragraph") {
                                return (
                                    <Text key={i} style={styles.paragraph}>
                                        {token.text}
                                    </Text>
                                );
                            }
                            if (token.type === "list") {
                                return token.items.map((item: any, j: any) => (
                                    <Text key={`${i}-${j}`} style={styles.listItem}>
                                        • {item.text}
                                    </Text>
                                ));
                            }
                            return null;
                        })}
                    </View>
                </Page>
            </Document>
        );
    };

    const generatePDF = async (wholeText: string) => {
        const MyDocument = parseMarkdownToPDF(wholeText);
        const blob = await pdf(MyDocument).toBlob();
        saveAs(blob, "NeuralSeek 10K AI Generator.pdf");
    };

    // const generateWord = async (wholeText: string) => {
    //     const maistroCallBody = {
    //         agent: "generate_word_doc",
    //         params: [
    //             { name: "content", value: wholeText }
    //         ],
    //         options: {
    //             returnVariables: false,
    //             returnVariablesExpanded: false
    //         }
    //     };

    //     const responseIngestion = await axios.post(
    //         "https://stagingapi.neuralseek.com/v1/SEC-demo/maistro",
    //         maistroCallBody,
    //         { headers }
    //     );
    //     const file = responseIngestion.data.answer;
    //     console.log(file)
    // };

    // const handleSave = async () => {
    // };

    // const handleSendEmail = async () => {
    // };

    // const handleSendToApprove = async () => {

    // };

    const cleanText = () => {
        if (!selectedText) return;
        setSelectedText("");
    };

    return (
        <div className="home-content">
            <div className="flex items-center justify-between p-4shadow-md rounded-lg">

                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="10K Report Editing"
                        subtext={`Editing report ID: ${id}`}
                    />
                </header>

                <div className="flex gap-4">
                    {/* <a
                        onClick={() => { handleSendToApprove(); }}
                        className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Icon name="paper-clip" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Send to Approve</p>
                    </a>
                    <a
                        onClick={() => { setIsEmailModalOpen(true); }}
                        className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Icon name="paper-plane" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Share file</p>
                    </a> */}
                    <a
                        onClick={() => { setIsHistoryOpen(true); }}
                        download
                        className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Icon name="document-chart-bar" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">View drafts history</p>
                    </a>
                    {/* <a
                        onClick={() => { handleSave(); }}
                        download
                        className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Icon name="check" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Save changes</p>
                    </a> */}
                    <Popover className="relative">
                        <PopoverButton className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
                            <Icon name="arrow-down-tray" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Export</p>
                        </PopoverButton>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <PopoverPanel className="absolute z-10 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col">
                                    <a
                                        onClick={() => generatePDF(wholeText)}
                                        download
                                        className="flex items-center py-1 px-3 border dark:hover:bg-gray-700 transition cursor-pointer"
                                    >
                                        <Icon name="document" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Export as PDF</p>
                                    </a>
                                    {/* <a
                                        onClick={() => generateWord(wholeText)}
                                        download
                                        className="flex items-center py-1 px-3 border dark:hover:bg-gray-700 transition cursor-pointer"
                                    >
                                        <Icon name="document-text" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">Export as Word</p>
                                    </a> */}
                                </div>
                            </PopoverPanel>
                        </Transition>
                    </Popover>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full">
                {/* Text Editor */}
                <div className="md:col-span-3 flex flex-col h-full min-h-0 rounded-2xl shadow-lg p-2 border bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
                    <textarea
                        className="flex-1 min-h-0 p-4 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600 transition-colors selection:bg-gray-400 selection:text-black"
                        value={wholeText}
                        onChange={(e) => setWholeText(e.target.value)}
                        onSelect={handleTextSelection}
                        rows={18}
                    />
                </div>

                {/* Chat Section */}
                <div className="md:col-span-2 flex flex-col h-full min-h-0 rounded-2xl shadow-lg p-6 border bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">

                    <div className="flex justify-center gap-4 mb-4">
                        <a
                            onClick={() => setSelectedMode("analytics")}
                            className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer ${selectedMode === "analytics"
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                                }`}
                        >
                            <Icon
                                name="arrow-trending-up"
                                className={`w-5 h-5 ${selectedMode === "analytics" ? "text-white" : "text-blue-500 dark:text-blue-300"
                                    } mr-2`}
                            />
                            <p
                                className={`text-sm font-semibold ${selectedMode === "analytics" ? "text-white" : "text-gray-500 dark:text-gray-300"
                                    }`}
                            >
                                Analytics Agent
                            </p>
                        </a>
                        <a
                            onClick={() => setSelectedMode("editing")}
                            className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer ${selectedMode === "editing"
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                                }`}
                        >
                            <Icon
                                name="pencil"
                                className={`w-5 h-5 ${selectedMode === "editing" ? "text-white" : "text-blue-500 dark:text-blue-300"
                                    } mr-2`}
                            />
                            <p
                                className={`text-sm font-semibold ${selectedMode === "editing" ? "text-white" : "text-gray-500 dark:text-gray-300"
                                    }`}
                            >
                                Doc Editing Agent
                            </p>
                        </a>
                    </div>

                    {selectedText && (
                        <div className="relative mb-4 p-3 text-sm italic rounded-lg border-l-4 bg-gray-200 border-indigo-600 text-indigo-800 dark:bg-gray-700 dark:border-indigo-400 dark:text-indigo-300 transition-colors max-h-40 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap [&::-webkit-scrollbar-horizontal]:hidden hide-scrollbar-x">
                            {selectedText}
                            <a
                                onClick={cleanText}
                                className="absolute top-2 right-2 flex items-center p-2 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-800 transition cursor-pointer"
                            >
                                <Icon name="trash" className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                            </a>
                        </div>
                    )}

                    <div className="relative w-full">
                        <textarea
                            id="query"
                            rows={4}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
                            placeholder={selectedMode == "analytics" ? "Generate analysis or charts (bar, line, doughnut) from a dataset with NeuralSeek" : "Modify selected sections with NeuralSeek"}
                        />
                        <div className="absolute m-2 bottom-2 left-2 right-2 flex justify-between items-end">
                            <button
                                onClick={handleSend}
                                disabled={isLoading || query.trim().length === 0}
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition ${isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : query.trim().length > 0 && selectedText != null
                                        ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-not-allowed"
                                    }`}
                                title={
                                    isLoading
                                        ? "Processing..."
                                        : query.trim().length === 0
                                            ? "Enter a message"
                                            : "Send"
                                }
                            >
                                {isLoading ? (
                                    <Icon name="loader" className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Icon name="paper-plane" className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {analysisReponse && selectedMode === "analytics" && (
                        <div className="flex justify-end gap-4 mb-4">
                            <a
                                onClick={() => setIsAnalysisModalOpen(true)}
                                className="flex items-center py-1 px-3 border rounded-full transition cursor-pointer
                                       border-gray-400 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 
                                       hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <Icon
                                    name="eye"
                                    className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2"
                                />
                                <p className={`text-sm font-semibold ${selectedMode === "analytics" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-300"}`}>
                                    View generated analysis
                                </p>
                            </a>
                        </div>

                    )}

                </div>
            </div>

            {/* Modals */}

            {isEmailModalOpen && <EmailModal onClose={() => setIsEmailModalOpen(false)} />}

            {isHistoryOpen && <ReportHistoryModal drafts={{ versions: drafts }} onClose={() => setIsHistoryOpen(false)} />}

            {isAnalysisModalOpen && <AnalysisModal content={analysisReponse} onClose={() => setIsAnalysisModalOpen(false)} />}

        </div>
    );
};

export default ReportEditionPage;
