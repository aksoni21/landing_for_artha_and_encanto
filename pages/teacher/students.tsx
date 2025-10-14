import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getBackendURL } from '../../utils/environment';

// Types
interface StudentUnified {
  id: string;
  name: string;
  email: string;

  // Stories metrics
  stories_completed: number;
  stories_total: number;
  stories_in_progress: number;
  avg_story_score: number;

  // Speaking metrics
  speaking_sessions: number;
  speaking_avg_score: number;
  speaking_last_session: string | null;

  // Vocabulary metrics
  vocabulary_mastered: number;
  vocabulary_learning: number;
  vocabulary_total: number;

  // Overall
  cefr_level: string;
  status: 'active' | 'at_risk' | 'inactive';
  last_activity: string | null;
}

interface StudentsData {
  students: StudentUnified[];
  total_count: number;
}

export default function TeacherStudentsPage() {
  const [data, setData] = useState<StudentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'at_risk' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stories' | 'speaking' | 'vocabulary'>('name');
  const router = useRouter();

  useEffect(() => {
    const defaultTeacherId = process.env.NEXT_PUBLIC_DEMO_TEACHER_ID || '09ce8f47-0d2e-43c4-8220-560c23e02baa';
    setTeacherId(defaultTeacherId);
  }, []);

  useEffect(() => {
    if (teacherId) {
      fetchStudents();
    }
  }, [teacherId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendURL();
      const response = await fetch(
        `${backendUrl}/api/teacher/students?teacher_id=${teacherId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToStudent = (studentId: string) => {
    router.push(`/teacher/student/${studentId}/stories?teacher_id=${teacherId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'at_risk': return '⚠️';
      case 'inactive': return '⚪';
      default: return '⚪';
    }
  };

  const getCEFRColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-red-100 text-red-800',
      'A2': 'bg-orange-100 text-orange-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-green-100 text-green-800',
      'C1': 'bg-blue-100 text-blue-800',
      'C2': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Filter and sort students
  const filteredStudents = data?.students
    .filter(student => {
      // Filter by search query
      if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !student.email.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Filter by status
      if (filterStatus !== 'all' && student.status !== filterStatus) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stories':
          return b.stories_completed - a.stories_completed;
        case 'speaking':
          return b.speaking_sessions - a.speaking_sessions;
        case 'vocabulary':
          return b.vocabulary_mastered - a.vocabulary_mastered;
        default:
          return 0;
      }
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 h-64"></div>
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
                    onClick={fetchStudents}
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
              <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
              <p className="text-gray-600">
                {filteredStudents.length} of {data?.total_count || 0} students
              </p>
            </div>
            <button
              onClick={fetchStudents}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'at_risk' | 'inactive')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="at_risk">At Risk</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'stories' | 'speaking' | 'vocabulary')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="stories">Stories Completed</option>
                <option value="speaking">Speaking Sessions</option>
                <option value="vocabulary">Vocabulary Mastered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'No students have been added yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
                onClick={() => navigateToStudent(student.id)}
              >
                {/* Student Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-lg">
                        {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                </div>

                {/* Status and CEFR */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                    {getStatusIcon(student.status)} {student.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCEFRColor(student.cefr_level)}`}>
                    {student.cefr_level}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="space-y-3">
                  {/* Stories */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">📚 Stories</span>
                      <span className="font-medium">
                        {student.stories_completed}/{student.stories_total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${student.stories_total > 0 ? (student.stories_completed / student.stories_total) * 100 : 0}%` }}
                      />
                    </div>
                    {student.avg_story_score > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Avg: {Math.round(student.avg_story_score)}%
                      </div>
                    )}
                  </div>

                  {/* Speaking */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">🎤 Speaking</span>
                      <span className="font-medium">{student.speaking_sessions} sessions</span>
                    </div>
                    {student.speaking_avg_score > 0 && (
                      <div className="text-xs text-gray-500">
                        Avg: {Math.round(student.speaking_avg_score)}%
                        {student.speaking_last_session && (
                          <span className="ml-2">• Last: {formatDate(student.speaking_last_session)}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Vocabulary */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">📖 Vocabulary</span>
                      <span className="font-medium">{student.vocabulary_mastered} mastered</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.vocabulary_learning} learning • {student.vocabulary_total} total
                    </div>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Last activity: {formatDate(student.last_activity)}
                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToStudent(student.id);
                  }}
                  className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
