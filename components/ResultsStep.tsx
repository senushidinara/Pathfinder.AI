import React, { useState, useMemo } from 'react';
import { CollegeRecommendation, Message } from '../types';
import { MapPinIcon, BookOpenIcon, InformationCircleIcon, ArrowDownTrayIcon, DocumentTextIcon, BuildingOfficeIcon, BriefcaseIcon, CurrencyDollarIcon, SparklesIcon, LightbulbIcon, UsersGroupIcon, ChevronLeftIcon, ChevronRightIcon, RocketLaunchIcon, NodeNetworkIcon, CompassIcon, TargetIcon } from './icons';
import { generatePdfReport } from '../utils/pdfExporter';
import ScoreRing from './common/ScoreRing';
import HowItWorksModal from './common/HowItWorksModal';

interface ResultsStepProps {
  recommendations: CollegeRecommendation[];
  onRestart: () => void;
  chatHistory: Message[];
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  Academic: BookOpenIcon,
  Campus: BuildingOfficeIcon,
  Career: BriefcaseIcon,
  Financial: CurrencyDollarIcon,
  XFactor: SparklesIcon,
  LearningStyle: LightbulbIcon,
  CulturalFit: UsersGroupIcon,
  Extracurricular: RocketLaunchIcon,
  Interdisciplinary: NodeNetworkIcon,
  Ambition: CompassIcon,
  Holistic: TargetIcon,
  ReasoningLog: DocumentTextIcon,
};

