import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

// Types
interface TodaySnapshot {
  active_today: number;
  stories_read: number;
  speaking_sessions: number;
  vocabulary_practiced: number;
  at_risk_count: number;
  completed_stories: number;
  in_progress: number;
}

interface PriorityAlert {
  id: string;
  student_id: string;
  student_name: string;
  alert_type: 'inactive' | 'declining' | 'pending_review' | 'no_speaking_practice';
  message: string;
  severity: 'high' | 'medium' | 'low';
  created_at: string;
}

interface ActivityFeedItem {
  id: string;
  student_id: string;
  student_name: string;
  activity_type: 'story_completed' | 'speaking_session' | 'vocabulary_practice' | 'assessment';
  title: string;
  description: string;
  score?: number;
  timestamp: string;
}

interface DashboardData {
  snapshot: TodaySnapshot;
  priority_alerts: PriorityAlert[];
  activity_feed: ActivityFeedItem[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  progress: number;
  avgScore: number;
  toefl: number;
  weeklyMinutes: number;
  lastActivity: string;
  storiesCompleted: number;
  strugglingWith: string;
  strength: string;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  followup?: string[];
}

export default function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // New state for enhanced features
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [assignmentForm, setAssignmentForm] = useState({ topic: '', due: '', note: '' });
  const [showSnapshotDetails, setShowSnapshotDetails] = useState(false);
  const [snapshotDetailsType, setSnapshotDetailsType] = useState<string>('');
  const chatInputRef = useRef<HTMLInputElement>(null);

  // DEMO MODE: Using static demo data instead of API calls
  useEffect(() => {
    // Set demo data immediately
    setData({
      snapshot: {
        active_today: 7,
        stories_read: 24,
        speaking_sessions: 15,
        vocabulary_practiced: 75,
        at_risk_count: 3,
        completed_stories: 15,
        in_progress: 9
      },
      priority_alerts: [],
      activity_feed: []
    });
    setLoading(false);
  }, []);

  // COMMENTED OUT - API fetch not needed for demo
  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(
  //       `/api/teacher/dashboard?teacher_id=${teacherId}`
  //     );
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setData(data);
  //   } catch (error) {
  //     console.error('Failed to fetch dashboard data:', error);
  //     setError('Failed to load dashboard data. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const navigateToStudent = (studentId: string) => {
    router.push(`/teacher/student/${studentId}/stories`);
  };

  // Demo students fallback data
  const demoStudents: Student[] = [
    { id: 'demo-1', name: 'Maria Garcia', email: 'maria@demo.com', status: 'Active', progress: 78, avgScore: 82, toefl: 65, weeklyMinutes: 45, lastActivity: '2025-03-20', storiesCompleted: 8, strugglingWith: 'Past tense verbs', strength: 'Vocabulary retention' },
    { id: 'demo-2', name: 'John Smith', email: 'john@demo.com', status: 'Active', progress: 45, avgScore: 65, toefl: 95, weeklyMinutes: 28, lastActivity: '2025-03-18', storiesCompleted: 3, strugglingWith: 'Verb tenses', strength: 'Basic vocabulary' },
    { id: 'demo-3', name: 'Emily Chen', email: 'emily@demo.com', status: 'At Risk', progress: 85, avgScore: 88, toefl: 85, weeklyMinutes: 52, lastActivity: '2025-03-21', storiesCompleted: 12, strugglingWith: 'Complex sentences', strength: 'Pronunciation' },
    { id: 'demo-4', name: 'Carlos Ruiz', email: 'carlos@demo.com', status: 'Active', progress: 92, avgScore: 90, toefl: 95, weeklyMinutes: 12, lastActivity: '2025-03-21', storiesCompleted: 15, strugglingWith: 'Advanced grammar', strength: 'Conversational flow' },
    { id: 'demo-6', name: 'Liam O\'Brien', email: 'liam@demo.com', status: 'At Risk', progress: 38, avgScore: 58, toefl: 82, weeklyMinutes: 18, lastActivity: '2025-03-15', storiesCompleted: 2, strugglingWith: 'Listening comprehension', strength: 'Writing skills' },
    { id: 'demo-7', name: 'Sofia Martinez', email: 'sofia@demo.com', status: 'Active', progress: 72, avgScore: 79, toefl: 48, weeklyMinutes: 48, lastActivity: '2025-03-19', storiesCompleted: 9, strugglingWith: 'Speaking fluency', strength: 'Grammar accuracy' },
    { id: 'demo-9', name: 'Yuki Tanaka', email: 'yuki@demo.com', status: 'Active', progress: 18, avgScore: 75, toefl: 62, weeklyMinutes: 42, lastActivity: '2025-03-18', storiesCompleted: 7, strugglingWith: 'Pronunciation', strength: 'Vocabulary breadth' },
  ];

