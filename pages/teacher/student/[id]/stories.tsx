import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getBackendURL } from '../../../../utils/environment';

// Types
interface Student {
  id: string;
  name: string;
  email: string;
}

interface ReadingStats {
  total_stories: number;
  stories_this_week: number;
  completed_stories: number;
  avg_time_per_story: number;
}

interface VocabularyProgress {
  mastered_words: number;
  learning_words: number;
  struggling_words: number;
  total_encountered: number;
}

interface JourneyItem {
  story_id: string;
  title: string;
  difficulty_level: number;
  completion_percentage: number;
  time_spent: number;
  assessment_score?: number;
  status: 'completed' | 'in_progress' | 'not_started';
  started_at?: string;
  completed_at?: string;
}

interface DifficultyProgression {
  week: string;
  avg_difficulty: number;
}

interface SpeakingStats {
  total_recordings: number;
  recordings_this_week: number;
  avg_score: number;
  activities_completed: number;
}

interface SpeakingActivity {
  id: string;
  story_id: string;
  story_title: string;
  activity_type: 'summary' | 'pronunciation' | 'discussion' | 'retelling';
  audio_url: string;
  duration: number;
  analysis_score?: number;
  cefr_level?: string;
  created_at: string;
  has_analysis: boolean;
}

interface StudentStoryProgress {
  student: Student;
  reading_stats: ReadingStats;
  vocabulary_progress: VocabularyProgress;
  reading_journey: JourneyItem[];
  difficulty_progression: DifficultyProgression[];
  speaking_stats?: SpeakingStats;
  speaking_activities?: SpeakingActivity[];
}

