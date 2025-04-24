'use client';

import React, { useRef, useState } from 'react';
import { Mic } from 'lucide-react';

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [guideText, setGuideText] = useState("Hold the button for speaking");
  const [command, setCommand] = useState("");
  const [appointmentsData, setAppointmentsData] = useState([
    { day: 'May 1st', hour: '4:00PM', appointment: 'Book' },
    { day: 'May 1st', hour: '5:00PM', appointment: 'Book' },
    { day: 'May 2nd', hour: '3:00PM', appointment: 'Reserved' },
    { day: 'May 2nd', hour: '6:00PM', appointment: 'Book' },
  ]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStart = async () => {
    setGuideText("Listening...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64000,
    });

    chunksRef.current = [];
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStop = async () => {
    setGuideText("Recording...");
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlC = `${baseUrl}/voice`;
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('jsonData', JSON.stringify(appointmentsData));
        setGuideText("Processing...");
        const res = await fetch(urlC, {
          method: 'POST',
          body: formData,
        });

        const audioData = await res.blob();
        const updatedJson = res.headers.get('x-updated-json');
        setCommand(res.headers.get('x-text-to-speak') ?? "");
        if (updatedJson) {
          const parsedJson = JSON.parse(updatedJson);
          setAppointmentsData(parsedJson);
          console.log(parsedJson);
        }
        const url = URL.createObjectURL(audioData);
        const audio = new Audio(url);
        audio.play();
        setGuideText("Hold the button for speaking")
        setIsProcessing(false);
      };

      mediaRecorderRef.current.stop();
    }
  };

  const groupedAppointments = appointmentsData.reduce((acc, { day, hour, appointment }) => {
    if (!acc[day]) acc[day] = [];
    acc[day].push({ hour, appointment });
    return acc;
  }, {} as Record<string, { hour: string; appointment: string }[]>);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="flex items-center justify-center mb-6 mt-5">
        <img
          src="/demos-page/neuralseek_logo.png"
          alt="NeuralSeek Logo"
          className="w-12 h-12 mr-3"
        />
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
          <div className="flex w-full rounded-full bg-blue-100 p-1 dark:bg-gray-900">
            <button
              onMouseDown={!isProcessing ? handleStart : undefined}
              onMouseUp={!isProcessing ? handleStop : undefined}
              onTouchStart={!isProcessing ? handleStart : undefined}
              onTouchEnd={!isProcessing ? handleStop : undefined}
              disabled={isProcessing}
              className={`rounded-full w-10 h-10 flex items-center justify-center transition duration-200 shadow-lg ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isRecording
                    ? 'bg-red-600 animate-pulse'
                    : 'bg-blue-600'
                }`}
            >
              <Mic size={22} color="white" />
            </button>
            <span className='m-auto'>
              {guideText}
            </span>
          </div>
          <div className='flex'>
            <span className='m-auto'>
                {command != "" ? 
                ("Received audio: " + command)
                :
                ("")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
