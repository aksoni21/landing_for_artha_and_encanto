/**
 * Assessment Performance Configuration
 * Performance optimizations specific to assessment functionality
 */

export const assessmentPerformanceConfig = {
  // Audio recording optimizations
  audio: {
    sampleRate: 44100,
    bitRate: 128000,
    channels: 1, // Mono for voice
    format: 'webm',
    maxFileSizeMB: 10,
    compressionQuality: 0.8
  },

  // API timeouts for assessment operations
  timeouts: {
    recording: 65000, // Max recording time + buffer
    analysis: 30000,  // Audio analysis processing
    upload: 20000,    // File upload
    emailSend: 10000  // Email notification
  },

  // Caching strategies
  cache: {
    partnerConfig: 3600,    // 1 hour
    partnerAssets: 86400,   // 24 hours
    assessmentResults: 0,   // No cache for results
    apiResponses: 0         // No cache for API calls
  },

  // Bundle splitting for assessment components
  chunks: {
    assessment: [
      'components/assessment',
      'pages/assessment'
    ],
    audioProcessing: [
      'components/assessment/AssessmentAudioRecorder',
      'utils/audio'
    ]
  },

  // Resource hints for assessment pages
  preload: {
    fonts: [
      '/fonts/inter-var.woff2'
    ],
    images: [
      '/partners/casco-antiguo/logo.png',
      '/partners/casco-antiguo/background.jpg'
    ],
    scripts: [
      'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
    ]
  },

  // Critical CSS for assessment pages
  criticalCSS: {
    assessment: `
      .assessment-layout { min-height: 100vh; }
      .recording-button { transition: all 0.3s ease; }
      .progress-bar { width: 100%; height: 4px; }
    `
  }
};

export default assessmentPerformanceConfig;