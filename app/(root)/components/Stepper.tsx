import { STEPS } from "@/constants";
import React from "react";
import Icon from "@/components/Icon";

const Stepper = ({ currentStep, onStepChange }: any) => {
    return (
        <div className="w-full px-4 py-6">
            <div className="flex items-start justify-between max-w-7xl mx-auto">
                {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center w-full">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                                    step.id <= currentStep
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                {step.id <= currentStep ? (
                                    step.id < currentStep ? (
                                        <Icon name="check" className="w-5 h-5" />
                                    ) : (
                                        step.id
                                    )
                                ) : (
                                    step.id
                                )}
                            </div>
                            <div className="text-center mt-3 px-2 max-w-[200px]">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 leading-tight">
                                    {step.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                    {step.description}
                                </div>
                            </div>
                        </div>

                        {index < STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
                                    step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stepper;