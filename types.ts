export interface Message {
  role: 'user' | 'model';
  content: string;
  isDrafting?: boolean;
}

export interface ResearchResult {
  query: string;
  findings: string;
  urls: string[];
}

export type AppStage = 'intro' | 'about' | 'interview' | 'researching' | 'drafting' | 'review';

export interface AppState {
  stage: AppStage;
  chatHistory: Message[];
  finalPost: string;
  researchData: ResearchResult | null;
  darkMode: boolean;
  topic: string;
}