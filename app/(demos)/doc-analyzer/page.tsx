"use client";

import React, { useState, useRef, DragEvent } from "react";
import Icon from "@/components/Icon";
import ChatHeader from "../../components/ChatHeader";
import axios from "axios";

export default function FileChatApp() {
  const [files, setFiles] = useState<File[]>([]);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
  const [showFileSelect, setShowFileSelect] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mentionActive, setMentionActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(true);
      };
  
      const handleDragLeave = () => {
          setIsDragging(false);
      };
  
  const exploreUpload = async (name: any, file: any) => {
    try {
      const form = new FormData();
      if (name) {
        form.append('file', file, name.toLowerCase());
      } else {
        console.error('File name is null');
      }
      const remoteResponse = await axios.post("https://stagingconsoleapi.neuralseek.com/NS-ES-V2/exploreUpload", form, {
        headers: {
          'accept': 'application/json',
          'apikey': "e907252c-a14c702d-a0ae2b3b-490872cd"
        }
      });
      summarize(remoteResponse.data.fn);
    } catch (error) {
      console.error('Error posting to remote server:', error);
    }
  };

  const summarize = (fileName: string) => {
    console.log("Summarize called with:", fileName);
    // Placeholder logic for summarization
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      newFiles.forEach((file) => exploreUpload(file.name, file));
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const mentionedFileNames = files
        .filter((file) => query.includes(`@${file.name}`))
        .map((file) => file.name)
        .join(",");

      // const cleanedQuery = query.replace(/@\S+/g, '').trim();

      const response = await fetch('/demos-page/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agent: "docAnalyzer",
          params: {
            fileNames: mentionedFileNames,
            query: query
          }
        }),
      });

      const data = await response.json();
      console.log("Search response:", data);
      setChatHistory((prev) => [...prev, { sender: "user", message: query }, { sender: "bot", message: data.answer || "No response" }]);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
    setQuery("");
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(false);

          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const newFiles = Array.from(e.dataTransfer.files);
              setFiles(prev => [...prev, ...newFiles]);
              newFiles.forEach((file) => exploreUpload(file.name, file));

          }
      };
  return (
    <section className="h-[100%] flex flex-col w-full dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col md:flex-row h-full w-full gap-4">
        
        <div className={`w-full md:w-1/4 flex flex-col h-full border-r dark:border-gray-700 relative ${isDragging ? 'border-2 border-dashed border-blue-500' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
        >

          {files.length ? (
            <div style={{ marginTop: '20px', width: '100%', height: '80vh' }}>
              {files.map((file, idx) => (
                <div key={idx} className="p-2 border rounded dark:border-gray-700 flex items-center">
                  <Icon name="document-text" className="w-4 h-4 mr-2" />
                  <span className="truncate text-sm">{file.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-lg">No PDF uploaded</p>
                                <p className="text-sm">Drag and drop a PDF file here or use the upload button</p>
                            </div>
          )}
          <div className="mt-auto mb-5">
            <label className="block p-3 bg-gray-200 dark:bg-gray-800 border dark:border-gray-700 rounded-lg cursor-pointer text-center">
              <Icon name="upload" className="w-5 h-5 mx-auto mb-1" />
              <span>Upload Files</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="w-full md:w-3/4 flex flex-col h-full overflow-y-auto">
          <div className="flex flex-col items-center p-5 h-full w-[100%]">
            {chatHistory.length === 0 ? (
              <ChatHeader
                title="NeuralSeek Chat"
                subtitle="Ask about uploaded documents"
                image=""
                handlePrePromptClick={() => {}}
              />
            ) : (
              <div className="space-y-2 w-full">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg w-[90%] ${msg.sender === "user" ? "bg-blue-500 text-white self-end  me-0 ms-auto" : "bg-gray-300 text-black ms-0"}`}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={3}
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  const cursorPos = e.target.selectionStart;
                  const lastWord = value.slice(0, cursorPos).split(/\s/).pop() || "";
                
                  const isMention = lastWord.startsWith("@") && lastWord.length > 1;
                  setMentionActive(isMention);
                  setShowFileSelect(isMention);
                  setQuery(value);
                }}
                placeholder="Message NeuralSeek using @ for files"
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:outline-none resize-none"
              />
              <button
                onClick={performSearch}
                disabled={isLoading}
                className="absolute bottom-3 right-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isLoading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="paper-plane" className="w-5 h-5" />}
              </button>
              {showFileSelect && files.length > 0 && (
                <div className="absolute bottom-16 left-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-lg w-48 max-h-48 overflow-y-auto p-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded"
                      onClick={() => {
                        if (textareaRef.current) {
                          const cursorPos = textareaRef.current.selectionStart;
                          const text = query;
                          const beforeCursor = text.slice(0, cursorPos);
                          const afterCursor = text.slice(cursorPos);
                      
                          const mentionMatch = beforeCursor.match(/@[\w.-]*$/);
                          if (mentionMatch) {
                            const atStart = mentionMatch.index!;
                            const newText = beforeCursor.slice(0, atStart) + `@${file.name} ` + afterCursor;
                            setQuery(newText);
                      
                            requestAnimationFrame(() => {
                              const newCursorPos = atStart + file.name.length + 2;
                              textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = newCursorPos;
                              textareaRef.current!.focus();
                            });
                          }
                        }
                        setMentionActive(false);
                        setShowFileSelect(false);
                      }}
                    >
                      @{file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}