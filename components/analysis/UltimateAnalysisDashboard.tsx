import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  AcademicCapIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid';

// Import our enhanced components
import PronunciationFeedback from './PronunciationFeedback';
import FluencyAnalysis from './FluencyAnalysis';
import GrammarExplanations from './GrammarExplanations';
import VocabularyInsights from './VocabularyInsights';

interface PronunciationData {
  overall_accuracy: number;
  stress_pattern_accuracy: number;
  rhythm_score: number;
  intonation_score: number;
  problematic_sounds: Array<{
    phoneme: string;
    word_examples: string[];
    acoustic_issue: string;
    improvement_tip: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  l1_interference_patterns: Array<{
    pattern: string;
    examples: string[];
    frequency: 'high' | 'medium' | 'low';
    acoustic_evidence: string;
  }>;
  stress_errors: Array<{
    word: string;
    incorrect_stress: string;
    correct_stress: string;
    impact: string;
  }>;
  segmental_accuracy: number;
  suprasegmental_accuracy: number;
  improvement_priorities: string[];
  acoustic_evidence: boolean;
}

interface PauseCategory {
  type: 'lexical_retrieval' | 'planning_pause' | 'filled_pause' | 'hesitation';
  count: number;
  avg_duration_ms: number;
  examples: string[];
}

interface ProsodicFeatures {
  rhythm_consistency: number;
  stress_timing_accuracy: number;
  intonation_appropriateness: number;
  connected_speech_quality: number;
}

interface FluencyBreakdownCause {
  cause: string;
  evidence: string;
  frequency: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface FluencyData {
  words_per_minute: number;
  fluency_score: number;
  confidence_level: number;
  total_pauses: number;
  pause_frequency_per_minute: number;
  avg_pause_duration_ms: number;
  long_pauses_count: number;
  filled_pauses_count: number;
  self_corrections_count: number;
  false_starts_count: number;
  pause_categories: PauseCategory[];
  prosodic_features: ProsodicFeatures;
  fluency_breakdown_causes: FluencyBreakdownCause[];
  improvement_priorities: string[];
  filler_words: { [key: string]: number };
  speech_rate_consistency: number;
  connected_speech_quality: number;
}

interface GrammarError {
  error_type: string;
  original: string;
  corrected: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
  cefr_level: string;
  practice_suggestion: string;
  position?: {
    start: number;
    end: number;
  };
}

interface GrammarData {
  errors: GrammarError[];
  total_errors: number;
  complexity_score: number;
  avg_sentence_length: number;
  subordination_index: number;
  passive_voice_percentage: number;
  modal_verb_usage: number;
  conditional_structures: number;
  overall_grammar_score: number;
}

interface WordFrequencyLevel {
  level: string;
  words: string[];
  count: number;
  percentage: number;
}

interface AcademicWord {
  word: string;
  definition: string;
  frequency: number;
  academic_list: string;
  example_usage: string;
}

interface VocabularyData {
  total_words: number;
  unique_words: number;
  type_token_ratio: number;
  word_frequency_levels: WordFrequencyLevel[];
  academic_words: AcademicWord[];
  cefr_level: string;
  lexical_diversity: number;
  advanced_vocabulary_percentage: number;
  rare_words: string[];
  suggestions: string[];
}

interface AnalysisData {
  pronunciation: PronunciationData;
  fluency: FluencyData;
  grammar: GrammarData;
  vocabulary: VocabularyData;
  overall_scores: {
    overall_score: number;
    pronunciation_score: number;
    fluency_score: number;
    grammar_score: number;
    vocabulary_score: number;
    cefr_level: string;
  };
  session_info: {
    duration: number;
    user_l1: string;
    text: string;
    analysis_date: string;
  };
}

interface UltimateAnalysisDashboardProps {
  data: AnalysisData;
  className?: string;
}

type AnalysisTab = 'overview' | 'pronunciation' | 'fluency' | 'grammar' | 'vocabulary';

const UltimateAnalysisDashboard: React.FC<UltimateAnalysisDashboardProps> = ({
  data,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
  // Removed unused state variables

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon, color: 'blue' },
    { id: 'pronunciation', label: 'Pronunciation', icon: SpeakerWaveIcon, color: 'purple' },
    { id: 'fluency', label: 'Fluency', icon: ArrowTrendingUpIcon, color: 'teal' },
    { id: 'grammar', label: 'Grammar', icon: DocumentTextIcon, color: 'green' },
    { id: 'vocabulary', label: 'Vocabulary', icon: AcademicCapIcon, color: 'orange' }
  ] as const;

