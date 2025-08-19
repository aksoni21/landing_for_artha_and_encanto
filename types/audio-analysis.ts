/**
 * TypeScript interfaces for audio analysis
 */

export interface LatestAnalysisResult {
  session_id: string;
  recording_id: string;
  overall_cefr_level: string;
  overall_toefl_score?: number; // Optional TOEFL score
  toefl_section_scores?: { // Optional TOEFL section breakdown
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
    total: number;
  };
  scores: {
    grammar: number;
    vocabulary: number;
    fluency: number;
    pronunciation: number;
    discourse: number;
  };
  transcription: {
    text: string;
    word_count: number;
    duration_seconds: number;
  };
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  detailed_feedback: string;
  completed_at: string;
}

export interface HistoricalData {
  date: string;
  overallScore: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  discourse: number;
  cefrLevel: string;
  toeflScore?: number; // Optional TOEFL score for historical data
  sessionDuration: number;
}

export interface ComponentScoreDetail {
  component: string;
  score: number;
  cefr: string;
  confidence: number;
  details: {
    strengths: string[];
    improvements: string[];
    examples: string[];
  };
}

export interface AudioAnalysisError {
  type: 'authentication' | 'server' | 'processing' | 'network';
  message: string;
  details?: any;
}

export interface AnalysisHistoryItem {
  session_id: string;
  recording_id: string;
  cefr_level: string;
  overall_score: number;
  status: string;
  duration_seconds: number;
  started_at: string;
  completed_at: string | null;
  scores: {
    fluency: number;
    pronunciation: number;
    discourse: number;
    grammar?: number;
    vocabulary?: number;
  };
}

export interface AnalysisHistoryResponse {
  user_id: string;
  total_count: number;
  analyses: AnalysisHistoryItem[];
  limit: number;
  offset: number;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

export type TimeFrame = 'week' | 'month' | 'quarter' | 'year';

export type ScoringSystem = 'CEFR' | 'TOEFL' | 'BOTH';