"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import './limo.css';

interface IntroResponse {
  answer: string;
}

interface BookingResponse {
  answer: string;
}

const LimosDemo: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [introData, setIntroData] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapDescription, setMapDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingMessage, setBookingMessage] = useState<string>("");

  // Array de horarios disponibles
  const availableTimes = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const response = await fetch("/demos-page/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: "limos_intro",
            params: { city: "Los Angeles" },
          }),
        });
        const data: IntroResponse = await response.json();

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

    try {
      const response = await fetch("/demos-page/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "booking",
          params: { place: q, city: "Los Angeles" },
        }),
      });

      const data: BookingResponse = await response.json();
      const parsed = JSON.parse(data.answer + "}");
      setMapCoords({ lat: parsed.lat, lng: parsed.lng });
      setMapDescription(`Here is the location you asked for: **${q}**`);

      // Scroll al mapa
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error sending booking query:", error);
    }

    setIsLoading(false);
    if (!customQuery) setQuery("");
  };

  // Función para manejar la selección de un horario
  const handleBookingTime = (time: string) => {
    setBookingMessage(`Reservation confirmed for ${time}.`);
  };

  const CustomMarkdownComponents = {
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="grid grid-cols-3 gap-3 mt-4">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => {
      const text = String(children).replace(/^\*\*/, "").replace(/\*\*$/, "").trim();

      return (
        <li>
          <div
            className="m-0 flex h-[60px] p-3 w-full border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
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
    <section className="flex flex-col items-center justify-between min-h-screen p-6 dark:bg-gray-900 dark:text-white">
      <div className="flex items-center justify-center mb-6">
            <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-12 h-12 mr-3" />
            <h1 className="text-3xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">Accredited Limo</h1>
        </div>

      <div
        className="w-full max-w-5xl flex-1 overflow-y-auto mb-0 p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4"
        style={{ maxHeight: "60vh" }}
      >
        {introData && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={CustomMarkdownComponents}
            >
              {introData}
            </ReactMarkdown>
          </div>
        )}

        {mapCoords && (
          <div ref={mapRef}>
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {mapDescription}
              </ReactMarkdown>
            </div>
            <iframe
              title="map"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
            ></iframe>

            {/* Sección de horarios para el booking */}
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Select a preferred time range:</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleBookingTime(time)}
                    className="p-3 w-full border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    {time}
                  </button>
                ))}
              </div>
              {bookingMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                  {bookingMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl mt-0 mb-5">
        <textarea
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendQuery();
            }
          }}
          className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
          placeholder="Ask about booking details..."
        />
        <button
          onClick={() => handleSendQuery()}
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </div>
    </section>
  );
};

export default LimosDemo;