export default function StudentStoryProgressPage() {
  const [data, setData] = useState<StudentStoryProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'speaking' | 'vocabulary' | 'timeline'>('overview');
  const router = useRouter();
  const { id: studentId} = router.query;

  // For demo purposes, use a default teacher ID
  useEffect(() => {
    const defaultTeacherId = process.env.NEXT_PUBLIC_DEMO_TEACHER_ID || '09ce8f47-0d2e-43c4-8220-560c23e02baa';
    setTeacherId(defaultTeacherId);
  }, []);

  useEffect(() => {
    if (studentId && teacherId) {
      fetchStudentProgress();
    }
  }, [studentId, teacherId]);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendURL();
      const response = await fetch(
        `${backendUrl}/api/teacher/student/${studentId}/story-progress?teacher_id=${teacherId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch student progress:', error);
      setError('Failed to load student progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToStory = (storyId: string) => {
    router.push(`/teacher/story/${storyId}?teacher_id=${teacherId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'not_started':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '🔄';
      case 'not_started':
        return '○';
      default:
        return '○';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'summary': 'Story Summary',
      'pronunciation': 'Pronunciation',
      'discussion': 'Discussion',
      'retelling': 'Story Retelling'
    };
    return labels[type] || type;
  };

  const getActivityTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'summary': '📝',
      'pronunciation': '🗣️',
      'discussion': '💭',
      'retelling': '📖'
    };
    return icons[type] || '🎤';
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchStudentProgress}
                    className="bg-red-100 px-4 py-2 rounded text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Calculate retention rate
  const retentionRate = data.vocabulary_progress.total_encountered > 0
    ? Math.round((data.vocabulary_progress.mastered_words / data.vocabulary_progress.total_encountered) * 100)
    : 0;

  // Get current difficulty level trend
  const recentDifficulty = data.difficulty_progression.length > 0
    ? data.difficulty_progression[data.difficulty_progression.length - 1].avg_difficulty
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/teacher/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {data.student.name}
              </h1>
              <p className="text-gray-600">{data.student.email}</p>
            </div>
            <button
              onClick={fetchStudentProgress}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'stories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Stories
              </button>
              <button
                onClick={() => setActiveTab('speaking')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'speaking'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Speaking Practice
              </button>
              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'vocabulary'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vocabulary
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'timeline'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Timeline
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Progress Wheel */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Overall Progress</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Circular Progress */}
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg className="w-48 h-48 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                    />
                    {/* Stories progress */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="12"
                      strokeDasharray={`${(data.reading_stats.completed_stories / Math.max(data.reading_stats.total_stories, 1)) * 502.4} 502.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-4xl font-bold text-gray-900">
                      {data.reading_stats.total_stories > 0
                        ? Math.round((data.reading_stats.completed_stories / data.reading_stats.total_stories) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {data.reading_stats.completed_stories}/{data.reading_stats.total_stories}
                    </div>
                    <div className="text-sm text-gray-600">Stories Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {data.vocabulary_progress.mastered_words}
                    </div>
                    <div className="text-sm text-gray-600">Words Mastered</div>
                  </div>
                  {data.speaking_stats && (
                    <>
                      <div>
                        <div className="text-3xl font-bold text-purple-600">
                          {data.speaking_stats.total_recordings}
                        </div>
                        <div className="text-sm text-gray-600">Speaking Recordings</div>
                      </div>
                      <div>
                        <div className={`text-3xl font-bold ${getScoreColor(data.speaking_stats.avg_score)}`}>
                          {data.speaking_stats.avg_score > 0 ? Math.round(data.speaking_stats.avg_score) : '-'}
                        </div>
                        <div className="text-sm text-gray-600">Avg Speaking Score</div>
                      </div>
                    </>
                  )}
                  <div>
                    <div className="text-3xl font-bold text-orange-600">
                      {retentionRate}%
                    </div>
                    <div className="text-sm text-gray-600">Vocabulary Retention</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Reading Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {data.reading_stats.total_stories}
                    </p>
                    <p className="text-sm text-gray-500">Total Stories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {data.reading_stats.stories_this_week}
                    </p>
                    <p className="text-sm text-gray-500">This Week</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(data.reading_stats.avg_time_per_story)}min
                    </p>
                    <p className="text-sm text-gray-500">Avg Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {data.reading_stats.completed_stories}
                    </p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
              </div>

              {/* Vocabulary Progress */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Progress</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {data.vocabulary_progress.mastered_words}
                    </p>
                    <p className="text-sm text-gray-500">Words Mastered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {data.vocabulary_progress.learning_words}
                    </p>
                    <p className="text-sm text-gray-500">Currently Learning</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {data.vocabulary_progress.struggling_words}
                    </p>
                    <p className="text-sm text-gray-500">Struggling With</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {retentionRate}%
                    </p>
                    <p className="text-sm text-gray-500">Retention Rate</p>
                  </div>
                </div>
              </div>

              {/* Speaking Practice Stats */}
              {data.speaking_stats && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Speaking Practice
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {data.speaking_stats.total_recordings}
                      </p>
                      <p className="text-sm text-gray-500">Total Recordings</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        {data.speaking_stats.recordings_this_week}
                      </p>
                      <p className="text-sm text-gray-500">This Week</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${getScoreColor(data.speaking_stats.avg_score)}`}>
                        {data.speaking_stats.avg_score > 0 ? Math.round(data.speaking_stats.avg_score) : '-'}
                      </p>
                      <p className="text-sm text-gray-500">Avg Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-pink-600">
                        {data.speaking_stats.activities_completed}
                      </p>
                      <p className="text-sm text-gray-500">Activities Done</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <>
            {/* Reading Journey Timeline */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Reading Journey Timeline
                </h2>
                <p className="text-sm text-gray-600">
                  Recent story activity and progress
                </p>
              </div>
              <div className="p-6">
                {data.reading_journey.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No reading activity yet. Encourage student to start reading stories.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data.reading_journey.map((item) => (
                      <div
                        key={item.story_id}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigateToStory(item.story_id)}
                      >
                        <div className="flex-shrink-0 mr-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-500">
                                Level {item.difficulty_level} •
                                {item.started_at && ` Started ${formatDate(item.started_at)}`}
                                {item.completed_at && ` • Completed ${formatDate(item.completed_at)}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${Math.max(item.completion_percentage, 5)}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                  {item.completion_percentage}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {item.time_spent > 0 && `${item.time_spent}min`}
                                {item.assessment_score && ` • ${Math.round(item.assessment_score)}% score`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty Progression Chart */}
            {data.difficulty_progression.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Difficulty Progression
                  </h2>
                  <p className="text-sm text-gray-600">
                    Average story difficulty level over time
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {data.difficulty_progression.map((point, index) => {
                      const height = (point.avg_difficulty / 6) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${Math.max(height, 5)}%` }}
                            title={`Week ${point.week}: Level ${point.avg_difficulty.toFixed(1)}`}
                          />
                          <div className="text-xs text-gray-500 mt-2 text-center">
                            {new Date(point.week).toLocaleDateString('en', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-4">
                    <span>Level 1 (Beginner)</span>
                    <span>Level 6 (Advanced)</span>
                  </div>
                  {recentDifficulty >= 4 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        Great progress! Student is now reading advanced level stories (Level {recentDifficulty.toFixed(1)}).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Speaking Tab */}
        {activeTab === 'speaking' && (
          <>
            {data.speaking_activities && data.speaking_activities.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Speaking Activities
                  </h2>
                  <p className="text-sm text-gray-600">
                    Recent speaking practice recordings and analysis
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {data.speaking_activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                            {getActivityTypeIcon(activity.activity_type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{activity.story_title}</h3>
                              <p className="text-sm text-gray-500">
                                {getActivityTypeLabel(activity.activity_type)} •
                                {' '}{formatDuration(activity.duration)} •
                                {' '}{formatDate(activity.created_at)}
                              </p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              {activity.has_analysis && activity.analysis_score !== undefined ? (
                                <div>
                                  <div className={`text-2xl font-bold ${getScoreColor(activity.analysis_score)}`}>
                                    {Math.round(activity.analysis_score)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {activity.cefr_level && `CEFR: ${activity.cefr_level}`}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400 italic">
                                  Not analyzed
                                </div>
                              )}
                              <div className="flex flex-col gap-2">
                                <a
                                  href={activity.audio_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Listen
                                </a>
                                {activity.has_analysis && (
                                  <button
                                    className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      alert('Analysis details coming soon!');
                                    }}
                                  >
                                    Analysis
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-4xl mb-4">No speaking activities yet</div>
                <p className="text-gray-600">
                  Encourage student to practice speaking by recording story summaries, pronunciation exercises, or discussions.
                </p>
              </div>
            )}
          </>
        )}

        {/* Vocabulary Tab */}
        {activeTab === 'vocabulary' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Vocabulary Details</h2>
              <p className="text-sm text-gray-600">
                Detailed breakdown of vocabulary learning progress
              </p>
            </div>
            <div className="p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {data.vocabulary_progress.mastered_words}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Mastered Words</div>
                  <div className="text-xs text-green-600 mt-1">
                    {retentionRate}% retention rate
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600">
                    {data.vocabulary_progress.learning_words}
                  </div>
                  <div className="text-sm text-yellow-700 font-medium">Currently Learning</div>
                  <div className="text-xs text-yellow-600 mt-1">In progress</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-3xl font-bold text-red-600">
                    {data.vocabulary_progress.struggling_words}
                  </div>
                  <div className="text-sm text-red-700 font-medium">Struggling With</div>
                  <div className="text-xs text-red-600 mt-1">Needs attention</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {data.vocabulary_progress.total_encountered}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Total Encountered</div>
                  <div className="text-xs text-blue-600 mt-1">All time</div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Learning Progress Distribution</h3>
                <div className="flex items-center gap-2 h-8 rounded-lg overflow-hidden">
                  <div
                    className="bg-green-500 h-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      width: `${data.vocabulary_progress.total_encountered > 0
                        ? (data.vocabulary_progress.mastered_words / data.vocabulary_progress.total_encountered) * 100
                        : 0}%`
                    }}
                  >
                    {data.vocabulary_progress.mastered_words > 0 && `${data.vocabulary_progress.mastered_words}`}
                  </div>
                  <div
                    className="bg-yellow-500 h-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      width: `${data.vocabulary_progress.total_encountered > 0
                        ? (data.vocabulary_progress.learning_words / data.vocabulary_progress.total_encountered) * 100
                        : 0}%`
                    }}
                  >
                    {data.vocabulary_progress.learning_words > 0 && `${data.vocabulary_progress.learning_words}`}
                  </div>
                  <div
                    className="bg-red-500 h-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      width: `${data.vocabulary_progress.total_encountered > 0
                        ? (data.vocabulary_progress.struggling_words / data.vocabulary_progress.total_encountered) * 100
                        : 0}%`
                    }}
                  >
                    {data.vocabulary_progress.struggling_words > 0 && `${data.vocabulary_progress.struggling_words}`}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Mastered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">Learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-600">Struggling</span>
                  </div>
                </div>
              </div>

              {/* Note about detailed word list */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Detailed word-by-word tracking with individual mastery status, practice frequency, and retention rates will be available once the backend API is updated to provide this data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
              <p className="text-sm text-gray-600">
                Chronological view of all learning activities
              </p>
            </div>
            <div className="p-6">
              {/* Combined timeline from reading journey and speaking activities */}
              {(() => {
                // Combine all activities into one timeline
                const timelineItems: Array<{
                  timestamp: string;
                  type: 'story' | 'speaking';
                  data: JourneyItem | SpeakingActivity;
                }> = [];

                // Add reading journey items
                data.reading_journey.forEach(item => {
                  const timestamp = item.completed_at || item.started_at || '';
                  if (timestamp) {
                    timelineItems.push({ timestamp, type: 'story', data: item });
                  }
                });

                // Add speaking activities
                data.speaking_activities?.forEach(activity => {
                  timelineItems.push({
                    timestamp: activity.created_at,
                    type: 'speaking',
                    data: activity
                  });
                });

                // Sort by timestamp (most recent first)
                timelineItems.sort((a, b) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                return timelineItems.length > 0 ? (
                  <div className="space-y-6">
                    {timelineItems.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.type === 'story' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                            {item.type === 'story' ? '📚' : '🎤'}
                          </div>
                          {index < timelineItems.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 flex-1 mt-2"></div>
                          )}
                        </div>

                        {/* Activity content */}
                        <div className="flex-1 pb-8">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            {item.type === 'story' ? (
                              <>
                                {(() => {
                                  const storyItem = item.data as JourneyItem;
                                  return (
                                    <>
                                      <div className="flex items-start justify-between mb-2">
                                        <div>
                                          <h3 className="font-medium text-gray-900">{storyItem.title}</h3>
                                          <p className="text-sm text-gray-500">
                                            Story Reading • Level {storyItem.difficulty_level}
                                          </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(storyItem.status)}`}>
                                          {storyItem.status.replace('_', ' ')}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                        <span>{storyItem.completion_percentage}% complete</span>
                                        {storyItem.time_spent > 0 && <span>• {storyItem.time_spent}min</span>}
                                        {storyItem.assessment_score && (
                                          <span className={getScoreColor(storyItem.assessment_score)}>
                                            • Score: {Math.round(storyItem.assessment_score)}%
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                                    </>
                                  );
                                })()}
                              </>
                            ) : (
                              <>
                                {(() => {
                                  const speakingItem = item.data as SpeakingActivity;
                                  return (
                                    <>
                                      <div className="flex items-start justify-between mb-2">
                                        <div>
                                          <h3 className="font-medium text-gray-900">{speakingItem.story_title}</h3>
                                          <p className="text-sm text-gray-500">
                                            {getActivityTypeLabel(speakingItem.activity_type)} • {formatDuration(speakingItem.duration)}
                                          </p>
                                        </div>
                                        {speakingItem.has_analysis && speakingItem.analysis_score !== undefined && (
                                          <span className={`text-lg font-bold ${getScoreColor(speakingItem.analysis_score)}`}>
                                            {Math.round(speakingItem.analysis_score)}
                                          </span>
                                        )}
                                      </div>
                                      {speakingItem.cefr_level && (
                                        <p className="text-sm text-gray-600 mb-2">CEFR Level: {speakingItem.cefr_level}</p>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <a
                                          href={speakingItem.audio_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                                        >
                                          Listen
                                        </a>
                                        <p className="text-xs text-gray-500 ml-2">{formatDate(item.timestamp)}</p>
                                      </div>
                                    </>
                                  );
                                })()}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">No activities yet</div>
                    <p className="text-gray-600">
                      Activities will appear here as the student reads stories and practices speaking.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}