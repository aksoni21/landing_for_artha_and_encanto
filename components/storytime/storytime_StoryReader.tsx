// -----storytime feature additions-----
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Story, StorySession } from '../../services/storytime_storyService';
import storyService from '../../services/storytime_storyService';
import VocabularyPopup from './VocabularyPopup';
import vocabularyService, { VocabularyResult } from '../../services/vocabularyService';

interface StoryReaderProps {
  story: Story;
  userProgress: {
    overall_completion: number;
    skills_progress: {
      reading: number;
      listening: number;
      speaking: number;
      writing: number;
    };
    sessions_count: number;
  };
  userId: string;
  onProgressUpdate: (progress: {
    completion_percentage: number;
    time_spent: number;
  }) => void;
  onWordClick?: (word: string, sentence: string) => void;
}

const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  userProgress,
  userId,
  onProgressUpdate,
  onWordClick
}) => {
  const [currentSession, setCurrentSession] = useState<StorySession | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [vocabularyResult, setVocabularyResult] = useState<VocabularyResult | null>(null);
  const [showVocabularyPopup, setShowVocabularyPopup] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | undefined>(undefined);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start a reading session when component mounts
  useEffect(() => {
    const startSession = async () => {
      // Skip session creation if no user is logged in
      if (!userId) {
        console.log('📖 No user logged in, skipping session creation for story reading');
        setIsReading(true);
        startTimeRef.current = new Date();
        
        // Start tracking time for anonymous reading
        intervalRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
            setElapsedTime(elapsed);
          }
        }, 1000);
        return;
      }

      try {
        const session = await storyService.createSession(
          story.id,
          'reading',
          userId,
          { device: 'web', timestamp: new Date().toISOString() }
        );
        setCurrentSession(session);
        setIsReading(true);
        startTimeRef.current = new Date();
        
        // Start tracking time
        intervalRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
            setElapsedTime(elapsed);
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to start reading session:', error);
        // Fall back to anonymous reading
        setIsReading(true);
        startTimeRef.current = new Date();
        intervalRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
            setElapsedTime(elapsed);
          }
        }, 1000);
      }
    };

    startSession();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (currentSession && startTimeRef.current && userId) {
        const finalTime = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        updateSessionProgress(readingProgress, finalTime, false);
      }
    };
  }, [story.id, userId]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
        setScrollPosition(scrollTop);
        setReadingProgress(progress);
        
        // Update parent component
        onProgressUpdate({
          completion_percentage: progress,
          time_spent: elapsedTime
        });
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [elapsedTime, onProgressUpdate]);

  // Update session progress periodically
  const updateSessionProgress = useCallback(async (
    progress: number,
    timeSpent: number,
    completed: boolean
  ) => {
    if (!currentSession) return;

    try {
      await storyService.updateSession(currentSession.id, {
        completion_percentage: progress,
        time_spent: timeSpent,
        completed
      });
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  }, [currentSession]);

  // Save progress every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isReading && currentSession && userId) {
        updateSessionProgress(readingProgress, elapsedTime, false);
      }
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [readingProgress, elapsedTime, isReading, currentSession, updateSessionProgress, userId]);

  // Handle word clicks for vocabulary lookup
  const handleWordClick = async (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('story-word')) {
      const word = target.textContent || '';
      const sentence = target.getAttribute('data-sentence') || '';
      
      // Store click position for popup positioning
      setClickPosition({ x: event.clientX, y: event.clientY });
      setHighlightedWord(word);
      
      try {
        // Show loading state
        setVocabularyResult(null);
        setShowVocabularyPopup(true);
        
        // Perform vocabulary lookup
        const result = await vocabularyService.lookupWord({
          word,
          paragraph: sentence,
          book_metadata: {
            title: story.title,
            author: story.author || 'Unknown',
            year: new Date().getFullYear().toString(),
            genre: story.genre || 'Fiction'
          },
          user_id: userId
        });
        
        setVocabularyResult(result);
        
        // Also call the original callback if provided
        if (onWordClick) {
          onWordClick(word, sentence);
        }
      } catch (error) {
        console.error('Vocabulary lookup failed:', error);
        setShowVocabularyPopup(false);
      }

      // Remove highlight after 2 seconds
      setTimeout(() => setHighlightedWord(null), 2000);
    }
  };

  // Close vocabulary popup
  const closeVocabularyPopup = () => {
    setShowVocabularyPopup(false);
    setVocabularyResult(null);
    setClickPosition(undefined);
  };

  // Process story content to make words clickable
  const processContent = (content: string) => {
    const sentences = content.split(/(?<=[.!?])\s+/);
    
    return sentences.map((sentence, sentIndex) => {
      const words = sentence.split(/\s+/);
      return (
        <span key={sentIndex} className="sentence">
          {words.map((word, wordIndex) => {
            // Extract the actual word without punctuation for lookup
            const cleanWord = word.replace(/[.,!?;:"]/g, '');
            const punctuation = word.match(/[.,!?;:"]/g)?.join('') || '';
            
            return (
              <React.Fragment key={`${sentIndex}-${wordIndex}`}>
                {wordIndex > 0 && ' '}
                <span
                  className={`story-word ${highlightedWord === cleanWord ? 'highlighted' : ''}`}
                  data-sentence={sentence}
                  onClick={handleWordClick}
                  style={{ cursor: 'pointer' }}
                >
                  {cleanWord}
                </span>
                {punctuation}
              </React.Fragment>
            );
          })}
          {' '}
        </span>
      );
    });
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Complete the reading session
  const completeReading = async () => {
    if (currentSession && userId) {
      await updateSessionProgress(100, elapsedTime, true);
    }
    setIsReading(false);
  };

  return (
    <div className="story-reader-container">
      {/* Reading Controls */}
      <div className="reading-controls bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
        <div className="font-controls flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">Font Size:</span>
            <input
              type="range"
              min="14"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-blue-900">{fontSize}px</span>
          </label>
              
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">Line Spacing:</span>
            <select
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="border rounded px-2 py-1 text-blue-500"  
            >
              <option value={1.4}>Tight</option>
              <option value={1.6}>Normal</option>
              <option value={1.8}>Relaxed</option>
              <option value={2.0}>Loose</option>
            </select>
          </label>
        </div>

        <div className="reading-stats flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium text-blue-900">Progress:</span>{' '}
            <span className="text-blue-600">{readingProgress}%</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-blue-900">Time:</span>{' '}
            <span className="text-blue-600">{formatTime(elapsedTime)}</span>
          </div>
          {readingProgress === 100 && (
            <button
              onClick={completeReading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Complete Reading
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container bg-gray-200 h-2 rounded-full mb-4">
        <div
          className="progress-bar bg-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Story Content */}
      <div className="story-content-wrapper bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-900">{story.title}</h1>
        {story.author && (
          <p className="text-gray-600 mb-6">By {story.author}</p>
        )}
        
        <div
          ref={contentRef}
          className="story-content prose prose-lg max-w-none prose-gray"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            maxHeight: '600px',
            overflowY: 'auto',
            color: '#1f2937' // Ensure dark gray text
          }}
        >
          {processContent(story.content)}
        </div>
      </div>

      {/* Reading Tips */}
      <div className="reading-tips mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Reading Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on any word to look up its definition</li>
          <li>• Your progress is saved automatically every 30 seconds</li>
          <li>• Adjust font size and line spacing for comfortable reading</li>
          <li>• Take your time - comprehension is more important than speed</li>
        </ul>
      </div>

      {/* Vocabulary Popup */}
      <VocabularyPopup
        result={vocabularyResult}
        isOpen={showVocabularyPopup}
        onClose={closeVocabularyPopup}
        position={clickPosition}
      />

      <style jsx>{`
        .story-word {
          color: #1f2937 !important;
        }
        
        .story-word:hover {
          background-color: #fef3c7;
          border-radius: 2px;
          padding: 0 2px;
          color: #1f2937 !important;
        }
        
        .story-word.highlighted {
          background-color: #fde047;
          border-radius: 2px;
          padding: 0 2px;
          font-weight: 600;
          color: #1f2937 !important;
        }
        
        .sentence {
          display: inline;
          color: #1f2937 !important;
        }
        
        .story-content::-webkit-scrollbar {
          width: 8px;
        }
        
        .story-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .story-content::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        .story-content::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default StoryReader;