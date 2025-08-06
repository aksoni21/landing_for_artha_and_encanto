// =====================================================
// AUDIO ANALYSIS CONFIGURATION
// =====================================================
// This configuration leverages existing STT services from the brains folder

export const audioAnalysisConfig = {
  // Audio upload constraints
  upload: {
    maxFileSizeMB: 50,
    maxDurationMinutes: 15,
    supportedFormats: ['mp3', 'wav', 'm4a', 'webm', 'ogg', 'mp4'],
    sampleRate: 16000,
    channels: 1,
  },

  // STT service configuration (using existing OpenAI Whisper)
  stt: {
    service: 'openai-whisper',
    model: 'whisper-1',
    // Language can be auto-detected or specified
    language: null, // null for auto-detect, or 'en', 'es', etc.
  },

  // Processing configuration
  processing: {
    // Use existing Supabase storage
    storageUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    storageBucket: 'audio-recordings',
    
    // Queue settings (can be implemented with Supabase functions)
    maxConcurrentJobs: 3,
    processingTimeout: 300000, // 5 minutes
  },

  // Analysis features
  features: {
    grammar: true,
    vocabulary: true,
    fluency: true,
    pronunciation: true,
    discourse: true,
  },

  // CEFR level thresholds (can be adjusted based on testing)
  cefrThresholds: {
    A1: { min: 0, max: 20 },
    A2: { min: 21, max: 40 },
    B1: { min: 41, max: 60 },
    B2: { min: 61, max: 80 },
    C1: { min: 81, max: 95 },
    C2: { min: 96, max: 100 },
  },
};

// Helper function to get existing OpenAI API key
export function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }
  return key;
}

// Helper to connect to existing Whisper service
export async function transcribeWithWhisper(audioBuffer: Buffer, language?: string) {
  // This will use the existing OpenAI Whisper setup from brains
  // Implementation will call the existing bot services or create a simple wrapper
  const apiKey = getOpenAIKey();
  
  // Use the OpenAI API directly or integrate with existing pipecat services
  const formData = new FormData();
  const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
  formData.append('file', audioBlob, 'audio.wav');
  formData.append('model', 'whisper-1');
  if (language) {
    formData.append('language', language);
  }
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });
  
  return response.json();
}