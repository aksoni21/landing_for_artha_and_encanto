import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getBackendURL } from '../../../utils/environment';

// Types
interface Story {
  id: string;
  title: string;
  difficulty_level: number;
  word_count: number;
  lexile_score?: number;
  content?: string;
  created_at?: string;
}

interface Engagement {
  total_attempts: number;
  completions: number;
  completion_rate: number;
  unique_students: number;
  avg_time_spent: number;
}

interface Assessment {
  avg_score?: number;
}

interface VocabularyProblem {
  word: string;
  definition?: string;
  lookup_count: number;
  students_struggled: number;
  avg_mastery: number;
}

interface StudentProgress {
  student_id: string;
  name: string;
  email: string;
  completion_percentage: number;
  time_spent: number;
  assessment_score?: number;
  status: 'completed' | 'in_progress' | 'not_started';
  started_at?: string;
  completed_at?: string;
}

interface StoryAnalytics {
  story: Story;
  engagement: Engagement;
  assessment: Assessment;
  vocabulary_problems: VocabularyProblem[];
  student_progress: StudentProgress[];
}

export default function StoryAnalyticsPage() {
  const [data, setData] = useState<StoryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const router = useRouter();
  const { id: storyId } = router.query;

  // For demo purposes, use a default teacher ID
  useEffect(() => {
    const defaultTeacherId = process.env.NEXT_PUBLIC_DEMO_TEACHER_ID || '09ce8f47-0d2e-43c4-8220-560c23e02baa';
    setTeacherId(defaultTeacherId);
  }, []);

  useEffect(() => {
    if (storyId && teacherId) {
      fetchStoryAnalytics();
    }
  }, [storyId, teacherId]);

  const fetchStoryAnalytics = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendURL();
      const response = await fetch(
        `${backendUrl}/api/teacher/story/${storyId}/analytics?teacher_id=${teacherId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch story analytics:', error);
      setError('Failed to load story analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToStudent = (studentId: string) => {
    router.push(`/teacher/student/${studentId}/stories?teacher_id=${teacherId}`);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
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
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
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
                    onClick={fetchStoryAnalytics}
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
              <h1 className="text-3xl font-bold text-gray-900">{data.story.title}</h1>
              <p className="text-gray-600">
                Level {data.story.difficulty_level} • {data.story.word_count} words
                {data.story.lexile_score && ` • Lexile ${data.story.lexile_score}`}
              </p>
            </div>
            <button
              onClick={fetchStoryAnalytics}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Story Content */}
        {data.story.content && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Story Content</h2>
              <p className="text-sm text-gray-600">
                {data.story.created_at && `Created ${new Date(data.story.created_at).toLocaleDateString()}`}
              </p>
            </div>
            <div className="p-6">
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {data.story.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {data.engagement.unique_students}
                </p>
                <p className="text-sm text-gray-500">Students Started</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(data.engagement.completion_rate)}%
                </p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {data.engagement.total_attempts}
                </p>
                <p className="text-sm text-gray-500">Total Attempts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(data.engagement.avg_time_spent)}min
                </p>
                <p className="text-sm text-gray-500">Avg Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment</h2>
            <div>
              {data.assessment.avg_score ? (
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(data.assessment.avg_score)}%
                  </p>
                  <p className="text-sm text-gray-500">Average Score</p>
                </div>
              ) : (
                <p className="text-gray-500">No assessments completed yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Vocabulary Problems */}
        {data.vocabulary_problems.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Problem Vocabulary
              </h2>
              <p className="text-sm text-gray-600">
                Words students looked up most often
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.vocabulary_problems.slice(0, 9).map((vocab) => (
                  <div
                    key={vocab.word}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-900">{vocab.word}</div>
                    {vocab.definition && (
                      <div className="text-sm text-gray-600 mt-1">
                        {vocab.definition.substring(0, 80)}
                        {vocab.definition.length > 80 ? '...' : ''}
                      </div>
                    )}
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>{vocab.students_struggled} students</span>
                      <span>{vocab.lookup_count} lookups</span>
                    </div>
                  </div>
                ))}
              </div>
              {data.vocabulary_problems.length > 9 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Showing top 9 of {data.vocabulary_problems.length} problem words
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Student Progress */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Progress
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.student_progress.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No students have interacted with this story yet.
                    </td>
                  </tr>
                ) : (
                  data.student_progress.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            student.status
                          )}`}
                        >
                          {getStatusText(student.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.max(student.completion_percentage, 2)}%`
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">
                            {student.completion_percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.time_spent ? `${student.time_spent}min` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.assessment_score
                          ? `${Math.round(student.assessment_score)}%`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigateToStudent(student.student_id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}