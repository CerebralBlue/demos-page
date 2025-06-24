"use client";
import React, { useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import SeekChatHistory from './components/SeekChatHistory';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, BarElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Pie, Line, PolarArea, Bubble } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, BarElement, PointElement, LineElement);

type ChartTypes = 'line' | 'bubble' | 'pie' | 'doughnut' | 'polarArea';

const Table = ({ tableData }: { tableData: Array<Array<any>> }) => {
  return (
    <div className={`overflow-x-auto mt-2 min-h-[${tableData.length * 40}px]`}>
      {
        tableData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[repeat(5,minmax(150px,1fr))]"
          >
            {row.map((cell, cellIndex) => (
              <div className={`flex flex-row border p-1 items-center ${rowIndex === 0 ? "text-xs font-bold" : "text-sm"}`} key={cellIndex}>
                {cell}
              </div>
            ))}
          </div>
        ))
      }
    </div>
  )
}

const SpinerDiv = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
  return (
    <div className="size-4 animate-spin rounded-full border-2 border-neutral-800/30 border-s-blue-800 border-t-blue-800" onClick={onClick}></div>
  )
}

const Step = ({ action, description }: { action: any, description?: any }) => {

  const actions: any = {
    1: "Query database",
    2: "Analyze information",
    3: "Generate graph",
  }

  const [showContent, setShowContent] = useState(true);

  const handleContent = () => {
    setShowContent(!showContent);
  }

  return (
    <>
      <div className="flex flex-row items-center mb-2">
        <span className="flex flex-row items-center gap-2 text-sm bg-neutral-700/10 py-1 px-2 rounded-xl cursor-pointer" onClick={handleContent}>
          {actions[action]}
          {!description ? <SpinerDiv /> : !showContent ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />}
        </span>
      </div>

      <div className={`${showContent ? 'mb-2' : 'hidden'}`}>{description}</div>
    </>
  )
}


const SeekAiDemo = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [showSidebar, setShowSidebar] = useState(false);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{
    message?: string | { initialResponse?: any; finalResponse?: any; thinkingButton?: any; graphs?: any },
    type: "agent" | "user"
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<any>([]);
  const [thinkingId, setThinkingId] = useState(0);

  const toggleSidebar = () => { setShowSidebar((prev) => !prev); }

  const toggleThinkingProcess = (id: any) => {
    setThinkingId(id);
    setShowSidebar(true);
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

  const getTitleSubtitle = async () => {
    const response = await fetch('/demos-page/api/seek-ai', {
      method: 'POST',
      body: JSON.stringify({ step: 'title-subtitle', question: message }),
      headers: { 'Content-Type': 'application/json' }
    });

    let { title, subtitle } = await response.json();
    let index = thinkingSteps.length;
    let initialSubtitle = <div key={`intialSubtitleStep${index}`} className="flex flex-row items-center font-bold pb-2 gap-3">
      <ChevronLeftIcon className="cursor-pointer w-3 h-3" onClick={toggleSidebar} />
      <span className="text-sm">{subtitle}</span>
    </div>;
    setThinkingSteps((prev: any) => [...prev, [initialSubtitle]]);
    setChatTitle(`${title} `);
    return subtitle;
  }

  const setStepsDescription = (steps: any) => {
    let messages = [];
    for (const [i, step] of steps.entries()) {
      messages.push(`${i + 1}. ${step.description}`);
    }

    let index = thinkingSteps.length;
    let initialParagraph: any = <div key={`intialParagrapStep${index}`} className="ps-2 text-sm mb-1">
      I will do the following steps:
      <ol className="ps-2">
        {messages.map((e: any, i: any) => <li key={`stepsText${i}`} className="text-sm mb-1">{e}</li>)}
      </ol>
    </div>;

    let initialThinkingButton: any = <div key={`thinkingButton${index}0`} className="text-start lastMessage">
      <div className="inline-flex flex-row gap-2 items-center bg-neutral-700/10 p-2 text-sm rounded-xl">
        Thinking...
        <SpinerDiv onClick={() => toggleThinkingProcess(thinkingSteps.length)} />
      </div>
    </div>;

    setThinkingSteps((prev: any) => {
      let prevThinkingSteps = [...prev];
      let tempThinkingStep = prevThinkingSteps[prevThinkingSteps.length - 1];
      tempThinkingStep.push(initialParagraph);
      prevThinkingSteps[prevThinkingSteps.length - 1] = tempThinkingStep;
      return prevThinkingSteps;
    });
    setShowSidebar(true);
    setChatHistory((prev) => [...prev, { type: "agent", message: { thinkingButton: initialThinkingButton } }]);
  }

  const getSteps = async () => {
    const response = await fetch('/demos-page/api/seek-ai', {
      method: 'POST',
      body: JSON.stringify({ step: 'generate-steps', question: message }),
      headers: { 'Content-Type': 'application/json' }
    });
    return (await response.json()).steps;
  }

  const getQueryDatabase = async (step: any, i: any) => {
    setThinkingSteps((prev: any) => {
      let prevThinkingSteps = [...prev];
      let tempThinkingStep = prevThinkingSteps[prevThinkingSteps.length - 1];
      let temp = <Step key={`step${i}`} action={step.do} />
      tempThinkingStep.push(temp);
      prevThinkingSteps[prevThinkingSteps.length - 1] = tempThinkingStep;
      return prevThinkingSteps;
    });

    const response = await fetch('/demos-page/api/seek-ai', {
      method: 'POST',
      body: JSON.stringify({ step: 'get-query-database', description: step.description }),
      headers: { 'Content-Type': 'application/json' }
    });
    const responseText = (await response.text())
      .replace(/^"+|"+$/g, '')
      .replace(/\\n/g, '\n')
    const tableData = responseText.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.split(","));

    let tableTemp = <Table tableData={tableData} />
    let newTemp = <Step key={`step${i}`} action={step.do} description={tableTemp} />
    setThinkingSteps((prev: any) => {
      let prevThinkingSteps = [...prev];
      let tempThinkingStep = prevThinkingSteps[prevThinkingSteps.length - 1];
      tempThinkingStep.pop();
      tempThinkingStep.push(newTemp);
      prevThinkingSteps[prevThinkingSteps.length - 1] = tempThinkingStep;
      return prevThinkingSteps;
    });
    return responseText;
  }

  const getResultsAnalysis = async (step: any, i: any, sqlQueryResults: string, question: string) => {
    setThinkingSteps((prev: any) => {
      let prevThinkingSteps = [...prev];
      let tempThinkingStep = prevThinkingSteps[prevThinkingSteps.length - 1];
      let temp = <Step key={`step${i}`} action={step.do} />
      tempThinkingStep.push(temp);
      prevThinkingSteps[prevThinkingSteps.length - 1] = tempThinkingStep;
      return prevThinkingSteps;
    });

    const response = await fetch('/demos-page/api/seek-ai', {
      method: 'POST',
      body: JSON.stringify({ step: 'get-results-analysis', description: step.description, sqlQueryResults, question }),
      headers: { 'Content-Type': 'application/json' }
    });
    let analysis: any = await response.text();
    analysis = analysis.substring(1, analysis.length - 1).replaceAll('\n', '<\/br>').replaceAll('\\n', '<\/br>');

    let markdownContainer = <div className="ps-2 text-sm">
      <Markdown rehypePlugins={[rehypeRaw]}>{analysis}</Markdown>
    </div>;
    let newTemp = <Step key={`step${i}`} action={step.do} description={markdownContainer} />
    setThinkingSteps((prev: any) => {
      let prevThinkingSteps = [...prev];
      let tempThinkingStep = prevThinkingSteps[prevThinkingSteps.length - 1];
      tempThinkingStep.pop();
      tempThinkingStep.push(newTemp);
      prevThinkingSteps[prevThinkingSteps.length - 1] = tempThinkingStep;
      return prevThinkingSteps;
    });
    return analysis;
  }

  const getChartByChartType = (key: string, chartType: string, data: any) => {
    if (chartType === 'bar') {
      return <Bar key={key} data={data} />
    } else if (chartType === 'doughnut ') {
      return <Doughnut key={key} data={data} />
    } else if (chartType === 'pie') {
      return <Pie key={key} data={data} />
    } else if (chartType === 'line') {
      return <Line key={key} data={data} />
    } else if (chartType === 'polarArea') {
      return <PolarArea key={key} data={data} />
    } else {
      return <Bubble key={key} data={data} />
    }
  }

  const getGraph = async (step: any, i: any, sqlQueryResults: string) => {
    setThinkingSteps((prev: any) => {
      let prevThinkingSteps = [...prev];
      let tempThinkingStep = prevThinkingSteps[prevThinkingSteps.length - 1];
      let temp = <Step key={`step${i}`} action={step.do} />
      tempThinkingStep.push(temp);
      prevThinkingSteps[prevThinkingSteps.length - 1] = tempThinkingStep;
      return prevThinkingSteps;
    });

    const response = await fetch('/demos-page/api/seek-ai', {
      method: 'POST',
      body: JSON.stringify({ step: 'get-graph', chartType: step.type, sqlQueryResults }),
      headers: { 'Content-Type': 'application/json' }
    });

    let chartInfo = await response.json();
    let chartType: ChartTypes = chartInfo.type;
    let theChart = getChartByChartType(`chart${i}`, chartType, chartInfo.data);
    let newTemp = <Step key={`step${i}`} action={step.do} description={theChart} />
    setThinkingSteps((prev: any) => {
      let prevThinkingSteps = [...prev];
      let tempThinkingStep = prevThinkingSteps[prevThinkingSteps.length - 1];
      tempThinkingStep.pop();
      tempThinkingStep.push(newTemp);
      prevThinkingSteps[prevThinkingSteps.length - 1] = tempThinkingStep;
      return prevThinkingSteps;
    });
    setChatHistory((prev: any) => {
      let prevChatHistory = [...prev];
      const lastMessage = prevChatHistory[prevChatHistory.length - 1]?.message;
      if (lastMessage && typeof lastMessage === "object") {
        let tempGraphs: any = lastMessage.graphs || [];
        tempGraphs.push(theChart);
        lastMessage.graphs = tempGraphs;
        prevChatHistory[prevChatHistory.length - 1].message = lastMessage;
      }
      return prevChatHistory;
    });
    return theChart;
  }

  const iterateSteps = async (steps: any) => {
    let analysisResults = '';
    let sqlQueryResults = '';
    let analysis = '';
    for (const [i, step] of steps.entries()) {
      if (step.do === 1) {
        sqlQueryResults = await getQueryDatabase(step, i);
        analysisResults += `${sqlQueryResults}\n\n`;
      } else if (step.do === 2) {
        analysis = await getResultsAnalysis(step, i, sqlQueryResults, message);
        analysisResults += `${analysis}\n\n`;
      } else {
        await getGraph(step, i, sqlQueryResults);
      }
    }
    return analysisResults;
  }

  const getFinalResponse = async (analysisResults: string) => {
    const response = await fetch('/demos-page/api/seek-ai', {
      method: 'POST',
      body: JSON.stringify({ question: message, analysisResults }),
      headers: { 'Content-Type': 'application/json' }
    });

    let analysis = await response.text();
    analysis = analysis.substring(1, analysis.length - 1).replaceAll('\n', '<\/br>').replaceAll('\\n', '<\/br>');
    let markdownContainer = <div className="ps-2 text-sm">
      <Markdown rehypePlugins={[rehypeRaw]}>{analysis}</Markdown>
    </div>;
    setChatHistory((prev) => {
      let prevChatHistory = [...prev];
      const lastMessage = prevChatHistory[prevChatHistory.length - 1]?.message;
      if (lastMessage && typeof lastMessage === "object") {
        lastMessage.finalResponse = markdownContainer;
        prevChatHistory[prevChatHistory.length - 1].message = lastMessage;
      }
      return prevChatHistory;
    });
  }

  const setFinalThinkingButton = (subtitle: string, elapsedTime: string) => {
    setChatHistory((prev: any) => {
      let prevChatHistory = [...prev];
      let index = thinkingSteps.length;
      let newThinkingButton = <div key={`thinkingButton${index}1`} className="text-start ms-2 mt-2" onClick={() => toggleThinkingProcess(thinkingSteps.length)}>
        <div className="inline-flex flex-row gap-2 items-center bg-neutral-700/10 p-2 text-sm rounded-xl cursor-pointer">
          Thought about {subtitle} for {elapsedTime} seconds
          <ChevronRightIcon className="w-3 h-5" />
        </div>
      </div>;
      prevChatHistory[prevChatHistory.length - 1].message.thinkingButton = newThinkingButton;
      return prevChatHistory;
    })
  }

  const handleChat = async () => {
    try {
      setIsLoading(true);
      setChatHistory((prev) => [...prev, { message, type: "user" }]);
      scrollToBottom();
      let startThinking = Date.now();

      setMessage('');
      setThinkingId(thinkingSteps.length);

      // 1. Obtener título de chat y subtítulo para razonamiento
      let subtitle = await getTitleSubtitle();

      // 2. Obtener los pasos
      const steps = await getSteps();
      setStepsDescription(steps);

      // 3. Hacer query a la base de datos
      // 4. Analizar los resultados
      // 5. Generar gráficos
      let allAnalysis = await iterateSteps(steps);

      // 6. Generar respuesta final
      await getFinalResponse(allAnalysis);

      // 7. Setiar botón de deepthinking final
      let endThinking = Date.now();
      let elapsedTime = ((endThinking - startThinking) / 1000).toFixed(2)
      setFinalThinkingButton(subtitle, elapsedTime);
      setTimeout(() => { setShowSidebar(false); setThinkingId((prev) => prev + 1) }, 3000);
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
          </div>
        </div>
      </div>

      {/* Sidebar Deepthinking */}
      <div className={"flex flex-col pt-4 pb-6 h-full overflow-y-scroll w-2/5 px-2 " + (!showSidebar ? "hidden" : "")}>
        {thinkingSteps[thinkingId] && thinkingSteps[thinkingId].map((e: any, i: any) => e)}
      </div>
    </section>
  )
}

export default SeekAiDemo;