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

interface StudentStoryProgress {
  student: Student;
  reading_stats: ReadingStats;
  vocabulary_progress: VocabularyProgress;
  reading_journey: JourneyItem[];
  difficulty_progression: DifficultyProgression[];
}

export default function StudentStoryProgressPage() {
  const [data, setData] = useState<StudentStoryProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const router = useRouter();
  const { id: studentId } = router.query;

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
            href="/teacher/overview"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {data.student.name} - Story Progress
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        </div>

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
                  const height = (point.avg_difficulty / 6) * 100; // Scale to percentage of max difficulty (6)
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
                    🎉 Great progress! Student is now reading advanced level stories (Level {recentDifficulty.toFixed(1)}).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}