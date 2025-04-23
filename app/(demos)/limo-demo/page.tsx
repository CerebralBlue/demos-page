"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import './limo.css';
import Icon from '@/components/Icon';
import axios from "axios";

interface IntroResponse {
  answer: string;
}

interface BookingResponse {
  answer: string;
}

const LimosDemo: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const [introData, setIntroData] = useState<string>("");
  const topRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<{ place: string; time: string }[]>([]);
  const [usedTimes, setUsedTimes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  type BookingResult = {
    place: string;
    coords?: { lat: number; lng: number };
    bookingMessage?: string;
    rawAnswer?: string;
  };

  const [results, setResults] = useState<BookingResult[]>([]);
  const availableTimes = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        const maistroCallBody = {
          url_name: "NS-ES-V2",
          agent: "limos_intro",
          params: [
            {
              name: "city",
              value: "Los Angeles"
            }
          ]
      };
      const response = await axios.post(urlMaistro, maistroCallBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
  
        const data: IntroResponse = await response.data;

        let cleanedText = data.answer
          .replace(/^```markdown\n?/, "")
          .replace(/^```\n?/, "")
          .replace(/\n```$/, "")
          .replace(/```$/, "")
          .trim();

        setIntroData(cleanedText);
      } catch (error) {
        console.error("Error fetching intro data:", error);
      }
    };

    fetchIntro();
  }, []);

  const handleSendQuery = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setIsLoading(true);

    // Lógica para mensajes escritos manualmente por el usuario
    if (!customQuery) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const urlMaistro = `${baseUrl}/neuralseek/maistro`;

        const maistroCallBody = {
          url_name: "NS-ES-V2",
          agent: "limos-chat",
          params: [
            {
              name: "place",
              value: "Los Angeles"
            },
            {
              name:"answer",
              value: q
            }
          ]
      };
      const response = await axios.post(urlMaistro, maistroCallBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

        const data: BookingResponse = await response.data;
        setResults((prev) => [
          ...prev,
          { place: q, rawAnswer: data.answer },
        ]);

        setTimeout(() => {
          mapRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (error) {
        console.error("Error sending chat message:", error);
      }

      setIsLoading(false);
      setQuery("");
      return;
    }

    // Lógica para ítems sugeridos o botones predefinidos
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const urlMaistro = `${baseUrl}/neuralseek/maistro`;

      const maistroCallBody = {
        url_name: "NS-ES-V2",
        agent: "booking",
        params: [
          {
            name: "place",
            value: q
          },
          {
            name:"city",
            value: "Los Angeles"
          }
        ]
    };

    const response = await axios.post(urlMaistro, maistroCallBody, {
      headers: {
          'Content-Type': 'application/json',
      },
  });

      const data: BookingResponse = await response.data;
      let answer = data.answer.trim();

      answer = answer.replace(/\.(\s|\}|$)/, ".0$1");

      try {
        const parsed = JSON.parse(answer + "}");

        if (parsed.lat !== undefined && parsed.lng !== undefined) {
          setResults((prev) => [
            ...prev,
            {
              place: q,
              coords: { lat: parsed.lat, lng: parsed.lng },
            },
          ]);
        } else {
          setResults((prev) => [
            ...prev,
            { place: q, rawAnswer: data.answer },
          ]);
        }
      } catch (parseErr) {
        console.warn("Could not parse as JSON:", parseErr);
        setResults((prev) => [
          ...prev,
          { place: q, rawAnswer: data.answer },
        ]);
      }

      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error sending booking query:", error);
    }

    setIsLoading(false);
    if (!customQuery) setQuery("");
  };

  const handleBookingTime = (index: number, time: string) => {
  const selectedPlace = results[index].place;

  setResults((prev) =>
    prev.map((r, i) =>
      i === index ? { ...r, bookingMessage: `Okay, I'll add that to the itinerary. See you at ${time}.` } : r
    )
  );

  setItinerary((prev) => [...prev, { place: selectedPlace, time }]);
  setUsedTimes((prev) => [...prev, time]);
  setShowSuggestions(true);

  setTimeout(() => {
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

  const CustomMarkdownComponents = {
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="grid grid-cols-3 gap-3 mt-4">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => {
      const text = React.Children.toArray(children)
        .map((child) => {
          if (typeof child === "string") return child;
          if (typeof child === "object" && "props" in child) return child.props.children;
          return "";
        })
        .join("")
        .replace(/^\*\*/, "")
        .replace(/\*\*$/, "")
        .trim();

      return (
        <li>
          <div
            className="m-0 flex h-[60px] p-3 w-full bg-gray-200 border border-gray-400 dark:border-gray-600 rounded-full dark:bg-gray-800 hover:bg-transparent dark:hover:bg-transparent transition cursor-pointer"
            onClick={() => handleSendQuery(text)}
          >
            <p className="text-sm m-auto font-semibold text-center text-gray-500 dark:text-gray-300">
              {children}
            </p>
          </div>
        </li>
      );
    },
  };

  return (
    <section className="flex flex-col items-center p-6 dark:bg-gray-900 dark:text-white">
      
      <div className="flex w-full max-w-6xl space-x-6">
        <div className="flex-1">
        <div className="flex items-center justify-center mb-6">
        <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-12 h-12 mr-3" />
        <h1 className="text-3xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">Accredited Limo</h1>
      </div>

      <div
        
        className="w-full max-w-5xl flex-1 overflow-y-auto mb-0 p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4"
        style={{ maxHeight: "60vh" }}
      >
        {introData && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded"
          ref={topRef}>
            <ReactMarkdown
            
              remarkPlugins={[remarkGfm]}
              components={CustomMarkdownComponents}
            >
              {introData}
            </ReactMarkdown>
          </div>
        )}

        {results.map((res, index) => (
          <div key={index} className="mt-6" ref={mapRef}>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {res.coords ? `Here is the location you asked for: **${res.place}**` : res.rawAnswer || ""}
              </ReactMarkdown>
            </div>

            {res.coords && (
              <>
                <iframe
                  title={`map-${index}`}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "12px", marginTop: "20px" }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${res.coords.lat},${res.coords.lng}&z=15&output=embed`}
                ></iframe>

                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">Select a preferred time range:</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleBookingTime(index, time)}
                      disabled={usedTimes.includes(time)}
                      className={`p-3 w-full border rounded-full transition cursor-pointer 
                        ${usedTimes.includes(time)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                      {time}
                    </button>
                  ))}
                  </div>
                  {res.bookingMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                      {res.bookingMessage} Do you need anything else?
                    </div>
                  )}
                 
                </div>
                
              </>
            )}
          </div>
          
        ))}
         {showSuggestions && (
                    <div className="mt-6">
                      <button
                        onClick={() => {setShowSuggestions(false);topRef.current?.scrollIntoView({ behavior: "smooth" });}}
                        className="mr-4 p-2 bg-blue-500 text-white rounded">Visit another place</button>
                      <button
                        className="p-2 bg-green-600 text-white rounded">Finish</button>
                    </div>
                  )}
      </div>
           </div>
        <div className="w-1/5 p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h2 className="text-xl font-bold mb-4">My itinerary</h2>
          {itinerary.map((item, i) => (
            <div key={i} className="mb-2">
              <p><strong>{item.time}</strong> - {item.place}</p>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default LimosDemo;