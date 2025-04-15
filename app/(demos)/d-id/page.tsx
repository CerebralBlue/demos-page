// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import dynamic from 'next/dynamic';
// import Icon from '@/components/Icon';

// // Create a type for the SDK to use throughout the component
// type SDKType = typeof import('@d-id/client-sdk');

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// // Create a component that loads only on client-side
// const DIDDemo = () => {

//   const agentId: string = process.env.NEXT_PUBLIC_DID_AGENT_ID || "";
//   const agentKey: string = process.env.NEXT_PUBLIC_DID_API_KEY || "";

//   const nsEndpointSeek1: string = process.env.NEXT_PUBLIC_NS_API_SEEK_1 || "";
//   const nsApiKey1: string = process.env.NEXT_PUBLIC_NS_API_KEY_1 || "";

//   const videoContainerRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const videoElement = useRef<HTMLVideoElement>(null);
//   const textArea = useRef<HTMLTextAreaElement>(null);
//   const answersRef = useRef<HTMLDivElement>(null);
//   const chatEndRef = useRef<HTMLDivElement | null>(null);
//   const recognitionRef = useRef<any>(null);
//   const hasInitialized = useRef(false);

//   // References for SDK and manager
//   const sdkRef = useRef<SDKType | null>(null);
//   const managerRef = useRef<any>(null);

//   const [text, setText] = useState("");
//   const [connectionState, setConnectionState] = useState("Connecting...");
//   const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user" }[]>([]);
//   const [isListening, setIsListening] = useState(false);
  
