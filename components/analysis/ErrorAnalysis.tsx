import React from 'react';
import { motion } from 'framer-motion';

interface PronunciationError {
  type: 'problematic_sound' | 'l1_interference';
  details: string | Record<string, unknown>;
}

interface FluencyError {
  type: string;
  count?: number;
  details: string | Record<string, unknown>;
}

interface ErrorGroup {
  grammar_errors: (string | Record<string, unknown>)[];
  pronunciation_errors: PronunciationError[];
  fluency_issues: FluencyError[];
  vocabulary_issues: (string | Record<string, unknown>)[];
}

interface ErrorAnalysisProps {
  errors: ErrorGroup;
  className?: string;
}

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ errors, className = '' }) => {
  const hasAnyErrors = Object.values(errors).some(errorList => errorList.length > 0);

  if (!hasAnyErrors) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🎉 Error Analysis
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600">No major errors detected in your speech!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        🔍 Error Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grammar Errors */}
        {errors.grammar_errors.length > 0 && (
          <ErrorSection
            title="Grammar"
            icon="📝"
            color="red"
            errors={errors.grammar_errors}
            renderError={(error, index) => (
              <div key={index} className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </div>
            )}
          />
        )}

        {/* Pronunciation Errors */}
        {errors.pronunciation_errors.length > 0 && (
          <ErrorSection
            title="Pronunciation"
            icon="🗣️"
            color="orange"
            errors={errors.pronunciation_errors}
            renderError={(error, index) => {
              const pronunciationError = error as PronunciationError;
              return (
                <div key={index} className="text-sm text-gray-700 bg-orange-50 p-2 rounded">
                  <div className="font-medium text-orange-800">
                    {pronunciationError.type === 'problematic_sound' ? 'Problematic Sound' : 'L1 Interference'}
                  </div>
                  <div className="text-orange-700">
                    {typeof pronunciationError.details === 'string' ? pronunciationError.details : JSON.stringify(pronunciationError.details)}
                  </div>
                </div>
              );
            }}
          />
        )}

        {/* Fluency Issues */}
        {errors.fluency_issues.length > 0 && (
          <ErrorSection
            title="Fluency"
            icon="⚡"
            color="yellow"
            errors={errors.fluency_issues}
            renderError={(error, index) => {
              const fluencyError = error as FluencyError;
              return (
                <div key={index} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                  <div className="font-medium text-yellow-800">
                    {fluencyError.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </div>
                  <div className="text-yellow-700">
                    {fluencyError.count ? `Count: ${fluencyError.count}` :
                     typeof fluencyError.details === 'object' ?
                       Object.entries(fluencyError.details).map(([word, count]) => `${word}: ${count}`).join(', ') :
                       fluencyError.details}
                  </div>
                </div>
              );
            }}
          />
        )}

        {/* Vocabulary Issues */}
        {errors.vocabulary_issues.length > 0 && (
          <ErrorSection
            title="Vocabulary"
            icon="📚"
            color="blue"
            errors={errors.vocabulary_issues}
            renderError={(error, index) => (
              <div key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </div>
            )}
          />
        )}
      </div>
    </motion.div>
  );
};

interface ErrorSectionProps {
  title: string;
  icon: string;
  color: 'red' | 'orange' | 'yellow' | 'blue';
  errors: (string | Record<string, unknown> | PronunciationError | FluencyError)[];
  renderError: (error: string | Record<string, unknown> | PronunciationError | FluencyError, index: number) => React.ReactNode;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({
  title,
  icon,
  color,
  errors,
  renderError
}) => {
  const colorClasses = {
    red: 'border-red-200 bg-red-50',
    orange: 'border-orange-200 bg-orange-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    blue: 'border-blue-200 bg-blue-50'
  };

  const headerColorClasses = {
    red: 'text-red-800',
    orange: 'text-orange-800',
    yellow: 'text-yellow-800',
    blue: 'text-blue-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className={`flex items-center gap-2 mb-3 ${headerColorClasses[color]}`}>
        <span className="text-lg">{icon}</span>
        <h4 className="font-semibold">{title}</h4>
        <span className="text-sm text-gray-500">({errors.length})</span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {errors.map((error, index) => renderError(error, index))}
      </div>
    </div>
  );
};

export default ErrorAnalysis;