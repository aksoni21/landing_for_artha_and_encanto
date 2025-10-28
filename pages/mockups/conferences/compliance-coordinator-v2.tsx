import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { districtStudents, schools, grades /*, Student */ } from '../../../lib/mockups/conferences/data/complianceData';

// Title III Accountability Metrics Interface
interface Title3Metrics {
  totalELs: number;
  makingProgress: number;
  notMakingProgress: number;
  attainedProficiency: number;
  percentMakingProgress: number;
  percentAttained: number;
  immigrants: number;
  ltels: number;
  newELs: number;
  rfeps: number;
}

export default function ComplianceCoordinatorV2() {
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('2024-25');

  // Filter students
  const filteredStudents = useMemo(() => {
    return districtStudents.filter(student => {
      if (selectedSchool !== 'All Schools' && student.school !== selectedSchool) return false;
      if (selectedGrade !== 'All Grades' && student.grade.toString() !== selectedGrade) return false;
      return true;
    });
  }, [selectedSchool, selectedGrade]);

  // Calculate Title III Accountability Metrics
  const title3Metrics: Title3Metrics = useMemo(() => {
    const totalELs = filteredStudents.length;
    const makingProgress = filteredStudents.filter(s => s.progressTowardProficiency === 'Making Progress').length;
    const notMakingProgress = filteredStudents.filter(s => s.progressTowardProficiency === 'Not Making Progress').length;
    const attainedProficiency = filteredStudents.filter(s => s.progressTowardProficiency === 'Attained Proficiency').length;

    return {
      totalELs,
      makingProgress,
      notMakingProgress,
      attainedProficiency,
      percentMakingProgress: totalELs > 0 ? Math.round((makingProgress / totalELs) * 100) : 0,
      percentAttained: totalELs > 0 ? Math.round((attainedProficiency / totalELs) * 100) : 0,
      immigrants: filteredStudents.filter(s => s.immigrantStatus).length,
      ltels: filteredStudents.filter(s => s.isLTEL).length,
      newELs: filteredStudents.filter(s => s.isNewEL).length,
      rfeps: filteredStudents.filter(s => s.isRFEP).length,
    };
  }, [filteredStudents]);

  // ELP Domain Scores Aggregation
  const elpDomainData = useMemo(() => {
    const students = filteredStudents.filter(s => s.speakingScore);
    if (students.length === 0) return [];

    return [
      { domain: 'Speaking', score: (students.reduce((sum, s) => sum + (s.speakingScore || 0), 0) / students.length).toFixed(1) },
      { domain: 'Listening', score: (students.reduce((sum, s) => sum + (s.listeningScore || 0), 0) / students.length).toFixed(1) },
      { domain: 'Reading', score: (students.reduce((sum, s) => sum + (s.readingScore || 0), 0) / students.length).toFixed(1) },
      { domain: 'Writing', score: (students.reduce((sum, s) => sum + (s.writingScore || 0), 0) / students.length).toFixed(1) },
    ];
  }, [filteredStudents]);

  // Proficiency Level Distribution
  const proficiencyDistribution = useMemo(() => {
    const distribution = {
      'Beginning': 0,
      'Intermediate': 0,
      'Advanced': 0,
      'Proficient': 0
    };

    filteredStudents.forEach(s => {
      if (s.proficiencyLevel && distribution.hasOwnProperty(s.proficiencyLevel)) {
        distribution[s.proficiencyLevel as keyof typeof distribution]++;
      }
    });

    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [filteredStudents]);

  // Year-over-Year Growth (mock data for trends) - Realistic district progression
  const yoyGrowthData = [
    { year: '2021-22', percentProficient: 8, avgGrowth: 52, totalStudents: 187 },
    { year: '2022-23', percentProficient: 11, avgGrowth: 64, totalStudents: 201 },
    { year: '2023-24', percentProficient: 14, avgGrowth: 71, totalStudents: 215 },
    { year: '2024-25', percentProficient: 17, avgGrowth: 78, totalStudents: 234 },
  ];

  // Home Language Distribution
  const homeLanguageData = useMemo(() => {
    const languages: Record<string, number> = {};
    filteredStudents.forEach(s => {
      if (s.homeLanguage) {
        languages[s.homeLanguage] = (languages[s.homeLanguage] || 0) + 1;
      }
    });
    return Object.entries(languages).map(([name, value]) => ({ name, value }));
  }, [filteredStudents]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'title3', label: 'Title III Metrics', icon: '📈' },
    { id: 'elp', label: 'ELP Assessments', icon: '📝' },
    { id: 'demographics', label: 'Demographics', icon: '👥' },
    { id: 'compliance', label: 'Compliance', icon: '✓' },
    { id: 'reports', label: 'Reports', icon: '📄' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Title III Compliance Dashboard</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  District Coordinator View
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                English Learner Progress Monitoring & Federal Reporting
              </p>
            </div>

            {/* Global Filters */}
            <div className="flex items-center gap-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option>2024-25</option>
                <option>2023-24</option>
                <option>2022-23</option>
              </select>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                {schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="text-sm text-gray-600 mb-1">Total EL Students</div>
                  <div className="text-3xl font-bold text-blue-600">{title3Metrics.totalELs}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {title3Metrics.immigrants} immigrants
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="text-sm text-gray-600 mb-1">Making Progress</div>
                  <div className="text-3xl font-bold text-green-600">{title3Metrics.percentMakingProgress}%</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {title3Metrics.makingProgress} of {title3Metrics.totalELs} students
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="text-sm text-gray-600 mb-1">Attained Proficiency</div>
                  <div className="text-3xl font-bold text-purple-600">{title3Metrics.percentAttained}%</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {title3Metrics.attainedProficiency} exited this year
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <div className="text-sm text-gray-600 mb-1">LTELs</div>
                  <div className="text-3xl font-bold text-red-600">{title3Metrics.ltels}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {Math.round((title3Metrics.ltels / title3Metrics.totalELs) * 100)}% of total
                  </div>
                </div>
              </div>


              {/* Student Engagement Metrics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Student Engagement & Activity Metrics
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Platform usage data from teacher-assigned activities
                </p>

                {/* Total District Metrics */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">District-Wide Totals (Year-to-Date: Aug 2024 - Oct 2024)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📖</span>
                        <span className="text-xs font-semibold text-gray-700 uppercase">Reading (ytd)</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {(filteredStudents.length * 127).toLocaleString()} min 
                      </div>
                      <div className="text-xs text-blue-600 mt-1">Total minutes read</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎤</span>
                        <span className="text-xs font-semibold text-gray-700 uppercase">Speaking</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {(filteredStudents.length * 84).toLocaleString()} min
                      </div>
                      <div className="text-xs text-green-600 mt-1">Total minutes spoken</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">👂</span>
                        <span className="text-xs font-semibold text-gray-700 uppercase">Listening</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {(filteredStudents.length * 95).toLocaleString()} min
                      </div>
                      <div className="text-xs text-purple-600 mt-1">Total minutes listened</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✍️</span>
                        <span className="text-xs font-semibold text-gray-700 uppercase">Writing</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-700">
                        {(filteredStudents.length * 62).toLocaleString()} min
                      </div>
                      <div className="text-xs text-orange-600 mt-1">Total minutes writing</div>
                    </div>
                  </div>
                </div>

                {/* Average Per Student */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Average Per Student (Year-to-Date)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📖</span>
                        <span className="text-sm font-semibold text-blue-900">Reading</span>
                      </div>
                      <div className="text-xl font-bold text-blue-700">127 min <span className="text-xs">(YTD)</span></div>
                      <div className="text-xs text-gray-600 mt-1">Total YTD · ~21 min/week avg</div>
                      <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">85% of target</div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🎤</span>
                        <span className="text-sm font-semibold text-green-900">Speaking</span>
                      </div>
                      <div className="text-xl font-bold text-green-700">84 min</div>
                      <div className="text-xs text-gray-600 mt-1">Total YTD · ~14 min/week avg</div>
                      <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">70% of target</div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">👂</span>
                        <span className="text-sm font-semibold text-purple-900">Listening</span>
                      </div>
                      <div className="text-xl font-bold text-purple-700">95 min</div>
                      <div className="text-xs text-gray-600 mt-1">Total YTD · ~16 min/week avg</div>
                      <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '79%' }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">79% of target</div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">✍️</span>
                        <span className="text-sm font-semibold text-orange-900">Writing</span>
                      </div>
                      <div className="text-xl font-bold text-orange-700">62 min</div>
                      <div className="text-xs text-gray-600 mt-1">Total YTD · ~10 min/week avg</div>
                      <div className="mt-2 w-full bg-orange-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '62%' }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">62% of target</div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{(filteredStudents.length * 8.5).toFixed(0)}</div>
                    <div className="text-xs text-gray-600 mt-1">Total stories completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{(filteredStudents.length * 12.3).toFixed(0)}</div>
                    <div className="text-xs text-gray-600 mt-1">Audio submissions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{(filteredStudents.length * 156).toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mt-1">Vocabulary words practiced</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {((filteredStudents.length * 127 + filteredStudents.length * 84 + filteredStudents.length * 95 + filteredStudents.length * 62) / filteredStudents.length).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Avg total engagement min</div>
                  </div>
                </div>

                {/* Connection to Teacher Dashboard */}
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔗</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-indigo-900 mb-1">
                        Real-Time Data from Teacher Platform
                      </h4>
                      <p className="text-xs text-indigo-700">
                        These metrics are automatically calculated from teacher-assigned activities including story reading,
                        audio recordings, listening comprehension, and writing assignments. Data updates daily as students complete work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Year-over-Year Progress */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Historical Progress Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yoyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="percentProficient" stroke="#3b82f6" name="% of students who attained proficiency" strokeWidth={2} />
                      <Line type="monotone" dataKey="avgGrowth" stroke="#10b981" name="% of students making growth" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Title III Target:</strong> District must show annual progress toward state ELP goals
                    </p>
                  </div>
                </div>

                {/* ELP Domain Scores */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ELP Domain Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={elpDomainData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="domain" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                    {elpDomainData.map((domain, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600">{domain.domain}</div>
                        <div className="text-lg font-bold text-blue-600">{domain.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Proficiency Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Proficiency Level Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={proficiencyDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {proficiencyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Home Language Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={homeLanguageData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Compliance Alerts & Action Items
                </h3>
                <div className="space-y-3">
                  {title3Metrics.ltels > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <span className="text-2xl">⚠️</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900">LTEL Review Required</h4>
                        <p className="text-sm text-red-700">
                          {title3Metrics.ltels} long-term EL students need individualized support plans
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        Review Students
                      </button>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <span className="text-2xl">📋</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900">Annual WIDA Assessment Due</h4>
                      <p className="text-sm text-yellow-700">
                        Testing window opens March 1st - Ensure all EL students are registered
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">
                      View Schedule
                    </button>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <span className="text-2xl">📊</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">EDFacts Submission Upcoming</h4>
                      <p className="text-sm text-blue-700">
                        State reporting deadline: December 15th - All student data must be current
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TITLE III METRICS TAB */}
          {activeTab === 'title3' && (
            <motion.div
              key="title3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Title III Accountability Metrics</h2>
                <p className="text-blue-100">
                  Federal reporting requirements under ESSA Title III, Part A
                </p>
              </div>

              {/* Federal Accountability Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    ELs Making Progress Toward Proficiency
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {title3Metrics.percentMakingProgress}%
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {title3Metrics.makingProgress} of {title3Metrics.totalELs} students
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${title3Metrics.percentMakingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    <strong>State Target:</strong> 65% | <strong>Status:</strong> {title3Metrics.percentMakingProgress >= 65 ? '✓ Met' : '⚠️ Below'}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    ELs Attaining English Proficiency
                  </div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {title3Metrics.percentAttained}%
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {title3Metrics.attainedProficiency} students exited
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${title3Metrics.percentAttained}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    <strong>State Target:</strong> 15% | <strong>Status:</strong> {title3Metrics.percentAttained >= 15 ? '✓ Met' : '⚠️ Below'}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    ELs Meeting Academic Standards
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    78%
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Core content proficiency
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: '78%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    <strong>State Target:</strong> 70% | <strong>Status:</strong> ✓ Met
                  </p>
                </div>
              </div>

              {/* Subgroup Performance */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Subgroup Performance Analysis
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Subgroup</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Count</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Making Progress</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Attained Prof.</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">New ELs (Year 1)</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{title3Metrics.newELs}</td>
                        <td className="px-4 py-3 text-center text-sm text-green-600 font-semibold">85%</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-400">—</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">On Track</span>
                        </td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">LTELs (5+ years)</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{title3Metrics.ltels}</td>
                        <td className="px-4 py-3 text-center text-sm text-red-600 font-semibold">45%</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">8%</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Needs Support</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Immigrants</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{title3Metrics.immigrants}</td>
                        <td className="px-4 py-3 text-center text-sm text-green-600 font-semibold">72%</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">12%</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Monitor</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">RFEPs (Monitoring)</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{title3Metrics.rfeps}</td>
                        <td className="px-4 py-3 text-center text-sm text-purple-600 font-semibold">92%</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-400">—</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">On Track</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Federal Reporting Exports
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📊</span>
                      <span className="font-semibold text-gray-900">EDFacts File</span>
                    </div>
                    <p className="text-xs text-gray-600">FS141 English Learner data submission</p>
                  </button>

                  <button className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📈</span>
                      <span className="font-semibold text-gray-900">CSPR Report</span>
                    </div>
                    <p className="text-xs text-gray-600">Consolidated State Performance Report</p>
                  </button>

                  <button className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📄</span>
                      <span className="font-semibold text-gray-900">APR Data</span>
                    </div>
                    <p className="text-xs text-gray-600">Annual Performance Report metrics</p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ELP ASSESSMENTS TAB */}
          {activeTab === 'elp' && (
            <motion.div
              key="elp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  English Language Proficiency Assessment Data
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Four domain scores (Speaking, Listening, Reading, Writing) from annual ACCESS/WIDA assessments
                </p>

                {/* Domain Scores Detail */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {elpDomainData.map((domain, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-xs font-semibold text-gray-700 mb-1">{domain.domain}</div>
                      <div className="text-3xl font-bold text-blue-600">{domain.score}</div>
                      <div className="text-xs text-gray-500 mt-1">District Average</div>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(parseFloat(domain.score) / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Speaking Integration Callout */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">🎤</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">
                        Speaking Assessment Integration
                      </h3>
                      <p className="text-sm text-purple-700 mb-4">
                        Your platform captures ongoing speaking practice data that complements formal WIDA assessments.
                        Teachers collect pronunciation, summary, and discussion recordings throughout the year.
                      </p>
                      <Link
                        href="/mockups/conferences/teacher"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                      >
                        <span>View Teacher Dashboard</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Assessment Status */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">School</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Total ELs</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Assessed</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Pending</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {schools.filter(s => s !== 'All Schools').map((school, idx) => {
                        const schoolStudents = districtStudents.filter(s => s.school === school);
                        const assessed = schoolStudents.filter(s => s.assessmentStatus === 'Current').length;
                        const pending = schoolStudents.length - assessed;
                        const complianceRate = schoolStudents.length > 0 ? Math.round((assessed / schoolStudents.length) * 100) : 0;

                        return (
                          <tr key={idx} className={assessed < schoolStudents.length ? 'bg-yellow-50' : ''}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{school}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">{schoolStudents.length}</td>
                            <td className="px-4 py-3 text-center text-sm text-green-600 font-semibold">{assessed}</td>
                            <td className="px-4 py-3 text-center text-sm text-orange-600 font-semibold">{pending}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                complianceRate === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {complianceRate}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* DEMOGRAPHICS TAB */}
          {activeTab === 'demographics' && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Student Demographics & Enrollment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grade Distribution */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Grade Level Distribution</h3>
                    <div className="space-y-2">
                      {[
                        { range: 'K-2', grades: [0, 1, 2] },
                        { range: '3-5', grades: [3, 4, 5] },
                        { range: '6-8', grades: [6, 7, 8] },
                        { range: '9-12', grades: [9, 10, 11, 12] }
                      ].map((gradeRange, idx) => {
                        const count = filteredStudents.filter(s => gradeRange.grades.includes(s.grade)).length;
                        const percentage = title3Metrics.totalELs > 0 ? Math.round((count / title3Metrics.totalELs) * 100) : 0;
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-20 text-sm font-medium text-gray-700">{gradeRange.range}</div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-6 relative">
                                <div
                                  className="bg-blue-500 h-6 rounded-full flex items-center justify-end px-2"
                                  style={{ width: `${percentage}%` }}
                                >
                                  <span className="text-xs text-white font-semibold">{count}</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-12 text-right text-sm text-gray-600">{percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Program Type Distribution */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Program Type Enrollment</h3>
                    <div className="space-y-2">
                      {['ESL Pullout', 'ESL Integrated', 'Sheltered Instruction'].map((program, idx) => {
                        const count = filteredStudents.filter(s => s.program === program).length;
                        const percentage = Math.round((count / title3Metrics.totalELs) * 100);
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-32 text-sm font-medium text-gray-700">{program}</div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-6 relative">
                                <div
                                  className="bg-green-500 h-6 rounded-full flex items-center justify-end px-2"
                                  style={{ width: `${percentage}%` }}
                                >
                                  <span className="text-xs text-white font-semibold">{count}</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-12 text-right text-sm text-gray-600">{percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Home Languages */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Home Languages</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {homeLanguageData.map((lang, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600">{lang.value}</div>
                        <div className="text-xs text-gray-700 mt-1">{lang.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entry/Exit Tracking */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Entry/Exit Tracking (2024-25)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="text-sm text-gray-700 mb-1">New Entries</div>
                      <div className="text-3xl font-bold text-green-600">{title3Metrics.newELs}</div>
                      <div className="text-xs text-gray-500 mt-1">Since Aug 2024</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-gray-700 mb-1">Exited (RFEP)</div>
                      <div className="text-3xl font-bold text-purple-600">{title3Metrics.rfeps}</div>
                      <div className="text-xs text-gray-500 mt-1">Attained Proficiency</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-sm text-gray-700 mb-1">In Monitoring</div>
                      <div className="text-3xl font-bold text-blue-600">{title3Metrics.rfeps}</div>
                      <div className="text-xs text-gray-500 mt-1">Post-exit (2-4 yrs)</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Compliance Checklist
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Title III, Federal, and State Requirements Tracking
                </p>

                {/* Compliance Categories */}
                <div className="space-y-4">
                  {/* Service Minutes */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Service Minutes Compliance</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {filteredStudents.filter(s => s.serviceMinutes >= s.requiredMinutes).length}/{filteredStudents.length} Met
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      All EL students must receive required instructional minutes per state mandate
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{
                          width: `${(filteredStudents.filter(s => s.serviceMinutes >= s.requiredMinutes).length / filteredStudents.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* ILP Status */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Individual Learning Plans (ILPs)</h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        {filteredStudents.filter(s => s.ilpStatus === 'Active').length}/{filteredStudents.length} Current
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      State requirement: Annual ILP for each EL student with parent consultation
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-yellow-500 h-4 rounded-full"
                        style={{
                          width: `${(filteredStudents.filter(s => s.ilpStatus === 'Active').length / filteredStudents.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Parent Notification */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Parent Notification (30-day requirement)</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {filteredStudents.filter(s => s.parentNotification === 'Sent').length}/{filteredStudents.length} Sent
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Federal requirement: Parents must be notified within 30 days of identification
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{
                          width: `${(filteredStudents.filter(s => s.parentNotification === 'Sent').length / filteredStudents.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Annual Assessments */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Annual ELP Assessments (WIDA/ACCESS)</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {filteredStudents.filter(s => s.assessmentStatus === 'Current').length}/{filteredStudents.length} Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Federal requirement: All ELs K-12 must be assessed annually for English proficiency
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{
                          width: `${(filteredStudents.filter(s => s.assessmentStatus === 'Current').length / filteredStudents.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Report Generation & Export
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Generate pre-formatted reports for state and federal submissions
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Federal Reports */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Federal Reporting</h3>
                    <div className="space-y-3">
                      <button className="w-full p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">EDFacts FS141</span>
                          <span className="text-xs text-gray-500">Due: Dec 15</span>
                        </div>
                        <p className="text-xs text-gray-600">English Learner enrollment and outcome data</p>
                      </button>

                      <button className="w-full p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Title III APR</span>
                          <span className="text-xs text-gray-500">Annual</span>
                        </div>
                        <p className="text-xs text-gray-600">Annual Performance Report metrics & progress</p>
                      </button>

                      <button className="w-full p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">CSPR Submission</span>
                          <span className="text-xs text-gray-500">Annual</span>
                        </div>
                        <p className="text-xs text-gray-600">Consolidated State Performance Report</p>
                      </button>
                    </div>
                  </div>

                  {/* State & District Reports */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">State & District Reports</h3>
                    <div className="space-y-3">
                      <button className="w-full p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">LTEL Analysis</span>
                          <span className="text-xs text-gray-500">Quarterly</span>
                        </div>
                        <p className="text-xs text-gray-600">Long-term EL student intervention tracking</p>
                      </button>

                      <button className="w-full p-4 border-2 border-pink-200 rounded-lg hover:bg-pink-50 transition-colors text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Program Evaluation</span>
                          <span className="text-xs text-gray-500">Annual</span>
                        </div>
                        <p className="text-xs text-gray-600">EL program effectiveness & outcomes</p>
                      </button>

                      <button className="w-full p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Parent Engagement Log</span>
                          <span className="text-xs text-gray-500">Monthly</span>
                        </div>
                        <p className="text-xs text-gray-600">Communication & outreach documentation</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Export All Data */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Complete Data Export</h3>
                      <p className="text-sm text-gray-600">
                        Download all student EL data for external analysis or backup
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
