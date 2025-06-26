import React from "react";
import DOMPurify from "dompurify";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface SeekHistoryProps {
  chatTitle: string;
  messages: { type: "agent" | "user"; message?: string | { initialResponse?: any; finalResponse?: any; thinkingButton?: any; graphs?: any } }[];
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const SeekChatHistory: React.FC<SeekHistoryProps> = ({ chatTitle, messages, chatEndRef }) => {
  // Function to parse user messages and format prompt and file references
  const formatUserMessage = (message: string) => {
    // First, escape any HTML entities to prevent formatting conflicts
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Escape the message first
    let escapedMessage = escapeHtml(message);

    // Now apply our formatting using regex
    // Regex to match text in quotes and angle brackets (now with escaped entities)
    const promptRegex = /&quot;([^&]*?)&quot;/g;
    const fileRegex = /&lt;([^&]*?)&gt;/g;

    // Replace prompts in quotes with styled spans
    let formattedMessage = escapedMessage.replace(promptRegex, (match, content) => {
      return `<span class="text-blue-600 dark:text-blue-400">"${content}"</span>`;
    });

    // Replace file references with styled spans
    formattedMessage = formattedMessage.replace(fileRegex, (match, content) => {
      return `<span class="text-green-600 dark:text-green-400">&lt;${content}&gt;</span>`;
    });

    return formattedMessage;
  };

  // Sanitize HTML to prevent XSS attacks
  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  const formattedCurrentDate = () => {
    function capitalizar(str: any) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const today = new Date();
    const month = today.toLocaleString('en-US', { month: 'long' });
    const dia = today.getDate();
    let horas = today.getHours();
    const minutos = today.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'pm' : 'am';
    horas = horas % 12 || 12;
    return `${capitalizar(month)} ${dia} ${horas}:${minutos} ${ampm}`;
  }

  return (
    <>
      <div className="w-full pb-4 rounded-lg mb-4 bg-transparent text-center">
        {/* Chat Title */}
        <div className="text-center pt-3 mb-3 sticky top-0 z-[10]">
          <div className="inline-flex flex-row items-center justify-center border rounded-2xl text-sm font-semibold mx-auto py-2 px-4 bg-white gap-2">
            {`${chatTitle} ${formattedCurrentDate()}`}
            <ChevronDownIcon className="w-3 h-3" />
          </div>
        </div>

        {/* Messages */}
        {
          messages.length > 0 && (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li
                  key={`chatHistoryItem${index}`}
                  className={`flex flex-col items-start gap-1 ${msg.type === "user"
                    ? "items-end px-4 py-2 rounded-2xl bg-blue-800 dark:bg-gray-700 text-white dark:text-white self-end ml-auto mr-2 text-right w-fit max-w-[75%]"
                    : "p-2 rounded-md text-black dark:text-white self-start mr-auto text-left max-w-[75%]"
                    }`}
                >
                  <div className="relative w-full">
                    {
                      msg.type === 'user' && typeof msg.message === 'string'
                        ? (
                          <p className="text-left w-full" dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(formatUserMessage(msg.message)),
                          }}
                          />
                        )
                        : typeof msg.message === 'object' ? (
                          <>
                            {msg.message.initialResponse}
                            {msg.message.finalResponse}
                            {msg.message.thinkingButton}
                            {msg.message.graphs && msg.message.graphs.map((e: any) => {
                              return (
                                <div className="ms-2 my-2">
                                  {e}
                                </div>
                              )
                            })}
                          </>
                        )
                        : ''
                    }
                  </div>
                </li>
              ))}
              <div ref={chatEndRef} />
            </ul>
          )
        }
      </div>
    </>
  );
};

export default SeekChatHistory;