  const getCEFRColor = (level: string) => {
    switch (level) {
      case 'A1': return 'from-green-400 to-green-600';
      case 'A2': return 'from-green-500 to-green-700';
      case 'B1': return 'from-yellow-400 to-yellow-600';
      case 'B2': return 'from-yellow-500 to-yellow-700';
      case 'C1': return 'from-orange-400 to-orange-600';
      case 'C2': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Removed unused function

  const achievements = useMemo(() => {
    const achievements = [];

    if (data.overall_scores.overall_score >= 90) {
      achievements.push({ title: '🏆 Excellence Award', description: 'Outstanding overall performance!' });
    }
    if (data.pronunciation.overall_accuracy >= 85) {
      achievements.push({ title: '🗣️ Clear Speaker', description: 'Excellent pronunciation clarity' });
    }
    if (data.fluency.fluency_score >= 85) {
      achievements.push({ title: '⚡ Fluency Master', description: 'Smooth and natural speech flow' });
    }
    if (data.grammar.total_errors <= 2) {
      achievements.push({ title: '📝 Grammar Pro', description: 'Near-perfect grammar usage' });
    }
    if (data.vocabulary.advanced_vocabulary_percentage >= 15) {
      achievements.push({ title: '📚 Word Wizard', description: 'Rich and sophisticated vocabulary' });
    }
    if (data.overall_scores.cefr_level === 'C2') {
      achievements.push({ title: '🎓 Language Master', description: 'Native-like proficiency achieved' });
    }

    return achievements;
  }, [data]);

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Hero Stats */}
      <div className={`bg-gradient-to-r ${getCEFRColor(data.overall_scores.cefr_level)} text-white rounded-2xl p-8`}>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <TrophyIcon className="w-8 h-8" />
              <div>
                <h2 className="text-3xl font-bold">CEFR {data.overall_scores.cefr_level}</h2>
                <p className="text-white/80">Overall Language Level</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg">
                🌍 Native Language: <strong>{data.session_info.user_l1}</strong>
              </p>
              <p className="text-lg">
                ⏱️ Speech Duration: <strong>{data.session_info.duration}s</strong>
              </p>
              <p className="text-lg">
                📊 Overall Score: <strong>{data.overall_scores.overall_score.toFixed(1)}%</strong>
              </p>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(data.overall_scores.overall_score / 100) * 251.2} 251.2`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{data.overall_scores.overall_score.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard
          title="Pronunciation"
          score={data.overall_scores.pronunciation_score}
          icon="🗣️"
          color="purple"
        />
        <ScoreCard
          title="Fluency"
          score={data.overall_scores.fluency_score}
          icon="⚡"
          color="teal"
        />
        <ScoreCard
          title="Grammar"
          score={data.overall_scores.grammar_score}
          icon="📝"
          color="green"
        />
        <ScoreCard
          title="Vocabulary"
          score={data.overall_scores.vocabulary_score}
          icon="📚"
          color="orange"
        />
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-bold text-yellow-800">🎉 Achievements Unlocked!</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="text-2xl">{achievement.title.split(' ')[0]}</div>
                <div>
                  <h4 className="font-semibold text-gray-800">{achievement.title.slice(2)}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Quick Insights & Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">🎯 Strengths</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {data.overall_scores.pronunciation_score >= 80 && <li>• Excellent pronunciation clarity</li>}
              {data.overall_scores.fluency_score >= 80 && <li>• Natural speech rhythm and pace</li>}
              {data.overall_scores.grammar_score >= 80 && <li>• Strong grammatical accuracy</li>}
              {data.overall_scores.vocabulary_score >= 80 && <li>• Rich and varied vocabulary</li>}
              {achievements.length > 0 && <li>• {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} unlocked</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">🚀 Areas to Focus On</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {data.overall_scores.pronunciation_score < 70 && <li>• Pronunciation clarity needs attention</li>}
              {data.overall_scores.fluency_score < 70 && <li>• Work on speech fluency and rhythm</li>}
              {data.overall_scores.grammar_score < 70 && <li>• Grammar accuracy could be improved</li>}
              {data.overall_scores.vocabulary_score < 70 && <li>• Expand vocabulary range</li>}
              {data.overall_scores.overall_score < 80 && <li>• Practice regular speaking exercises</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Chart Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Performance Overview</h3>
        <div className="h-64 flex items-end justify-center space-x-8">
          {[
            { label: 'Pronunciation', score: data.overall_scores.pronunciation_score, color: 'bg-purple-500' },
            { label: 'Fluency', score: data.overall_scores.fluency_score, color: 'bg-teal-500' },
            { label: 'Grammar', score: data.overall_scores.grammar_score, color: 'bg-green-500' },
            { label: 'Vocabulary', score: data.overall_scores.vocabulary_score, color: 'bg-orange-500' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.score / 100) * 200}px` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`w-16 ${item.color} rounded-t-lg mb-2 flex items-end justify-center`}
              >
                <span className="text-white text-sm font-bold mb-2">
                  {item.score.toFixed(0)}%
                </span>
              </motion.div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AnalysisTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? `text-${tab.color}-600 bg-${tab.color}-50`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-${tab.color}-500`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderOverview()}
            </motion.div>
          )}

          {activeTab === 'pronunciation' && (
            <motion.div
              key="pronunciation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PronunciationFeedback
                data={data.pronunciation}
                userL1={data.session_info.user_l1}
              />
            </motion.div>
          )}

          {activeTab === 'fluency' && (
            <motion.div
              key="fluency"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FluencyAnalysis
                data={data.fluency}
                duration={data.session_info.duration}
              />
            </motion.div>
          )}

          {activeTab === 'grammar' && (
            <motion.div
              key="grammar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GrammarExplanations
                data={data.grammar}
                originalText={data.session_info.text}
              />
            </motion.div>
          )}

          {activeTab === 'vocabulary' && (
            <motion.div
              key="vocabulary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VocabularyInsights data={data.vocabulary} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface ScoreCardProps {
  title: string;
  score: number;
  icon: string;
  color: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, icon, color }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`text-xl font-bold px-2 py-1 rounded ${getScoreColor(score)}`}>
          {score.toFixed(1)}%
        </div>
      </div>
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-2 rounded-full bg-${color}-500`}
        />
      </div>
    </motion.div>
  );
};

export default UltimateAnalysisDashboard;