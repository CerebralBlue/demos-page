import DOMPurify from "dompurify";
import React from "react";

interface SeekModalProps {
    isOpen: boolean;
    onClose: () => void;
    directAnswer: string;
    passages: any[];
}

const SeekModal: React.FC<SeekModalProps> = ({ isOpen, onClose, directAnswer, passages }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Seek and Knowledge Base Analysis</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Direct Answer</h3>
                    <div
                        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(directAnswer) }}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Relevant Passages</h3>
                    <ul className="space-y-4">
                        {passages.map((passage, index) => (
                            <li key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                                {passage.document.includes(".txt")?(
                                    <div className="mb-2">

                                        {/* {passage.document} */}
                                </div>
                                ):(
                                    <div className="mb-2">
                                    <a
                                        href={passage.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                    >
                                        {passage.document}
                                    </a>
                                </div>
                                )
                                
                                }
                                
                                
                                
                                <div
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(passage.passage) }}
                                    className="text-sm"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SeekModal;