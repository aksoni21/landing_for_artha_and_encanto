import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, TrendingUp, AlertCircle } from 'lucide-react';

interface RepetitiveWord {
  word: string;
  count: number;
}

interface VocabularyInsightsProps {
  totalWords: number;
  uniqueWords: number;
  typeTokenRatio: number;
  academicWords: string[];
  rareWords: string[];
  repetitiveWords: RepetitiveWord[];
  vocabularyLevel: string;
  primaryColor?: string;
}

const VocabularyInsights: React.FC<VocabularyInsightsProps> = ({
  totalWords,
  uniqueWords,
  typeTokenRatio,
  academicWords,
  rareWords,
  repetitiveWords,
  vocabularyLevel,
  primaryColor = '#1a365d'
}) => {
  const getVocabularyLevelAssessment = () => {
    switch (vocabularyLevel.toLowerCase()) {
      case 'advanced':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: '🌟', message: 'Sophisticated vocabulary use' };
      case 'intermediate':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: '📚', message: 'Good vocabulary range' };
      case 'basic':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '📖', message: 'Building vocabulary foundation' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: '📝', message: 'Developing vocabulary' };
    }
  };

  const getDiversityAssessment = () => {
    if (typeTokenRatio > 0.7) return { level: 'Excellent', color: 'text-green-600', message: 'Great word variety!' };
    if (typeTokenRatio > 0.5) return { level: 'Good', color: 'text-blue-600', message: 'Nice vocabulary diversity' };
    if (typeTokenRatio > 0.3) return { level: 'Moderate', color: 'text-yellow-600', message: 'Can expand word choices' };
    return { level: 'Limited', color: 'text-orange-600', message: 'Focus on word variety' };
  };

  const levelAssessment = getVocabularyLevelAssessment();
  const diversityAssessment = getDiversityAssessment();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen size={24} style={{ color: primaryColor }} />
        <h2 className="text-xl font-bold text-gray-800">Vocabulary Insights</h2>
      </div>

      {/* Vocabulary Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Vocabulary Level */}
        <div className={`p-4 rounded-lg ${levelAssessment.bg}`}>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{levelAssessment.icon}</span>
            <h3 className="font-semibold text-gray-700">Vocabulary Level</h3>
          </div>
          <div className={`text-2xl font-bold ${levelAssessment.color} capitalize`}>
            {vocabularyLevel}
          </div>
          <div className="text-sm text-gray-600">
            {levelAssessment.message}
          </div>
        </div>

        {/* Word Diversity */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp size={20} className={diversityAssessment.color} />
            <h3 className="font-semibold text-gray-700">Word Diversity</h3>
          </div>
          <div className={`text-2xl font-bold ${diversityAssessment.color}`}>
            {diversityAssessment.level}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            {uniqueWords}/{totalWords} unique words
          </div>
          <div className="text-xs text-gray-700">
            {diversityAssessment.message}
          </div>
        </div>

        {/* Word Stats */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Usage Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total words:</span>
              <span className="font-medium">{totalWords}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Unique words:</span>
              <span className="font-medium">{uniqueWords}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Diversity ratio:</span>
              <span className="font-medium">{(typeTokenRatio * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Highlights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Impressive Words */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center space-x-2">
            <Star size={20} />
            <span>Impressive Vocabulary</span>
          </h3>

          {/* Academic Words */}
          {academicWords.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Academic/Formal Words:</h4>
              <div className="flex flex-wrap gap-2">
                {academicWords.slice(0, 6).map((word, index) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Rare/Sophisticated Words */}
          {rareWords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sophisticated Words:</h4>
              <div className="flex flex-wrap gap-2">
                {rareWords.slice(0, 6).map((word, index) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {academicWords.length === 0 && rareWords.length === 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg text-yellow-800 text-center text-sm">
              💡 Opportunity to introduce more advanced vocabulary
            </div>
          )}
        </div>

        {/* Repetitive Words */}
        <div>
          <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center space-x-2">
            <AlertCircle size={20} />
            <span>Overused Words</span>
          </h3>

          <div className="space-y-2">
            {repetitiveWords.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.word}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-3 bg-orange-50 rounded-lg"
              >
                <span className="font-mono text-orange-800">
                  &quot;{item.word}&quot;
                </span>
                <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                  {item.count}x
                </span>
              </motion.div>
            ))}

            {repetitiveWords.length === 0 && (
              <div className="p-3 bg-green-50 rounded-lg text-green-800 text-center">
                🎉 Great word variety! No excessive repetition
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vocabulary Expansion Suggestions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">📚 Vocabulary Building Ideas</h4>
        <div className="text-blue-700 text-sm space-y-1">
          {repetitiveWords.length > 3 && (
            <p>• Practice synonyms for overused words: {repetitiveWords.slice(0, 2).map(w => `"${w.word}"`).join(', ')}</p>
          )}
          {academicWords.length < 3 && (
            <p>• Introduce formal vocabulary for academic contexts</p>
          )}
          {typeTokenRatio < 0.5 && (
            <p>• Daily vocabulary challenges: learn 2-3 new words per week</p>
          )}
          <p>• Read Spanish articles/stories to encounter new vocabulary naturally</p>
          <p>• Practice describing the same idea using different words</p>
        </div>
      </div>
    </motion.div>
  );
};

export default VocabularyInsights;