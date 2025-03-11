import { Version } from '@/types/report';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { diffWords } from 'diff';

interface ReportHistoryModalProps {
    drafts: { versions: Version[] };
    onClose: () => void;
}

export const ReportHistoryModal: React.FC<ReportHistoryModalProps> = ({ drafts, onClose }) => {
    if (!drafts?.versions?.length) return null;

    const sortedVersions = [...drafts.versions].sort((a, b) => b.version - a.version);
    const [selectedVersion, setSelectedVersion] = useState(sortedVersions[0]);

    const getHighlightedDiff = (prevContent: string, newContent: string) => {
        const diff = diffWords(prevContent, newContent);

        return diff.map((part, index) => {
            const className = part.added ? "bg-green-200 text-green-900" : part.removed ? "bg-red-200 text-red-900 line-through" : "";
            return (
                <span key={index} className={className}>
                    {part.value}
                </span>
            );
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90vw] h-[90vh] max-w-6xl flex">
                <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 overflow-y-auto max-h-full p-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Versions</h2>
                    <ul>
                        {sortedVersions.map(({ version, timestamp }) => (
                            <li
                                key={version}
                                className={`p-2 cursor-pointer rounded-lg text-sm ${
                                    selectedVersion.version === version ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                                onClick={() => setSelectedVersion(sortedVersions.find(v => v.version === version)!)}
                            >
                                <p className="font-medium">Version {version} - Marc Martina</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-2/3 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center border-b pb-2 mb-4 border-gray-300 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Version {selectedVersion.version} - Marc Martina</h2>
                        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                        {getHighlightedDiff(
                            sortedVersions.find((v) => v.version === selectedVersion.version - 1)?.content || '',
                            selectedVersion.content
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};