import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface GrammarError {
  type: string;
  example: string;
  correction: string;
  count: number;
}

interface GrammarInsightsProps {
  grammarErrors: GrammarError[];
  grammarStrengths: string[];
  tenseUsage: Record<string, number>;
  sentenceTypes: Record<string, number>;
  averageSentenceLength: number;
  primaryColor?: string;
}

const GrammarInsights: React.FC<GrammarInsightsProps> = ({
  grammarErrors,
  grammarStrengths,
  tenseUsage,
  sentenceTypes,
  averageSentenceLength,
  primaryColor = '#1a365d'
}) => {
  // Function to convert error types to user-friendly names
  const formatErrorType = (errorType: string) => {
    const errorTypeMap: Record<string, string> = {
      'gerund_instead_of_present_tense': 'Present Tense Usage',
      'incorrect_preposition_and_article': 'Prepositions & Articles',
      'subject_verb_agreement': 'Subject-Verb Agreement',
      'past_tense': 'Past Tense',
      'past_tense_conjugation': 'Past Tense Conjugation',
      'verb_conjugation': 'Verb Conjugation',
      'article_usage': 'Article Usage',
      'gender_agreement': 'Gender Agreement',
      'plural_formation': 'Plural Formation'
    };

    return errorTypeMap[errorType] || errorType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTenseUsage = () => {
    return Object.entries(tenseUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);
  };

  const getSentenceComplexity = () => {
    if (averageSentenceLength > 15) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-50' };
    if (averageSentenceLength > 10) return { level: 'Intermediate', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { level: 'Basic', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };

  const complexity = getSentenceComplexity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen size={24} style={{ color: primaryColor }} />
        <h2 className="text-xl font-bold text-gray-800">Grammar Patterns</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Grammar Strengths */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center space-x-2">
            <CheckCircle size={20} />
            <span>What They&apos;re Doing Well</span>
          </h3>
          <div className="space-y-2">
            {grammarStrengths.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg"
              >
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-800 text-sm">{strength}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Grammar Errors */}
        <div>
          <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center space-x-2">
            <AlertTriangle size={20} />
            <span>Areas to Practice</span>
          </h3>
          <div className="space-y-3">
            {grammarErrors.slice(0, 4).map((error, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-orange-800">{formatErrorType(error.type)}</span>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                    {error.count}x
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">✗</span>
                    <span className="font-mono bg-red-100 px-2 py-1 rounded text-red-800">
                      {error.example}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">
                      {error.correction}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Grammar Usage Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
          <TrendingUp size={20} />
          <span>Grammar Usage Patterns</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Sentence Complexity */}
          <div className={`p-4 rounded-lg ${complexity.bg}`}>
            <h4 className="font-medium text-gray-700 mb-2">Sentence Complexity</h4>
            <div className={`text-2xl font-bold ${complexity.color}`}>
              {complexity.level}
            </div>
            <div className="text-sm text-gray-600">
              {averageSentenceLength.toFixed(1)} words/sentence
            </div>
          </div>

          {/* Most Used Tenses */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Favorite Tenses</h4>
            <div className="space-y-1">
              {formatTenseUsage().map(([tense, count]) => (
                <div key={tense} className="flex justify-between text-sm">
                  <span className="text-blue-800 capitalize">{tense}</span>
                  <span className="text-blue-600 font-medium">{count}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentence Types */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Sentence Types</h4>
            <div className="space-y-1">
              {Object.entries(sentenceTypes).slice(0, 3).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-purple-800 capitalize">{type}</span>
                  <span className="text-purple-600 font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Tip */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          📝 <strong>Teaching Focus:</strong> Start with the most frequent errors first.
          Practice makes perfect - have them repeat correct versions multiple times.
        </p>
      </div>
    </motion.div>
  );
};

export default GrammarInsights;