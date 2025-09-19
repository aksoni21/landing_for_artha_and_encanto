import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Upload, Play, Pause } from 'lucide-react';
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

export const VibrantHistoricTheme: React.FC<{ config: ThemeConfig }> = ({ config }) => {
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
      toast.success(`¡Evaluación completada! Duración: ${duration} segundos`);
    },
    onError: (error: string) => {
      toast.error(error);
    }
  });

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{
      background: 'linear-gradient(135deg, #FDEBD0 0%, #F39C12 50%, #D35400 100%)',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      <Toaster position="top-center" />

      {/* Colonial Architecture Header */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center py-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center mb-4"
          >
            <div className="bg-white rounded-full p-3 shadow-2xl">
              <img
                src={config.branding.logo_url}
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'Playfair Display, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            {config.ui_text.welcome_title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-orange-100 font-medium"
          >
            {config.ui_text.welcome_subtitle}
          </motion.p>
        </div>

        {/* Decorative Colonial Arches */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-white opacity-20 rounded-t-full"></div>
      </div>

      {/* Main Assessment Card - Historic Style */}
      <div className="flex-1 container mx-auto px-4 py-6 min-h-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto w-full"
        >
          {/* Ornate Border Card */}
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col"
            style={{
              border: `4px solid ${config.branding.primary_color}`,
              borderStyle: 'double'
            }}
          >
            {/* Decorative Header */}
            <div
              className="h-3"
              style={{ background: `linear-gradient(90deg, ${config.branding.primary_color}, ${config.branding.secondary_color}, ${config.branding.primary_color})` }}
            ></div>

            <div className="p-6 flex-1 flex flex-col justify-center">
              {/* Instructions with Colonial Styling */}
              <div className="text-center mb-6">
                <div
                  className="inline-block p-3 rounded-lg mb-4"
                  style={{ backgroundColor: config.branding.accent_color }}
                >
                  <p className="text-gray-700 leading-relaxed max-w-md text-sm">
                    {config.ui_text.recording_instructions}
                  </p>
                </div>
              </div>

              {/* Recording Interface - Circular Historic Design */}
              <div className="flex flex-col items-center space-y-4">
                {/* Large Circular Recording Button */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!canRecord && !isRecording}
                    className="relative w-24 h-24 rounded-full shadow-2xl border-4 border-white flex items-center justify-center font-bold text-white transition-all duration-300"
                    style={{
                      backgroundColor: isRecording ? '#e74c3c' : config.branding.primary_color,
                      boxShadow: `0 0 20px ${isRecording ? '#e74c3c' : config.branding.primary_color}40`
                    }}
                  >
                    {isRecording ? <Square size={28} /> : <Mic size={28} />}
                  </motion.button>

                  {/* Animated Recording Ring */}
                  {isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-full border-2 border-red-400 opacity-50"
                    />
                  )}
                </div>

                {/* Recording Status */}
                <div className="text-center">
                  <p className="text-base font-semibold" style={{ color: config.branding.primary_color }}>
                    {isRecording ? 'Recording...' : 'Ready to Record'}
                  </p>
                  {recordingTime > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {recordingTime}s recorded
                    </p>
                  )}
                </div>

                {/* Colonial-Style Progress Bar */}
                {recordingTime > 0 && (
                  <div className="w-full max-w-md">
                    <div
                      className="h-2 rounded-full border-2"
                      style={{ borderColor: config.branding.primary_color, backgroundColor: '#f3f3f3' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: config.branding.secondary_color,
                          width: `${(recordingTime / config.recording_duration.max_seconds) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons - Historic Style */}
                <div className="flex gap-3 mt-4">
                  {recordedBlob && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold transition-all text-sm"
                      style={{
                        borderColor: config.branding.secondary_color,
                        color: config.branding.secondary_color,
                        backgroundColor: 'white'
                      }}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </motion.button>
                  )}

                  {recordedBlob && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsSubmitting(true)}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white shadow-lg transition-all text-sm"
                      style={{ backgroundColor: config.branding.primary_color }}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <Upload size={16} />
                      )}
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Footer */}
            <div
              className="h-4"
              style={{ background: `linear-gradient(90deg, ${config.branding.primary_color}, ${config.branding.secondary_color}, ${config.branding.primary_color})` }}
            ></div>
          </div>
        </motion.div>
      </div>

      <AssessmentFooter variant="transparent" />
    </div>
  );
};