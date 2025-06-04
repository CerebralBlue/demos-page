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
import DynamicChart from "../../../components/dynamicaChart";

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
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const [chartData, setChartData] = useState<any | null>(null);
    const params = useParams();
    const id = params?.id as string;
    const [drafts, setDrafts] = useState<Version[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState("analytics");
    const [query, setQuery] = useState("");
    const [wholeText, setWholeText] = useState<string>("");
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    useEffect(() => {
        if (id) fetchReportById(id);
    }, [id]);

    const fetchReportById = async (id: string) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axios.get(`${baseUrl}/reports/${id}?database=charts_demo`);
            setWholeText(response.data?.data?.content || "Sin contenido disponible.");
            setDrafts(response.data?.data?.versions || []);
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
        }
    };

    const handleTextSelection = () => {
        setTimeout(() => {
            const selection = window.getSelection()?.toString().trim();
            if (selection) setSelectedText(selection);
        }, 10);
    };

    const handleSend = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        if (query && selectedText) {
            const maistroCallBody = {
                url_name: "chart_gen",
                agent: selectedMode == "editing" ? "modify_10k" : "generate_analytics",
                params: [
                    { name: "prompt", value: query },
                    { name: "selectedSection", value: selectedText },
                ],
                options: { returnVariables: true, returnVariablesExpanded: true },
            };

            setIsLoading(true);

            try {
                const response = await axios.post(urlMaistro, maistroCallBody, {
                    headers: { 'Content-Type': 'application/json' },
                });

                if (selectedMode === "editing") {
                    const updatedText = wholeText.replace(selectedText, response.data.answer);
                    setWholeText(updatedText);
                } else {
                    const chartConfig = JSON.parse(response.data.answer);
                    setChartData(chartConfig);
                }

                setQuery("");
                setSelectedText(null);
            } catch (error) {
                console.error("Error en handleSend:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const generatePDF = async (wholeText: string) => {
        const tokens = marked.lexer(wholeText);
        const MyDocument = (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View>
                        {tokens.map((token, i) => {
                            if (token.type === "heading") return <Text key={i} style={token.depth === 1 ? styles.heading : styles.subheading}>{token.text}</Text>;
                            if (token.type === "paragraph") return <Text key={i} style={styles.paragraph}>{token.text}</Text>;
                            if (token.type === "list") return token.items.map((item: any, j: any) => <Text key={`${i}-${j}`} style={styles.listItem}>• {item.text}</Text>);
                            return null;
                        })}
                    </View>
                </Page>
            </Document>
        );
        const blob = await pdf(MyDocument).toBlob();
        saveAs(blob, "NeuralSeek 10K AI Generador.pdf");
    };

    return (
        <div className="home-content">
            <HeaderBox type="greeting" title="Edición de Reporte 10K" subtext={`Editando el reporte con ID: ${id}`} />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full mt-6">
                <div className="md:col-span-3 flex flex-col">
                    <textarea
                        className="flex-1 min-h-0 p-4 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                        value={wholeText}
                        onChange={(e) => setWholeText(e.target.value)}
                        onSelect={handleTextSelection}
                        rows={18}
                    />
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                    {selectedText && (
                        <div className="relative p-3 text-sm italic rounded-lg border-l-4 bg-gray-200 border-indigo-600 text-indigo-800 dark:bg-gray-700 dark:border-indigo-400 dark:text-indigo-300">
                            {selectedText}
                            <button onClick={() => setSelectedText(null)} className="absolute top-2 right-2">
                                <Icon name="trash" className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                            </button>
                        </div>
                    )}

                    <select
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl"
                    >
                        <option value="" disabled>Selecciona el tipo de gráfica</option>
                        <option value="bar chart">Gráfica de barras</option>
                        <option value="line chart">Gráfica de líneas</option>
                        <option value="column chart">Gráfica de columnas</option>
                        <option value="area chart">Gráfica de área</option>
                        <option value="pie chart">Gráfica de pastel</option>
                        <option value="doughnut chart">Gráfica de dona</option>
                        <option value="scatter chart">Gráfica de dispersión</option>
                        <option value="bubble chart">Gráfica de burbujas</option>
                    </select>

                    <button
                        onClick={handleSend}
                        disabled={isLoading || !query || !selectedText}
                        className={`py-2 rounded-2xl text-white font-semibold transition ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                        {isLoading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <>Generar Gráfica</>}
                    </button>

                    {chartData && selectedMode === "analytics" && (
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Vista previa de la gráfica</p>
                                <button
                                    onClick={() => setIsChartModalOpen(true)}
                                    className="px-3 py-1 text-sm border rounded-lg text-blue-600 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                                >
                                    Maximizar
                                </button>
                            </div>
                            <DynamicChart config={chartData} />
                        </div>
                    )}
                </div>
            </div>

            {isChartModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/40">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[90%] max-w-4xl max-h-[90%] overflow-auto relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Vista completa de la gráfica</h2>
                            <button
                                onClick={() => setIsChartModalOpen(false)}
                                className="text-sm px-3 py-1 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cerrar
                            </button>
                        </div>
                        <div id="chart-download-container">
                            <DynamicChart config={chartData} />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => {
                                    const chartEl = document.querySelector('#chart-download-container canvas') as HTMLCanvasElement;
                                    if (chartEl) {
                                        const link = document.createElement('a');
                                        link.download = 'grafica.png';
                                        link.href = chartEl.toDataURL();
                                        link.click();
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Descargar Gráfica
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEmailModalOpen && <EmailModal onClose={() => setIsEmailModalOpen(false)} />}
            {isHistoryOpen && <ReportHistoryModal drafts={{ versions: drafts }} onClose={() => setIsHistoryOpen(false)} />}
        </div>
    );
};

export default ReportEditionPage;
