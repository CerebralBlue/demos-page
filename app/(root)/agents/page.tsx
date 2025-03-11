"use client";
import React, { useState } from 'react';
import { useEffect, useRef } from "react";
import * as sdk from "@d-id/client-sdk";
import Icon from '@/components/Icon';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function DIDAgent() {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let manager: any;
  const agentId = "agt_8djD6Mq8";
  const auth: { type: "key"; clientKey: string } = { type: "key", clientKey: "Z29vZ2xlLW9hdXRoMnwxMTc5MTE2MzI0ODg4NzA1MzczMTU6MU1sQkVhMXo3dlU4WHVSRzJJTDND" };

  const videoElement = useRef<HTMLVideoElement>(null);
  const [text, setText] = useState("");
  const textArea = useRef<HTMLTextAreaElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);

  const [connectionState, setConnectionState] = useState("Connecting...");
  const [agentManager, setAgentManager] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user" }[]>([]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const captureLastFrame = () => {
    if (!videoElement.current || !canvasRef.current || !videoContainerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = videoElement.current.videoWidth;
      canvas.height = videoElement.current.videoHeight;
      ctx.drawImage(videoElement.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");

      videoContainerRef.current.style.backgroundImage = `url(${dataURL})`;
      videoContainerRef.current.style.backgroundSize = "cover";
      videoContainerRef.current.style.backgroundPosition = "center";
    }
  };

  const hasInitialized = useRef(false);
  let srcObject: any;

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const callbacks = {
      onSrcObjectReady: (value: MediaStream) => {
        srcObject = value;
        videoElement.current!.play();
      },
      onVideoStateChange: (state: string) => {
        if (!manager) return;

        if (state === "STOP") {
          captureLastFrame();
          videoElement.current!.muted = true;
          videoElement.current!.srcObject = null;
          videoElement.current!.src = manager.agent.presenter.idle_video;
        } else {
          // videoContainerRef.current!.style.backgroundImage = "";
          videoElement.current!.muted = false;
          videoElement.current!.srcObject = srcObject;
        }
      },
      onConnectionStateChange: (state: string) => {
        setConnectionState(state === "connected" ? "Online" : "Disconnected");
      },
      onNewMessage: (messages: any[]) => {
        const lastMsg = messages[messages.length - 1];

        // answersRef.current!.innerHTML += `<p>[${lastMsg.role}] : ${lastMsg.content}</p>`;
        // answersRef.current!.scrollTop = answersRef.current!.scrollHeight;

        setChatHistory((prev) => [
          ...prev,
          { message: lastMsg.content, type: lastMsg.role }
        ]);
        scrollToBottom();

      },
      onError: (error: any) => console.error("Error:", error),
    };
    const initAgent = async () => {
      const options = { compatibilityMode: "auto" as sdk.CompatibilityMode, streamWarmup: true };
      manager = await sdk.createAgentManager(agentId, { auth, callbacks, streamOptions: options });
      manager.connect();
      setAgentManager(manager);
    };
    initAgent();
  }, []);

  useEffect(() => {
    if (connectionState === "Online") {
      setTimeout(() => {
        speak("Hi! I'm Tyler. How can I help you?");
      }, 2000);
    }
  }, [connectionState]);

  const showAnswer = (answer: string, rol: any) => {
    if (answersRef.current) {

      // answersRef.current.innerHTML += `<p>${rol} : ${answer}</p>`;
      // answersRef.current.scrollTop = answersRef.current.scrollHeight;

      setChatHistory((prev) => [
        ...prev,
        { message: answer, type: rol }
      ]);
      scrollToBottom();

    }
  };

  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setText(speechResult);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          console.log('No speech detected. Please try again.');
        } else {
          console.error('Speech recognition error', event.error);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognition.start();
      setIsListening(true);
    }
  };
  const chat = async () => {
    if (text.trim() !== "") {
      const question = text;
      try {
        showAnswer(text, "user");
        setText("");  // ✅ Clear the textarea by updating state

        const response = await fetch('https://api-usw.neuralseek.com/v1/e688e6f2bfe772fdae28dc9f/seek', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'e389d36b-a9af93af-ac08626f-c829870d'
          },
          body: JSON.stringify({ question }),
        });

        const data = await response.json();

        speak(data.answer);
        showAnswer(data.answer, "agent");

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const speak = (text2speek: any) => {
    if (text2speek.trim().length > 2) {
      agentManager.speak({ type: "text", input: text2speek });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-6 mt-4">
        {/* Enlarged Video Container */}
        <div className="w-2/3 flex flex-col items-center">
          <div
            ref={videoContainerRef}
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg videoDiv"
          >
            <video
              ref={videoElement}
              className="w-full h-full object-cover"
              autoPlay
              loop
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>

          {/* Connection Status */}
          <div className="mt-4 mb-2 flex items-center space-x-2">
            <a
              className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer ${connectionState === "Online"
                ? "bg-green-500 text-white border-green-500"
                : connectionState === "Connecting"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-red-500 text-white border-red-500"
                }`}
            >
              <span
                className={`w-3 h-3 rounded-full mr-2 ${connectionState === "Online"
                  ? "bg-green-300"
                  : connectionState === "Connecting"
                    ? "bg-yellow-300"
                    : "bg-red-300"
                  }`}
              ></span>
              <p className="text-sm font-semibold">{connectionState}</p>
            </a>
          </div>
        </div>

        {/* Chat Column Adjusted */}
        <div className="w-1/3 flex flex-col items-center">
          <div
            ref={answersRef}
            className="flex-grow w-full max-w-3xl mx-auto overflow-y-auto h-[400px]"
          >
            {chatHistory.length > 0 && (
              <ul className="space-y-2">
                {chatHistory.map((msg, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 max-w-[75%] ${msg.type === "user"
                      ? "px-8 py-2 rounded-3xl bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-end ml-auto text-right w-fit max-w-[75%]"
                      : "p-2 rounded-md text-black dark:text-white self-start mr-auto text-left"
                      }`}
                  >
                    <p
                      className={`${msg.type === "user" ? "text-right" : "text-left"
                        } w-full`}
                    >
                      {msg.message}
                    </p>
                  </li>
                ))}
                <div ref={chatEndRef} />
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="flex gap-6 mt-4">
        <div className="relative w-full mx-auto">
          <textarea
            rows={4}
            ref={textArea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
            placeholder={"Message NeuralSeek"}
          />
          <div className="absolute m-2 bottom-2 left-2 right-2 flex gap-2 items-end">
            <button
              onClick={chat}
              disabled={connectionState !== "Online" || isListening}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${connectionState !== "Online" || isListening
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                }`}
            >
              {connectionState !== "Online" ? (
                <Icon name="loader" className="w-5 h-5 animate-spin" />
              ) : (
                <Icon name="paper-plane" className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={startListening}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${isListening
                ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                : connectionState !== "Online"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                }`}
            >
              <Icon name="microphone" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}