"use client";
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BrouDemo.css';
import Icon from '@/components/Icon';
import jsPDF from 'jspdf';
interface PrePromptItem {
  prompt: string;
  iconName: string;
  label: string;
}

const BrouDemo: React.FC = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ query: string; answer: string; id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [prePrompts, setPrePrompts] = useState<PrePromptItem[]>([
    {
      prompt: "¿En qué época del año se hace la transferencia al tesoro nacional?",
      iconName: "",
      label: "¿En qué época del año se hace la transferencia al tesoro nacional?"
    },
    {
      prompt: " ¿Cuándo se deben realizar gestiones con los titulares cuentas para que no pasen al tesoro nacional?",
      iconName: "",
      label: " ¿Cuándo se deben realizar gestiones con los titulares cuentas para que no pasen al tesoro nacional?"
    },
    {
      prompt: "¿Cómo recupero dinero que ya fue enviado al Tesoro Nacional?",
      iconName: "",
      label: "¿Cómo recupero dinero que ya fue enviado al Tesoro Nacional?"
    },
    {
      prompt: "¿Qué pasa si una cuenta que pasa al tesoro nacional tiene más de un titular?",
      iconName: "",
      label: "¿Qué pasa si una cuenta que pasa al tesoro nacional tiene más de un titular?"
    }
  ]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
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
      if(query == "¿En qué época del año se hace la transferencia al tesoro nacional?")
        setPrePrompts([
          {
            prompt: "¿Cuándo se deben realizar gestiones con los titulares cuentas para que no pasen al tesoro nacional?",
            iconName: "",
            label: "¿Cuándo se deben realizar gestiones con los titulares cuentas para que no pasen al tesoro nacional?"
          }
        ]);
      else
        setPrePrompts([
          {
            prompt: "¿En qué época del año se hace la transferencia al tesoro nacional?",
            iconName: "",
            label: "¿En qué época del año se hace la transferencia al tesoro nacional?"
          }
        ]);
      const data = await response.json();
      let text = data.answer.trim();
      if (!text.startsWith("```markdown")) {
        text = `\`\`\`markdown\n${text}\n\`\`\``;
      }
      setChatHistory([...chatHistory, { query, answer: text, id: Date.now().toString() }]);
      setQuery('');

    } catch (error) {
      console.error('Error sending chat:', error);
    }

    setIsLoading(false);
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    chatHistory.forEach((chat, index) => {
      const userText = `You: ${chat.query}`;
      const botText = `NeuralSeek:\n${chat.answer}`;

      doc.setFontSize(12);
      doc.text(userText, 10, y);
      y += 10;

      const splitAnswer = doc.splitTextToSize(botText, 180);
      splitAnswer.forEach((line: string) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += 7;
      });

      y += 10;
    });

    doc.save('conversacion_neuralseek.pdf');
  };
  const handlePrePromptClick = (message: string) => {
    setQuery(message);
    handleChat();
  };
  const handleEditedMarkdown = async () => {
    const editedText = (document.getElementById('markdownEdit') as HTMLTextAreaElement)?.value;
    if (!editedText.trim() || !selectedChatId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/demos-page/api/proxy_brou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: 'markdown_repromt',
          params: {
            markdown: selectedMarkdown,
            promt: editedText
          },
        }),
      });

      const data = await response.json();
      const newAnswer = `${data.answer}`;

      // Actualizar solo el chat correspondiente
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.id === selectedChatId
            ? { ...chat, answer: newAnswer }
            : chat
        )
      );

      setSelectedMarkdown(null);
      setSelectedChatId(null);
    } catch (error) {
      console.error('Error al enviar el nuevo markdown:', error);
    }
    setIsLoading(false);
  };


  return (
    <section
      className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white"
    >
      <div className="flex flex-col items-center justify-center">
        <header className="flex flex-col items-center space-y-3 mb-5 mt-8">
          <div className="flex items-center space-x-3">
            <img src={`/demos-page/brou_logo.svg`} alt="NeuralSeek Logo" className="w-[400px]" />
          </div>
          

        </header>
      </div>

      <>
        {chatHistory.length > 0 && (
          <div className="h-[55%] flex flex-col items-center">
            {selectedMarkdown && (
              <div className="fixed backdrop-blur-sm  top-10 inset-0 bg-black/30 flex items-center justify-center z-50">

                <div className="h-[80%] w-[50%] bg-white dark:bg-gray-900 p-6 rounded-lg w-[90%] max-w-6xl relative flex flex-col gap-4">
                  <button
                    onClick={() => setSelectedMarkdown(null)}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
                  >
                    ✖
                  </button>
                  <h2 className="text-xl font-bold mb-4">Markdown Base</h2>
                  <div className="flex flex-row gap-6 max-h-[70vh] overflow-y-auto">
                    <pre className="w-1/2 whitespace-pre-wrap overflow-auto p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                      {selectedMarkdown}
                    </pre>
                    <div className="flex flex-col w-1/2">
                      <textarea
                        rows={16}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm border border-gray-300 dark:border-gray-700 resize-none focus:outline-none"
                        placeholder="Promt something new for this response..."
                        id="markdownEdit"
                        defaultValue=""
                      />
                      <button
                        onClick={handleEditedMarkdown}
                        className={`mt-4 p-2 rounded-lg w-full ${isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'}`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Prompt'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            <div
              ref={chatContainerRef}
              className="w-[50%] mt-0 mb-5 overflow-y-auto p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
            >
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="mb-4 p-4 rounded-lg shadow-md bg-white dark:bg-gray-900 markdown-container relative"
                >
                  <button
                    onClick={() => {
                      setSelectedMarkdown(chat.answer.replace(/```markdown/g, ''));
                      setSelectedChatId(chat.id);
                    }}
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{
                        `
                       ${chat.answer}
                       `
                      }
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

        }

      </>
      <div className="grid grid-cols-2 gap-4 justify-items-center mb-4 m-auto w-[50%]">
      {chatHistory.length == 0 && (
            prePrompts?.map((item, index) => (
              <div
                key={index}
                className="m-0 flex p-3 w-full border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                onClick={() => handlePrePromptClick(item.prompt)}
              >
                <Icon name={item.iconName} className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                <p className="text-sm m-auto font-semibold text-center text-gray-500 dark:text-gray-300">{item.label}</p>
              </div>
            ))
          )}
      </div>
        
      <div className={`w-[50%] mb-5 m-auto mt-0 ${chatHistory.length > 0 ? "mb-4 flex justify-center" : "flex items-center justify-center"}`}>
        <div className="relative w-[100%]">
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
            className="w-full pl-9 pr-4 py-3 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
            placeholder="Message NeuralSeek"
          />

          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end p-4">
            {chatHistory.length > 0 && (
              prePrompts?.map((item, index) => (
                <div
                  key={index}
                  className="w-[60%] flex items-center py-2 px-3 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => handlePrePromptClick(item.prompt)}
                >
                  <Icon name={item.iconName} className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-300 m-auto text-center">{item.label}</p>
                </div>
              ))
            )}

            <button
              onClick={handleChat}
              disabled={isLoading}
              className={`p-2 rounded-lg transition ml-auto ${isLoading
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
      {chatHistory.length > 0 && (
        <div className="w-[50%] m-auto mb-3 mt-0 flex justify-end">
          <button
            onClick={downloadPDF}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Download PDF
          </button>
        </div>
      )}
    </section>

  );
};

export default BrouDemo;
