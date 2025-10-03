import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Download } from 'lucide-react';

interface MockAssessmentData {
  candidate: {
    name: string;
    email: string;
    position: string;
    assessmentDate: string;
  };
  audioUrl: string;
  transcript: string;
  placement_result: {
    overall_score: number;
    placement_level: string;
    cefr_level: string;
    description: string;
    component_scores: {
      pronunciation: number;
      fluency: number;
      vocabulary: number;
      grammar: number;
      confidence: number;
    };
    recommendations: string[];
  };
  fluency_analysis: {
    words_per_minute: number;
    total_pauses: number;
    filler_words_count: number;
    self_corrections: number;
  };
  mistakes: Array<{
    type: string;
    category: string;
    original: string;
    correction: string;
    description?: string;
  }>;
  strengths: Array<{
    area: string;
    description: string;
    example: string;
    level: 'good' | 'excellent' | 'outstanding';
  }>;
}

// Assessment questions by role
const assessmentQuestions = [
  {
    role: 'Technical Architect',
    questions: [
      'In up to 3 minutes, please describe a complex system architecture you have designed. What were the key trade-offs you had to make?',
      'Follow-up: How did you handle scalability challenges in that architecture? What would you do differently if you were to rebuild it today?'
    ]
  },
  {
    role: 'Financial Project Manager',
    questions: [
      'In up to 3 minutes, please explain how you manage project budgets and communicate financial updates to stakeholders. Provide a specific example.',
      'Follow-up: Describe a time when a project went over budget. How did you communicate this to stakeholders and what corrective actions did you take?'
    ]
  },
  {
    role: 'General Professional',
    questions: [
      'In up to 3 minutes, please tell us about your professional experience and career goals. What motivates you in your work?',
      'Follow-up: Describe a challenging situation at work and how you overcame it. What did you learn from that experience?'
    ]
  }
];

// Mock data for demo
const mockData: MockAssessmentData = {
  candidate: {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@gmail.com',
    position: 'Technical Architect - Mexico Operations',
    assessmentDate: 'September 22, 2025'
  },
  audioUrl: '#', // In real implementation, this would be an actual audio URL
  transcript: 'I work... I working in the company, eh, for many time. The system... the systems is very... how to say... eh... complicated? I make... I maked some... some things for the computer. Is very difficult because... eh... the data is much and... and the server sometimes no work good. We have problem with... eh... how to say... the people who use the system, they want fast but... eh... is not possible always. I try to... to fix but... eh... the technology is complicated for me.',
  placement_result: {
    overall_score: 42,
    placement_level: 'Elementary',
    cefr_level: 'A2',
    description: 'Basic English communication with significant room for improvement. Can express simple ideas but struggles with complex grammar and fluency.',
    component_scores: {
      pronunciation: 58,
      fluency: 35,
      vocabulary: 48,
      grammar: 31,
      confidence: 45
    },
    recommendations: [
      'Focus on basic grammar patterns and verb conjugations',
      'Practice speaking without filler words to improve fluency',
      'Expand core business vocabulary',
      'Work on sentence structure and word order'
    ]
  },
  fluency_analysis: {
    words_per_minute: 85,
    total_pauses: 18,
    filler_words_count: 12,
    self_corrections: 3
  },
  mistakes: [
    {
      type: 'Verb Tense Mixing',
      category: 'Grammar',
      original: 'I work... I working in the company',
      correction: 'I work in the company (or: I am working in the company)',
      description: 'Choose either simple present or present continuous, not both'
    },
    {
      type: 'Irregular Past Tense',
      category: 'Grammar',
      original: 'I maked some things',
      correction: 'I made some things',
      description: 'Past tense of "make" is "made", not "maked"'
    },
    {
      type: 'Filler Words',
      category: 'Fluency',
      original: '"eh" used 12 times',
      correction: 'Try to pause silently instead of using filler words',
      description: 'Excessive filler words interrupt communication flow'
    },
    {
      type: 'Subject-Verb Agreement',
      category: 'Grammar',
      original: 'the server sometimes no work good',
      correction: 'the server sometimes does not work well',
      description: 'Use auxiliary verb "does" for negative statements'
    },
    {
      type: 'Word Order',
      category: 'Grammar',
      original: 'the data is much',
      correction: 'there is a lot of data',
      description: 'English word order differs from Spanish - use "a lot of" for quantities'
    }
  ],
  strengths: [
    {
      area: 'Willingness to Communicate',
      description: 'Shows effort to express technical concepts despite language barriers',
      example: 'Attempted to describe complex system work: "I make... some things for the computer"',
      level: 'good'
    },
    {
      area: 'Basic Technical Vocabulary',
      description: 'Demonstrates knowledge of fundamental technical terms',
      example: 'Successfully used words like "system", "server", "data", and "technology"',
      level: 'good'
    },
    {
      area: 'Problem Recognition',
      description: 'Able to identify and discuss technical challenges',
      example: 'Recognized system complexity: "the technology is complicated" and performance issues',
      level: 'good'
    },
    {
      area: 'Persistence in Communication',
      description: 'Continued speaking despite language difficulties',
      example: 'Used phrases like "how to say..." to work through vocabulary gaps while maintaining communication',
      level: 'good'
    }
  ]
};

