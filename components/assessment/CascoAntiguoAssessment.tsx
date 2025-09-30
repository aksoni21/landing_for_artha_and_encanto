import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, AlertCircle, CheckCircle, Waves } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { detectBestAudioMimeType, createMediaRecorderOptions, getAudioFileExtension } from '../../utils/audioMimeType';

interface CascoAntiguoConfig {
  partner_id: string;
  name: string;
  language: string;
  branding: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  ui_text: {
    welcome_title: string;
    welcome_subtitle: string;
    recording_instructions: string;
    recording_button: string;
    stop_button: string;
    submit_button: string;
    success_message: string;
    error_message: string;
    duration_warning: string;
  };
  recording_duration: {
    min_seconds: number;
    max_seconds: number;
    warning_at: number;
  };
}

interface CascoAntiguoAssessmentProps {
  config: CascoAntiguoConfig;
}

type AssessmentStep = 'welcome' | 'recording' | 'preview' | 'processing' | 'success' | 'error';

const CascoAntiguoAssessment: React.FC<CascoAntiguoAssessmentProps> = ({ config }) => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('welcome');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { ui_text, recording_duration, branding } = config;

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Timer effect for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;

          // Warning at specified time
          if (newTime === recording_duration.warning_at) {
            toast(ui_text.duration_warning.replace('{seconds}',
              String(recording_duration.max_seconds - newTime)), {
              icon: '⏰',
              duration: 3000
            });
          }

          // Auto-stop at max duration
          if (newTime >= recording_duration.max_seconds) {
            stopRecording();
            return recording_duration.max_seconds;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, recording_duration, ui_text, stopRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });

      // Detect best MIME type for this platform
      const mimeType = detectBestAudioMimeType();
      console.log('Using MIME type:', mimeType || 'browser default');

      const mediaRecorder = new MediaRecorder(stream, createMediaRecorderOptions());
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = detectBestAudioMimeType();
        const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setCurrentStep('preview');

        // Stop all tracks to free up microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setCurrentStep('recording');

      toast.success('Recording started', { duration: 2000 });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Error accessing microphone. Please allow access.');
    }
  };

  const retryRecording = () => {
    // Show confirmation dialog in Spanish (matching the UI language)
    const confirmMessage = 'Are you sure? This will delete your current recording and you will have to record again.';

    if (window.confirm(confirmMessage)) {
      setAudioBlob(null);
      setAudioUrl('');
      setRecordingTime(0);
      setCurrentStep('welcome');
    }
  };

  const submitAssessment = async () => {
    if (!audioBlob) {
      toast.error('No recording to submit');
      return;
    }

    if (recordingTime < recording_duration.min_seconds) {
      toast.error(`Recording must be at least ${recording_duration.min_seconds} seconds`);
      return;
    }

    if (!studentName.trim()) {
      toast.error('Please enter your name before submitting');
      return;
    }

    setIsSubmitting(true);
    setCurrentStep('processing');

    try {
      const formData = new FormData();
      const fileExtension = getAudioFileExtension();
      formData.append('audio_file', audioBlob, `assessment.${fileExtension}`);
      formData.append('student_name', studentName);
      formData.append('student_email', studentEmail);
      formData.append('partner_id', config.partner_id);
      formData.append('partner_name', config.name);
      formData.append('assessment_type', 'partner_assessment');
      formData.append('language', 'es'); // Use ISO-639-1 format for Spanish

      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const result = await response.json();
      console.log('Upload result:', result);

      if (result.status === 'queued') {
        // Audio uploaded successfully, now poll for completion
        console.log('Audio queued for processing, session_id:', result.session_id);
        setCurrentStep('success'); // For now, treat queued as success for the pilot
        toast.success('Audio uploaded successfully! Analysis in progress...');
      } else if (result.status === 'completed') {
        setCurrentStep('success');
        toast.success(ui_text.success_message);
      } else {
        console.error('Unexpected status from upload:', result.status);
        console.error('Full upload result:', result);
        throw new Error(`Unexpected status: ${result.status}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      if (error && typeof error === 'object' && 'response' in error) {
        const errorWithResponse = error as { response?: { data?: unknown } };
        console.error('API Response:', errorWithResponse.response);
        console.error('API Response data:', errorWithResponse.response?.data);
      }
      setCurrentStep('error');
      toast.error(ui_text.error_message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl p-8 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Tropical Header */}
      <div className="mb-8">
        {/* <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          style={{ color: '#007F5F' }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Ready to Begin Assessment
        </motion.div> */}

        <h2 className="text-4xl font-bold mb-4" style={{ color: branding.primary_color, fontFamily: 'Poppins, sans-serif' }}>
          {ui_text.welcome_title}
        </h2>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
          {ui_text.recording_instructions}
        </p>

        {/* Tropical Instructions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['🎯', '🗣️', '✨'].map((emoji, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="text-xs font-semibold text-gray-600">
                {['Click', 'Speak', 'Submit'][index]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optional student info with tropical styling */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all text-black"
          style={{ '--tw-ring-color': branding.secondary_color } as React.CSSProperties}
        />
        <input
          type="email"
          placeholder="Your email (optional)"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all text-black"
          style={{ '--tw-ring-color': branding.secondary_color } as React.CSSProperties}
        />
      </div>


      {/* Modern Tropical Start Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startRecording}
        className="w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-2xl mx-auto mb-4 transition-all duration-300"
        style={{ backgroundColor: branding.primary_color }}
      >
        <Mic size={32} />
      </motion.button>

      <p className="text-lg font-semibold mb-2" style={{ color: branding.primary_color }}>
        {ui_text.recording_button}
      </p>

      <p className="text-sm text-gray-600">
        Duration: {recording_duration.min_seconds}-{recording_duration.max_seconds} seconds
      </p>

      {/* Tropical Wave Decoration */}
      <div className="flex justify-center mt-6">
        <Waves size={24} style={{ color: '#1ABC9C', opacity: 0.3 }} />
      </div>
    </motion.div>
  );

  const renderRecordingStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Clean Recording Status */}
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#f87171' }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-4 h-4 bg-white rounded-full"
          />
        </motion.div>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Recording...
        </h2>
        <p className="text-gray-600 text-sm">Speak clearly in Spanish</p>
      </div>

      {/* Simple Timer */}
      <div className="mb-8">
        <div className="text-4xl font-mono font-bold mb-4 text-gray-800">
          {formatTime(recordingTime)}
        </div>

        {/* Minimal Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={branding.primary_color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={351.86}
              strokeDashoffset={351.86 - (recordingTime / recording_duration.max_seconds) * 351.86}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-500 font-medium">
              {recording_duration.max_seconds - recordingTime}s left
            </span>
          </div>
        </div>
      </div>

      {/* Clean Stop Button */}
      <motion.button
        whileHover={{ scale: recordingTime >= recording_duration.min_seconds ? 1.02 : 1 }}
        whileTap={{ scale: recordingTime >= recording_duration.min_seconds ? 0.98 : 1 }}
        onClick={stopRecording}
        disabled={recordingTime < recording_duration.min_seconds}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg mx-auto transition-all duration-300 ${
          recordingTime >= recording_duration.min_seconds
            ? 'cursor-pointer hover:shadow-xl'
            : 'cursor-not-allowed opacity-40'
        }`}
        style={{
          backgroundColor: recordingTime >= recording_duration.min_seconds ? '#ef4444' : '#9ca3af'
        }}
      >
        <Square size={20} className="fill-current" />
      </motion.button>

      <p className="text-sm font-medium mt-4 text-gray-700">
        {recordingTime >= recording_duration.min_seconds
          ? 'Tap to stop recording'
          : `Keep speaking (${recording_duration.min_seconds - recordingTime}s minimum)`
        }
      </p>
    </motion.div>
  );

  const renderPreviewStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Success Indicator */}
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100"
        >
          <CheckCircle size={32} className="text-green-600" />
        </motion.div>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Recording Complete
        </h2>
        <p className="text-gray-600 text-sm">
          {formatTime(recordingTime)} seconds {recordingTime >= recording_duration.min_seconds ? '' : '• Too short'}
        </p>
      </div>

      {/* Audio Player */}
      <div className="mb-6">
        {audioUrl && (
          // <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              className="w-full"
              style={{
                height: '48px',
                borderRadius: '12px',
                outline: 'none',
                filter: 'sepia(20%) saturate(150%) hue-rotate(200deg)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
              }}
            />
          // </div>
        )}
      </div>

      {/* Student Info */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Your name (required)"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all text-black"
          style={{ '--tw-ring-color': '#3b82f6' } as React.CSSProperties}
        />
        <input
          type="email"
          placeholder="Your email (optional)"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all text-black"
          style={{ '--tw-ring-color': '#3b82f6' } as React.CSSProperties}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={submitAssessment}
          disabled={recordingTime < recording_duration.min_seconds || isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
            recordingTime >= recording_duration.min_seconds && !isSubmitting
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Recording'}
        </button>

        <button
          onClick={retryRecording}
          className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
        >
          Record Again
        </button>
      </div>
    </motion.div>
  );

  const renderProcessingStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-2xl p-8 text-center"
    >
      <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Assessment</h2>
      <p className="text-gray-600">
        We are analyzing your recording. The school will receive the results by email.
      </p>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-2xl p-8 text-center"
    >
      <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Completed!</h2>
      <p className="text-gray-600 mb-6">
        {ui_text.success_message}
      </p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-green-800 text-sm">
          The school will receive an email with your results and will be able to listen to your recording.
        </p>
      </div>
    </motion.div>
  );

  const renderErrorStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-2xl p-8 text-center"
    >
      <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
      <p className="text-gray-600 mb-6">
        {ui_text.error_message}
      </p>
      <button
        onClick={retryRecording}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Try Again
      </button>
    </motion.div>
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && renderWelcomeStep()}
        {currentStep === 'recording' && renderRecordingStep()}
        {currentStep === 'preview' && renderPreviewStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'success' && renderSuccessStep()}
        {currentStep === 'error' && renderErrorStep()}
      </AnimatePresence>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default CascoAntiguoAssessment;