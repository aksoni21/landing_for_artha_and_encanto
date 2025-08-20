/**
 * Audio Analysis Service - Simplified
 * Connects frontend with backend audio analysis services
 */

import { scoreToCefr } from '../utils/cefr';
import { scoreToToefl, calculateSectionScores } from '../utils/toefl';
import { getBackendURL } from '../utils/environment';
import { LatestAnalysisResult, HistoricalData, AnalysisHistoryResponse } from '../types/audio-analysis';

// Basic interfaces
interface TranscriptionResult {
  text: string;
  words: Array<{
    word: string;
    start: number;
    end: number;
  }>;
  confidence: number;
  language: string;
  duration: number;
}

interface AnalysisRequest {
  request_id: string;
  transcription: TranscriptionResult;
  audio_data?: ArrayBuffer;
  sample_rate?: number;
  user_preferences?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high';
  services_required?: string[];
}

interface ComponentScore {
  score: number;
  cefr: string;
  confidence: number;
  features?: Record<string, any>;
}

interface AnalysisResult {
  request_id: string;
  timestamp?: string;
  // Support both nested and flat response structures for TOEFL/CEFR
  overall_result?: {
    overall_cefr?: string;
    overall_toefl?: number;
    confidence: number;
    weighted_average: number;
    component_scores: Record<string, ComponentScore>;
    recommendations: string[];
    score_distribution: Record<string, number>;
    processing_metadata: Record<string, any>;
  };
  // Flat structure from backend
  overall_cefr_level?: string;
  overall_toefl_score?: number;
  scores?: Record<string, number>;
  recommendations?: string[];
  confidence?: number;
  transcription?: {
    full_text: string;
    word_level_timestamps: any[];
    confidence_scores: any[];
    language_detection: { language: string; confidence: number };
  };
  analysis_results?: {
    grammar: any;
    vocabulary: any;
    fluency: any;
    pronunciation: any;
    discourse: any;
  };
  services_executed: string[];
  execution_summary: {
    total_execution_time: number;
    services_attempted: number;
    services_successful: number;
    success_rate: number;
    performance_metrics: Record<string, any>;
  };
  errors: string[];
}

class AudioAnalysisService {
  private baseUrl: string;

  constructor() {
    // Use the same base URL pattern as other services
    this.baseUrl = '/api/audio';
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Analyze audio file (upload + process)
   */
  async analyzeAudio(file: File, _options?: { priority?: string; services?: string[] }): Promise<AnalysisResult> {
    console.log('🎬 Starting analyzeAudio...');
    
    // First upload the file
    const uploadResult = await this.uploadAudio(file);
    console.log('📤 Upload result:', uploadResult);
    
    // Then wait for analysis completion
    if (uploadResult.session_id) {
      console.log('🔄 Starting polling for session:', uploadResult.session_id);
      return await this.waitForAnalysisCompletion(uploadResult.session_id);
    }
    
    throw new Error('Failed to start analysis - no session ID returned');
  }

  /**
   * Upload audio file for analysis
   */
  async uploadAudio(file: File, userId?: string, language?: string, scoringMode?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file); // Match backend parameter name
    
    // Use demo user ID if none provided
    formData.append('user_id', userId || 'demo-user-12345');
    formData.append('language', language || 'en');
    formData.append('scoring_mode', scoringMode || 'toefl');
    formData.append('metadata', JSON.stringify({}));

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(`Audio upload failed: ${errorData.error}`);
    }

