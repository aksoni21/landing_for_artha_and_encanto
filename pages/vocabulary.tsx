import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import VocabularyLookupForm from '../components/vocabulary/VocabularyLookupForm';
import VocabularyResultDisplay from '../components/vocabulary/VocabularyResultDisplay';
import VocabularyHistory from '../components/vocabulary/VocabularyHistory';
import VocabularyStats from '../components/vocabulary/VocabularyStats';
import vocabularyService, { 
  VocabularyResult, 
  VocabularyHistoryItem, 
  VocabularyStats as VocabularyStatsType,
  BookMetadata 
} from '../services/vocabularyService';

type TabType = 'lookup' | 'history' | 'stats';

const VocabularyPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('lookup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lookup state
  const [lookupResult, setLookupResult] = useState<VocabularyResult | null>(null);
  
  // History state
  const [history, setHistory] = useState<VocabularyHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState<VocabularyStatsType | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // User state
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    checkAuth();
    
    // Load data based on active tab
    if (activeTab === 'history' && history.length === 0) {
      loadHistory();
    } else if (activeTab === 'stats' && !stats) {
      loadStats();
    }
  }, [activeTab, history.length, stats]);

  const checkAuth = () => {
    // Check if user is authenticated (check both teacher-auth and supabase token)
    const teacherAuth = localStorage.getItem('teacher-auth');
    const supabaseToken = localStorage.getItem('supabase.auth.token');
    
    if (!teacherAuth && !supabaseToken) {
      router.push('/dashboard-login?redirect=' + encodeURIComponent('/vocabulary'));
      return;
    }
    
    // Check if teacher auth is valid and not expired
    if (teacherAuth) {
      try {
        const authData = JSON.parse(teacherAuth);
        const loginTime = new Date(authData.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLogin >= 24) {
          // Session expired
          localStorage.removeItem('teacher-auth');
          localStorage.removeItem('supabase.auth.token');
          router.push('/dashboard-login?redirect=' + encodeURIComponent('/vocabulary'));
          return;
        }
        
        // Use the user ID from auth data, not email
        setUserId(authData.id || authData.user?.id || authData.email);
      } catch {
        // Invalid auth data
        localStorage.removeItem('teacher-auth');
        localStorage.removeItem('supabase.auth.token');
        router.push('/dashboard-login?redirect=' + encodeURIComponent('/vocabulary'));
        return;
      }
    } else if (supabaseToken) {
      // Decode the supabase token to get user ID
      try {
        const payload = JSON.parse(atob(supabaseToken.split('.')[1]));
        setUserId(payload.sub); // Use the UUID from token 'sub' field
      } catch (e) {
        console.error('Failed to decode supabase token:', e);
        setUserId('teacher-' + Date.now());
      }
    }
  };

  const handleLookup = async (word: string, paragraph: string, bookMetadata: BookMetadata) => {
    setIsLoading(true);
    setError(null);
    setLookupResult(null);

    try {
      const result = await vocabularyService.lookupWord({
        word: vocabularyService.prepareWordForLookup(word),
        paragraph: vocabularyService.formatContextParagraph(paragraph),
        book_metadata: bookMetadata,
        user_id: userId || undefined,
      });
      
      // Debug: Log the raw API response
      console.log('🔍 Raw API response result:', result);
      console.log('🔍 Primary def audio_url:', result.primary_definition?.audio_url);

      setLookupResult(result);
      
      // Save to local history
      vocabularyService.saveToLocalHistory(result, bookMetadata);
      
      // Refresh history if on history tab
      if (activeTab === 'history') {
        loadHistory();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Lookup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!userId) return;
    
    setHistoryLoading(true);
    try {
      const historyData = await vocabularyService.getVocabularyHistory(userId, 50);
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to load history:', err);
      // Fallback to local history
      const localHistory = vocabularyService.getLocalHistory();
      setHistory(localHistory);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadStats = async () => {
    if (!userId) return;
    
    setStatsLoading(true);
    try {
      const statsData = await vocabularyService.getVocabularyStats(userId);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleHistoryItemClick = (item: VocabularyHistoryItem) => {
    // Switch to lookup tab and show the word's definition
    setActiveTab('lookup');
    // You could enhance this to re-populate the form and show the result
    alert(`Re-lookup: ${item.word}\nFrom: ${item.book_title}\n\nDefinition: ${item.selected_definition}`);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'lookup', label: 'Word Lookup', icon: '🔍' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'stats', label: 'Progress', icon: '📊' },
  ];

  return (
    <>
      <Head>
        <title>Literary Vocabulary Assistant - Encanto AI</title>
        <meta name="description" content="Understand complex words in their literary context with AI-powered assistance" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">
                📖 Literary Vocabulary Assistant
              </h1>
              <button
                onClick={() => router.push('/dashboard_ai')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Lookup Tab */}
          {activeTab === 'lookup' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Look up a word in its literary context
                </h2>
                <VocabularyLookupForm 
                  onLookup={handleLookup} 
                  isLoading={isLoading}
                />
              </div>
              
              <div>
                {lookupResult && (
                  <VocabularyResultDisplay 
                    result={lookupResult}
                    onClose={() => setLookupResult(null)}
                  />
                )}
                {!lookupResult && !isLoading && (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500">
                      Enter a word and its context to see definitions, etymology, and usage notes
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <VocabularyHistory 
              history={history}
              onWordClick={handleHistoryItemClick}
              isLoading={historyLoading}
            />
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <VocabularyStats 
              stats={stats}
              isLoading={statsLoading}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default VocabularyPage;