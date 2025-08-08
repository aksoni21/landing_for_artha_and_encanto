import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Import our Phase 6 components
import AudioRecorder from '../components/audio/AudioRecorder';
import FileUploader from '../components/audio/FileUploader';
import AudioPreview from '../components/audio/AudioPreview';
import CEFRLevelIndicator from '../components/analysis/CEFRLevelIndicator';
import ComponentScores from '../components/analysis/ComponentScores';
import ProgressCharts from '../components/analysis/ProgressCharts';
import ProcessingStatus, { ProcessingStep } from '../components/analysis/ProcessingStatus';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import ErrorHandler, { AppError, createError, handleUploadError } from '../components/ui/ErrorHandler';

// Types
interface AnalysisResult {
  overall_cefr: string;
  confidence: number;
  weighted_average: number;
  component_scores: {
    [key: string]: {
      score: number;
      cefr: string;
      confidence: number;
    };
  };
  recommendations: string[];
}

interface HistoricalData {
  date: string;
  overallScore: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  discourse: number;
  cefrLevel: string;
  sessionDuration: number;
}

type AnalysisStep = 'upload' | 'processing' | 'results';
type TimeFrame = 'week' | 'month' | 'quarter' | 'year';

const AudioAnalysisPage: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [isMobile, setIsMobile] = useState(false);
  const [, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string; username?: string; name?: string } | null>(null);

  // Check authentication status
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const { authService } = await import('../services/authService');
        const user = authService.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    // Auto-login with demo user for testing
    await loginDemo();
  };

  const loginDemo = async () => {
    try {
      const { authService } = await import('../services/authService');
      const result = await authService.login('ankur8', '123456');
      if (result.success && result.token) {
        localStorage.setItem('auth_token', result.token);
        setIsLoggedIn(true);
        if (result.user) {
          setCurrentUser(result.user);
        }
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load historical data when user or timeframe changes
  useEffect(() => {
    if (currentUser) {
      loadHistoricalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, currentUser]);

  const loadHistoricalData = async () => {
    try {
      const { audioAnalysisService } = await import('../services/audioAnalysisService');
      
      // Use actual user ID if logged in, otherwise fallback
      const userId = currentUser?.id || '3c64d808-ff9c-4808-a1a2-84ee7c38183c';
      
      const history = await audioAnalysisService.getAnalysisHistory(userId, 13);
      setHistoricalData(history);
    } catch (error) {
      console.error('Failed to load historical data:', error);
      
      // Fallback to empty data if service fails
      setHistoricalData([]);
    }
  };

  const initializeProcessingSteps = (): ProcessingStep[] => [
    {
      id: 'transcription',
      name: 'Speech Recognition',
      description: 'Converting audio to text using AI',
      status: 'pending'
    },
    {
      id: 'grammar',
      name: 'Grammar Analysis',
      description: 'Analyzing sentence structure and complexity',
      status: 'pending'
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary Assessment',
      description: 'Evaluating word choice and sophistication',
      status: 'pending'
    },
    {
      id: 'fluency',
      name: 'Fluency Analysis',
      description: 'Measuring speech rate and naturalness',
      status: 'pending'
    },
    {
      id: 'pronunciation',
      name: 'Pronunciation Check',
      description: 'Assessing sound accuracy and intonation',
      status: 'pending'
    },
    {
      id: 'discourse',
      name: 'Discourse Analysis',
      description: 'Evaluating organization and coherence',
      status: 'pending'
    },
    {
      id: 'scoring',
      name: 'Final Scoring',
      description: 'Calculating CEFR level and recommendations',
      status: 'pending'
    }
  ];

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    try {
      const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      
      const url = URL.createObjectURL(audioBlob);
      
      setAudioFile(file);
      setAudioUrl(url);
      toast.success(`Recording completed successfully! Duration: ${Math.round(duration)}s`);
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
      setError(handleUploadError(error));
    }
  };

  const handleStartAnalysis = async () => {
    if (!audioFile) {
      setError(createError('validation', 'Please upload an audio file or make a recording first.'));
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentStep('processing');
      setProcessingSteps(initializeProcessingSteps());

      // Simulate the analysis process
      await simulateAnalysisProcess();
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(createError('processing', 'Audio analysis failed. Please try again.', {
        details: error instanceof Error ? error.message : 'Unknown error',
        retryable: true
      }));
      setIsProcessing(false);
    }
  };

  const simulateAnalysisProcess = async () => {
    try {
      // Import the audio analysis service
      const { audioAnalysisService } = await import('../services/audioAnalysisService');
      
      const steps = [...processingSteps];
      
      // Update transcription step
      steps[0] = { ...steps[0], status: 'processing', progress: 0 };
      setProcessingSteps([...steps]);
      
      // Simulate transcription progress
      for (let progress = 0; progress <= 100; progress += 20) {
        steps[0] = { ...steps[0], progress };
        setProcessingSteps([...steps]);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      steps[0] = { ...steps[0], status: 'completed', progress: 100, duration: 2.1 };
      setProcessingSteps([...steps]);

      // Call the real analysis service
      const analysisResult = await audioAnalysisService.analyzeAudio(audioFile!, {
        priority: 'normal',
        services: ['grammar', 'vocabulary', 'fluency', 'pronunciation', 'discourse']
      });

      // Update remaining steps based on actual analysis
      for (let i = 1; i < steps.length; i++) {
        steps[i] = { 
          ...steps[i], 
          status: 'completed',
          progress: 100,
          duration: 1 + Math.random() * 2
        };
        setProcessingSteps([...steps]);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Convert the service response to our component format
      const result: AnalysisResult = {
        overall_cefr: analysisResult.overall_result.overall_cefr,
        confidence: analysisResult.overall_result.confidence,
        weighted_average: analysisResult.overall_result.weighted_average,
        component_scores: analysisResult.overall_result.component_scores,
        recommendations: analysisResult.overall_result.recommendations
      };

      setAnalysisResult(result);
      setIsProcessing(false);
      setCurrentStep('results');
      toast.success('Analysis completed successfully!');
      
    } catch (error) {
      console.error('Analysis service error:', error);
      
      // Mark current step as error
      const steps = [...processingSteps];
      const currentStepIndex = steps.findIndex(s => s.status === 'processing');
      if (currentStepIndex >= 0) {
        steps[currentStepIndex] = {
          ...steps[currentStepIndex],
          status: 'error',
          error: error instanceof Error ? error.message : 'Analysis failed'
        };
        setProcessingSteps([...steps]);
      }
      
      throw error; // Re-throw to be handled by the calling function
    }
  };

  const handleRemoveAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(null);
    setAudioUrl('');
    setCurrentStep('upload');
    toast.success('Audio removed');
  };

  const handleStartOver = () => {
    handleRemoveAudio();
    setAnalysisResult(null);
    setProcessingSteps([]);
    setIsProcessing(false);
    setError(null);
  };

  const handleRetryAnalysis = () => {
    setError(null);
    setIsProcessing(false);
    setCurrentStep('upload');
    setProcessingSteps([]);
  };

  // Convert analysis result to component scores format
  const getComponentScores = () => {
    if (!analysisResult) return [];
    
    return Object.entries(analysisResult.component_scores).map(([component, data]) => ({
      component,
      score: data.score,
      cefr: data.cefr,
      confidence: data.confidence,
      details: {
        strengths: [`Strong ${component} performance`, `Good understanding of ${component} principles`],
        improvements: [`Practice more ${component} exercises`, `Focus on advanced ${component} concepts`],
        examples: [`Example ${component} usage in your speech`]
      }
    }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Audio Analysis
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Analyze your English speaking skills with AI-powered assessment
                </p>
              </div>
              
              {/* Progress Indicator */}
              <div className="hidden sm:flex items-center gap-2">
                {['upload', 'processing', 'results'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : index < ['upload', 'processing', 'results'].indexOf(currentStep)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div className={`w-8 h-0.5 ${
                        index < ['upload', 'processing', 'results'].indexOf(currentStep)
                          ? 'bg-green-600'
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {currentStep === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Recording and Upload Options */}
                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-8`}>
                  {/* Audio Recorder */}
                  <AudioRecorder
                    onRecordingComplete={handleRecordingComplete}
                    maxDuration={900} // 15 minutes
                  />
                  
                  {/* File Uploader */}
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

                {/* Historical Progress (if available) */}
                {historicalData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ProgressCharts
                      historicalData={historicalData}
                      currentScores={{
                        grammar: 75,
                        vocabulary: 78,
                        fluency: 68,
                        pronunciation: 71,
                        discourse: 70
                      }}
                      timeframe={timeframe}
                      onTimeframeChange={setTimeframe}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Processing */}
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
                  currentStep={processingSteps.find(s => s.status === 'processing')?.id}
                  onCancel={handleStartOver}
                  onRetry={handleRetryAnalysis}
                  showDetails={!isMobile}
                />
              </motion.div>
            )}

            {/* Step 3: Results */}
            {currentStep === 'results' && analysisResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Results Header */}
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Your Analysis Results
                  </h2>
                  <motion.button
                    onClick={handleStartOver}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Analyze New Recording
                  </motion.button>
                </div>

                {/* Main Results Grid */}
                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-3'} gap-8`}>
                  {/* CEFR Level Indicator */}
                  <div className={isMobile ? 'col-span-1' : 'xl:col-span-1'}>
                    <CEFRLevelIndicator
                      currentLevel={analysisResult.overall_cefr}
                      confidence={analysisResult.confidence}
                      score={analysisResult.weighted_average}
                      nextLevel={getNextCEFRLevel(analysisResult.overall_cefr)}
                      progressToNext={75} // Mock progress
                      size={isMobile ? 'medium' : 'large'}
                      showDetails={true}
                      animated={true}
                    />
                  </div>

                  {/* Component Scores */}
                  <div className={isMobile ? 'col-span-1' : 'xl:col-span-2'}>
                    <ComponentScores
                      scores={getComponentScores()}
                      animated={true}
                      showDetails={!isMobile}
                    />
                  </div>
                </div>

                {/* Progress Charts */}
                <ProgressCharts
                  historicalData={historicalData}
                  currentScores={{
                    grammar: analysisResult.component_scores.grammar?.score || 0,
                    vocabulary: analysisResult.component_scores.vocabulary?.score || 0,
                    fluency: analysisResult.component_scores.fluency?.score || 0,
                    pronunciation: analysisResult.component_scores.pronunciation?.score || 0,
                    discourse: analysisResult.component_scores.discourse?.score || 0,
                  }}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                />

                {/* Recommendations */}
                {analysisResult.recommendations && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      🎯 Personalized Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Error Handler */}
        {error && (
          <ErrorHandler
            error={error}
            onDismiss={() => setError(null)}
            onRetry={handleRetryAnalysis}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// Helper function to get next CEFR level
const getNextCEFRLevel = (currentLevel: string): string | undefined => {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex >= 0 && currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
};

export default AudioAnalysisPage;