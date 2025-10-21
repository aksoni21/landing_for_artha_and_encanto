import Link from 'next/link';
import { AudioPreview } from '../../components/audio/AudioPreview';

// Mock data for demo
const MOCK_SPEAKING_ACTIVITIES = [
  {
    id: '1',
    story_id: 'story-1',
    story_title: 'The Market Visit',
    activity_type: 'pronunciation' as const,
    audio_url: '/demo-speaking-audio.mp3',
    duration: 10,
    analysis_score: 82,
    cefr_level: 'B1',
    created_at: '2025-10-20T10:30:00Z',
    has_analysis: true
  },
  {
    id: '2',
    story_id: 'story-2',
    story_title: 'A Day at School',
    activity_type: 'summary' as const,
    audio_url: '/demo-speaking-audio.mp3',
    duration: 10,
    analysis_score: 75,
    cefr_level: 'A2',
    created_at: '2025-10-19T14:20:00Z',
    has_analysis: true
  },
  {
    id: '3',
    story_id: 'story-3',
    story_title: 'Meeting New Friends',
    activity_type: 'discussion' as const,
    audio_url: '/demo-speaking-audio.mp3',
    duration: 10,
    analysis_score: 88,
    cefr_level: 'B2',
    created_at: '2025-10-18T09:15:00Z',
    has_analysis: true
  },
  {
    id: '4',
    story_id: 'story-4',
    story_title: 'The Lost Puppy',
    activity_type: 'retelling' as const,
    audio_url: '/demo-speaking-audio.mp3',
    duration: 10,
    analysis_score: undefined,
    cefr_level: undefined,
    created_at: '2025-10-17T16:45:00Z',
    has_analysis: false
  }
];

const MOCK_STUDENT = {
  id: 'demo-student',
  name: 'Maria Rodriguez',
  email: 'maria@example.com'
};

const MOCK_SPEAKING_STATS = {
  total_recordings: 12,
  recordings_this_week: 4,
  avg_score: 81.5,
  activities_completed: 8
};

export default function StudentSpeakingDemo() {
  const showOldVersion = false;

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'pronunciation': return '🗣️';
      case 'summary': return '📝';
      case 'discussion': return '💬';
      case 'retelling': return '📖';
      default: return '🎤';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/teacher/dashboard" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{MOCK_STUDENT.name}</h1>
              <p className="text-gray-600">{MOCK_STUDENT.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> This is a demonstration page with mock data showing the UI/UX comparison.
                The new version shows visual-only audio player components (play button is disabled). Toggle between old (link) and new (inline player) versions above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Recordings</div>
            <div className="text-3xl font-bold text-blue-600">{MOCK_SPEAKING_STATS.total_recordings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">This Week</div>
            <div className="text-3xl font-bold text-purple-600">{MOCK_SPEAKING_STATS.recordings_this_week}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Average Score</div>
            <div className="text-3xl font-bold text-green-600">{MOCK_SPEAKING_STATS.avg_score.toFixed(1)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Activities Completed</div>
            <div className="text-3xl font-bold text-amber-600">{MOCK_SPEAKING_STATS.activities_completed}</div>
          </div>
        </div>

        {/* Speaking Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Speaking Activities</h2>
            <p className="text-sm text-gray-600 mt-1">
              {showOldVersion
                ? 'OLD VERSION: Click "Listen" to open audio in new tab'
                : 'NEW VERSION: Inline audio player with controls'}
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {MOCK_SPEAKING_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getActivityIcon(activity.activity_type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.story_title}</h3>
                          <p className="text-sm text-gray-600">
                            {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)} • {formatDuration(activity.duration)}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(activity.created_at)}</p>
                        </div>
                      </div>

                      {/* Audio Player Section */}
                      <div className="mt-4">
                        {showOldVersion ? (
                          // OLD VERSION - Just a link
                          <div className="flex gap-2">
                            <a
                              href={activity.audio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Listen
                            </a>
                            {activity.has_analysis && (
                              <button
                                className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                                onClick={() => alert('Analysis details coming soon!')}
                              >
                                Analysis
                              </button>
                            )}
                          </div>
                        ) : (
                          // NEW VERSION - Inline AudioPreview component
                          <div className="space-y-2">
                            <AudioPreview
                              audioUrl={activity.audio_url}
                              fileName={`${activity.story_title}_${activity.activity_type}.mp3`}
                              onAnalyze={activity.has_analysis ? () => alert('Navigate to detailed analysis page') : undefined}
                              className="w-full"
                              disabled={true}
                            />
                            {activity.has_analysis && (
                              <button
                                className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                                onClick={() => alert('Analysis details coming soon!')}
                              >
                                View Detailed Analysis
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score Display */}
                    <div className="ml-4 text-right">
                      {activity.has_analysis && activity.analysis_score !== undefined ? (
                        <div>
                          <div className={`text-3xl font-bold ${getScoreColor(activity.analysis_score)}`}>
                            {Math.round(activity.analysis_score)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{activity.cefr_level}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          Not analyzed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
