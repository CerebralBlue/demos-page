import React, { useState } from "react";
import Icon from "@/components/Icon";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ChatMessage {
  message: string;
  type: "agent" | "user";
  isFile?: boolean;
  fileName?: string;
  data?: string;
}

interface ChatHistoryAIWriterProps {
  messages: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatHistoryAIWriter: React.FC<ChatHistoryAIWriterProps> = ({
  messages,
  setChatHistory,
  chatEndRef,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleAgentMessageClick = (data?: string) => {
    if (data) {
      setModalContent(data);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <div className="w-full p-4 rounded-lg mb-4 max-h-[700px] bg-transparent">
      {messages.length > 0 && (
        <ul className="space-y-2">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                onClick={() =>
                  message.type === "agent" && message.data
                    ? handleAgentMessageClick(message.data)
                    : undefined
                }
                className={`p-3 rounded-lg transition hover:shadow-md ${message.type === "user"
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  } max-w-[70%] ${message.data ? "cursor-pointer" : ""}`}
              >
                {message.isFile ? (
                  <div className="flex items-center space-x-2">
                    <Icon name="file" className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span>{message.fileName}</span>
                  </div>
                ) : (
                  <>
                    {message.type === "agent" && message.data && (
                      <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <Icon name="sparkles" className="w-4 h-4 mr-1" />
                        AI Generation – click to view
                      </div>
                    )}
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {`<div className="prose dark:prose-invert max-w-none">${message.message}</div>`}
                    </ReactMarkdown>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Generated Content</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white text-xl"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {`<div className="prose dark:prose-invert">${modalContent}</div>`}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatHistoryAIWriter;