const ResultsStep: React.FC<ResultsStepProps> = ({ recommendations, onRestart, chatHistory }) => {
  const [selectedRec, setSelectedRec] = useState<CollegeRecommendation>(recommendations[0]);
  const [activeTabKey, setActiveTabKey] = useState<string>('ReasoningLog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const handleSelectRec = (rec: CollegeRecommendation) => {
    setSelectedRec(rec);
    setActiveTabKey('ReasoningLog'); // Reset to Reasoning Log tab on new selection
    setCurrentImageIndex(0);
  };
  
  const handleExportPdf = async () => {
    setIsExporting(true);
    await generatePdfReport(recommendations, chatHistory);
    setIsExporting(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? selectedRec.imageUrls.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === selectedRec.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const tabs = [
    { key: 'ReasoningLog', name: 'Full Reasoning Log', icon: 'ReasoningLog' },
    ...selectedRec.reasoningTabs.map(t => ({ key: t.toolName, name: t.toolName, icon: t.toolIcon }))
  ];

  return (
    <>
    {isModalOpen && <HowItWorksModal onClose={() => setIsModalOpen(false)} />}
    <div className="flex flex-col md:flex-row h-full flex-grow">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700/50 flex-shrink-0">
        <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Your Recommendations</h2>
            <p className="text-base text-indigo-400/80">Validated & Personalized</p>
          </div>
           <div className="flex items-center gap-2">
            <button onClick={handleExportPdf} disabled={isExporting} className="text-gray-400 hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-wait" aria-label="Export to PDF">
                <ArrowDownTrayIcon className="w-6 h-6"/>
            </button>
             <div className="relative group">
               <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-indigo-400 transition-colors animate-[pulse-subtle_3s_ease-in-out_infinite]" aria-label="How it works">
                  <InformationCircleIcon className="w-6 h-6"/>
               </button>
               <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none transition-opacity duration-300 whitespace-nowrap">
                  How this AI works
               </div>
             </div>
           </div>
        </div>
        <div className="overflow-y-auto max-h-48 md:h-[calc(100%-72px)]">
          {recommendations.map((rec) => (
            <button
              key={rec.universityName}
              onClick={() => handleSelectRec(rec)}
              className={`w-full text-left p-4 transition-colors duration-200 ${
                selectedRec.universityName === rec.universityName
                  ? 'bg-indigo-500/20'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <h3 className="font-semibold text-gray-200">{rec.universityName}</h3>
              <p className="text-base text-gray-400">{rec.country}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-6 md:p-8">
        {selectedRec && (
          <div>
            <div className="relative w-full h-48 md:h-64 mb-4 group">
                <img 
                    src={selectedRec.imageUrls[currentImageIndex]} 
                    alt={`Campus of ${selectedRec.universityName}`}
                    className="w-full h-full object-cover rounded-lg animate-fade-in"
                    key={selectedRec.universityName + currentImageIndex}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>

                {selectedRec.imageUrls.length > 1 && (
                    <>
                        <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white" aria-label="Previous image">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white" aria-label="Next image">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {selectedRec.imageUrls.map((_, index) => (
                                <div 
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                        <div className="absolute bottom-2 right-2 text-white text-xs bg-black/50 px-1.5 py-0.5 rounded-full font-mono">
                           {currentImageIndex + 1} / {selectedRec.imageUrls.length}
                        </div>
                    </>
                )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100">{selectedRec.universityName}</h1>
            <div className="flex items-center text-gray-400 mt-2 mb-4">
              <MapPinIcon className="w-5 h-5 mr-2"/>
              <span>{selectedRec.country}</span>
            </div>
            <div className="flex items-center bg-indigo-500/10 text-indigo-300 rounded-full px-4 py-1.5 text-base font-semibold w-fit border border-indigo-500/20 mb-6">
                <BookOpenIcon className="w-5 h-5 mr-2" />
                <span>Suggested Major: {selectedRec.suggestedMajor}</span>
            </div>

            {/* Analysis Depth Tabs */}
            <div className="mb-4">
                <div className="border-b border-gray-700 flex flex-wrap">
                    {tabs.map((tab) => {
                        const Icon = iconMap[tab.icon];
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTabKey(tab.key)}
                                className={`group flex items-center gap-2 px-4 py-2 text-base font-medium transition-all duration-200 border-b-2 rounded-t-md ${
                                    activeTabKey === tab.key
                                        ? 'border-indigo-400 text-white bg-indigo-500/10'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/60'
                                }`}
                            >
                                {Icon && <Icon className={`w-5 h-5 transition-colors ${activeTabKey === tab.key ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'}`} />}
                                {tab.name}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="p-4 bg-gray-900/30 rounded-lg min-h-[120px] animate-fade-in-up" style={{animationDuration: '0.3s'}}>
              {activeTabKey === 'ReasoningLog' ? (
                <div className="space-y-6">
                   <div>
                      <h4 className="font-semibold text-gray-200 text-xl mb-2">Personalization Analysis</h4>
                       <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 flex items-start gap-6">
                         <ScoreRing score={selectedRec.personalizationScore} />
                         <div>
                           <h5 className="font-semibold text-gray-200">Justification</h5>
                           <p className="text-gray-400 text-base italic whitespace-pre-wrap">{selectedRec.personalizationJustification}</p>
                         </div>
                       </div>
                   </div>
                   <div>
                       <h4 className="font-semibold text-gray-200 text-xl mb-2">Inter-Model Dialogue & Cross-Analysis</h4>
                       <p className="text-gray-300 text-base whitespace-pre-wrap leading-relaxed">{selectedRec.reasoningLog.interModelDialogue}</p>
                   </div>
                   <div>
                       <h4 className="font-semibold text-gray-200 text-xl mb-2">Lead Counselor Synthesis</h4>
                       <p className="text-gray-300 text-base whitespace-pre-wrap leading-relaxed">{selectedRec.reasoningLog.leadCounselorSynthesis}</p>
                   </div>
                    <div>
                       <h4 className="font-semibold text-gray-200 text-xl mb-2">Red Team Validation</h4>
                       <p className="text-gray-300 text-base whitespace-pre-wrap leading-relaxed">{selectedRec.reasoningLog.redTeamValidation}</p>
                   </div>
                </div>
              ) : (
                <p className="text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
                    {selectedRec.reasoningTabs.find(t => t.toolName === activeTabKey)?.analysis}
                </p>
              )}
            </div>
             <div className="mt-8 text-center">
                <button
                onClick={onRestart}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
                >
                Start New Analysis
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ResultsStep;