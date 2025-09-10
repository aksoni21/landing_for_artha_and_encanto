import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ComponentScoreDetail, TimeFrame, ScoringSystem } from '../../types/audio-analysis';
import TOEFLScoreIndicator from '../../components/analysis/TOEFLScoreIndicator';
import CEFRLevelIndicator from '../../components/analysis/CEFRLevelIndicator';
import ComponentScores from '../../components/analysis/ComponentScores';
import ProgressCharts from '../../components/analysis/ProgressCharts';
import ErrorBoundary from '../../components/ui/ErrorBoundary';

// Sample demo data - similar to the real results but hardcoded
const demoResult = {
  overall_cefr_level: 'B2',
  overall_confidence: 0.87,
  completed_at: new Date().toISOString(),
  scores: {
    grammar: 78,
    vocabulary: 82,
    fluency: 75,
    pronunciation: 80,
    discourse: 76
  },
  transcription: {
    text: "I believe that technology has transformed our daily lives in remarkable ways. From smartphones to artificial intelligence, these innovations have made communication faster and more efficient. However, we must also consider the potential drawbacks, such as privacy concerns and the risk of becoming too dependent on digital devices.",
    duration_seconds: 180,
    word_count: 45
  },
  recommendations: [
    "Practice using more complex grammatical structures in your speech",
    "Work on reducing hesitations and filler words to improve fluency",
    "Expand your vocabulary with more advanced academic terms",
    "Focus on clearer articulation of consonant clusters"
  ],
  detailed_feedback: "Your English proficiency demonstrates a solid B2 level with particular strengths in vocabulary usage and pronunciation clarity. Your ideas are well-organized and you communicate effectively. To reach the next level, focus on incorporating more sophisticated grammatical structures and reducing minor hesitations that affect your overall fluency.",
  strengths: [
    "Clear pronunciation and intonation",
    "Good vocabulary range and accuracy",
    "Well-organized ideas and coherent expression"
  ],
  areas_for_improvement: [
    "Use of complex grammatical structures", 
    "Fluency and natural rhythm",
    "Advanced vocabulary in specific contexts"
  ],
  progress_to_next: 73,
  scoring_result: {
    toefl: {
      total: 89,
      speaking: 22,
      sections: {
        grammar: 23,
        vocabulary: 24,
        fluency: 21,
        pronunciation: 23,
        discourse: 22
      }
    }
  }
};

// Sample historical data with realistic variance - starting lower with more fluctuation
const demoHistoryData = [
  {
    date: '2023-09-12',
    overallScore: 48,
    grammar: 42,
    vocabulary: 52,
    fluency: 38,
    pronunciation: 55,
    discourse: 53,
    cefrLevel: 'A2',
    sessionDuration: 125
  },
  {
    date: '2023-09-28',
    overallScore: 53,
    grammar: 48,
    vocabulary: 59,
    fluency: 44,
    pronunciation: 58,
    discourse: 56,
    cefrLevel: 'A2',
    sessionDuration: 138
  },
  {
    date: '2023-10-15',
    overallScore: 51, // Natural dip after initial improvement
    grammar: 45,
    vocabulary: 57,
    fluency: 42,
    pronunciation: 56,
    discourse: 55,
    cefrLevel: 'A2',
    sessionDuration: 131
  },
  {
    date: '2023-10-30',
    overallScore: 58,
    grammar: 55,
    vocabulary: 62,
    fluency: 50,
    pronunciation: 61,
    discourse: 62,
    cefrLevel: 'A2',
    sessionDuration: 149
  },
  {
    date: '2023-11-18',
    overallScore: 61,
    grammar: 58,
    vocabulary: 66,
    fluency: 53,
    pronunciation: 64,
    discourse: 64,
    cefrLevel: 'B1', // First B1 breakthrough
    sessionDuration: 156
  },
  {
    date: '2023-12-02',
    overallScore: 57, // Regression - struggling to maintain B1
    grammar: 52,
    vocabulary: 63,
    fluency: 49,
    pronunciation: 61,
    discourse: 60,
    cefrLevel: 'A2',
    sessionDuration: 143
  },
  {
    date: '2023-12-20',
    overallScore: 64,
    grammar: 62,
    vocabulary: 68,
    fluency: 56,
    pronunciation: 67,
    discourse: 67,
    cefrLevel: 'B1',
    sessionDuration: 162
  },
  {
    date: '2024-01-08',
    overallScore: 68, // More confident at B1 level
    grammar: 66,
    vocabulary: 72,
    fluency: 61,
    pronunciation: 71,
    discourse: 70,
    cefrLevel: 'B1',
    sessionDuration: 168
  },
  {
    date: '2024-01-25',
    overallScore: 66, // Minor setback - difficult topic
    grammar: 63,
    vocabulary: 70,
    fluency: 58,
    pronunciation: 69,
    discourse: 70,
    cefrLevel: 'B1',
    sessionDuration: 152
  },
  {
    date: '2024-02-12',
    overallScore: 72,
    grammar: 70,
    vocabulary: 75,
    fluency: 65,
    pronunciation: 74,
    discourse: 76,
    cefrLevel: 'B1',
    sessionDuration: 174
  },
  {
    date: '2024-02-28',
    overallScore: 74, // Approaching B2
    grammar: 72,
    vocabulary: 78,
    fluency: 68,
    pronunciation: 76,
    discourse: 76,
    cefrLevel: 'B2', // B2 breakthrough
    sessionDuration: 179
  },
  {
    date: '2024-03-15',
    overallScore: 71, // B2 maintenance challenge
    grammar: 68,
    vocabulary: 76,
    fluency: 64,
    pronunciation: 74,
    discourse: 73,
    cefrLevel: 'B1',
    sessionDuration: 161
  },
  {
    date: '2024-03-28',
    overallScore: 78, // Current strong performance - solid B2
    grammar: 78,
    vocabulary: 82,
    fluency: 75,
    pronunciation: 80,
    discourse: 76,
    cefrLevel: 'B2',
    sessionDuration: 180
  }
];

const AudioAnalysisResultsDemoPage: React.FC = () => {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>('TOEFL');

  const handleNewAnalysis = () => {
    router.push('/audio-analysis');
  };

  // Helper function to get next CEFR level
  const getNextCEFRLevel = (currentLevel: string): string | undefined => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex >= 0 && currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  };

  // Convert demo result to component scores format
  const getComponentScores = (): ComponentScoreDetail[] => {
    return Object.entries(demoResult.scores).map(([component, score]) => ({
      component,
      score: score,
      cefr: demoResult.overall_cefr_level,
      confidence: demoResult.overall_confidence,
      details: {
        strengths: demoResult.strengths.filter(s => s.toLowerCase().includes(component)),
        improvements: demoResult.areas_for_improvement.filter(i => i.toLowerCase().includes(component)),
        examples: []
      }
    }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Demo Analysis Results
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Sample English proficiency assessment results
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Demo Badge */}
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  📊 Demo Data
                </div>
                
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
                  Try Real Analysis
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Results Header */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Demo analysis completed on {new Date(demoResult.completed_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {Math.round(demoResult.transcription.duration_seconds / 60)} minutes • 
                Words: {demoResult.transcription.word_count}
              </p>
            </div>

            {/* Score Indicator - Full Width */}
            {scoringSystem === 'TOEFL' ? (
              <div className="flex justify-center">
                <TOEFLScoreIndicator
                  totalScore={demoResult.scoring_result.toefl.total}
                  sectionScores={{
                    reading: 22,
                    listening: 22,
                    speaking: demoResult.scoring_result.toefl.speaking,
                    writing: 22
                  }}
                  confidence={demoResult.overall_confidence}
                  size="large"
                  showDetails={true}
                  animated={true}
                  className="w-full max-w-4xl"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <CEFRLevelIndicator
                  currentLevel={demoResult.overall_cefr_level}
                  confidence={demoResult.overall_confidence}
                  score={Object.values(demoResult.scores).reduce((sum, score) => sum + score, 0) / 5}
                  nextLevel={getNextCEFRLevel(demoResult.overall_cefr_level)}
                  progressToNext={demoResult.progress_to_next}
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
              historicalData={demoHistoryData}
              currentScores={demoResult.scores}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

            {/* Transcription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📝 Sample Speech Transcription
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;{demoResult.transcription.text}&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Recommendations */}
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
                {demoResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Detailed Feedback */}
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
                  {demoResult.detailed_feedback}
                </p>
              </div>
            </motion.div>

            {/* Strengths and Areas for Improvement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Strengths */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">💪</span>
                  Your Strengths
                </h3>
                <div className="space-y-3">
                  {demoResult.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                  <span className="mr-2">📈</span>
                  Areas for Growth
                </h3>
                <div className="space-y-3">
                  {demoResult.areas_for_improvement.map((area, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Ready to Get Your Real Results?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                This is just a demo with sample data. Get your actual English proficiency analysis 
                with personalized feedback based on your speech.
              </p>
              <motion.button
                onClick={handleNewAnalysis}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Analysis
              </motion.button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default AudioAnalysisResultsDemoPage;