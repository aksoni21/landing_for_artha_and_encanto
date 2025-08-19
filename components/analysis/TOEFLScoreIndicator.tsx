import React from 'react';
import { motion } from 'framer-motion';
import { getToeflBand } from '../../utils/toefl';

interface TOEFLScoreIndicatorProps {
  totalScore: number;
  sectionScores?: {
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  };
  confidence?: number;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  animated?: boolean;
  className?: string;
}

export const TOEFLScoreIndicator: React.FC<TOEFLScoreIndicatorProps> = ({
  totalScore,
  sectionScores,
  confidence = 0.85,
  size = 'medium',
  showDetails = true,
  animated = true,
  className = '',
}) => {
  const band = getToeflBand(totalScore);
  
  // Size configurations
  const sizeConfig = {
    small: { 
      container: 'w-full', 
      text: 'text-sm', 
      score: 'text-3xl',
      section: 'text-xs'
    },
    medium: { 
      container: 'w-full', 
      text: 'text-base', 
      score: 'text-4xl',
      section: 'text-sm'
    },
    large: { 
      container: 'w-full', 
      text: 'text-lg', 
      score: 'text-6xl',
      section: 'text-base'
    },
  };

  const config = sizeConfig[size];
  const MotionComponent = animated ? motion.div : 'div' as React.ElementType;

  return (
    <MotionComponent
      className={`bg-white rounded-xl shadow-lg p-8 ${config.container} ${className}`}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={animated ? { duration: 0.5 } : undefined}
    >
      {/* TOEFL Score Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          TOEFL iBT Score Analysis
        </h3>
        
        {/* Main Score and Sections Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Main Score */}
          <div className="text-center">
            <div className="mb-4">
              <div className={`font-bold text-gray-900 ${config.score}`}>
                {totalScore}
                <span className="text-gray-500 text-2xl">/120</span>
              </div>
              
              {/* Proficiency Level */}
              <div className={`mt-4 px-4 py-2 inline-block rounded-full bg-gradient-to-r ${band.color} text-white font-semibold text-lg`}>
                {band.level}
              </div>
              
              {/* CEFR Equivalent */}
              <div className="mt-3 text-gray-600 text-base">
                CEFR Equivalent: {band.cefrEquivalent}
              </div>
            </div>

            {/* Score Bar */}
            <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden mb-4">
              <motion.div
                className={`absolute h-full bg-gradient-to-r ${band.color}`}
                initial={animated ? { width: 0 } : undefined}
                animate={animated ? { width: `${(totalScore / 120) * 100}%` } : undefined}
                transition={animated ? { duration: 1, delay: 0.3 } : undefined}
                style={!animated ? { width: `${(totalScore / 120) * 100}%` } : undefined}
              />
              
              {/* Score Markers */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span className="text-xs text-gray-600 font-semibold">0</span>
                <span className="text-xs text-gray-600 font-semibold">30</span>
                <span className="text-xs text-gray-600 font-semibold">60</span>
                <span className="text-xs text-gray-600 font-semibold">90</span>
                <span className="text-xs text-gray-600 font-semibold">120</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 text-gray-700">
              <p className="font-semibold text-lg mb-2">{band.description}</p>
              <p className="italic text-gray-600">{band.recommendation}</p>
            </div>
          </div>

          {/* Right: Section Scores */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-4 text-lg">
              Section Breakdown
            </h4>
            {sectionScores && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(sectionScores).map(([section, score]) => {
                  if (section === 'total') return null;
                  const sectionPercentage = (score / 30) * 100;
                  return (
                    <div key={section} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-700 font-medium capitalize">
                          {section}
                        </div>
                        <div className="font-bold text-gray-900 text-xl">
                          {score}/30
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <motion.div
                          className={`h-full rounded-full ${
                            sectionPercentage >= 80 ? 'bg-green-500' :
                            sectionPercentage >= 60 ? 'bg-blue-500' :
                            sectionPercentage >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          initial={animated ? { width: 0 } : undefined}
                          animate={animated ? { width: `${sectionPercentage}%` } : undefined}
                          transition={animated ? { duration: 0.8, delay: 0.5 } : undefined}
                          style={!animated ? { width: `${sectionPercentage}%` } : undefined}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* University Requirements Guide */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-3 text-lg">University Requirements</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Undergraduate:</span>
                  <span className="font-semibold text-blue-900">61-80</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Graduate:</span>
                  <span className="font-semibold text-blue-900">80-100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Top Universities:</span>
                  <span className="font-semibold text-blue-900">100+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        {confidence && showDetails && (
          <div className="mt-6 text-center text-gray-600 text-sm">
            Analysis Confidence: {Math.round(confidence * 100)}%
          </div>
        )}
      </div>
    </MotionComponent>
  );
};

export default TOEFLScoreIndicator;