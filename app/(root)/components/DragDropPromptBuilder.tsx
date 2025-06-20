import Icon from '@/components/Icon';
import { ASSETS, TOPICS } from '@/constants';
import { DragItem } from '@/types/drag.item';
import { ListItem } from '@/types/list.item';
import { SimplifiedPrompt } from '@/types/simplified.prompt';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export function transformPrompt(): SimplifiedPrompt[] {
  return TOPICS.map(topic => ({
    id: topic.id,
    content: topic.content,
    category: "topic",
    sub_topics: (topic.sub_topics ?? []).map(sub_topic => ({
      id: sub_topic.id,
      content: sub_topic.content,
      category: "sub_topic"
    }))
  }));
}

export function transformAssets(): DragItem[] {
  return ASSETS.map(template => ({
    id: template.id,
    content: template.title,
    category: "template",
    template: template.template,
    prompt: template.prompt
  }));
}

interface DragDropPromptBuilderProps {
  onOutput?: (content: string) => void;
}

const DragDropPromptBuilder: React.FC<DragDropPromptBuilderProps> = ({ onOutput }) => {

  const [assetsItems] = useState<ListItem[]>(
    transformAssets()
  );
  const [topicsItems] = useState<ListItem[]>(
    transformPrompt()
  );

  const [docs, setDocs] = useState<{ id: string, name: string, text: string, title: string, type: string, asset_type: string }[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<{ id: string, name: string, text: string } | null>(null);
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
  const [items, setItems] = useState(selectedItems);

  const [draggedItem, setDraggedItem] = useState<ListItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [title, setTitle] = useState<string>("Cancer Overview");

  const [subtopics, setSubtopics] = useState<string[]>(["Cancer Definition", "Cancer Cells", "Cancer Treatment"]);
  const [currentSubtopic, setCurrentSubtopic] = useState<string>('');

  const [context, setContext] = useState<string[]>([]);
  const [currentContext, setCurrentContext] = useState('');

  const handleDragStart = (e: React.DragEvent, item: ListItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragOverIndex = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedItem) {
      // Check if item already exists in selected list
      const existingIndex = selectedItems.findIndex(item => item.id === draggedItem.id);
      if (existingIndex === -1) {
        setSelectedItems([...selectedItems, draggedItem]);
      }
    }
    setDraggedItem(null);
  };

  const handleDropAtIndex = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedItem) {
      const existingIndex = selectedItems.findIndex(item => item.id === draggedItem.id);

      if (existingIndex === -1) {
        // Adding new item
        const newItems = [...selectedItems];
        newItems.splice(targetIndex, 0, draggedItem);
        setSelectedItems(newItems);
      } else {
        // Reordering existing item
        const newItems = [...selectedItems];
        newItems.splice(existingIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        setSelectedItems(newItems);
      }
    }
    setDraggedItem(null);
  };

  const handleInternalDragStart = (e: React.DragEvent, item: ListItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const removeItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const clearSelected = () => {
    setSelectedItems([]);
    // setCommands([]);
  };

  const generateAsset = async () => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const urlMaistro = `${baseUrl}/neuralseek/maistro`;
      let maistroCallBody = {};

      // Get assest type kb
      const selectedTemplate = selectedItems.find((item) => item.category === 'template');
      maistroCallBody = {
        url_name: "prod-admed-demo",
        agent: "query_docs_by_type",
        params: [
          {
            name: "assetType",
            value: selectedTemplate?.content
          }
        ],
        options: {
          returnVariables: false,
          returnVariablesExpanded: false
        }
      };
      const kbResponse = await axios.post(urlMaistro, maistroCallBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const assetKb = kbResponse.data.answer;
      const parseKb = JSON.parse(assetKb);

      // Format KB for LLM call
      let docsContent = "";
      for (const obj of parseKb.hits.hits) {
        docsContent += `ID: ${obj._source.id}\n`;
        docsContent += `Name: ${obj._source.name}\n`;
        docsContent += `Page: ${obj._source.page}\n`;
        docsContent += `Asset Type: ${obj._source.asset_type}\n`;
        docsContent += `Content:\n${obj._source.text}\n\n`;
      }

      // LLM call
      maistroCallBody = {
        url_name: "prod-admed-demo",
        agent: "llm_call",
        params: [
          {
            name: "prompt",
            value: `Use this topic and subtopics to create a list with the module name of this Assessment Questions document. Your output should be a list of video names. Titled with the main topic. This will be used to generate an assessment questions document later. Focus on providing the titles and the structure, not content.
            * Topic: ${title}
              - Subtopics:
              ${subtopics.map(sub => `    - ${sub}`).join('\n')}`
          }
        ],
        options: {
          returnVariables: false,
          returnVariablesExpanded: false
        }
      };
      const titlesResponse = await axios.post(urlMaistro, maistroCallBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const titles = titlesResponse.data.answer;
      console.log(titles)

      // Generate asset
      maistroCallBody = {
        url_name: "prod-admed-demo",
        agent: "llm_call",
        params: [
          {
            name: "prompt",
            value: `Use this structure and the content of the Knowledge Base to generate an assessment questions document. Make sure to provide a good reference based on the material. Output Markdown to give it formatting. Also make sure to consider the template for the asset.

            Template:
            ${selectedTemplate?.template}
            
            Titles Structure:[
              ${titles}
            ]

            Documentation:[
              ${docsContent}
            ]`
          }
        ],
        options: {
          returnVariables: false,
          returnVariablesExpanded: false
        }
      };
      const assetResponse = await axios.post(urlMaistro, maistroCallBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const assetMarkdown = assetResponse.data.answer;
      console.log(assetMarkdown)

      // Send content to parent component
      onOutput?.(assetMarkdown);

    } catch (error) {
      console.error("Error generating asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubtopic = () => {
    if (currentSubtopic.trim()) {
      setSubtopics([...subtopics, currentSubtopic.trim()]);
      setCurrentSubtopic('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleAddSubtopic();
    }
  };

  const removeSubtopic = (index: any) => {
    setSubtopics(subtopics.filter((_, i) => i !== index));
  };

  const handleAddContext = () => {
    if (currentContext.trim()) {
      setContext([...context, currentContext.trim()]);
      setCurrentContext('');
    }
  };

  const handleContextKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddContext();
    }
  };

  const handleDocSelection = (outline: { id: string, name: string, text: string }) => {
    setSelectedDoc(outline);
    setIsDocDropdownOpen(false);
  };

  const fetchDocs = async () => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const urlMaistro = `${baseUrl}/neuralseek/maistro`;
      const maistroCallBody = {
        url_name: "prod-admed-demo",
        agent: "query_docs_by_type",
        params: [{ name: "assetType", value: "Generation" }],
        options: {
          returnVariables: false,
          returnVariablesExpanded: false
        }
      };

      const maistroResponse = await fetch(urlMaistro, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maistroCallBody)
      });

      if (!maistroResponse.ok) {
        throw new Error(`HTTP error! status: ${maistroResponse.status}`);
      }

      const responseData = await maistroResponse.json();

      const filesList = JSON.parse(responseData.answer)?.hits?.hits || [];
      const files = filesList.map((item: any) => {
        const source = item._source || {};
        return {
          id: source._id || source.id || 'N/A',
          name: source.name || 'Untitled',
          title: source.title || source.name || 'Untitled',
          type: source.type || 'Unknown',
          asset_type: source.asset_type || 'N/A',
          // text: source.text || '',
          // structure: source.structure || ''
        };
      });

      setDocs(files);
      // setError(null);
    } catch (err) {
      console.error("Error fetching documents:", err);
      // setError("Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);


  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-4">

        <div className="space-y-6">
          {/* Title Input*/}
          {/* <div className="flex flex-col">
            <label htmlFor="title-input" className="block text-sm font-medium mb-2">
              Topic
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your topic..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}

          {/* Subtopics and Context Section */}
          {/* <div className="flex gap-6">
            <div className="flex flex-col flex-1">
              <label className="block text-sm font-medium mb-2">
                Subtopics
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentSubtopic}
                  onChange={(e) => setCurrentSubtopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a subtopic..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleAddSubtopic}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                  title="Add subtopic"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="context-input" className="block text-sm font-medium mb-2">
                Context & Instructions
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  id="context-input"
                  type="text"
                  value={currentContext}
                  onChange={(e) => setCurrentContext(e.target.value)}
                  onKeyPress={handleContextKeyPress}
                  placeholder="Add context or instruction..."
                  className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={handleAddContext}
                  className="px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center justify-center"
                  title="Add context"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-4 rounded-lg shadow">
          {/* Templates List */}
          <div className="bg-white dark:bg-gray-800 p-3 flex flex-col max-h-96 overflow-y-auto">
            <h2 className="text-base font-semibold mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span> Templates
            </h2>
            <div className="overflow-y-auto space-y-2 flex-1">
              {assetsItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-sm cursor-grab hover:shadow transition"
                >
                  <div className="flex justify-between items-center">
                    <span>{item.content}</span>
                    {item.category && (
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Items List */}
          <div className="bg-white dark:bg-gray-800 p-3 flex flex-col max-h-120 overflow-y-auto">

            <div className="flex justify-between mb-2">
              {selectedItems.length > 0 && (
                <>
                  <a
                    onClick={() => { clearSelected() }}
                    className={`flex items-center py-1 px-3 transition cursor-pointer`}
                  >
                    <Icon
                      name="trash"
                      className={`w-5 h-5 text-white mr-2`}
                    />
                    <p
                      className={`text-sm font-semibold text-white`}
                    >
                    </p>
                  </a>
                  <div className="flex items-center justify-between mb-2">
                    <button
                    >
                      {isLoading ? (
                        <Icon name="loader" className="w-5 h-5 animate-spin" />
                      ) : (
                        <></>
                      )}
                    </button>

                    <button
                      onClick={() => generateAsset()}
                      disabled={isLoading}
                      className={`flex items-center py-1 px-3 border rounded-full transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white border-blue-500`}
                    >
                      {isLoading ? (
                        <>
                          <Icon name="loader" className="w-5 h-5 animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        'Generate'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Title and Context Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
              {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {subtopics.map((subtopic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {subtopic}
                    <button
                      onClick={() => removeSubtopic(index)}
                      className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {context && Array.isArray(context) && (
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                  {context.map((item, index) => (
                    <li key={index} className="whitespace-pre-wrap">{item}</li>
                  ))}
                </ul>
              )} */}

              {/* Docs Selection Dropdown */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Doc File
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                    className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-3 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <span className="flex items-center">
                      {selectedDoc ? (
                        <>
                          <Icon name="document" className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="block truncate">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {selectedDoc.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {selectedDoc.id}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Icon name="document" className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-500 dark:text-gray-400">Select an outline file...</span>
                        </>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <Icon
                        name={isDocDropdownOpen ? "chevron-up" : "chevron-down"}
                        className="h-5 w-5 text-gray-400"
                      />
                    </span>
                  </button>

                  {isDocDropdownOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-600">
                      {docs.map((doc) => (
                        <div
                          key={doc.id}
                          className={`relative cursor-pointer select-none py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedDoc?.id === doc.id
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                            : 'text-gray-900 dark:text-gray-100'
                            }`}
                          onClick={() => handleDocSelection(doc)}
                        >
                          <div className="flex items-center">
                            <Icon name="document" className="h-5 w-5 text-gray-400 mr-3" />
                            <div className="block">
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Title: {doc.title}  Type: {doc.asset_type}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-2">
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="p-2 bg-gray-200 rounded shadow"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>

            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              className={`overflow-y-auto flex-1 border-2 border-dashed rounded-md p-2 space-y-2 transition ${draggedItem && !selectedItems.some((i) => i.id === draggedItem.id)
                ? 'border-green-400 bg-green-50 dark:bg-green-900'
                : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                }`}
            >
              {selectedItems.length === 0 ? (
                <div className="flex items-center justify-center text-sm text-gray-500 h-full">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p>Drag items here</p>
                  </div>
                </div>
              ) : (
                selectedItems.map((item, index) => (
                  <div key={`${item.id}-selected`}>
                    <div
                      onDragOver={(e) => handleDragOverIndex(e, index)}
                      onDrop={(e) => handleDropAtIndex(e, index)}
                      className={`h-1 ${dragOverIndex === index ? 'bg-green-300 rounded' : ''}`}
                    />
                    <div
                      draggable
                      onDragStart={(e) => handleInternalDragStart(e, item)}
                      className={`p-2 rounded-md cursor-grab flex justify-between items-center hover:shadow transition
                      ${item.category === 'template' ? 'bg-blue-100 dark:bg-blue-700' : ''}
                      ${item.category === 'prompt' ? 'bg-green-100 dark:bg-green-700' : ''}
                    `}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold text-sm">{index + 1}.</span>
                        <span>{item.content}</span>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="hover:text-red-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {index === selectedItems.length - 1 && (
                      <div
                        onDragOver={(e) => handleDragOverIndex(e, index + 1)}
                        onDrop={(e) => handleDropAtIndex(e, index + 1)}
                        className={`h-1 ${dragOverIndex === index + 1 ? 'bg-green-300 rounded' : ''}`}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default DragDropPromptBuilder;