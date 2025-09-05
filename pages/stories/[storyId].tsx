// -----storytime feature additions-----
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import StoryReader from '../../components/storytime/storytime_StoryReader';
import StoryAudioPlayer from '../../components/storytime/storytime_StoryAudioPlayer';
import StorytimeVocabulary from '../../components/storytime/storytime_StoryVocabulary';
import StoryProgress from '../../components/storytime/storytime_StoryProgress';
import StorySpeakingPractice from '../../components/storytime/storytime_StorySpeakingPractice';
import StoryWritingWorkshop from '../../components/storytime/storytime_StoryWritingWorkshop';
import PeerReview from '../../components/storytime/storytime_PeerReview';
import StoryAssessment from '../../components/storytime/storytime_StoryAssessment';
import storyService, { Story, StoryVocabulary } from '../../services/storytime_storyService';
import vocabularyService from '../../services/vocabularyService';
import { authService } from '../../services/authService';

type TabType = 'read' | 'listen' | 'speak' | 'write' | 'assess' | 'review' | 'vocabulary' | 'progress';

const StoryDetailPage: React.FC = () => {
  const router = useRouter();
  const { storyId } = router.query;
  
  const [story, setStory] = useState<Story | null>(null);
  const [vocabulary, setVocabulary] = useState<StoryVocabulary[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('read');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [responses] = useState<any[]>([]);
  const [assessmentType, setAssessmentType] = useState<'comprehension' | 'vocabulary' | 'fluency' | 'writing'>('comprehension');
  
  // Get actual user ID from auth service
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get user from auth service
  useEffect(() => {
    const user = authService.getCurrentUser();
    setUserId(user?.id || null);
  }, []);

  useEffect(() => {
    if (storyId && typeof storyId === 'string') {
      loadStoryData(storyId);
    }
  }, [storyId, userId]); // Also reload when userId changes

  const loadStoryData = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Load story with user context
      const storyData = await storyService.getStory(id, userId);
      if (!storyData) {
        setError('Story not found');
        return;
      }
      setStory(storyData);

      // Load vocabulary
      const vocabData = await storyService.getStoryVocabulary(id, userId);
      setVocabulary(vocabData);

      // Load user progress only if user is logged in
      if (userId) {
        const progressData = await storyService.getUserStoryProgress(userId, id);
        setUserProgress(progressData);
      } else {
        console.log('No user logged in, skipping progress load');
        setUserProgress(null);
      }
    } catch (err) {
      setError('Failed to load story. Please try again.');
      console.error('Error loading story:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = (progress: { completion_percentage: number; time_spent: number }) => {
    // Update local progress state
    if (userProgress) {
      setUserProgress({
        ...userProgress,
        overall_completion: Math.max(userProgress.overall_completion, progress.completion_percentage)
      });
    }
  };

  const handleWordLookup = async (word: string, sentence: string) => {
    // Use the existing vocabulary service for advanced lookup
    if (story) {
      try {
        const result = await vocabularyService.lookupWord({
          word,
          paragraph: sentence,
          book_metadata: {
            title: story.title,
            author: story.author || 'Unknown',
            year: new Date().getFullYear().toString(),
            genre: story.genre
          },
          user_id: userId
        });
        console.log('Word lookup result:', result);
      } catch (error) {
        console.error('Word lookup failed:', error);
      }
    }
  };

  const handleTextHighlight = (position: number) => {
    console.log('Text position highlighted:', position);
  };

  const handleSpeakingComplete = (_audioBlob: Blob, activityType: string) => {
    console.log('Speaking activity completed:', activityType);
    // In a real implementation, you might upload the audio and update progress
  };

  const handleWritingSubmit = (content: string, activityType: string, wordCount: number) => {
    console.log('Writing submitted:', { activityType, wordCount, content: content.substring(0, 100) + '...' });
    // In a real implementation, you might save the writing and update progress
  };

  const handlePeerReviewSubmit = (responseId: string, review: any) => {
    console.log('Peer review submitted:', { responseId, review });
    // Update the responses with the new review
  };

  const handleAssessmentComplete = (result: any) => {
    console.log('Assessment completed:', result);
    // Save assessment results and update progress
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Story not found'}</p>
          <Link href="/stories" className="text-blue-600 hover:underline">
            ← Back to stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="story-detail-page min-h-screen bg-gray-50">
      {/* Header */}
      <div className="header bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{story.title}</h1>
              {story.author && (
                <p className="text-lg text-gray-600 mt-1">By {story.author}</p>
              )}
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                {story.genre && <span>📚 {story.genre}</span>}
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(story.difficulty_level)}`}>
                  {storyService.mapDifficultyToCEFR(story.difficulty_level)} - {storyService.getDifficultyLabel(story.difficulty_level)}
                </span>
                {story.word_count && <span>📝 {story.word_count} words</span>}
                {story.estimated_reading_time && <span>⏱️ {story.estimated_reading_time} min</span>}
              </div>
            </div>
            <Link href="/stories" className="text-blue-600 hover:text-blue-700">
              ← Back to Library
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('read')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'read'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📖 Read
            </button>
            {story.audio_url && (
              <button
                onClick={() => setActiveTab('listen')}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'listen'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎧 Listen
              </button>
            )}
            <button
              onClick={() => setActiveTab('speak')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'speak'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🗣️ Speak
            </button>
            <button
              onClick={() => setActiveTab('write')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'write'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ✍️ Write
            </button>
            <button
              onClick={() => setActiveTab('assess')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'assess'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 Assess
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'review'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Review
            </button>
            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'vocabulary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📚 Vocabulary
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Progress
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'read' && (
          <StoryReader
            story={story}
            userProgress={userProgress || {
              overall_completion: 0,
              skills_progress: { reading: 0, listening: 0, speaking: 0, writing: 0 },
              sessions_count: 0
            }}
            userId={userId || ''}
            onProgressUpdate={handleProgressUpdate}
            onWordClick={(word, sentence) => console.log('Word clicked:', word, sentence)}
          />
        )}

        {activeTab === 'listen' && story.audio_url && (
          <StoryAudioPlayer
            story={story}
            audioUrl={story.audio_url}
            transcript={story.content}
            userId={userId}
            onTextHighlight={handleTextHighlight}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {activeTab === 'speak' && (
          <StorySpeakingPractice
            story={story}
            activity="retelling"
            userId={userId}
            onRecordingComplete={handleSpeakingComplete}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {activeTab === 'write' && (
          <StoryWritingWorkshop
            story={story}
            prompt={null}
            userId={userId}
            onSubmit={handleWritingSubmit}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {activeTab === 'assess' && (
          <div className="assessment-container">
            <div className="assessment-selector bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Choose Assessment Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['comprehension', 'vocabulary', 'fluency', 'writing'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAssessmentType(type)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      assessmentType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {type === 'comprehension' ? '📖' :
                         type === 'vocabulary' ? '📚' :
                         type === 'fluency' ? '🗣️' : '✍️'}
                      </div>
                      <div className="font-medium capitalize">{type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <StoryAssessment
              story={story}
              assessmentType={assessmentType}
              userId={userId}
              onComplete={handleAssessmentComplete}
            />
          </div>
        )}

        {activeTab === 'review' && (
          <PeerReview
            responses={responses}
            currentUserId={userId}
            storyTitle={story.title}
            onReviewSubmit={handlePeerReviewSubmit}
          />
        )}

        {activeTab === 'vocabulary' && (
          <StorytimeVocabulary
            storyId={story.id}
            storyTitle={story.title}
            storyAuthor={story.author}
            extractedWords={vocabulary}
            onWordLookup={(word, definition) => {
              console.log('Word lookup:', word, definition);
            }}
            userId={userId}
          />
        )}

        {activeTab === 'progress' && userProgress && (
          <StoryProgress
            userId={userId}
            storyId={story.id}
            skillsProgress={userProgress.skills_progress || {
              reading: 0,
              listening: 0,
              speaking: 0,
              writing: 0
            }}
            overallCompletion={userProgress.overall_completion || 0}
            sessionsCount={userProgress.sessions?.length || 0}
            estimatedTimeRemaining={
              story.estimated_reading_time 
                ? Math.max(0, Math.round(story.estimated_reading_time * (1 - (userProgress.overall_completion || 0) / 100)))
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

// Helper function for difficulty color
const getDifficultyColor = (level: number) => {
  const colors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-lime-100 text-lime-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800',
    6: 'bg-purple-100 text-purple-800'
  };
  return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default StoryDetailPage;