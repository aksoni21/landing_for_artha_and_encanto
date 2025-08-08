import React from 'react';
import { motion } from 'framer-motion';

interface ComponentScore {
  component: string;
  score: number;
  cefr: string;
  confidence: number;
  details?: {
    strengths?: string[];
    improvements?: string[];
    examples?: string[];
  };
}

interface ComponentScoresProps {
  scores: ComponentScore[];
  animated?: boolean;
  showDetails?: boolean;
  className?: string;
}

export const ComponentScores: React.FC<ComponentScoresProps> = ({
  scores,
  animated = true,
  showDetails = true,
  className = '',
}) => {
  const getComponentIcon = (component: string) => {
    const icons = {
      grammar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
          <path d="M8 12h8v2H8zm0 4h5v2H8z"/>
        </svg>
      ),
      vocabulary: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
        </svg>
      ),
      fluency: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          <path d="M7 12l3 3 7-7"/>
        </svg>
      ),
      pronunciation: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      ),
      discourse: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
          <path d="M7 9h2v2H7zm0 4h2v2H7zm6-4h2v2h-2zm0 4h2v2h-2z"/>
        </svg>
      ),
    };
    return icons[component as keyof typeof icons] || icons.grammar;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'from-green-400 to-green-600', text: 'text-green-600', ring: 'ring-green-200' };
    if (score >= 65) return { bg: 'from-blue-400 to-blue-600', text: 'text-blue-600', ring: 'ring-blue-200' };
    if (score >= 50) return { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-600', ring: 'ring-yellow-200' };
    if (score >= 35) return { bg: 'from-orange-400 to-orange-600', text: 'text-orange-600', ring: 'ring-orange-200' };
    return { bg: 'from-red-400 to-red-600', text: 'text-red-600', ring: 'ring-red-200' };
  };

  const getComponentDisplayName = (component: string) => {
    const names = {
      grammar: 'Grammar',
      vocabulary: 'Vocabulary',
      fluency: 'Fluency',
      pronunciation: 'Pronunciation',
      discourse: 'Discourse',
    };
    return names[component as keyof typeof names] || component;
  };

  const getComponentDescription = (component: string) => {
    const descriptions = {
      grammar: 'Sentence structure, tenses, and accuracy',
      vocabulary: 'Word choice, range, and sophistication',
      fluency: 'Speech rate, pauses, and naturalness',
      pronunciation: 'Sound accuracy, stress, and intonation',
      discourse: 'Organization, coherence, and flow',
    };
    return descriptions[component as keyof typeof descriptions] || '';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Component Analysis</h3>
        <p className="text-sm text-gray-600">Detailed breakdown of your language skills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((score, index) => {
          const colors = getScoreColor(score.score);
          
          return (
            <motion.div
              key={score.component}
              className={`relative p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 ${colors.ring} hover:ring-4`}
              initial={animated ? { opacity: 0, y: 20, scale: 0.9 } : false}
              animate={animated ? { opacity: 1, y: 0, scale: 1 } : false}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: 'spring',
                bounce: 0.3
              }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${colors.bg} text-white rounded-lg`}>
                    {getComponentIcon(score.component)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {getComponentDisplayName(score.component)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {getComponentDescription(score.component)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Score Circle */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className={colors.text}
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={animated ? { strokeDashoffset: 2 * Math.PI * 40 } : false}
                      animate={animated ? { 
                        strokeDashoffset: 2 * Math.PI * 40 * (1 - score.score / 100)
                      } : false}
                      transition={{ duration: 1.2, delay: index * 0.1 + 0.5, ease: 'easeOut' }}
                    />
                  </svg>
                  
                  {/* Score text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className={`text-xl font-bold ${colors.text}`}
                        initial={animated ? { scale: 0 } : false}
                        animate={animated ? { scale: 1 } : false}
                        transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
                      >
                        {Math.round(score.score)}
                      </motion.div>
                      <div className="text-xs text-gray-500">/ 100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CEFR Level and Confidence */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm font-bold text-gray-800">{score.cefr}</div>
                  <div className="text-xs text-gray-500">CEFR</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm font-bold text-gray-800">
                    {Math.round(score.confidence * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>

              {/* Details */}
              {showDetails && score.details && (
                <motion.div
                  className="space-y-3"
                  initial={animated ? { opacity: 0, height: 0 } : false}
                  animate={animated ? { opacity: 1, height: 'auto' } : false}
                  transition={{ duration: 0.6, delay: index * 0.1 + 1.2 }}
                >
                  {/* Strengths */}
                  {score.details.strengths && score.details.strengths.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-xs font-semibold text-green-600">Strengths</span>
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {score.details.strengths.slice(0, 2).map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {score.details.improvements && score.details.improvements.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 17h-2v-6h2v6zm0-8h-2V7h2v2zm-1-5.25c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9z"/>
                        </svg>
                        <span className="text-xs font-semibold text-orange-600">Areas to Focus</span>
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {score.details.improvements.slice(0, 2).map((improvement, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Examples */}
                  {score.details.examples && score.details.examples.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-600 mb-1">Examples</div>
                      <div className="text-xs text-gray-500 italic">
                        &ldquo;{score.details.examples[0]}&rdquo;
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Performance Indicator */}
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${colors.bg} shadow-sm`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
        initial={animated ? { opacity: 0, y: 20 } : false}
        animate={animated ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.6, delay: scores.length * 0.1 + 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-800">
              {Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)}
            </div>
            <div className="text-xs text-gray-600">Average Score</div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-green-600">
              {scores.filter(s => s.score >= 70).length}
            </div>
            <div className="text-xs text-gray-600">Strong Areas</div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-orange-600">
              {scores.filter(s => s.score < 60).length}
            </div>
            <div className="text-xs text-gray-600">Focus Areas</div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-blue-600">
              {Math.round(scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length * 100)}%
            </div>
            <div className="text-xs text-gray-600">Avg Confidence</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComponentScores;