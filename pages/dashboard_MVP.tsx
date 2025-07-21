import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow p-6 border border-white/20">
        <h1 className="text-2xl font-bold mb-2 text-white">Teacher Progress Dashboard</h1>
        <p className="text-gray-300 mb-6">Monitor student engagement and learning outcomes</p>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-white/20 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`pb-2 px-4 font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-300 hover:text-cyan-200'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Search Bar - Only show on Overview tab */}
        {activeTab === 'overview' && (
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Search students by name or ID..."
              className="border border-white/20 rounded-lg px-3 py-2 w-full max-w-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-white">Student Overview</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-4 py-2 border border-white/20 text-white">Name</th>
                      <th className="px-4 py-2 border border-white/20 text-white">ID</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Email</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Status</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Class/Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="bg-white/5 hover:bg-white/10">
                        <td className="px-4 py-2 border border-white/20 text-white">{s.name}</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.id}</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.email}</td>
                        <td className={`px-4 py-2 border border-white/20 font-semibold ${s.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{s.status}</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.group}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'engagement' && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-white">Engagement Metrics</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-4 py-2 border border-white/20 text-white">Name</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Sessions (wk)</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Avg Duration (min)</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Lesson Completion</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoEngagement.map(s => (
                      <tr key={s.name} className="bg-white/5 hover:bg-white/10">
                        <td className="px-4 py-2 border border-white/20 text-white">{s.name}</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.sessions}</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.avgDuration}</td>
                        <td className="px-4 py-2 border border-white/20 text-cyan-300 font-semibold">{s.lessons}</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-gray-300">
                <p>Class-wide engagement: <span className="text-cyan-200 font-semibold">70%</span> active, <span className="text-cyan-200 font-semibold">15 min</span> avg. session</p>
                <p className="mt-2">Download CSV (coming soon)</p>
              </div>
            </div>
          )}
          {activeTab === 'outcomes' && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-white">Learning Outcomes</h2>
              {/* AI Assistant Box */}
              <div id="ai-assistant-box" className="mb-8">
                <div className="bg-cyan-900/60 border border-cyan-400/30 rounded-lg p-5 shadow mb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <input
                      type="text"
                      className="flex-1 bg-white/10 border border-cyan-400/30 rounded-lg px-3 py-2 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-2 md:mb-0"
                      placeholder="Ask a question about your students..."
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAISubmit(aiInput); }}
                    />
                    <button
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-lg transition ml-0 md:ml-2"
                      onClick={() => handleAISubmit(aiInput)}
                      disabled={aiLoading || !aiInput.trim()}
                    >
                      {aiLoading ? 'Thinking...' : 'Ask AI'}
                    </button>
                  </div>
                  {/* Sample Questions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {aiSampleQuestions.map(q => (
                      <button
                        key={q}
                        className="bg-cyan-800/60 text-cyan-200 px-3 py-1 rounded-full text-xs hover:bg-cyan-700/80 transition border border-cyan-400/20"
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
                  <div className="bg-cyan-900/80 border border-cyan-400/40 rounded-lg p-5 shadow mt-2">
                    <div className="text-cyan-200 font-semibold mb-2">AI Answer:</div>
                    <div className="text-white mb-2">{aiAnswer.answer}</div>
                    {aiAnswer.examples && (
                      <ul className="list-disc pl-6 text-cyan-100 mb-2">
                        {aiAnswer.examples.map(ex => (
                          <li key={ex}>{ex}</li>
                        ))}
                      </ul>
                    )}
                    {aiAnswer.followup && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {aiAnswer.followup.map(f => (
                          <button
                            key={f}
                            className="bg-cyan-800/60 text-cyan-200 px-3 py-1 rounded-full text-xs hover:bg-cyan-700/80 transition border border-cyan-400/20"
                            onClick={() => handleAISubmit(f)}
                            disabled={aiLoading}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-4 py-2 border border-white/20 text-white">Name</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Avg Quiz Score</th>
                      <th className="px-4 py-2 border border-white/20 text-white">% Improvement</th>
                      <th className="px-4 py-2 border border-white/20 text-white">Fluency Feedback</th>
                      <th className="px-4 py-2 border border-white/20 text-white">CEFR Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoOutcomes.map(s => (
                      <tr key={s.name} className="bg-white/5 hover:bg-white/10">
                        <td className="px-4 py-2 border border-white/20 text-white">{s.name}</td>
                        <td className="px-4 py-2 border border-white/20 text-cyan-300 font-semibold">{s.avgScore}</td>
                        <td className="px-4 py-2 border border-white/20 text-cyan-300 font-semibold">{s.improvement}%</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.feedback}</td>
                        <td className="px-4 py-2 border border-white/20 text-white">{s.cefr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-gray-300">
                <p>Class-wide improvement: <span className="text-cyan-200 font-semibold">15%</span> avg. score increase</p>
                <p className="mt-2">Download PDF (coming soon)</p>
              </div>
              {/* AI Personalized Recommendations */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-cyan-200 mb-4">AI Personalized Recommendations</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {aiRecommendations.map(rec => (
                    <div key={rec.name} className="bg-cyan-900/60 border border-cyan-400/30 rounded-lg p-5 shadow">
                      <div className="text-lg font-semibold text-white mb-1">{rec.name}</div>
                      <div className="text-cyan-200 mb-2 text-sm">Next Step: <span className="font-medium text-white">{rec.nextStep}</span></div>
                      <div className="text-gray-200 text-sm mb-1"><span className="font-semibold text-cyan-300">Strengths:</span> {rec.strengths}</div>
                      <div className="text-gray-200 text-sm"><span className="font-semibold text-cyan-300">Focus:</span> {rec.focus}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Assistant Chat Bubble Icon */}
      {!showAssistant && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400"
          style={{ boxShadow: '0 4px 24px 0 rgba(6,182,212,0.25)' }}
          onClick={() => setShowAssistant(true)}
          aria-label="Open AI Assistant"
        >
          {/* Modern chat bubble icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#06b6d4" />
            <path d="M10 20h8a2 2 0 002-2v-6a2 2 0 00-2-2h-8a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M10 20v3l3-3h5" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* AI Assistant Chat Interface */}
      {showAssistant && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full">
          <div className="bg-cyan-900/95 border border-cyan-400/40 rounded-xl shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#06b6d4" />
                  <path d="M10 20h8a2 2 0 002-2v-6a2 2 0 00-2-2h-8a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M10 20v3l3-3h5" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                <span className="text-cyan-100 font-bold">AI Assistant</span>
              </div>
              <button
                className="text-cyan-200 hover:text-white text-xl font-bold"
                onClick={() => setShowAssistant(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex-1 mb-2">
              <p className="text-cyan-100 text-sm mb-2">Ask a question about your students, engagement, or learning outcomes.</p>
            </div>
            <div className="flex gap-2">
              <input
                ref={chatInputRef}
                type="text"
                className="flex-1 bg-white/10 border border-cyan-400/30 rounded-lg px-3 py-2 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Type your question..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleChatSend(); }}
              />
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                onClick={handleChatSend}
                disabled={!chatInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 