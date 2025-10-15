// API service for teacher dashboard data
class TeacherService {
  private baseUrl: string;

  constructor() {
    // Use relative URL like audioAnalysisService - works on all devices
    this.baseUrl = '/api';
  }

  private async getAuthToken(): Promise<string | null> {
    // Check for auth token in localStorage (client-side) or handle server-side auth
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async makeRequest(endpoint: string, options?: RequestInit) {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get all stories from the story library
  async getStories() {
    try {
      return await this.makeRequest('/stories');
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  // Get specific story by ID
  async getStory(storyId: string) {
    try {
      return await this.makeRequest(`/stories/${storyId}`);
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  }

  // Get story statistics for analytics
  async getStoryStats(userId?: string) {
    try {
      const endpoint = userId ? `/stories/stats/${userId}` : '/stories/stats';
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching story stats:', error);
      throw error;
    }
  }

  // Get audio analysis history for a student
  async getStudentAnalysisHistory(userId: string, limit = 20) {
    try {
      return await this.makeRequest(`/audio/history/${userId}?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching student analysis history:', error);
      throw error;
    }
  }

  // Get latest analysis for a student
  async getStudentLatestAnalysis(userId: string) {
    try {
      return await this.makeRequest(`/audio/latest/${userId}`);
    } catch (error) {
      console.error('Error fetching latest analysis:', error);
      throw error;
    }
  }

  // Get user by username (for student lookup)
  async getUserByUsername(username: string) {
    try {
      return await this.makeRequest(`/auth/user-by-username/${username}`);
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  // Get conversation sessions for a user
  async getConversationSessions(userId: string) {
    try {
      return await this.makeRequest(`/conversation/sessions/${userId}`);
    } catch (error) {
      console.error('Error fetching conversation sessions:', error);
      throw error;
    }
  }

  // Get conversation statistics
  async getConversationStats(userId: string) {
    try {
      return await this.makeRequest(`/conversation/stats/${userId}`);
    } catch (error) {
      console.error('Error fetching conversation stats:', error);
      throw error;
    }
  }

  // Create a story session (assignment)
  async createStorySession(storyId: string, sessionData: any) {
    try {
      return await this.makeRequest(`/stories/${storyId}/sessions`, {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error('Error creating story session:', error);
      throw error;
    }
  }

  // Update story session progress
  async updateStorySession(sessionId: string, updateData: any) {
    try {
      return await this.makeRequest(`/stories/sessions/${sessionId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error('Error updating story session:', error);
      throw error;
    }
  }

  // Get vocabulary for a story
  async getStoryVocabulary(storyId: string) {
    try {
      return await this.makeRequest(`/stories/${storyId}/vocabulary`);
    } catch (error) {
      console.error('Error fetching story vocabulary:', error);
      throw error;
    }
  }

  // Submit difficulty feedback for a story
  async submitStoryDifficultyFeedback(storyId: string, feedback: any) {
    try {
      return await this.makeRequest(`/stories/${storyId}/difficulty-feedback`, {
        method: 'POST',
        body: JSON.stringify(feedback),
      });
    } catch (error) {
      console.error('Error submitting story difficulty feedback:', error);
      throw error;
    }
  }

  // Get recommended stories for a user
  async getRecommendedStories(userId: string) {
    try {
      return await this.makeRequest(`/stories/recommended/${userId}`);
    } catch (error) {
      console.error('Error fetching recommended stories:', error);
      throw error;
    }
  }

  // Get users who have analysis data (for discovering students)
  async getUsersWithAnalysis(limit = 50, offset = 0) {
    try {
      return await this.makeRequest(`/audio/users-with-analysis?limit=${limit}&offset=${offset}`);
    } catch (error) {
      console.error('Error fetching users with analysis:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const teacherService = new TeacherService();
export default TeacherService;