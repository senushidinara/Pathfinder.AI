import React, { useState, useEffect } from 'react';
import { BrainCircuitIcon, BookOpenIcon, BuildingOfficeIcon, BriefcaseIcon, CurrencyDollarIcon, SparklesIcon, LightbulbIcon, UsersGroupIcon, ScaleIcon, EyeIcon, TargetIcon, RocketLaunchIcon, NodeNetworkIcon, CompassIcon } from './icons';
import { AIAgent } from '../types';


interface WelcomeStepProps {
  onStart: () => void;
}

const AGENT_LIST = [
    { name: AIAgent.Academic, Icon: BookOpenIcon },
    { name: AIAgent.Campus, Icon: BuildingOfficeIcon },
    { name: AIAgent.Career, Icon: BriefcaseIcon },
    { name: AIAgent.Financial, Icon: CurrencyDollarIcon },
    { name: AIAgent.XFactor, Icon: SparklesIcon },
    { name: AIAgent.LearningStyle, Icon: LightbulbIcon },
    { name: AIAgent.CulturalFit, Icon: UsersGroupIcon },
    { name: AIAgent.ExtracurricularActivityProfiler, Icon: RocketLaunchIcon },
    { name: AIAgent.HolisticProfileSynthesizer, Icon: TargetIcon },
    { name: AIAgent.InterdisciplinaryConnector, Icon: NodeNetworkIcon },
    { name: AIAgent.AmbitionGoalNavigator, Icon: CompassIcon },
    { name: AIAgent.LeadCounselor, Icon: ScaleIcon },
    { name: AIAgent.RedTeam, Icon: EyeIcon },
];

const BootLine: React.FC<{text: string, delay: number}> = ({ text, delay }) => (
    <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <span className="text-green-400">[ OK ]</span>
        <span className="text-gray-400">{text}</span>
    </div>
);

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  const [bootSequence, setBootSequence] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setBootSequence(1), 200),
      setTimeout(() => setBootSequence(2), 1000),
      setTimeout(() => setBootSequence(3), 1800),
      setTimeout(() => setBootSequence(4), 2800),
      setTimeout(() => setBootSequence(5), 4500),
      setTimeout(() => setBootSequence(6), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="p-8 md:p-12 flex flex-col justify-center items-center h-full font-mono text-base text-center">
        <div className="w-full max-w-4xl space-y-6">
            
            <div className="flex justify-center items-center gap-4">
                <BrainCircuitIcon className="w-10 h-10 text-purple-400 animate-[pulse-subtle_4s_ease-in-out_infinite]" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-widest overflow-hidden whitespace-nowrap border-r-4 border-r-purple-400/0 mx-auto animate-[typing_2s_steps(14,end),blink-caret_.75s_step-end_infinite]">
                    PATHFINDER.AI
                </h1>
            </div>

            <div className="bg-gray-900/50 border border-purple-500/20 p-6 rounded-lg text-left min-h-[240px] space-y-2">
                {bootSequence >= 1 && <BootLine text="BOOTING CORE KERNEL..." delay={0} />}
                {bootSequence >= 2 && <BootLine text="SYNC: Global university database..." delay={0} />}
                {bootSequence >= 3 && <BootLine text="LOAD: Heuristic models..." delay={0} />}
                
                {bootSequence >= 4 && (
                    <div className="pt-4 animate-fade-in" style={{ animationDelay: '0ms' }}>
                        <p className="text-purple-300 mb-2">[ AI TEAM STATUS: ONLINE ]</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                            {AGENT_LIST.map(({ name, Icon }, index) => (
                                <div key={name} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                    <Icon className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-400">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="min-h-[140px] flex flex-col justify-center items-center">
                {bootSequence >= 5 && (
                    <div className="animate-fade-in font-sans">
                        <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto">
                           STATUS: ONLINE. MISSION: To identify your optimal academic and personal trajectory through a comprehensive deep-analysis protocol.
                        </p>
                    </div>
                )}
                {bootSequence >= 6 && (
                     <button
                        onClick={onStart}
                        className="mt-6 px-8 py-3 bg-purple-600 text-white font-bold rounded-md shadow-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] animate-fade-in"
                    >
                        [ BEGIN ANALYSIS ]
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default WelcomeStep;