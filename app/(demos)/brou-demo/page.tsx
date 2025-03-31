"use client";
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BrouDemo.css';

const BrouDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ query: string; answer: string; id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);

  const handleChat = async () => {
    if (!query.trim() && files.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch('/demos-page/api/proxy_brou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: 'markdown',
          params: {
            question: query,
          },
        }),
      });

      const data = await response.json();
      let text = `${data.answer}`
      console.log(text)
      setChatHistory([...chatHistory, { query, answer: text, id: Date.now().toString() }]);
      setQuery('');
      setFiles([]);
    } catch (error) {
      console.error('Error sending chat:', error);
    }

    setIsLoading(false);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto h-full">
      <div className="flex items-center space-x-3 w-full justify-center mb-10">
        <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
        <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">BROU Demo</h1>
      </div>

      {/* Modal para mostrar markdown */}
      {selectedMarkdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg w-full relative">
            <button onClick={() => setSelectedMarkdown(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖</button>
            <h2 className="text-xl font-bold mb-4">Markdown Base</h2>
            <pre className="whitespace-pre-wrap overflow-auto max-h-96 p-4 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-800">
              {selectedMarkdown}
            </pre>
          </div>
        </div>
      )}

      {/* Sección para mostrar la data en markdown */}
      <div className="mb-4 h-[70%] overflow-y-auto p-4 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-800">
        {chatHistory.map((chat) => (
          <div key={chat.id} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-900 markdown-container relative">
            <button
              onClick={() => setSelectedMarkdown(chat.answer.replace(/```markdown/g, ''))}
              className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              📝
            </button>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">You: {chat.query}</p>
            <div className="prose dark:prose-invert">
            <hr />
            <div className="markdownClass">

                <ReactMarkdown remarkPlugins={[remarkGfm]}>{
                        `
                            ${chat.answer}
                        `
                    }</ReactMarkdown>
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* TextArea y botones */}
      <div className={`w-full ${chatHistory.length > 0 ? "mb-4 flex" : "flex items-center"}`}>
        <div className="relative w-full">
          <textarea
            id="query"
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
              }
            }}
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
            placeholder="Message NeuralSeek"
          />

          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end p-4">
            <button
              onClick={handleChat}
              disabled={isLoading || (files.length === 0 && query.trim().length === 0)}
              className={`p-2 rounded-lg transition ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : files.length > 0 || query.trim().length > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-not-allowed'
                }`}
              title={isLoading ? "Processing..." : files.length === 0 && query.trim().length === 0 ? "Enter a message or upload files" : "Send"}
            >
              {isLoading ? '⏳' : '📩'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrouDemo;
