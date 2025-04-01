"use client";
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BrouDemo.css';
import ChatHeader from '@/app/components/ChatHeader';
import Icon from '@/components/Icon';

const BrouDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ query: string; answer: string; id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);

  const handleChat = async () => {
    if (!query.trim()) return;
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

      setChatHistory([...chatHistory, { query, answer: text, id: Date.now().toString() }]);
      setQuery('');

    } catch (error) {
      console.error('Error sending chat:', error);
    }

    setIsLoading(false);
  };

  const handlePrePromptClick = (message: string) => {
    setQuery(message);
  };

  return (
    <section
      className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white"
    >
      {chatHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <ChatHeader title="BROU Demo" subtitle="¿Que te gustaría preguntar sobre algún proceso del banco?" image="brou_logo.svg" handlePrePromptClick={handlePrePromptClick} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900">
            {selectedMarkdown && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg w-full relative">
                  <button
                    onClick={() => setSelectedMarkdown(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    ✖
                  </button>
                  <h2 className="text-xl font-bold mb-4">Markdown Base</h2>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-96 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {selectedMarkdown}
                  </pre>
                </div>
              </div>
            )}
            <div className="w-[60%] max-h-[500px] overflow-y-auto p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="mb-4 p-4 rounded-lg shadow-md bg-white dark:bg-gray-900 markdown-container relative"
                >
                  <button
                    onClick={() => setSelectedMarkdown(chat.answer.replace(/```markdown/g, ''))}
                    className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <Icon name="pencil-square" className="w-5 h-5" />
                  </button>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    You: {chat.query}
                  </p>
                  <div className="prose dark:prose-invert">
                    <hr />
                    <div className="markdownClass">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{`
                ${chat.answer}
              `}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className={`w-full ${chatHistory.length > 0 ? "mb-4 flex justify-center" : "flex items-center justify-center h-full"}`}>
        <div className="relative w-full max-w-2xl">
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
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
            placeholder="Message NeuralSeek"
          />

          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end p-4">
            <button
              onClick={handleChat}
              disabled={isLoading}
              className={`p-2 rounded-lg transition ${isLoading
                ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'}`}
              title={isLoading ? "Processing..." : "Send"}
            >
              {isLoading ? (
                <Icon name="loader" className="w-5 h-5 animate-spin" />
              ) : (
                <Icon name="paper-plane" className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrouDemo;
