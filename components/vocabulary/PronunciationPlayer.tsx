import React, { useState } from 'react';

interface PronunciationPlayerProps {
  word: string;
  pronunciation?: string;
  audioUrl?: string;
}

const PronunciationPlayer: React.FC<PronunciationPlayerProps> = ({ 
  word, 
  pronunciation, 
  audioUrl 
}) => {
  // Debug logging
  console.log('🔊 PronunciationPlayer props:', { word, pronunciation, audioUrl });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const playAudio = async () => {
    if (!audioUrl) return;
    
    setIsPlaying(true);
    setAudioError(false);
    
    try {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setAudioError(true);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
      setAudioError(true);
    }
  };

  // Always show as a "Possible Feature" even if no data is available yet

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center">
        🔊 Pronunciation (Possible Feature)
      </h4>
      
      <div className="space-y-2">
        {pronunciation ? (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-purple-600 font-medium">IPA:</span>
            <span className="text-purple-800 font-mono text-sm bg-white px-2 py-1 rounded border">
              {pronunciation}
            </span>
          </div>
        ) : (
          <div className="text-sm text-purple-600 bg-white p-2 rounded border">
            <strong>📝 Demo:</strong> /vəˈluːmɪnəs/ (example pronunciation)
          </div>
        )}
        
        {audioUrl ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isPlaying 
                  ? 'bg-purple-200 text-purple-600 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Playing...</span>
                </>
              ) : (
                <>
                  <span>🔊</span>
                  <span>Play Audio</span>
                </>
              )}
            </button>
            
            {audioError && (
              <span className="text-xs text-red-500">Audio unavailable</span>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              disabled
              className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              <span>🔊</span>
              <span>Audio Coming Soon</span>
            </button>
          </div>
        )}
        
        <div className="text-xs text-purple-600 bg-white p-2 rounded border">
          <strong>Webster Audio:</strong> Professional pronunciation from Merriam-Webster Dictionary
        </div>
      </div>
    </div>
  );
};

export default PronunciationPlayer;