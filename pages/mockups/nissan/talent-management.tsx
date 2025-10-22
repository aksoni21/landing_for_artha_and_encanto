import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Calendar, TrendingUp, Target, Award, BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface ProgressData {
  date: string;
  overallScore: number;
  cefrLevel: string;
  pronunciation: number;
  fluency: number;
  vocabulary: number;
  grammar: number;
  confidence: number;
}

interface TrainingModule {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  completedDate?: string;
  estimatedCompletion?: string;
}

interface CareerPath {
  role: string;
  requiredScore: number;
  currentReadiness: number;
  status: 'ready' | 'in_progress' | 'not_ready';
  estimatedTime?: string;
  gapAreas: string[];
}

interface MockTalentData {
  employee: {
    name: string;
    email: string;
    employeeId: string;
    currentRole: string;
    department: string;
    hireDate: string;
    manager: string;
  };
  progressHistory: ProgressData[];
  currentAssessment: {
    overallScore: number;
    cefrLevel: string;
    assessmentDate: string;
  };
  trainingModules: TrainingModule[];
  careerPaths: CareerPath[];
  developmentPlan: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  managerRecommendations: string[];
  peerBenchmark: {
    avgImprovement: number;
    employeeImprovement: number;
    cohortSize: number;
    percentile: number;
  };
}

const mockTalentData: MockTalentData = {
  employee: {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@nissan.com',
    employeeId: 'NNA-MX-4721',
    currentRole: 'Technical Architect',
    department: 'Mexico Operations',
    hireDate: 'September 22, 2024',
    manager: 'Carlos Mendez'
  },
  progressHistory: [
    {
      date: 'Sep 2024',
      overallScore: 58,
      cefrLevel: 'A2-B1',
      pronunciation: 58,
      fluency: 35,
      vocabulary: 48,
      grammar: 31,
      confidence: 45
    },
    {
      date: 'Dec 2024',
      overallScore: 65,
      cefrLevel: 'B1',
      pronunciation: 63,
      fluency: 48,
      vocabulary: 58,
      grammar: 45,
      confidence: 55
    },
    {
      date: 'Mar 2025',
      overallScore: 72,
      cefrLevel: 'B1+',
      pronunciation: 70,
      fluency: 62,
      vocabulary: 68,
      grammar: 58,
      confidence: 65
    },
    {
      date: 'Jun 2025',
      overallScore: 78,
      cefrLevel: 'B2',
      pronunciation: 76,
      fluency: 72,
      vocabulary: 75,
      grammar: 70,
      confidence: 77
    }
  ],
  currentAssessment: {
    overallScore: 78,
    cefrLevel: 'B2',
    assessmentDate: 'June 15, 2025'
  },
  trainingModules: [
    {
      id: '1',
      name: 'Grammar Fundamentals for Technical Communication',
      status: 'completed',
      progress: 100,
      completedDate: 'December 10, 2024'
    },
    {
      id: '2',
      name: 'Professional Presentation Skills',
      status: 'in_progress',
      progress: 75,
      estimatedCompletion: 'July 30, 2025'
    },
    {
      id: '3',
      name: 'Reducing Filler Words & Building Fluency',
      status: 'completed',
      progress: 100,
      completedDate: 'March 5, 2025'
    },
    {
      id: '4',
      name: 'Executive Communication Workshop',
      status: 'upcoming',
      progress: 0,
      estimatedCompletion: 'August 15, 2025'
    },
    {
      id: '5',
      name: 'Client-Facing Technical Discussions',
      status: 'upcoming',
      progress: 0,
      estimatedCompletion: 'September 30, 2025'
    }
  ],
  careerPaths: [
    {
      role: 'Senior Technical Architect (Mexico)',
      requiredScore: 75,
      currentReadiness: 100,
      status: 'ready',
      gapAreas: []
    },
    {
      role: 'Senior Technical Architect (US-Facing)',
      requiredScore: 80,
      currentReadiness: 88,
      status: 'in_progress',
      estimatedTime: '2-3 months',
      gapAreas: ['Executive communication', 'Client presentation confidence']
    },
    {
      role: 'Principal Architect (Global)',
      requiredScore: 90,
      currentReadiness: 62,
      status: 'not_ready',
      estimatedTime: '12-18 months',
      gapAreas: ['Advanced vocabulary', 'Cross-cultural communication', 'Executive stakeholder management']
    }
  ],
  developmentPlan: {
    shortTerm: [
      'Complete Professional Presentation Skills module (75% done)',
      'Schedule weekly 1:1 English practice with US mentor',
      'Shadow US client calls (2x per week)'
    ],
    mediumTerm: [
      'Lead internal technical demos in English',
      'Participate in Executive Communication Workshop',
      'Begin presenting to small US client groups'
    ],
    longTerm: [
      'Transition to US-facing client role',
      'Mentor junior architects on technical communication',
      'Present at industry conferences in English'
    ]
  },
  managerRecommendations: [
    'Ready for promotion to Senior Technical Architect (Mexico-based)',
    'Assign to US project shadowing opportunities immediately',
    'Schedule bi-weekly check-ins to discuss US stakeholder interactions',
    'Consider for Q3 client demo participation (internal audience first)',
    'Strong candidate for Technical Leadership Program (next cohort)'
  ],
  peerBenchmark: {
    avgImprovement: 20,
    employeeImprovement: 35, // (78-58)/58 * 100 = 34.5%
    cohortSize: 24,
    percentile: 85
  }
};

const NissanTalentManagementPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'3m' | '6m' | '12m'>('12m');

  const getProgressData = () => {
    let data;
    switch (selectedTimeframe) {
      case '3m':
        data = mockTalentData.progressHistory.slice(-1);
        break;
      case '6m':
        data = mockTalentData.progressHistory.slice(-2);
        break;
      case '12m':
      default:
        data = mockTalentData.progressHistory;
    }
    // Reverse to show most recent first
    return [...data].reverse();
  };


  return (
    <>
      <Head>
        <title>Talent Development Dashboard - {mockTalentData.employee.name} | Nissan North America</title>
        <meta name="description" content="Employee Development & Career Progression Tracking" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-100">
        {/* Header */}
        <header className="bg-white shadow-xl border-b border-gray-200 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-red-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">N</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Nissan North America</h1>
                  <p className="text-lg text-purple-600 font-medium">Talent Development Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/mockups/nissan/results"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="mr-2">👔</span>
                  Talent Acquisition View
                </Link>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3 rounded-lg border border-purple-200">
                    <p className="text-sm font-semibold text-gray-700">Employee Development Report</p>
                    <p className="text-xs text-gray-500">For Talent Management Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Employee Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-4"></div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {mockTalentData.employee.name}
                  </h2>
                </div>
                <p className="text-xl text-gray-700 mb-2">{mockTalentData.employee.currentRole} - {mockTalentData.employee.department}</p>
                <p className="text-sm text-gray-500">Employee ID: {mockTalentData.employee.employeeId}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockTalentData.currentAssessment.overallScore}</div>
                  <div className="text-sm text-white/90">Current Score</div>
                  <div className="text-xs text-white/80 mt-1">{mockTalentData.currentAssessment.cefrLevel}</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Manager</p>
                    <p className="font-bold text-gray-900">{mockTalentData.employee.manager}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Hire Date</p>
                    <p className="font-bold text-gray-900">{mockTalentData.employee.hireDate}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Progress</p>
                    <p className="font-bold text-gray-900">+{mockTalentData.peerBenchmark.employeeImprovement}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700">Percentile</p>
                    <p className="font-bold text-gray-900">Top {100 - mockTalentData.peerBenchmark.percentile}%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Communication Progress Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
                <span className="text-3xl">📈</span>
                <h2 className="text-2xl font-bold text-gray-800">Communication Progress Timeline</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTimeframe('3m')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedTimeframe === '3m'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  3 Months
                </button>
                <button
                  onClick={() => setSelectedTimeframe('6m')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedTimeframe === '6m'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setSelectedTimeframe('12m')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedTimeframe === '12m'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  12 Months
                </button>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="space-y-4">
              {getProgressData().map((progress, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">{progress.overallScore}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{progress.date}</h3>
                        <p className="text-sm text-gray-600">CEFR Level: <span className="font-semibold text-blue-700">{progress.cefrLevel}</span></p>
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-300">
                        CURRENT
                      </span>
                    )}
                  </div>

                  {/* Skill Breakdown */}
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries({
                      Pronunciation: progress.pronunciation,
                      Fluency: progress.fluency,
                      Vocabulary: progress.vocabulary,
                      Grammar: progress.grammar,
                      Confidence: progress.confidence
                    }).map(([skill, score]) => (
                      <div key={skill} className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">{skill}</p>
                        <p className="text-lg font-bold text-gray-900">{score}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Total Improvement: +{mockTalentData.peerBenchmark.employeeImprovement}%</h3>
                <p className="text-sm text-gray-600">
                  From {mockTalentData.progressHistory[0].overallScore} → {mockTalentData.currentAssessment.overallScore}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${(mockTalentData.currentAssessment.overallScore / 100) * 100}%` }}
                >
                  <span className="text-white text-xs font-bold">{mockTalentData.currentAssessment.overallScore}/100</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Career Path Readiness */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              <span className="text-3xl">🎯</span>
              <h2 className="text-2xl font-bold text-gray-800">Career Path Readiness</h2>
            </div>

            <div className="space-y-6">
              {mockTalentData.careerPaths.map((path, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 ${
                    path.status === 'ready'
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : path.status === 'in_progress'
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        path.status === 'ready'
                          ? 'bg-green-500 text-white'
                          : path.status === 'in_progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}>
                        {getStatusIcon(path.status)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{path.role}</h3>
                        <p className="text-sm text-gray-600">
                          Required Score: <span className="font-semibold">{path.requiredScore}/100</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm border-2 ${getStatusColor(path.status)}`}>
                        {path.status === 'ready' && '✓ READY FOR PROMOTION'}
                        {path.status === 'in_progress' && `→ IN PROGRESS (${path.estimatedTime})`}
                        {path.status === 'not_ready' && `○ DEVELOPING (${path.estimatedTime})`}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Readiness Score</span>
                      <span className="text-sm font-bold text-gray-900">{path.currentReadiness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          path.status === 'ready'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : path.status === 'in_progress'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        style={{ width: `${path.currentReadiness}%` }}
                      ></div>
                    </div>
                  </div>

                  {path.gapAreas.length > 0 && (
                    <div className="bg-white/60 rounded-lg p-4 border border-current/20">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Development Focus Areas:</p>
                      <ul className="space-y-1">
                        {path.gapAreas.map((gap, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">•</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div> */}

          {/* Training Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <span className="text-3xl">📚</span>
              <h2 className="text-2xl font-bold text-gray-800">Training & Development Modules</h2>
            </div>

            <div className="space-y-4">
              {mockTalentData.trainingModules.map((module) => (
                <div
                  key={module.id}
                  className={`border rounded-xl p-5 ${
                    module.status === 'completed'
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      : module.status === 'in_progress'
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        module.status === 'completed'
                          ? 'bg-green-500'
                          : module.status === 'in_progress'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}>
                        {module.status === 'completed' && <CheckCircle className="w-6 h-6 text-white" />}
                        {module.status === 'in_progress' && <Clock className="w-6 h-6 text-white" />}
                        {module.status === 'upcoming' && <BookOpen className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{module.name}</h3>
                        <p className="text-sm text-gray-600">
                          {module.status === 'completed' && `Completed: ${module.completedDate}`}
                          {module.status === 'in_progress' && `Est. Completion: ${module.estimatedCompletion}`}
                          {module.status === 'upcoming' && `Starts: ${module.estimatedCompletion}`}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      module.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : module.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {module.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {module.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">Progress</span>
                        <span className="text-xs font-bold text-gray-900">{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            module.status === 'completed'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          }`}
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Development Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              <span className="text-3xl">🎯</span>
              <h2 className="text-2xl font-bold text-gray-800">Personalized Development Plan</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Short Term */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Short Term (1-3 months)</h3>
                </div>
                <ul className="space-y-3">
                  {mockTalentData.developmentPlan.shortTerm.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medium Term */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Medium Term (3-6 months)</h3>
                </div>
                <ul className="space-y-3">
                  {mockTalentData.developmentPlan.mediumTerm.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Long Term */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Long Term (6-12 months)</h3>
                </div>
                <ul className="space-y-3">
                  {mockTalentData.developmentPlan.longTerm.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Peer Benchmark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
              <span className="text-3xl">📊</span>
              <h2 className="text-2xl font-bold text-gray-800">Peer Benchmarking</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Comparison</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Cohort Average Improvement</span>
                      <span className="text-lg font-bold text-gray-900">{mockTalentData.peerBenchmark.avgImprovement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full"
                        style={{ width: `${mockTalentData.peerBenchmark.avgImprovement}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Maria&apos;s Improvement</span>
                      <span className="text-lg font-bold text-green-700">{mockTalentData.peerBenchmark.employeeImprovement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                        style={{ width: `${mockTalentData.peerBenchmark.employeeImprovement}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-green-100 rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-green-900 font-semibold">
                    🎉 Outperforming peers by +{mockTalentData.peerBenchmark.employeeImprovement - mockTalentData.peerBenchmark.avgImprovement}%
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cohort Ranking</h3>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-purple-600 mb-2">{mockTalentData.peerBenchmark.percentile}th</div>
                  <p className="text-lg text-gray-700">Percentile</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Out of {mockTalentData.peerBenchmark.cohortSize} employees in development cohort
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-gray-700 text-center">
                    <strong className="text-purple-900">Top {100 - mockTalentData.peerBenchmark.percentile}%</strong> performer in peer group
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Manager Recommendations */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-xl p-8 border-2 border-green-300"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Manager Action Items</h2>
            </div>

            <div className="space-y-3">
              {mockTalentData.managerRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-green-200"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div> */}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-gray-700 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-white font-bold text-xl">Nissan North America</span>
              </div>
              <div className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Nissan North America, Inc. |
                <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">Privacy Policy</a>
                <span className="mx-2">|</span>
                <span className="text-gray-400">Talent Development Dashboard - Confidential</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NissanTalentManagementPage;
