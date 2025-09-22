import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  audioUrl: string;
  onDownload?: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
      setError(null);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      setError('Failed to load audio file');
      setIsLoaded(false);
    };

    const handleLoadStart = () => {
      setIsLoaded(false);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    // Reset state
    setIsLoaded(false);
    setError(null);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Set source and load
    audio.src = audioUrl;
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log('No audio element');
      return;
    }
    if (!isLoaded) {
      console.log('Audio not loaded yet');
      return;
    }

    console.log('Toggle play/pause, currently playing:', isPlaying);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        console.log('Audio started playing');
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };


  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value);

    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }
  };


  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Audio Load Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />

      {!isLoaded ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading audio...</span>
        </div>
      ) : (
        <>
          {/* Waveform Visualization */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 h-12">
              {Array.from({ length: 30 }, (_, i) => (
                <motion.div
                  key={i}
                  className="bg-blue-400 rounded-full"
                  style={{
                    width: '3px',
                    height: `${Math.random() * 40 + 8}px`,
                    opacity: 0.3,
                  }}
                  animate={{
                    height: isPlaying ? `${Math.random() * 40 + 8}px` : undefined,
                    opacity: isPlaying ? 1 : 0.3,
                  }}
                  transition={{
                    duration: isPlaying ? 0.5 : 0,
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>
          </div>


          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Skip Backward */}
            <motion.button
              onClick={skipBackward}
              className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isLoaded}
              title="Skip back 10 seconds"
            >
                <text x="9" y="16" fontSize="8" fill="currentColor">-10s</text>
              
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              onClick={togglePlayPause}
              className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isLoaded}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </motion.button>

            {/* Skip Forward */}
            <motion.button
              onClick={skipForward}
              className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isLoaded}
              title="Skip forward 10 seconds"
            >
                <text x="9" y="16" fontSize="8" fill="currentColor">+10s</text>
            </motion.button>

            {/* Download Button */}
            {/* {onDownload && (
              <motion.button
                onClick={onDownload}
                className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Download audio"
              >
                <Download size={20} />
              </motion.button>
            )} */}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 min-w-[3rem]">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;