const NissanResultsPage: React.FC = () => {
  const [videoUrl, setVideoUrl] = React.useState<string>('');
  const [selectedRole] = React.useState(0); // Default to Technical Architect for demo
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(null); // All questions collapsed by default

  React.useEffect(() => {
    // Load video from localStorage
    const savedVideo = localStorage.getItem('nissan_demo_video');
    if (savedVideo) {
      setVideoUrl(savedVideo);
    }
  }, []);

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'assessment-video.webm';
      link.click();
    } else {
      alert('Video download initiated (demo functionality)');
    }
  };

  const clearDemoData = () => {
    if (confirm('This will clear all demo video data from localStorage. Continue?')) {
      localStorage.removeItem('nissan_demo_video');
      setVideoUrl('');
      alert('Demo data cleared successfully!');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'outstanding': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'outstanding': return '🌟';
      case 'excellent': return '✨';
      case 'good': return '👍';
      default: return '💪';
    }
  };

  return (
    <>
      <Head>
        <title>Screening Interview Results - {mockData.candidate.name} | Nissan North America</title>
        <meta name="description" content="Language Proficiency Screening Interview Results" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-xl border-b border-gray-200 backdrop-blur-sm bg-white/95">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-red-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">N</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Nissan North America</h1>
                  <p className="text-lg text-blue-600 font-medium">Screening Interview Results</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-200 mb-2">
                  <p className="text-sm font-semibold text-gray-700">Confidential HR Document</p>
                  <p className="text-xs text-gray-500">For Internal Use Only</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-800">✓ 2-Question Screening Complete</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Candidate Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {mockData.candidate.name}
                  </h2>
                </div>
                <p className="text-xl text-gray-700 mb-2">{mockData.candidate.position}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl shadow-lg">
                <span className="text-white font-bold text-lg">Technical Architect Assessment</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Candidate</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Email</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Assessment Date</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.assessmentDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Screening Interview Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Screening Interview Assessment</h3>
                  <p className="text-sm text-gray-600">{assessmentQuestions[selectedRole].role} - 2 Questions Completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md">✓</div>
                <div className="text-gray-400">━━</div>
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md">✓</div>
              </div>
            </div>
          </motion.div>

          {/* Question Responses */}
          {assessmentQuestions[selectedRole].questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + (index * 0.1) } }}
              className="bg-white rounded-xl shadow-xl mb-6 border border-gray-100 overflow-hidden"
            >
              {/* Question Header - Clickable */}
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-orange-500 to-red-500'
                    }`}>
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {index === 0 ? 'Initial Question' : 'Follow-Up Question'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {index === 0 ? 'INITIAL' : 'FOLLOW-UP'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{question}</p>
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${expandedQuestion === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedQuestion === index && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Full Question */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-6 border border-indigo-200">
                    <p className="text-sm font-medium text-indigo-900 mb-1">Question:</p>
                    <p className="text-gray-800">{question}</p>
                  </div>

                  {/* Video Player */}
                  <div className="mb-6">
                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        controls
                        className="w-full rounded-xl shadow-2xl border-2 border-gray-300"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-12 border border-blue-200">
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                          </div>
                          <p className="font-semibold text-gray-700 text-lg">Sample Video - Question {index + 1}</p>
                          <p className="text-sm text-gray-500 mt-2">Duration: 0:58</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Transcript for this question */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Transcript</h4>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg p-4 border border-amber-200">
                      <p className="text-gray-700 leading-relaxed text-sm italic">
                        &quot;{mockData.transcript}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={downloadVideo}
                      className="flex items-center text-white space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all shadow-lg text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="font-semibold">Download Video</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* TOEIC Competitive Advantage Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800">Assessment Advantages</h3>
            </div>

            {/* TOEIC-Killer Components */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Verification & Speed Component */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-300 shadow-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h4 className="font-bold text-gray-900 text-lg">Verified & Instant</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">✅</span>
                    <span className="font-semibold text-green-800">Identity Verified (Video)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⚡</span>
                    <span className="font-semibold text-green-800">Results: INSTANT</span>
                  </div>
                  <p className="text-xs text-gray-600 italic mt-2">
                    (vs. 3-week turnaround for standard tests like TOEIC)
                  </p>
                </div>
              </div>

              {/* Managerial Insights Component */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border-2 border-blue-300 shadow-lg">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">👁️</span>
                  <h4 className="font-bold text-gray-900 text-lg">Manager Insights</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">Consistent communication across both questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">Handles follow-up questions well</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">Professional video presence throughout</span>
                  </li>
                </ul>
              </div>

              {/* ROI Snapshot Component */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border-2 border-purple-300 shadow-lg">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">💰</span>
                  <h4 className="font-bold text-gray-900 text-lg">Cost Efficiency</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Assessment Cost:</p>
                    <p className="text-2xl font-bold text-purple-700">~$10-15</p>
                    <p className="text-xs text-gray-500 italic">(2 questions)</p>
                  </div>
                  <p className="text-xs text-gray-600 bg-white/50 rounded-lg p-2">
                    <strong>70-80% savings</strong> vs. $50 TOEIC cost
                  </p>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Assessment Scores Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <span className="text-3xl">📊</span>
              <h2 className="text-2xl font-bold text-gray-800">Assessment Scores</h2>
            </div>

            {/* Overall Score */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Overall English Proficiency</h3>
                  <p className="text-gray-600">{mockData.placement_result.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-indigo-600">{mockData.placement_result.overall_score}/100</div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                      {mockData.placement_result.placement_level}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {mockData.placement_result.cefr_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Score Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mockData.placement_result.overall_score}%` }}
                ></div>
              </div>
            </div>

            {/* Component Scores */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(mockData.placement_result.component_scores).map(([skill, score]) => {
                const getSkillColor = (skillName: string) => {
                  switch (skillName) {
                    case 'pronunciation': return 'from-blue-500 to-blue-600';
                    case 'fluency': return 'from-green-500 to-green-600';
                    case 'vocabulary': return 'from-purple-500 to-purple-600';
                    case 'grammar': return 'from-red-500 to-red-600';
                    case 'confidence': return 'from-yellow-500 to-orange-600';
                    default: return 'from-gray-500 to-gray-600';
                  }
                };

                const getSkillIcon = (skillName: string) => {
                  switch (skillName) {
                    case 'pronunciation': return '🗣️';
                    case 'fluency': return '⚡';
                    case 'vocabulary': return '📚';
                    case 'grammar': return '📝';
                    case 'confidence': return '💪';
                    default: return '📊';
                  }
                };

                return (
                  <div key={skill} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-center mb-3">
                      <div className="text-2xl mb-2">{getSkillIcon(skill)}</div>
                      <h4 className="font-semibold text-gray-900 capitalize">{skill}</h4>
                    </div>
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-gray-900">{score}/100</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${getSkillColor(skill)} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Fluency Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.17 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
              <span className="text-3xl">📈</span>
              <h2 className="text-2xl font-bold text-gray-800">Fluency Analytics</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.words_per_minute}</div>
                  <div className="text-sm font-medium text-blue-700">Words/Minute</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">⏸️</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.total_pauses}</div>
                  <div className="text-sm font-medium text-orange-700">Total Pauses</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">😐</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.filler_words_count}</div>
                  <div className="text-sm font-medium text-red-700">Filler Words</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">✏️</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.self_corrections}</div>
                  <div className="text-sm font-medium text-green-700">Self-Corrections</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              <span className="text-3xl">📈</span>
              <h2 className="text-2xl font-bold text-gray-800">Areas for Development</h2>
            </div>

            <div className="space-y-6">
              {mockData.mistakes.map((mistake, index) => (
                <div
                  key={index}
                  className="border border-orange-200 rounded-xl p-6 bg-gradient-to-br from-orange-50 to-red-50 shadow-md"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {mistake.category}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{mistake.type}</h4>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-orange-700">Current: </span>
                          <span className="text-sm text-orange-600 font-mono bg-orange-100 px-2 py-1 rounded">
                            {mistake.original}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-green-700">Improved: </span>
                          <span className="text-sm text-green-600 font-mono bg-green-100 px-2 py-1 rounded">
                            {mistake.correction}
                          </span>
                        </div>

                        {mistake.description && (
                          <p className="text-sm text-gray-600 italic">{mistake.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Strengths Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              <span className="text-3xl">⭐</span>
              <h2 className="text-2xl font-bold text-gray-800">Communication Strengths</h2>
            </div>

            <div className="space-y-6">
              {mockData.strengths.map((strength, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-6 shadow-md ${getLevelColor(strength.level)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getLevelIcon(strength.level)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{strength.area}</h4>
                      <p className="mb-3 text-sm leading-relaxed">{strength.description}</p>
                      <div className="bg-white/50 rounded-md p-3 border-l-4 border-current">
                        <p className="text-sm italic">&quot;{strength.example}&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* HR Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <span className="text-3xl">💼</span>
              <h2 className="text-2xl font-bold text-gray-800">HR Recommendations</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Development Priorities</h3>
                <div className="space-y-3">
                  {mockData.placement_result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hiring Assessment</h3>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">⚠️</span>
                    <span className="font-bold text-orange-800 text-lg">DEVELOPMENT NEEDED</span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Candidate shows technical knowledge but requires significant English language development before being suitable for client-facing technical roles.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Recommendation:</strong> Consider for internal technical roles with English training program.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Timeline:</strong> Re-assess after 6-12 months of targeted language training.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hiring Recommendation */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">✅</span>
              <h2 className="text-xl font-semibold text-gray-800">Hiring Recommendation</h2>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-lg font-semibold text-green-800 mb-2">PROCEED TO NEXT ROUND</p>
              <p className="text-gray-700 leading-relaxed">
                Candidate demonstrates strong technical communication skills with excellent architecture vocabulary
                and ability to articulate complex trade-offs. Minor grammar refinements can be addressed through
                standard onboarding communication training. Recommended for technical interview phase.
              </p>
            </div>
          </motion.div> */}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 border-t mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-gray-700 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-white font-bold text-xl">Nissan North America</span>
              </div>
              <div className="text-gray-300 text-sm mb-4">
                © {new Date().getFullYear()} Nissan North America, Inc. |
                <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">Privacy Policy</a>
                <span className="mx-2">|</span>
                <span className="text-gray-400">Assessment Results - Confidential</span>
              </div>
              {/* Demo Data Cleanup */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={clearDemoData}
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Demo Data
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NissanResultsPage;