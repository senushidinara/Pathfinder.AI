import React, { useRef, useEffect } from 'react';
import { AIAgent, Thought } from '../../types';
import { BookOpenIcon, BuildingOfficeIcon, BriefcaseIcon, CurrencyDollarIcon, SparklesIcon, LightbulbIcon, UsersGroupIcon, ScaleIcon, EyeIcon, TargetIcon, RocketLaunchIcon, NodeNetworkIcon, CompassIcon } from '../icons';

interface AITeamStatusSidebarProps {
  thoughtHistory: Thought[];
}

const AGENT_ICONS: { [key in AIAgent]?: React.FC<React.SVGProps<SVGSVGElement>> } = {
    [AIAgent.Academic]: BookOpenIcon,
    [AIAgent.Campus]: BuildingOfficeIcon,
    [AIAgent.Career]: BriefcaseIcon,
    [AIAgent.Financial]: CurrencyDollarIcon,
    [AIAgent.XFactor]: SparklesIcon,
    [AIAgent.LearningStyle]: LightbulbIcon,
    [AIAgent.CulturalFit]: UsersGroupIcon,
    [AIAgent.HolisticProfileSynthesizer]: TargetIcon,
    [AIAgent.ExtracurricularActivityProfiler]: RocketLaunchIcon,
    [AIAgent.InterdisciplinaryConnector]: NodeNetworkIcon,
    [AIAgent.AmbitionGoalNavigator]: CompassIcon,
    [AIAgent.LeadCounselor]: ScaleIcon,
    [AIAgent.RedTeam]: EyeIcon,
};


const AITeamStatusSidebar: React.FC<AITeamStatusSidebarProps> = ({ thoughtHistory }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughtHistory]);

  return (
    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700/50 flex-shrink-0 flex flex-col">
      <div className="p-4 border-b border-gray-700/50">
        <h2 className="text-xl font-bold text-gray-100">AI Team Chatter</h2>
        <p className="text-base text-indigo-400/80 font-mono">LIVE INTERNAL DIALOGUE</p>
      </div>
      <div ref={scrollRef} className="overflow-y-auto flex-grow p-4 space-y-4">
        {thoughtHistory.length === 0 && (
          <div className="text-center text-gray-500 italic mt-4">
            Waiting for initial analysis...
          </div>
        )}
        {thoughtHistory.map((thought, index) => {
          const Icon = AGENT_ICONS[thought.agent];
          return (
            <div key={index} className="flex items-start gap-3 animate-fade-in">
              {Icon && <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-400" />}
              <div>
                <h3 className="text-base font-semibold text-gray-200">{thought.agent}</h3>
                <p className="text-sm text-gray-400">
                  {thought.thought}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AITeamStatusSidebar;