import React from "react";
import DOMPurify from "dompurify";

interface ChatHistoryProps {
    messages: { message: string; type: "agent" | "user"; html?: string }[];
    setChatHistory: React.Dispatch<React.SetStateAction<
        {
            message: string;
            type: "agent" | "user";
            html?: string;
        }[]
    >>;
    chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, setChatHistory, chatEndRef }) => {
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

    return (
        <div className="w-full p-4 rounded-lg mb-4 max-h-[700px] bg-transparent">
            {messages.length > 0 && (
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-2 ${
                                msg.type === "user"
                                    ? "px-4 py-2 rounded-2xl bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-end ml-auto text-right w-fit max-w-[75%]"
                                    : "p-2 rounded-md text-black dark:text-white self-start mr-auto text-left max-w-[75%]"
                            }`}
                        >
                            <div className="relative w-full">
                                {msg.html ? (
                                    // Render sanitized HTML content if available
                                    <div 
                                        className={`${msg.type === "user" ? "text-right" : "text-left"} whitespace-pre-wrap w-full`} 
                                        dangerouslySetInnerHTML={{ 
                                            __html: sanitizeHtml(msg.html) 
                                        }}
                                    />
                                ) : msg.type === "user" ? (
                                    // Format user messages with quote and file highlighting
                                    <p 
                                        className="text-right whitespace-pre-wrap w-full"
                                        dangerouslySetInnerHTML={{ 
                                            __html: sanitizeHtml(formatUserMessage(msg.message)) 
                                        }}
                                    />
                                ) : (
                                    // Render agent messages as regular text
                                    <p className="text-left whitespace-pre-wrap w-full">
                                        {msg.message}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                    <div ref={chatEndRef} />
                </ul>
            )}
        </div>
    );
};

export default ChatHistory;