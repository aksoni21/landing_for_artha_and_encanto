// -----storytime feature additions-----
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story, StorySession } from '../../services/storytime_storyService';
import storyService from '../../services/storytime_storyService';

type WritingActivity = 'summary' | 'retelling' | 'analysis' | 'creative' | 'continuation' | 'perspective';

interface WritingPrompt {
  id: string;
  activity: WritingActivity;
  title: string;
  instruction: string;
  guidelines: string[];
  targetWordCount: number;
  timeLimit?: number; // in minutes
  scaffolding?: {
    starter?: string;
    structure?: string[];
    keyQuestions?: string[];
  };
}

interface StoryWritingWorkshopProps {
  story: Story;
  prompt: WritingPrompt | null;
  userId: string;
  onSubmit: (content: string, activityType: string, wordCount: number) => void;
  onProgressUpdate?: (progress: { completion_percentage: number; time_spent: number }) => void;
}

const StoryWritingWorkshop: React.FC<StoryWritingWorkshopProps> = ({
  story,
  prompt: initialPrompt,
  userId,
  onSubmit,
  onProgressUpdate
}) => {
  const [selectedActivity, setSelectedActivity] = useState<WritingActivity>(initialPrompt?.activity || 'summary');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSession, setCurrentSession] = useState<StorySession | null>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [startTime] = useState(new Date());
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate writing prompts based on story content and difficulty
  const writingPrompts: Record<WritingActivity, WritingPrompt> = {
    summary: {
      id: 'summary',
      activity: 'summary',
      title: 'Story Summary',
      instruction: `Write a clear and concise summary of "${story.title}". Include the main characters, key events, and the resolution.`,
      guidelines: [
        'Use your own words, not direct quotes',
        'Include only the most important events',
        'Write in present tense for summaries',
        'Keep it objective - focus on what happens, not your opinion'
      ],
      targetWordCount: Math.max(100, Math.min(300, (story.word_count || 500) / 5)),
      timeLimit: 15,
      scaffolding: {
        starter: 'This story is about...',
        structure: ['Introduction of characters and setting', 'Main conflict or problem', 'Key events', 'Resolution'],
        keyQuestions: ['Who are the main characters?', 'What is the main problem?', 'How is it resolved?']
      }
    },
    retelling: {
      id: 'retelling',
      activity: 'retelling',
      title: 'Story Retelling',
      instruction: `Retell "${story.title}" in your own words as if you're telling it to a friend. Include dialogue and descriptive details.`,
      guidelines: [
        'Use past tense for narration',
        'Include character dialogue where appropriate',
        'Add descriptive details to make it engaging',
        'Maintain the original story structure'
      ],
      targetWordCount: Math.max(200, Math.min(500, (story.word_count || 500) / 3)),
      timeLimit: 25,
      scaffolding: {
        starter: 'Let me tell you about an interesting story I read...',
        keyQuestions: ['What happened first?', 'How did the characters feel?', 'What was the most important moment?']
      }
    },
    analysis: {
      id: 'analysis',
      activity: 'analysis',
      title: 'Story Analysis',
      instruction: `Analyze "${story.title}". Discuss the theme, character development, and what you think the author's message is.`,
      guidelines: [
        'Support your opinions with examples from the text',
        'Consider the author\'s purpose and message',
        'Analyze character motivations and growth',
        'Discuss the significance of key events'
      ],
      targetWordCount: Math.max(250, Math.min(400, (story.word_count || 500) / 2)),
      timeLimit: 30,
      scaffolding: {
        structure: ['Theme identification', 'Character analysis', 'Author\'s message', 'Personal reflection'],
        keyQuestions: ['What is the main theme?', 'How do characters change?', 'What is the author trying to teach us?', 'Do you agree with the message?']
      }
    },
    creative: {
      id: 'creative',
      activity: 'creative',
      title: 'Creative Response',
      instruction: `Write a creative piece inspired by "${story.title}". This could be a poem, a different ending, or a scene from another character's perspective.`,
      guidelines: [
        'Be creative and original',
        'Stay connected to the original story',
        'Use descriptive language',
        'Show, don\'t just tell'
      ],
      targetWordCount: Math.max(150, Math.min(350, (story.word_count || 500) / 3)),
      timeLimit: 25,
      scaffolding: {
        keyQuestions: ['What if the story ended differently?', 'What was another character thinking?', 'What happened before or after the story?']
      }
    },
    continuation: {
      id: 'continuation',
      activity: 'continuation',
      title: 'Story Continuation',
      instruction: `Continue the story beyond where "${story.title}" ends. What happens next to the characters?`,
      guidelines: [
        'Maintain consistency with character personalities',
        'Keep the same writing style and tone',
        'Create logical consequences from the original ending',
        'Introduce new conflicts or developments'
      ],
      targetWordCount: Math.max(200, Math.min(400, (story.word_count || 500) / 3)),
      timeLimit: 30,
      scaffolding: {
        starter: 'After the events of the original story...',
        keyQuestions: ['What challenges might the characters face next?', 'How have they changed?', 'What new adventures await?']
      }
    },
    perspective: {
      id: 'perspective',
      activity: 'perspective',
      title: 'Different Perspective',
      instruction: `Rewrite a key scene from "${story.title}" from the perspective of a different character.`,
      guidelines: [
        'Consider how different characters would see events',
        'Use first person perspective ("I")',
        'Include the character\'s thoughts and feelings',
        'Show how their viewpoint changes the story'
      ],
      targetWordCount: Math.max(150, Math.min(300, (story.word_count || 500) / 4)),
      timeLimit: 20,
      scaffolding: {
        starter: 'From my perspective, what really happened was...',
        keyQuestions: ['How would this character feel?', 'What would they notice that others miss?', 'What are their motivations?']
      }
    }
  };

  // Initialize writing session
  useEffect(() => {
    const startSession = async () => {
      try {
        const session = await storyService.createSession(
          story.id,
          'writing',
          userId,
          {
            device: 'web',
            activity: selectedActivity,
            timestamp: new Date().toISOString()
          }
        );
        setCurrentSession(session);
      } catch (error) {
        console.error('Failed to start writing session:', error);
      }
    };

    startSession();
  }, [story.id, userId, selectedActivity]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setTimeSpent(elapsed);
      
      if (onProgressUpdate) {
        const currentPrompt = writingPrompts[selectedActivity];
        const progress = Math.min(100, Math.round((wordCount / currentPrompt.targetWordCount) * 100));
        onProgressUpdate({
          completion_percentage: progress,
          time_spent: elapsed
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, wordCount, selectedActivity, onProgressUpdate]);

  // Count words and auto-save
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    // Auto-save every 30 seconds
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (content.trim() && currentSession) {
        autoSave();
      }
    }, 30000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, currentSession]);

  const autoSave = async () => {
    if (!currentSession) return;

    setAutoSaveStatus('saving');
    try {
      await storyService.updateSession(currentSession.id, {
        completion_percentage: Math.min(100, Math.round((wordCount / writingPrompts[selectedActivity].targetWordCount) * 100)),
        time_spent: timeSpent,
        completed: false
      });
      setAutoSaveStatus('saved');
      
      // Clear status after 2 seconds
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // Submit to story service
      await storyService.submitStoryResponse(story.id, {
        response_type: selectedActivity,
        skill_type: 'writing',
        content: content.trim()
      });

      // Update session as completed
      if (currentSession) {
        await storyService.updateSession(currentSession.id, {
          completion_percentage: 100,
          time_spent: timeSpent,
          completed: true
        });
      }

      onSubmit(content.trim(), selectedActivity, wordCount);
    } catch (error) {
      console.error('Failed to submit writing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPrompt = writingPrompts[selectedActivity];
  const progressPercentage = Math.min(100, Math.round((wordCount / currentPrompt.targetWordCount) * 100));

  return (
    <div className="story-writing-workshop">
      {/* Activity Selection */}
      <div className="activity-selector bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Writing Workshop</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.keys(writingPrompts).map((activityType) => (
            <button
              key={activityType}
              onClick={() => {
                setSelectedActivity(activityType as WritingActivity);
                setContent('');
                setWordCount(0);
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
                  {activityType === 'summary' ? '📄' :
                   activityType === 'retelling' ? '📖' :
                   activityType === 'analysis' ? '🔍' :
                   activityType === 'creative' ? '✨' :
                   activityType === 'continuation' ? '➡️' : '👥'}
                </div>
                <div className="text-xs font-medium capitalize">
                  {activityType}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Writing Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="prompt-panel bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-green-900">{currentPrompt.title}</h3>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
            
            <p className="text-green-800 mb-4">{currentPrompt.instruction}</p>
            
            <div className="guidelines mb-4">
              <h4 className="font-semibold text-green-900 mb-2">Writing Guidelines:</h4>
              <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                {currentPrompt.guidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
            </div>

            {currentPrompt.scaffolding && (
              <div className="scaffolding mb-4">
                <h4 className="font-semibold text-green-900 mb-2">Writing Support:</h4>
                
                {currentPrompt.scaffolding.starter && (
                  <div className="mb-2">
                    <span className="font-medium text-green-800">Suggested starter: </span>
                    <span className="italic text-green-700">"{currentPrompt.scaffolding.starter}"</span>
                  </div>
                )}
                
                {currentPrompt.scaffolding.structure && (
                  <div className="mb-2">
                    <span className="font-medium text-green-800">Structure: </span>
                    <span className="text-green-700">{currentPrompt.scaffolding.structure.join(' → ')}</span>
                  </div>
                )}
                
                {currentPrompt.scaffolding.keyQuestions && (
                  <div>
                    <span className="font-medium text-green-800">Consider these questions:</span>
                    <ul className="list-disc list-inside text-sm text-green-700 mt-1">
                      {currentPrompt.scaffolding.keyQuestions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="target-info flex items-center gap-4 text-sm text-green-700">
              <span>📝 Target: {currentPrompt.targetWordCount} words</span>
              {currentPrompt.timeLimit && (
                <span>⏱️ Suggested time: {currentPrompt.timeLimit} minutes</span>
              )}
              <span>📊 Level: {storyService.mapDifficultyToCEFR(story.difficulty_level)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Writing Area */}
      <div className="writing-area bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Writing</h3>
          <div className="writing-stats flex items-center gap-4 text-sm">
            {!showPrompt && (
              <button
                onClick={() => setShowPrompt(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                📋 Show Prompt
              </button>
            )}
            <span className="text-gray-600">
              Words: <span className="font-medium">{wordCount}</span> / {currentPrompt.targetWordCount}
            </span>
            <span className="text-gray-600">
              Time: <span className="font-medium">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
            </span>
            {autoSaveStatus && (
              <span className={`text-xs ${
                autoSaveStatus === 'saved' ? 'text-green-600' : 
                autoSaveStatus === 'saving' ? 'text-blue-600' : 'text-red-600'
              }`}>
                {autoSaveStatus === 'saved' ? '✓ Saved' : 
                 autoSaveStatus === 'saving' ? '💾 Saving...' : '❌ Save failed'}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container bg-gray-200 h-2 rounded-full mb-4">
          <div
            className="progress-bar bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Start writing your ${selectedActivity}...${currentPrompt.scaffolding?.starter ? `\n\nSuggested starter: "${currentPrompt.scaffolding.starter}"` : ''}`}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Action Buttons */}
        <div className="actions flex justify-between items-center mt-4">
          <div className="helper-buttons flex gap-2">
            <button
              onClick={() => {
                if (currentPrompt.scaffolding?.starter && !content.includes(currentPrompt.scaffolding.starter)) {
                  setContent(currentPrompt.scaffolding.starter + ' ' + content);
                  textareaRef.current?.focus();
                }
              }}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
            >
              Use Starter
            </button>
            <button
              onClick={() => {
                setContent('');
                textareaRef.current?.focus();
              }}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
            >
              Clear
            </button>
          </div>

          <div className="submit-section flex items-center gap-3">
            {progressPercentage >= 80 && (
              <span className="text-green-600 text-sm font-medium">Ready to submit! ✓</span>
            )}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Writing'}
            </button>
          </div>
        </div>
      </div>

      {/* Writing Tips */}
      <div className="writing-tips p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">Writing Tips:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Plan before you write - jot down key points first</li>
          <li>• Use varied sentence structures to make your writing interesting</li>
          <li>• Check your work for grammar and spelling errors</li>
          <li>• Your work is auto-saved every 30 seconds</li>
          <li>• Take breaks if you need to think - there's no rush</li>
        </ul>
      </div>
    </div>
  );
};

export default StoryWritingWorkshop;