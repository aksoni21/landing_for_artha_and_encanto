import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { name: 'Overview', key: 'overview' },
  { name: 'Engagement', key: 'engagement' },
  { name: 'Outcomes', key: 'outcomes' },
];

const demoStudents = [
  { name: 'Maria Lopez', id: 'S123', email: 'maria@email.com', status: 'Active', group: 'A1' },
  { name: 'John Smith', id: 'S124', email: 'john@email.com', status: 'Inactive', group: 'B1' },
  { name: 'Emily Chen', id: 'S125', email: 'emily@email.com', status: 'Active', group: 'A1' },
  { name: 'Carlos Ruiz', id: 'S126', email: 'carlos@email.com', status: 'Active', group: 'B1' },
  { name: 'Sofia Patel', id: 'S127', email: 'sofia@email.com', status: 'Inactive', group: 'A1' },
  { name: 'Liam O’Brien', id: 'S128', email: 'liam@email.com', status: 'Active', group: 'A1' },
  { name: 'Ava Müller', id: 'S129', email: 'ava@email.com', status: 'Active', group: 'B1' },
  { name: 'Lucas Kim', id: 'S130', email: 'lucas@email.com', status: 'Inactive', group: 'A1' },
  { name: 'Olivia Rossi', id: 'S131', email: 'olivia@email.com', status: 'Active', group: 'B1' },
  { name: 'Noah Dubois', id: 'S132', email: 'noah@email.com', status: 'Active', group: 'A1' },
];

const demoEngagement = [
  { name: 'Maria Lopez', sessions: 5, avgDuration: 14, lessons: '80%', lastLogin: '2024-07-13' },
  { name: 'John Smith', sessions: 2, avgDuration: 8, lessons: '40%', lastLogin: '2024-07-08' },
  { name: 'Emily Chen', sessions: 4, avgDuration: 12, lessons: '75%', lastLogin: '2024-07-12' },
  { name: 'Carlos Ruiz', sessions: 6, avgDuration: 15, lessons: '90%', lastLogin: '2024-07-14' },
  { name: 'Sofia Patel', sessions: 1, avgDuration: 7, lessons: '20%', lastLogin: '2024-07-05' },
];

const demoOutcomes = [
  { name: 'Maria Lopez', avgScore: 82, improvement: 18, feedback: 'Improved clarity in greetings', cefr: 'A2' },
  { name: 'John Smith', avgScore: 65, improvement: 5, feedback: 'Needs more practice with verbs', cefr: 'A1' },
  { name: 'Emily Chen', avgScore: 78, improvement: 15, feedback: 'Better pronunciation', cefr: 'A2' },
  { name: 'Carlos Ruiz', avgScore: 90, improvement: 22, feedback: 'Excellent conversational flow', cefr: 'B1' },
  { name: 'Sofia Patel', avgScore: 60, improvement: 2, feedback: 'Low participation', cefr: 'A1' },
];

const aiRecommendations = [
  {
    name: 'Maria Lopez',
    strengths: 'Great improvement in greetings and conversational flow.',
    focus: 'Practice past tense verbs and expand vocabulary on travel topics.',
    nextStep: 'Try the "Travel Conversations" module and focus on verb conjugation exercises.'
  },
  {
    name: 'John Smith',
    strengths: 'Good basic vocabulary.',
    focus: 'Needs more practice with verb tenses and sentence structure.',
    nextStep: 'Repeat the "Daily Routines" module and complete extra grammar quizzes.'
  },
  {
    name: 'Emily Chen',
    strengths: 'Pronunciation and listening skills are strong.',
    focus: 'Work on spontaneous speaking and longer sentences.',
    nextStep: 'Join more open-ended conversation sessions and try storytelling prompts.'
  },
  {
    name: 'Carlos Ruiz',
    strengths: 'Excellent fluency and confidence.',
    focus: 'Minor errors in advanced grammar.',
    nextStep: 'Attempt the "Advanced Dialogues" module and review grammar notes.'
  },
  {
    name: 'Sofia Patel',
    strengths: 'Understands basic phrases.',
    focus: 'Needs to participate more and practice speaking aloud.',
    nextStep: 'Encourage daily 5-minute practice and use the pronunciation tool.'
  },
];

