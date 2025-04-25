'use client';

import React, { useRef, useState } from 'react';
import { Mic } from 'lucide-react';

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [guideText, setGuideText] = useState("Tap the button to speak");
  const [command, setCommand] = useState("");
  const [language, setLanguage] = useState("en-US");
  const animationFrameRef = useRef<number | null>(null);
  const [appointmentsData, setAppointmentsData] = useState([
    { day: 'May 1st', hour: '4:00PM', appointment: 'Book' },
    { day: 'May 1st', hour: '5:00PM', appointment: 'Book' },
    { day: 'May 2nd', hour: '3:00PM', appointment: 'Reserved' },
    { day: 'May 2nd', hour: '6:00PM', appointment: 'Book' },
  ]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const checkSilence = () => {
    console.log("Acá");
    if (!analyserRef.current) return;
  
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);
  
    let isSilent = true;
    for (let i = 0; i < bufferLength; i++) {
      if (Math.abs(dataArray[i] - 128) > 10) {
        isSilent = false;
        break;
      }
    }
  
    if (isSilent) {
      if (silenceTimerRef.current === null) {
        silenceTimerRef.current = window.setTimeout(() => {
          handleStop();
        }, 3000);
      }
    } else {
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }
  
    animationFrameRef.current = requestAnimationFrame(checkSilence);
  };

  const handleStart = async () => {
    setGuideText("Listening...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // MediaRecorder setup
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64000,
    });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.start();
    setIsRecording(true);

    // AudioContext setup for silence detection
    audioContextRef.current = new AudioContext();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    sourceRef.current.connect(analyserRef.current);
    checkSilence();
  };

  const handleStop = async () => {
    setGuideText("Processing...");
    setIsRecording(false);
    setIsProcessing(true);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlC = `${baseUrl}/voice`;
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('jsonData', JSON.stringify(appointmentsData));
        formData.append('language', language);

        const res = await fetch(urlC, {
          method: 'POST',
          body: formData,
        });

        const audioData = await res.blob();
        const updatedJson = res.headers.get('x-updated-json');
        if (updatedJson) {
          const parsedJson = JSON.parse(updatedJson);
          setAppointmentsData(parsedJson);
        }
        const url = URL.createObjectURL(audioData);
        const audio = new Audio(url);
        audio.play();

        setGuideText("Tap the button to speak");
        setIsProcessing(false);
        setCommand("");
      };

      mediaRecorderRef.current.stop();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (silenceTimerRef.current !== null) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const groupedAppointments = appointmentsData.reduce((acc, { day, hour, appointment }) => {
    if (!acc[day]) acc[day] = [];
    acc[day].push({ hour, appointment });
    return acc;
  }, {} as Record<string, { hour: string; appointment: string }[]>);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Encabezado */}
      <div className="flex items-center justify-center mb-6 mt-5">
        <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-12 h-12 mr-3" />
        <h1 className="text-3xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">
          AWS Voice Model Chatbot
        </h1>
      </div>

      <div className="flex gap-8 p-6">
        <div className="w-2/5 m-auto bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-md overflow-auto">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Upcoming Appointments
          </h2>
          <div>
            {Object.entries(groupedAppointments).map(([day, appointments]) => (
              <div key={day} className="mb-3">
                <h3 className="font-bold text-blue-700 dark:text-blue-300">{day}</h3>
                <ul className="ml-4 list-disc">
                  {appointments.map(({ hour, appointment }, index) => (
                    <li key={index}>
                      <strong>{hour}</strong>: {appointment}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex w-full items-center justify-between rounded-full bg-blue-100 p-1 dark:bg-gray-900">
            <button
              onClick={!isRecording && !isProcessing ? handleStart : undefined}
              disabled={isProcessing || isRecording}
              className={`rounded-full w-10 h-10 flex items-center justify-center transition duration-200 shadow-lg ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isRecording
                    ? 'bg-red-600 animate-pulse'
                    : 'bg-blue-600'
                }`}
            >
              <Mic size={22} color="white" />
            </button>
            <span className="mx-4">{guideText}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-full p-1 me-2 text-sm bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600"
            >
              <option value="en-US">en-US</option>
              <option value="es-US">es-US</option>
            </select>
          </div>
          <div className='flex'>
            <span className='m-auto'>
              {command !== "" ? "Received audio: " + command : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
