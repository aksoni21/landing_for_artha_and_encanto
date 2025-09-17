import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SpeakerWaveIcon, PlayIcon } from '@heroicons/react/24/solid';

interface ProblematicSound {
  phoneme: string;
  word_examples: string[];
  acoustic_issue: string;
  improvement_tip: string;
  severity: 'high' | 'medium' | 'low';
}

interface L1InterferencePattern {
  pattern: string;
  examples: string[];
  frequency: 'high' | 'medium' | 'low';
  acoustic_evidence: string;
}

interface StressError {
  word: string;
  incorrect_stress: string;
  correct_stress: string;
  impact: string;
}

interface PronunciationData {
  overall_accuracy: number;
  stress_pattern_accuracy: number;
  rhythm_score: number;
  intonation_score: number;
  problematic_sounds: ProblematicSound[];
  l1_interference_patterns: L1InterferencePattern[];
  stress_errors: StressError[];
  improvement_priorities: string[];
  acoustic_evidence: boolean;
}

interface PronunciationFeedbackProps {
  data: PronunciationData;
  userL1?: string;
  className?: string;
}

const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({
  data,
  userL1 = 'Unknown',
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [playingPhoneme, setPlayingPhoneme] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const playPhonemeAudio = async (phoneme: string) => {
    setPlayingPhoneme(phoneme);
    // In a real implementation, this would play audio samples
    // For now, we'll simulate audio playback
    setTimeout(() => setPlayingPhoneme(null), 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              🗣️ Pronunciation Analysis
              {data.acoustic_evidence && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  🎵 Acoustic Evidence
                </span>
              )}
            </h3>
            <p className="text-purple-100 mt-1">
              Multimodal audio analysis • L1: {userL1}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${data.overall_accuracy >= 80 ? 'text-green-200' : data.overall_accuracy >= 60 ? 'text-yellow-200' : 'text-red-200'}`}>
              {data.overall_accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-purple-200">Overall Accuracy</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Metrics */}
        <CollapsibleSection
          title="📊 Pronunciation Metrics"
          isExpanded={expandedSections.has('overview')}
          onToggle={() => toggleSection('overview')}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Overall Accuracy"
              value={`${data.overall_accuracy.toFixed(1)}%`}
              color={getScoreColor(data.overall_accuracy)}
            />
            <MetricCard
              label="Stress Patterns"
              value={`${data.stress_pattern_accuracy.toFixed(1)}%`}
              color={getScoreColor(data.stress_pattern_accuracy)}
            />
            <MetricCard
              label="Rhythm Score"
              value={`${data.rhythm_score.toFixed(1)}%`}
              color={getScoreColor(data.rhythm_score)}
            />
            <MetricCard
              label="Intonation"
              value={`${data.intonation_score.toFixed(1)}%`}
              color={getScoreColor(data.intonation_score)}
            />
          </div>
        </CollapsibleSection>

        {/* Problematic Sounds */}
        {data.problematic_sounds && data.problematic_sounds.length > 0 && (
          <CollapsibleSection
            title={`🎯 Problematic Sounds (${data.problematic_sounds.length})`}
            isExpanded={expandedSections.has('sounds')}
            onToggle={() => toggleSection('sounds')}
          >
            <div className="space-y-4">
              {data.problematic_sounds.map((sound, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${getSeverityColor(sound.severity)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-mono font-bold">
                        {sound.phoneme}
                      </span>
                      <button
                        onClick={() => playPhonemeAudio(sound.phoneme)}
                        className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
                        disabled={playingPhoneme === sound.phoneme}
                      >
                        {playingPhoneme === sound.phoneme ? (
                          <SpeakerWaveIcon className="w-4 h-4 animate-pulse" />
                        ) : (
                          <PlayIcon className="w-4 h-4" />
                        )}
                      </button>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(sound.severity)}`}>
                        {sound.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-sm">Examples in your speech:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sound.word_examples.map((word, wordIndex) => (
                          <span
                            key={wordIndex}
                            className="px-2 py-1 bg-white/60 rounded text-sm font-medium"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-sm">Issue:</span>
                      <p className="text-sm mt-1">{sound.acoustic_issue}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-sm">💡 Improvement tip:</span>
                      <p className="text-sm mt-1 font-medium">{sound.improvement_tip}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* L1 Interference Patterns */}
        {data.l1_interference_patterns && data.l1_interference_patterns.length > 0 && (
          <CollapsibleSection
            title={`🌍 L1 Interference Patterns (${data.l1_interference_patterns.length})`}
            isExpanded={expandedSections.has('l1')}
            onToggle={() => toggleSection('l1')}
          >
            <div className="space-y-4">
              {data.l1_interference_patterns.map((pattern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFrequencyIcon(pattern.frequency)}</span>
                      <h4 className="font-semibold text-orange-800">
                        {pattern.pattern}
                      </h4>
                    </div>
                    <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full">
                      {pattern.frequency} frequency
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-sm text-orange-700">Examples:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pattern.examples.map((example, exampleIndex) => (
                          <span
                            key={exampleIndex}
                            className="px-2 py-1 bg-white/80 border border-orange-200 rounded text-sm"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-sm text-orange-700">🔬 Acoustic Evidence:</span>
                      <p className="text-sm text-orange-700 mt-1">{pattern.acoustic_evidence}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Stress Errors */}
        {data.stress_errors && data.stress_errors.length > 0 && (
          <CollapsibleSection
            title={`📍 Word Stress Errors (${data.stress_errors.length})`}
            isExpanded={expandedSections.has('stress')}
            onToggle={() => toggleSection('stress')}
          >
            <div className="space-y-3">
              {data.stress_errors.map((error, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-blue-800">{error.word}</h4>
                    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                      {error.impact} impact
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-sm text-red-600">❌ Your stress:</span>
                      <p className="text-sm font-mono bg-red-100 px-2 py-1 rounded mt-1">
                        {error.incorrect_stress}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-green-600">✅ Correct stress:</span>
                      <p className="text-sm font-mono bg-green-100 px-2 py-1 rounded mt-1">
                        {error.correct_stress}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Improvement Priorities */}
        {data.improvement_priorities && data.improvement_priorities.length > 0 && (
          <CollapsibleSection
            title="🚀 Improvement Priorities"
            isExpanded={expandedSections.has('priorities')}
            onToggle={() => toggleSection('priorities')}
          >
            <div className="space-y-3">
              {data.improvement_priorities.map((priority, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-green-800">{priority}</p>
                </motion.div>
              ))}
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
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, color }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <div className={`text-2xl font-bold mb-1 px-2 py-1 rounded ${color}`}>
      {value}
    </div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default PronunciationFeedback;