
import React from 'react';
import { BrainCircuitIcon } from '../icons';

interface SelectKeyStepProps {
  onSelectKey: () => void;
}

const SelectKeyStep: React.FC<SelectKeyStepProps> = ({ onSelectKey }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full animate-fade-in">
        <BrainCircuitIcon className="w-16 h-16 text-purple-400 mb-6" />
        <h1 className="text-3xl font-bold text-gray-100 mb-3">Welcome to Pathfinder.AI</h1>
        <p className="text-lg text-gray-400 max-w-lg mx-auto mb-6">
            To begin your personalized college discovery journey, please select your Gemini API key.
        </p>
        
        <div className="w-full max-w-md space-y-4">
            <button
                type="button"
                onClick={onSelectKey}
                className="w-full px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
            >
               Select API Key
            </button>
        </div>
        
        <p className="text-gray-500 max-w-lg mx-auto mt-8 text-sm">
            This application requires a Gemini API key to function. Your key is managed securely by the environment. For more information on API keys and billing, please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">billing documentation</a>.
        </p>
    </div>
  );
};

export default SelectKeyStep;
