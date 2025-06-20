"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Search, X } from 'lucide-react';
import { BoxTree } from '@/types/box.tree';
import axios from 'axios';

interface BoxFileTree {
    id: string;
    name: string;
    total_count: number;
    entries: BoxItem[];
}

interface BoxItem {
    type: 'file' | 'folder';
    id: string;
    sequence_id?: string;
    etag?: string;
    name: string;
    children?: BoxFileTree;
}

const isBoxFileTree = (data: BoxFileTree | BoxItem): data is BoxFileTree => {
    return 'entries' in data && Array.isArray(data.entries);
};

const FileTreeNode = ({
    node,
    level = 0,
    searchTerm = '',
    expandedNodes,
    setExpandedNodes
}: {
    node: BoxItem;
    level?: number;
    searchTerm?: string;
    expandedNodes: Set<string>;
    setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>;
}) => {
    const isExpanded = expandedNodes.has(node.id);
    const isFolder = node.type === 'folder';
    const hasChildren = isFolder && node.children && node.children.entries && node.children.entries.length > 0;

    // Check if this node or any of its children match the search
    const matchesSearch = useMemo(() => {
        if (!searchTerm) return true;

        const checkNodeMatch = (n: BoxItem): boolean => {
            const nameMatch = n.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (nameMatch) return true;

            if (n.type === 'folder' && n.children && n.children.entries) {
                return n.children.entries.some(child => checkNodeMatch(child));
            }
            return false;
        };

        return checkNodeMatch(node);
    }, [node, searchTerm]);

    // Filter children based on search
    const filteredChildren = useMemo(() => {
        if (!hasChildren || !searchTerm) return node.children?.entries || [];

        return node.children!.entries.filter(child => {
            const checkMatch = (n: BoxItem): boolean => {
                const nameMatch = n.name.toLowerCase().includes(searchTerm.toLowerCase());
                if (nameMatch) return true;

                if (n.type === 'folder' && n.children && n.children.entries) {
                    return n.children.entries.some(c => checkMatch(c));
                }
                return false;
            };
            return checkMatch(child);
        });
    }, [hasChildren, node.children?.entries, searchTerm]);

    const toggleExpanded = () => {
        if (hasChildren) {
            setExpandedNodes(prev => {
                const newSet = new Set(prev);
                if (newSet.has(node.id)) {
                    newSet.delete(node.id);
                } else {
                    newSet.add(node.id);
                }
                return newSet;
            });
        }
    };

    const indentStyle = {
        paddingLeft: `${level * 20}px`
    };

    // Highlight matching text
    const highlightText = (text: string, searchTerm: string) => {
        if (!searchTerm) return text;

        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                    {part}
                </span>
            ) : part
        );
    };

    // http://localhost:3000/financial-data-analyzer/api/box/download?fileId=1870348747127
    // Download


    if (!matchesSearch) return null;



    return (
        <div className="select-none">
            <div
                className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded text-sm
                    ${hasChildren ? 'cursor-pointer' : 'cursor-default'}"
                style={indentStyle}
                onClick={toggleExpanded}
                title={`${node.name} (ID: ${node.id})`}
            >
                {/* Expand/Collapse Icon */}
                <div className="w-4 h-4 mr-1 flex items-center justify-center">
                    {hasChildren && (
                        isExpanded ?
                            <ChevronDown size={14} className="text-gray-600 dark:text-gray-300" /> :
                            <ChevronRight size={14} className="text-gray-600 dark:text-gray-300" />
                    )}
                </div>

                {/* Folder/File Icon */}
                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                    {isFolder ? (
                        <Folder size={14} className="text-blue-500" />
                    ) : (
                        <File size={14} className="text-gray-500 dark:text-gray-400" />
                    )}
                </div>

                {/* Name with highlighting */}
                <span 
                    className="text-gray-800 dark:text-gray-200 truncate cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${node.name} (ID: ${node.id})`);
                    }}
                >
                    {highlightText(node.name, searchTerm)}
                    {isFolder && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            (ID: {node.id})
                        </span>
                    )}
                </span>

                {/* Count for folders (optional) */}
                {isFolder && node.children && node.children.total_count > 0 && (
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                        ({searchTerm ? filteredChildren.length : node.children.total_count})
                    </span>
                )}
            </div>

            {/* Children */}
            {isFolder && hasChildren && isExpanded && (
                <div>
                    {filteredChildren.map((child: BoxItem) => (
                        <FileTreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            searchTerm={searchTerm}
                            expandedNodes={expandedNodes}
                            setExpandedNodes={setExpandedNodes}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTree = () => {

    const [boxTree, setBoxTree] = useState<BoxTree | null>(null);

    const fetchBoxTree = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const urlBoxTree = `${baseUrl}/box/tree`;
            const serviceResponse = await axios.get(urlBoxTree, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setBoxTree(serviceResponse.data);
        } catch (err) {
            console.error("Error fetching box tree:", err);
        }
    };

    useEffect(() => {
        fetchBoxTree();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['321366868318', '321552407614']));

    const sampleData: BoxFileTree = {
        "id": "0",
        "name": "",
        "total_count": 1,
        "entries": [
            {
                "type": "folder",
                "id": "321366868318",
                "sequence_id": "1",
                "etag": "1",
                "name": "AdMed+TechD Content Generator Project",
                "children": {
                    "id": "321366868318",
                    "name": "",
                    "total_count": 7,
                    "entries": [
                        {
                            "type": "folder",
                            "id": "321552407612",
                            "sequence_id": "1",
                            "etag": "1",
                            "name": "Archive_",
                            "children": {
                                "id": "321552407612",
                                "name": "",
                                "total_count": 0,
                                "entries": []
                            }
                        },
                        {
                            "type": "file",
                            "id": "321552407613",
                            "sequence_id": "1",
                            "etag": "1",
                            "name": "README.md"
                        },
                        {
                            "type": "folder",
                            "id": "321552407614",
                            "sequence_id": "1",
                            "etag": "1",
                            "name": "Documents",
                            "children": {
                                "id": "321552407614",
                                "name": "",
                                "total_count": 2,
                                "entries": [
                                    {
                                        "type": "file",
                                        "id": "321552407615",
                                        "sequence_id": "1",
                                        "etag": "1",
                                        "name": "project-spec.docx"
                                    },
                                    {
                                        "type": "file",
                                        "id": "321552407616",
                                        "sequence_id": "1",
                                        "etag": "1",
                                        "name": "requirements.pdf"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    };

    const displayData = boxTree || sampleData;

    const clearSearch = () => {
        setSearchTerm('');
    };

    // Auto-expand nodes when searching
    React.useEffect(() => {
        if (searchTerm) {
            const expandMatchingNodes = (items: BoxItem[], expanded: Set<string>) => {
                items.forEach(item => {
                    if (item.type === 'folder' && item.children) {
                        const hasMatchingChild = item.children.entries.some(child =>
                            child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (child.type === 'folder' && child.children)
                        );

                        if (hasMatchingChild || item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            expanded.add(item.id);
                            expandMatchingNodes(item.children.entries, expanded);
                        }
                    }
                });
            };

            setExpandedNodes(prev => {
                const newExpanded = new Set(prev);
                if (isBoxFileTree(displayData)) {
                    expandMatchingNodes(displayData.entries, newExpanded);
                } else {
                    expandMatchingNodes([displayData], newExpanded);
                }
                return newExpanded;
            });
        }
    }, [searchTerm, displayData]);

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-900 dark:rounded-lg p-4">
            <div className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Box File Explorer
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                )}
            </div>

            {/* File Tree */}
            <div className="space-y-1 max-h-96 overflow-y-auto">
                {isBoxFileTree(displayData) ? (
                    displayData.entries.map((entry: BoxItem) => (
                        <FileTreeNode
                            key={entry.id}
                            node={entry}
                            searchTerm={searchTerm}
                            expandedNodes={expandedNodes}
                            setExpandedNodes={setExpandedNodes}
                        />
                    ))
                ) : (
                    <FileTreeNode
                        node={displayData}
                        searchTerm={searchTerm}
                        expandedNodes={expandedNodes}
                        setExpandedNodes={setExpandedNodes}
                    />
                )}
            </div>
        </div>
    );
};

export default FileTree;