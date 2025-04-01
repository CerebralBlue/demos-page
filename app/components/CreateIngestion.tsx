import React from 'react';

const CreateIngestion = ({ isOpen, onClose }: any) => {
   
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">

                {/* Ingestion Information */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">New Ingestion</h3>
                    <div className="mt-2">
                        
                    </div>
                </div>

                {/* Close Button */}
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="text-[#6A67CE] font-medium hover:underline">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateIngestion;
