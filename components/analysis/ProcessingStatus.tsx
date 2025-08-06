import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  duration?: number;
  error?: string;
  details?: string[];
}

interface ProcessingStatusProps {
  isProcessing: boolean;
  steps: ProcessingStep[];
  currentStep?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  steps,
  currentStep,
  onCancel,
  onRetry,
  showDetails = true,
  className = '',
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing) {
      const startTime = Date.now();
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  useEffect(() => {
    // Calculate estimated time remaining
    const completedSteps = steps.filter(step => step.status === 'completed');
    const totalSteps = steps.length;
    
    if (completedSteps.length > 0 && elapsedTime > 0) {
      const averageTimePerStep = elapsedTime / completedSteps.length;
      const remainingSteps = totalSteps - completedSteps.length;
      setEstimatedTimeRemaining(Math.round(averageTimePerStep * remainingSteps));
    }
  }, [steps, elapsedTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getOverallProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const currentStepProgress = steps.find(step => step.id === currentStep)?.progress || 0;
    const totalProgress = (completedSteps + currentStepProgress / 100) / steps.length;
    return Math.min(Math.round(totalProgress * 100), 100);
  };

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'processing':
        return (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
        );
    }
  };

  const hasErrors = steps.some(step => step.status === 'error');
  const isCompleted = steps.every(step => step.status === 'completed') && steps.length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {isCompleted ? 'Analysis Complete!' : hasErrors ? 'Processing Error' : 'Processing Audio'}
          </h3>
          <p className="text-sm text-gray-600">
            {isCompleted 
              ? 'Your language analysis is ready' 
              : hasErrors 
              ? 'Some steps encountered errors'
              : 'Please wait while we analyze your audio'
            }
          </p>
        </div>

        {/* Cancel Button */}
        {isProcessing && onCancel && (
          <motion.button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </motion.button>
        )}
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">{getOverallProgress()}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              hasErrors ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${getOverallProgress()}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Time Information */}
      {(isProcessing || isCompleted) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-xs text-gray-600">Elapsed Time</div>
          </div>
          
          {estimatedTimeRemaining !== null && isProcessing && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {formatTime(estimatedTimeRemaining)}
              </div>
              <div className="text-xs text-gray-600">Est. Remaining</div>
            </div>
          )}
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {steps.filter(s => s.status === 'completed').length}/{steps.length}
            </div>
            <div className="text-xs text-gray-600">Steps Complete</div>
          </div>
        </div>
      )}

      {/* Processing Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              step.status === 'completed' 
                ? 'border-green-200 bg-green-50'
                : step.status === 'error'
                ? 'border-red-200 bg-red-50'
                : step.status === 'processing'
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${
                    step.status === 'error' ? 'text-red-700' : 'text-gray-800'
                  }`}>
                    {step.name}
                  </h4>
                  
                  {step.duration && step.status === 'completed' && (
                    <span className="text-xs text-gray-500">
                      {formatTime(step.duration)}
                    </span>
                  )}
                </div>
                
                <p className={`text-sm ${
                  step.status === 'error' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {step.error || step.description}
                </p>

                {/* Step Progress Bar */}
                {step.status === 'processing' && step.progress !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${step.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {step.progress}% complete
                    </div>
                  </div>
                )}

                {/* Step Details */}
                {showDetails && step.details && step.details.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-1"
                  >
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        {detail}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {(hasErrors || isCompleted) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center gap-3 mt-6"
          >
            {hasErrors && onRetry && (
              <motion.button
                onClick={onRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4c-3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4L17.65,6.35z"/>
                </svg>
                Retry Analysis
              </motion.button>
            )}
            
            {isCompleted && (
              <motion.button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                View Results
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Animation */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-center"
        >
          <div className="flex items-center gap-2 text-blue-600">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium">Analyzing your speech...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProcessingStatus;