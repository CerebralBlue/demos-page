"use client";
import React, { useState, useMemo } from "react";
import "./TuringDemo.css";

interface QA {
  question: string;
  humanAnswer: string;
}

// Define a type for answer objects.
type TAnswer = {
  source: "human" | "llm";
  text: string;
};

const TuringDemo: React.FC = () => {
  // Hardcoded questions with corresponding human answers.
  const qa: QA[] = [
    {
      question: "If I put a cake in the oven at 400°F for two hours, what happens?",
      humanAnswer: "The cake will be burnt and become inedible.",
    },
    {
      question: "What happens when you spill the beans?",
      humanAnswer:
        "It's an idiom that means revealing information that was meant to be secret.",
    },
    {
      question: "Why do people cry at weddings?",
      humanAnswer:
        "They are often overcome with joy and emotion from the ceremony.",
    },
    {
      question: "Are you capable of being bored?",
      humanAnswer:
        "Humans are capable of becoming bored if they are unstimulated.",
    },
    {
      question: "Would you sacrifice one person to save five?",
      humanAnswer:
        "The answer to this question can depend on a multitude of factors, for example what is your relation to the one person compared to the five?",
    },
    {
      question:
        "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
      humanAnswer: "Yes, all Bloops are Lazzies.",
    },
    {
      question: "Invent a new holiday and explain how people celebrate it.",
      humanAnswer:
        "International Pajama Day, people celebrate this holiday by wearing pajamas all day long, even at work.",
    },
  ];

  // Randomize questions once on mount and memoize the order.
  const randomizedQA = useMemo(() => {
    const copy = [...qa];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  // State variables.
  const [userSelections, setUserSelections] = useState<
    { question: string; selectedSource: "human" | "llm" }[]
  >([]);
  const [selectedLLM, setSelectedLLM] = useState<"claude" | "gpt-4o">("claude");
  const [answers, setAnswers] = useState<TAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<"human" | "llm" | null>(null);

  // Reset game.
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setUserSelections([]);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  // Fetch LLM answer from the selected agent.
  const fetchLLMAnswer = async (question: string): Promise<string> => {
    const agent = selectedLLM;
    const response = await fetch("https://stagingapi.neuralseek.com/v1/turing/maistro", {
      method: "POST",
      headers: {
        accept: "application/json",
        apikey: "f5ca3423-1c27c087-b261f348-467ce701",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent,
        params: [{ name: "question", value: question }],
      }),
    });
    const data = await response.json();
    return data.answer || `No answer received from ${agent}.`;
  };

  // Build the two answer options: human and LLM-generated.
  const fetchResponses = async () => {
    setLoading(true);
    const currentQA = randomizedQA[currentQuestionIndex];
    try {
      const llmAnswer = await fetchLLMAnswer(currentQA.question);
      const responses: TAnswer[] = [
        { source: "human", text: currentQA.humanAnswer },
        { source: "llm", text: llmAnswer },
      ];
      // Randomize order.
      const shuffled: TAnswer[] = responses.sort(() => Math.random() - 0.5);
      setAnswers(shuffled);
    } catch (error) {
      console.error("Error fetching LLM response:", error);
    }
    setLoading(false);
  };

  // Handle user selection (wait for user to select, then update question).
  const handleSelectAnswer = (source: "human" | "llm") => {
    const currentQA = randomizedQA[currentQuestionIndex];
    setUserSelections([
      ...userSelections,
      { question: currentQA.question, selectedSource: source },
    ]);
    setSelectedAnswer(source);
    // After a short delay, move to the next question.
    setTimeout(() => {
      setSelectedAnswer(null);
      setAnswers([]);
      if (currentQuestionIndex < randomizedQA.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 1500);
  };

  // Final results screen.
  if (currentQuestionIndex >= randomizedQA.length) {
    const humanSelections = userSelections.filter(
      (sel) => sel.selectedSource === "human"
    ).length;
    const llmSelections = userSelections.filter(
      (sel) => sel.selectedSource === "llm"
    ).length;
    const finalMessage =
      llmSelections > humanSelections
        ? "This model demonstrates the potential to pass the Turing Test. Its responses closely mirror human thought."
        : "This model wasn't able to pass the Turing Test. There's room to improve its human-like nuance.";

    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#3D91F0] to-[#9D2FF9] overflow-hidden flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl rounded-lg p-10 animate-fadeIn">
          <h1 className="animated-title text-5xl font-bold mb-6 text-center">
            Test Completed!
          </h1>
          <p className="text-2xl mb-4 text-center">
            You selected the human answer {humanSelections} out of {randomizedQA.length} questions.
          </p>
          <p className="text-lg mb-8 text-center">{finalMessage}</p>
          <p className="text-sm leading-relaxed mb-8 text-center max-w-2xl mx-auto">
            On NeuralSeek, switching between LLMs is effortless. NeuralSeek is an enterprise
            AI platform that empowers businesses to build, test, and scale generative AI
            solutions faster—without writing a single line of code. As a no-code, multi-agent
            LLM orchestration engine, it enables organizations to create reliable, human-guided
            AI agents that deliver true business value.
          </p>
          <div className="flex justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg text-base font-medium hover:bg-blue-600 transition-colors"
            >
              Reset Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main question screen.
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#3D91F0] to-[#9D2FF9] overflow-hidden flex items-center justify-center p-10">
      <div className="max-w-4xl w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl rounded-lg p-10 animate-fadeIn">
        <h1 className="animated-title block mx-auto text-5xl font-bold mb-6 text-center leading-[1.2]">
          Turing Test Demo
        </h1>
        {/* LLM Selection */}
        <div className="mb-8 flex flex-col items-center space-y-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Generate AI answer with:
          </span>
          <div className="space-x-2">
            <button
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedLLM === "claude"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
              onClick={() => setSelectedLLM("claude")}
            >
              Claude Haiku 3.5
            </button>
            <button
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedLLM === "gpt-4o"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
              onClick={() => setSelectedLLM("gpt-4o")}
            >
              GPT-40
            </button>
          </div>
        </div>
        {/* Question */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: "#9D2FF9" }}>
            Question {currentQuestionIndex + 1} of {randomizedQA.length}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {randomizedQA[currentQuestionIndex].question}
          </p>
        </div>
        {/* Answer Retrieval */}
        <div className="text-center">
          {answers.length === 0 && !loading && (
            <button
              onClick={fetchResponses}
              className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md text-base font-medium hover:bg-blue-600 transition-colors"
            >
              Get Answers
            </button>
          )}
          {loading && (
            <p className="text-gray-700 dark:text-gray-300">Loading responses...</p>
          )}
        </div>
        {/* Answer Options */}
        {answers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {answers.map((ans, index) => (
              <div
                key={index}
                className={`
                  p-6 border rounded-xl shadow-md cursor-pointer transition-colors
                  ${selectedAnswer === ans.source ? "border-[#3D91F0]" : "border-gray-300 dark:border-gray-700"}
                  min-h-[150px] flex items-center
                `}
                onClick={() => handleSelectAnswer(ans.source)}
              >
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                  {ans.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TuringDemo;
