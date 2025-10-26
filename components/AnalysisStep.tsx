import React, { useState, useEffect } from 'react';
import { BrainCircuitIcon, ShieldCheckIcon, GraduationCapIcon, LayersIcon, BookOpenIcon, UsersGroupIcon, BriefcaseIcon, ArrowsRightLeftIcon, ChatBubbleLeftRightIcon } from './icons';

const ANALYSIS_STAGES = [
    { text: "Parsing final user profile...", Icon: BrainCircuitIcon },
    { text: "Initializing seven analytical models...", Icon: LayersIcon },
    { text: "Running Academic Program analysis...", Icon: BookOpenIcon },
    { text: "Running Campus & Cultural Fit analysis...", Icon: UsersGroupIcon },
    { text: "Running Career & Financial analysis...", Icon: BriefcaseIcon },
    { text: "Broadcasting findings: models communicating...", Icon: ChatBubbleLeftRightIcon },
    { text: "Synthesizing multi-model perspectives...", Icon: BrainCircuitIcon },
    { text: "Executing Red Team validation protocol...", Icon: ShieldCheckIcon },
    { text: "Cross-validating recommendations...", Icon: ArrowsRightLeftIcon },
    { text: "Compiling validated recommendations...", Icon: GraduationCapIcon }
];


const AnalysisStep: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // This effect now progresses through the stages once and then stops.
    // This visualizes a deliberate, non-looping thinking process.
    if (stageIndex < ANALYSIS_STAGES.length - 1) {
      const timer = setTimeout(() => {
        setStageIndex(prevIndex => prevIndex + 1);
      }, 2000); // 2-second delay for each stage to feel deliberate
  
      return () => clearTimeout(timer);
    }
  }, [stageIndex]);
  
  const barCount = 15;
  const CurrentIcon = ANALYSIS_STAGES[stageIndex].Icon;

  return (
    <div className="p-8 md:p-12 text-center min-h-[400px] flex flex-col justify-center items-center">
        <div className="relative w-48 h-32 flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center justify-center gap-1.5">
                {Array.from({ length: barCount }).map((_, i) => (
                    <div
                        key={i}
                        className="w-1.5 h-full bg-indigo-500/50 rounded-full"
                        style={{
                            animation: `pulse-bar 1.5s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}
            </div>
            <div className="absolute w-20 h-20 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-indigo-500/30">
                <CurrentIcon className="w-10 h-10 text-indigo-400 z-10 transition-all duration-500"/>
            </div>
        </div>
      <h2 className="text-4xl font-extrabold text-gray-100 mb-4">Finalizing Analysis...</h2>
      <div className="h-12 flex items-center justify-center">
        <p className="text-gray-400 text-xl transition-opacity duration-500">
          {ANALYSIS_STAGES[stageIndex].text}
        </p>
      </div>
    </div>
  );
};

export default AnalysisStep;