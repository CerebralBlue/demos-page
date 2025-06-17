"use client";
import axios from "axios";
import Icon from '@/components/Icon';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import ChatHistoryDocAnalyzer from '@/app/components/ChatHistoryDocAnalyzer';


const UserSelector = ({ options, onSelect }: { options: any, label: any, onSelect: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleSelect = (option: any) => {
    setSelected(option);
    onSelect(option ? option.value : '');
    setIsOpen(false);
  };

  return (
    <div className="w-40 relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md text-sm shadow-sm px-2 py-1 text-left cursor-pointer flex justify-between items-center
        hover:border-gray-400 focus:outline-none dark:bg-transparent"
      >
        <span
          className={selected && selected.value ? 'text-black dark:text-white' : 'text-neutral-800/40 dark:text-white/50'}>
          {selected ? selected.label : "User"}
        </span>
        <ChevronDownIcon className={`ml-2 h-4 w-4 text-gray-500 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl overflow-auto translate-y-[calc(-100%-36px)] dark:bg-gray-900">
          {options.map((option: any) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface CompanyConfigModalProps {
  handleCompanyName: (e: string) => void;
  handleCompanyLogo: (e: string) => void;
  visible: boolean;
  closeModal: () => void;
}

const CompanyConfigModal: React.FC<CompanyConfigModalProps> = ({
  handleCompanyName,
  handleCompanyLogo,
  closeModal,
  visible,
}) => {

  const [tempCompanyName, setTempCompanyName] = useState('');
  const [tempCompanyLogo, setTempCompanyLogo] = useState<any>('');

  if (!visible) return null;

  const handleTempCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => setTempCompanyName(e.target.value);
  const handleTempCompanyLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempCompanyLogo(reader.result);
      reader.readAsDataURL(file);
    };
  }
  const send = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCompanyName(tempCompanyName);
    handleCompanyLogo(tempCompanyLogo);
    closeModal();
  }

  const reset = () => {
    handleCompanyName('');
    handleCompanyLogo('');
    closeModal();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-md border shadow-xl relative dark:bg-gray-900 dark:text-white">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 dark:text-white">Set Company Info</h2>

        <form id="uploadForm" className="space-y-4" onSubmit={send}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white" htmlFor="nombre">Company Name</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              placeholder="Company Name"
              onChange={handleTempCompanyName}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:bg-gray-900 dark:text-white" htmlFor="companyLogo">Company Logo</label>
            <input
              type="file"
              id="companyLogo"
              name="companyLogo"
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 dark:file:bg-gray-900 dark:file:text-white dark:file:border dark:file:border-gray-300 dark:file:cursor-pointer"
              onChange={handleTempCompanyLogo}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button className="bg-blue-500/10 px-3 py-1 text-md rounded hover:bg-blue-600/10 dark:bg-gray-900 dark:text-white dark:border dark:border-white" onClick={reset}>
              Reset
            </button>
            <button type="submit" className="bg-blue-600 text-white text-md px-3 py-1 rounded hover:bg-blue-700 dark:bg-gray-900 dark:text-white dark:border dark:border-white">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CustomerSupportChatbot = () => {
  const serivcesTypesCases: any = {
    usage: 'I want to check my usage, my account ID is',
    account: 'I want to get my account info, my account ID is',
    billing: 'I want to check my billing, my account ID is',
    service: 'I want to check my service status, my account ID is',
    transfer: 'I want to transfer my service, my account ID is',
    outage: 'I want to report an outage, my account ID is'
  };

  const options = [
    {
      label: 'User',
      value: ''
    },
    {
      label: 'John Smith',
      value: 'JS101'
    },
    {
      label: 'Emily Johnson',
      value: 'EJ203'
    },
    {
      label: 'Carlos Rivera',
      value: 'CR330'
    },
    {
      label: 'Sarah Lee',
      value: 'SL444'
    },
    {
      label: 'Ahmed Khan',
      value: 'AK556'
    },
    {
      label: 'Lisa Chen',
      value: 'LC678'
    },
  ]

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [sessionId, setSessionId] = useState(`nsChat_${Math.random().toString()}`);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [showModalCompany, setShowModalCompany] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user" }[]>([]);
  const [userId, setUserId] = useState<any>(null);

  const handleShowModalCompany = () => setShowModalCompany(!showModalCompany);
  const handleCompanyName = (e: string) => setCompanyName(e);
  const closeModal = () => setShowModalCompany(false);
  const handleCompanyLogo = async (e: string) => setCompanyLogo(e);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newMessage = e.target.value;
    if (!message && newMessage === '\n') { setMessage(''); }
    else { setMessage(newMessage); }
  }

  const handleChat = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const urlSeek = `${baseUrl}/neuralseek/seek`;

      setIsLoading(true);
      setChatHistory((prev) => [...prev, { message, type: "user" }]);
      scrollToBottom();

      const data = {
        question: message,
        user_session: {
          metdata: { user_id: "" },
          system: {
            session_id: sessionId
          }
        }
      }

      setMessage('');
      const response = await axios.post('/demos-page/api/neuralseek/seek', { url_name: "customer-support-chatbot", question: data }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setChatHistory((prev) => [...prev, { message: response.data.answer, type: "agent", seek_data: response.data }]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!message) { setMessage(''); return; };
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };
  const handleUserId = (userId: string) => setUserId(userId);
  const setInputValue = (type: string) => setMessage(`${serivcesTypesCases[type]} ${userId}`);

  useEffect(() => {
    setChatHistory((prev) => [...prev,
    {
      message: 'Hi! Welcome to the Customer Support Chatbot Demo. How Can I Help You?',
      type: "agent"
    }]);
  }, []);

  return (
    <section className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white">
      {/* Show Company Name And Logo If Company Name Is Setted */}
      {companyName
        ? (
          <div className="flex flex-row items-center justify-center my-2">
            <p className="text-xl me-2">{companyName}</p>
            {companyLogo ? (<img src={companyLogo} className="w-12 h-12" />) : ''}
          </div>
        ) : ''
      }

      <CompanyConfigModal handleCompanyName={handleCompanyName} handleCompanyLogo={handleCompanyLogo} visible={showModalCompany} closeModal={closeModal} />

      <div className="flex flex-col md:flex-row h-full w-full gap-4">
        <div className="w-full flex flex-col h-full">
          {
            chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <section className="flex flex-col">
                  <div className="flex flex-row items-center space-y-3 mb-2 space-x-3">
                    {
                      companyLogo
                        ? (<img src={companyLogo} alt="Company Logo" className="w-30 h-20" />)
                        : (<img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-30 h-20" />)
                    }
                    <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">Customer Support Chatbot</h1>
                  </div>
                  <p className="text-center text-lg">What can I do for you?</p>
                </section>
              </div>
            ) : (
              <div className="flex-grow w-full overflow-y-auto h-[500px]">
                <ChatHistoryDocAnalyzer
                  messages={chatHistory}
                  setChatHistory={setChatHistory}
                  chatEndRef={chatEndRef}
                />
              </div>
            )
          }

          <div className="mt-auto px-4 pb-4">
            <div className="flex flex-row items-center gap-2 py-2">
              <UserSelector options={options} label="Select user" onSelect={handleUserId} />
              <button className="rounded-md border hover:bg-neutral-800/10 dark:hover:bg-gray-950 p-1 text-sm" onClick={() => setInputValue('usage')}>Usage</button>
              <button className="rounded-md border hover:bg-neutral-800/10 dark:hover:bg-gray-950 p-1 text-sm" onClick={() => setInputValue('account')}>Account Info</button>
              <button className="rounded-md border hover:bg-neutral-800/10 dark:hover:bg-gray-950 p-1 text-sm" onClick={() => setInputValue('billing')}>Billing</button>
              <button className="rounded-md border hover:bg-neutral-800/10 dark:hover:bg-gray-950 p-1 text-sm" onClick={() => setInputValue('service')}>Service on or off</button>
              <button className="rounded-md border hover:bg-neutral-800/10 dark:hover:bg-gray-950 p-1 text-sm" onClick={() => setInputValue('transfer')}>Transfer service</button>
              <button className="rounded-md border hover:bg-neutral-800/10 dark:hover:bg-gray-950 p-1 text-sm" onClick={() => setInputValue('outage')}>Outage</button>
            </div>
            <div className="relative w-full">
              <textarea
                ref={textareaRef}
                id="query"
                rows={4}
                value={message}
                onChange={handleMessage}
                onKeyDown={handleKeyDown}
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-0 focus:outline-none resize-none pr-16 text-gray-900 dark:text-gray-100"
                placeholder="Ask what ever you need!"
              />

              {/* Text Area Buttons */}
              <div className="absolute bottom-2 right-3 flex items-end gap-x-2 p-2">
                {/* Upload Logo Button */}
                <button
                  className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-gray-900 dark:hover:bg-gray-950 cursor-pointer text-white"
                  onClick={handleShowModalCompany}>
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>

                {/* Send Message Button */}
                <button
                  onClick={handleChat}
                  disabled={isLoading || message.trim().length === 0}
                  className={`p-2 rounded-lg transition ${isLoading || message.trim().length === 0 ? "bg-transparent cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 dark:bg-gray-900 text-white cursor-pointer"}`}
                  title={isLoading ? "Processing..." : message.trim().length === 0 ? "Enter a message" : "Send"}
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
        </div>
      </div>
    </section>
  );
};

export default CustomerSupportChatbot;