//   const auth: { type: "key"; clientKey: string } = { type: "key", clientKey: agentKey };
//   let srcObject: any;

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   const captureLastFrame = () => {
//     if (!videoElement.current || !canvasRef.current || !videoContainerRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     if (ctx) {
//       canvas.width = videoElement.current.videoWidth;
//       canvas.height = videoElement.current.videoHeight;
//       ctx.drawImage(videoElement.current, 0, 0, canvas.width, canvas.height);
//       const dataURL = canvas.toDataURL("image/png");

//       videoContainerRef.current.style.backgroundImage = `url(${dataURL})`;
//       videoContainerRef.current.style.backgroundSize = "cover";
//       videoContainerRef.current.style.backgroundPosition = "center";
//     }
//   };

//   // Load SDK dynamically and initialize agent
//   useEffect(() => {
//     if (hasInitialized.current) return;
//     hasInitialized.current = true;

//     const loadSDKAndInitAgent = async () => {
//       try {
//         // Dynamically import the SDK
//         const sdkModule = await import('@d-id/client-sdk');
//         sdkRef.current = sdkModule;

//         const callbacks = {
//           onSrcObjectReady: (value: MediaStream) => {
//             srcObject = value;
//             if (videoElement.current) {
//               videoElement.current.play();
//             }
//           },
//           onVideoStateChange: (state: string) => {
//             if (!managerRef.current || !videoElement.current) return;

//             if (state === "STOP") {
//               captureLastFrame();
//               videoElement.current.muted = true;
//               videoElement.current.srcObject = null;
//               videoElement.current.src = managerRef.current.agent.presenter.idle_video;
//             } else {
//               videoElement.current.muted = false;
//               videoElement.current.srcObject = srcObject;
//             }
//           },
//           onConnectionStateChange: (state: string) => {
//             setConnectionState(state === "connected" ? "Online" : "Disconnected");
//           },
//           onNewMessage: (messages: any[]) => {
//             if (messages && messages.length > 0) {
//               const lastMsg = messages[messages.length - 1];
//               setChatHistory((prev) => [
//                 ...prev,
//                 { message: lastMsg.content, type: lastMsg.role }
//               ]);
//               scrollToBottom();
//             }
//           },
//           onError: (error: any) => console.error("Error:", error),
//         };

//         // Initialize the agent manager
//         const options = {
//           compatibilityMode: "auto" as "auto",
//           streamWarmup: true
//         };

//         const manager = await sdkModule.createAgentManager(
//           agentId,
//           { auth, callbacks, streamOptions: options }
//         );

//         managerRef.current = manager;
//         manager.connect();
//       } catch (error) {
//         console.error("Failed to load D-ID SDK or initialize agent:", error);
//         setConnectionState("Failed to connect");
//       }
//     };

//     // Only run in browser
//     if (typeof window !== 'undefined') {
//       loadSDKAndInitAgent();
//     }

//     // Cleanup function
//     return () => {
//       if (managerRef.current && managerRef.current.disconnect) {
//         managerRef.current.disconnect();
//       }
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (connectionState === "Online") {
//       setTimeout(() => {
//         speak("Hi! I'm Tyler. How can I help you?");
//       }, 2000);
//     }
//   }, [connectionState]);

//   const showAnswer = (answer: string, role: "agent" | "user") => {
//     setChatHistory((prev) => [
//       ...prev,
//       { message: answer, type: role }
//     ]);
//     scrollToBottom();
//   };

//   const startListening = () => {
//     try {
//       if (typeof window === "undefined") return;

//       if (isListening) {
//         if (recognitionRef.current) {
//           recognitionRef.current.stop();
//         }
//         setIsListening(false);
//         return;
//       }

//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) {
//         console.error("Speech recognition not supported in this browser");
//         return;
//       }

//       const recognition = new SpeechRecognition();
//       recognition.lang = 'en-US';
//       recognition.interimResults = false;
//       recognition.maxAlternatives = 1;
//       recognitionRef.current = recognition;

//       recognition.onresult = (event: any) => {
//         const speechResult = event.results[0][0].transcript;
//         setText(speechResult);
//       };

//       recognition.onerror = (event: any) => {
//         console.error('Speech recognition error', event.error);
//         setIsListening(false);
//       };

//       recognition.onend = () => {
//         setIsListening(false);
//       };

//       recognition.start();
//       setIsListening(true);
//     } catch (error) {
//       console.error("Error starting speech recognition:", error);
//       setIsListening(false);
//     }
//   };

//   const chat = async () => {
//     if (text.trim() === "") return;

//     const question = text;
//     try {
//       showAnswer(text, "user");
//       setText("");

//       const response = await fetch(nsEndpointSeek1, {
//         method: 'POST',
//         //mode: 'no-cors',
//         headers: {
//           'Content-Type': 'application/json',
//           'apikey': nsApiKey1
//         },
//         body: JSON.stringify({ question }),
//       });

//       if (!response.ok) {
//         throw new Error(`API response: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.answer) {
//         speak(data.answer);
//         showAnswer(data.answer, "agent");
//       } else {
//         showAnswer("Sorry, I couldn't process your request.", "agent");
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showAnswer("Sorry, there was an error processing your request.", "agent");
//     }
//   };

//   const speak = (text2speak: string) => {
//     if (!managerRef.current || !text2speak || text2speak.trim().length <= 2) return;

//     try {
//       managerRef.current.speak({ type: "text", input: text2speak });
//     } catch (error) {
//       console.error("Error making agent speak:", error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex gap-6 mt-4">
//         {/* Enlarged Video Container */}
//         <div className="w-2/3 flex flex-col items-center">
//           <div
//             ref={videoContainerRef}
//             className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg videoDiv"
//           >
//             <video
//               ref={videoElement}
//               className="w-full h-full object-cover"
//               autoPlay
//               playsInline
//             ></video>
//             <canvas ref={canvasRef} className="hidden"></canvas>
//           </div>

//           {/* Connection Status */}
//           <div className="mt-4 mb-2 flex items-center space-x-2">
//             <div
//               className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer ${connectionState === "Online"
//                 ? "bg-green-500 text-white border-green-500"
//                 : connectionState === "Connecting..."
//                   ? "bg-yellow-500 text-white border-yellow-500"
//                   : "bg-red-500 text-white border-red-500"
//                 }`}
//             >
//               <span
//                 className={`w-3 h-3 rounded-full mr-2 ${connectionState === "Online"
//                   ? "bg-green-300"
//                   : connectionState === "Connecting..."
//                     ? "bg-yellow-300"
//                     : "bg-red-300"
//                   }`}
//               ></span>
//               <p className="text-sm font-semibold">{connectionState}</p>
//             </div>
//           </div>
//         </div>

//         {/* Chat Column Adjusted */}
//         <div className="w-1/3 flex flex-col items-center">
//           <div
//             ref={answersRef}
//             className="flex-grow w-full max-w-3xl mx-auto overflow-y-auto h-[400px]"
//           >
//             {chatHistory.length > 0 && (
//               <ul className="space-y-2">
//                 {chatHistory.map((msg, index) => (
//                   <li
//                     key={index}
//                     className={`flex items-center gap-2 max-w-[75%] ${msg.type === "user"
//                       ? "px-8 py-2 rounded-3xl bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-end ml-auto text-right w-fit max-w-[75%]"
//                       : "p-2 rounded-md text-black dark:text-white self-start mr-auto text-left"
//                       }`}
//                   >
//                     <p
//                       className={`${msg.type === "user" ? "text-right" : "text-left"
//                         } w-full`}
//                     >
//                       {msg.message}
//                     </p>
//                   </li>
//                 ))}
//                 <div ref={chatEndRef} />
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Text Input */}
//       <div className="flex gap-6 mt-4">
//         <div className="relative w-full mx-auto">
//           <textarea
//             rows={4}
//             ref={textArea}
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 chat();
//               }
//             }}
//             className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
//             placeholder={isListening ? "Listening..." : "Message NeuralSeek"}
//             disabled={isListening || connectionState !== "Online"}
//           />
//           <div className="absolute m-2 bottom-2 left-2 right-2 flex gap-2 items-end">
//             <button
//               onClick={chat}
//               disabled={connectionState !== "Online" || isListening}
//               className={`w-10 h-10 flex items-center justify-center rounded-full transition ${connectionState !== "Online" || isListening
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
//                 }`}
//             >
//               {connectionState !== "Online" ? (
//                 <Icon name="loader" className="w-5 h-5 animate-spin" />
//               ) : (
//                 <Icon name="paper-plane" className="w-5 h-5" />
//               )}
//             </button>
//             <button
//               onClick={startListening}
//               className={`w-10 h-10 flex items-center justify-center rounded-full transition ${isListening
//                 ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
//                 : connectionState !== "Online"
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
//                 }`}
//             >
//               <Icon name="microphone" className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Export a dynamic component with SSR disabled
// export default dynamic(() => Promise.resolve(DIDDemo), { ssr: false });


"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/Icon';

// Create a type for the SDK to use throughout the component
type SDKType = typeof import('@d-id/client-sdk');

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Create a component that loads only on client-side
const DIDDemo = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  // References for SDK and manager
  const sdkRef = useRef<SDKType | null>(null);
  const managerRef = useRef<any>(null);

  const [text, setText] = useState("");
  const [connectionState, setConnectionState] = useState("Connecting...");
  const [chatHistory, setChatHistory] = useState<{ message: string, type: "agent" | "user" }[]>([]);
  const [isListening, setIsListening] = useState(false);

  interface Auth {
    type: "key";
    clientKey: string;
  }

  // D-ID Configuration
  // const agentId = "agt_8djD6Mq8";
  // const auth: { type: "key"; clientKey: string } = { type: "key", clientKey: "Z29vZ2xlLW9hdXRoMnwxMTc5MTE2MzI0ODg4NzA1MzczMTU6MU1sQkVhMXo3dlU4WHVSRzJJTDND" };
//  const agentId = "agt_r84CvBRO";
  const agentId = "agt_yQtOWsFD";
  const auth: { type: "key"; clientKey: string } = { type: "key", clientKey: "YXV0aDB8NjdjYjUzNzM5NGQ0ZTkzZmI1ZWQ0ZmFkOlh4NXppaFNsc1QxS1NLVHZWbVVSeQ==" };
  let srcObject: any;

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

  // Load SDK dynamically and initialize agent
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loadSDKAndInitAgent = async () => {
      try {
        // Dynamically import the SDK
        const sdkModule = await import('@d-id/client-sdk');
        sdkRef.current = sdkModule;

        const callbacks = {
          onSrcObjectReady: (value: MediaStream) => {
            srcObject = value;
            if (videoElement.current) {
              videoElement.current.play();
            }
          },
          onVideoStateChange: (state: string) => {
            if (!managerRef.current || !videoElement.current) return;

            if (state === "STOP") {
              captureLastFrame();
              videoElement.current.muted = true;
              videoElement.current.srcObject = null;
              videoElement.current.src = managerRef.current.agent.presenter.idle_video;
            } else {
              videoElement.current.muted = false;
              videoElement.current.srcObject = srcObject;
            }
          },
          onConnectionStateChange: (state: string) => {
            setConnectionState(state === "connected" ? "Online" : "Disconnected");
          },
          onNewMessage: (messages: any[]) => {
            if (messages && messages.length > 0) {
              const lastMsg = messages[messages.length - 1];
              setChatHistory((prev) => [
                ...prev,
                { message: lastMsg.content, type: lastMsg.role }
              ]);
              scrollToBottom();
            }
          },
          onError: (error: any) => console.error("Error:", error),
        };

        // Initialize the agent manager
        const options = {
          compatibilityMode: "auto" as "auto",
          streamWarmup: true
        };

        const manager = await sdkModule.createAgentManager(
          agentId,
          { auth, callbacks, streamOptions: options }
        );

        managerRef.current = manager;
        manager.connect();
      } catch (error) {
        console.error("Failed to load D-ID SDK or initialize agent:", error);
        setConnectionState("Failed to connect");
      }
    };

    // Only run in browser
    if (typeof window !== 'undefined') {
      loadSDKAndInitAgent();
    }

    // Cleanup function
    return () => {
      if (managerRef.current && managerRef.current.disconnect) {
        managerRef.current.disconnect();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connectionState === "Online") {
      setTimeout(() => {
        speak("Hi! I'm Tyler. How can I help you?");
      }, 2000);
    }
  }, [connectionState]);

  const showAnswer = (answer: string, role: "agent" | "user") => {
    setChatHistory((prev) => [
      ...prev,
      { message: answer, type: role }
    ]);
    scrollToBottom();
  };

  const startListening = () => {
    try {
      if (typeof window === "undefined") return;

      if (isListening) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setText(speechResult);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
    }
  };

  const chat = async () => {
    if (text.trim() === "") return;

    const question = text;
    try {
      showAnswer(text, "user");
      setText("");

      const response = await fetch('/demos-page/api/d_id', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`API response: ${response.status}`);
      }

      const data = await response.json();

      if (data.answer) {
        speak(data.answer);
        showAnswer(data.answer, "agent");
      } else {
        showAnswer("Sorry, I couldn't process your request.", "agent");
      }
    } catch (error) {
      console.error('Error:', error);
      showAnswer("Sorry, there was an error processing your request.", "agent");
    }
  };

  const speak = (text2speak: string) => {
    if (!managerRef.current || !text2speak || text2speak.trim().length <= 2) return;

    try {
      managerRef.current.speak({ type: "text", input: text2speak });
    } catch (error) {
      console.error("Error making agent speak:", error);
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
              playsInline
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>

          {/* Connection Status */}
          <div className="mt-4 mb-2 flex items-center space-x-2">
            <div
              className={`flex items-center py-1 px-3 border rounded-full transition cursor-pointer ${connectionState === "Online"
                  ? "bg-green-500 text-white border-green-500"
                  : connectionState === "Connecting..."
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-red-500 text-white border-red-500"
                }`}
            >
              <span
                className={`w-3 h-3 rounded-full mr-2 ${connectionState === "Online"
                    ? "bg-green-300"
                    : connectionState === "Connecting..."
                      ? "bg-yellow-300"
                      : "bg-red-300"
                  }`}
              ></span>
              <p className="text-sm font-semibold">{connectionState}</p>
            </div>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chat();
              }
            }}
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl focus:ring-0 focus:outline-none resize-none pr-16"
            placeholder={isListening ? "Listening..." : "Message NeuralSeek"}
            disabled={isListening || connectionState !== "Online"}
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
};

// Export a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(DIDDemo), { ssr: false });
