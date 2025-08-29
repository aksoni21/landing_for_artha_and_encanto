// -----storytime feature additions-----
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Story, StorySession } from '../../services/storytime_storyService';
import storyService from '../../services/storytime_storyService';

interface StoryAudioPlayerProps {
  story: Story;
  audioUrl: string;
  transcript: string;
  userId: string;
  onTextHighlight: (position: number) => void;
  onProgressUpdate?: (progress: { completion_percentage: number; time_spent: number }) => void;
}

interface TextSegment {
  text: string;
  startTime: number;
  endTime: number;
  index: number;
}

const StoryAudioPlayer: React.FC<StoryAudioPlayerProps> = ({
  story,
  audioUrl,
  transcript,
  userId,
  onTextHighlight,
  onProgressUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [highlightedSegment, setHighlightedSegment] = useState<number>(-1);
  const [currentSession, setCurrentSession] = useState<StorySession | null>(null);
  const [textSegments, setTextSegments] = useState<TextSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Initialize listening session
  useEffect(() => {
    const startSession = async () => {
      try {
        const session = await storyService.createSession(
          story.id,
          'listening',
          userId,
          { device: 'web', timestamp: new Date().toISOString() }
        );
        setCurrentSession(session);
        startTimeRef.current = new Date();
      } catch (error) {
        console.error('Failed to start listening session:', error);
      }
    };

    startSession();
  }, [story.id, userId]);

  // Parse transcript into timed segments (simplified version)
  useEffect(() => {
    // In a real implementation, this would parse actual timed transcript data
    // For now, we'll create approximate segments based on text length
    const words = transcript.split(/\s+/);
    const wordsPerSecond = 2.5; // Average speaking rate
    const segments: TextSegment[] = [];
    
    let currentTime = 0;
    const wordsPerSegment = 10;
    
    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segmentWords = words.slice(i, i + wordsPerSegment);
      const segmentText = segmentWords.join(' ');
      const segmentDuration = segmentWords.length / wordsPerSecond;
      
      segments.push({
        text: segmentText,
        startTime: currentTime,
        endTime: currentTime + segmentDuration,
        index: segments.length
      });
      
      currentTime += segmentDuration;
    }
    
    setTextSegments(segments);
  }, [transcript]);

  // Handle audio metadata load
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  // Update current time and highlight text
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      
      // Find and highlight current segment
      const activeSegment = textSegments.findIndex(
        segment => current >= segment.startTime && current < segment.endTime
      );
      
      if (activeSegment !== highlightedSegment) {
        setHighlightedSegment(activeSegment);
        onTextHighlight(activeSegment);
      }
      
      // Update progress
      const progressPercentage = (current / audioRef.current.duration) * 100;
      if (onProgressUpdate && startTimeRef.current) {
        const timeSpent = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        onProgressUpdate({
          completion_percentage: Math.round(progressPercentage),
          time_spent: timeSpent
        });
      }
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle playback rate change
  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle audio ended
  const handleAudioEnded = async () => {
    setIsPlaying(false);
    
    // Update session as completed
    if (currentSession && startTimeRef.current) {
      const timeSpent = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
      try {
        await storyService.updateSession(currentSession.id, {
          completion_percentage: 100,
          time_spent: timeSpent,
          completed: true
        });
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSession && startTimeRef.current) {
        const timeSpent = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
        
        storyService.updateSession(currentSession.id, {
          completion_percentage: Math.round(progressPercentage),
          time_spent: timeSpent,
          completed: false
        });
      }
    };
  }, [currentSession, currentTime, duration]);

  return (
    <div className="story-audio-player bg-white shadow-lg rounded-lg p-6">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        preload="metadata"
      />

      {/* Transcript Display with Highlighting */}
      <div className="transcript-container mb-6 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
        <h3 className="font-semibold mb-2">Follow Along:</h3>
        <div className="transcript-text">
          {textSegments.map((segment, index) => (
            <span
              key={index}
              className={`transcript-segment ${index === highlightedSegment ? 'highlighted' : ''}`}
            >
              {segment.text}{' '}
            </span>
          ))}
        </div>
      </div>

      {/* Main Controls */}
      <div className="audio-controls">
        {/* Progress Bar */}
        <div className="progress-section mb-4">
          <div
            ref={progressBarRef}
            className="progress-bar-container bg-gray-300 h-2 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="progress-bar bg-blue-500 h-full rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="time-display flex justify-between text-sm text-gray-600 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="playback-controls flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => skip(-10)}
            className="control-button p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            title="Skip back 10s"
          >
            ⏪ 10s
          </button>

          <button
            onClick={togglePlayPause}
            className="play-pause-button p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
          </button>

          <button
            onClick={() => skip(10)}
            className="control-button p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            title="Skip forward 10s"
          >
            10s ⏩
          </button>
        </div>

        {/* Speed and Volume Controls */}
        <div className="advanced-controls flex items-center justify-between">
          {/* Speed Control */}
          <div className="speed-control flex items-center gap-2">
            <span className="text-sm font-medium">Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1.0}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2.0}>2.0x</option>
            </select>
          </div>

          {/* Volume Control */}
          <div className="volume-control flex items-center gap-2">
            <span className="text-sm font-medium">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Listening Tips */}
      <div className="listening-tips mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Listening Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Follow along with the highlighted text</li>
          <li>• Adjust playback speed for your comfort level</li>
          <li>• Use the skip buttons to replay difficult sections</li>
          <li>• Try listening without reading first, then with the text</li>
        </ul>
      </div>

      <style jsx>{`
        .transcript-segment {
          transition: all 0.3s ease;
        }
        
        .transcript-segment.highlighted {
          background-color: #fde047;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 600;
        }
        
        .transcript-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .transcript-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .transcript-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .transcript-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default StoryAudioPlayer;