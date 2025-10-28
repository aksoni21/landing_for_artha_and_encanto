
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import CreateAssignmentModal from './components/CreateAssignmentModal';

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

interface AssignmentItem {
  id: string;
  student_id: string;
  student_name: string;
  assignment_type: 'story' | 'speaking' | 'vocabulary' | 'assessment';
  topic: string;
  due: string;
  note: string;
  status: 'pending' | 'assigned' | 'completed';
}

interface DashboardData {
  snapshot: TodaySnapshot;
  priority_alerts: PriorityAlert[];
  assignments: AssignmentItem[];
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

export default function TeacherConferenceMockup() {
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
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showAssignmentDetail, setShowAssignmentDetail] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);

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
      assignments: []
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
          message: `${student.name} has only ${student.weeklyMinutes} minutes of speaking practice this week.`,
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
          assignments: demoAssignments.filter(a => a.assignment_type === 'story')
        };
      case 'vocabulary':
        return {
          title: 'Vocabulary Practice Today',
          icon: '📖',
          assignments: demoAssignments.filter(a => a.assignment_type === 'vocabulary')
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

  // Detailed assignment tracking with component-level progress
  const detailedAssignments = [
    {
      id: 'assignment-1',
      title: 'Adventure in the Hidden Forest',
      type: 'story',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 8,
      students: [
        {
          id: 'demo-1',
          name: 'Maria Garcia',
          avatar: '👩🏽',
          overall: 75,
          components: {
            reading: { completed: true, score: 85, time: '12 min' },
            listening: { completed: true, score: 90, time: '8 min' },
            vocabulary: { completed: true, wordsLearned: 18, totalWords: 20, score: 90 },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: true, score: 80 },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-2',
          name: 'John Smith',
          avatar: '👨🏻',
          overall: 100,
          components: {
            reading: { completed: true, score: 95, time: '10 min' },
            listening: { completed: true, score: 92, time: '8 min' },
            vocabulary: { completed: true, wordsLearned: 20, totalWords: 20, score: 100 },
            speaking: {
              completed: true,
              summary: { completed: true, score: 88 },
              pronunciation: { completed: true, score: 92 },
              discussion: { completed: true, score: 90 }
            }
          }
        },
        {
          id: 'demo-3',
          name: 'Emily Chen',
          avatar: '👧🏻',
          overall: 50,
          components: {
            reading: { completed: true, score: 78, time: '15 min' },
            listening: { completed: true, score: 82, time: '10 min' },
            vocabulary: { completed: false, wordsLearned: 12, totalWords: 20, score: null },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-4',
          name: 'Carlos Ruiz',
          avatar: '👨🏽',
          overall: 25,
          components: {
            reading: { completed: true, score: 88, time: '9 min' },
            listening: { completed: false, score: null, time: null },
            vocabulary: { completed: false, wordsLearned: 5, totalWords: 20, score: null },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-5',
          name: 'Aisha Patel',
          avatar: '👩🏾',
          overall: 0,
          components: {
            reading: { completed: false, score: null, time: null },
            listening: { completed: false, score: null, time: null },
            vocabulary: { completed: false, wordsLearned: 0, totalWords: 20, score: null },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-6',
          name: 'Liam O\'Brien',
          avatar: '👦🏼',
          overall: 90,
          components: {
            reading: { completed: true, score: 92, time: '11 min' },
            listening: { completed: true, score: 88, time: '9 min' },
            vocabulary: { completed: true, wordsLearned: 19, totalWords: 20, score: 95 },
            speaking: {
              completed: true,
              summary: { completed: true, score: 85 },
              pronunciation: { completed: true, score: 88 },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-7',
          name: 'Sofia Martinez',
          avatar: '👧🏽',
          overall: 38,
          components: {
            reading: { completed: true, score: 75, time: '18 min' },
            listening: { completed: true, score: 70, time: '12 min' },
            vocabulary: { completed: false, wordsLearned: 8, totalWords: 20, score: null },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-8',
          name: 'Ahmed Hassan',
          avatar: '👨🏾',
          overall: 63,
          components: {
            reading: { completed: true, score: 80, time: '14 min' },
            listening: { completed: true, score: 85, time: '10 min' },
            vocabulary: { completed: true, wordsLearned: 15, totalWords: 20, score: 75 },
            speaking: {
              completed: false,
              summary: { completed: true, score: 78 },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        }
      ]
    },
    {
      id: 'assignment-2',
      title: 'Amber at the Conference',
      type: 'story',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 6,
      students: [
        {
          id: 'demo-2',
          name: 'John Smith',
          avatar: '👨🏻',
          overall: 88,
          components: {
            reading: { completed: true, score: 90, time: '13 min' },
            listening: { completed: true, score: 88, time: '10 min' },
            vocabulary: { completed: true, wordsLearned: 22, totalWords: 25, score: 88 },
            speaking: {
              completed: true,
              summary: { completed: true, score: 85 },
              pronunciation: { completed: true, score: 90 },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-4',
          name: 'Carlos Ruiz',
          avatar: '👨🏽',
          overall: 100,
          components: {
            reading: { completed: true, score: 95, time: '11 min' },
            listening: { completed: true, score: 93, time: '9 min' },
            vocabulary: { completed: true, wordsLearned: 25, totalWords: 25, score: 100 },
            speaking: {
              completed: true,
              summary: { completed: true, score: 92 },
              pronunciation: { completed: true, score: 95 },
              discussion: { completed: true, score: 94 }
            }
          }
        },
        {
          id: 'demo-9',
          name: 'Yuki Tanaka',
          avatar: '👩🏻',
          overall: 45,
          components: {
            reading: { completed: true, score: 82, time: '16 min' },
            listening: { completed: true, score: 78, time: '12 min' },
            vocabulary: { completed: false, wordsLearned: 14, totalWords: 25, score: null },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-10',
          name: 'Marco Rossi',
          avatar: '👨🏼',
          overall: 0,
          components: {
            reading: { completed: false, score: null, time: null },
            listening: { completed: false, score: null, time: null },
            vocabulary: { completed: false, wordsLearned: 0, totalWords: 25, score: null },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-3',
          name: 'Emily Chen',
          avatar: '👧🏻',
          overall: 25,
          components: {
            reading: { completed: true, score: 80, time: '14 min' },
            listening: { completed: false, score: null, time: null },
            vocabulary: { completed: false, wordsLearned: 6, totalWords: 25, score: null },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        },
        {
          id: 'demo-6',
          name: 'Liam O\'Brien',
          avatar: '👦🏼',
          overall: 63,
          components: {
            reading: { completed: true, score: 85, time: '12 min' },
            listening: { completed: true, score: 88, time: '9 min' },
            vocabulary: { completed: true, wordsLearned: 20, totalWords: 25, score: 80 },
            speaking: {
              completed: false,
              summary: { completed: false, score: null },
              pronunciation: { completed: false, score: null },
              discussion: { completed: false, score: null }
            }
          }
        }
      ]
    },
    {
      id: 'assignment-3',
      title: 'Short A Vowel Practice',
      type: 'vowel',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 4,
      students: [
        {
          id: 'demo-1',
          name: 'Maria Garcia',
          avatar: '👩',
          overall: 100,
          components: {
            listening: { completed: true, exercises: 15, total: 15, score: 95 },
            pronunciation: { completed: true, attempts: 12, score: 90 },
            recording: { completed: true, score: 88 }
          }
        },
        {
          id: 'demo-7',
          name: 'Sofia Martinez',
          avatar: '👧🏽',
          overall: 67,
          components: {
            listening: { completed: true, exercises: 15, total: 15, score: 85 },
            pronunciation: { completed: true, attempts: 18, score: 78 },
            recording: { completed: false, score: null }
          }
        },
        {
          id: 'demo-8',
          name: 'Ahmed Hassan',
          avatar: '👨🏾',
          overall: 33,
          components: {
            listening: { completed: true, exercises: 15, total: 15, score: 82 },
            pronunciation: { completed: false, attempts: 5, score: null },
            recording: { completed: false, score: null }
          }
        },
        {
          id: 'demo-9',
          name: 'Yuki Tanaka',
          avatar: '👩🏻',
          overall: 0,
          components: {
            listening: { completed: false, exercises: 0, total: 15, score: null },
            pronunciation: { completed: false, attempts: 0, score: null },
            recording: { completed: false, score: null }
          }
        }
      ]
    },
    {
      id: 'assignment-4',
      title: 'Past Simple Tense Practice',
      type: 'grammar',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 5,
      students: [
        {
          id: 'demo-2',
          name: 'John Smith',
          avatar: '👨🏻',
          overall: 100,
          components: {
            exercises: { completed: true, correct: 28, total: 30, score: 93 },
            errorCorrection: { completed: true, correct: 5, total: 5, score: 100 },
            writing: { completed: true, sentences: 5, score: 90 }
          }
        },
        {
          id: 'demo-5',
          name: 'Aisha Patel',
          avatar: '👩🏾',
          overall: 75,
          components: {
            exercises: { completed: true, correct: 24, total: 30, score: 80 },
            errorCorrection: { completed: true, correct: 4, total: 5, score: 80 },
            writing: { completed: false, sentences: 0, score: null }
          }
        },
        {
          id: 'demo-3',
          name: 'Emily Chen',
          avatar: '👧🏻',
          overall: 50,
          components: {
            exercises: { completed: true, correct: 22, total: 30, score: 73 },
            errorCorrection: { completed: false, correct: 0, total: 5, score: null },
            writing: { completed: false, sentences: 0, score: null }
          }
        },
        {
          id: 'demo-10',
          name: 'Marco Rossi',
          avatar: '👨🏼',
          overall: 25,
          components: {
            exercises: { completed: true, correct: 18, total: 30, score: 60 },
            errorCorrection: { completed: false, correct: 0, total: 5, score: null },
            writing: { completed: false, sentences: 0, score: null }
          }
        },
        {
          id: 'demo-4',
          name: 'Carlos Ruiz',
          avatar: '👨🏽',
          overall: 0,
          components: {
            exercises: { completed: false, correct: 0, total: 30, score: null },
            errorCorrection: { completed: false, correct: 0, total: 5, score: null },
            writing: { completed: false, sentences: 0, score: null }
          }
        }
      ]
    }
  ];

  // Generate demo assignments from demo students
  const demoAssignments: AssignmentItem[] = [
    {
      id: 'assignment-1',
      student_id: 'demo-3',
      student_name: 'Emily Chen',
        assignment_type: 'story',
      topic: 'The Lost Key',
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Finish reading and comprehension exercises',
      status: 'pending'
    },
    {
      id: 'assignment-2',
      student_id: 'demo-4',
      student_name: 'Carlos Ruiz',
      assignment_type: 'assessment',
      topic: 'Grammar Assessment',
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Advanced grammar proficiency test',
      status: 'pending'
    },
    {
      id: 'assignment-3',
      student_id: 'demo-1',
      student_name: 'Maria Garcia',
      assignment_type: 'vocabulary',
      topic: 'Practiced 20 new words',
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Past tense verb vocabulary set',
      status: 'pending'
    },
    {
      id: 'assignment-4',
      student_id: 'demo-2',
      student_name: 'John Smith',
      assignment_type: 'story',
      topic: 'A Day at the Beach',
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Reading comprehension practice',
      status: 'pending'
    },
    {
      id: 'assignment-5',
      student_id: 'demo-9',
      student_name: 'Yuki Tanaka',
      assignment_type: 'speaking',
      topic: 'Pronunciation Practice',
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Worked on difficult consonant sounds',
      status: 'pending'
    },
    {
      id: 'assignment-6',
      student_id: 'demo-7',
      student_name: 'Sofia Martinez',
      assignment_type: 'story',
      topic: 'The Market Visit',
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Conversational English practice',
      status: 'pending'
    },
    {
      id: 'assignment-7',
      student_id: 'demo-6',
      student_name: 'Liam O\'Brien',
      assignment_type: 'vocabulary',
      topic: 'Practiced 10 words',
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Basic vocabulary review',
      status: 'pending'
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
            {['overview', 'students', 'assignments', 'insights'].map(tab => (
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
                      ) : content.assignments && content.assignments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {content.assignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => navigateToStudent(assignment.student_id)}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{getActivityIcon(assignment.assignment_type)}</span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-900">{assignment.student_name}</span>
                                    <span className="text-xs text-gray-500">{formatTimeAgo(assignment.due)}</span>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">{assignment.topic}</div>
                                  {assignment.note !== undefined && (
                                    <div className="text-sm">
                                      <span className={`font-medium ${
                                        Number(assignment.note) >= 80 ? 'text-green-600' :
                                        Number(assignment.note) >= 60 ? 'text-yellow-600' :
                                        'text-red-600'
                                      }`}>
                                        Score: {assignment.note}%
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

          {/* Assignments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
                  <p className="text-sm text-gray-600">Recent student assignments</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-semibold">DEMO</span>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {demoAssignments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent assignments
                </p>
              ) : (
                <div className="space-y-4">
                    {demoAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => navigateToStudent(assignment.student_id)}
                    >
                      <span className="text-2xl mr-3">{getActivityIcon(assignment.assignment_type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 truncate">
                            {assignment.student_name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTimeAgo(assignment.due)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{assignment.topic}</div>
                        {assignment.note !== undefined && (
                          <div className="text-sm mt-1">
                            <span className={`font-medium ${
                              Number(assignment.note) >= 80 ? 'text-green-600' :
                              Number(assignment.note) >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {Number(assignment.note)}% score
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

          {/* Assignments Tab */}
          {activeTab === 'assignments' && !showAssignmentDetail && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Demo Badge and Create Button */}
              <div className="mb-6 flex items-center justify-between">
                <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  📊 DEMO MODE - Using mock assignments data
                </div>
                <button
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  Create Assignment
                </button>
              </div>

              {/* Assignment Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {detailedAssignments.map((assignment) => {
                  const completedStudents = assignment.students.filter(s => s.overall === 100).length;
                  const inProgressStudents = assignment.students.filter(s => s.overall > 0 && s.overall < 100).length;
                  const notStartedStudents = assignment.students.filter(s => s.overall === 0).length;
                  const avgProgress = Math.round(assignment.students.reduce((sum, s) => sum + s.overall, 0) / assignment.students.length);

                  const getTypeIcon = (type: string) => {
                    switch (type) {
                      case 'story': return '📚';
                      case 'vowel': return '🗣️';
                      case 'grammar': return '📝';
                      default: return '📋';
                    }
                  };

                  const getTypeColor = (type: string) => {
                    switch (type) {
                      case 'story': return 'bg-blue-100 text-blue-800';
                      case 'vowel': return 'bg-green-100 text-green-800';
                      case 'grammar': return 'bg-orange-100 text-orange-800';
                      default: return 'bg-gray-100 text-gray-800';
                    }
                  };

                  const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 2;

                  return (
                    <div
                      key={assignment.id}
                      className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowAssignmentDetail(true);
                      }}
                    >
                      {/* Header */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{getTypeIcon(assignment.type)}</span>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{assignment.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(assignment.type)}`}>
                                {assignment.type === 'story' ? 'Story' : assignment.type === 'vowel' ? 'Vowel Lesson' : 'Grammar'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Due:</span>
                          <span className={`font-medium ${
                            isOverdue ? 'text-red-600' :
                            isDueSoon ? 'text-orange-600' :
                            'text-gray-900'
                          }`}>
                            {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {isOverdue && ' (Overdue)'}
                            {isDueSoon && ` (${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'})`}
                          </span>
                        </div>
                      </div>

                      {/* Progress Overview */}
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Class Progress</span>
                            <span className="font-bold text-gray-900">{avgProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-500 h-3 rounded-full transition-all"
                              style={{ width: `${avgProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* Student Status Summary */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{completedStudents}</div>
                            <div className="text-xs text-gray-600">Completed</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{inProgressStudents}</div>
                            <div className="text-xs text-gray-600">In Progress</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600">{notStartedStudents}</div>
                            <div className="text-xs text-gray-600">Not Started</div>
                          </div>
                        </div>

                        {/* Student Avatars */}
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {assignment.students.slice(0, 5).map((student, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white"
                                title={student.name}
                              >
                                {student.avatar}
                              </div>
                            ))}
                            {assignment.students.length > 5 && (
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
                                +{assignment.students.length - 5}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {assignment.assignedTo} student{assignment.assignedTo !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div className="px-6 pb-6">
                        <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm">
                          View Detailed Progress →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Assignment Detail View */}
          {activeTab === 'assignments' && showAssignmentDetail && selectedAssignment && (
            <motion.div
              key="assignment-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Back Button and Header */}
              <div className="mb-6">
                <button
                  onClick={() => setShowAssignmentDetail(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                  <span>←</span>
                  <span>Back to Assignments</span>
                </button>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAssignment.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Due: {new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{selectedAssignment.assignedTo} students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Student Progress Table */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Student Progress Breakdown</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Overall</th>
                        {selectedAssignment.type === 'story' && (
                          <>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Reading</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Listening</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Vocabulary</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Speaking</th>
                          </>
                        )}
                        {selectedAssignment.type === 'vowel' && (
                          <>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Listening</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Pronunciation</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Recording</th>
                          </>
                        )}
                        {selectedAssignment.type === 'grammar' && (
                          <>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Exercises</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Error Correction</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Writing</th>
                          </>
                        )}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedAssignment.students.map((student: any) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{student.avatar}</span>
                              <div className="font-medium text-gray-900">{student.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className={`text-lg font-bold ${
                                student.overall === 100 ? 'text-green-600' :
                                student.overall >= 50 ? 'text-yellow-600' :
                                student.overall > 0 ? 'text-orange-600' :
                                'text-gray-400'
                              }`}>
                                {student.overall}%
                              </div>
                            </div>
                          </td>

                          {/* Story Components */}
                          {selectedAssignment.type === 'story' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.reading.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.reading.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.reading.time}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.listening.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.listening.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.listening.time}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.vocabulary.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.vocabulary.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.vocabulary.wordsLearned}/{student.components.vocabulary.totalWords} words</div>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-orange-600">In Progress</span>
                                    <div className="text-xs text-gray-500">{student.components.vocabulary.wordsLearned}/{student.components.vocabulary.totalWords} words</div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span>Summary:</span>
                                    <span className={student.components.speaking.summary.completed ? 'text-green-600' : 'text-gray-400'}>
                                      {student.components.speaking.summary.completed ? `✓ ${student.components.speaking.summary.score}` : '—'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Pronunciation:</span>
                                    <span className={student.components.speaking.pronunciation.completed ? 'text-green-600' : 'text-gray-400'}>
                                      {student.components.speaking.pronunciation.completed ? `✓ ${student.components.speaking.pronunciation.score}` : '—'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Discussion:</span>
                                    <span className={student.components.speaking.discussion.completed ? 'text-green-600' : 'text-gray-400'}>
                                      {student.components.speaking.discussion.completed ? `✓ ${student.components.speaking.discussion.score}` : '—'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </>
                          )}

                          {/* Vowel Components */}
                          {selectedAssignment.type === 'vowel' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.listening.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.listening.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.listening.exercises}/{student.components.listening.total}</div>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-gray-400">—</span>
                                    <div className="text-xs text-gray-500">{student.components.listening.exercises}/{student.components.listening.total}</div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.pronunciation.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.pronunciation.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.pronunciation.attempts} attempts</div>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-orange-600">In Progress</span>
                                    <div className="text-xs text-gray-500">{student.components.pronunciation.attempts} attempts</div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.recording.completed ? (
                                  <div className="text-green-600 font-medium">✓ {student.components.recording.score}</div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                            </>
                          )}

                          {/* Grammar Components */}
                          {selectedAssignment.type === 'grammar' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.exercises.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.exercises.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.exercises.correct}/{student.components.exercises.total}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.errorCorrection.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.errorCorrection.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.errorCorrection.correct}/{student.components.errorCorrection.total}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {student.components.writing.completed ? (
                                  <div>
                                    <div className="text-green-600 font-medium">✓ {student.components.writing.score}</div>
                                    <div className="text-xs text-gray-500">{student.components.writing.sentences} sentences</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                            </>
                          )}

                          {/* Actions Column - View Audio Files */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success(`Opening audio files for ${student.name}...`, {
                                  icon: '🎤',
                                  duration: 2000
                                });
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <span>🎤</span>
                              <span>View Audio</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

        {/* Create Assignment Modal */}
        <CreateAssignmentModal
          isOpen={showCreateAssignmentModal}
          onClose={() => setShowCreateAssignmentModal(false)}
          students={students}
        />
      </div>
    </div>
  );
}
