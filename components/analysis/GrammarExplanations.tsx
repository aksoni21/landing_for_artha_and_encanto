import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LightBulbIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

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

interface GrammarExplanationsProps {
  data: GrammarData;
  originalText?: string;
  className?: string;
}

const GrammarExplanations: React.FC<GrammarExplanationsProps> = ({
  data,
  originalText = '',
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  const [showPracticeMode, setShowPracticeMode] = useState(false);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const getCEFRColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-green-100 text-green-800';
      case 'A2': return 'bg-green-200 text-green-900';
      case 'B1': return 'bg-yellow-100 text-yellow-800';
      case 'B2': return 'bg-yellow-200 text-yellow-900';
      case 'C1': return 'bg-orange-100 text-orange-800';
      case 'C2': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupErrorsByType = () => {
    const grouped: { [key: string]: GrammarError[] } = {};
    data.errors.forEach(error => {
      if (!grouped[error.error_type]) {
        grouped[error.error_type] = [];
      }
      grouped[error.error_type].push(error);
    });
    return grouped;
  };

  const getErrorTypeLabel = (errorType: string) => {
    return errorType.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              📝 Grammar Analysis
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                🤖 AI-Powered
              </span>
            </h3>
            <p className="text-green-100 mt-1">
              Pedagogical explanations with practice suggestions
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${data.overall_grammar_score >= 80 ? 'text-green-200' : data.overall_grammar_score >= 60 ? 'text-yellow-200' : 'text-red-200'}`}>
              {data.overall_grammar_score.toFixed(1)}%
            </div>
            <div className="text-sm text-green-200">Grammar Score</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview */}
        <CollapsibleSection
          title={`📊 Grammar Overview (${data.total_errors} errors found)`}
          isExpanded={expandedSections.has('overview')}
          onToggle={() => toggleSection('overview')}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Complexity Score"
              value={data.complexity_score.toFixed(1)}
              color={getScoreColor(data.complexity_score * 20)} // Scale to percentage
              icon="🧠"
            />
            <MetricCard
              label="Avg Sentence Length"
              value={data.avg_sentence_length.toFixed(1)}
              color={getScoreColor(data.avg_sentence_length >= 15 && data.avg_sentence_length <= 25 ? 85 : 60)}
              icon="📏"
            />
            <MetricCard
              label="Subordination Index"
              value={data.subordination_index.toFixed(2)}
              color={getScoreColor(data.subordination_index * 100)}
              icon="🔗"
            />
            <MetricCard
              label="Modal Verb Usage"
              value={data.modal_verb_usage.toString()}
              color={getScoreColor(data.modal_verb_usage > 0 ? 80 : 60)}
              icon="🔄"
            />
          </div>

          {/* Advanced Grammar Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Advanced Features</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Passive Voice</span>
                  <span className="font-semibold">{data.passive_voice_percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Conditionals</span>
                  <span className="font-semibold">{data.conditional_structures}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Error Distribution</h4>
              <div className="space-y-1">
                {['high', 'medium', 'low'].map(severity => {
                  const count = data.errors.filter(e => e.severity === severity).length;
                  return (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{getSeverityIcon(severity)}</span>
                        <span className="text-sm capitalize">{severity}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Error Details by Type */}
        {Object.keys(groupErrorsByType()).length > 0 && (
          <CollapsibleSection
            title={`🔍 Error Analysis by Type (${Object.keys(groupErrorsByType()).length} categories)`}
            isExpanded={expandedSections.has('errors')}
            onToggle={() => toggleSection('errors')}
          >
            <div className="space-y-4">
              {Object.entries(groupErrorsByType()).map(([errorType, errors]) => (
                <motion.div
                  key={errorType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">
                        {getErrorTypeLabel(errorType)}
                      </h4>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {errors.length} error{errors.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {errors.map((error, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedError === error ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedError(selectedError === error ? null : error)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(error.severity)}`}>
                              {getSeverityIcon(error.severity)} {error.severity.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCEFRColor(error.cefr_level)}`}>
                              {error.cefr_level}
                            </span>
                          </div>
                        </div>

                        {/* Error Comparison */}
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-start gap-2">
                            <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                              <span className="text-sm font-semibold text-red-700">Original:</span>
                              <p className="text-sm bg-red-50 p-2 rounded mt-1 font-mono">
                                &ldquo;{error.original}&rdquo;
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <span className="text-sm font-semibold text-green-700">Corrected:</span>
                              <p className="text-sm bg-green-50 p-2 rounded mt-1 font-mono">
                                &ldquo;{error.corrected}&rdquo;
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <LightBulbIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div>
                              <span className="text-sm font-semibold text-blue-800">Explanation:</span>
                              <p className="text-sm text-blue-700 mt-1">{error.explanation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Practice Suggestion */}
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <BookOpenIcon className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div>
                              <span className="text-sm font-semibold text-yellow-800">Practice Suggestion:</span>
                              <p className="text-sm text-yellow-700 mt-1">{error.practice_suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Interactive Practice Mode */}
        <CollapsibleSection
          title="🎯 Interactive Practice"
          isExpanded={expandedSections.has('practice')}
          onToggle={() => toggleSection('practice')}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPracticeMode(!showPracticeMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showPracticeMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showPracticeMode ? 'Exit Practice Mode' : 'Start Practice Mode'}
              </button>
            </div>

            <AnimatePresence>
              {showPracticeMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6"
                >
                  <h4 className="font-bold text-lg mb-4 text-purple-800">
                    🏋️‍♀️ Practice Exercises
                  </h4>

                  <div className="space-y-4">
                    {data.errors.slice(0, 3).map((error, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-purple-700">
                            Exercise {index + 1}: {getErrorTypeLabel(error.error_type)}
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-700 mb-2">
                            Correct the following sentence:
                          </p>
                          <div className="bg-yellow-100 p-3 rounded font-mono text-sm border-l-4 border-yellow-400">
                            {error.original}
                          </div>
                        </div>

                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                            Show Answer & Explanation
                          </summary>
                          <div className="mt-2 p-3 bg-green-50 rounded border-l-4 border-green-400">
                            <p className="text-sm font-mono text-green-800 mb-2">
                              <strong>Correct:</strong> {error.corrected}
                            </p>
                            <p className="text-sm text-green-700">
                              <strong>Why:</strong> {error.explanation}
                            </p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">💡 Study Tips</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Focus on one error type at a time</li>
                      <li>• Practice with similar sentence structures</li>
                      <li>• Review the explanations until they become automatic</li>
                      <li>• Try to use the corrected forms in your own sentences</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CollapsibleSection>

        {/* Text Highlighting */}
        {originalText && (
          <CollapsibleSection
            title="📝 Text with Error Highlighting"
            isExpanded={expandedSections.has('highlight')}
            onToggle={() => toggleSection('highlight')}
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm leading-relaxed">
                {/* This would be enhanced to actually highlight errors in the original text */}
                <p className="mb-3 text-gray-600">
                  Click on highlighted errors to see detailed explanations:
                </p>
                <div className="bg-white p-4 rounded border">
                  {originalText.split(' ').map((word, index) => {
                    const hasError = data.errors.some(error =>
                      error.original.toLowerCase().includes(word.toLowerCase())
                    );

                    return (
                      <span
                        key={index}
                        className={`${
                          hasError
                            ? 'bg-yellow-200 border-b-2 border-red-400 cursor-pointer hover:bg-yellow-300'
                            : ''
                        } transition-colors`}
                        onClick={() => {
                          if (hasError) {
                            const relatedError = data.errors.find(error =>
                              error.original.toLowerCase().includes(word.toLowerCase())
                            );
                            if (relatedError) setSelectedError(relatedError);
                          }
                        }}
                      >
                        {word}
                      </span>
                    );
                  }).map((element, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ' '}
                      {element}
                    </React.Fragment>
                  ))}
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

export default GrammarExplanations;