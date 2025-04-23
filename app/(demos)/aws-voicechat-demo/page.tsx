'use client';

import React, { useRef, useState } from 'react';
import { Mic } from 'lucide-react';



export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState([
    { day: 'May 1st', hour: '4:00PM', appointment: 'Book' },
    { day: 'May 1st', hour: '5:00PM', appointment: 'Book' },
    { day: 'May 2nd', hour: '3:00PM', appointment: 'Reserved' },
    { day: 'May 2nd', hour: '6:00PM', appointment: 'Book' },
  ]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStart = async () => {
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
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioBuffer = await audioBlob.arrayBuffer();

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlC = `${baseUrl}/voice`;
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('jsonData', JSON.stringify(appointmentsData));
        const res = await fetch(urlC, {
          method: 'POST',
          body: formData,
        });

        const audioData = await res.blob();
        const updatedJson = res.headers.get('x-updated-json');

        if (updatedJson) {
          const parsedJson = JSON.parse(updatedJson);
          setAppointmentsData(parsedJson);
          console.log(parsedJson)
        }
        const url = URL.createObjectURL(audioData);
        const audio = new Audio(url);
        audio.play();
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
    <div className="flex gap-8 p-6">
      <div className="flex items-center justify-center w-3/5">
        <button
          onMouseDown={handleStart}
          onMouseUp={handleStop}
          onTouchStart={handleStart}
          onTouchEnd={handleStop}
          className={`rounded-full w-72 h-72 flex items-center justify-center transition duration-200 ${
            isRecording ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
          }`}
        >
          <Mic size={92} color="white" />
        </button>
      </div>

      <div className="w-2/5 bg-gray-100 rounded-xl p-4 shadow-md overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
        {Object.entries(groupedAppointments).map(([day, appointments]) => (
          <div key={day} className="mb-3">
            <h3 className="font-bold text-blue-700">{day}</h3>
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
    </div>
  );
}
