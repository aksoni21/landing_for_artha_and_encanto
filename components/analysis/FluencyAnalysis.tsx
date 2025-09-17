import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// Removed unused imports

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

interface FluencyAnalysisProps {
  data: FluencyData;
  duration?: number;
  className?: string;
}

const FluencyAnalysis: React.FC<FluencyAnalysisProps> = ({
  data,
  duration = 60,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number] | null>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Generate mock timeline data for visualization
  const timelineData = useMemo(() => {
    const segments = [];
    const segmentDuration = duration / 10; // 10 segments

    for (let i = 0; i < 10; i++) {
      const startTime = i * segmentDuration;
      const hasContent = Math.random() > 0.2; // 80% chance of content
      const pauseType = hasContent ? null : data.pause_categories[Math.floor(Math.random() * data.pause_categories.length)]?.type || 'hesitation';
      const confidence = hasContent ? 50 + Math.random() * 50 : 20 + Math.random() * 30; // Lower confidence during pauses

      segments.push({
        startTime,
        endTime: startTime + segmentDuration,
        hasContent,
        pauseType,
        confidence,
        duration: segmentDuration
      });
    }

    return segments;
  }, [duration, data.pause_categories]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPauseTypeColor = (type: string) => {
    switch (type) {
      case 'lexical_retrieval': return 'bg-red-400';
      case 'planning_pause': return 'bg-yellow-400';
      case 'filled_pause': return 'bg-blue-400';
      case 'hesitation': return 'bg-purple-400';
      default: return 'bg-gray-400';
    }
  };

  const getPauseTypeLabel = (type: string) => {
    switch (type) {
      case 'lexical_retrieval': return 'Word Search';
      case 'planning_pause': return 'Planning';
      case 'filled_pause': return 'Filled Pause';
      case 'hesitation': return 'Hesitation';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              ⚡ Fluency Analysis
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                🎵 Prosodic Evidence
              </span>
            </h3>
            <p className="text-blue-100 mt-1">
              Root cause analysis with acoustic evidence
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${data.fluency_score >= 80 ? 'text-green-200' : data.fluency_score >= 60 ? 'text-yellow-200' : 'text-red-200'}`}>
              {data.fluency_score.toFixed(1)}%
            </div>
            <div className="text-sm text-blue-200">Fluency Score</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Metrics */}
        <CollapsibleSection
          title="📊 Fluency Metrics"
          isExpanded={expandedSections.has('overview')}
          onToggle={() => toggleSection('overview')}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Words/Minute"
              value={data.words_per_minute.toFixed(0)}
              color={getScoreColor(data.words_per_minute >= 140 && data.words_per_minute <= 180 ? 85 : 60)}
              icon="🏃‍♂️"
            />
            <MetricCard
              label="Confidence Level"
              value={`${data.confidence_level}%`}
              color={getScoreColor(data.confidence_level)}
              icon="💪"
            />
            <MetricCard
              label="Speech Rate Consistency"
              value={`${(data.speech_rate_consistency * 100).toFixed(0)}%`}
              color={getScoreColor(data.speech_rate_consistency * 100)}
              icon="📈"
            />
            <MetricCard
              label="Connected Speech"
              value={`${data.connected_speech_quality}%`}
              color={getScoreColor(data.connected_speech_quality)}
              icon="🔗"
            />
          </div>

          {/* Confidence Meter */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">🎙️ Confidence Throughout Speech</h4>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Low Confidence</span>
                <span>High Confidence</span>
              </div>
              <div className="relative h-12 bg-white rounded-lg overflow-hidden">
                {timelineData.map((segment, index) => (
                  <motion.div
                    key={index}
                    className={`absolute top-0 h-full transition-all duration-300 ${
                      segment.hasContent
                        ? `bg-gradient-to-t from-green-400 to-green-600`
                        : 'bg-gradient-to-t from-red-400 to-red-600'
                    }`}
                    style={{
                      left: `${(segment.startTime / duration) * 100}%`,
                      width: `${(segment.duration / duration) * 100}%`,
                      opacity: segment.confidence / 100
                    }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedTimeRange([segment.startTime, segment.endTime])}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0s</span>
                <span>{duration}s</span>
              </div>
              {selectedTimeRange && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  Selected: {selectedTimeRange[0].toFixed(1)}s - {selectedTimeRange[1].toFixed(1)}s
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Pause Analysis Timeline */}
        <CollapsibleSection
          title={`⏸️ Pause Analysis (${data.total_pauses} pauses)`}
          isExpanded={expandedSections.has('pauses')}
          onToggle={() => toggleSection('pauses')}
        >
          <div className="space-y-4">
            {/* Pause Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{data.total_pauses}</div>
                <div className="text-sm text-blue-700">Total Pauses</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {data.pause_frequency_per_minute.toFixed(1)}
                </div>
                <div className="text-sm text-orange-700">Pauses/Minute</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {(data.avg_pause_duration_ms / 1000).toFixed(1)}s
                </div>
                <div className="text-sm text-purple-700">Avg Duration</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-red-600">{data.long_pauses_count}</div>
                <div className="text-sm text-red-700">Long Pauses</div>
              </div>
            </div>

            {/* Pause Timeline */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎬 Speech Timeline</h4>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="relative h-8 bg-white rounded overflow-hidden">
                  {timelineData.map((segment, index) => (
                    <div
                      key={index}
                      className={`absolute top-0 h-full border-r border-gray-200 ${
                        segment.hasContent
                          ? 'bg-gradient-to-r from-green-400 to-green-500'
                          : getPauseTypeColor(segment.pauseType!)
                      }`}
                      style={{
                        left: `${(segment.startTime / duration) * 100}%`,
                        width: `${(segment.duration / duration) * 100}%`
                      }}
                      title={segment.hasContent ? 'Speech' : `${getPauseTypeLabel(segment.pauseType!)} Pause`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0s</span>
                  <span>{duration}s</span>
                </div>
              </div>

              {/* Timeline Legend */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
                  <span className="text-sm">Speech</span>
                </div>
                {data.pause_categories.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${getPauseTypeColor(category.type)}`}></div>
                    <span className="text-sm">{getPauseTypeLabel(category.type)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Pause Categories */}
        {data.pause_categories && data.pause_categories.length > 0 && (
          <CollapsibleSection
            title={`📝 Pause Categorization (${data.pause_categories.length} types)`}
            isExpanded={expandedSections.has('categories')}
            onToggle={() => toggleSection('categories')}
          >
            <div className="grid gap-4">
              {data.pause_categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${getPauseTypeColor(category.type)}`}></div>
                      <h4 className="font-semibold text-gray-800">
                        {getPauseTypeLabel(category.type)}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700">{category.count} occurrences</div>
                      <div className="text-xs text-gray-500">{(category.avg_duration_ms / 1000).toFixed(1)}s avg</div>
                    </div>
                  </div>

                  {category.examples && category.examples.length > 0 && (
                    <div>
                      <span className="font-semibold text-sm text-gray-700">Examples:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {category.examples.map((example, exampleIndex) => (
                          <span
                            key={exampleIndex}
                            className="px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Prosodic Features */}
        <CollapsibleSection
          title="🎵 Prosodic Analysis"
          isExpanded={expandedSections.has('prosody')}
          onToggle={() => toggleSection('prosody')}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rhythm Consistency</span>
                <span className="text-sm font-bold">{data.prosodic_features.rhythm_consistency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.prosodic_features.rhythm_consistency}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stress Timing</span>
                <span className="text-sm font-bold">{data.prosodic_features.stress_timing_accuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.prosodic_features.stress_timing_accuracy}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Intonation</span>
                <span className="text-sm font-bold">{data.prosodic_features.intonation_appropriateness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.prosodic_features.intonation_appropriateness}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connected Speech</span>
                <span className="text-sm font-bold">{data.prosodic_features.connected_speech_quality}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.prosodic_features.connected_speech_quality}%` }}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Fluency Breakdown Causes */}
        {data.fluency_breakdown_causes && data.fluency_breakdown_causes.length > 0 && (
          <CollapsibleSection
            title={`🔍 Root Cause Analysis (${data.fluency_breakdown_causes.length} causes)`}
            isExpanded={expandedSections.has('causes')}
            onToggle={() => toggleSection('causes')}
          >
            <div className="space-y-4">
              {data.fluency_breakdown_causes.map((cause, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${getFrequencyColor(cause.frequency)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{cause.cause.replace(/_/g, ' ').toUpperCase()}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(cause.frequency)}`}>
                      {cause.frequency} frequency
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-sm">🔬 Evidence:</span>
                      <p className="text-sm mt-1">{cause.evidence}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-sm">💡 Recommendation:</span>
                      <p className="text-sm mt-1 font-medium">{cause.recommendation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Filler Words Analysis */}
        {Object.keys(data.filler_words).length > 0 && (
          <CollapsibleSection
            title={`🗣️ Filler Words (${Object.values(data.filler_words).reduce((a, b) => a + b, 0)} total)`}
            isExpanded={expandedSections.has('fillers')}
            onToggle={() => toggleSection('fillers')}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(data.filler_words)
                .sort(([, a], [, b]) => b - a)
                .map(([word, count]) => (
                  <div key={word} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-yellow-600">&ldquo;{word}&rdquo;</div>
                    <div className="text-sm text-yellow-700">{count} times</div>
                  </div>
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
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-teal-800">{priority}</p>
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

export default FluencyAnalysis;