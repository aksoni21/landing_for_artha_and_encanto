import { useState, useRef, useEffect } from 'react';

// Define a type for chat messages
interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  followup?: string[];
}

// Extend the student type to include lastAssignment
interface DemoStudent {
  name: string;
  id: string;
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
}

const demoStudents: DemoStudent[] = [
  {
    name: 'Maria Lopez',
    id: 'S123',
    status: 'At Risk',
    group: 'A1',
    avatar: '',
    progress: 0.7,
    aiNext: 'Assign "Travel Conversations" module. Focus on past tense verbs.',
    aiSummary: 'Maria improved in greetings. Needs more practice with travel vocabulary.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
  },
  {
    name: 'Carlos Ruiz',
    id: 'S126',
    status: 'At Risk',
    group: 'B1',
    avatar: '',
    progress: 0.35,
    aiNext: 'Send encouragement. Assign review on advanced grammar.',
    aiSummary: 'Carlos missed 2 sessions. Advanced grammar mistakes detected.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
  },
  {
    name: 'Emily Chen',
    id: 'S125',
    status: 'At Risk',
    group: 'A1',
    avatar: '',
    progress: 0.5,
    aiNext: 'Invite to open-ended conversation session.',
    aiSummary: 'Emily missed a few sessions. Needs to catch up on assignments.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
  },
  {
    name: 'Priya Singh',
    id: 'S127',
    status: 'Doing Well',
    group: 'A2',
    avatar: '',
    progress: 0.95,
    aiNext: 'Assign advanced conversation practice.',
    aiSummary: 'Priya is excelling in all areas. Ready for more advanced topics.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
  },
  {
    name: 'Liam O’Brien',
    id: 'S128',
    status: 'Doing Well',
    group: 'B2',
    avatar: '',
    progress: 0.92,
    aiNext: 'Encourage peer mentoring.',
    aiSummary: 'Liam consistently scores above 90%. Shows leadership in group activities.',
    encouragementSent: false,
    reviewAssigned: false,
    lastAssignment: undefined,
  },
];

const proactiveSuggestions = [
  {
    message: '3 students are at risk of falling behind. Assign review modules?',
    actions: ['Assign review modules', 'Send Encouragement']
  },
  {
    message: 'Class average quiz score dropped 5% this week. Would you like to view details?',
    actions: ['View Details']
  }
];

const aiSampleQuestions = [
  'Which students are at risk?',
  'Assign review modules',
  'How is Maria Lopez doing?',
  'Show class trends for grammar',
];

// Dummy student details data
interface StudentDetails {
  name: string;
  attendance: string;
  quizzes: Quiz[];
  strengths: string[];
  weaknesses: string[];
  notes: string;
}
const studentDetailsData: Record<string, StudentDetails> = {
  S123: {
    name: 'Maria Lopez',
    attendance: '82%',
    quizzes: [
      { date: '2025-07-01', score: 65 },
      { date: '2025-06-24', score: 70 },
      { date: '2025-06-17', score: 68 },
    ],
    strengths: ['Greetings'],
    weaknesses: ['Travel vocabulary', 'Past tense'],
    notes: 'Maria has missed a few sessions and needs more practice with travel-related vocabulary.'
  },
  S126: {
    name: 'Carlos Ruiz',
    attendance: '80%',
    quizzes: [
      { date: '2025-07-01', score: 60 },
      { date: '2025-06-24', score: 65 },
      { date: '2025-06-17', score: 70 },
    ],
    strengths: ['Listening'],
    weaknesses: ['Advanced grammar', 'Consistency'],
    notes: 'Carlos has missed several sessions recently. Needs encouragement and review of advanced grammar.'
  },
  S125: {
    name: 'Emily Chen',
    attendance: '78%',
    quizzes: [
      { date: '2025-07-01', score: 68 },
      { date: '2025-06-24', score: 72 },
      { date: '2025-06-17', score: 70 },
    ],
    strengths: ['Pronunciation'],
    weaknesses: ['Complex sentence structure', 'Attendance'],
    notes: 'Emily missed a few sessions and needs to catch up on assignments.'
  },
  S127: {
    name: 'Priya Singh',
    attendance: '100%',
    quizzes: [
      { date: '2025-07-01', score: 98 },
      { date: '2025-06-24', score: 95 },
      { date: '2025-06-17', score: 97 },
    ],
    strengths: ['Pronunciation', 'Participation', 'Grammar'],
    weaknesses: [],
    notes: 'Priya is excelling in all areas and is ready for more advanced topics.'
  },
  S128: {
    name: 'Liam O’Brien',
    attendance: '98%',
    quizzes: [
      { date: '2025-07-01', score: 94 },
      { date: '2025-06-24', score: 92 },
      { date: '2025-06-17', score: 93 },
    ],
    strengths: ['Leadership', 'Grammar', 'Participation'],
    weaknesses: [],
    notes: 'Liam consistently scores above 90% and shows leadership in group activities.'
  },
};

const reviewTopics = [
  'Past Tense Review',
  'Travel Vocabulary',
  'Advanced Grammar',
  'Attendance Challenge',
  'Conversation Practice',
];

// Quiz interface for student quiz data
interface Quiz { date: string; score: number; }

export default function DashboardAI() {
  const [chat, setChat] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hi! I am your AI teaching assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Proactive suggestions (show first one for demo)
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const suggestion = proactiveSuggestions[suggestionIdx];

  // Student state
  const [students, setStudents] = useState(demoStudents);

  // Assignment Modal state
  const [assignModalStudentId, setAssignModalStudentId] = useState<string | null>(null);
  const [assignTopic, setAssignTopic] = useState(reviewTopics[0]);
  const [assignDue, setAssignDue] = useState('');
  const [assignNote, setAssignNote] = useState('');
  const [showAssignToast, setShowAssignToast] = useState(false);
  const [assignToastMsg, setAssignToastMsg] = useState('');

  // Split students into at risk and doing well
  const atRiskStudents = students.filter(s => s.status === 'At Risk');
  const doingWellStudents = students.filter(s => s.status === 'Doing Well');

  // Student Details Modal state
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const selectedStudent = selectedStudentId ? studentDetailsData[selectedStudentId] : null;
  const [showDataTrail, setShowDataTrail] = useState(false);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chat]);

  // Handle chat send
  const handleSend = async (q?: string) => {
    const question = q || input.trim();
    if (!question) return;
    setChat(c => [...c, { sender: 'user', text: question }]);
    setInput('');
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'AI error');
      const data = await res.json();
      setChat(c => [...c, { sender: 'ai', text: data.answer, followup: data.followup }]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'AI failed to respond.';
      setChat(c => [...c, { sender: 'ai', text: errorMsg }]);
      setAiError(errorMsg);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle follow-up suggestion click
  const handleFollowup = (followup: string) => {
    handleSend(followup);
  };

  // Handle proactive suggestion action
  const handleSuggestion = (action: string) => {
    setShowSuggestion(false);
    handleSend(action);
    setSuggestionIdx(i => (i + 1) % proactiveSuggestions.length);
    setTimeout(() => setShowSuggestion(true), 2000);
  };

  // Student quick actions
  const handleStudentAction = (id: string, action: 'encourage' | 'assignReview') => {
    setStudents(students => students.map(s =>
      s.id === id
        ? {
            ...s,
            encouragementSent: action === 'encourage' ? true : s.encouragementSent,
            reviewAssigned: action === 'assignReview' ? true : s.reviewAssigned,
          }
        : s
    ));
  };

  // Assignment modal handlers
  const openAssignModal = (id: string) => {
    setAssignModalStudentId(id);
    setAssignTopic(reviewTopics[0]);
    // Auto-fill due date to one week from now
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const yyyy = weekFromNow.getFullYear();
    const mm = String(weekFromNow.getMonth() + 1).padStart(2, '0');
    const dd = String(weekFromNow.getDate()).padStart(2, '0');
    const defaultDue = `${yyyy}-${mm}-${dd}`;
    setAssignDue(defaultDue);
    // Auto-fill note with a default message
    const studentName = studentDetailsData[id]?.name || 'the student';
    const topic = reviewTopics[0];
    setAssignNote(
      `Hi ${studentName},\n\nPlease complete the "${topic}" assignment by next week. This review will help you strengthen your skills in this area, address recent challenges, and boost your confidence. Completing this will help you make faster progress and be better prepared for upcoming lessons!`
    );
  };
  const closeAssignModal = () => {
    setAssignModalStudentId(null);
  };
  const confirmAssign = () => {
    if (!assignModalStudentId) return;
    setStudents(students => students.map(s =>
      s.id === assignModalStudentId
        ? { ...s, reviewAssigned: true, lastAssignment: { topic: assignTopic, due: assignDue, note: assignNote, status: 'Assigned', assignedAt: new Date().toISOString() } }
        : s
    ));
    setAssignToastMsg(`Review assigned to ${studentDetailsData[assignModalStudentId].name}.`);
    setShowAssignToast(true);
    setTimeout(() => setShowAssignToast(false), 2500);
    closeAssignModal();
  };

  // When topic changes, update the note if it hasn't been edited
  useEffect(() => {
    if (assignModalStudentId && assignNote.startsWith('Hi ')) {
      const studentName = studentDetailsData[assignModalStudentId]?.name || 'the student';
      setAssignNote(
        `Hi ${studentName},\n\nPlease complete the "${assignTopic}" assignment by next week. This review will help you strengthen your skills in this area, address recent challenges, and boost your confidence. Completing this will help you make faster progress and be better prepared for upcoming lessons!`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignTopic]);

  // Avatar helper
  const getAvatar = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    return (
      <div className="w-10 h-10 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold text-lg">
        {initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 flex flex-col md:flex-row">
      {/* Assignment Modal */}
      {assignModalStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-cyan-950 border border-cyan-400/40 rounded-2xl p-8 w-full max-w-md shadow-xl relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-cyan-200 hover:text-cyan-400 text-2xl font-bold"
              onClick={closeAssignModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Assign Review to {studentDetailsData[assignModalStudentId].name}</h2>
            <div className="mb-3">
              <label className="block text-cyan-200 text-sm mb-1">Topic</label>
              <select
                className="w-full bg-cyan-900/40 border border-cyan-400/30 rounded-lg px-3 py-2 text-white focus:outline-none"
                value={assignTopic}
                onChange={e => setAssignTopic(e.target.value)}
              >
                {reviewTopics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-cyan-200 text-sm mb-1">Due Date</label>
              <input
                type="date"
                className="w-full bg-cyan-900/40 border border-cyan-400/30 rounded-lg px-3 py-2 text-white focus:outline-none"
                value={assignDue}
                onChange={e => setAssignDue(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-cyan-200 text-sm mb-1">Note (optional)</label>
              <textarea
                className="w-full bg-cyan-900/40 border border-cyan-400/30 rounded-lg px-3 py-2 text-white focus:outline-none"
                value={assignNote}
                onChange={e => setAssignNote(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold px-4 py-2 rounded-lg transition"
                onClick={confirmAssign}
                disabled={!assignTopic || !assignDue}
              >
                Assign Review
              </button>
              <button
                className="bg-cyan-900 hover:bg-cyan-800 text-cyan-200 font-semibold px-4 py-2 rounded-lg border border-cyan-400/30 transition"
                onClick={closeAssignModal}
              >
                Cancel
              </button>
            </div>
            <div className="text-xs text-cyan-300 mt-2">* Topic and due date required</div>
          </div>
        </div>
      )}
      {/* Toast/Confirmation */}
      {showAssignToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-cyan-800 text-white px-6 py-3 rounded-xl shadow-lg border border-cyan-400/40 animate-fade-in">
          {assignToastMsg}
        </div>
      )}
      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-cyan-950 border border-cyan-400/40 rounded-2xl p-8 w-full max-w-md shadow-xl relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-cyan-200 hover:text-cyan-400 text-2xl font-bold"
              onClick={() => { setSelectedStudentId(null); setShowDataTrail(false); }}
              aria-label="Close"
            >
              &times;
            </button>
            {!showDataTrail ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedStudent.name}</h2>
                <div className="mb-2 text-cyan-200">Attendance: <span className="font-semibold text-cyan-300">{selectedStudent.attendance}</span></div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Quiz Scores:</div>
                  <ul className="text-cyan-100 text-sm space-y-1">
                    {selectedStudent.quizzes.map((q: Quiz) => (
                      <li key={q.date}>
                        {q.date}: <span className="font-semibold text-cyan-300">{q.score}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Strengths:</div>
                  <ul className="flex flex-wrap gap-2">
                    {selectedStudent.strengths.map((s: string) => (
                      <li key={s} className="bg-green-700/70 text-white px-2 py-1 rounded text-xs">{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Areas for Improvement:</div>
                  <ul className="flex flex-wrap gap-2">
                    {selectedStudent.weaknesses.map((w: string) => (
                      <li key={w} className="bg-red-700/70 text-white px-2 py-1 rounded text-xs">{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Notes:</div>
                  <div className="text-cyan-100 text-sm">{selectedStudent.notes}</div>
                </div>
                <button
                  className="mt-4 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold px-4 py-2 rounded-lg transition"
                  onClick={() => setShowDataTrail(true)}
                >
                  How did the AI get this?
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">How the AI Generated These Insights</h2>
                <div className="mb-2 text-cyan-200">The AI analyzed the following data points for <span className="font-semibold text-cyan-300">{selectedStudent.name}</span> to personalize recommendations:</div>
                <div className="mb-4 text-cyan-100 text-sm">
                  <span className="font-semibold text-cyan-300">How it works:</span> The AI reviews quiz scores, attendance, and participation to spot strengths. It focuses on repeated errors and slow progress to identify areas for improvement. Recommendations are tailored to each student’s unique learning patterns.
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Attendance:</div>
                  <div className="text-cyan-100 text-sm mb-2">{selectedStudent.attendance} attendance rate over the last month.</div>
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Quiz Scores Over Time:</div>
                  <ul className="text-cyan-100 text-sm space-y-1">
                    {selectedStudent.quizzes.map((q: Quiz) => (
                      <li key={q.date}>
                        {q.date}: <span className="font-semibold text-cyan-300">{q.score}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Strengths Detected:</div>
                  <div className="text-cyan-100 text-xs mb-1">The AI highlights strengths when a student consistently performs well and makes few mistakes in these areas.</div>
                  <ul className="flex flex-wrap gap-2">
                    {selectedStudent.strengths.map((s: string) => (
                      <li key={s} className="bg-green-700/70 text-white px-2 py-1 rounded text-xs">{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">Areas for Improvement Detected:</div>
                  <div className="text-cyan-100 text-xs mb-1">The AI focuses on skills where the student makes repeated errors or shows slow progress, so teachers can target support.</div>
                  <ul className="flex flex-wrap gap-2">
                    {selectedStudent.weaknesses.map((w: string) => (
                      <li key={w} className="bg-red-700/70 text-white px-2 py-1 rounded text-xs">{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="text-cyan-200 font-semibold mb-1">AI Notes:</div>
                  <div className="text-cyan-100 text-sm">{selectedStudent.notes}</div>
                </div>
                <button
                  className="mt-4 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold px-4 py-2 rounded-lg transition"
                  onClick={() => setShowDataTrail(false)}
                >
                  Back to Summary
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Main content */}
      <div className="flex-1 p-6 md:p-12">
        <h1 className="text-3xl font-bold text-white mb-4">AI-First Teacher Dashboard</h1>
        {/* Proactive AI Suggestion */}
        {showSuggestion && suggestion && atRiskStudents.length > 0 && (
          <div className="relative bg-gradient-to-br from-cyan-900/90 to-cyan-800/80 border-2 border-cyan-400/40 rounded-2xl p-6 mb-8 shadow-lg flex flex-col gap-3 animate-fade-in">
            {/* Dismiss X */}
            <button
              className="absolute top-3 right-3 text-cyan-300 hover:text-cyan-100 text-lg font-bold focus:outline-none"
              onClick={() => setShowSuggestion(false)}
              aria-label="Dismiss"
            >
              ×
            </button>
            {/* AI Icon and Title */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center shadow">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#06b6d4" />
                  <path d="M10 20h8a2 2 0 002-2v-6a2 2 0 00-2-2h-8a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M10 20v3l3-3h5" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-cyan-100 font-bold text-lg">AI Alert</span>
            </div>
            {/* Message and At-Risk Students */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-3">
              <span className="text-cyan-100 font-medium">
                {atRiskStudents.length} student{atRiskStudents.length > 1 ? 's' : ''} at risk of falling behind:
              </span>
              <div className="flex gap-2 mt-2 md:mt-0">
                {atRiskStudents.map(s => (
                  <div key={s.id} className="flex items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold text-xs border-2 border-cyan-400/40">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-cyan-200 text-xs font-semibold">{s.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestion.actions.map(a => (
                <button
                  key={a}
                  className="bg-cyan-700 hover:bg-cyan-800 text-cyan-100 font-semibold px-3 py-1 rounded-full text-xs transition border border-cyan-400/30 shadow-sm"
                  style={{ minWidth: 'auto' }}
                  onClick={() => handleSuggestion(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* At Risk Students Section */}
        <h2 className="text-xl font-bold text-red-300 mb-2">Students At Risk</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {atRiskStudents.map(s => (
            <div
              key={s.id}
              className="bg-white/10 border border-white/20 rounded-xl p-6 shadow flex flex-col animate-fade-in cursor-pointer hover:scale-[1.03] transition-transform"
              onClick={() => setSelectedStudentId(s.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                {getAvatar(s.name)}
                <div className="text-lg font-bold text-white">{s.name}</div>
                <div className="text-xs text-cyan-200 bg-cyan-900/60 rounded px-2 py-1 ml-auto">{s.group}</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full bg-red-400`}></div>
                <div className="text-xs text-cyan-200">{s.status}</div>
              </div>
              <div className="w-full bg-cyan-900/40 rounded-full h-2 mb-2">
                <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${Math.round(s.progress * 100)}%` }}></div>
              </div>
              <div className="text-cyan-200 text-sm mb-2">{s.aiSummary}</div>
              <div className="text-white text-sm mb-2"><span className="font-semibold text-cyan-300">Next Step:</span> {s.aiNext}</div>
              <div className="flex gap-2 mt-auto flex-wrap">
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-3 py-1 rounded-lg text-xs transition"
                  onClick={e => { e.stopPropagation(); handleSend(`How is ${s.name} doing?`); }}
                >
                  Ask AI about {s.name}
                </button>
                <button
                  className={`bg-green-700 hover:bg-green-800 text-white font-semibold px-3 py-1 rounded-lg text-xs transition ${s.encouragementSent ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={e => { e.stopPropagation(); handleStudentAction(s.id, 'encourage'); }}
                  disabled={s.encouragementSent}
                >
                  {s.encouragementSent ? 'Encouragement Sent' : 'Send Encouragement'}
                </button>
                <button
                  className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3 py-1 rounded-lg text-xs transition ${s.reviewAssigned ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={e => { e.stopPropagation(); openAssignModal(s.id); }}
                  disabled={s.reviewAssigned}
                >
                  {s.reviewAssigned ? 'Review Assigned' : 'Assign Review'}
                </button>
              </div>
              {s.lastAssignment && (
                <div className="mt-2 text-xs text-cyan-300 bg-cyan-900/40 rounded px-2 py-1">
                  <span className="font-semibold">Last Assignment:</span> {s.lastAssignment.topic} (Due: {s.lastAssignment.due})
                  {s.lastAssignment.status === 'Assigned' && <span className="ml-2 text-cyan-200">[Assigned]</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Students Doing Well Section */}
        <h2 className="text-xl font-bold text-green-300 mb-2">Students Doing Well</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {doingWellStudents.map(s => (
            <div
              key={s.id}
              className="bg-white/10 border border-white/20 rounded-xl p-6 shadow flex flex-col animate-fade-in cursor-pointer hover:scale-[1.03] transition-transform"
              onClick={() => setSelectedStudentId(s.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                {getAvatar(s.name)}
                <div className="text-lg font-bold text-white">{s.name}</div>
                <div className="text-xs text-cyan-200 bg-cyan-900/60 rounded px-2 py-1 ml-auto">{s.group}</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full bg-green-400`}></div>
                <div className="text-xs text-cyan-200">{s.status}</div>
              </div>
              <div className="w-full bg-cyan-900/40 rounded-full h-2 mb-2">
                <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${Math.round(s.progress * 100)}%` }}></div>
              </div>
              <div className="text-cyan-200 text-sm mb-2">{s.aiSummary}</div>
              <div className="text-white text-sm mb-2"><span className="font-semibold text-cyan-300">Next Step:</span> {s.aiNext}</div>
              <div className="flex gap-2 mt-auto flex-wrap">
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-3 py-1 rounded-lg text-xs transition"
                  onClick={e => { e.stopPropagation(); handleSend(`How is ${s.name} doing?`); }}
                >
                  Ask AI about {s.name}
                </button>
                <button
                  className={`bg-green-700 hover:bg-green-800 text-white font-semibold px-3 py-1 rounded-lg text-xs transition ${s.encouragementSent ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={e => { e.stopPropagation(); handleStudentAction(s.id, 'encourage'); }}
                  disabled={s.encouragementSent}
                >
                  {s.encouragementSent ? 'Encouragement Sent' : 'Send Encouragement'}
                </button>
                <button
                  className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3 py-1 rounded-lg text-xs transition ${s.reviewAssigned ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={e => { e.stopPropagation(); handleStudentAction(s.id, 'assignReview'); }}
                  disabled={s.reviewAssigned}
                >
                  {s.reviewAssigned ? 'Review Assigned' : 'Assign Review'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Conversational AI Assistant (always visible) */}
      <div className="w-full md:w-96 bg-cyan-950/90 border-l border-cyan-400/20 flex flex-col fixed md:static bottom-0 right-0 z-40 h-screen md:h-screen min-h-screen max-h-screen">
        <div className="flex items-center gap-2 p-4 border-b border-cyan-400/20">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#06b6d4" />
            <path d="M10 20h8a2 2 0 002-2v-6a2 2 0 00-2-2h-8a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M10 20v3l3-3h5" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span className="text-cyan-100 font-bold">AI Assistant</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-cyan-950/80">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender === 'ai' ? 'bg-cyan-800 text-white' : 'bg-cyan-600 text-white'}`}>
                {msg.text}
                {msg.sender === 'ai' && msg.followup && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {msg.followup.map((f: string) => (
                      <button
                        key={f}
                        className="bg-cyan-700 hover:bg-cyan-800 text-cyan-100 px-2 py-1 rounded-full text-xs mt-1"
                        onClick={() => handleFollowup(f)}
                        disabled={aiLoading}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="flex justify-start"><div className="max-w-xs px-4 py-2 rounded-2xl text-sm bg-cyan-800 text-white animate-pulse">Thinking...</div></div>
          )}
          {aiError && (
            <div className="flex justify-start"><div className="max-w-xs px-4 py-2 rounded-2xl text-sm bg-red-700 text-white">{aiError}</div></div>
          )}
          <div ref={chatEndRef}></div>
        </div>
        <div className="p-4 border-t border-cyan-400/20 bg-cyan-950/90">
          <div className="flex gap-2 mb-2 flex-wrap">
            {aiSampleQuestions.map(q => (
              <button
                key={q}
                className="bg-cyan-800/60 text-cyan-200 px-3 py-1 rounded-full text-xs hover:bg-cyan-700/80 transition border border-cyan-400/20"
                onClick={() => handleSend(q)}
                disabled={aiLoading}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-white/10 border border-cyan-400/30 rounded-lg px-3 py-2 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Type your question or command..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              disabled={aiLoading}
            />
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              onClick={() => handleSend()}
              disabled={aiLoading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 