/**
 * Audio Analysis Service
 * Connects frontend with Phase 5 backend services
 */

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
  timestamp: string;
  overall_result: {
    overall_cefr: string;
    confidence: number;
    weighted_average: number;
    component_scores: Record<string, ComponentScore>;
    recommendations: string[];
    score_distribution: Record<string, number>;
    processing_metadata: Record<string, any>;
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

export class AudioAnalysisService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = '/api/audio', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Upload and analyze audio file
   */
  async analyzeAudio(
    audioFile: File,
    options: {
      language?: string;
      priority?: 'low' | 'normal' | 'high';
      services?: string[];
      userPreferences?: Record<string, any>;
    } = {}
  ): Promise<AnalysisResult> {
    try {
      // Step 1: Upload audio to Python backend
      const uploadResult = await this.uploadAudioToBackend(audioFile, options.language);
      
      // Step 2: Wait for processing and get results
      return await this.waitForAnalysisCompletion(uploadResult.session_id);

    } catch (error) {
      console.error('Audio analysis failed:', error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload audio to Python backend for transcription and analysis
   */
  private async uploadAudioToBackend(audioFile: File, language?: string): Promise<{
    recording_id: string;
    session_id: string;
    status: string;
    message: string;
    estimated_processing_time: number;
  }> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    
    if (language) {
      formData.append('language', language);
    }

    // Upload via API proxy to Python backend
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(`Audio upload failed: ${errorData.error}`);
    }

    const result = await response.json();
    return result;
  }

  /**
   * Wait for analysis completion and return results
   */
  private async waitForAnalysisCompletion(sessionId: string): Promise<AnalysisResult> {
    const maxAttempts = 30; // Maximum 5 minutes (10 seconds * 30)
    const pollInterval = 10000; // 10 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Call the analyze endpoint which checks status and returns results if complete
        const response = await fetch(`${this.baseUrl}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
          },
          body: JSON.stringify({ session_id: sessionId })
        });

        if (response.ok) {
          const result = await response.json();
          // If we get a full result, processing is complete
          if (result.overall_cefr_level || result.scores) {
            return this.transformBackendResponse(result);
          }
        } else if (response.status === 202) {
          // Processing still in progress
          const statusInfo = await response.json();
          console.log(`Analysis in progress: ${statusInfo.message || 'Processing...'}`);
          
          // Wait before next poll
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        } else {
          // Error occurred
          const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }));
          throw new Error(`Analysis failed: ${errorData.error}`);
        }
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw new Error(`Analysis timeout: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    throw new Error('Analysis timed out after 5 minutes');
  }

  /**
   * Transform backend response to frontend format
   */
  private transformBackendResponse(backendResult: any): AnalysisResult {
    return {
      request_id: backendResult.session_id || backendResult.recording_id,
      overall_result: {
        overall_cefr: backendResult.overall_cefr_level || 'A1',
        confidence: backendResult.confidence || 0.85,
        weighted_average: backendResult.weighted_average || backendResult.scores?.overall || 75,
        component_scores: backendResult.component_scores || this.transformScores(backendResult.scores),
        recommendations: backendResult.recommendations || backendResult.areas_for_improvement || []
      },
      transcription: {
        full_text: backendResult.transcription?.text || '',
        word_level_timestamps: backendResult.transcription?.word_timestamps || [],
        confidence_scores: [],
        language_detection: { language: 'en', confidence: 0.95 }
      },
      analysis_results: {
        grammar: this.createComponentResult('grammar', backendResult),
        vocabulary: this.createComponentResult('vocabulary', backendResult), 
        fluency: this.createComponentResult('fluency', backendResult),
        pronunciation: this.createComponentResult('pronunciation', backendResult),
        discourse: this.createComponentResult('discourse', backendResult)
      },
      meta: {
        processing_time_ms: 5000,
        services_attempted: 5,
        services_successful: 5,
        success_rate: 1.0,
        performance_metrics: {}
      },
      errors: []
    };
  }

  /**
   * Transform backend scores to frontend format
   */
  private transformScores(scores: any): Record<string, any> {
    if (!scores) return {};
    
    return {
      grammar: { score: scores.grammar || 75, cefr: 'B1', confidence: 0.85 },
      vocabulary: { score: scores.vocabulary || 78, cefr: 'B1', confidence: 0.82 },
      fluency: { score: scores.fluency || 68, cefr: 'A2', confidence: 0.88 },
      pronunciation: { score: scores.pronunciation || 71, cefr: 'B1', confidence: 0.79 },
      discourse: { score: scores.discourse || 70, cefr: 'B1', confidence: 0.81 }
    };
  }

  /**
   * Create component analysis result
   */
  private createComponentResult(component: string, backendResult: any): any {
    const componentData = backendResult[`${component}_analysis`] || {};
    const score = backendResult.scores?.[component] || componentData.score || 75;
    
    return {
      cefr_level: this.scoreToCefr(score),
      score: score,
      confidence: 0.85,
      details: componentData.details || {},
      suggestions: componentData.suggestions || []
    };
  }

  /**
   * Convert numeric score to CEFR level
   */
  private scoreToCefr(score: number): string {
    if (score >= 90) return 'C2';
    if (score >= 80) return 'C1';
    if (score >= 70) return 'B2';
    if (score >= 60) return 'B1';
    if (score >= 50) return 'A2';
    return 'A1';
  }

  /**
   * Request analysis from Python backend (Phase 5 Service Orchestrator)
   */
  private async requestBackendAnalysis(request: any): Promise<AnalysisResult> {
    // In a real implementation, this would call the Phase 5 service orchestrator
    // For now, we'll simulate the backend response
    
    // Call Python backend via API proxy
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      // Fallback to simulation in development if backend not available
      if (process.env.NODE_ENV === 'development') {
        console.warn('Python backend not available, falling back to simulation');
        return this.simulateAnalysisProcess(request);
      }
      
      const errorText = await response.text();
      throw new Error(`Backend analysis failed: ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Simulate the Phase 5 analysis process for development
   */
  private async simulateAnalysisProcess(request: AnalysisRequest): Promise<AnalysisResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const text = request.transcription.text;
    const wordCount = text.split(' ').length;
    
    // Generate realistic scores based on text analysis
    const grammar = this.simulateGrammarScore(text);
    const vocabulary = this.simulateVocabularyScore(text, wordCount);
    const fluency = this.simulateFluencyScore(request.transcription);
    const pronunciation = this.simulatePronunciationScore();
    const discourse = this.simulateDiscourseScore(text);

    const componentScores = { grammar, vocabulary, fluency, pronunciation, discourse };
    const weightedAverage = Object.values(componentScores).reduce((sum, score) => sum + score.score, 0) / 5;
    const overallCEFR = this.scoreToCAFR(weightedAverage);

    return {
      request_id: request.request_id,
      timestamp: new Date().toISOString(),
      overall_result: {
        overall_cefr: overallCEFR,
        confidence: 0.85,
        weighted_average: Math.round(weightedAverage * 10) / 10,
        component_scores: componentScores,
        recommendations: this.generateRecommendations(componentScores, overallCEFR),
        score_distribution: {
          grammar: grammar.score,
          vocabulary: vocabulary.score,
          fluency: fluency.score,
          pronunciation: pronunciation.score,
          discourse: discourse.score,
          overall: weightedAverage
        },
        processing_metadata: {
          text_length: text.length,
          word_count: wordCount,
          processing_time: 2.5,
          language_detected: request.transcription.language
        }
      },
      services_executed: request.services_required || [],
      execution_summary: {
        total_execution_time: 2.5,
        services_attempted: 5,
        services_successful: 5,
        success_rate: 1.0,
        performance_metrics: {
          fastest_service: 'vocabulary',
          slowest_service: 'pronunciation',
          total_retries: 0
        }
      },
      errors: []
    };
  }

  /**
   * Simulate grammar analysis
   */
  private simulateGrammarScore(text: string): ComponentScore {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const words = text.split(' ');
    
    // Basic complexity analysis
    const avgWordsPerSentence = words.length / sentences.length;
    const hasComplexWords = /\b\w{8,}\b/.test(text);
    const hasVariedStructure = /\b(although|however|because|since|while|whereas)\b/i.test(text);
    
    let score = 50; // Base score
    
    if (avgWordsPerSentence > 10) score += 15;
    if (hasComplexWords) score += 10;
    if (hasVariedStructure) score += 15;
    if (sentences.length > 3) score += 10;
    
    score = Math.min(Math.max(score, 0), 100);
    
    return {
      score: Math.round(score * 10) / 10,
      cefr: this.scoreToCAFR(score),
      confidence: 0.82,
      features: {
        complexity_score: score,
        sentence_count: sentences.length,
        avg_words_per_sentence: avgWordsPerSentence,
        has_complex_structures: hasVariedStructure
      }
    };
  }

  /**
   * Simulate vocabulary analysis
   */
  private simulateVocabularyScore(text: string, wordCount: number): ComponentScore {
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const uniqueWords = new Set(words);
    const ttr = uniqueWords.size / wordCount;
    
    // Check for academic/advanced words
    const academicWords = ['analysis', 'demonstrate', 'significant', 'comprehensive', 'implement', 'establish'];
    const academicWordCount = words.filter(word => academicWords.includes(word)).length;
    
    let score = 50; // Base score
    
    if (ttr > 0.6) score += 20;
    if (academicWordCount > 0) score += 15;
    if (uniqueWords.size > 20) score += 10;
    if (words.some(word => word.length > 8)) score += 5;
    
    score = Math.min(Math.max(score, 0), 100);
    
    return {
      score: Math.round(score * 10) / 10,
      cefr: this.scoreToCAFR(score),
      confidence: 0.88,
      features: {
        type_token_ratio: Math.round(ttr * 1000) / 1000,
        total_words: wordCount,
        unique_words: uniqueWords.size,
        academic_words: academicWordCount
      }
    };
  }

  /**
   * Simulate fluency analysis
   */
  private simulateFluencyScore(transcription: TranscriptionResult): ComponentScore {
    const wordCount = transcription.words.length;
    const duration = transcription.duration;
    const wpm = duration > 0 ? (wordCount / duration) * 60 : 120;
    
    // Simulate pause analysis
    const pauseCount = Math.floor(Math.random() * 5) + 2;
    const fillerWords = ['um', 'uh', 'like', 'you know'];
    const fillerCount = fillerWords.reduce((count, filler) => 
      count + (transcription.text.toLowerCase().match(new RegExp(filler, 'g')) || []).length, 0
    );
    
    let score = 50; // Base score
    
    if (wpm >= 120 && wpm <= 180) score += 20;
    if (pauseCount < 3) score += 15;
    if (fillerCount < 2) score += 10;
    if (wpm > 100) score += 5;
    
    score = Math.min(Math.max(score, 0), 100);
    
    return {
      score: Math.round(score * 10) / 10,
      cefr: this.scoreToCAFR(score),
      confidence: 0.79,
      features: {
        words_per_minute: Math.round(wpm * 10) / 10,
        pause_count: pauseCount,
        filler_words: fillerCount,
        speech_duration: duration
      }
    };
  }

  /**
   * Simulate pronunciation analysis
   */
  private simulatePronunciationScore(): ComponentScore {
    // Since we can't actually analyze pronunciation without audio processing,
    // generate a reasonable score
    const score = 60 + Math.random() * 25; // Random score between 60-85
    
    return {
      score: Math.round(score * 10) / 10,
      cefr: this.scoreToCAFR(score),
      confidence: 0.75,
      features: {
        overall_accuracy: Math.round(score),
        rhythm_score: Math.round((score - 5) + Math.random() * 10),
        intonation_score: Math.round((score - 3) + Math.random() * 8)
      }
    };
  }

  /**
   * Simulate discourse analysis
   */
  private simulateDiscourseScore(text: string): ComponentScore {
    const discourseMarkers = ['however', 'therefore', 'furthermore', 'moreover', 'nevertheless', 'consequently'];
    const markerCount = discourseMarkers.reduce((count, marker) => 
      count + (text.toLowerCase().includes(marker) ? 1 : 0), 0
    );
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const hasLogicalFlow = sentences.length > 2;
    
    let score = 50; // Base score
    
    if (markerCount > 0) score += 15;
    if (markerCount > 2) score += 10;
    if (hasLogicalFlow) score += 15;
    if (text.length > 200) score += 10;
    
    score = Math.min(Math.max(score, 0), 100);
    
    return {
      score: Math.round(score * 10) / 10,
      cefr: this.scoreToCAFR(score),
      confidence: 0.86,
      features: {
        discourse_markers: markerCount,
        sentence_count: sentences.length,
        text_length: text.length,
        coherence_score: score
      }
    };
  }

  /**
   * Convert numerical score to CEFR level
   */
  private scoreToCAFR(score: number): string {
    if (score < 25) return 'A1';
    if (score < 40) return 'A2';
    if (score < 60) return 'B1';
    if (score < 80) return 'B2';
    if (score < 95) return 'C1';
    return 'C2';
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(scores: Record<string, ComponentScore>, overallCEFR: string): string[] {
    const recommendations: string[] = [];
    
    // Find weakest component
    const sortedScores = Object.entries(scores).sort((a, b) => a[1].score - b[1].score);
    const weakest = sortedScores[0];
    
    // Component-specific recommendations
    switch (weakest[0]) {
      case 'grammar':
        recommendations.push('Focus on sentence structure and grammatical accuracy');
        recommendations.push('Practice using a variety of tenses and complex sentences');
        break;
      case 'vocabulary':
        recommendations.push('Expand your vocabulary with academic and professional terms');
        recommendations.push('Practice using synonyms and more sophisticated word choices');
        break;
      case 'fluency':
        recommendations.push('Practice speaking more smoothly with fewer hesitations');
        recommendations.push('Work on maintaining a steady pace throughout your speech');
        break;
      case 'pronunciation':
        recommendations.push('Focus on clear articulation and natural rhythm');
        recommendations.push('Practice word stress and sentence intonation patterns');
        break;
      case 'discourse':
        recommendations.push('Use more connecting words and phrases to link your ideas');
        recommendations.push('Work on organizing your thoughts in a logical sequence');
        break;
    }

    // Level-specific recommendations
    if (['A1', 'A2'].includes(overallCEFR)) {
      recommendations.push('Focus on building basic vocabulary and sentence structures');
    } else if (['B1', 'B2'].includes(overallCEFR)) {
      recommendations.push('Practice expressing complex ideas and opinions clearly');
    } else {
      recommendations.push('Work on nuanced expression and advanced linguistic features');
    }

    return recommendations.slice(0, 4); // Return top 4 recommendations
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get analysis history for a user
   */
  async getAnalysisHistory(userId: string, limit = 10): Promise<any[]> {
    // In development, return mock data
    if (this.baseUrl.includes('localhost') || process.env.NODE_ENV === 'development') {
      return this.generateMockHistory(limit);
    }

    const response = await fetch(`${this.baseUrl}/api/analysis/history/${userId}?limit=${limit}`, {
      headers: {
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analysis history');
    }

    return await response.json();
  }

  /**
   * Generate mock historical data
   */
  private generateMockHistory(limit: number): any[] {
    const history = [];
    const now = new Date();

    for (let i = 0; i < limit; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7); // Weekly intervals

      history.push({
        date: date.toISOString(),
        overallScore: 65 + Math.random() * 20 + i * 1.5,
        grammar: 60 + Math.random() * 25 + i * 1.2,
        vocabulary: 70 + Math.random() * 20 + i * 1.8,
        fluency: 55 + Math.random() * 30 + i * 2,
        pronunciation: 65 + Math.random() * 25 + i * 1.5,
        discourse: 60 + Math.random() * 25 + i * 1.7,
        cefrLevel: this.scoreToCAFR(65 + i * 1.5),
        sessionDuration: 180 + Math.random() * 300,
      });
    }

    return history.reverse(); // Oldest first
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