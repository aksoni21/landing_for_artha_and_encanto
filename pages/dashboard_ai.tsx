import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

// Define types
interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  followup?: string[];
}

interface DemoStudent {
  name: string;
  id: string;
  email: string;
  status: string;
  group: string;
  avatar: string;
  progress: number;
  aiNext: string;
  aiSummary: string;
  encouragementSent: boolean;
  reviewAssigned: boolean;
  lastAssignment?: {
    topic: string;
    due: string;
    note: string;
    status: string;
    assignedAt: string;
  };
  avgScore?: number;
  improvement?: number;
  feedback?: string;
  cefr?: string;
}

const TABS = [
  { name: 'Overview', key: 'overview' },
  { name: 'AI Insights', key: 'insights' },
  { name: 'Assignments', key: 'assignments' },
];

const demoStudents: DemoStudent[] = [
  {
    name: 'Maria Lopez',
    id: 'S123',
    email: 'maria@email.com',
    status: 'At Risk',
    group: 'A1',
    avatar: '',
    progress: 0.7,
    aiNext: 'Assign "Travel Conversations" module. Focus on past tense verbs.',
    aiSummary: 'Maria improved in greetings. Needs more practice with travel vocabulary.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
    avgScore: 82,
    improvement: 18,
    feedback: 'Improved clarity in greetings',
    cefr: 'A2'
  },
  {
    name: 'John Smith',
    id: 'S124',
    email: 'john@email.com',
    status: 'Active',
    group: 'B1',
    avatar: '',
    progress: 0.4,
    aiNext: 'Complete "Daily Routines" module with extra practice.',
    aiSummary: 'John needs to work on verb tenses and sentence structure.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
    avgScore: 65,
    improvement: 5,
    feedback: 'Needs more practice with verbs',
    cefr: 'A1'
  },
  {
    name: 'Emily Chen',
    id: 'S125',
    email: 'emily@email.com',
    status: 'Active',
    group: 'A2',
    avatar: '',
    progress: 0.75,
    aiNext: 'Try storytelling prompts for spontaneous speaking.',
    aiSummary: 'Emily has strong pronunciation. Focus on longer sentences.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
    avgScore: 78,
    improvement: 15,
    feedback: 'Better pronunciation',
    cefr: 'A2'
  },
  {
    name: 'Carlos Ruiz',
    id: 'S126',
    email: 'carlos@email.com',
    status: 'At Risk',
    group: 'B1',
    avatar: '',
    progress: 0.5,
    aiNext: 'Advanced grammar module needed. Address minor errors.',
    aiSummary: 'Carlos has excellent fluency but needs work on advanced grammar.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
    avgScore: 90,
    improvement: 22,
    feedback: 'Excellent conversational flow',
    cefr: 'B1'
  },
  {
    name: 'Sofia Patel',
    id: 'S127',
    email: 'sofia@email.com',
    status: 'Active',
    group: 'A1',
    avatar: '',
    progress: 0.2,
    aiNext: 'Daily 5-minute practice sessions recommended.',
    aiSummary: 'Sofia understands basics but needs more speaking practice.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
    avgScore: 60,
    improvement: 2,
    feedback: 'Low participation',
    cefr: 'A1'
  },
  {
    name: 'Liam O\'Brien',
    id: 'S128',
    email: 'liam@email.com',
    status: 'Active',
    group: 'A1',
    avatar: '',
    progress: 0.6,
    aiNext: 'Continue with current curriculum. Good progress.',
    aiSummary: 'Liam shows consistent improvement in basic conversations.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
    avgScore: 70,
    improvement: 10,
    feedback: 'Good progress',
    cefr: 'A1'
  },
];

