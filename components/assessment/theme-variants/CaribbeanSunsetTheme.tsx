import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Upload, Play, Pause, Sun, Waves, Palmtree } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

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

export const CaribbeanSunsetTheme: React.FC<{ config: ThemeConfig }> = ({ config }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #F4A460 0%, #FF7F50 30%, #FF6347 60%, #4B0082 100%)',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <Toaster position="top-center" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-10 right-10 opacity-20"
        >
          <Sun size={60} className="text-yellow-300" />
        </motion.div>

        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute bottom-20 left-10 opacity-30"
        >
          <Palmtree size={40} className="text-green-400" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-32 right-20 opacity-30"
        >
          <Waves size={35} className="text-blue-300" />
        </motion.div>
      </div>

      {/* Dynamic Header */}
      <div className="relative z-10 pt-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="text-center"
          >
            {/* Vibrant Logo Container */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-2xl"
              style={{
                background: 'linear-gradient(45deg, #FFD700, #FF7F50, #FF1493)',
                padding: '3px'
              }}
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <img
                  src={config.branding.logo_url}
                  alt="Logo"
                  className="h-12 w-auto"
                />
              </div>
            </motion.div>

            {/* Energetic Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-white mb-3 drop-shadow-lg"
              style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.4)' }}
            >
              ¡Evalúa tu Español!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-yellow-100 font-bold mb-2"
            >
              {config.ui_text.welcome_subtitle}
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold"
            >
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              Caribbean Style Assessment
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Vibrant Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Energetic Instruction Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl border-4"
            style={{ borderColor: '#FFD700' }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4" style={{ color: config.branding.primary_color }}>
                🎤 Ready to Shine?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {config.ui_text.recording_instructions}
              </p>

              {/* Fun Progress Steps */}
              <div className="flex justify-center mt-6 gap-4">
                {['🎯', '🗣️', '✨'].map((emoji, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-3xl mb-2">{emoji}</div>
                    <div className="text-xs font-semibold text-gray-600">
                      {['Click', 'Speak', 'Submit'][index]}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Dynamic Recording Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl"
          >

            {/* Vibrant Status Display */}
            <div className="text-center mb-8">
              <motion.div
                animate={isRecording ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-lg shadow-lg"
                style={{
                  background: isRecording
                    ? 'linear-gradient(45deg, #ff4757, #ff6b6b)'
                    : 'linear-gradient(45deg, #32CD32, #00FF7F)',
                  color: 'white'
                }}
              >
                <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-white animate-ping' : 'bg-white'}`}></div>
                {isRecording ? '🔴 ¡Grabando!' : '🟢 ¡Listo!'}
              </motion.div>
            </div>

            {/* Spectacular Recording Button */}
            <div className="flex justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsRecording(!isRecording)}
                className="relative w-32 h-32 rounded-full flex items-center justify-center text-white font-bold shadow-2xl overflow-hidden"
                style={{
                  background: isRecording
                    ? 'linear-gradient(45deg, #ff4757, #ff3742)'
                    : 'linear-gradient(45deg, #FF7F50, #FF6347, #FF1493)'
                }}
              >
                {/* Animated Background */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, white, transparent)'
                  }}
                />

                <div className="relative z-10">
                  {isRecording ? <Square size={40} /> : <Mic size={40} />}
                </div>

                {/* Pulsing Ring */}
                {isRecording && (
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 border-4 border-white rounded-full"
                  />
                )}
              </motion.button>
            </div>

            {/* Colorful Progress Visualization */}
            {recordingTime > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex justify-between text-sm font-semibold mb-2" style={{ color: config.branding.primary_color }}>
                  <span>🎵 {recordingTime}s</span>
                  <span>🎯 {config.recording_duration.max_seconds}s</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: '#f0f0f0' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(recordingTime / config.recording_duration.max_seconds) * 100}%` }}
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #32CD32, #FFD700, #FF7F50, #FF1493)',
                      boxShadow: '0 0 10px rgba(255, 127, 80, 0.5)'
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Energetic Action Buttons */}
            {recordedBlob && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-white shadow-lg transition-all"
                  style={{ background: 'linear-gradient(45deg, #006994, #1e90ff)' }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Pausar' : '🎧 Escuchar'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSubmitting(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all"
                  style={{ background: 'linear-gradient(45deg, #32CD32, #00FF7F)' }}
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
                  {isSubmitting ? 'Enviando...' : '🚀 ¡Enviar!'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};