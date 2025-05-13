"use client";
import { marked } from "marked";
import React, { useState } from "react";
import Icon from "@/components/Icon";
import ChatHeader from "../../components/ChatHeader";
import axios from "axios";
import SeekModal from "../../components/SeekModal";
export default function DocAnalyzerDemo() {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chatHistory, setChatHistory] = useState<
  { sender: string; message: string; document?: string; modalData?: { directAnswer: string; passages: any[] } }[]
>([]);
  const [isLoading, setLoading] = useState(false);

  const models = [
    { label: "BI36UORH", image: "cea9b0c0-d682-4025-92a8-b1a19fd90942.jpg" },
    { label: "BI42UFDO", image: "6ce1b325-93ff-41eb-bcd5-d92d241f53c6.png" },
    { label: "BI48SO", image: "13e5f339-25b6-4be2-ae04-4db3267ecbd4.png" },
    { label: "SHS863WD5N", image: "a0b6c171-0d5f-4149-8be7-87fad0c35e85.png" },
    { label: "GFW850SPNRS", image: "e20e06dc-0950-455b-8e5f-b5ab86fccf8a.jpg" },
    { label: "GFW650SSNWW", image: "78bee15a-7ed5-42be-b995-4bbff69268f3.jpg" },
    { label: "GFW850SSNWW", image: "c2994215-d11d-4b78-871f-558f0a3bb503.jpg" },
    { label: "SHP865ZP5N", image: "3d7b5f55-b31c-4ecd-8510-3a95d3888f19.jpg" },
    { label: "SHP878ZP5N", image: "fc82a6bb-e9c7-4327-b26e-ab327cc63692.jpg" },
  ];
  const filenameMap: Record<string, string> = {
  "49ba735c-3d25-4334-9755-84d5688910a9.pdf": "Quick Guide",
  "e227aeee-3c55-4eb1-ba96-c381bdc80d01.pdf": "Use and Care Guide",
  "3658e8ce-10ac-48e1-b4b9-8219d082b0bf.pdf": "Extended Height Guide",
  "a3bfdab8-a6a2-498a-92aa-adc985729fba.pdf": "Sub-Zero Design Guide",
  "77ab1479-7364-4d29-8981-6635fa70d5b2.pdf": "Classic Installation",
  "07329bc4-beea-4368-824e-7c14e01eb953.pdf": "Sabbath Mode Guide",
  "1be18517-7dc3-4ed4-a00d-65dfabb27a26.pdf": "Energy Guide",
  "d05bef51-f746-42e7-98e1-d9afefcf0aed.pdf": "Specification Sheet",
  "259142f3-2036-44ce-9314-76aea4a21545.pdf": "Energy Guide",
  "ef47eaa7-6918-4583-9d80-a76b9e17f8ad.pdf": "Manual",
  "91a6fb0e-cae0-4c12-937f-74476203902d.pdf": "Manual",
  "c7f65da7-2318-4b3a-97cf-01da9c10eb0b.pdf": "Specification Sheet",
  "313e2af7-b3bb-45f5-a7da-4f1d91a0eb70.pdf": "Energy Guide",
  "33108824-65e3-4a54-af3e-83fb765c5da0.pdf": "User Manual",
  "31196e90-757f-43a3-817e-f67655c5c508.pdf": "Quick Guide",
  "2b62d514-bda2-4ad9-8e8e-cfb316b02047.pdf": "Installation Instructions",
  "b9759457-02d6-4255-9991-49f92f799876.pdf": "Specification Sheet",
  "643e247e-8179-4517-9e00-a2a9a6aa8073.pdf": "Energy Guide",
  "32c86a84-fdee-4bf6-b0c0-dd0ef0b3e0a6.pdf": "Energy Guide",
  "2455697b-008d-46ec-a522-f70cd9479299.pdf": "Manual",
  "70ad1d8e-7d28-4669-854f-9a0e16061a3b.pdf": "Installation",
  "f7d47aff-07b5-4bbb-8584-a37937e022a1.pdf": "Specification Sheet",
  "624dfafa-6be5-44a1-861f-7af69648867d.pdf": "Owner's Manual",
  "4bbc6696-410b-4341-87af-dbf93e834f8d.pdf": "Quick Installation Guide",
  "59b2df83-7cdb-4244-8e91-71e7efdeef45.pdf": "Specification Sheet",
  "6c13b0f6-3bf8-4d4e-8a27-f1d91c50fb85.pdf": "Energy Guide",
  "ce1d2e9e-a3a7-4546-968b-9f731aa125bf.pdf": "Owner's Manual",
  "230ac599-7012-44ba-b684-680717ed7124.pdf": "Quick Installation Guide",
  "85e9081a-38ff-4f6c-bb0c-c5b0759793e7.pdf": "Specification Sheet",
  "45fa1e91-daa2-462c-8311-7294712decb2.pdf": "Energy Guide",
  "61fca4ca-757f-4ddc-9ca0-845ce0f797bf.pdf": "Owner's Manual",
  "14a18edd-ad02-48e6-b0f3-045c31e9c5c2.pdf": "Quick Installation Guide",
  "9399ee11-36a1-41b6-afd8-7f92bff986e6.pdf": "Specification Sheet",
  "dca92de9-9803-42fa-9c17-b9eb5737d98c.pdf": "Energy Guide",
  "9d4fa961-ccf8-4a65-9b43-56dd1f8edafe.pdf": "Installation Instructions",
  "836c1f64-6e32-4324-8633-f558f3d57bcd.pdf": "Use and Care Guide",
  "790f62a3-ebfb-44d8-87c0-4f5a31f91fb4.pdf": "Specification Sheet",
  "48b042ae-f8c4-437b-8f31-2230898c1341.pdf": "Energy Guide",
};

  const selectedModelObj = models.find((m) => m.label === selectedModel);
  const imageUrl = selectedModelObj ? `https://linqcdn.avbportal.com/images/${selectedModelObj.image}` : null;
  const [modelSearch, setModelSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalData, setModalData] = useState<{ directAnswer: string; passages: any[] }>({
          directAnswer: "",
          passages: []
      });
  // Filtrado
  const filteredModels = models.filter((model) =>
    model.label.toLowerCase().includes(modelSearch.toLowerCase())
  );
  function convertTextToList(text: any) {
    const lines = text
        .split("\n")
        .map((line: any) => line.trim())
        .filter((line: any) => line !== "");
    let htmlContent = "";
    let ulLevel = 0;

    lines.forEach((line: any) => {
        if (line.startsWith("-")) {
            if (ulLevel === 0) {
                htmlContent += "<ul>";
                ulLevel++;
            }
            htmlContent += `<li>${line.substring(1).trim()}</li>`;
        } else {
            if (ulLevel > 0) {
                htmlContent += "</ul>";
                ulLevel = 0;
            }
            htmlContent += `<p>${line}</p>`;
        }
    });

    if (ulLevel > 0) {
        htmlContent += "</ul>";
    }

    return htmlContent;
}

  const performSearch = async () => {
    if (!selectedModel || !query) return;
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const urlMaistro = `${baseUrl}/neuralseek/maistro`;

      const formattedQuery = `${selectedModel} ${query}`;

      const maistroCallBody = {
        url_name: "customized-troubleshooter",
        agent: "troubleshooting",
        options: {
                    returnVariables: true,
                    returnVariablesExpanded: false
                },
        params: [
            { name: "prompt", value: formattedQuery },
        ],
      };

      const response = await axios.post(urlMaistro, maistroCallBody, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await JSON.parse(response.data.answer);
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", message: formattedQuery },
        {
          sender: "bot",
          message: marked.parse(data.answer || "No response") as string,
          // message: data.answer || "No response",
          document: data.document,
          modalData: {
            directAnswer: convertTextToList(data.ufa),
            passages: data.passages.map((el: any) => ({
              ...el,
              url: "https://linqcdn.avbportal.com/documents/" + el.url,
            })),
          },
        },
      ]);
      data.passages.forEach((el:any)=>{
        const displayName = filenameMap[el.document!] || el.document;
        el.document = displayName;
      })
      setModalData({ directAnswer: convertTextToList(data.ufa), passages: data.passages });
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
    setQuery("");
  };

  return (
    <section className="h-[100%] w-2/3 m-auto flex flex-col dark:bg-gray-900 dark:text-white">
      {/* Chat e Imagen */}
      <div className="flex flex-1">
        {/* Imagen del modelo */}
        <div className="w-1/3 flex items-center justify-center p-4 border-r dark:border-gray-700">
          {imageUrl ? (
            <img src={imageUrl} alt={selectedModel} className="max-w-[90%] object-contain rounded shadow" />
          ) : (
            <p className="text-gray-400">Select a model to view its image</p>
          )}
        </div>

        {/* Chat */}
        <div className="w-2/3 flex flex-col overflow-y-auto p-4">
          {chatHistory.length === 0 ? (
            <ChatHeader
              title="NeuralSeek Chat"
              subtitle="Troubleshoot appliance issues"
              image=""
              handlePrePromptClick={() => {}}
            />
          ) : (
            <div className="space-y-4">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg w-fit max-w-[80%] ${
                    msg.sender === "user"
                      ? "p-3 me-0 ms-auto bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.message }} />
                  {msg.document && (
                    <div
                    className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => {
                      setModalData({
                        directAnswer: msg.modalData?.directAnswer || "",
                        passages: msg.modalData?.passages || [],
                      });
                      setIsModalOpen(true);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 012 0v4a1 1 0 11-2 0v-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>See the Seek and Knowledge base analysis.</span>
                </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inputs abajo */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex gap-2 items-center w-full">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="p-3 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg w-1/3 text-sm"
          >
            <option value="" disabled>
              Select Model
            </option>
            {models.map((model) => (
              <option key={model.label} value={model.label}>
                {model.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Describe the issue"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-3 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          />

          <button
            onClick={performSearch}
            disabled={isLoading || !selectedModel || !query}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <Icon name="loader" className="w-5 h-5 animate-spin" />
            ) : (
              <Icon name="paper-plane" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <SeekModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                directAnswer={modalData.directAnswer}
                passages={modalData.passages}
            />
    </section>
    
  );
}
