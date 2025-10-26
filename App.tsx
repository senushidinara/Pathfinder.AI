
import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, CollegeRecommendation, Message } from './types';
import WelcomeStep from './components/WelcomeStep';
import ChatFlow from './components/ChatFlow';
import AnalysisStep from './components/AnalysisStep';
import ResultsStep from './components/ResultsStep';
import { GeminiClient } from './services/geminiService';
import SelectKeyStep from './components/common/SelectKeyStep';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);
  const [geminiClient, setGeminiClient] = useState<GeminiClient | null>(null);
  const [step, setStep] = useState<AppStep>(AppStep.Welcome);
  const [results, setResults] = useState<CollegeRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    const checkKey = async () => {
        if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            setIsKeySelected(true);
            setGeminiClient(new GeminiClient());
        }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setIsKeySelected(true);
            setGeminiClient(new GeminiClient());
        }
    } catch (e) {
        console.error("Could not open API key selection dialog.", e);
        setError("Could not open the API key selection dialog. Please ensure you are in a supported environment and try again.");
        setStep(AppStep.Error);
    }
  };
  
  const handleApiError = useCallback((e: unknown) => {
    if (e instanceof Error && (e.message.includes('API key') || e.message.includes('400') || e.message.includes('Requested entity was not found'))) {
      setIsKeySelected(false);
      setGeminiClient(null);
      setStep(AppStep.Welcome);
    } else {
      if (e instanceof Error) {
        if (e.message.toLowerCase().includes("network")) {
            setError("A network error occurred. Please check your internet connection and try again.");
        } else if (e.message.toLowerCase().includes("analysis phase failed")) {
            setError("The AI failed to complete the analysis. This may be a temporary service issue. Please try again later.");
        } else {
            setError("An unexpected error occurred during the analysis.");
        }
      } else {
        setError("An unknown error occurred.");
      }
      setStep(AppStep.Error);
    }
  }, []);

  const handleStart = () => {
    setStep(AppStep.Chat);
  };
  
  const handleChatComplete = useCallback(async (chat: Chat, history: Message[]) => {
    if (!geminiClient) {
      setError("API Client is not initialized. Please select an API Key.");
      setStep(AppStep.Error);
      return;
    }
    setStep(AppStep.Analysis);
    setChatHistory(history);
    setError(null);
    try {
      const recommendations = await geminiClient.getFinalRecommendations(chat);
      setResults(recommendations);
      setStep(AppStep.Results);
    } catch (e) {
      handleApiError(e);
    }
  }, [geminiClient, handleApiError]);

  const handleRestart = () => {
    setResults([]);
    setError(null);
    setChatHistory([]);
    if (isKeySelected) {
      setStep(AppStep.Welcome);
    } else {
      setGeminiClient(null);
      setStep(AppStep.Welcome);
    }
  };
  
  const renderContent = () => {
    if (!isKeySelected) {
        return <SelectKeyStep onSelectKey={handleSelectKey} />;
    }

    switch (step) {
      case AppStep.Welcome:
        return <WelcomeStep onStart={handleStart} />;
      case AppStep.Chat:
        return (
          <ChatFlow
            geminiClient={geminiClient!}
            onComplete={handleChatComplete}
            onApiKeyError={handleApiError}
          />
        );
      case AppStep.Analysis:
        return <AnalysisStep />;
      case AppStep.Results:
        return <ResultsStep recommendations={results} onRestart={handleRestart} chatHistory={chatHistory} />;
      case AppStep.Error:
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Analysis Failed</h2>
            <p className="text-gray-400 mb-6 max-w-md">{error}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              Start Over
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto">
             <div className="relative glowing-border">
                <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-500 min-h-[85vh] flex flex-col">
                    {renderContent()}
                </div>
            </div>
             <footer className="text-center mt-6 text-sm text-gray-500">
                <p>Powered by Gemini. &copy; 2025 by Senushi</p>
            </footer>
        </div>
    </div>
  );
};

export default App;
