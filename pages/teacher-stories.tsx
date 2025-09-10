import { useState, useRef, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/router'; // Removed unused import
import { motion, AnimatePresence } from 'framer-motion';
import { teacherService } from '../services/teacherService';

// Story-focused data types
interface StoryMetrics {
  id: string;
  title: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  genre: string;
  completionRate: number;
  avgScore: number;
  vocabularyCount: number;
  avgDuration: number;
  strugglingStudents: number;
  description?: string;
  audio_url?: string;
  content?: string;
  created_at?: string;
}

interface StoryData {
  id: string;
  title: string;
  difficulty?: string;
  genre?: string;
  description?: string;
  audio_url?: string;
  content?: string;
  created_at?: string;
  vocabulary_count?: number;
  estimated_duration?: number;
}

interface AnalysisData {
  date: string;
  overallScore: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  discourse?: number;
  sessionDuration: number;
  cefrLevel?: string;
}

interface StudentStoryData {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  status: 'Active' | 'At Risk' | 'Excelling';
  
  // Story-specific metrics
  storiesCompleted: number;
  totalStories: number;
  currentStory?: string;
  avgStoryScore: number;
  pronunciationTrend: number;
  fluencyTrend: number;
  vocabularyGrowth: number;
  
  // Recent story activity
  recentStories: Array<{
    title: string;
    completedAt: string;
    score: number;
    timeSpent: number;
  }>;
  
  // Recent analysis data
  recentAnalyses?: Array<{
    date: string;
    overallScore: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    pronunciation: number;
    discourse: number;
    cefrLevel: string;
    sessionDuration: number;
  }>;
  
  // Struggling areas
  strugglingWith: string[];
  recommendedStories: string[];
  
  // AI insights
  aiInsight: string;
  nextAction: string;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  followup?: string[];
}

const TABS = [
  { name: 'Students', key: 'students', icon: '👥' },
  { name: 'Story Analytics', key: 'stories', icon: '📚' },
  { name: 'Library', key: 'library', icon: '🏛️' },
  { name: 'Assignments', key: 'assignments', icon: '📝' },
];

// No sample data - all data will come from APIs

// Story-aware AI responses
const storyAIResponses: Record<string, { answer: string; followup?: string[] }> = {
  "Which students need story intervention?": {
    answer: "John Smith (65% avg score) struggles with A1 stories and needs pronunciation focus. Carlos Ruiz shows declining fluency trends despite good vocabulary - recommend dialogue-heavy stories.",
    followup: ["Show John's story progress", "Assign pronunciation stories", "Create fluency practice plan"]
  },
  "What stories should I assign this week?": {
    answer: "Recommendations by level:\n• John: 'Simple Conversations' (A1) for pronunciation\n• Maria: 'Museum Mystery' (B1) for sentence complexity\n• Emily: 'Business Meeting' (B2) - ready for advanced content\n• Carlos: 'Daily Conversations' (A2) for fluency practice",
    followup: ["Assign recommended stories", "Create custom story playlist", "Track story effectiveness"]
  },
  "How are students progressing with vocabulary?": {
    answer: "Vocabulary growth trends:\n• Emily leads with 78 new words (excellent retention)\n• Maria acquired 45 words (good progress)\n• Carlos learned 32 words but needs fluency practice\n• John at 18 words - needs more A1 content exposure",
    followup: ["Show vocabulary analytics", "Create vocabulary flashcards", "Track retention rates"]
  },
  "Which stories are most effective?": {
    answer: "'Daily Morning Routine' has 92% completion rate and highest scores. 'Museum Mystery' challenges students (68% completion) but shows good learning outcomes. 'Airport Adventure' is perfectly balanced for A2 level.",
    followup: ["Show story analytics", "Create similar stories", "Adjust story difficulty"]
  }
};

export default function TeacherStoriesDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<StudentStoryData[]>([]);
  const [stories, setStories] = useState<StoryMetrics[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAssistant, setShowAssistant] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentStoryData | null>(null);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const router = useRouter(); // Removed unused router

  const loadDashboardData = useCallback(async () => {
    setDataLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading stories from API...');
      const storiesResponse = await teacherService.getStories();
      console.log('📚 Stories loaded:', storiesResponse);
      
      if (storiesResponse.data && Array.isArray(storiesResponse.data)) {
        const transformedStories = await Promise.all(
          storiesResponse.data.map(async (story: StoryData) => {
            // Get story statistics
            let completionRate = 0;
            let avgScore = 0;
            let strugglingStudents = 0;
            
            try {
              const storyStats = await teacherService.getStoryStats(story.id);
              if (storyStats.data) {
                completionRate = storyStats.data.completion_rate || 0;
                avgScore = storyStats.data.avg_score || 0;
                strugglingStudents = storyStats.data.struggling_students || 0;
              }
            } catch {
              console.log(`⚠️ No stats found for story ${story.title}`);
            }
            
            return {
              id: story.id,
              title: story.title,
              difficulty: story.difficulty || 'A1',
              genre: story.genre || 'General',
              completionRate,
              avgScore,
              vocabularyCount: story.vocabulary_count || 30,
              avgDuration: story.estimated_duration || 10,
              strugglingStudents,
              description: story.description,
              audio_url: story.audio_url,
              content: story.content,
              created_at: story.created_at
            };
          })
        );
        setStories(transformedStories);
        console.log('✅ Transformed stories:', transformedStories);
      }

      // Load real students from analysis history
      console.log('🔄 Loading students from analysis data...');
      
      // Get all users who have analysis data from the new API endpoint
      const usersResponse = await teacherService.getUsersWithAnalysis(50, 0);
      console.log('👥 Users with analysis data:', usersResponse);
      
      const allStudents: StudentStoryData[] = [];
      
      if (usersResponse.users && Array.isArray(usersResponse.users)) {
        for (const userSummary of usersResponse.users) {
          try {
            // Get detailed analysis history for each user
            const analysisHistory = await teacherService.getStudentAnalysisHistory(userSummary.user_id, 10);
            console.log(`📊 Analysis for ${userSummary.user_id}:`, analysisHistory);
            
            if (analysisHistory.data && analysisHistory.data.length > 0) {
            const recentAnalyses = analysisHistory.data.map((analysis: AnalysisData) => ({
              date: analysis.date,
              overallScore: analysis.overallScore,
              grammar: analysis.grammar,
              vocabulary: analysis.vocabulary,
              fluency: analysis.fluency,
              pronunciation: analysis.pronunciation,
              discourse: analysis.discourse,
              cefrLevel: analysis.cefrLevel,
              sessionDuration: analysis.sessionDuration
            }));

            // Calculate metrics from real data
            const avgScore = Math.round(
              recentAnalyses.reduce((acc: number, analysis: AnalysisData) => acc + analysis.overallScore, 0) / recentAnalyses.length
            );
            
            const latestAnalysis = recentAnalyses[0];
            const previousAnalysis = recentAnalyses[1];
            
            // Determine status based on performance
            let status: 'Active' | 'At Risk' | 'Excelling' = 'Active';
            if (avgScore >= 85) status = 'Excelling';
            else if (avgScore < 65) status = 'At Risk';
            
            // Generate AI insights based on performance
            const generateAIInsight = (analysis: AnalysisData) => {
              if (analysis.overallScore >= 85) {
                return `Excellent performance across all areas. Ready for advanced content.`;
              } else if (analysis.overallScore >= 70) {
                return `Good progress with room for improvement in ${analysis.pronunciation < 70 ? 'pronunciation' : analysis.fluency < 70 ? 'fluency' : 'vocabulary'}.`;
              } else {
                return `Needs focused practice in ${analysis.pronunciation < 60 ? 'pronunciation' : analysis.grammar < 60 ? 'grammar' : 'overall speaking skills'}.`;
              }
            };
            
            // Generate struggling areas
            const strugglingWith = [];
            if (latestAnalysis.pronunciation < 70) strugglingWith.push('Pronunciation');
            if (latestAnalysis.grammar < 70) strugglingWith.push('Grammar');
            if (latestAnalysis.fluency < 70) strugglingWith.push('Fluency');
            if (latestAnalysis.vocabulary < 70) strugglingWith.push('Vocabulary');
            
            const student: StudentStoryData = {
              id: userSummary.user_id,
              name: userSummary.user_id.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              email: `${userSummary.user_id}@email.com`,
              username: userSummary.user_id,
              avatar: '',
              cefrLevel: latestAnalysis?.cefrLevel || 'A1',
              status,
              storiesCompleted: Math.floor(recentAnalyses.length * 0.8), // Estimate
              totalStories: stories.length || 10,
              avgStoryScore: avgScore,
              pronunciationTrend: previousAnalysis ? latestAnalysis.pronunciation - previousAnalysis.pronunciation : 0,
              fluencyTrend: previousAnalysis ? latestAnalysis.fluency - previousAnalysis.fluency : 0,
              vocabularyGrowth: recentAnalyses.length * 3, // Estimated
              recentStories: recentAnalyses.slice(0, 3).map((analysis: AnalysisData, index: number) => ({
                title: `Session ${index + 1}`,
                completedAt: analysis.date,
                score: analysis.overallScore,
                timeSpent: Math.floor(analysis.sessionDuration / 60)
              })),
              recentAnalyses,
              strugglingWith,
              recommendedStories: [], // Could be populated from story recommendations API
              aiInsight: generateAIInsight(latestAnalysis),
              nextAction: avgScore >= 85 ? 'Introduce advanced content' : avgScore >= 70 ? 'Continue current level with targeted practice' : 'Focus on foundational skills'
            };
            
            allStudents.push(student);
            }
          } catch (error) {
            console.log(`⚠️ Error loading analysis data for ${userSummary.user_id}:`, error);
          }
        }
      } else {
        console.log('⚠️ No users with analysis data found');
      }
      
      setStudents(allStudents);
      console.log('✅ Loaded students from real data:', allStudents);

      if (allStudents.length === 0) {
        setError('No student analysis data found. Students need to complete speaking practice sessions first.');
      }

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Load real data from APIs
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (showAssistant && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 200);
    }
  }, [showAssistant]);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setLoading(true);

    setTimeout(() => {
      const response = storyAIResponses[chatInput] || {
        answer: "I can help you with story-based teaching insights. Try asking: 'Which students need story intervention?' or 'What stories should I assign this week?'",
        followup: ["Which students need story intervention?", "What stories should I assign this week?", "How are students progressing with vocabulary?"]
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
    setTimeout(() => handleSend(), 100);
  };

  const handleAssignStory = async (studentId: string, storyId: string, focusArea: string, dueDate: string) => {
    try {
      const sessionData = {
        session_type: 'assignment',
        session_data: {
          user_id: studentId,
          focus_area: focusArea,
          due_date: dueDate,
          assigned_by: 'teacher', // In real app, get from auth context
          status: 'assigned'
        }
      };

      const result = await teacherService.createStorySession(storyId, sessionData);
      console.log('✅ Story assigned successfully:', result);
      
      // Update local state to reflect assignment
      const story = stories.find(s => s.id === storyId);
      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, currentStory: story?.title }
          : student
      ));
      
      return result;
    } catch (error) {
      console.error('❌ Failed to assign story:', error);
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excelling': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'At Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 10) return '📈';
    if (trend > 0) return '📊';
    return '📉';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',  
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📚 Story-Based Teaching Dashboard</h1>
              <p className="text-gray-600 mt-1">Track student progress through immersive story learning</p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{students.length}</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {students.filter(s => s.status === 'At Risk').length}
                </div>
                <div className="text-sm text-gray-500">Need Help</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stories.length}</div>
                <div className="text-sm text-gray-500">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(students.reduce((acc, s) => acc + s.avgStoryScore, 0) / students.length)}%
                </div>
                <div className="text-sm text-gray-500">Avg Score</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <span className="text-yellow-800">{error}</span>
              <button 
                onClick={loadDashboardData}
                className="ml-auto px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          {/* Loading State */}
          {dataLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading dashboard data...</span>
              </div>
            </div>
          )}
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`relative flex-1 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.icon}</span>
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

          {/* Search Bar - Show on students tab */}
          {activeTab === 'students' && (
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {!dataLoading && (
            <>
            {/* Students Tab */}
            {activeTab === 'students' && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                    <p className="text-gray-600 mb-6">
                      No students with analysis data found. Students need to complete speaking practice sessions first.
                    </p>
                    <button 
                      onClick={loadDashboardData}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredStudents.map(student => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Student Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{student.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(student.cefrLevel)}`}>
                                  {student.cefrLevel}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                  {student.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Story Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Stories Progress</span>
                            <span className="text-sm text-gray-600">{student.storiesCompleted}/{student.totalStories}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                (student.storiesCompleted / student.totalStories) >= 0.8 ? 'bg-green-500' :
                                (student.storiesCompleted / student.totalStories) >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(student.storiesCompleted / student.totalStories) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Current Story */}
                        {student.currentStory && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-xs text-blue-600 font-medium mb-1">Currently Reading</div>
                            <div className="text-sm font-medium text-blue-900">{student.currentStory}</div>
                          </div>
                        )}

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{student.avgStoryScore}%</div>
                            <div className="text-xs text-gray-500">Avg Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 flex items-center justify-center">
                              {getTrendIcon(student.pronunciationTrend)}
                            </div>
                            <div className="text-xs text-gray-500">Pronunciation</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">+{student.vocabularyGrowth}</div>
                            <div className="text-xs text-gray-500">New Words</div>
                          </div>
                        </div>

                        {/* AI Insight */}
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-start gap-2">
                            <span className="text-purple-600">🤖</span>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-purple-900 mb-1">AI Insight</div>
                              <div className="text-xs text-purple-700">{student.aiInsight}</div>
                            </div>
                          </div>
                        </div>

                        {/* Struggling Areas */}
                        {student.strugglingWith.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs font-medium text-gray-700 mb-2">Needs Work On:</div>
                            <div className="flex flex-wrap gap-1">
                              {student.strugglingWith.map((area, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedStudent(student);
                              setAssignmentModal(true);
                            }}
                            className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                          >
                            Assign Story
                          </button>
                          <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}
              </motion.div>
            )}

            {/* Story Analytics Tab */}
            {activeTab === 'stories' && (
              <motion.div
                key="stories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <div className="text-2xl font-bold">{stories.length}</div>
                    <div className="text-blue-100">Total Stories</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <div className="text-2xl font-bold">
                      {Math.round(stories.reduce((acc, s) => acc + s.completionRate, 0) / stories.length)}%
                    </div>
                    <div className="text-green-100">Avg Completion</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <div className="text-2xl font-bold">
                      {stories.reduce((acc, s) => acc + s.vocabularyCount, 0)}
                    </div>
                    <div className="text-purple-100">Total Vocabulary</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                    <div className="text-2xl font-bold">
                      {stories.reduce((acc, s) => acc + s.strugglingStudents, 0)}
                    </div>
                    <div className="text-orange-100">Students Need Help</div>
                  </div>
                </div>

                {stories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stories Found</h3>
                    <p className="text-gray-600 mb-6">
                      No stories found in the library. Add some stories to get started.
                    </p>
                    <button 
                      onClick={loadDashboardData}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {stories.map(story => (
                    <div key={story.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{story.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
                              {story.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {story.genre}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{story.avgScore}%</div>
                          <div className="text-xs text-gray-500">Avg Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{story.completionRate}%</div>
                          <div className="text-xs text-gray-500">Completion Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{story.avgDuration}min</div>
                          <div className="text-xs text-gray-500">Avg Duration</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600">
                          📚 {story.vocabularyCount} words
                        </span>
                        {story.strugglingStudents > 0 && (
                          <span className="text-sm text-red-600">
                            ⚠️ {story.strugglingStudents} struggling
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </motion.div>
            )}

            {/* Story Library Tab */}
            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Story Library</h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    + Add New Story
                  </button>
                </div>

                {stories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏛️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stories in Library</h3>
                    <p className="text-gray-600 mb-6">
                      The story library is empty. Add stories to start teaching.
                    </p>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                      Add First Story
                    </button>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map(story => (
                    <div key={story.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{story.title}</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
                            {story.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {story.genre}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {story.vocabularyCount} vocabulary words • {story.avgDuration} min average
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                          Preview
                        </button>
                        <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Story Assignments</h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    + New Assignment
                  </button>
                </div>

                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students to Assign</h3>
                    <p className="text-gray-600 mb-6">
                      No students found. Students need to complete practice sessions first.
                    </p>
                    <button 
                      onClick={loadDashboardData}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                ) : (
                <div className="space-y-4">
                  {students.map(student => (
                    <div key={student.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-500">
                              {student.cefrLevel} • {student.storiesCompleted}/{student.totalStories} stories
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {student.currentStory ? (
                            <>
                              <p className="text-sm font-medium text-gray-900">{student.currentStory}</p>
                              <p className="text-xs text-gray-500">In Progress</p>
                            </>
                          ) : (
                            <div className="text-sm text-gray-400">No active assignment</div>
                          )}
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedStudent(student);
                            setAssignmentModal(true);
                          }}
                          className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Assign Story
                        </button>
                      </div>

                      {/* Recommended Stories */}
                      {student.recommendedStories.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-700 mb-2">AI Recommendations:</div>
                          <div className="flex flex-wrap gap-2">
                            {student.recommendedStories.map((story, idx) => (
                              <button
                                key={idx}
                                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full transition-colors"
                              >
                                {story}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                )}
              </motion.div>
            )}
            </>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Assistant */}
      {!showAssistant && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-300"
          onClick={() => setShowAssistant(true)}
        >
          🤖
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
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">🤖</span>
                  <span className="text-white font-semibold text-sm">Story Teaching AI</span>
                </div>
                <button
                  className="text-white/80 hover:text-white text-lg font-bold p-1"
                  onClick={() => setShowAssistant(false)}
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="h-[300px] overflow-y-auto p-4 bg-gray-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-3">Ask about your students&apos; story progress</p>
                  <div className="space-y-2">
                    {Object.keys(storyAIResponses).slice(0, 2).map(question => (
                      <button
                        key={question}
                        onClick={() => handleFollowup(question)}
                        className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
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
                      ? 'bg-purple-600 text-white'
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
                            className="block w-full text-left px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs transition-colors"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Ask about stories..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                />
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
                  onClick={handleSend}
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
              📚 Assign Story to {selectedStudent.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Story
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {stories.map(story => (
                    <option key={story.id} value={story.id}>
                      {story.title} ({story.difficulty})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Area
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Pronunciation Practice</option>
                  <option>Vocabulary Building</option>
                  <option>Grammar Focus</option>
                  <option>Fluency Development</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setAssignmentModal(false);
                  setSelectedStudent(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (selectedStudent) {
                    try {
                      // In real implementation, get values from form
                      const storyId = stories[0]?.id || 'default-story';
                      const focusArea = 'pronunciation';
                      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                      
                      await handleAssignStory(selectedStudent.id, storyId, focusArea, dueDate);
                      setAssignmentModal(false);
                      setSelectedStudent(null);
                    } catch (error) {
                      console.error('Failed to assign story:', error);
                      alert('Failed to assign story. Please try again.');
                    }
                  }
                }}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Assign Story
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}