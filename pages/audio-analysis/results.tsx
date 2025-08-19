import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { scoreToCefr } from '../../utils/cefr';
import { scoreToToefl, calculateSectionScores } from '../../utils/toefl';
import { LatestAnalysisResult, HistoricalData, ComponentScoreDetail, TimeFrame, ScoringSystem } from '../../types/audio-analysis';
import TOEFLScoreIndicator from '../../components/analysis/TOEFLScoreIndicator';

// Import components from parent directory
import CEFRLevelIndicator from '../../components/analysis/CEFRLevelIndicator';
import ComponentScores from '../../components/analysis/ComponentScores';
import ProgressCharts from '../../components/analysis/ProgressCharts';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import ErrorHandler, { AppError, createError } from '../../components/ui/ErrorHandler';

// Import audio analysis service directly
import { audioAnalysisService } from '../../services/audioAnalysisService';

// Component types are now imported from types/audio-analysis.ts

const AudioAnalysisResultsPage: React.FC = () => {
  const router = useRouter();
  const [latestResult, setLatestResult] = useState<LatestAnalysisResult | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string; username?: string; name?: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>('TOEFL'); // Default to TOEFL for North America

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check authentication and load data
  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const { authService } = await import('../../services/authService');
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          await loadLatestResults();
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    // If no auth, proceed with fallback user ID
    await loadLatestResults();
  };


  const loadLatestResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get user's latest analysis session
      const userId = currentUser?.id || localStorage.getItem('user_id') || '3c64d808-ff9c-4808-a1a2-84ee7c38183c';
      
      // Get latest results with timeout
      const latestResults = await Promise.race([
        audioAnalysisService.getLatestResults(userId),
        new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);
      
      if (latestResults) {
        setLatestResult(latestResults);
        
        // Load historical data in parallel (non-blocking)
        audioAnalysisService.getAnalysisHistory(userId, 13)
          .then(setHistoricalData)
          .catch(err => console.warn('Failed to load history:', err));
      } else {
        setError(createError('server', 'No analysis results found. Please complete an analysis first.'));
      }
    } catch (error) {
      console.error('Failed to load latest results:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('timeout')) {
        setError(createError('network', 'Request timed out. Please check your connection and try again.'));
      } else if (errorMessage.includes('Failed to fetch')) {
        setError(createError('network', 'Unable to connect to the server. Please try again.'));
      } else {
        setError(createError('processing', `Failed to load analysis results: ${errorMessage}`));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load historical data when timeframe changes
  useEffect(() => {
    if (currentUser && latestResult) {
      loadHistoricalData();
    }
  }, [timeframe, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHistoricalData = async () => {
    try {
      const userId = currentUser?.id || localStorage.getItem('user_id') || '3c64d808-ff9c-4808-a1a2-84ee7c38183c';
      const history = await audioAnalysisService.getAnalysisHistory(userId, 13);
      setHistoricalData(history);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  };

  const handleNewAnalysis = () => {
    router.push('/audio-analysis');
  };

  const handleRetry = () => {
    setError(null);
    loadLatestResults();
  };

  // Convert analysis result to component scores format  
  const getComponentScores = (): ComponentScoreDetail[] => {
    if (!latestResult) return [];
    
    return Object.entries(latestResult.scores).map(([component, score]) => ({
      component,
      score: score,
      cefr: scoreToCefr(score),
      confidence: 0.85, // Default confidence
      details: {
        strengths: latestResult.strengths.filter(s => s.toLowerCase().includes(component)),
        improvements: latestResult.areas_for_improvement.filter(i => i.toLowerCase().includes(component)),
        examples: [`Example ${component} usage in your speech`]
      }
    }));
  };


  // Helper function to get next CEFR level
  const getNextCEFRLevel = (currentLevel: string): string | undefined => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex >= 0 && currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  };

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Latest Analysis Results
              </h1>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your results...</h2>
                <p className="text-gray-600">Please wait while we fetch your latest analysis.</p>
              </div>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Latest Analysis Results
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Your most recent English proficiency assessment
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Scoring System Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setScoringSystem('CEFR')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      scoringSystem === 'CEFR' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    CEFR
                  </button>
                  <button
                    onClick={() => setScoringSystem('TOEFL')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      scoringSystem === 'TOEFL' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    TOEFL
                  </button>
                </div>
                
                <motion.button
                  onClick={handleNewAnalysis}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Analysis
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {latestResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Results Header */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Analysis completed on {new Date(latestResult.completed_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {Math.round(latestResult.transcription.duration_seconds / 60)} minutes • 
                  Words: {latestResult.transcription.word_count}
                </p>
              </div>

              {/* Score Indicator - Full Width */}
              {scoringSystem === 'TOEFL' ? (
                <div className="flex justify-center">
                  <TOEFLScoreIndicator
                    totalScore={scoreToToefl(Object.values(latestResult.scores).reduce((sum, score) => sum + score, 0) / 5)}
                    sectionScores={calculateSectionScores(latestResult.scores)}
                    confidence={0.85}
                    size="large"
                    showDetails={true}
                    animated={true}
                    className="w-full max-w-4xl"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <CEFRLevelIndicator
                    currentLevel={latestResult.overall_cefr_level}
                    confidence={0.85}
                    score={Object.values(latestResult.scores).reduce((sum, score) => sum + score, 0) / 5}
                    nextLevel={getNextCEFRLevel(latestResult.overall_cefr_level)}
                    progressToNext={75} // Mock progress
                    size="large"
                    showDetails={true}
                    animated={true}
                    className="w-full max-w-4xl"
                  />
                </div>
              )}

              {/* Component Scores - Full Width */}
              <ComponentScores
                scores={getComponentScores()}
                animated={true}
                showDetails={true}
              />

              {/* Progress Charts */}
              <ProgressCharts
                historicalData={historicalData}
                currentScores={latestResult.scores}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />

              {/* Transcription */}
              {latestResult.transcription.text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    📝 Your Speech Transcription
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      &ldquo;{latestResult.transcription.text}&rdquo;
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Recommendations */}
              {latestResult.recommendations && latestResult.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    🎯 Personalized Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {latestResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Detailed Feedback */}
              {latestResult.detailed_feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    📊 Detailed Analysis
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {latestResult.detailed_feedback}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">No Analysis Results Found</h2>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t completed any audio analysis yet. Start your first analysis to see your English proficiency results here.
                </p>
                <motion.button
                  onClick={handleNewAnalysis}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your First Analysis
                </motion.button>
              </div>
            </div>
          )}
        </main>

        {/* Error Handler */}
        {error && (
          <ErrorHandler
            error={error}
            onDismiss={() => setError(null)}
            onRetry={handleRetry}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AudioAnalysisResultsPage;