  // DEMO MODE: Load demo students immediately
  useEffect(() => {
    setStudents(demoStudents);
  }, []);

  // COMMENTED OUT - API fetch not needed for demo
  // const fetchStudentsData = async () => {
  //   setStudents(demoStudents);
  // };

  // AI Chat handler
  const handleAIChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        sender: 'ai',
        text: 'Based on the data, I recommend focusing on students with declining participation. Maria and John need attention this week.',
        followup: ['Show me at-risk students', 'What assignments should I give?', 'Generate weekly report']
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  // Assignment handler
  const handleAssignWork = (student: Student) => {
    setSelectedStudent(student);
    setShowAssignmentModal(true);
  };

  const submitAssignment = () => {
    if (!selectedStudent || !assignmentForm.topic || !assignmentForm.due) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, you would send this to your backend API
    // const newAssignment = { topic, due, note, studentId, status: 'Assigned' }
    // await fetch('/api/assignments', { method: 'POST', body: JSON.stringify(newAssignment) })

    setShowAssignmentModal(false);
    setAssignmentForm({ topic: '', due: '', note: '' });
    toast.success(`Assignment "${assignmentForm.topic}" assigned to ${selectedStudent.name}`);
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = students.map(s => `${s.name},${s.email},${s.status},${s.progress},${s.avgScore}`).join('\n');
    const blob = new Blob([`Name,Email,Status,Progress,Avg Score\n${csvData}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students-report.csv';
    a.click();
    toast.success('Report downloaded successfully');
  };

  // Filter students based on search and tab
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate priority alerts from demo students
  const generatePriorityAlerts = (): PriorityAlert[] => {
    const alerts: PriorityAlert[] = [];

    students.forEach(student => {
      // Check for at-risk students
      if (student.status === 'At Risk') {
        alerts.push({
          id: `alert-${student.id}-risk`,
          student_id: student.id,
          student_name: student.name,
          alert_type: 'declining',
          message: `${student.name} is at risk with ${student.progress}% progress. Needs immediate attention.`,
          severity: 'high',
          created_at: new Date().toISOString()
        });
      }

      // Check for inactive students (low weekly minutes)
      if (student.weeklyMinutes < 15) {
        alerts.push({
          id: `alert-${student.id}-inactive`,
          student_id: student.id,
          student_name: student.name,
          alert_type: 'inactive',
          message: `${student.name} has only ${student.weeklyMinutes} minutes of activity this week.`,
          severity: student.weeklyMinutes < 15 ? 'high' : 'medium',
          created_at: new Date().toISOString()
        });
      }

      // Check for low TOEFL scores
      if (student.toefl < 50) {
        alerts.push({
          id: `alert-${student.id}-toefl`,
          student_id: student.id,
          student_name: student.name,
          alert_type: 'pending_review',
          message: `${student.name} has a low TOEFL score (${student.toefl}/120). Consider additional support.`,
          severity: 'medium',
          created_at: new Date().toISOString()
        });
      }
    });

    // Sort by severity and return top alerts
    return alerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }).slice(0, 5);
  };

  const demoAlerts = generatePriorityAlerts();

  // Handle snapshot card clicks
  const handleSnapshotClick = (type: string) => {
    if (snapshotDetailsType === type && showSnapshotDetails) {
      // If clicking the same card, toggle it closed
      setShowSnapshotDetails(false);
      setSnapshotDetailsType('');
    } else {
      // Otherwise, show the new details
      setSnapshotDetailsType(type);
      setShowSnapshotDetails(true);
    }
  };

  // Get snapshot details content based on type
  const getSnapshotDetailsContent = () => {
    switch (snapshotDetailsType) {
      case 'active':
        return {
          title: 'Students Active Today',
          icon: '🟢',
          students: students.filter(s => s.status === 'Active')
        };
      case 'at_risk':
        return {
          title: 'At Risk Students',
          icon: '⚠️',
          students: students.filter(s => s.status === 'At Risk')
        };
      case 'stories':
        return {
          title: 'Stories Read Today',
          icon: '📚',
          activities: demoActivityFeed.filter(a => a.activity_type === 'story_completed')
        };
      case 'vocabulary':
        return {
          title: 'Vocabulary Practice Today',
          icon: '📖',
          activities: demoActivityFeed.filter(a => a.activity_type === 'vocabulary_practice')
        };
      case 'completed':
        return {
          title: 'Completed Stories',
          icon: '✅',
          students: students.filter(s => s.storiesCompleted > 0).sort((a, b) => b.storiesCompleted - a.storiesCompleted)
        };
      case 'in_progress':
        return {
          title: 'Students with Stories in Progress',
          icon: '⏳',
          students: students.filter(s => s.progress < 100 && s.progress > 0)
        };
      default:
        return { title: '', icon: '', students: [] };
    }
  };

  // Generate demo activity feed from demo students
  const demoActivityFeed: ActivityFeedItem[] = [
    {
      id: 'activity-1',
      student_id: 'demo-3',
      student_name: 'Emily Chen',
      activity_type: 'story_completed',
      title: 'Completed "The Lost Key"',
      description: 'Finished reading and comprehension exercises',
      score: 88,
      timestamp: new Date(Date.now() - 15 * 60000).toISOString() // 15 mins ago
    },
    {
      id: 'activity-2',
      student_id: 'demo-4',
      student_name: 'Carlos Ruiz',
      activity_type: 'assessment',
      title: 'Completed Grammar Assessment',
      description: 'Advanced grammar proficiency test',
      score: 92,
      timestamp: new Date(Date.now() - 45 * 60000).toISOString() // 45 mins ago
    },
    {
      id: 'activity-3',
      student_id: 'demo-1',
      student_name: 'Maria Garcia',
      activity_type: 'vocabulary_practice',
      title: 'Practiced 20 new words',
      description: 'Past tense verb vocabulary set',
      score: 85,
      timestamp: new Date(Date.now() - 90 * 60000).toISOString() // 1.5 hours ago
    },
    {
      id: 'activity-4',
      student_id: 'demo-2',
      student_name: 'John Smith',
      activity_type: 'story_completed',
      title: 'Completed "A Day at the Beach"',
      description: 'Reading comprehension practice',
      score: 68,
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() // 2 hours ago
    },
    {
      id: 'activity-5',
      student_id: 'demo-9',
      student_name: 'Yuki Tanaka',
      activity_type: 'speaking_session',
      title: 'Pronunciation Practice',
      description: 'Worked on difficult consonant sounds',
      score: 74,
      timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString() // 3 hours ago
    },
    {
      id: 'activity-6',
      student_id: 'demo-7',
      student_name: 'Sofia Martinez',
      activity_type: 'story_completed',
      title: 'Completed "The Market Visit"',
      description: 'Conversational English practice',
      score: 79,
      timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString() // 4 hours ago
    },
    {
      id: 'activity-7',
      student_id: 'demo-6',
      student_name: 'Liam O\'Brien',
      activity_type: 'vocabulary_practice',
      title: 'Practiced 10 words',
      description: 'Basic vocabulary review',
      score: 60,
      timestamp: new Date(Date.now() - 20 * 60 * 60000).toISOString() // 20 hours ago
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'inactive': return '😴';
      case 'declining': return '📉';
      case 'pending_review': return '⏳';
      case 'no_speaking_practice': return '🎤';
      default: return '⚠️';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'story_completed': return '📚';
      case 'speaking_session': return '🎤';
      case 'vocabulary_practice': return '📖';
      case 'assessment': return '✅';
      default: return '📝';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEMO MODE: No error handling needed
  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 p-6">
  //       <div className="max-w-7xl mx-auto">
  //         <div className="bg-red-50 border border-red-200 rounded-md p-4">
  //           <div className="flex">
  //             <div className="ml-3">
  //               <h3 className="text-sm font-medium text-red-800">Error</h3>
  //               <div className="mt-2 text-sm text-red-700">
  //                 <p>{error}</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Your unified command center</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Export CSV
              </button>
              {/* <Link
                href="/teacher/students"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                View All Students
              </Link> */}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow">
            {['overview', 'students', 'activity', 'insights'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
        {/* Today's Snapshot */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Snapshot</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div
              onClick={() => handleSnapshotClick('active')}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-xs text-gray-500">🟢 Students Active</div>
            </div>
            <div
              onClick={() => handleSnapshotClick('stories')}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-500">📚 Stories Read</div>
            </div>
            <div
              onClick={() => handleSnapshotClick('vocabulary')}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl font-bold text-indigo-600">75</div>
              <div className="text-xs text-gray-500">📖 Words</div>
            </div>
            <div
              onClick={() => handleSnapshotClick('at_risk')}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-xs text-gray-500">⚠️ At Risk</div>
            </div>
            <div
              onClick={() => handleSnapshotClick('completed')}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl font-bold text-teal-600">15</div>
              <div className="text-xs text-gray-500">✅ Completed</div>
            </div>
            <div
              onClick={() => handleSnapshotClick('in_progress')}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl font-bold text-yellow-600">9</div>
              <div className="text-xs text-gray-500">⏳ In Progress</div>
            </div>
          </div>
        </div>

        {/* Snapshot Details - Expandable Section */}
        <AnimatePresence>
          {showSnapshotDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              {(() => {
                const content = getSnapshotDetailsContent();
                return (
                  <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{content.icon}</span>
                        <h3 className="text-xl font-bold text-white">{content.title}</h3>
                      </div>
                      <button
                        onClick={() => setShowSnapshotDetails(false)}
                        className="text-white text-2xl hover:text-gray-200 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6">
                      {content.students && content.students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {content.students.map((student) => (
                            <div
                              key={student.id}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => navigateToStudent(student.id)}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{student.name}</h4>
                                  <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {student.status}
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Progress:</span>
                                  <span className="font-medium">{student.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Avg Score:</span>
                                  <span className="font-medium">{student.avgScore}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">TOEFL:</span>
                                  <span className="font-medium">{student.toefl}/120</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Stories:</span>
                                  <span className="font-medium">{student.storiesCompleted}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : content.activities && content.activities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {content.activities.map((activity) => (
                            <div
                              key={activity.id}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => navigateToStudent(activity.student_id)}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{getActivityIcon(activity.activity_type)}</span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-gray-900">{activity.student_name}</span>
                                    <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">{activity.title}</div>
                                  {activity.score !== undefined && (
                                    <div className="text-sm">
                                      <span className={`font-medium ${
                                        activity.score >= 80 ? 'text-green-600' :
                                        activity.score >= 60 ? 'text-yellow-600' :
                                        'text-red-600'
                                      }`}>
                                        Score: {activity.score}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No data available
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Priority Alerts
                    {demoAlerts.length > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {demoAlerts.length}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600">What needs your attention now</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-semibold">DEMO</span>
              </div>
            </div>
            <div className="p-6">
              {demoAlerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  🎉 Great! No alerts at the moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {demoAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getAlertColor(alert.severity)}`}
                      onClick={() => navigateToStudent(alert.student_id)}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{getAlertIcon(alert.alert_type)}</span>
                        <div className="flex-1">
                          <div className="font-medium">{alert.student_name}</div>
                          <div className="text-sm mt-1">{alert.message}</div>
                          <div className="text-xs mt-2 opacity-75">
                            Just now
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
                  <p className="text-sm text-gray-600">Recent student activities</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-semibold">DEMO</span>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {demoActivityFeed.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-4">
                  {demoActivityFeed.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => navigateToStudent(activity.student_id)}
                    >
                      <span className="text-2xl mr-3">{getActivityIcon(activity.activity_type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 truncate">
                            {activity.student_name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{activity.title}</div>
                        {activity.score !== undefined && (
                          <div className="text-sm mt-1">
                            <span className={`font-medium ${
                              activity.score >= 80 ? 'text-green-600' :
                              activity.score >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {activity.score}% score
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/teacher/stories"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-2">📚</div>
            <div className="font-semibold text-gray-900">Stories Analytics</div>
            <div className="text-sm text-gray-600 mt-1">
              View all story performance metrics
            </div>
          </Link>
          <Link
            href="/teacher/students"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-2">👥</div>
            <div className="font-semibold text-gray-900">All Students</div>
            <div className="text-sm text-gray-600 mt-1">
              View complete student roster
            </div>
          </Link>
          <Link
            href="/teacher/stories"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-2">📊</div>
            <div className="font-semibold text-gray-900">Reports</div>
            <div className="text-sm text-gray-600 mt-1">
              Detailed analytics and insights
            </div>
          </Link>
        </div>
              </motion.div>
            )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Demo Badge */}
              <div className="mb-4 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                📊 DEMO MODE - Using demo student data
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Student Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map(student => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium text-gray-900">{student.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg Score:</span>
                        <span className="font-medium text-gray-900">{student.avgScore}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TOEFL Score:</span>
                        <span className="font-medium text-gray-900">{student.toefl}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowStudentModal(true);
                        }}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleAssignWork(student)}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium"
                      >
                        Assign Work
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Demo Badge */}
              <div className="mb-4 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                📊 DEMO MODE - Using mock activity data
              </div>

              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Activity Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { day: 'Mon', active: 12, stories: 8, speaking: 15 },
                    { day: 'Tue', active: 15, stories: 10, speaking: 18 },
                    { day: 'Wed', active: 18, stories: 12, speaking: 20 },
                    { day: 'Thu', active: 16, stories: 11, speaking: 19 },
                    { day: 'Fri', active: 14, stories: 9, speaking: 17 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#3b82f6" name="Active Students" />
                    <Line type="monotone" dataKey="stories" stroke="#10b981" name="Stories Read" />
                    <Line type="monotone" dataKey="speaking" stroke="#8b5cf6" name="Speaking Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                {demoActivityFeed.map(activity => (
                  <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg mb-2 cursor-pointer" onClick={() => navigateToStudent(activity.student_id)}>
                    <span className="text-2xl mr-3">{getActivityIcon(activity.activity_type)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.student_name}</div>
                      <div className="text-sm text-gray-600">{activity.title}</div>
                      {activity.score !== undefined && (
                        <span className={`text-sm font-medium ${
                          activity.score >= 80 ? 'text-green-600' : activity.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {activity.score}% score
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Demo Badge */}
              <div className="mb-4 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                📊 DEMO MODE - Using demo student data
              </div>

              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={students}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" fill="#3b82f6" name="Progress %" />
                    <Bar dataKey="avgScore" fill="#10b981" name="Avg Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {students.filter(s => s.status === 'At Risk' || s.progress < 60).map(student => (
                  <div key={student.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">Progress: {student.progress}%</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Needs Help
                      </span>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">Struggling With</p>
                      <p className="text-sm text-blue-700">{student.strugglingWith}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-green-900 mb-1">Strength</p>
                      <p className="text-sm text-green-700">{student.strength}</p>
                    </div>

                    <button
                      onClick={() => handleAssignWork(student)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Assign Recommended Work
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating AI Chat Button */}
        {!showAIChat && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowAIChat(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.button>
        )}

        {/* AI Chat Modal */}
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl z-50"
          >
            <div className="bg-blue-600 px-4 py-3 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">AI Assistant</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded font-semibold">DEMO</span>
              </div>
              <button onClick={() => setShowAIChat(false)} className="text-white hover:text-gray-200">
                ✕
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-sm mb-2">
                    Ask me anything about your students or teaching strategies!
                  </div>
                  <div className="text-xs text-yellow-700 bg-yellow-50 rounded px-3 py-2 inline-block">
                    Note: Currently using demo responses
                  </div>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.followup && (
                    <div className="mt-2 space-y-1">
                      {msg.followup.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setChatInput(q);
                            handleAIChatSend();
                          }}
                          className="block text-xs text-blue-600 hover:underline"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAIChatSend()}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAIChatSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Student Detail Modal */}
        <AnimatePresence>
          {showStudentModal && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                  <button onClick={() => setShowStudentModal(false)} className="text-white text-2xl">
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{selectedStudent.progress}%</div>
                      <div className="text-sm text-gray-600">Progress</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{selectedStudent.avgScore}</div>
                      <div className="text-sm text-gray-600">Avg Score</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{selectedStudent.toefl}/120</div>
                      <div className="text-sm text-gray-600">TOEFL Score</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">{selectedStudent.weeklyMinutes}</div>
                      <div className="text-sm text-gray-600">Weekly Minutes</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <h4 className="font-semibold text-red-900 mb-1">Struggling With</h4>
                      <p className="text-red-700">{selectedStudent.strugglingWith}</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <h4 className="font-semibold text-green-900 mb-1">Strength</h4>
                      <p className="text-green-700">{selectedStudent.strength}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/teacher/student-speaking-demo"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      🎤 Go to Audio 
                    </Link>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          toast.success(`Message sent to ${selectedStudent.name}`);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() => {
                          handleAssignWork(selectedStudent);
                          setShowStudentModal(false);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                      >
                        Assign Work
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Assignment Modal */}
        <AnimatePresence>
          {showAssignmentModal && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-md w-full"
              >
                <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Assign Work to {selectedStudent.name}</h2>
                  <button onClick={() => setShowAssignmentModal(false)} className="text-white text-2xl">
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                      <input
                        type="text"
                        value={assignmentForm.topic}
                        onChange={(e) => setAssignmentForm({...assignmentForm, topic: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Past Tense Practice"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={assignmentForm.due}
                        onChange={(e) => setAssignmentForm({...assignmentForm, due: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={assignmentForm.note}
                        onChange={(e) => setAssignmentForm({...assignmentForm, note: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Additional instructions..."
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowAssignmentModal(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAssignment}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
