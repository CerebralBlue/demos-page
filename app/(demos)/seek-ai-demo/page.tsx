"use client";
import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import Icon from '@/components/Icon';
import { ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, EyeIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { nextTick } from 'process';
import ChatHistoryDocAnalyzer from '@/app/components/ChatHistoryDocAnalyzer';
import SeekChatHistory from './components/SeekChatHistory';


const SpinerDiv = () => {
  return (
    <div className="size-4 animate-spin rounded-full border-2 border-neutral-800/30 border-s-blue-800 border-t-blue-800"></div>
  )
}


const Step = ({ action, description }: { action: any, description?: any }) => {

  const actions: any = {
    1: "Query database",
    2: "Analyze information",
    3: "Generate graph",
  }

  const [showContent, setShowContent] = useState(false);

  const handleContent = () => {
    setShowContent(!showContent);
  }

  return (
    <>
      <div className="flex flex-row items-center my-4">
        <span className="flex flex-row items-center gap-2 text-sm bg-neutral-700/10 py-1 px-2 rounded-xl cursor-pointer" onClick={handleContent}>
          {actions[action]}
          {!description ? <SpinerDiv /> : !showContent ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" /> }
        </span>
      </div>

      <p className={`text-sm mb-2 ${showContent ? '' : 'hidden'}`}>{description}</p>
    </>
  )
}


const SeekAiDemo = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [sessionId, setSessionId] = useState(`nsChat_${Math.random().toString()}`);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user" }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [thinkingSteps, setThinkingSteps] = useState<any>([]);

  const handleShowSideBar = () => {
    setShowSidebar(!showSidebar);
  }

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newMessage = e.target.value;
    if (!message && newMessage === '\n') { setMessage(''); }
    else { setMessage(newMessage); }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleChat = async () => {
    try {
      setIsLoading(true);
      setChatHistory((prev) => [...prev, { message, type: "user" }]);
      scrollToBottom();

      const data = {
        options: {
          stream: true,
          includeHighlights: true,
          includeSourceResults: true,
          lastTurn: [],
          returnVariables: true,
          returnVariablesExpanded: true,
        },
        question: message,
        user_session: {
          metdata: { user_id: "" },
          system: {
            session_id: sessionId
          }
        },
        stream: true
      }

      setMessage('');
      const response = await fetch('/demos-page/api/seek-ai', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        if (!reader) break;
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Do and description
        if (chunk && !(chunk.includes('partRender')) && chunk.includes('doAndDescription')) {
          let [action, _] = JSON.parse(chunk)['doAndDescription'].split('_');
          let tempThinkingSteps = [...thinkingSteps];
          let temp = <Step action={action} />
          tempThinkingSteps.push(temp);
          setThinkingSteps(tempThinkingSteps);
        }

        if (chunk && !(chunk.includes('partRender')) && chunk.includes('jsonResults')) {
          let jsonResults = JSON.parse(chunk)['jsonResults'];

          console.log({ jsonResults })

          // let test = JSON.parse(jsonResults['jsonResults']);

          // console.log({ jsonResults })

          // console.log('LLEGO AQUI JSON RESULTS: ');
          // console.log({ chunk });
        }

        // console.log("Chunk data contiene do ", 'do' in chunkData);

        // if ('do' in chunkData) {
        //   console.log('LLEGA ACA Q P2');
        //   console.log({ chunkData })
        // }
      }

      // setChatHistory((prev) => [...prev, { message: response.data.answer, type: "agent", seek_data: response.data }]);
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

  return (
    <section className="flex flex-row items-center justify-around h-full w-full dark:bg-gray-900 dark:text-white">
      {/* Welcome Container And Span Input Message */}
      <div className={chatHistory.length > 0 ? "w-3/5 h-full grid grid-rows-[calc(100%-120px-2rem)_calc(120px+2rem)] max-w-3xl" : "w-3/5 mb-40 max-w-3xl"}>
        {
          chatHistory.length === 0 ? (
            <div>
              <h1 className="text-3xl text-center">How can I help you today?</h1>
              <p className="text-neutral-600 py-4 ps-4">
                Last time you asked about retail revenue distribution.<br />
                Would you like to continue to explore this?
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto">
              <SeekChatHistory
                chatTitle={chatTitle}
                messages={chatHistory}
                setChatHistory={setChatHistory}
                chatEndRef={chatEndRef}
              />
            </div>
          )
        }

        {/* Span Input Message */}
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            rows={4}
            value={message}
            onChange={handleMessage}
            onKeyDown={handleKeyDown}
            className="w-full p-3 bg-cyan-100/20 dark:bg-gray-800 rounded-3xl focus:ring-0 border outline-neutral-400/30 resize-none pr-16 text-gray-900"
            placeholder="Ask Seek a question about your data..."
          />

          {/* Span Buttons */}
          <div className="flex flex-row gap-2 absolute right-[5px] top-[50%] translate-y-[-50%]">
            {/* Send Message Button */}
            <button
              onClick={handleChat}
              disabled={isLoading || message.trim().length === 0}
              className={`p-2 rounded-lg transition ${isLoading || message.trim().length === 0 ? "cursor-pointer" : ""}`}
              title={isLoading ? "Processing..." : message.trim().length === 0 ? "Enter a message" : "Send"}
            >
              {isLoading ? (
                <Icon name="loader" className="w-5 h-5 animate-spin" />
              ) : (
                <Icon name="paper-plane" className="w-5 h-5" />
              )}
            </button>

            {/* Show Reasoning Sidebar */}
            <button
              onClick={handleShowSideBar}
              className={`p-2 rounded-lg transition cursor-pointer text-blue-500`}
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Deepthinking */}
      <div className={"flex flex-col pt-4 pb-6 h-full overflow-y-scroll w-2/5 px-2 " + (!showSidebar ? "hidden" : "")}>
        {/* Transaction Refunds */}
        <div className="flex flex-row items-center font-bold pb-5 gap-3">
          <ChevronLeftIcon className="w-3 h-3" />
          <span className="text-sm">Transaction Refunds</span>
        </div>

        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, ipsum maxime quidem exercitationem aliquid autem voluptatibus odit quo esse nihil omnis ea eveniet molestiae qui et soluta consequatur harum saepe.
        </p>

        {/* Get Schema For Database */}
        {/* <Step action={1} /> */}

        {
          thinkingSteps.length > 0 ? thinkingSteps[0] : ''
        }


        <p className="text-sm mb-2">
          I want to calculate total counts of transactions, those with refunds, as well as their proceeds.
        </p>

        {/* Generate query */}
        <div className="flex flex-row items-center mt-4">
          <span className="flex flex-row items-center gap-2 text-sm bg-neutral-700/10 py-1 px-2 rounded-xl">
            Generate query
            <ChevronDownIcon className="w-3 h-3" />
          </span>
        </div>

        {/* Run query */}
        <div className="flex flex-row items-center mt-2 mb-4 gap-2">
          <span className="flex flex-row items-center gap-2 text-sm bg-neutral-700/10 py-1 px-2 rounded-xl">
            Run query
            <ChevronDownIcon className="w-3 h-3" />
          </span>
          <span className="text-xs text-neutral-700">Analyzed 103,580,641 rows of data</span>
        </div>


        {/* Table */}
        <div className="grid grid-cols-3 border mb-4">
          <div className="text-xs flex flex-row border p-1 font-bold items-center">Total Transactions</div>
          <div className="text-xs flex flex-row border p-1 font-bold items-center">Transactions with Refunds</div>
          <div className="text-xs flex flex-row border p-1 font-bold items-center">Total Revenue</div>

          <div className="text-sm flex flex-row border p-1 items-center">8,605,304</div>
          <div className="text-sm flex flex-row border p-1 items-center">565,710</div>
          <div className="text-sm flex flex-row border p-1 items-center">653,703,423</div>
        </div>

        <p className="text-sm text-start">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus ut animi nihil optio fugiat incidunt et assumenda distinctio voluptate eum ipsa   exercitationem, rerum nobis omnis sed dolor est similique? Corrupti!
        </p>

        {/* Generate query */}
        <div className="flex flex-row items-center mt-4">
          <span className="flex flex-row items-center gap-2 text-sm bg-neutral-700/10 py-1 px-2 rounded-xl">
            Generate query
            <ChevronDownIcon className="w-3 h-3" />
          </span>
        </div>

        {/* Run query */}
        <div className="flex flex-row items-center mt-2 mb-4 gap-2">
          <span className="flex flex-row items-center gap-2 text-sm bg-neutral-700/10 py-1 px-2 rounded-xl">
            Run query
            <ChevronDownIcon className="w-3 h-3" />
          </span>
          <span className="text-xs text-neutral-700">Analyzed 103,580,641 rows of data</span>
        </div>

        {/* Table */}
        <div className="grid grid-cols-3 border mb-4">
          <div className="text-xs flex flex-row border p-1 font-bold items-center">Total Transactions</div>
          <div className="text-xs flex flex-row border p-1 font-bold items-center">Transactions with Refunds</div>
          <div className="text-xs flex flex-row border p-1 font-bold items-center">Total Revenue</div>

          <div className="text-sm flex flex-row border p-1 items-center">8,605,304</div>
          <div className="text-sm flex flex-row border p-1 items-center">565,710</div>
          <div className="text-sm flex flex-row border p-1 items-center">653,703,423</div>

          <div className="text-sm flex flex-row border p-1 items-center">8,605,304</div>
          <div className="text-sm flex flex-row border p-1 items-center">565,710</div>
          <div className="text-sm flex flex-row border p-1 items-center">653,703,423</div>

          <div className="text-sm flex flex-row border p-1 items-center">8,605,304</div>
          <div className="text-sm flex flex-row border p-1 items-center">565,710</div>
          <div className="text-sm flex flex-row border p-1 items-center">653,703,423</div>

          <div className="text-sm flex flex-row border p-1 items-center">8,605,304</div>
          <div className="text-sm flex flex-row border p-1 items-center">565,710</div>
          <div className="text-sm flex flex-row border p-1 items-center">653,703,423</div>

          <div className="text-sm flex flex-row border p-1 items-center">8,605,304</div>
          <div className="text-sm flex flex-row border p-1 items-center">565,710</div>
          <div className="text-sm flex flex-row border p-1 items-center">653,703,423</div>
        </div>

        {/* Generate chart */}
        <div className="flex flex-row items-center mt-2 mb-4 gap-2">
          <span className="flex flex-row items-center gap-2 text-sm bg-neutral-700/10 py-1 px-2 rounded-xl">
            Generate chart
            <ChevronDownIcon className="w-3 h-3" />
          </span>
        </div>

        {/* Example Graphic Data */}
        <img className="w-full h-auto" src="https://media.geeksforgeeks.org/wp-content/uploads/graph-plotting-2.png" />
      </div>
    </section>
  )
}

export default SeekAiDemo;