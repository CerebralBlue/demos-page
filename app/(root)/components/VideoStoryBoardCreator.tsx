import React, { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import { VIDEO_STORY_BOARD_TYPES } from '@/constants';
import axios from 'axios';

type ChatMessage = {
    message: string;
    type: "agent" | "user";

    data?: any;
    isFile?: boolean;
    fileName?: string;
};


interface VideoStoryBoardCreator {
    outlineStatus?: 'none' | 'loaded' | 'created';
    outlineFileName?: string;
    onGenerateStoryboard?: (storyboardType: string) => void;
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const VideoStoryBoardCreator: React.FC<VideoStoryBoardCreator> = ({
    outlineStatus = 'none',
    outlineFileName,
    onGenerateStoryboard,
    setChatHistory
}) => {
    const [outlines, setOutlines] = useState<{ id: string, name: string, text: string }[]>([]);
    const [selectedOutline, setSelectedOutline] = useState<{ id: string, name: string, text: string } | null>(null);
    const [selectedStoryboardType, setSelectedStoryboardType] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOutlineDropdownOpen, setIsOutlineDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedOutline || !selectedStoryboardType) {
            return;
        }

        setIsSubmitting(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            let maistroCallBody;

            // Structure from outline
            maistroCallBody = {
                url_name: "prod-admed-demo",
                agent: "generate_video_storyboard_structure",
                params: [{ name: "fileName", value: selectedOutline.name }, { name: "storyboardType", value: selectedStoryboardType }],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };
            const structureResponse = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const structure = JSON.parse(structureResponse.data.answer);
            // console.log(structure);

            // Query index by keywords
            let docs: any[] = [];
            let sectionsContent: string[] = [];
            for (const section of structure.sections) {
                maistroCallBody = {
                    url_name: "prod-admed-demo",
                    agent: "query_docs_by_kw",
                    params: [
                        // { name: "assetType", value: `Video Storyboards - ${selectedStoryboardType}` },
                        { name: "assetType", value: `kb_video_storyboard_clinical_trial` },
                        { name: "keywords", value: section.keywords.join(" ") }
                    ],
                    options: {
                        returnVariables: false,
                        returnVariablesExpanded: false
                    }
                };
                const responseKB = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const documentList = JSON.parse(responseKB.data.answer).hits.hits;
                // console.log(documentList);

                if (documentList && documentList.length > 0) {
                    docs = [...docs, ...documentList];
                }

                // Create a comprehensive context string for LLM
                const contextDocumentation = docs
                    .map((doc: any, index: number) => {
                        return `=== DOCUMENT ${index + 1} ===
                                Document Name: ${doc._source.name}
                                Page: ${doc._source.page}
                                Content: ${doc._source.text}
                                Reference: ${doc._source.quote}
                                ================================`;
                    })
                    .join('\n\n');

                //  Generate Video Storyboard section
                maistroCallBody = {
                    url_name: "prod-admed-demo",
                    agent: "generate_video_storyboard",
                    params: [
                        { name: "title", value: structure.video_title },
                        { name: "section", value: section.title },
                        { name: "documentation", value: contextDocumentation }
                    ],
                    options: {
                        returnVariables: false,
                        returnVariablesExpanded: false
                    }
                };
                const videoSResponse = await axios.post(urlMaistro, maistroCallBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const videoSB = videoSResponse.data.answer;
                // console.log(videoSB);
                sectionsContent.push(videoSB);
            }
            // console.log(sectionsContent);

            // Save storyboard into KB
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString();
            const storyboardName = `${selectedStoryboardType} - ${formattedDate}`;
            const storyboardText = sectionsContent.join('\n\n');

            maistroCallBody = {
                url_name: "prod-admed-demo",
                agent: "save_doc",
                params: [
                    // { name: "asset_type", value: `Video Storyboards - ${selectedStoryboardType}` },
                    { name: "genType", value: `gen_video_storyboard_clinical_trial` },
                    { name: "name", value: storyboardName },
                    { name: "title", value: structure.video_title },
                    { name: "structure", value: JSON.stringify(structure) },
                    { name: "text", value: storyboardText },
                    { name: "videoId", value: ""} 
                ]
            }
            const storeResponse = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const savedSB = storeResponse.data.answer;
            // console.log("Document has been saved!")
            // console.log(savedSB)

            // Show storyboard in chat
            setChatHistory(prev => [
                ...prev,
                { message: 'Storyboard created!', type: 'agent', data: sectionsContent.join('\n\n') }
            ]);


            // Call the callback if provided
            if (onGenerateStoryboard) {
                onGenerateStoryboard(selectedStoryboardType);
            }

        } catch (error) {
            console.error('Error generating storyboard:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStoryboardSelection = (typeTitle: string) => {
        setSelectedStoryboardType(typeTitle);
        setIsDropdownOpen(false);
    };

    const handleOutlineSelection = (outline: { id: string, name: string, text: string }) => {
        setSelectedOutline(outline);
        setIsOutlineDropdownOpen(false);
    };

    const selectedType = VIDEO_STORY_BOARD_TYPES.find(type => type.title === selectedStoryboardType);

    const fetchOutlines = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlMaistro = `${baseUrl}/neuralseek/maistro`;
            const maistroCallBody = {
                url_name: "prod-admed-demo",
                agent: "query_outline_docs",
                params: [{ name: "type", value: "Outline" }],
                options: {
                    returnVariables: false,
                    returnVariablesExpanded: false
                }
            };
            const maistroResponse = await axios.post(urlMaistro, maistroCallBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const filesList = JSON.parse(maistroResponse.data.answer).hits.hits;
            const files = filesList.map((item: any) => {
                return {
                    id: item._source._id,
                    name: item._source.name,
                    text: item._source.text
                };
            });
            setOutlines(files);

        } catch (err) {
            console.error("Error fetching outlines:", err);
        }
    };

    useEffect(() => {
        fetchOutlines();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold dark:text-gray-200">Video Story Board Creator</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Define the structure and sections of your video storyboard
                </p>
            </div>

            {/* Outline Selection Dropdown */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Outline File
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOutlineDropdownOpen(!isOutlineDropdownOpen)}
                        className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-3 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <span className="flex items-center">
                            {selectedOutline ? (
                                <>
                                    <Icon name="document" className="h-5 w-5 text-gray-400 mr-3" />
                                    <div className="block truncate">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {selectedOutline.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            ID: {selectedOutline.id}
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
                                name={isOutlineDropdownOpen ? "chevron-up" : "chevron-down"}
                                className="h-5 w-5 text-gray-400"
                            />
                        </span>
                    </button>

                    {isOutlineDropdownOpen && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-600">
                            {outlines.map((outline) => (
                                <div
                                    key={outline.id}
                                    className={`relative cursor-pointer select-none py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedOutline?.id === outline.id
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                                        : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                    onClick={() => handleOutlineSelection(outline)}
                                >
                                    <div className="flex items-center">
                                        <Icon name="document" className="h-5 w-5 text-gray-400 mr-3" />
                                        <div className="block">
                                            <div className="font-medium">{outline.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                ID: {outline.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Storyboard Type Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Video Storyboard Type
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-3 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <span className="flex items-center">
                            {selectedType ? (
                                <>
                                    <Icon name="document-chart-bar" className="h-5 w-5 text-gray-400 mr-3" />
                                    <div className="block truncate">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {selectedType.title}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {selectedType.description}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Icon name="document-chart-bar" className="h-5 w-5 text-gray-400 mr-3" />
                                    <span className="text-gray-500 dark:text-gray-400">Select a storyboard type...</span>
                                </>
                            )}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <Icon
                                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                                className="h-5 w-5 text-gray-400"
                            />
                        </span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-600">
                            {VIDEO_STORY_BOARD_TYPES.map((type) => (
                                <div
                                    key={type.title}
                                    className={`relative cursor-pointer select-none py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedStoryboardType === type.title
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                                        : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                    onClick={() => handleStoryboardSelection(type.title)}
                                >
                                    <div className="flex items-center">
                                        <Icon name="document-chart-bar" className="h-5 w-5 text-gray-400 mr-3" />
                                        <div className="block">
                                            <div className="font-medium">{type.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {type.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Choose the type that best matches your video's purpose and style.
                </p>
            </div>

            {/* Selected Items Display */}
            {/* {selectedOutline && (
                <div className="mb-2 text-md font-semibold text-gray-800 dark:text-gray-100">
                    Selected Outline: {selectedOutline.name}
                </div>
            )}

            {selectedType && (
                <div className="mb-2 text-md font-semibold text-gray-800 dark:text-gray-100">
                    Selected Type: {selectedType.title}
                </div>
            )} */}

            {/* Generate Button */}
            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={!selectedOutline || !selectedStoryboardType || isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    <Icon name="document-chart-bar" className="w-5 h-5" />
                    <span>{isSubmitting ? 'Generating...' : 'Generate Video Storyboard'}</span>
                </button>

                {(!selectedOutline || !selectedStoryboardType) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {!selectedOutline
                            ? 'Please select an outline file first'
                            : 'Please select a storyboard type to continue'
                        }
                    </p>
                )}
            </div>
        </div>
    );
};

export default VideoStoryBoardCreator;