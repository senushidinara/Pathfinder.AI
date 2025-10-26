
export enum AppStep {
  Welcome,
  Chat,
  Analysis,
  Results,
  Error,
}

export interface Message {
  id: number;
  sender: 'bot' | 'user';
  content: string;
}

export enum AIAgent {
  Academic = "Academic Program Strength Analyzer",
  Campus = "Campus Environment Matcher",
  Career = "Career Outcome Forecaster",
  Financial = "Financial Viability Estimator",
  XFactor = "X-Factor Identifier",
  LearningStyle = "Learning Style Adaptor",
  CulturalFit = "Cultural Fit Assessor",
  HolisticProfileSynthesizer = "Holistic Profile Synthesizer",
  ExtracurricularActivityProfiler = "Extracurricular Activity Profiler",
  InterdisciplinaryConnector = "Interdisciplinary Connector",
  AmbitionGoalNavigator = "Ambition & Goal Navigator",
  LeadCounselor = "Lead Counselor",
  RedTeam = "Red Team Validator",
}

export interface Thought {
    agent: AIAgent;
    thought: string;
}

export interface StructuredAIResponse {
    publicResponse: string;
    internalChatter: Thought[];
    matchingUniversitiesCount: number;
    matchingUniversitiesList?: string[];
}

export interface ReasoningTab {
  toolName: string;
  toolIcon: 'Academic' | 'Campus' | 'Career' | 'Financial' | 'XFactor' | 'LearningStyle' | 'CulturalFit' | 'Extracurricular' | 'Interdisciplinary' | 'Ambition' | 'Holistic';
  analysis: string;
}

export interface ReasoningLog {
  modelCommunications: { model: string; findings: string }[];
  interModelDialogue: string;
  leadCounselorSynthesis: string;
  redTeamValidation: string;
}

export interface CollegeRecommendation {
  universityName: string;
  country: string;
  imageUrls: string[];
  suggestedMajor: string;
  analysis: string; // This will now serve as a high-level summary
  notableFaculty?: string;
  researchOpportunities?: string;
  personalizationScore: number;
  personalizationJustification: string;
  reasoningTabs: ReasoningTab[];
  reasoningLog: ReasoningLog;
}

// Fix for line 73: Define the AIStudio interface to match existing global declarations and prevent type conflicts.
export interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}

declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}
