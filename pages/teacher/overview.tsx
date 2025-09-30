import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getBackendURL } from '../../utils/environment';

// Types for API responses
interface TodayReaders {
  count: number;
  active_now: number;
}

interface WeekStats {
  stories_completed: number;
  total_minutes: number;
  active_students: number;
}

interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  issue: string;
  last_activity: string | null;
}

interface TopStory {
  id: string;
  title: string;
  difficulty_level: number;
  completion_rate: number;
  attempts: number;
  completions: number;
  unique_readers: number;
}

interface OverviewData {
  today_readers: TodayReaders;
  week_stats: WeekStats;
  at_risk_students: {
    count: number;
    list: AtRiskStudent[];
  };
  top_stories: TopStory[];
}

export default function TeacherOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const router = useRouter();

  // For demo purposes, use a default teacher ID - replace with actual auth
  useEffect(() => {
    // In production, get this from authentication context
    // For now, you can set your real user ID here for testing
    const defaultTeacherId = process.env.NEXT_PUBLIC_DEMO_TEACHER_ID || '09ce8f47-0d2e-43c4-8220-560c23e02baa';
    setTeacherId(defaultTeacherId);
  }, []);

  useEffect(() => {
    if (teacherId) {
      fetchOverviewData();
    }
  }, [teacherId]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendURL();
      const response = await fetch(`${backendUrl}/api/teacher/overview?teacher_id=${teacherId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch overview data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchOverviewData();
  };

  const navigateToStory = (storyId: string) => {
    router.push(`/teacher/story/${storyId}`);
  };

  const navigateToStudent = (studentId: string) => {
    router.push(`/teacher/student/${studentId}/stories`);
  };

  const navigateToAllStories = () => {
    router.push(`/teacher/stories?teacher_id=${teacherId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
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
                    onClick={handleRefresh}
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Updated {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Today's Readers"
            value={data.today_readers.count}
            subtitle={`${data.today_readers.active_now} reading now`}
            color="blue"
            icon="👥"
          />
          <MetricCard
            title="This Week"
            value={`${data.week_stats.stories_completed} stories`}
            subtitle={`${data.week_stats.total_minutes} minutes read`}
            color="green"
            icon="📚"
          />
          <MetricCard
            title="At Risk"
            value={data.at_risk_students.count}
            subtitle="students need attention"
            color="red"
            icon="⚠️"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Story Performance */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Story Performance (Last 7 days)
                </h2>
                <button
                  onClick={navigateToAllStories}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              {data.top_stories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No story data available yet. Students haven&apos;t started reading stories.
                </p>
              ) : (
                <div className="space-y-4">
                  {data.top_stories.slice(0, 5).map((story, index) => (
                    <StoryPerformanceRow
                      key={story.id}
                      rank={index + 1}
                      story={story}
                      onClick={() => navigateToStory(story.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* At-Risk Students */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Students Needing Attention
              </h2>
            </div>
            <div className="p-6">
              {data.at_risk_students.list.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Great! No students need immediate attention.
                </p>
              ) : (
                <div className="space-y-4">
                  {data.at_risk_students.list.slice(0, 5).map((student) => (
                    <AtRiskStudentRow
                      key={student.id}
                      student={student}
                      onClick={() => navigateToStudent(student.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components
const MetricCard = ({ title, value, subtitle, color, icon }: {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'red';
  icon: string;
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    red: 'text-red-600 bg-red-50 border-red-200'
  };
  const selectedClass = colorClasses[color];

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${selectedClass}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold ${color === 'blue' ? 'text-blue-600' :
                        color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
            {value}
          </p>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const StoryPerformanceRow = ({ rank, story, onClick }: {
  rank: number;
  story: TopStory;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-md border border-gray-100"
  >
    <div className="flex items-center flex-1">
      <span className="text-sm font-medium text-gray-400 w-6">#{rank}</span>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{story.title}</p>
        <p className="text-xs text-gray-500">
          Level {story.difficulty_level} • {story.unique_readers} students
        </p>
      </div>
    </div>
    <div className="flex items-center ml-4">
      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${Math.max(story.completion_rate, 5)}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-900 w-12 text-right">
        {Math.round(story.completion_rate)}%
      </span>
    </div>
  </div>
);

const AtRiskStudentRow = ({ student, onClick }: {
  student: AtRiskStudent;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-3 border-l-4 border-red-400 bg-red-50 rounded-md cursor-pointer hover:bg-red-100"
  >
    <div>
      <p className="text-sm font-medium text-gray-900">{student.name}</p>
      <p className="text-xs text-red-600">{student.issue}</p>
    </div>
    <div className="text-xs text-gray-500">
      {student.last_activity
        ? new Date(student.last_activity).toLocaleDateString()
        : 'Never'
      }
    </div>
  </div>
);