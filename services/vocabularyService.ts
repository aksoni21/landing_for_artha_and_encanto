// Vocabulary Service for Desktop/Web
// Interfaces and API communication for literary vocabulary lookups

export interface BookMetadata {
  title: string;
  author: string;
  year: string;
  genre?: string;
}

export interface Definition {
  text: string;
  source: string;
  part_of_speech: string;
  etymology?: string;
  examples: string[];
  historical: boolean;
  relevance_score: number;
  pronunciation?: string;  // IPA or other pronunciation guide
  audio_url?: string;     // URL to audio pronunciation
}

export interface VocabularyResult {
  success: boolean;
  word: string;
  primary_definition: Definition;
  other_definitions: Definition[];
  synonyms: {
    simple: string[];
    complex: string[];
  };
  etymology?: string;
  usage_note: string;
  context_analysis: {
    literary_period: string;
    formality_level: string;
    sentence_complexity: string;
    archaic_indicators: string[];
  };
}

export interface VocabularyLookupRequest {
  word: string;
  paragraph: string;
  book_metadata: BookMetadata;
  user_id?: string;
}

export interface VocabularyHistoryItem {
  word: string;
  context_paragraph: string;
  book_title: string;
  selected_definition: string;
  all_definitions: any;
  synonyms: any;
  context_analysis: any;
  created_at: string;
}

export interface VocabularyStats {
  total_lookups: number;
  unique_words: number;
  books_read: number;
  last_lookup?: string;
  recent_activity: Array<{
    date: string;
    lookups: number;
  }>;
}

class VocabularyService {
  private readonly baseUrl: string;

  constructor() {
    // Use Next.js API routes for frontend, or Python backend URL if specified
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // Check for teacher auth first, then supabase token
      const teacherAuth = localStorage.getItem('teacher-auth');
      const supabaseToken = localStorage.getItem('supabase.auth.token');
      
      // Return whichever token exists
      return supabaseToken || (teacherAuth ? 'demo-teacher-token' : null);
    }
    return null;
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Look up a word in literary context
   */
  async lookupWord(request: VocabularyLookupRequest): Promise<VocabularyResult> {
    try {
      console.log('📚 Looking up word:', request.word);
      
      const headers = this.getAuthHeaders();
      console.log('🔑 Sending headers:', headers);
      
      const response = await fetch(`${this.baseUrl}/api/vocabulary`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vocabulary lookup failed: ${response.status} - ${errorText}`);
      }

      const result: VocabularyResult = await response.json();
      console.log('✅ Vocabulary lookup successful:', result.word);
      
      return result;
    } catch (error) {
      console.error('❌ Vocabulary lookup error:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary lookup history for current user
   */
  async getVocabularyHistory(userId: string, limit: number = 20): Promise<VocabularyHistoryItem[]> {
    try {
      console.log('📖 Fetching vocabulary history for user:', userId);
      
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/vocabulary/history/${userId}?limit=${limit}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`History fetch failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch vocabulary history');
      }

      console.log('✅ Vocabulary history fetched:', result.data.length, 'items');
      return result.data;
    } catch (error) {
      console.error('❌ Vocabulary history error:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary learning statistics for current user
   */
  async getVocabularyStats(userId: string): Promise<VocabularyStats> {
    try {
      console.log('📊 Fetching vocabulary stats for user:', userId);
      
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/vocabulary/stats/${userId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stats fetch failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch vocabulary stats');
      }

      console.log('✅ Vocabulary stats fetched:', result.stats);
      return result.stats;
    } catch (error) {
      console.error('❌ Vocabulary stats error:', error);
      throw error;
    }
  }

  /**
   * Validate book metadata before sending lookup request
   */
  validateBookMetadata(metadata: BookMetadata): boolean {
    return !!(metadata.title && metadata.author && metadata.year);
  }

  /**
   * Clean and prepare word for lookup
   */
  prepareWordForLookup(word: string): string {
    return word.trim().toLowerCase().replace(/[^\w\s-]/g, '');
  }

  /**
   * Format context paragraph for optimal processing
   */
  formatContextParagraph(paragraph: string): string {
    return paragraph.trim().replace(/\s+/g, ' ');
  }

  /**
   * Save recent lookup to localStorage for offline access
   */
  saveToLocalHistory(result: VocabularyResult, bookMetadata: BookMetadata): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getLocalHistory();
      const newEntry = {
        word: result.word,
        book_title: bookMetadata.title,
        context_paragraph: '', // We don't store full paragraph in local storage
        selected_definition: result.primary_definition.text,
        created_at: new Date().toISOString(),
      };

      history.unshift(newEntry);
      // Keep only last 50 entries
      const trimmedHistory = history.slice(0, 50);
      
      localStorage.setItem('vocabulary_history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Failed to save to local history:', error);
    }
  }

  /**
   * Get local history from localStorage
   */
  getLocalHistory(): any[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem('vocabulary_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export default new VocabularyService();