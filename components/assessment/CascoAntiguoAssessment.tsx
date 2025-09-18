import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Upload, Play, Pause, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
  }, [isRecording, recording_duration, ui_text]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
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

      toast.success('Grabación iniciada', { duration: 2000 });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Error al acceder al micrófono. Por favor, permite el acceso.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retryRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingTime(0);
    setCurrentStep('welcome');
  };

  const submitAssessment = async () => {
    if (!audioBlob) {
      toast.error('No hay grabación para enviar');
      return;
    }

    if (recordingTime < recording_duration.min_seconds) {
      toast.error(`La grabación debe ser de al menos ${recording_duration.min_seconds} segundos`);
      return;
    }

    setIsSubmitting(true);
    setCurrentStep('processing');

    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'assessment.wav');
      formData.append('student_name', studentName);
      formData.append('student_email', studentEmail);

      const response = await fetch(`/api/partners/${config.partner_id}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const result = await response.json();

      if (result.status === 'completed') {
        setCurrentStep('success');
        toast.success(ui_text.success_message);
      } else {
        throw new Error('Error procesando la evaluación');
      }
    } catch (error) {
      console.error('Submission error:', error);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-2xl p-8 text-center"
    >
      <h2 className="text-3xl font-bold mb-4" style={{ color: branding.primary_color }}>
        {ui_text.welcome_title}
      </h2>
      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
        {ui_text.recording_instructions}
      </p>

      {/* Optional student info */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="email"
          placeholder="Tu email (opcional)"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={startRecording}
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full text-xl font-semibold flex items-center space-x-3 mx-auto transition-all transform hover:scale-105"
      >
        <Mic size={24} />
        <span>{ui_text.recording_button}</span>
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Duración: {recording_duration.min_seconds}-{recording_duration.max_seconds} segundos
      </p>
    </motion.div>
  );

  const renderRecordingStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-2xl p-8 text-center"
    >
      <div className="mb-8">
        <div className="animate-pulse bg-red-500 w-4 h-4 rounded-full mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Grabando...</h2>
        <p className="text-gray-600">Habla claramente sobre cualquier tema en español</p>
      </div>

      <div className="mb-8">
        <div className="text-6xl font-mono font-bold text-red-500 mb-4">
          {formatTime(recordingTime)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${(recordingTime / recording_duration.max_seconds) * 100}%`
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Máximo: {recording_duration.max_seconds} segundos
        </p>
      </div>

      <button
        onClick={stopRecording}
        disabled={recordingTime < recording_duration.min_seconds}
        className={`px-8 py-4 rounded-full text-xl font-semibold flex items-center space-x-3 mx-auto transition-all ${
          recordingTime >= recording_duration.min_seconds
            ? 'bg-gray-600 hover:bg-gray-700 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Square size={24} />
        <span>{ui_text.stop_button}</span>
      </button>
    </motion.div>
  );

  const renderPreviewStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-2xl p-8"
    >
      <h2 className="text-2xl font-bold text-center mb-6" style={{ color: branding.primary_color }}>
        Revisar Grabación
      </h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 font-medium">
            Duración: {formatTime(recordingTime)}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            recordingTime >= recording_duration.min_seconds
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {recordingTime >= recording_duration.min_seconds ? 'Válida' : 'Muy corta'}
          </span>
        </div>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full"
          />
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={retryRecording}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
        >
          <RefreshCw size={20} />
          <span>Grabar de Nuevo</span>
        </button>

        <button
          onClick={submitAssessment}
          disabled={recordingTime < recording_duration.min_seconds || isSubmitting}
          className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
            recordingTime >= recording_duration.min_seconds && !isSubmitting
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Upload size={20} />
          <span>{ui_text.submit_button}</span>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Procesando Evaluación</h2>
      <p className="text-gray-600">
        Estamos analizando tu grabación. La escuela recibirá los resultados por correo electrónico.
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Evaluación Completada!</h2>
      <p className="text-gray-600 mb-6">
        {ui_text.success_message}
      </p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-green-800 text-sm">
          La escuela recibirá un correo electrónico con tus resultados y podrá escuchar tu grabación.
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
        Intentar de Nuevo
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