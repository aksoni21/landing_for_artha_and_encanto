import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getBackendURL } from '../../utils/environment';

// Types
interface Story {
  id: string;
  title: string;
  difficulty_level: number;
  word_count: number;
  attempts: number;
  completions: number;
  completion_rate: number;
  unique_readers: number;
  avg_time_spent: number;
  avg_assessment_score?: number;
}

interface StoriesAnalytics {
  stories: Story[];
  filters: {
    level?: number;
    timeframe: string;
  };
  insights: string[];
}

export default function TeacherStoriesPage() {
  const [data, setData] = useState<StoriesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [sortBy, setSortBy] = useState<'title' | 'completion_rate' | 'attempts' | 'difficulty_level'>('completion_rate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  // For demo purposes, use a default teacher ID
  useEffect(() => {
    const defaultTeacherId = process.env.NEXT_PUBLIC_DEMO_TEACHER_ID || '09ce8f47-0d2e-43c4-8220-560c23e02baa';
    setTeacherId(defaultTeacherId);
  }, []);

  useEffect(() => {
    if (teacherId) {
      fetchStoriesData();
    }
  }, [teacherId, selectedLevel, selectedTimeframe]);

  const fetchStoriesData = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendURL();
      const params = new URLSearchParams({ teacher_id: teacherId, timeframe: selectedTimeframe });
      if (selectedLevel) {
        params.append('level', selectedLevel.toString());
      }

      const response = await fetch(`${backendUrl}/api/teacher/stories?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch stories data:', error);
      setError('Failed to load stories data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToStory = (storyId: string) => {
    router.push(`/teacher/story/${storyId}?teacher_id=${teacherId}`);
  };

  const handleSort = (field: typeof sortBy) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (field !== sortBy) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const sortedStories = data?.stories.slice().sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle string sorting for title
    if (sortBy === 'title') {
      return sortOrder === 'asc'
        ? (aValue as string).localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string);
    }

    // Handle numeric sorting
    const numA = aValue as number;
    const numB = bValue as number;
    if (sortOrder === 'asc') {
      return numA - numB;
    } else {
      return numB - numA;
    }
  });

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
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
                    onClick={fetchStoriesData}
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
              <h1 className="text-3xl font-bold text-gray-900">Stories Analytics</h1>
              <p className="text-gray-600">Performance metrics across all stories</p>
            </div>
            <button
              onClick={fetchStoriesData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={selectedLevel || ''}
                onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : null)}
                className="border border-gray-300 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                {[1, 2, 3, 4, 5, 6].map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">
                Showing {sortedStories?.length || 0} stories
                {selectedLevel && ` at Level ${selectedLevel}`}
                {selectedTimeframe !== 'all' && ` for ${selectedTimeframe}`}
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {data.insights.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Insights</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {data.insights.map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('title')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Title {getSortIcon('title')}
                  </th>
                  <th
                    onClick={() => handleSort('difficulty_level')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Level {getSortIcon('difficulty_level')}
                  </th>
                  <th
                    onClick={() => handleSort('completion_rate')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Completion Rate {getSortIcon('completion_rate')}
                  </th>
                  <th
                    onClick={() => handleSort('attempts')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Attempts {getSortIcon('attempts')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStories?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No stories found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  sortedStories?.map((story) => (
                    <tr
                      key={story.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigateToStory(story.id)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {story.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {story.word_count} words
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Level {story.difficulty_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                story.completion_rate >= 80
                                  ? 'bg-green-500'
                                  : story.completion_rate >= 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.max(story.completion_rate, 5)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${getCompletionColor(story.completion_rate)}`}>
                            {Math.round(story.completion_rate)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {story.attempts}
                        {story.attempts > 0 && (
                          <span className="text-gray-500">
                            ({story.completions} completed)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {story.unique_readers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {story.avg_time_spent > 0
                          ? `${Math.round(story.avg_time_spent)}min`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {story.avg_assessment_score
                          ? `${Math.round(story.avg_assessment_score)}%`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToStory(story.id);
                          }}
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

        {/* Export Options */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              // Export to CSV functionality
              const csvContent = [
                ['Title', 'Level', 'Completion Rate', 'Attempts', 'Students', 'Avg Time', 'Avg Score'].join(','),
                ...(sortedStories?.map(story => [
                  `"${story.title}"`,
                  story.difficulty_level,
                  Math.round(story.completion_rate),
                  story.attempts,
                  story.unique_readers,
                  Math.round(story.avg_time_spent),
                  story.avg_assessment_score ? Math.round(story.avg_assessment_score) : ''
                ].join(',')) || [])
              ].join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `stories-analytics-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}