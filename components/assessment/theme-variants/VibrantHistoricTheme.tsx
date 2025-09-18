import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Upload, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FDEBD0 0%, #F39C12 50%, #D35400 100%)',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      <Toaster position="top-center" />

      {/* Colonial Architecture Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center mb-6"
          >
            <div className="bg-white rounded-full p-4 shadow-2xl">
              <img
                src={config.branding.logo_url}
                alt="Logo"
                className="h-16 w-auto"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Playfair Display, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            {config.ui_text.welcome_title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-orange-100 font-medium"
          >
            {config.ui_text.welcome_subtitle}
          </motion.p>
        </div>

        {/* Decorative Colonial Arches */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white opacity-20 rounded-t-full"></div>
      </div>

      {/* Main Assessment Card - Historic Style */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Ornate Border Card */}
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              border: `4px solid ${config.branding.primary_color}`,
              borderStyle: 'double'
            }}
          >
            {/* Decorative Header */}
            <div
              className="h-4"
              style={{ background: `linear-gradient(90deg, ${config.branding.primary_color}, ${config.branding.secondary_color}, ${config.branding.primary_color})` }}
            ></div>

            <div className="p-8">
              {/* Instructions with Colonial Styling */}
              <div className="text-center mb-8">
                <div
                  className="inline-block p-4 rounded-lg mb-6"
                  style={{ backgroundColor: config.branding.accent_color }}
                >
                  <p className="text-gray-700 leading-relaxed max-w-md">
                    {config.ui_text.recording_instructions}
                  </p>
                </div>
              </div>

              {/* Recording Interface - Circular Historic Design */}
              <div className="flex flex-col items-center space-y-6">
                {/* Large Circular Recording Button */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRecording(!isRecording)}
                    className="relative w-32 h-32 rounded-full shadow-2xl border-4 border-white flex items-center justify-center font-bold text-white transition-all duration-300"
                    style={{
                      backgroundColor: isRecording ? '#e74c3c' : config.branding.primary_color,
                      boxShadow: `0 0 30px ${isRecording ? '#e74c3c' : config.branding.primary_color}40`
                    }}
                  >
                    {isRecording ? <Square size={40} /> : <Mic size={40} />}
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
                  <p className="text-lg font-semibold" style={{ color: config.branding.primary_color }}>
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
                      className="h-3 rounded-full border-2"
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
                <div className="flex gap-4 mt-8">
                  {recordedBlob && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full border-2 font-semibold transition-all"
                      style={{
                        borderColor: config.branding.secondary_color,
                        color: config.branding.secondary_color,
                        backgroundColor: 'white'
                      }}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
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
                      className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all"
                      style={{ backgroundColor: config.branding.primary_color }}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <Upload size={20} />
                      )}
                      {isSubmitting ? 'Submitting...' : config.ui_text.submit_button}
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
    </div>
  );
};