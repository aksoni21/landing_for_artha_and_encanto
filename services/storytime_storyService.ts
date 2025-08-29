// -----storytime feature additions-----
// Story Service for Storytime Feature
// Handles all API communication for story-based language learning

export interface Story {
  id: string;
  title: string;
  author?: string;
  genre?: string;
  difficulty_level: number; // 1-6 (CEFR A1-C2)
  lexile_score?: number;
  word_count?: number;
  estimated_reading_time?: number; // minutes
  content: string;
  audio_url?: string;
  audio_duration?: number; // seconds
  cultural_context?: {
    theme?: string;
    moral?: string;
    origin?: string;
    cultural_elements?: string[];
    vocabulary_focus?: string[];
    social_issues?: string[];
    age_group?: string;
    contemporary_issues?: string[];
  };
  created_at?: string;
  updated_at?: string;
  user_progress?: UserStoryProgress;
}

export interface UserStoryProgress {
  overall_completion: number;
  skills_progress: {
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  };
  sessions_count: number;
}

export interface StorySession {
  id: string;
  user_id: string;
  story_id: string;
  session_type: 'reading' | 'listening' | 'speaking' | 'writing';
  started_at: string;
  completed_at?: string;
  completion_percentage: number;
  comprehension_score?: number;
  time_spent?: number; // seconds
}

export interface StoryVocabulary {
  id: string;
  story_id: string;
  word: string;
  definition?: string;
  context_sentence?: string;
  difficulty_level?: number;
  frequency_rank?: number;
  created_at?: string;
}

export interface StoryAssessment {
  id: string;
  user_id: string;
  story_id: string;
  assessment_type: 'comprehension' | 'vocabulary' | 'fluency' | 'writing';
  questions: any[];
  responses?: any[];
  score?: number;
  max_score?: number;
  completed_at?: string;
  feedback?: any;
}

export interface StoryResponse {
  response_type: 'summary' | 'retelling' | 'analysis' | 'creative';
  skill_type: 'speaking' | 'writing';
  content?: string;
  audio_url?: string;
  audio_duration?: number;
}

export interface DifficultyFeedback {
  rating: number; // 1-5 scale
  comments?: string;
  specific_challenges?: string[];
}

class StoryService {
  private baseUrl: string;
  private authToken?: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  // =====================================================
  // STORY MANAGEMENT
  // =====================================================

  async getStories(params?: {
    difficulty_level?: number;
    genre?: string;
    limit?: number;
    offset?: number;
  }): Promise<Story[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.difficulty_level) queryParams.append('difficulty_level', params.difficulty_level.toString());
      if (params?.genre) queryParams.append('genre', params.genre);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `${this.baseUrl}/api/stories?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async getStory(storyId: string, userId?: string | null): Promise<Story | null> {
    try {
      const queryParams = userId ? `?user_id=${userId}` : '';
      const url = `${this.baseUrl}/api/stories/${storyId}${queryParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch story: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  }

  async getRecommendedStories(userId: string): Promise<Story[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/recommended/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recommended stories: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching recommended stories:', error);
      throw error;
    }
  }

  // =====================================================
  // SESSION MANAGEMENT
  // =====================================================

  async createSession(
    storyId: string,
    sessionType: 'reading' | 'listening' | 'speaking' | 'writing',
    userId: string,
    sessionData?: any
  ): Promise<StorySession> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/${storyId}/sessions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          session_type: sessionType,
          session_data: {
            user_id: userId,
            ...sessionData
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(
    sessionId: string,
    updates: {
      completion_percentage?: number;
      comprehension_score?: number;
      time_spent?: number;
      completed?: boolean;
    }
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/sessions/${sessionId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update session: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async getUserStoryProgress(userId: string, storyId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/${storyId}/progress/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  // =====================================================
  // VOCABULARY MANAGEMENT
  // =====================================================

  async getStoryVocabulary(storyId: string, userId?: string): Promise<StoryVocabulary[]> {
    try {
      const queryParams = userId ? `?user_id=${userId}` : '';
      const url = `${this.baseUrl}/api/stories/${storyId}/vocabulary${queryParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vocabulary: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      throw error;
    }
  }

  // =====================================================
  // DIFFICULTY FEEDBACK
  // =====================================================

  async submitDifficultyFeedback(
    storyId: string,
    feedback: DifficultyFeedback
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/${storyId}/difficulty-feedback`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  // =====================================================
  // STORY RESPONSES
  // =====================================================

  async submitStoryResponse(
    storyId: string,
    response: StoryResponse
  ): Promise<{ response_id: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/stories/${storyId}/responses`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(response),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit response: ${res.statusText}`);
      }

      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error('Error submitting response:', error);
      throw error;
    }
  }

  // =====================================================
  // ASSESSMENTS
  // =====================================================

  async createAssessment(
    storyId: string,
    assessmentType: string,
    questions: any[]
  ): Promise<{ assessment_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/${storyId}/assessments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          assessment_type: assessmentType,
          questions: questions
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create assessment: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  async submitAssessment(
    assessmentId: string,
    responses: any[]
  ): Promise<{
    score: number;
    max_score: number;
    correct_answers: number;
    total_questions: number;
    percentage: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit assessment: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  async getUserStoryStats(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stories/stats/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  mapCEFRToDifficulty(cefrLevel: string): number {
    const mapping: { [key: string]: number } = {
      'A1': 1,
      'A2': 2,
      'B1': 3,
      'B2': 4,
      'C1': 5,
      'C2': 6
    };
    return mapping[cefrLevel.toUpperCase()] || 1;
  }

  mapDifficultyToCEFR(difficulty: number): string {
    const mapping: { [key: number]: string } = {
      1: 'A1',
      2: 'A2',
      3: 'B1',
      4: 'B2',
      5: 'C1',
      6: 'C2'
    };
    return mapping[difficulty] || 'A1';
  }

  getDifficultyLabel(difficulty: number): string {
    const labels: { [key: number]: string } = {
      1: 'Beginner',
      2: 'Elementary',
      3: 'Intermediate',
      4: 'Upper Intermediate',
      5: 'Advanced',
      6: 'Proficiency'
    };
    return labels[difficulty] || 'Unknown';
  }

  getDifficultyColor(difficulty: number): string {
    const colors: { [key: number]: string } = {
      1: '#4CAF50', // Green - Beginner
      2: '#8BC34A', // Light Green - Elementary
      3: '#FFC107', // Amber - Intermediate
      4: '#FF9800', // Orange - Upper Intermediate
      5: '#FF5722', // Deep Orange - Advanced
      6: '#F44336'  // Red - Proficiency
    };
    return colors[difficulty] || '#9E9E9E';
  }
}

// Create and export singleton instance
const storyService = new StoryService();
export default storyService;