import { Check, X } from 'lucide-react';
import React, { useState } from 'react';

interface EmailModalProps {
    onClose: () => void;
}

const users = [
    { id: 1, email: "user1@example.com" },
    { id: 2, email: "user2@example.com" },
    { id: 3, email: "user3@example.com" },
    { id: 4, email: "user4@example.com" },
];

export const EmailModal: React.FC<EmailModalProps> = ({ onClose }) => {
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const handleToggleEmail = (email: string) => {
        setSelectedEmails((prev) =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[80vw] h-[80vh] max-w-5xl">

                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2 mb-4 border-gray-300 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Share generated file</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Recipients */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipients</label>
                    <div className="mt-1 space-y-2">
                        {users.map(user => (
                            <label key={user.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedEmails.includes(user.email)}
                                    onChange={() => handleToggleEmail(user.email)}
                                    className="peer hidden"
                                />
                                <div className="w-5 h-5 border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center peer-checked:bg-[#6A67CE] peer-checked:border-[#6A67CE] transition">
                                    {selectedEmails.includes(user.email) && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <span className="text-gray-900 dark:text-gray-200">{user.email}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Subject Input */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#6A67CE] outline-none"
                        placeholder="Enter subject"
                    />
                </div>

                {/* Body Textarea */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#6A67CE] outline-none"
                        placeholder="Enter email body"
                        rows={4}
                    />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:underline">Cancel</button>
                    <button
                        className="bg-[#6A67CE] text-white px-4 py-2 rounded-md hover:bg-[#5754c5] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        disabled={selectedEmails.length === 0}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>

    );
};