    return await response.json();
  }

  /**
   * Wait for analysis completion and return results
   */
  private async waitForAnalysisCompletion(sessionId: string): Promise<AnalysisResult> {
    const maxAttempts = 24; // Maximum 4 minutes with exponential backoff
    const baseInterval = 2000; // Start with 2 seconds
    const maxInterval = 15000; // Cap at 15 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Exponential backoff: 2s, 4s, 6s, 8s, 10s, 12s, 15s, 15s...
        const currentInterval = Math.min(baseInterval * (attempt + 1), maxInterval);
        
        console.log(`🔄 Analysis attempt ${attempt + 1}/${maxAttempts} for session: ${sessionId}`);
        
        // Use GET for status checking (more RESTful)
        const response = await fetch(`${this.baseUrl}/status/${sessionId}`, {
          method: 'GET',
          headers: {
            ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
          }
        });

        console.log(`📡 API Response: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const statusResult = await response.json();
          console.log('✅ Got status response:', statusResult);
          
          // Check if analysis is completed
          if (statusResult.status === 'completed') {
            // Fetch the actual results
            console.log('🎉 Analysis completed, fetching results...');
            return await this.getAnalysisResults(sessionId);
          }
          
          // Check for failed status
          if (statusResult.status === 'failed') {
            throw new Error(statusResult.error_message || 'Analysis failed');
          }
          
          // Still processing - continue polling
          console.log(`⏳ Status: ${statusResult.status}, Progress: ${statusResult.progress * 100}%`);
        }

        if (response.status === 404) {
          throw new Error('Analysis session not found');
        }

        if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json().catch(() => ({ error: 'Client error' }));
          throw new Error(`Client error: ${errorData.error || response.statusText}`);
        }

        // Wait before next attempt (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, currentInterval));
        
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        if (attempt === maxAttempts - 1) {
          throw new Error(`Analysis failed after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Wait before retry (exponential backoff)
        const currentInterval = Math.min(baseInterval * (attempt + 1), maxInterval);
        await new Promise(resolve => setTimeout(resolve, currentInterval));
      }
    }

    throw new Error('Analysis timed out');
  }

  /**
   * Get analysis results for a completed session
   */
  private async getAnalysisResults(sessionId: string): Promise<AnalysisResult> {
    const response = await fetch(`${this.baseUrl}/results/${sessionId}`, {
      method: 'GET',
      headers: {
        ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to get results' }));
      throw new Error(`Failed to get analysis results: ${errorData.error}`);
    }

    return await response.json();
  }

  /**
   * Submit audio for analysis and wait for results
   */
  async submitAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend analysis failed: ${errorText}`);
    }

    return await response.json();
  }


  /**
   * Get enhanced analysis results with TOEFL scoring support
   */
  async getEnhancedResults(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/results/enhanced/${sessionId}`, {
        headers: {
          ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
        }
      });

      if (response.ok) {
        return await response.json();
      }

      if (response.status === 404) {
        return null; // No results found
      }

      throw new Error('Failed to fetch enhanced results');
    } catch (error) {
      console.error('Error fetching enhanced results:', error);
      throw error;
    }
  }

  /**
   * Get latest analysis results for a user
   */
  async getLatestResults(userId: string): Promise<LatestAnalysisResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/latest/${userId}`, {
        headers: {
          ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add TOEFL scores if not present
        if (data && data.scores) {
          const avgScore = Object.values(data.scores as Record<string, number>)
            .reduce((sum, score) => sum + score, 0) / Object.keys(data.scores).length;
          
          data.overall_toefl_score = scoreToToefl(avgScore);
          data.toefl_section_scores = calculateSectionScores(data.scores);
        }
        
        return data;
      }

      if (response.status === 404) {
        return null; // No results found
      }

      throw new Error('Failed to fetch latest results');
    } catch (error) {
      console.error('Error fetching latest results:', error);
      throw error;
    }
  }


  /**
   * Get analysis history for a user
   */
  async getAnalysisHistory(userId: string, limit = 10): Promise<HistoricalData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${userId}?limit=${limit}`, {
        headers: {
          ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform backend data to frontend format
        if (data.analyses && Array.isArray(data.analyses)) {
          return data.analyses.map((analysis: any) => {
            const overallScore = analysis.overall_score || 0;
            return {
              date: analysis.completed_at || analysis.started_at || new Date().toISOString(),
              overallScore,
              grammar: analysis.scores?.grammar || 0,
              vocabulary: analysis.scores?.vocabulary || 0,
              fluency: analysis.scores?.fluency || 0,
              pronunciation: analysis.scores?.pronunciation || 0,
              discourse: analysis.scores?.discourse || 0,
              cefrLevel: analysis.cefr_level || 'B1',
              toeflScore: scoreToToefl(overallScore), // Add TOEFL score
              sessionDuration: analysis.duration_seconds || 180
            };
          });
        }
        
        return [];
      }

      throw new Error('Failed to fetch analysis history');
    } catch (error) {
      console.error('Error fetching analysis history:', error);
      return [];
    }
  }


  /**
   * Check service health
   */
  async getServiceHealth(): Promise<any> {
    if (this.baseUrl.includes('localhost') || process.env.NODE_ENV === 'development') {
      return {
        status: 'healthy',
        services: {
          transcription: 'operational',
          analysis: 'operational',
          scoring: 'operational'
        },
        timestamp: new Date().toISOString()
      };
    }

    const response = await fetch(`${this.baseUrl}/api/health`);
    return await response.json();
  }
}

// Export singleton instance
export const audioAnalysisService = new AudioAnalysisService();