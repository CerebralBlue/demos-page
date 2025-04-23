import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import SeekModal from "./SeekModal";

interface ChatHistoryProps {
    messages: { message: string; type: "agent" | "user"; html?: string; seek_data?: any }[];
    setChatHistory: React.Dispatch<React.SetStateAction<
        {
            message: string;
            type: "agent" | "user";
            html?: string;
            seek_data?: any;
        }[]
    >>;
    chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, setChatHistory, chatEndRef }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ directAnswer: string; passages: any[] }>({
        directAnswer: "",
        passages: []
    });

    // Function to parse user messages and format prompt and file references
    const formatUserMessage = (message: string) => {
        // First, escape any HTML entities to prevent formatting conflicts
        const escapeHtml = (text: string) => {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        // Escape the message first
        let escapedMessage = escapeHtml(message);

        // Now apply our formatting using regex
        // Regex to match text in quotes and angle brackets (now with escaped entities)
        const promptRegex = /&quot;([^&]*?)&quot;/g;
        const fileRegex = /&lt;([^&]*?)&gt;/g;

        // Replace prompts in quotes with styled spans
        let formattedMessage = escapedMessage.replace(promptRegex, (match, content) => {
            return `<span class="text-blue-600 dark:text-blue-400">"${content}"</span>`;
        });

        // Replace file references with styled spans
        formattedMessage = formattedMessage.replace(fileRegex, (match, content) => {
            return `<span class="text-green-600 dark:text-green-400">&lt;${content}&gt;</span>`;
        });

        return formattedMessage;
    };

    // Sanitize HTML to prevent XSS attacks
    const sanitizeHtml = (html: string) => {
        return DOMPurify.sanitize(html);
    };

    function convertTextToList(text: any) {
        const lines = text
            .split("\n")
            .map((line: any) => line.trim())
            .filter((line: any) => line !== "");
        let htmlContent = "";
        let ulLevel = 0;

        lines.forEach((line: any) => {
            if (line.startsWith("-")) {
                if (ulLevel === 0) {
                    htmlContent += "<ul>";
                    ulLevel++;
                }
                htmlContent += `<li>${line.substring(1).trim()}</li>`;
            } else {
                if (ulLevel > 0) {
                    htmlContent += "</ul>";
                    ulLevel = 0;
                }
                htmlContent += `<p>${line}</p>`;
            }
        });

        if (ulLevel > 0) {
            htmlContent += "</ul>";
        }

        return htmlContent;
    }

    function highlightPassages(passages: any, highlights: any) {
        if (passages) {
            for (var i in passages) {
                passages[i].passage = passages[i].passage.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
        }

        if (highlights) {
            for (var h of highlights) {
                if (h.text && h.text.length > 2) {
                    try {
                        var tr = h.text.trim().replace(/^[,.?!] +/, "").replace(/[,.?!]\n*$/, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        var regx = new RegExp("((?<!\\<[^>]*?)|(?<=\\>[^<]*?))(?<=(^|\\. +|\\? +|\\! +|, +|[\\n\\t\\r]|\\b|\\s))(" + flexSpace(esRx(tr)) + ")(?<=($|\\. +|\\b|\\s|\\? +|\\! +|, +|[\\n\\t\\r]|))", "gi");
                        // passages[h.docIndex].passage = passages[h.docIndex].passage.replace(regx, `<strong class="bg-yellow-200 text-black px-1 rounded transition-all duration-200">$3</strong>`);
                        passages[h.docIndex].passage = passages[h.docIndex].passage.replace(
                            regx,
                            `<strong class="bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white px-1 rounded transition-all duration-200">$3</strong>`
                        );

                    } catch (f) {
                        console.log(f);
                    }
                }
            }
        }

        return passages;
    }

    function esRx(string: any) {
        if (string)
            return string.replace(/([-/\\^${}\[\]*?.()+])/g, "\\$1");
    }

    function flexSpace(string: any) {
        if (string)
            return string.replace(/[ ,;:"'!@_=#%&|~`<>]+/g, "[ ,;:\"'!@_=#%&|~`<>]+");
    }

    const handleSeeSeekData = (seekData: any) => {
        // if (seekData?.ufa && seekData?.passages && seekData?.score > 0) {
        if (seekData?.ufa && seekData?.passages) {
            // Prepare the seekData for the modal
            const directAnswerHtml = convertTextToList(seekData.ufa);
            const processedPassages = highlightPassages(seekData.passages, seekData.highlights);

            // Set the modal data and open it
            setModalData({
                directAnswer: directAnswerHtml,
                passages: processedPassages
            });
            setIsModalOpen(true);
        } else {
            // Display a message in the modal for no content
            setModalData({
                directAnswer: "There is no content related to your prompt in the documentation",
                passages: []
            });
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className="w-full p-4 rounded-lg mb-4 max-h-[700px] bg-transparent">
                {messages.length > 0 && (
                    <ul className="space-y-2">
                        {messages.map((msg, index) => (
                            <li
                                key={index}
                                className={`flex flex-col items-start gap-1 ${msg.type === "user"
                                    ? "items-end px-4 py-2 rounded-2xl bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-end ml-auto text-right w-fit max-w-[75%]"
                                    : "p-2 rounded-md text-black dark:text-white self-start mr-auto text-left max-w-[75%]"
                                    }`}
                            >
                                <div className="relative w-full">
                                    {msg.html ? (
                                        <div
                                            className={`${msg.type === "user" ? "text-right" : "text-left"} whitespace-pre-wrap w-full`}
                                            dangerouslySetInnerHTML={{
                                                __html: sanitizeHtml(msg.html),
                                            }}
                                        />
                                    ) : msg.type === "user" ? (
                                        <p
                                            className="text-right whitespace-pre-wrap w-full"
                                            dangerouslySetInnerHTML={{
                                                __html: sanitizeHtml(formatUserMessage(msg.message)),
                                            }}
                                        />
                                    ) : (
                                        <p className="text-left whitespace-pre-wrap w-full">
                                            {msg.message}
                                        </p>
                                    )}
                                </div>

                                {msg.type !== "user" && msg.seek_data && (
                                    <div
                                        className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                        onClick={() => handleSeeSeekData(msg.seek_data)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-blue-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 012 0v4a1 1 0 11-2 0v-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>See the Seek and Knowledge base analysis.</span>
                                    </div>
                                )}
                            </li>
                        ))}
                        <div ref={chatEndRef} />
                    </ul>
                )}
            </div>

            <SeekModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                directAnswer={modalData.directAnswer}
                passages={modalData.passages}
            />
        </>
    );
};

export default ChatHistory;