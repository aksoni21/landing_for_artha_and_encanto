import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  StarIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid';

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

interface VocabularyInsightsProps {
  data: VocabularyData;
  className?: string;
}

const VocabularyInsights: React.FC<VocabularyInsightsProps> = ({
  data,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [selectedWord, setSelectedWord] = useState<AcademicWord | null>(null);
  const [showWordDetails, setShowWordDetails] = useState(false);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

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

  const getCEFRDescription = (level: string) => {
    switch (level) {
      case 'A1': return 'Beginner - Basic vocabulary';
      case 'A2': return 'Elementary - Expanding vocabulary';
      case 'B1': return 'Intermediate - Good working vocabulary';
      case 'B2': return 'Upper-Intermediate - Rich vocabulary';
      case 'C1': return 'Advanced - Sophisticated vocabulary';
      case 'C2': return 'Proficient - Near-native vocabulary';
      default: return 'Unknown level';
    }
  };

  const getFrequencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high frequency':
      case 'most common':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium frequency':
      case 'common':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low frequency':
      case 'uncommon':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rare':
      case 'very rare':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${getCEFRColor(data.cefr_level)} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              📚 Vocabulary Analysis
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                CEFR {data.cefr_level}
              </span>
            </h3>
            <p className="text-white/80 mt-1">
              {getCEFRDescription(data.cefr_level)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {data.unique_words}
            </div>
            <div className="text-sm text-white/80">Unique Words</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview */}
        <CollapsibleSection
          title="📊 Vocabulary Overview"
          isExpanded={expandedSections.has('overview')}
          onToggle={() => toggleSection('overview')}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Total Words"
              value={data.total_words.toString()}
              color={getScoreColor(85)} // Always good to have words
              icon="📝"
            />
            <MetricCard
              label="Unique Words"
              value={data.unique_words.toString()}
              color={getScoreColor(data.unique_words > 50 ? 85 : 60)}
              icon="⭐"
            />
            <MetricCard
              label="Lexical Diversity"
              value={data.type_token_ratio.toFixed(2)}
              color={getScoreColor(data.type_token_ratio * 100)}
              icon="🎯"
            />
            <MetricCard
              label="Advanced Vocab"
              value={`${data.advanced_vocabulary_percentage.toFixed(1)}%`}
              color={getScoreColor(data.advanced_vocabulary_percentage)}
              icon="🚀"
            />
          </div>

          {/* CEFR Level Progress */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
            <h4 className="font-bold text-lg mb-4 text-center">🎓 CEFR Level Progression</h4>
            <div className="flex items-center justify-center space-x-4">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, index) => (
                <div key={level} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      level === data.cefr_level
                        ? `bg-gradient-to-r ${getCEFRColor(level)} ring-4 ring-blue-200`
                        : ['A1', 'A2', 'B1'].includes(level) && data.cefr_level !== 'A1'
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  >
                    {level === data.cefr_level && <TrophyIcon className="w-6 h-6" />}
                    {level !== data.cefr_level && level}
                  </div>
                  <span className="text-xs mt-1 font-medium">{level}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-4">
              Current level: <strong>{data.cefr_level}</strong> - {getCEFRDescription(data.cefr_level)}
            </p>
          </div>
        </CollapsibleSection>

        {/* Word Frequency Distribution */}
        {data.word_frequency_levels && data.word_frequency_levels.length > 0 && (
          <CollapsibleSection
            title={`📈 Word Frequency Distribution (${data.word_frequency_levels.length} levels)`}
            isExpanded={expandedSections.has('frequency')}
            onToggle={() => toggleSection('frequency')}
          >
            <div className="space-y-4">
              {data.word_frequency_levels
                .sort((a, b) => b.percentage - a.percentage)
                .map((level, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${getFrequencyColor(level.level)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{level.level}</h4>
                        <span className="text-sm opacity-75">({level.count} words)</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{level.percentage.toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-white/50 rounded-full h-3 mb-3">
                      <div
                        className="bg-current h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${level.percentage}%`, opacity: 0.7 }}
                      />
                    </div>

                    {/* Word examples */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {level.words.slice(0, 8).map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className="px-2 py-1 bg-white/60 rounded text-sm font-medium"
                        >
                          {word}
                        </span>
                      ))}
                      {level.words.length > 8 && (
                        <span className="px-2 py-1 bg-white/40 rounded text-sm italic">
                          +{level.words.length - 8} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Academic Vocabulary */}
        {data.academic_words && data.academic_words.length > 0 && (
          <CollapsibleSection
            title={`🎓 Academic Vocabulary (${data.academic_words.length} words)`}
            isExpanded={expandedSections.has('academic')}
            onToggle={() => toggleSection('academic')}
          >
            <div className="grid gap-4">
              {data.academic_words.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedWord(selectedWord === word ? null : word);
                    setShowWordDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg text-indigo-800">{word.word}</h4>
                        <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-xs">
                          {word.academic_list}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(Math.floor(word.frequency / 20), 5) }).map((_, i) => (
                            <StarIcon key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-indigo-700 mb-2">{word.definition}</p>

                      <div className="bg-white/60 rounded p-2">
                        <span className="text-xs font-semibold text-indigo-600">Example usage:</span>
                        <p className="text-sm text-indigo-800 italic mt-1">"{word.example_usage}"</p>
                      </div>
                    </div>

                    <BookmarkIcon
                      className={`w-5 h-5 ml-2 ${
                        selectedWord === word ? 'text-indigo-600 fill-current' : 'text-indigo-400'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Academic Word Summary */}
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800">Academic Vocabulary Achievement</h4>
              </div>
              <p className="text-sm text-yellow-700">
                You used <strong>{data.academic_words.length}</strong> academic words, showing
                sophisticated vocabulary knowledge. This represents{' '}
                <strong>{data.advanced_vocabulary_percentage.toFixed(1)}%</strong> of your vocabulary.
              </p>
            </div>
          </CollapsibleSection>
        )}

        {/* Rare & Advanced Words */}
        {data.rare_words && data.rare_words.length > 0 && (
          <CollapsibleSection
            title={`💎 Rare & Advanced Words (${data.rare_words.length} words)`}
            isExpanded={expandedSections.has('rare')}
            onToggle={() => toggleSection('rare')}
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrophyIcon className="w-6 h-6 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Impressive Vocabulary Usage!</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {data.rare_words.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/80 border border-purple-200 rounded-lg p-2 text-center hover:bg-white hover:shadow-sm transition-all"
                  >
                    <span className="font-medium text-purple-800">{word}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-purple-700 mt-3">
                These words demonstrate advanced vocabulary knowledge and are less commonly used by language learners.
              </p>
            </div>
          </CollapsibleSection>
        )}

        {/* Improvement Suggestions */}
        {data.suggestions && data.suggestions.length > 0 && (
          <CollapsibleSection
            title="🚀 Vocabulary Improvement Suggestions"
            isExpanded={expandedSections.has('suggestions')}
            onToggle={() => toggleSection('suggestions')}
          >
            <div className="space-y-3">
              {data.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-teal-800">{suggestion}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Study Plan */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">📋 Recommended Study Plan</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Daily Goals:</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Learn 5-10 new academic words</li>
                    <li>• Practice using rare words in context</li>
                    <li>• Read materials at {data.cefr_level === 'C2' ? 'native level' : `${data.cefr_level}+ level`}</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Weekly Goals:</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Write using 20+ new vocabulary words</li>
                    <li>• Practice academic word collocations</li>
                    <li>• Review and consolidate learned words</li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </motion.div>
  );
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  isExpanded,
  onToggle
}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <h4 className="font-semibold text-gray-800">{title}</h4>
      {isExpanded ? (
        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
      )}
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 pt-0">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface MetricCardProps {
  label: string;
  value: string;
  color: string;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, color, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <div className="text-2xl mb-2">{icon}</div>
    <div className={`text-xl font-bold mb-1 px-2 py-1 rounded ${color}`}>
      {value}
    </div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default VocabularyInsights;