const aiSampleQuestions = [
  'Give me examples of when Carlos makes advanced grammar mistakes',
  'List all students who improved their pronunciation in the last month',
  'Show me quiz results for Emily Chen',
  'Which students haven’t practiced in the last 7 days?',
  'Summarize John’s progress on the A1 modules',
];

const aiDemoAnswers: Record<string, { answer: string; examples?: string[]; followup?: string[] }> = {
  'Give me examples of when Carlos makes advanced grammar mistakes': {
    answer: 'Carlos made advanced grammar mistakes in the following sessions:',
    examples: [
      'Session 2024-07-10: Used "goed" instead of "went" in past tense.',
      'Session 2024-07-12: Incorrect word order in subordinate clause.',
      'Session 2024-07-14: Missed agreement in gender for adjectives.'
    ],
    followup: ['Show more examples', 'Show only last week', 'Show for other students']
  },
  'List all students who improved their pronunciation in the last month': {
    answer: 'The following students showed significant pronunciation improvement:',
    examples: ['Maria Lopez', 'Emily Chen', 'Carlos Ruiz'],
    followup: ['Show pronunciation scores', 'Show for group A1']
  },
  'Show me quiz results for Emily Chen': {
    answer: 'Emily Chen’s recent quiz scores:',
    examples: ['Quiz 1: 75%', 'Quiz 2: 80%', 'Quiz 3: 78%'],
    followup: ['Show quiz trends', 'Compare with class average']
  },
  'Which students haven’t practiced in the last 7 days?': {
    answer: 'The following students have not practiced in the last 7 days:',
    examples: ['John Smith', 'Sofia Patel', 'Lucas Kim'],
    followup: ['Send reminder', 'Show engagement history']
  },
  'Summarize John’s progress on the A1 modules': {
    answer: 'John Smith completed 3/5 A1 modules. Needs more practice with verb tenses.',
    examples: ['Module 1: Complete', 'Module 2: Incomplete', 'Module 3: Complete'],
    followup: ['Show module details', 'Show for other students']
  },
};

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<null | { answer: string; examples?: string[]; followup?: string[] }>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authed = localStorage.getItem('teacher-auth');
      if (!authed) {
        router.replace('/dashboard-login');
      }
    }
  }, [router]);

  // Filter students by search
  const filteredStudents = demoStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  // Handle AI submit
  const handleAISubmit = (q: string) => {
    setAiLoading(true);
    setAiInput(q);
    setTimeout(() => {
      setAiAnswer(aiDemoAnswers[q] || { answer: 'Sorry, I could not find an answer for that question (demo).' });
      setAiLoading(false);
    }, 900);
  };

  // Scroll to Outcomes tab and open AI box
  const jumpToAI = (question?: string) => {
    setActiveTab('outcomes');
    setShowAssistant(false);
    setTimeout(() => {
      if (question) {
        setAiInput(question);
        handleAISubmit(question);
      }
      const aiBox = document.getElementById('ai-assistant-box');
      if (aiBox) aiBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Handle chat send
  const handleChatSend = () => {
    if (chatInput.trim()) {
      jumpToAI(chatInput.trim());
      setChatInput('');
    }
  };

  // Focus chat input when chat opens
  useEffect(() => {
    if (showAssistant && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 200);
    }
  }, [showAssistant]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor student engagement and learning outcomes</p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{demoStudents.length}</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {demoStudents.filter(s => s.status === 'Active').length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">75%</div>
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
                            student.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
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

                        {/* Action Buttons */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                              View Profile
                            </button>
                            <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                              Progress
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'engagement' && (
              <motion.div
                key="engagement"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-800">Average Session</p>
                        <p className="text-2xl font-bold text-blue-900">15 min</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-800">Active Students</p>
                        <p className="text-2xl font-bold text-green-900">70%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-800">Weekly Sessions</p>
                        <p className="text-2xl font-bold text-purple-900">4.2 avg</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Engagement Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demoEngagement.map(student => (
                    <motion.div
                      key={student.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.sessions >= 4 
                              ? 'bg-green-100 text-green-800' 
                              : student.sessions >= 2
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.sessions >= 4 ? 'High' : student.sessions >= 2 ? 'Medium' : 'Low'}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Weekly Sessions</span>
                            <span className="font-semibold text-gray-900">{student.sessions}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Avg Duration</span>
                            <span className="font-semibold text-gray-900">{student.avgDuration} min</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Completion</span>
                            <span className="font-semibold text-blue-600">{student.lessons}</span>
                          </div>

                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Last Login</span>
                              <span className="text-sm text-gray-500">{student.lastLogin}</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Lesson Progress</span>
                            <span className="text-xs text-gray-600">{student.lessons}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: student.lessons }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Download Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Export Data</h3>
                      <p className="text-sm text-gray-600 mt-1">Download engagement metrics for analysis</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Download CSV
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'outcomes' && (
              <motion.div
                key="outcomes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* AI Assistant Section */}
                <div id="ai-assistant-box" className="mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">AI Teaching Assistant</h3>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ask a question about your students..."
                        value={aiInput}
                        onChange={e => setAiInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAISubmit(aiInput); }}
                      />
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAISubmit(aiInput)}
                        disabled={aiLoading || !aiInput.trim()}
                      >
                        {aiLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Thinking...
                          </div>
                        ) : (
                          'Ask AI'
                        )}
                      </button>
                    </div>
                    
                    {/* Sample Questions */}
                    <div className="flex flex-wrap gap-2">
                      {aiSampleQuestions.map(q => (
                        <button
                          key={q}
                          className="bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 px-3 py-2 rounded-full text-sm font-medium transition-colors border border-gray-200 disabled:opacity-50"
                          onClick={() => handleAISubmit(q)}
                          disabled={aiLoading}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Answer */}
                  {aiAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mt-4"
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-1 bg-green-100 rounded-full">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 ml-2">AI Response</span>
                      </div>
                      
                      <div className="text-gray-800 mb-3">{aiAnswer.answer}</div>
                      
                      {aiAnswer.examples && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {aiAnswer.examples.map(ex => (
                              <li key={ex}>{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {aiAnswer.followup && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                          {aiAnswer.followup.map(f => (
                            <button
                              key={f}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                              onClick={() => handleAISubmit(f)}
                              disabled={aiLoading}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Student Outcomes Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {demoOutcomes.map(student => (
                    <motion.div
                      key={student.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            student.cefr === 'B1' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : student.cefr === 'A2'
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.cefr} Level
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{student.avgScore}</div>
                            <div className="text-sm text-blue-700">Avg Score</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">+{student.improvement}%</div>
                            <div className="text-sm text-green-700">Improvement</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Recent Feedback</h4>
                          <p className="text-sm text-gray-700">{student.feedback}</p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                            <span className="text-sm text-gray-600">{student.avgScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                student.avgScore >= 80 ? 'bg-green-500' :
                                student.avgScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${student.avgScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Class Statistics */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">15%</div>
                      <div className="text-sm text-gray-600 mt-1">Average Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">75</div>
                      <div className="text-sm text-gray-600 mt-1">Class Average Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">B1</div>
                      <div className="text-sm text-gray-600 mt-1">Average CEFR Level</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Export Learning Outcomes</h4>
                        <p className="text-sm text-gray-600 mt-1">Download detailed progress reports</p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Download Report
                      </button>
                    </div>
                  </div>
                </div>
                {/* AI Personalized Recommendations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">📋 AI Personalized Recommendations</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {aiRecommendations.map(rec => (
                      <motion.div 
                        key={rec.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">{rec.name}</h4>
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <div className="text-sm font-medium text-green-800 mb-1">Strengths</div>
                              <div className="text-sm text-green-700">{rec.strengths}</div>
                            </div>
                            
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                              <div className="text-sm font-medium text-yellow-800 mb-1">Focus Areas</div>
                              <div className="text-sm text-yellow-700">{rec.focus}</div>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <div className="text-sm font-medium text-blue-800 mb-1">Next Step</div>
                              <div className="text-sm text-blue-700">{rec.nextStep}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Assistant Chat Bubble Icon */}
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

      {/* AI Assistant Chat Interface */}
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
            
            {/* Content */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">Ask a question about your students, engagement, or learning outcomes.</p>
              
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
    </div>
  );
} 