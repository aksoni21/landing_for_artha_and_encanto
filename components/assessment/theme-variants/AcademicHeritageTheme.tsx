import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Upload, Play, Pause, BookOpen, Award } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { AssessmentFooter } from '../AssessmentFooter';
import { useAssessmentRecording } from '../../../hooks/useAssessmentRecording';

interface ThemeConfig {
  partner_id: string;
  name: string;
  language: string;
  branding: {
    logo_url: string;
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

export const AcademicHeritageTheme: React.FC<{ config: ThemeConfig }> = ({ config }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isRecording,
    recordingTime,
    recordedBlob,
    startRecording,
    stopRecording,
    resetRecording,
    canRecord,
    isMaxDurationReached,
    isMinDurationMet
  } = useAssessmentRecording({
    maxDuration: config.recording_duration.max_seconds,
    minDuration: config.recording_duration.min_seconds,
    onRecordingComplete: (audioBlob: Blob, duration: number) => {
      toast.success(`Assessment recorded successfully! Duration: ${duration} seconds`);
    },
    onError: (error: string) => {
      toast.error(error);
    }
  });

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{
      background: 'linear-gradient(135deg, #F7F3E9 0%, #E6D7B7 100%)',
      fontFamily: 'Open Sans, sans-serif'
    }}>
      <Toaster position="top-center" />

      {/* Academic Header with Crest */}
      <div className="flex-shrink-0 relative bg-white shadow-lg border-b-4" style={{ borderColor: config.branding.secondary_color }}>
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            {/* University-style Layout */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              {/* Crest/Logo with academic styling */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-xl border-4 bg-white"
                style={{
                  borderColor: config.branding.secondary_color
                }}
              >
                <img
                  src={config.branding.logo_url}
                  alt="Logo"
                  className="h-12 w-auto"
                />
              </div>

              {/* Academic Title */}
              <h1
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: 'Crimson Text, serif',
                  color: config.branding.primary_color
                }}
              >
                {config.ui_text.welcome_title}
              </h1>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-px" style={{ backgroundColor: config.branding.secondary_color }}></div>
                <BookOpen size={16} style={{ color: config.branding.secondary_color }} />
                <div className="w-8 h-px" style={{ backgroundColor: config.branding.secondary_color }}></div>
              </div>

              <p className="text-lg text-gray-700 font-medium">
                {config.ui_text.welcome_subtitle}
              </p>

              <p className="text-xs text-gray-600 mt-1 italic">
                Department of Language Assessment
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Academic Layout with Sidebar */}
      <div className="flex-1 container mx-auto px-4 py-6 min-h-0">
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-full">

          {/* Academic Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Assessment Guidelines */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: config.branding.secondary_color }}>
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} style={{ color: config.branding.secondary_color }} />
                <h3 className="font-bold text-lg" style={{ color: config.branding.primary_color }}>
                  Assessment Guidelines
                </h3>
              </div>

              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: config.branding.secondary_color }}>•</span>
                  <span>Speak clearly and naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: config.branding.secondary_color }}>•</span>
                  <span>Duration: 30-60 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: config.branding.secondary_color }}>•</span>
                  <span>Use conversational Spanish</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: config.branding.secondary_color }}>•</span>
                  <span>Choose any familiar topic</span>
                </li>
              </ul>
            </div>

            {/* Academic Credentials */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold mb-3" style={{ color: config.branding.primary_color }}>
                Certified Assessment
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                This assessment follows established academic standards for Spanish language proficiency evaluation.
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Evaluated by qualified instructors
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Assessment Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            {/* Formal Assessment Card */}
            <div className="bg-white rounded-lg shadow-xl border-2" style={{ borderColor: config.branding.secondary_color }}>

              {/* Academic Header */}
              <div
                className="px-8 py-6 border-b"
                style={{ backgroundColor: `${config.branding.primary_color}10` }}
              >
                <h2
                  className="text-2xl font-bold text-center"
                  style={{
                    fontFamily: 'Crimson Text, serif',
                    color: config.branding.primary_color
                  }}
                >
                  Oral Assessment Module
                </h2>

                <div className="flex justify-center mt-3">
                  <div
                    className="px-4 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: isRecording ? '#fee2e2' : `${config.branding.secondary_color}20`,
                      color: isRecording ? '#dc2626' : config.branding.secondary_color
                    }}
                  >
                    {isRecording ? 'Session Active' : 'Ready to Begin'}
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Academic Instructions */}
                <div className="text-center mb-8">
                  <p className="text-gray-700 leading-relaxed max-w-xl mx-auto">
                    {config.ui_text.recording_instructions}
                  </p>
                </div>

                {/* Formal Recording Interface */}
                <div className="flex flex-col items-center space-y-6">

                  {/* Academic-style Recording Button */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={!canRecord && !isRecording}
                      className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold shadow-2xl border-4 border-white transition-all duration-300"
                      style={{
                        backgroundColor: isRecording ? '#dc2626' : config.branding.primary_color
                      }}
                    >
                      {isRecording ? <Square size={32} /> : <Mic size={32} />}
                    </motion.button>

                    {/* Academic Progress Ring */}
                    {recordingTime > 0 && (
                      <svg className="absolute inset-0 w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke={config.branding.secondary_color}
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(recordingTime / config.recording_duration.max_seconds) * 314} 314`}
                          className="transition-all duration-300"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Academic Status Display */}
                  <div className="text-center">
                    <p className="text-lg font-semibold" style={{ color: config.branding.primary_color }}>
                      {isRecording ? 'Recording in Progress' : 'Assessment Ready'}
                    </p>
                    {recordingTime > 0 && (
                      <p className="text-sm text-gray-600">
                        Duration: {recordingTime} seconds
                      </p>
                    )}
                  </div>

                  {/* Academic Action Buttons */}
                  {recordedBlob && (
                    <div className="flex gap-4 pt-6">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center gap-2 px-6 py-3 border-2 rounded-lg font-semibold transition-all"
                        style={{
                          borderColor: config.branding.secondary_color,
                          color: config.branding.secondary_color
                        }}
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        Review Recording
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setIsSubmitting(true)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
                        style={{ backgroundColor: config.branding.primary_color }}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Upload size={18} />
                        )}
                        Submit for Evaluation
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AssessmentFooter variant="light" />
    </div>
  );
};