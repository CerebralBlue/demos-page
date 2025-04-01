"use client";
import HeaderBox from '@/components/HeaderBox';
import { Globe, BrainCircuit } from 'lucide-react';
import React, { useState } from 'react';
import { IntegrationDetailModal } from '../../components/IntegrationDetail';

const Integrations = () => {

    const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
    
    const integrations = [
        {
            id: 1,
            name: "Coconuts Ecommerce Integration",
            category: "Ecommerce",
            description: "myecommerce.com",
            icon: <Globe className="h-10 w-10 text-[#6A67CE]" />,
        },
        {
            id: 2,
            name: "John Doe Portafolio Integration",
            category: "Portafolio",
            description: "johndoe.com",
            icon: <Globe className="h-10 w-10 text-[#6A67CE]" />,
        },
        {
            id: 3,
            name: "NeuralSeek API Integration",
            category: "AI Agents",
            description: "stagingconsoleapi.neuralseek.com",
            icon: <BrainCircuit className="h-10 w-10 text-[#6A67CE]" />,
        },
    ];

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox type="greeting" title="My integrations" subtext="" />
                </header>
                <div className="grid md:grid-cols-3 gap-6">
                    {integrations.map((integration) => (
                        <div key={integration.id} className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition flex flex-col">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">{integration.icon}</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                                    <p className="text-gray-600">{integration.category}</p>
                                    <p className="text-sm text-gray-600">{integration.description}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="text-[#6A67CE] font-medium hover:underline"
                                    onClick={() => setSelectedIntegration(integration)}
                                >
                                    View Details
                                </button>
                                <button className="text-red-500 font-medium hover:underline">Disconnect</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <IntegrationDetailModal
                integration={selectedIntegration}
                onClose={() => setSelectedIntegration(null)}
            />
        </section>
    );
};

export default Integrations;
