import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Upload, Play, Pause, CheckCircle, AlertCircle, Waves } from 'lucide-react';
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

export const ModernTropicalTheme: React.FC<{ config: ThemeConfig }> = ({ config }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFF3E2 0%, #1ABC9C 50%, #004E89 100%)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <Toaster position="top-center" />

      {/* Floating Header - Modern Style */}
      <div className="relative pt-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <img
                  src={config.branding.logo_url}
                  alt="Logo"
                  className="h-auto w-auto"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: config.branding.primary_color }}>
                  {config.ui_text.welcome_title}
                </h1>
                {/* <p className="text-gray-600">{config.ui_text.welcome_subtitle}</p> */}
              </div>
            </div>

            {/* Tropical Wave Decoration */}
            <div className="hidden md:block">
              <Waves size={40} style={{ color: config.branding.secondary_color }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Split Layout - Modern Tropical */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Left Side - Instructions */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Glass Card for Instructions */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6" style={{ color: config.branding.primary_color }}>
                Ready to Start?
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: config.branding.secondary_color }}
                  >
                    1
                  </div>
                  <p className="text-gray-700">Click the record button when ready</p>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: config.branding.secondary_color }}
                  >
                    2
                  </div>
                  <p className="text-gray-700">Speak in Spanish for 30-60 seconds</p>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: config.branding.secondary_color }}
                  >
                    3
                  </div>
                  <p className="text-gray-700">Review and submit your assessment</p>
                </div>
              </div>

              {/* Tropical Plant Decoration */}
              <div className="mt-8 flex justify-center">
                <div className="w-full h-2 rounded-full" style={{
                  background: `linear-gradient(90deg, ${config.branding.secondary_color}, ${config.branding.accent_color}, ${config.branding.secondary_color})`
                }}></div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Recording Interface */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Modern Recording Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">

              {/* Status Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: isRecording ? '#ff6b6b20' : `${config.branding.secondary_color}20`,
                    color: isRecording ? '#ff6b6b' : config.branding.secondary_color
                  }}
                >
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  {isRecording ? 'Recording in Progress' : 'Ready to Record'}
                </motion.div>
              </div>

              {/* Modern Recording Button */}
              <div className="flex justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRecording(!isRecording)}
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300"
                  style={{
                    backgroundColor: isRecording ? '#ff6b6b' : config.branding.primary_color,
                    transform: isRecording ? 'rotate(45deg)' : 'rotate(0deg)'
                  }}
                >
                  {isRecording ? <Square size={32} /> : <Mic size={32} />}
                </motion.button>
              </div>

              {/* Wave Animation */}
              {isRecording && (
                <div className="flex justify-center mb-6">
                  <div className="flex items-end gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [0.5, 1.5, 0.5] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: i * 0.1
                        }}
                        className="w-2 rounded-full"
                        style={{
                          backgroundColor: config.branding.secondary_color,
                          height: '20px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Modern Progress */}
              {recordingTime > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{recordingTime}s</span>
                    <span>{config.recording_duration.max_seconds}s</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(recordingTime / config.recording_duration.max_seconds) * 100}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.branding.secondary_color }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons - Modern Style */}
              {recordedBlob && (
                <div className="flex gap-3">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold transition-all"
                    style={{
                      borderColor: config.branding.secondary_color,
                      color: config.branding.secondary_color
                    }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'Pause' : 'Preview'}
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsSubmitting(true)}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all"
                    style={{ backgroundColor: config.branding.primary_color }}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Upload size={18} />
                    )}
                    Submit
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};