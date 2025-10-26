
import React from 'react';
import { XMarkIcon } from '../icons';

interface HowItWorksModalProps {
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl max-w-2xl w-full p-8 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6"/>
        </button>
        <h2 className="text-3xl font-bold text-indigo-400 mb-4">The Pathfinder Analysis Protocol</h2>
        <div className="text-gray-300 space-y-4 text-base leading-relaxed">
            <p>Your recommendations are the result of a rigorous, multi-stage protocol designed for deep personalization. The AI engages in an empathetic conversation to understand the person behind the student, not just the academic profile.</p>
            
            <div>
                <h3 className="font-semibold text-gray-100 mb-2 text-lg">Proactive Clarification & Holistic Inquiry</h3>
                <p className="text-gray-400">To ensure a precise understanding, the AI uses a 'Proactive Clarification Protocol'. If you mention a broad interest like 'art,' it will gently prompt for specifics—like 'digital art,' 'sculpture,' or 'art history'—to pinpoint your exact passions. The conversation will naturally flow to cover your academic journey (including subjects you excelled at and optional test scores), your extracurricular activities, and your long-term dreams, building a comprehensive profile.</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-100 mb-2 text-lg">Phase 1: Multi-Agent Analysis</h3>
                <p className="text-gray-400">A team of eleven specialized AI agents analyzes your profile from unique angles: Academic Strength, Campus Fit, Career Outcomes, Financial Viability, Ambition Mapping, Extracurricular Skills, Learning Style, Cultural Fit, Interdisciplinary Connections, Holistic Synthesis, and identifying your unique 'X-Factor'.</p>
            </div>
             <div>
                <h3 className="font-semibold text-gray-100 mb-2 text-lg">Phase 1.5: Inter-Agent Communication</h3>
                <p className="text-gray-400">The agents engage in a simulated "roundtable discussion" to compare findings, identify synergies, and flag potential conflicts. This ensures a more robust analysis before the final synthesis.</p>
            </div>
             <div>
                <h3 className="font-semibold text-gray-100 mb-2 text-lg">Phase 2: Synthesis & Personalization</h3>
                <p className="text-gray-400">A "Lead Counselor" agent synthesizes the findings to identify top contenders. It then generates a unique Personalization Score for each, justifying it by quoting your own statements from our conversation.</p>
            </div>
             <div>
                <h3 className="font-semibold text-gray-100 mb-2 text-lg">Phase 3: Red Team Validation</h3>
                <p className="text-gray-400">To ensure accuracy, a "Red Team" agent rigorously challenges each recommendation. It checks for biases, validates the personalization score, and performs a crucial self-correction step to identify and resolve any potential misinterpretations of your input.</p>
            </div>
            <p className="font-semibold text-indigo-300">Only the recommendations that successfully pass every stage of this protocol are presented to you.</p>
        </div>
      </div>
    </div>
);

export default HowItWorksModal;