// Pre-defined AI responses
const aiResponses: Record<string, { answer: string; followup?: string[] }> = {
  "What students need the most help?": {
    answer: "Based on recent performance, Sofia Patel (20% progress) and John Smith (40% progress) need the most attention. Sofia requires daily practice encouragement, while John struggles with verb tenses.",
    followup: ["Show me Sofia's detailed progress", "What exercises would help John?", "Schedule intervention for both"]
  },
  "Give me a summary of class performance": {
    answer: "Class average: 52% progress. 2 students at risk (Maria, Carlos), 4 active. Main challenges: verb tenses (60% of class), vocabulary retention (40%). Strengths: pronunciation improving across all students.",
    followup: ["Show at-risk students", "What are common mistakes?", "Generate weekly report"]
  },
  "What assignments should I give this week?": {
    answer: "Recommended assignments:\n• Maria & Sofia: 'Travel Conversations' with focus on past tense\n• John: 'Daily Routines' with verb conjugation\n• Emily: Advanced storytelling prompts\n• Carlos: Grammar review exercises",
    followup: ["Assign to all students", "Customize by level", "Create homework schedule"]
  },
  "Which students improved the most?": {
    answer: "Emily Chen shows 15% improvement this month with stronger pronunciation. Maria Lopez improved 8% in conversational skills. Carlos maintains high fluency despite grammar challenges.",
    followup: ["Show Emily's progress chart", "What helped Maria improve?", "Reward top performers"]
  }
};

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<DemoStudent[]>(demoStudents);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<DemoStudent | null>(null);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    topic: '',
    due: '',
    note: ''
  });
  const [showAssistant, setShowAssistant] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authed = localStorage.getItem('teacher-auth');
      if (!authed) {
        router.replace('/dashboard-login');
      }
    }
  }, [router]);

  useEffect(() => {
    if (showAssistant && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 200);
    }
  }, [showAssistant]);

  // Filter students by search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!inputValue.trim() && !chatInput.trim()) return;

    const messageText = chatInput || inputValue;
    const userMessage: ChatMessage = { sender: 'user', text: messageText };
    setChatMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setChatInput('');
    setLoading(true);

    setTimeout(() => {
      const response = aiResponses[messageText] || {
        answer: "I can help you analyze student performance, suggest assignments, and identify who needs help. Try asking: 'What students need the most help?' or 'Give me a summary of class performance'",
        followup: ["What students need the most help?", "Give me a summary of class performance", "What assignments should I give this week?"]
      };
      
      const aiMessage: ChatMessage = {
        sender: 'ai',
        text: response.answer,
        followup: response.followup
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleFollowup = (question: string) => {
    setChatInput(question);
    handleSend();
  };

  const handleChatSend = () => {
    if (chatInput.trim()) {
      handleSend();
    }
  };

  const handleAssignWork = (student: DemoStudent) => {
    setSelectedStudent(student);
    setAssignmentModal(true);
  };

  const submitAssignment = () => {
    if (selectedStudent && assignmentData.topic && assignmentData.due) {
      const newAssignment = {
        ...assignmentData,
        status: 'Assigned',
        assignedAt: new Date().toISOString()
      };
      
      setStudents(prev => prev.map(s => 
        s.id === selectedStudent.id 
          ? { ...s, lastAssignment: newAssignment }
          : s
      ));
      
      setAssignmentModal(false);
      setAssignmentData({ topic: '', due: '', note: '' });
      setSelectedStudent(null);
      alert(`Assignment "${assignmentData.topic}" assigned to ${selectedStudent.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and support your students with AI assistance</p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {students.filter(s => s.status === 'At Risk').length}
                </div>
                <div className="text-sm text-gray-500">At Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length * 100)}%
                </div>
                <div className="text-sm text-gray-500">Avg Progress</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`relative flex-1 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.name}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    style={{ zIndex: -1 }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Bar - Only show on Overview tab */}
          {activeTab === 'overview' && (
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search students by name or ID..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Overview Tab - Simple Student Cards */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map(student => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Student Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{student.name}</h3>
                              <p className="text-sm text-gray-500">{student.id}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.status === 'At Risk' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {student.status}
                          </div>
                        </div>

                        {/* Student Details */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            {student.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            Class {student.group}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm text-gray-600">{Math.round(student.progress * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                student.progress >= 0.7 ? 'bg-green-500' :
                                student.progress >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${student.progress * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                              View Profile
                            </button>
                            <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                              AI Insights
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Insights Tab */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* At Risk Students Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Students Needing Attention</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {students.filter(s => s.status === 'At Risk' || s.progress < 0.5).map(student => (
                      <div key={student.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-500">Progress: {Math.round(student.progress * 100)}%</p>
                          </div>
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Needs Help
                          </span>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-900 mb-1">AI Analysis</p>
                              <p className="text-sm text-blue-700">{student.aiSummary}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-medium text-purple-900 mb-1">Recommended Action</p>
                          <p className="text-sm text-purple-700">{student.aiNext}</p>
                        </div>

                        <button 
                          onClick={() => handleAssignWork(student)}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Assign Recommended Work
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class Performance Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length * 100)}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Average Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {students.filter(s => s.progress >= 0.7).length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Performing Well</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {students.filter(s => s.status === 'At Risk').length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Need Support</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Student Assignments</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    + New Assignment
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {students.map(student => (
                    <div key={student.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-500">Class {student.group}</p>
                          </div>
                        </div>

                        {student.lastAssignment ? (
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{student.lastAssignment.topic}</p>
                            <p className="text-xs text-gray-500">Due: {student.lastAssignment.due}</p>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">No active assignment</div>
                        )}

                        <button 
                          onClick={() => handleAssignWork(student)}
                          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Assign Work
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Assistant Chat Bubble Icon - Like dashboard_MVP */}
      {!showAssistant && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300"
          style={{ boxShadow: '0 4px 24px 0 rgba(59, 130, 246, 0.3)' }}
          onClick={() => setShowAssistant(true)}
          aria-label="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </motion.button>
      )}

      {/* AI Assistant Chat Interface - Minimized like dashboard_MVP */}
      {showAssistant && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed bottom-6 right-6 z-50 w-80 max-w-full"
        >
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/20 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-sm">AI Assistant</span>
                </div>
                <button
                  className="text-white/80 hover:text-white text-lg font-bold p-1"
                  onClick={() => setShowAssistant(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="h-[300px] overflow-y-auto p-4 bg-gray-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-3">Ask a question about your students</p>
                  <div className="space-y-2">
                    {Object.keys(aiResponses).slice(0, 2).map(question => (
                      <button
                        key={question}
                        onClick={() => handleFollowup(question)}
                        className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {msg.text}
                    </p>
                    
                    {msg.followup && (
                      <div className="mt-2 space-y-1">
                        {msg.followup.slice(0, 2).map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleFollowup(q)}
                            className="block w-full text-left px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Type your question..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleChatSend(); }}
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
                  onClick={handleChatSend}
                  disabled={!chatInput.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assignment Modal */}
      {assignmentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assign Work to {selectedStudent.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Topic
                </label>
                <input
                  type="text"
                  value={assignmentData.topic}
                  onChange={e => setAssignmentData({...assignmentData, topic: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Travel Conversations Module"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={assignmentData.due}
                  onChange={e => setAssignmentData({...assignmentData, due: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={assignmentData.note}
                  onChange={e => setAssignmentData({...assignmentData, note: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Optional instructions or focus areas..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setAssignmentModal(false);
                  setAssignmentData({ topic: '', due: '', note: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAssignment}
                disabled={!assignmentData.topic || !assignmentData.due}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}