import React from 'react';
import { motion } from 'framer-motion';

interface CEFRLevelIndicatorProps {
  currentLevel: string;
  confidence: number;
  score: number;
  nextLevel?: string;
  progressToNext?: number;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  animated?: boolean;
  className?: string;
}

export const CEFRLevelIndicator: React.FC<CEFRLevelIndicatorProps> = ({
  currentLevel,
  confidence,
  score,
  nextLevel,
  progressToNext,
  size = 'medium',
  showDetails = true,
  animated = true,
  className = '',
}) => {
  const cefrLevels = [
    { 
      level: 'A1', 
      name: 'Beginner', 
      color: 'from-red-400 to-red-600',
      description: 'Basic words and phrases',
      scoreRange: [0, 25]
    },
    { 
      level: 'A2', 
      name: 'Elementary', 
      color: 'from-orange-400 to-orange-600',
      description: 'Simple conversations',
      scoreRange: [26, 40]
    },
    { 
      level: 'B1', 
      name: 'Intermediate', 
      color: 'from-yellow-400 to-yellow-600',
      description: 'Clear communication',
      scoreRange: [41, 60]
    },
    { 
      level: 'B2', 
      name: 'Upper Intermediate', 
      color: 'from-green-400 to-green-600',
      description: 'Complex topics',
      scoreRange: [61, 80]
    },
    { 
      level: 'C1', 
      name: 'Advanced', 
      color: 'from-blue-400 to-blue-600',
      description: 'Fluent and precise',
      scoreRange: [81, 95]
    },
    { 
      level: 'C2', 
      name: 'Proficient', 
      color: 'from-purple-400 to-purple-600',
      description: 'Near-native fluency',
      scoreRange: [96, 100]
    },
  ];

  const currentLevelData = cefrLevels.find(level => level.level === currentLevel);
  const nextLevelData = cefrLevels.find(level => level.level === nextLevel);
  
  const getCurrentLevelIndex = () => {
    return cefrLevels.findIndex(level => level.level === currentLevel);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          badge: 'w-16 h-16 text-lg',
          title: 'text-base',
          subtitle: 'text-xs',
          details: 'text-xs'
        };
      case 'large':
        return {
          container: 'p-8',
          badge: 'w-32 h-32 text-4xl',
          title: 'text-2xl',
          subtitle: 'text-base',
          details: 'text-sm'
        };
      default:
        return {
          container: 'p-6',
          badge: 'w-24 h-24 text-2xl',
          title: 'text-xl',
          subtitle: 'text-sm',
          details: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${sizeClasses.container} ${className}`}>
      {/* Main CEFR Badge */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          className={`${sizeClasses.badge} rounded-full bg-gradient-to-br ${currentLevelData?.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white font-bold shadow-lg mb-3`}
          initial={animated ? { scale: 0, rotate: -180 } : false}
          animate={animated ? { scale: 1, rotate: 0 } : false}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
          {currentLevel}
        </motion.div>

        <motion.div
          className="text-center"
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className={`font-bold text-gray-800 ${sizeClasses.title} mb-1`}>
            {currentLevelData?.name}
          </h3>
          <p className={`text-gray-600 ${sizeClasses.subtitle}`}>
            {currentLevelData?.description}
          </p>
        </motion.div>
      </div>

      {showDetails && (
        <>
          {/* Score and Confidence */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-6"
            initial={animated ? { opacity: 0, y: 20 } : false}
            animate={animated ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round(score)}
              </div>
              <div className={`${sizeClasses.details} text-gray-600`}>
                Overall Score
              </div>
            </div>
            
            {confidence && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold mb-1 ${getConfidenceColor(confidence)}`}>
                  {Math.round(confidence * 100)}%
                </div>
                <div className={`${sizeClasses.details} text-gray-600`}>
                  Confidence
                </div>
              </div>
            )}
          </motion.div>

          {/* CEFR Level Progress Bar */}
          <motion.div
            className="mb-6"
            initial={animated ? { opacity: 0, y: 20 } : false}
            animate={animated ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`font-semibold text-gray-700 ${sizeClasses.details}`}>
                CEFR Progress
              </span>
              <span className={`${sizeClasses.details} ${getConfidenceColor(confidence)}`}>
                {getConfidenceText(confidence)}
              </span>
            </div>
            
            <div className="flex gap-1">
              {cefrLevels.map((level, index) => {
                const currentIndex = getCurrentLevelIndex();
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;
                
                return (
                  <motion.div
                    key={level.level}
                    className={`flex-1 h-3 rounded-full ${
                      isActive
                        ? `bg-gradient-to-r ${level.color}`
                        : 'bg-gray-200'
                    } ${isCurrent ? 'ring-2 ring-white shadow-lg' : ''}`}
                    initial={animated ? { scaleX: 0 } : false}
                    animate={animated ? { scaleX: 1 } : false}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.8 + (index * 0.1),
                      ease: 'easeOut'
                    }}
                    title={`${level.level}: ${level.name}`}
                  />
                );
              })}
            </div>
            
            <div className="flex justify-between mt-1">
              {cefrLevels.map((level) => (
                <span
                  key={level.level}
                  className={`text-xs ${
                    level.level === currentLevel
                      ? 'text-gray-800 font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {level.level}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Progress to Next Level */}
          {nextLevel && progressToNext !== undefined && (
            <motion.div
              className="mb-6 p-4 bg-blue-50 rounded-lg"
              initial={animated ? { opacity: 0, y: 20 } : false}
              animate={animated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-semibold text-blue-700 ${sizeClasses.details}`}>
                  Progress to {nextLevel}
                </span>
                <span className={`${sizeClasses.details} text-blue-600 font-semibold`}>
                  {Math.round(progressToNext)}%
                </span>
              </div>
              
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${nextLevelData?.color || 'from-blue-400 to-blue-600'} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
                />
              </div>
              
              <div className={`mt-2 ${sizeClasses.details} text-blue-600`}>
                {Math.round(100 - progressToNext)}% more to reach {nextLevelData?.name}
              </div>
            </motion.div>
          )}

          {/* Level Description */}
          <motion.div
            className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
            initial={animated ? { opacity: 0, y: 20 } : false}
            animate={animated ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <h4 className={`font-semibold text-gray-800 mb-2 ${sizeClasses.details}`}>
              What {currentLevel} means:
            </h4>
            <p className={`text-gray-600 ${sizeClasses.details} leading-relaxed`}>
              {getLevelDescription(currentLevel)}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
};

const getLevelDescription = (level: string) => {
  const descriptions = {
    'A1': 'You can understand and use familiar everyday expressions and very basic phrases. You can introduce yourself and others and ask simple personal questions.',
    'A2': 'You can communicate in simple tasks requiring direct exchange of information. You can describe your background, immediate environment, and basic needs.',
    'B1': 'You can handle most situations while traveling and can describe experiences, events, dreams, and ambitions. You can briefly give reasons for opinions and plans.',
    'B2': 'You can interact with native speakers with fluency and spontaneity. You can produce detailed text on complex subjects and explain viewpoints with advantages and disadvantages.',
    'C1': 'You can express yourself fluently without searching for expressions. You can use language flexibly for social, academic, and professional purposes.',
    'C2': 'You can understand virtually everything heard or read. You can express yourself spontaneously with great fluency and precision in complex situations.',
  };
  
  return descriptions[level as keyof typeof descriptions] || 'Level description not available.';
};

export default CEFRLevelIndicator;