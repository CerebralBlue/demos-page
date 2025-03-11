import { X } from 'lucide-react';
import React from 'react';

export const IntegrationDetailModal = ({ integration, onClose }: any) => {
    if (!integration) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">{integration.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <p className="text-gray-600 mt-4">{integration.description}</p>
                <p className="text-sm text-gray-500">{integration.category}</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="text-[#6A67CE] font-medium hover:underline">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
