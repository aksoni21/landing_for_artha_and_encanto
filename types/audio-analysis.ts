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
    confidence_score?: number; // Transcription confidence
  };
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  detailed_feedback: string;
  completed_at: string;
  // New confidence-related fields
  overall_confidence?: number; // Overall analysis confidence (0-1)
  component_confidences?: { // Component-specific confidence scores
    grammar?: number;
    vocabulary?: number;
    fluency?: number;
    pronunciation?: number;
    discourse?: number;
  };
  scoring_result?: any; // Full scoring result object from backend
  progress_to_next?: number; // Progress to next CEFR level (0-100)
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
  confidence?: number; // Optional - only present if real confidence data exists
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