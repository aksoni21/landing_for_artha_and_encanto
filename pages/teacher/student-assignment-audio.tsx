import { useRouter } from 'next/router';
import Link from 'next/link';
import { AudioPreview } from '../../components/audio/AudioPreview';
import { useEffect, useState } from 'react';

// Mock data structure matching the assignment structure
interface SpeakingActivity {
  id: string;
  type: 'pronunciation' | 'summary' | 'discussion';
  audio_url: string;
  duration: number;
  score: number | null;
  completed: boolean;
  created_at: string;
  transcript?: string;
  errors?: Array<{
    type: 'pronunciation' | 'grammar' | 'vocabulary' | 'fluency';
    text: string;
    correction: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export default function StudentAssignmentAudio() {
  const router = useRouter();
  const { studentId, studentName, assignmentId, assignmentTitle } = router.query;

  const [activities, setActivities] = useState<SpeakingActivity[]>([]);

  useEffect(() => {
    // Mock data - in production this would come from an API based on studentId and assignmentId
    // Ordered: summary first, pronunciation middle, discussion last
    setActivities([
      {
        id: '2',
        type: 'summary',
        audio_url: '/demo-speaking-audio.mp3',
        duration: 45,
        score: 75,
        completed: true,
        created_at: '2025-10-25T11:00:00Z',
        transcript: 'The story was about a young girl who discovered a hidden forest behind her school. She meeted many magical creatures there, including talking animals and friendly fairies. The forest teached her important lessons about courage and friendship. She decided to protect the forest secret and visit it regularly.',
        errors: [
          {
            type: 'grammar',
            text: 'she meeted',
            correction: 'she met',
            severity: 'high'
          },
          {
            type: 'grammar',
            text: 'The forest teached her',
            correction: 'The forest taught her',
            severity: 'high'
          },
          {
            type: 'vocabulary',
            text: 'protect the forest secret',
            correction: 'protect the forest\'s secret',
            severity: 'medium'
          },
          {
            type: 'fluency',
            text: 'Long pause before "She decided to protect"',
            correction: 'Practice smoother transitions between sentences',
            severity: 'low'
          }
        ]
      },
      {
        id: '1',
        type: 'pronunciation',
        audio_url: '/demo-speaking-audio.mp3',
        duration: 30,
        score: 80,
        completed: true,
        created_at: '2025-10-25T10:30:00Z',
        transcript: 'The quick brown fox jumps over the lazy dog. She sells seashells by the seashore. How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
        errors: [
          {
            type: 'pronunciation',
            text: 'seashells',
            correction: 'Need to distinguish /s/ and /ʃ/ sounds more clearly',
            severity: 'medium'
          },
          {
            type: 'pronunciation',
            text: 'woodchuck',
            correction: 'The "ch" sound needs to be softer - /tʃ/ not /k/',
            severity: 'medium'
          },
          {
            type: 'pronunciation',
            text: 'quick',
            correction: 'The /kw/ blend could be clearer',
            severity: 'low'
          }
        ]
      },
      {
        id: '3',
        type: 'discussion',
        audio_url: '/demo-speaking-audio.mp3',
        duration: 60,
        score: 82,
        completed: true,
        created_at: '2025-10-25T11:30:00Z',
        transcript: 'I think the main character showed a lot of bravery when she entered the forest alone. In my opinion, the story teaches us that we should be curious about the world around us, but also we need to be careful. The magic elements was interesting, but I wonder if they was necessary for the story message. Overall, I really enjoyed how the author described the forest setting.',
        errors: [
          {
            type: 'grammar',
            text: 'The magic elements was interesting',
            correction: 'The magic elements were interesting',
            severity: 'high'
          },
          {
            type: 'grammar',
            text: 'I wonder if they was necessary',
            correction: 'I wonder if they were necessary',
            severity: 'high'
          },
          {
            type: 'vocabulary',
            text: 'the story message',
            correction: 'the story\'s message',
            severity: 'medium'
          },
          {
            type: 'fluency',
            text: 'but also we need',
            correction: 'Consider "but we also need" for more natural flow',
            severity: 'low'
          }
        ]
      }
    ]);
  }, [studentId, assignmentId]);

  const getScoreColor = (score: number | null) => {
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

  const getActivityTitle = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getErrorIcon = (type: string) => {
    switch(type) {
      case 'pronunciation': return '🗣️';
      case 'grammar': return '📝';
      case 'vocabulary': return '📚';
      case 'fluency': return '⚡';
      default: return '⚠️';
    }
  };

  const getErrorColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/mockups/conferences/teacher" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
                ← Back to Assignments
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {studentName || 'Student'}&apos;s Audio Submissions
              </h1>
              <p className="text-gray-600">{assignmentTitle || 'Assignment'}</p>
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
                <strong>Demo Mode:</strong> This page shows all audio submissions for this student&apos;s assignment.
                Audio players are visual-only (play button is disabled for demo purposes).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Activities</div>
            <div className="text-3xl font-bold text-blue-600">{activities.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">
              {activities.filter(a => a.completed).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Average Score</div>
            <div className="text-3xl font-bold text-purple-600">
              {activities.filter(a => a.score !== null).length > 0
                ? (activities.reduce((sum, a) => sum + (a.score || 0), 0) /
                   activities.filter(a => a.score !== null).length).toFixed(1)
                : '—'}
            </div>
          </div>
        </div>

        {/* Speaking Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Speaking Activities</h2>
            <p className="text-sm text-gray-600 mt-1">
              Audio recordings submitted for this assignment
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{getActivityTitle(activity.type)}</h3>
                          <p className="text-sm text-gray-600">
                            Duration: {formatDuration(activity.duration)}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(activity.created_at)}</p>
                        </div>
                      </div>

                      {/* Audio Player Section */}
                      <div className="mt-4">
                        <div className="space-y-2">
                          <AudioPreview
                            audioUrl={activity.audio_url}
                            fileName={`${studentName}_${assignmentTitle}_${activity.type}.mp3`}
                            onAnalyze={activity.completed && activity.score !== null ? () => alert('Navigate to detailed analysis page') : undefined}
                            className="w-full"
                            disabled={true}
                          />
                          {activity.completed && activity.score !== null && (
                            <button
                              className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                              onClick={() => alert('Analysis details coming soon!')}
                            >
                              View Detailed Analysis
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Transcript Section */}
                      {activity.transcript && (
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Transcript</h4>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {activity.transcript}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Errors Analysis Section */}
                      {activity.errors && activity.errors.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Errors & Corrections ({activity.errors.length})
                          </h4>
                          <div className="space-y-3">
                            {activity.errors.map((error, index) => (
                              <div
                                key={index}
                                className={`border rounded-lg p-3 ${getErrorColor(error.severity)}`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-lg">{getErrorIcon(error.type)}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-semibold uppercase">
                                        {error.type}
                                      </span>
                                      <span className="text-xs px-2 py-0.5 bg-white rounded-full">
                                        {error.severity}
                                      </span>
                                    </div>
                                    <div className="text-sm space-y-1">
                                      <div>
                                        <span className="font-medium">Error: </span>
                                        <span className="line-through">{error.text}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Correction: </span>
                                        <span className="text-green-700 font-medium">{error.correction}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Score Display */}
                    <div className="ml-4 text-right">
                      {activity.completed && activity.score !== null ? (
                        <div>
                          <div className={`text-3xl font-bold ${getScoreColor(activity.score)}`}>
                            {Math.round(activity.score)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.score >= 80 ? 'Excellent' : activity.score >= 60 ? 'Good' : 'Needs Work'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          {activity.completed ? 'Not scored' : 'In progress'}
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
