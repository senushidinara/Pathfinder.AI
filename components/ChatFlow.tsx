
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { SendIcon } from './icons';
import { GeminiClient } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { Message, Thought, StructuredAIResponse } from '../types';
import AITeamStatusSidebar from './common/AITeamStatusSidebar';

interface ChatFlowProps {
  geminiClient: GeminiClient;
  onComplete: (chat: Chat, messages: Message[]) => void;
  onApiKeyError: (error: unknown) => void;
}

const ChatFlow: React.FC<ChatFlowProps> = ({ geminiClient, onComplete, onApiKeyError }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(true);
  const [thoughtHistory, setThoughtHistory] = useState<Thought[]>([]);
  const [universityCount, setUniversityCount] = useState<number | string>('5000+');
  const [universityList, setUniversityList] = useState<string[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);
  const countRef = useRef<HTMLSpanElement>(null);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  useEffect(() => {
    // Animate the count change
    if (countRef.current) {
        countRef.current.classList.add('animate-[pulse-subtle_0.5s_ease-in-out]');
        setTimeout(() => {
            countRef.current?.classList.remove('animate-[pulse-subtle_0.5s_ease-in-out]');
        }, 500);
    }
  }, [universityCount]);

  const parseAndSetAIResponse = (responseText: string) => {
    try {
        const parsed: StructuredAIResponse = JSON.parse(responseText);
        setMessages(prev => [...prev, { id: messageIdCounter.current++, sender: 'bot', content: parsed.publicResponse }]);
        setThoughtHistory(prev => [...prev, ...parsed.internalChatter]);
        setUniversityCount(parsed.matchingUniversitiesCount);
        if (parsed.matchingUniversitiesList) {
            setUniversityList(parsed.matchingUniversitiesList);
        }

    } catch(e) {
        console.error("Failed to parse AI JSON response:", e, "Raw response:", responseText);
        // Fallback for non-JSON response or parsing error
        setMessages(prev => [...prev, { id: messageIdCounter.current++, sender: 'bot', content: "A formatting error occurred. Let's continue." }]);
    }
  }


  useEffect(() => {
    const initChat = async () => {
        try {
            const chatSession = geminiClient.startChat();
            setChat(chatSession);
            
            const response = await chatSession.sendMessage({ message: "Start the conversation" });
            parseAndSetAIResponse(response.text);
        } catch (error) {
            console.error("Error initiating chat:", error);
            onApiKeyError(error);
            return;
        } finally {
            setIsBotTyping(false);
        }
    };
    initChat();
  }, [geminiClient, onApiKeyError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || !chat || isBotTyping) {
        return;
    }
    
    const userInput = currentInput.trim();
    const userMessage: Message = { id: messageIdCounter.current++, sender: 'user', content: userInput };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsBotTyping(true);
    
    try {
        const response = await chat.sendMessage({ message: userInput });
        parseAndSetAIResponse(response.text);
    } catch(error) {
        console.error("Error during chat send:", error);
        onApiKeyError(error);
        return;
    } finally {
        setIsBotTyping(false);
    }
  };

  const BotAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-indigo-500/80 flex-shrink-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full bg-transparent flex-grow">
      {/* Sidebar */}
       <AITeamStatusSidebar thoughtHistory={thoughtHistory} />

      {/* Main Chat */}
      <div className="flex flex-col h-full flex-grow">
        <div className="p-3 bg-gray-900/50 border-b border-indigo-500/30 flex justify-between items-center sticky top-0 z-10 animate-fade-in-up">
            <div className="text-base text-gray-300 font-mono">
              Matching Universities: <span ref={countRef} className="text-green-400 font-bold text-lg transition-all duration-300 inline-block">{universityCount.toLocaleString()}</span>
            </div>
            {messages.length >= 2 && (
              <button
                  onClick={() => chat && onComplete(chat, messages)}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all text-base transform hover:scale-105"
              >
                  Finalize Recommendations
              </button>
            )}
        </div>

        <div ref={chatContainerRef} className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              {msg.sender === 'bot' && <BotAvatar />}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl whitespace-pre-wrap text-base ${
                  msg.sender === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex items-end gap-2 justify-start animate-fade-in-up">
              <BotAvatar />
              <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-800 text-gray-200 rounded-bl-none">
                  <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-0"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                  </div>
              </div>
            </div>
          )}
        </div>
         {messages.length >= 5 && universityList.length > 0 && (
            <div className="px-4 py-3 border-t border-indigo-500/30 bg-gray-900/30 animate-fade-in">
                <h3 className="text-sm font-semibold text-indigo-300 mb-2 font-mono">LIVE PREVIEW: TOP MATCHES</h3>
                <div className="flex flex-wrap gap-2">
                    {universityList.map((uni, index) => (
                        <div key={index} className="bg-gray-700/50 text-gray-300 text-sm px-3 py-1 rounded-full animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            {uni}
                        </div>
                    ))}
                </div>
            </div>
         )}
          <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                placeholder={isBotTyping ? 'Pathfinder is processing...' : 'Type your answer...'}
                className="w-full p-3 bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                autoFocus
                disabled={isBotTyping}
              />
              <button
                type="submit"
                className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:bg-indigo-400/50 disabled:cursor-not-allowed"
                disabled={!currentInput.trim() || isBotTyping}
                aria-label="Send"
              >
                <SendIcon className="w-6 h-6" />
              </button>
            </form>
          </div>
      </div>
    </div>
  );
};

export default ChatFlow;
