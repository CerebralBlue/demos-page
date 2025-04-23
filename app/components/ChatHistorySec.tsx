import React, { useEffect, useState } from "react";
import axios from "axios";
import Icon from "@/components/Icon";
import { FileItem } from "@/types/file.item";

interface ChatHistorySecProps {
    messages: { message: string; type: "agent" | "user"; isFile?: boolean; fileName?: string; reportId?: string }[];
    setChatHistory: React.Dispatch<React.SetStateAction<
        { message: string; type: "agent" | "user"; isFile?: boolean; fileName?: string }[]
    >>;
    chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatHistorySec: React.FC<ChatHistorySecProps> = ({ messages, setChatHistory, chatEndRef }) => {

    const baseAppUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    const [fileList, setFileList] = useState<FileItem[]>([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const url = `${baseUrl}/files-select`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.success) {
                    setFileList(data.data);
                }
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };
        fetchFiles();
    }, []);

    const handleFileSelection = async (e: React.ChangeEvent<HTMLSelectElement>) => {

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;
        const urlReports = `${baseUrl}/reports`;

        const fileName = e.target.value;
        const fileObject = fileList.find((file) => file.name === fileName);

        if (fileObject) {
            setSelectedFile(fileObject);

            const maistroCallBody = {
                url_name: "staging-SEC-demo",
                agent: "generate_10k",
                params: [
                    { name: "dataset", value: fileObject.data }
                ],
                options: {
                    returnVariables: true,
                    returnVariablesExpanded: true
                }
            };

            // Create 10K file within mAIstro
            const content10k = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Store generated 10k
            const responsePost = await axios.post(
                urlReports,
                { file_name: fileName, content: content10k.data.answer },
            );

            const reportId = responsePost.data.data.insertedId;
            setChatHistory((prev) => [
                ...prev,
                {
                    message: "Report generated",
                    type: "agent",
                    isFile: true,
                    fileName,
                    reportId
                }
            ]);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <div className="w-full p-4 rounded-lg mb-4 max-h-[700px] bg-transparent">
            {messages.length > 0 && (
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-2 max-w-[75%] ${msg.type === "user"
                                ? "px-8 py-2 rounded-3xl  bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-end ml-auto text-right w-fit max-w-[75%]"
                                : "p-2 rounded-md  text-black dark:text-white self-start mr-auto text-left"
                                }`}
                        >
                            {msg.isFile ? (
                                <div className={`flex items-center gap-2 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                                    <Icon name="document" className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                                    <p className="text-sm font-semibold">{msg.fileName}</p>
                                    {msg.reportId && (
                                        <a
                                            href={`${baseAppUrl}/reports/${msg.reportId}`}
                                            target="_blank"
                                            className="flex items-center py-1 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                        >
                                            <Icon name="eye" className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">View Report</p>
                                        </a>
                                    )}
                                </div>
                            ) : msg.type === "agent" && msg.message === "Select the ingested file" ? (
                                <select
                                    className="border w-64 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md p-2"
                                    value={selectedFile?.name || ""}
                                    onChange={handleFileSelection}
                                >
                                    <option value="">Select a file</option>
                                    {fileList.map((file: any, i) => (
                                        <option key={i} value={file.name}>
                                            {file.year ? `${file.name} - ${file.year}` : file.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                // <p className={`${msg.type === "user" ? "text-right" : "text-left"} w-full`}>{msg.message}</p>
                                <p
                                    className={`
                                  ${msg.type === "user" ? "text-right whitespace-normal" : "text-left whitespace-pre-line"} 
                                  w-full
                                `}
                                >
                                    {msg.message}
                                </p>
                            )}
                        </li>
                    ))}
                    <div ref={chatEndRef} />
                </ul>
            )}
        </div>
    );
};

export default ChatHistorySec;