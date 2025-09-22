import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Award } from 'lucide-react';

interface Strength {
  category: string;
  description: string;
  examples?: string[];
  icon?: string;
}

interface StrengthsSectionProps {
  strengths: Strength[];
  overallConfidenceLevel?: string;
  primaryColor?: string;
}

const StrengthsSection: React.FC<StrengthsSectionProps> = ({
  strengths,
  overallConfidenceLevel = 'growing',
  primaryColor = '#1a365d'
}) => {
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('grammar')) return '📝';
    if (lowerCategory.includes('vocabulary')) return '📚';
    if (lowerCategory.includes('pronunciation')) return '🗣️';
    if (lowerCategory.includes('fluency')) return '💫';
    if (lowerCategory.includes('confidence')) return '💪';
    if (lowerCategory.includes('complex')) return '🧠';
    return '⭐';
  };

  const getConfidenceAssessment = () => {
    switch (overallConfidenceLevel.toLowerCase()) {
      case 'high':
        return { level: 'Confident Speaker', color: 'text-green-600', bg: 'bg-green-50', icon: '🌟', message: 'Speaks with great confidence and clarity' };
      case 'moderate':
        return { level: 'Growing Confidence', color: 'text-blue-600', bg: 'bg-blue-50', icon: '📈', message: 'Building confidence with each conversation' };
      case 'developing':
        return { level: 'Building Confidence', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '🌱', message: 'Taking important steps to build speaking confidence' };
      default:
        return { level: 'Emerging Speaker', color: 'text-purple-600', bg: 'bg-purple-50', icon: '🚀', message: 'Starting the journey to confident speaking' };
    }
  };

  const confidenceAssessment = getConfidenceAssessment();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Star size={24} style={{ color: primaryColor }} />
        <h2 className="text-xl font-bold text-gray-800">What They&apos;re Doing Well</h2>
      </div>

      {/* Overall Confidence Level */}
      <div className={`p-4 rounded-lg ${confidenceAssessment.bg} mb-6`}>
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{confidenceAssessment.icon}</span>
          <div>
            <h3 className={`text-lg font-bold ${confidenceAssessment.color}`}>
              {confidenceAssessment.level}
            </h3>
            <p className="text-gray-700 text-sm">
              {confidenceAssessment.message}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths Grid */}
      {strengths.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {strengths.map((strength, index) => (
            <motion.div
              key={`${strength.category}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-start space-x-3 mb-3">
                <span className="text-2xl">{strength.icon || getCategoryIcon(strength.category)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 mb-1">
                    {strength.category}
                  </h3>
                  <p className="text-green-700 text-sm mb-2">
                    {strength.description}
                  </p>
                </div>
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
              </div>

              {strength.examples && strength.examples.length > 0 && (
                <div className="mt-3 space-y-1">
                  {strength.examples.slice(0, 3).map((example, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-green-500 text-xs">•</span>
                      <span className="text-green-800 text-xs font-mono bg-green-100 px-2 py-1 rounded">
                        {example}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Every Student Has Strengths!
          </h3>
          <p className="text-gray-600 text-sm">
            Even in developing speakers, there are always positive elements to build upon.
            Look for effort, attempt at communication, and willingness to try.
          </p>
        </div>
      )}

      {/* Motivation Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <Award size={20} className="text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">💪 Building on Strengths</h4>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• Start lessons by acknowledging what they do well</p>
              <p>• Use their strengths as building blocks for new skills</p>
              <p>• Encourage them to apply successful patterns to new contexts</p>
              {strengths.length > 2 && (
                <p>• They have multiple strengths - help them see their progress!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Building Tips */}
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">🎯 Confidence Building Ideas</h4>
        <div className="text-yellow-700 text-sm space-y-1">
          <p>• Give specific praise: &quot;Your use of [specific example] was excellent&quot;</p>
          <p>• Create success opportunities using their existing strengths</p>
          <p>• Record progress videos to show improvement over time</p>
          <p>• Celebrate small wins - every improvement matters!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StrengthsSection;