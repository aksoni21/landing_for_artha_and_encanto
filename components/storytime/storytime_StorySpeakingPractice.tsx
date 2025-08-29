// -----storytime feature additions-----
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story, StorySession } from '../../services/storytime_storyService';
import storyService from '../../services/storytime_storyService';
import { AudioRecorder } from '../audio/AudioRecorder';
import { AudioPreview } from '../audio/AudioPreview';
import audioAnalysisService from '../../services/audioAnalysisService';

type SpeakingActivity = 'retelling' | 'summary' | 'discussion' | 'pronunciation' | 'shadowing';

interface StorySpeakingPracticeProps {
  story: Story;
  activity: SpeakingActivity;
  userId: string;
  onRecordingComplete: (audioBlob: Blob, activityType: string) => void;
  onProgressUpdate?: (progress: { completion_percentage: number; time_spent: number }) => void;
}

interface SpeakingPrompt {
  id: string;
  activity: SpeakingActivity;
  title: string;
  instruction: string;
  tips: string[];
  targetDuration: number; // in seconds
  difficultyAdjustment?: string;
}

const StorySpeakingPractice: React.FC<StorySpeakingPracticeProps> = ({
  story,
  activity,
  userId,
  onRecordingComplete,
  onProgressUpdate
}) => {
  const [currentSession, setCurrentSession] = useState<StorySession | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<SpeakingActivity>(activity);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [practiceStartTime, setPracticeStartTime] = useState<Date | null>(null);

  // Speaking prompts based on story content and difficulty
  const speakingPrompts: Record<SpeakingActivity, SpeakingPrompt> = {
    retelling: {
      id: 'retelling',
      activity: 'retelling',
      title: 'Story Retelling',
      instruction: `Retell the story "${story.title}" in your own words. Include the main events, characters, and the conclusion.`,
      tips: [
        'Start with "This story is about..."',
        'Use past tense for most of the narration',
        'Include key events in chronological order',
        'Don\'t worry about getting every detail - focus on the main story'
      ],
      targetDuration: Math.max(120, Math.min(300, (story.estimated_reading_time || 5) * 30))
    },
    summary: {
      id: 'summary',
      activity: 'summary',
      title: 'Story Summary',
      instruction: `Provide a concise summary of "${story.title}". Focus on the main idea, key characters, and the most important events.`,
      tips: [
        'Keep it brief but complete',
        'Identify the main theme or moral',
        'Mention only the most important characters',
        'Use your own words, not exact quotes from the story'
      ],
      targetDuration: Math.max(60, Math.min(180, (story.estimated_reading_time || 3) * 20))
    },
    discussion: {
      id: 'discussion',
      activity: 'discussion',
      title: 'Story Discussion',
      instruction: `Share your thoughts about "${story.title}". What did you think about it? What was the main message? Would you recommend it to others?`,
      tips: [
        'Express your personal opinion',
        'Explain why you liked or disliked certain parts',
        'Connect the story to your own experiences',
        'Discuss what you learned from the story'
      ],
      targetDuration: Math.max(90, Math.min(240, (story.estimated_reading_time || 4) * 25))
    },
    pronunciation: {
      id: 'pronunciation',
      activity: 'pronunciation',
      title: 'Pronunciation Practice',
      instruction: 'Read key sentences from the story aloud, focusing on clear pronunciation and natural rhythm.',
      tips: [
        'Speak slowly and clearly',
        'Pay attention to word stress',
        'Use natural intonation patterns',
        'Pause at commas and periods'
      ],
      targetDuration: 120
    },
    shadowing: {
      id: 'shadowing',
      activity: 'shadowing',
      title: 'Audio Shadowing',
      instruction: story.audio_url 
        ? 'Listen to the story audio and repeat what you hear, trying to match the speaker\'s pace and intonation.'
        : 'This activity requires audio. Please select a different speaking practice.',
      tips: [
        'Don\'t worry about perfect accuracy',
        'Focus on rhythm and intonation',
        'Start slow, then try to match the pace',
        'It\'s okay to pause and repeat difficult parts'
      ],
      targetDuration: Math.max(180, (story.audio_duration || 300))
    }
  };

  // Initialize speaking session
  useEffect(() => {
    const startSession = async () => {
      try {
        const session = await storyService.createSession(
          story.id,
          'speaking',
          userId,
          { 
            device: 'web', 
            activity: selectedActivity,
            timestamp: new Date().toISOString()
          }
        );
        setCurrentSession(session);
        setPracticeStartTime(new Date());
      } catch (error) {
        console.error('Failed to start speaking session:', error);
      }
    };

    startSession();
  }, [story.id, userId, selectedActivity]);

  const handleRecordingComplete = useCallback(async (audioBlob: Blob, duration: number) => {
    setRecordedAudio(audioBlob);
    
    // Create audio URL for preview
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);

    // Submit response to backend
    try {
      await storyService.submitStoryResponse(story.id, {
        response_type: selectedActivity,
        skill_type: 'speaking',
        audio_duration: duration
      });

      // Update session progress
      if (currentSession && practiceStartTime) {
        const timeSpent = Math.floor((new Date().getTime() - practiceStartTime.getTime()) / 1000);
        const targetDuration = speakingPrompts[selectedActivity].targetDuration;
        const completionPercentage = Math.min(100, Math.round((duration / targetDuration) * 100));
        
        await storyService.updateSession(currentSession.id, {
          completion_percentage: completionPercentage,
          time_spent: timeSpent,
          completed: completionPercentage >= 80
        });

        if (onProgressUpdate) {
          onProgressUpdate({
            completion_percentage: completionPercentage,
            time_spent: timeSpent
          });
        }
      }

      onRecordingComplete(audioBlob, selectedActivity);
    } catch (error) {
      console.error('Failed to submit speaking response:', error);
    }
  }, [selectedActivity, story.id, currentSession, practiceStartTime, onRecordingComplete, onProgressUpdate]);

  const handleAnalyzeAudio = async () => {
    if (!recordedAudio) return;

    setIsAnalyzing(true);
    try {
      // Use existing audio analysis service
      const analysis = await audioAnalysisService.analyzeAudio(
        recordedAudio,
        userId,
        {
          context: 'story_speaking_practice',
          story_id: story.id,
          activity: selectedActivity,
          story_title: story.title
        }
      );
      
      setAnalysisResults(analysis);
    } catch (error) {
      console.error('Audio analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentPrompt = speakingPrompts[selectedActivity];

  // Don't show shadowing if no audio available
  const availableActivities = story.audio_url 
    ? Object.keys(speakingPrompts) as SpeakingActivity[]
    : (Object.keys(speakingPrompts) as SpeakingActivity[]).filter(a => a !== 'shadowing');

  return (
    <div className="story-speaking-practice">
      {/* Activity Selection */}
      <div className="activity-selector bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Speaking Practice</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableActivities.map((activityType) => (
            <button
              key={activityType}
              onClick={() => {
                setSelectedActivity(activityType);
                setRecordedAudio(null);
                setAudioUrl('');
                setAnalysisResults(null);
                setShowPrompt(true);
              }}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedActivity === activityType
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {activityType === 'retelling' ? '📖' : 
                   activityType === 'summary' ? '📝' :
                   activityType === 'discussion' ? '💭' :
                   activityType === 'pronunciation' ? '🗣️' : '🎧'}
                </div>
                <div className="text-sm font-medium capitalize">
                  {activityType}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Practice Instructions */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="instruction-panel bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-blue-900">{currentPrompt.title}</h3>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
            
            <p className="text-blue-800 mb-4">{currentPrompt.instruction}</p>
            
            <div className="tips mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Tips for success:</h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                {currentPrompt.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            
            <div className="target-info flex items-center gap-4 text-sm text-blue-700">
              <span>⏱️ Target duration: {Math.floor(currentPrompt.targetDuration / 60)}:{(currentPrompt.targetDuration % 60).toString().padStart(2, '0')}</span>
              <span>📊 Difficulty: {storyService.mapDifficultyToCEFR(story.difficulty_level)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Shadowing Player (if activity is shadowing) */}
      {selectedActivity === 'shadowing' && story.audio_url && (
        <div className="shadowing-player bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3">Original Story Audio</h3>
          <audio controls className="w-full">
            <source src={story.audio_url} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
          <p className="text-sm text-gray-600 mt-2">
            Play the audio and repeat what you hear. Start recording when you're ready to practice.
          </p>
        </div>
      )}

      {/* Recording Section */}
      <div className="recording-section bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Record Your Response</h3>
          {!showPrompt && (
            <button
              onClick={() => setShowPrompt(true)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              📋 Show Instructions
            </button>
          )}
        </div>
        
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          maxDuration={Math.max(currentPrompt.targetDuration, 600)}
          className="mb-4"
        />
      </div>

      {/* Audio Preview and Analysis */}
      {recordedAudio && (
        <div className="audio-preview bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Your Recording</h3>
          
          <AudioPreview audioUrl={audioUrl} />
          
          <div className="analysis-section mt-6">
            <div className="flex gap-3">
              <button
                onClick={handleAnalyzeAudio}
                disabled={isAnalyzing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : '📊 Analyze Speech'}
              </button>
              
              <button
                onClick={() => {
                  setRecordedAudio(null);
                  setAudioUrl('');
                  setAnalysisResults(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                🔄 Record Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults && (
        <div className="analysis-results bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Speech Analysis Results</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="overall-score">
              <h4 className="font-semibold mb-2">Overall Performance</h4>
              <div className="score-circle">
                <div className="text-3xl font-bold text-blue-600">
                  {analysisResults.overall_score || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">
                  CEFR Level: {analysisResults.cefr_level || 'Unknown'}
                </div>
              </div>
            </div>
            
            <div className="detailed-metrics">
              <h4 className="font-semibold mb-2">Detailed Analysis</h4>
              <div className="space-y-2 text-sm">
                {analysisResults.fluency_score && (
                  <div className="flex justify-between">
                    <span>Fluency:</span>
                    <span className="font-medium">{analysisResults.fluency_score}/100</span>
                  </div>
                )}
                {analysisResults.pronunciation_score && (
                  <div className="flex justify-between">
                    <span>Pronunciation:</span>
                    <span className="font-medium">{analysisResults.pronunciation_score}/100</span>
                  </div>
                )}
                {analysisResults.vocabulary_score && (
                  <div className="flex justify-between">
                    <span>Vocabulary:</span>
                    <span className="font-medium">{analysisResults.vocabulary_score}/100</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {analysisResults.feedback && (
            <div className="feedback mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Feedback & Suggestions</h4>
              <p className="text-green-800">{analysisResults.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Practice Tips */}
      <div className="practice-tips mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">Speaking Practice Tips:</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Take your time to think before speaking</li>
          <li>• Focus on clarity over speed</li>
          <li>• Use the vocabulary from the story when possible</li>
          <li>• Record multiple attempts to track improvement</li>
          <li>• Listen to your recording to identify areas to work on</li>
        </ul>
      </div>
    </div>
  );
};

export default StorySpeakingPractice;