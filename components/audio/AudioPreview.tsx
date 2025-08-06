import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AudioPreviewProps {
  audioUrl: string;
  fileName?: string;
  onAnalyze?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  audioUrl,
  fileName,
  onAnalyze,
  onRemove,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Failed to load audio file');
      setIsLoaded(false);
    };

    const handleLoadStart = () => {
      setIsLoaded(false);
      setError(null);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Load the audio
    audio.src = audioUrl;

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        toast.error('Unable to play audio');
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !isLoaded) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value);
    
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;
    
    const newTime = Math.min(audio.currentTime + 10, duration);
    audio.currentTime = newTime;
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;
    
    const newTime = Math.max(audio.currentTime - 10, 0);
    audio.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
    if (volume < 0.5) return 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
    return 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
  };

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Audio Load Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          {onRemove && (
            <motion.button
              onClick={onRemove}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove File
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Audio Preview</h3>
          {fileName && (
            <p className="text-sm text-gray-600 truncate max-w-xs" title={fileName}>
              {fileName}
            </p>
          )}
        </div>
        {onRemove && (
          <motion.button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Remove file"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </motion.button>
        )}
      </div>

      {!isLoaded ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading audio...</span>
        </div>
      ) : (
        <>
          {/* Waveform Visualization Placeholder */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 h-16">
              {Array.from({ length: 40 }, (_, i) => (
                <motion.div
                  key={i}
                  className="bg-blue-400 rounded-full"
                  style={{
                    width: '3px',
                    height: `${Math.random() * 60 + 10}px`,
                    opacity: i / 40 <= getProgressPercentage() / 100 ? 1 : 0.3,
                  }}
                  animate={{
                    height: isPlaying ? `${Math.random() * 60 + 10}px` : undefined,
                    opacity: i / 40 <= getProgressPercentage() / 100 ? 1 : 0.3,
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

          {/* Progress Bar */}
          <div className="mb-4">
            <div
              ref={progressRef}
              className="w-full bg-gray-200 rounded-full h-2 cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                style={{ width: `${getProgressPercentage()}%` }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Progress Handle */}
              <motion.div
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-lg transform -translate-y-1/2 cursor-grab"
                style={{ left: `calc(${getProgressPercentage()}% - 8px)` }}
                animate={{ left: `calc(${getProgressPercentage()}% - 8px)` }}
                whileDrag={{ scale: 1.2, cursor: 'grabbing' }}
              />
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Skip Backward */}
            <motion.button
              onClick={skipBackward}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Skip backward 10s"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
              </svg>
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
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </motion.button>

            {/* Skip Forward */}
            <motion.button
              onClick={skipForward}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Skip forward 10s"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
              </svg>
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d={getVolumeIcon()}/>
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onAnalyze && (
              <motion.button
                onClick={onAnalyze}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Start Analysis
              </motion.button>
            )}
            
            {onRemove && (
              <motion.button
                onClick={onRemove}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Remove
              </motion.button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPreview;