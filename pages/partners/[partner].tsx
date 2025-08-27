import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

// Import partner configurations
import { getPartnerConfig, isValidPartner, PartnerConfig, colorMap } from '../../data/partners-config';

// Reuse existing components from audio-analysis
import AudioRecorder from '../../components/audio/AudioRecorder';
import FileUploader from '../../components/audio/FileUploader';
import AudioPreview from '../../components/audio/AudioPreview';
import ComponentScores from '../../components/analysis/ComponentScores';
import ProcessingStatus, { ProcessingStep } from '../../components/analysis/ProcessingStatus';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import ErrorHandler, { AppError, createError } from '../../components/ui/ErrorHandler';
import TOEFLScoreIndicator from '../../components/analysis/TOEFLScoreIndicator';

interface AnalysisResult {
  overall_toefl?: number;
  overall_cefr?: string;
  confidence: number;
  weighted_average: number;
  component_scores: {
    [key: string]: {
      score: number;
      toefl_score?: number;
      cefr?: string;
      confidence: number;
    };
  };
  recommendations: string[];
}

type AnalysisStep = 'welcome' | 'demo' | 'processing' | 'results';

interface PartnerPageProps {
  partnerConfig: PartnerConfig | null;
}

const DynamicPartnerPage: React.FC<PartnerPageProps> = ({ partnerConfig }) => {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('welcome');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [hasStartedDemo, setHasStartedDemo] = useState(false);

  // Get color classes and displayName (moved before early return)
  const colors = partnerConfig ? colorMap[partnerConfig.primaryColor] || colorMap['blue'] : colorMap['blue'];
  // Use displayName in header to avoid unused variable warning
  const displayName = partnerConfig && partnerConfig.fullName.length > 25 
    ? partnerConfig.name 
    : partnerConfig?.fullName || '';

  // Track page visit (moved before early return)
  useEffect(() => {
    if (!partnerConfig) return;
    
    console.log(`${partnerConfig.name} Partner page visited`);
    console.log('Partner config:', partnerConfig);
    console.log('Colors being used:', colors);
    trackPartnerVisit(partnerConfig.id);
  }, [partnerConfig, colors]);

  // If no valid partner config, show 404
  if (!partnerConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">This partner page doesn&apos;t exist or is not active.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const trackPartnerVisit = async (partnerId: string) => {
    try {
      // Send visit event to your analytics/backend
      console.log(`Tracking visit for partner: ${partnerId}`);
      // await fetch('/api/analytics/partner-visit', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ partnerId, timestamp: new Date() })
      // });
    } catch (error) {
      console.error('Failed to track visit:', error);
    }
  };

  const handleStartDemo = () => {
    setCurrentStep('demo');
    setHasStartedDemo(true);
  };

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    try {
      const file = new File([audioBlob], `${partnerConfig.id}-demo-${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      
      const url = URL.createObjectURL(audioBlob);
      
      setAudioFile(file);
      setAudioUrl(url);
      toast.success(`Recording completed! Duration: ${Math.round(duration)}s`);
    } catch (error) {
      console.error('Error handling recording:', error);
      setError(createError('processing', 'Failed to process recording. Please try again.'));
    }
  };

  const handleFileSelect = (file: File, url: string) => {
    try {
      setAudioFile(file);
      setAudioUrl(url);
      toast.success(`File selected: ${file.name}`);
    } catch (error) {
      console.error('Error handling file selection:', error);
      setError(createError('processing', 'Failed to process file. Please try again.'));
    }
  };

  const handleStartAnalysis = async () => {
    if (!audioFile) {
      setError(createError('validation', 'Please upload an audio file or make a recording first.'));
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');
    setProcessingSteps([{
      id: 'analysis',
      name: 'TOEFL Analysis',
      description: 'Analyzing speaking sample...',
      status: 'processing'
    }]);

    // Simulate processing for demo - customize scores based on partner
    setTimeout(() => {
      setProcessingSteps([{
        id: 'analysis',
        name: 'TOEFL Analysis',
        description: 'Analysis completed!',
        status: 'completed',
        progress: 100
      }]);

      // Generate mock result with some variation based on partner
      const baseScore = 80 + Math.floor(Math.random() * 15);
      const mockResult: AnalysisResult = {
        overall_toefl: baseScore + 7,
        overall_cefr: baseScore > 85 ? 'B2' : 'B1',
        confidence: 0.88 + Math.random() * 0.1,
        weighted_average: baseScore + 7,
        component_scores: {
          speaking: { score: baseScore - 7, toefl_score: 22, cefr: 'B2', confidence: 0.90 },
          grammar: { score: baseScore, toefl_score: 24, cefr: 'B2', confidence: 0.93 },
          vocabulary: { score: baseScore - 10, toefl_score: 21, cefr: 'B2', confidence: 0.89 },
          fluency: { score: baseScore - 13, toefl_score: 20, cefr: 'B2', confidence: 0.88 }
        },
        recommendations: [
          'Focus on expanding advanced vocabulary for academic contexts',
          'Practice speaking fluency with timed exercises',
          'Work on complex sentence structures for higher scores',
          'Regular practice with TOEFL speaking prompts recommended'
        ]
      };

      setAnalysisResult(mockResult);
      setIsProcessing(false);
      setCurrentStep('results');
      toast.success('TOEFL analysis completed!');
    }, 3000);
  };

  const handleRemoveAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(null);
    setAudioUrl('');
  };

  const handleScheduleCall = () => {
    window.open(partnerConfig.calendarLink, '_blank');
  };

  const getComponentScores = () => {
    if (!analysisResult) return [];
    
    return Object.entries(analysisResult.component_scores).map(([component, data]) => ({
      component,
      score: data.toefl_score || data.score,
      cefr: data.cefr || '',
      confidence: data.confidence,
      details: {
        strengths: [],
        improvements: [],
        examples: []
      }
    }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Toaster position="top-right" />
        
        {/* Dynamic Partner Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-gray-900">
                  Encanto AI
                </Link>
                <span className="text-gray-400">×</span>
                <div>
                  <h1 className={`text-xl font-bold ${colors.primaryText}`}>
                    {displayName}
                  </h1>
                  <p className="text-xs text-gray-500">Exclusive Partner Demo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">🔒 Private Demo</span>
                {hasStartedDemo && (
                  <button
                    onClick={handleScheduleCall}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Schedule Implementation Call
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            
            {/* Welcome Screen */}
            {currentStep === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Welcome, <span className={colors.primaryText}>{partnerConfig.fullName} Team!</span>
                  </h1>
                  <p className="text-2xl text-gray-600 mb-4">
                    Your Exclusive AI-Powered Assessment Demo
                  </p>
                  {partnerConfig.customMessage && (
                    <p className="text-lg text-gray-500 italic">
                      {partnerConfig.customMessage}
                    </p>
                  )}
                </motion.div>

                {/* Value Props */}
                <motion.div 
                  className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-3xl mb-4">⏱️</div>
                    <h3 className={`text-lg font-semibold mb-2 ${colors.primaryText}`}>Instant Assessment</h3>
                    <p className="text-gray-600">{partnerConfig.metrics.timeSaved} saved on grading</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-3xl mb-4">👥</div>
                    <h3 className={`text-lg font-semibold mb-2 ${colors.primaryText}`}>For {partnerConfig.studentCount} Students</h3>
                    <p className="text-gray-600">Scale personalized feedback across all classes</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-3xl mb-4">🎯</div>
                    <h3 className={`text-lg font-semibold mb-2 ${colors.primaryText}`}>{partnerConfig.metrics.improvement}</h3>
                    <p className="text-gray-600">Student improvement with AI assistance</p>
                  </div>
                </motion.div>

                {/* Focus Areas */}
                {partnerConfig.focusAreas && partnerConfig.focusAreas.length > 0 && (
                  <motion.div
                    className="mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Specialized for Your Programs:</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {partnerConfig.focusAreas.map((area, index) => (
                        <span key={index} className={`px-4 py-2 ${colors.lightBg} ${colors.primaryText} rounded-full text-sm font-medium`}>
                          {area}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTA Button */}
                <motion.button
                  onClick={handleStartDemo}
                  className={`px-8 py-4 ${colors.gradient} text-white rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Your 60-Second Demo
                </motion.button>

                <motion.div 
                  className="mt-8 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p>🔐 This demo is exclusively for {partnerConfig.fullName}. Please do not share.</p>
                </motion.div>
              </motion.div>
            )}

            {/* Demo Screen */}
            {currentStep === 'demo' && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Demo Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Speaking Assessment Demo
                  </h2>
                  <p className="text-lg text-gray-600">
                    Record or upload a 30-60 second speaking sample from a {partnerConfig.name} student
                  </p>
                </div>

                {/* Recording Options */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <AudioRecorder
                    onRecordingComplete={handleRecordingComplete}
                    maxDuration={60}
                  />
                  
                  <FileUploader
                    onFileSelect={handleFileSelect}
                  />
                </div>

                {/* Audio Preview */}
                {audioFile && audioUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AudioPreview
                      audioUrl={audioUrl}
                      fileName={audioFile.name}
                      onAnalyze={handleStartAnalysis}
                      onRemove={handleRemoveAudio}
                    />
                  </motion.div>
                )}

                {/* Sample Prompt */}
                <div className={`${colors.lightBg} rounded-xl p-6 border ${colors.primaryBorder}`}>
                  <h3 className={`font-semibold ${colors.primaryText} mb-2`}>Sample Speaking Prompt:</h3>
                  <p className="text-gray-800 italic">
                    &ldquo;Some people prefer to live in a small town. Others prefer to live in a big city. 
                    Which place would you prefer to live in? Use specific reasons and examples to support your answer.&rdquo;
                  </p>
                  <p className={`text-sm ${colors.primaryText} opacity-80 mt-2`}>
                    Students should speak for 45-60 seconds
                  </p>
                </div>
              </motion.div>
            )}

            {/* Processing Screen */}
            {currentStep === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <ProcessingStatus
                  isProcessing={isProcessing}
                  steps={processingSteps}
                  currentStep="analysis"
                  onCancel={() => setCurrentStep('demo')}
                  showDetails={true}
                />
              </motion.div>
            )}

            {/* Results Screen */}
            {currentStep === 'results' && analysisResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Results Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Instant Analysis Complete!
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Here&apos;s what every {partnerConfig.name} student would receive automatically
                  </p>
                </div>

                {/* TOEFL Score Display */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* TOEFL Score */}
                  <div className="xl:col-span-1">
                    <TOEFLScoreIndicator
                      totalScore={analysisResult.overall_toefl || 0}
                      sectionScores={{
                        reading: 22,
                        listening: 24, 
                        speaking: 21,
                        writing: 20
                      }}
                      confidence={analysisResult.confidence}
                      size="large"
                      animated={true}
                    />
                  </div>

                  {/* Component Scores */}
                  <div className="xl:col-span-2">
                    <ComponentScores
                      scores={getComponentScores()}
                      animated={true}
                      showDetails={true}
                    />
                  </div>
                </div>

                {/* Partner Impact Metrics */}
                <motion.div
                  className={`${colors.lightBg} rounded-xl p-8 border ${colors.primaryBorder}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    What This Means for {partnerConfig.fullName}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-6 text-center">
                      <div className={`text-4xl font-bold ${colors.primaryText} mb-2`}>
                        {partnerConfig.metrics.timeSaved}
                      </div>
                      <p className="text-gray-600">Saved on assessments</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {partnerConfig.metrics.availability}
                      </div>
                      <p className="text-gray-600">Practice availability</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 text-center">
                      <div className={`text-4xl font-bold ${colors.secondaryText} mb-2`}>
                        {partnerConfig.metrics.improvement}
                      </div>
                      <p className="text-gray-600">Score improvement</p>
                    </div>
                  </div>
                </motion.div>

                {/* Testimonial if available */}
                {partnerConfig.testimonial && (
                  <motion.div
                    className="bg-white rounded-xl shadow-lg p-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-xl italic text-gray-700 mb-4">
                      &ldquo;{partnerConfig.testimonial.quote}&rdquo;
                    </p>
                    <p className="font-semibold text-gray-900">{partnerConfig.testimonial.author}</p>
                    <p className="text-gray-600">{partnerConfig.testimonial.role}</p>
                  </motion.div>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations && (
                  <motion.div
                    className="bg-white rounded-xl shadow-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      🎯 Personalized Student Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-6 h-6 ${colors.primaryBg} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTA Section */}
                <motion.div
                  className={`${colors.gradient} rounded-xl p-8 text-white text-center`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Transform {partnerConfig.name}&apos;s ESL Program?
                  </h3>
                  <p className="text-lg mb-6">
                    Join 200+ schools already using Encanto AI to accelerate student success
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleScheduleCall}
                      className={`px-8 py-3 bg-white ${colors.primaryText} rounded-lg font-semibold hover:bg-gray-100 transition-colors`}
                    >
                      Schedule {partnerConfig.name} Implementation Call
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep('demo');
                        handleRemoveAudio();
                      }}
                      className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    >
                      Try Another Sample
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Error Handler */}
        {error && (
          <ErrorHandler
            error={error}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p className="mb-2">This demo is exclusively prepared for {partnerConfig.fullName}</p>
              <p className="text-sm">© 2024 Encanto AI. Transforming ESL Education with AI.</p>
              <div className="mt-4 space-x-4">
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
                <span className="text-gray-300">|</span>
                <a href={`mailto:${partnerConfig.contactEmail}`} className="text-blue-600 hover:text-blue-700">
                  Contact: {partnerConfig.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

// Server-side props to validate partner
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { partner } = context.params as { partner: string };
  
  // Check if partner exists and is active
  if (!isValidPartner(partner)) {
    return {
      props: {
        partnerConfig: null
      }
    };
  }

  const partnerConfig = getPartnerConfig(partner);

  return {
    props: {
      partnerConfig
    }
  };
};

export default DynamicPartnerPage;