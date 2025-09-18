import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Upload, Play, Pause, CheckCircle } from 'lucide-react';
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

export const MinimalistElegantTheme: React.FC<{ config: ThemeConfig }> = ({ config }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Toaster position="top-center" />

      {/* Minimal Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-6">
              <img
                src={config.branding.logo_url}
                alt="Logo"
                className="h-16 w-auto"
              />
              <div className="text-center">
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Lora, serif', color: config.branding.primary_color }}>
                  {config.ui_text.welcome_title}
                </h1>
                <p className="text-gray-600 mt-1">{config.ui_text.welcome_subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Centered Layout */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">

          {/* Elegant Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Lora, serif' }}>
                Assessment Instructions
              </h2>
              <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
                {config.ui_text.recording_instructions}
              </p>
            </div>
          </motion.div>

          {/* Minimalist Recording Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border"
          >

            {/* Clean Status Bar */}
            <div className="border-b border-gray-100 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium text-gray-600">
                    {isRecording ? 'Recording' : 'Ready'}
                  </span>
                </div>
                {recordingTime > 0 && (
                  <span className="text-sm text-gray-500">
                    {recordingTime}s / {config.recording_duration.max_seconds}s
                  </span>
                )}
              </div>
            </div>

            <div className="p-8">
              {/* Simple Recording Button */}
              <div className="flex flex-col items-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsRecording(!isRecording)}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 mx-auto"
                  style={{
                    backgroundColor: isRecording ? '#ef4444' : config.branding.primary_color
                  }}
                >
                  {isRecording ? <Square size={24} /> : <Mic size={24} />}
                </motion.button>

                <p className="mt-4 text-sm text-gray-600 text-center">
                  {isRecording ? 'Click to stop recording' : 'Click to start recording'}
                </p>
              </div>

              {/* Clean Progress Bar */}
              {recordingTime > 0 && (
                <div className="mb-8">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(recordingTime / config.recording_duration.max_seconds) * 100}%` }}
                      className="h-full bg-black transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Minimal Action Buttons */}
              {recordedBlob && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-center"
                >
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    <span className="font-medium">{isPlaying ? 'Pause' : 'Preview'}</span>
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsSubmitting(true)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all"
                    style={{ backgroundColor: config.branding.secondary_color }}
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
                    <span>{isSubmitting ? 'Submitting' : 'Submit Assessment'}</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Elegant Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-8 h-px bg-gray-300"></div>
              <span>Secure & Confidential</span>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};