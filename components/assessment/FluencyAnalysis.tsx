import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Pause, RotateCcw, Zap } from 'lucide-react';

interface FillerWord {
  word: string;
  count: number;
}

interface FluencyAnalysisProps {
  wordsPerMinute: number;
  totalPauses: number;
  averagePauseDuration: number;
  filledPausesCount: number;
  fillerWords: FillerWord[];
  repetitionsCount: number;
  selfCorrectionsCount: number;
  primaryColor?: string;
}

const FluencyAnalysis: React.FC<FluencyAnalysisProps> = ({
  wordsPerMinute,
  totalPauses,
  averagePauseDuration,
  filledPausesCount,
  fillerWords,
  repetitionsCount,
  selfCorrectionsCount,
  primaryColor = '#1a365d'
}) => {
  const getSpeakingPaceAssessment = () => {
    if (wordsPerMinute >= 150) return { level: 'Fast', color: 'text-orange-600', bg: 'bg-orange-50', advice: 'Great pace! Maybe slow down slightly for clarity.' };
    if (wordsPerMinute >= 120) return { level: 'Natural', color: 'text-green-600', bg: 'bg-green-50', advice: 'Perfect speaking pace for conversation.' };
    if (wordsPerMinute >= 90) return { level: 'Careful', color: 'text-blue-600', bg: 'bg-blue-50', advice: 'Good pace for learning. Can speed up with practice.' };
    return { level: 'Hesitant', color: 'text-yellow-600', bg: 'bg-yellow-50', advice: 'Take time to build confidence. Speed will come naturally.' };
  };

  const getPauseAssessment = () => {
    const longPauses = Math.floor(totalPauses * (averagePauseDuration > 2000 ? 0.6 : 0.3));
    if (longPauses > 8) return { level: 'Many pauses', color: 'text-yellow-600', icon: '⏸️' };
    if (longPauses > 4) return { level: 'Some pauses', color: 'text-blue-600', icon: '⏸️' };
    return { level: 'Good flow', color: 'text-green-600', icon: '🌊' };
  };

  const getSelfMonitoringAssessment = () => {
    if (selfCorrectionsCount > 3) return { level: 'Excellent', color: 'text-green-600', message: 'Great self-awareness!' };
    if (selfCorrectionsCount > 1) return { level: 'Good', color: 'text-blue-600', message: 'Shows good monitoring' };
    return { level: 'Developing', color: 'text-yellow-600', message: 'Can develop self-checking' };
  };

  const paceAssessment = getSpeakingPaceAssessment();
  const pauseAssessment = getPauseAssessment();
  const selfMonitoring = getSelfMonitoringAssessment();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Clock size={24} style={{ color: primaryColor }} />
        <h2 className="text-xl font-bold text-gray-800">Speaking Flow Analysis</h2>
      </div>

      {/* Main Fluency Metrics */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Speaking Pace */}
        <div className={`p-4 rounded-lg ${paceAssessment.bg}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Zap size={20} className={paceAssessment.color} />
            <h3 className="font-semibold text-gray-700">Speaking Pace</h3>
          </div>
          <div className={`text-2xl font-bold ${paceAssessment.color}`}>
            {paceAssessment.level}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {Math.round(wordsPerMinute)} words/minute
          </div>
          <div className="text-xs text-gray-700">
            {paceAssessment.advice}
          </div>
        </div>

        {/* Pause Patterns */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Pause size={20} className={pauseAssessment.color} />
            <h3 className="font-semibold text-gray-700">Pause Patterns</h3>
          </div>
          <div className={`text-2xl ${pauseAssessment.color}`}>
            {pauseAssessment.icon}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            {totalPauses} pauses total
          </div>
          <div className={`text-sm font-medium ${pauseAssessment.color}`}>
            {pauseAssessment.level}
          </div>
        </div>

        {/* Self-Monitoring */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <RotateCcw size={20} className={selfMonitoring.color} />
            <h3 className="font-semibold text-gray-700">Self-Monitoring</h3>
          </div>
          <div className={`text-2xl font-bold ${selfMonitoring.color}`}>
            {selfMonitoring.level}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            {selfCorrectionsCount} self-corrections
          </div>
          <div className={`text-xs ${selfMonitoring.color}`}>
            {selfMonitoring.message}
          </div>
        </div>
      </div>

      {/* Detailed Patterns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Filler Words */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Filler Words & Hesitations
          </h3>
          <div className="space-y-2">
            {fillerWords.slice(0, 5).map((filler, index) => (
              <motion.div
                key={filler.word}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg"
              >
                <span className="font-mono text-yellow-800">
                  &quot;{filler.word}&quot;
                </span>
                <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filler.count}x
                </span>
              </motion.div>
            ))}
            {fillerWords.length === 0 && (
              <div className="p-3 bg-green-50 rounded-lg text-green-800 text-center">
                🎉 Great! No excessive filler words detected
              </div>
            )}
          </div>
        </div>

        {/* Speaking Patterns */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Speaking Patterns
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Repetitions</span>
                <span className="font-bold text-gray-800">{repetitionsCount}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {repetitionsCount > 5 ? 'Practice can reduce repetitions' : 'Normal level of repetition'}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Filled Pauses</span>
                <span className="font-bold text-gray-800">{filledPausesCount}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                &quot;Um,&quot; &quot;uh,&quot; etc. during thinking
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Average Pause</span>
                <span className="font-bold text-gray-800">
                  {(averagePauseDuration / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {averagePauseDuration > 2000 ? 'Long thinking pauses' : 'Quick thinking time'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">🎯 Fluency Practice Ideas</h4>
        <div className="text-blue-700 text-sm space-y-1">
          {wordsPerMinute < 120 && (
            <p>• Practice reading aloud daily to build speaking confidence</p>
          )}
          {totalPauses > 8 && (
            <p>• Prepare and practice common phrases to reduce thinking pauses</p>
          )}
          {fillerWords.length > 3 && (
            <p>• Awareness exercises: record yourself and count filler words</p>
          )}
          {selfCorrectionsCount < 2 && (
            <p>• Encourage self-monitoring: &quot;Did that sound right?&quot;</p>
          )}
          <p>• Timed speaking exercises (1-2 minutes on familiar topics)</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FluencyAnalysis;