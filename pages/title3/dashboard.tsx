import { useState } from 'react';

// Simple chart components
const BarChart = ({ data, title, color = 'blue' }: {
  data: { label: string; value: number; target?: number }[];
  title: string;
  color?: string;
}) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.target || 0)));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-900">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
              {item.target && (
                <div
                  className="absolute w-0.5 h-3 bg-red-500"
                  style={{ marginLeft: `${(item.target / maxValue) * 100}%`, marginTop: '-12px' }}
                  title={`Target: ${item.target}%`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, title }: {
  data: { month: string; value: number }[];
  title: string;
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-48 flex items-end justify-between space-x-2">
        {data.map((point, index) => {
          const height = range > 0 ? ((point.value - minValue) / range) * 160 + 20 : 20;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t relative group"
                style={{ height: `${height}px` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {point.value}%
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                {point.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PieChart = ({ data, title }: {
  data: { label: string; value: number; color: string }[];
  title: string;
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#f3f4f6"
              strokeWidth="2"
            />
            {data.map((segment, index) => {
              const percentage = (segment.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;

              return (
                <circle
                  key={index}
                  cx="18"
                  cy="18"
                  r="16"
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth="2"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HeatMap = ({ data, title }: {
  data: { school: string; months: number[] }[];
  title: string;
}) => {
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const maxValue = Math.max(...data.flatMap(d => d.months));

  const getHeatColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity < 0.3) return 'bg-red-200';
    if (intensity < 0.6) return 'bg-yellow-200';
    if (intensity < 0.8) return 'bg-green-200';
    return 'bg-green-400';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-10 gap-1 text-xs">
          <div></div>
          {months.map(month => (
            <div key={month} className="text-center font-medium text-gray-600 p-1">
              {month}
            </div>
          ))}
          {data.map((school, schoolIndex) => (
            <>
              <div key={`${schoolIndex}-label`} className="text-right pr-2 py-1 text-gray-700 font-medium">
                {school.school}
              </div>
              {school.months.map((value, monthIndex) => (
                <div
                  key={`${schoolIndex}-${monthIndex}`}
                  className={`h-8 ${getHeatColor(value)} border border-gray-300 flex items-center justify-center text-xs font-medium`}
                  title={`${school.school} - ${months[monthIndex]}: ${value}%`}
                >
                  {value}
                </div>
              ))}
            </>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-4 text-xs text-gray-600">
          <span>Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-red-200 border"></div>
            <div className="w-4 h-4 bg-yellow-200 border"></div>
            <div className="w-4 h-4 bg-green-200 border"></div>
            <div className="w-4 h-4 bg-green-400 border"></div>
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

const StudentProgressTable = ({ students }: { students: any[] }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Student Progress Tracker</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voice AI Minutes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-500">Grade {student.grade}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {student.proficiencyLevel}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-900">{student.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.voiceMinutes} min/week
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(student.lastActivity).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MultiLineChart = ({ data, title }: {
  data: { week: string; reading: number; speaking: number; listening: number; writing: number }[];
  title: string;
}) => {
  const skills = ['reading', 'speaking', 'listening', 'writing'];
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
  const maxValue = Math.max(...data.flatMap(d => [d.reading, d.speaking, d.listening, d.writing]));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 w-full" />
          ))}
        </div>

        {/* Data points and lines */}
        <div className="relative h-full flex justify-between items-end">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 relative">
              {skills.map((skill, skillIndex) => {
                const value = point[skill as keyof typeof point] as number;
                const height = (value / maxValue) * 200;
                return (
                  <div
                    key={skill}
                    className="w-2 rounded-full absolute bottom-8"
                    style={{
                      height: `${height}px`,
                      backgroundColor: colors[skillIndex],
                      left: `${skillIndex * 8}px`
                    }}
                    title={`${skill}: ${value}%`}
                  />
                );
              })}
              <div className="text-xs text-gray-500 mt-4">{point.week}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-4">
          {skills.map((skill, index) => (
            <div key={skill} className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }} />
              <span className="text-xs text-gray-600 capitalize">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TeacherStudentCards = ({ students }: { students: any[] }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Students</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {students.map((student, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{student.name}</h4>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {student.level}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Weekly Minutes:</span>
              <span className="font-medium">{student.weeklyMinutes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stories Completed:</span>
              <span className="font-medium">{student.storiesCompleted}</span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-red-600 mb-1">
                <strong>Struggling:</strong> {student.strugglingWith}
              </div>
              <div className="text-xs text-green-600">
                <strong>Strength:</strong> {student.strength}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const InterventionAlerts = ({ alerts }: { alerts: any[] }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Intervention Alerts</h3>
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div key={index} className={`p-4 rounded-lg border-l-4 ${
          alert.severity === 'high' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">{alert.student}</h4>
              <p className="text-sm text-gray-600">{alert.issue}</p>
              <p className="text-xs text-gray-500 mt-1">{alert.action}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              alert.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Title3Dashboard() {
  const [selectedView, setSelectedView] = useState<'district' | 'school' | 'teacher'>('district');

  // Mock data
  const mockData = {
    district: {
      totalELLs: 2847,
      proficiencyTarget: 15.2,
      actualProficiency: 18.4,
      engagementMinutes: 45680,
      vocabularyGrowth: 23.7,
      schools: [
        { name: 'Roosevelt Elementary', ells: 245, proficiency: 22.1, engagement: 4.2, status: 'exceeding' },
        { name: 'Lincoln Middle', ells: 198, proficiency: 16.8, engagement: 3.8, status: 'meeting' },
        { name: 'Washington High', ells: 156, proficiency: 12.3, engagement: 2.9, status: 'below' },
        { name: 'Jefferson Elementary', ells: 301, proficiency: 19.7, engagement: 4.1, status: 'meeting' },
      ]
    },
    compliance: {
      amaos: [
        { metric: 'AMAO 1: English Proficiency Progress', target: 65, actual: 72.3, status: 'met' },
        { metric: 'AMAO 2: Achieving Proficiency', target: 15.2, actual: 18.4, status: 'met' },
        { metric: 'AMAO 3: Academic Achievement (Math)', target: 45, actual: 48.1, status: 'met' },
      ],
      reporting: {
        lastUpdate: '2025-03-15',
        nextDue: '2025-06-30',
        status: 'compliant'
      }
    },
    school: {
      name: 'Roosevelt Elementary School',
      ellCount: 245,
      teachers: 8,
      classrooms: 12,
      currentProficiency: 22.1,
      targetProficiency: 18.0,
      students: [
        { id: '1', name: 'Maria Garcia', grade: 3, proficiencyLevel: 'Intermediate', progress: 78, voiceMinutes: 45, lastActivity: '2025-03-20' },
        { id: '2', name: 'Ahmed Hassan', grade: 4, proficiencyLevel: 'Advanced', progress: 92, voiceMinutes: 52, lastActivity: '2025-03-19' },
        { id: '3', name: 'Lin Zhang', grade: 3, proficiencyLevel: 'Beginner', progress: 34, voiceMinutes: 28, lastActivity: '2025-03-18' },
        { id: '4', name: 'Carlos Rodriguez', grade: 5, proficiencyLevel: 'Proficient', progress: 88, voiceMinutes: 67, lastActivity: '2025-03-20' },
        { id: '5', name: 'Fatima Al-Ahmad', grade: 4, proficiencyLevel: 'Intermediate', progress: 65, voiceMinutes: 41, lastActivity: '2025-03-19' },
      ],
      weeklyProgress: [
        { week: 'Week 1', reading: 23, speaking: 18, listening: 25, writing: 15 },
        { week: 'Week 2', reading: 28, speaking: 22, listening: 29, writing: 19 },
        { week: 'Week 3', reading: 32, speaking: 26, listening: 31, writing: 23 },
        { week: 'Week 4', reading: 35, speaking: 29, listening: 34, writing: 26 },
      ]
    },
    teacher: {
      name: 'Ms. Sarah Johnson',
      grade: '3rd Grade ESL',
      students: 18,
      classroom: 'Room 205',
      certification: 'ESL Endorsed',
      myStudents: [
        { name: 'Maria Garcia', level: 'Intermediate', weeklyMinutes: 45, storiesCompleted: 3, strugglingWith: 'Past tense verbs', strength: 'Vocabulary retention' },
        { name: 'Lin Zhang', level: 'Beginner', weeklyMinutes: 28, storiesCompleted: 2, strugglingWith: 'Pronunciation', strength: 'Listening comprehension' },
        { name: 'Jose Martinez', level: 'Intermediate', weeklyMinutes: 38, storiesCompleted: 4, strugglingWith: 'Complex sentences', strength: 'Speaking confidence' },
        { name: 'Aisha Patel', level: 'Advanced', weeklyMinutes: 55, storiesCompleted: 5, strugglingWith: 'Academic writing', strength: 'Conversation skills' },
      ],
      weeklyData: [
        { day: 'Mon', engagement: 85, participation: 78, assignments: 92 },
        { day: 'Tue', engagement: 78, participation: 82, assignments: 88 },
        { day: 'Wed', engagement: 92, participation: 89, assignments: 95 },
        { day: 'Thu', engagement: 88, participation: 85, assignments: 90 },
        { day: 'Fri', engagement: 82, participation: 80, assignments: 85 },
      ],
      interventionAlerts: [
        { student: 'Lin Zhang', issue: 'Declining participation', severity: 'medium', action: 'Schedule parent conference' },
        { student: 'Carlos Mendez', issue: 'Missing assignments', severity: 'high', action: 'Immediate intervention needed' },
      ]
    },
    charts: {
      proficiencyTrend: [
        { month: 'Sep', value: 14.2 },
        { month: 'Oct', value: 15.1 },
        { month: 'Nov', value: 16.3 },
        { month: 'Dec', value: 17.1 },
        { month: 'Jan', value: 17.8 },
        { month: 'Feb', value: 18.4 },
        { month: 'Mar', value: 19.2 }
      ],
      languageLevels: [
        { label: 'Beginner', value: 458, color: '#ef4444' },
        { label: 'Intermediate', value: 912, color: '#f97316' },
        { label: 'Advanced', value: 687, color: '#eab308' },
        { label: 'Proficient', value: 456, color: '#22c55e' },
        { label: 'Fluent', value: 334, color: '#3b82f6' }
      ],
      schoolPerformance: [
        { label: 'Roosevelt Elementary', value: 22.1, target: 18.0 },
        { label: 'Lincoln Middle', value: 16.8, target: 15.5 },
        { label: 'Washington High', value: 12.3, target: 14.0 },
        { label: 'Jefferson Elementary', value: 19.7, target: 16.5 },
        { label: 'Adams Middle', value: 14.9, target: 15.0 }
      ],
      engagementHeatmap: [
        { school: 'Roosevelt', months: [18, 22, 25, 28, 31, 29, 33, 35, 32] },
        { school: 'Lincoln', months: [15, 18, 21, 19, 23, 26, 24, 28, 27] },
        { school: 'Washington', months: [12, 14, 13, 16, 18, 17, 19, 21, 20] },
        { school: 'Jefferson', months: [19, 21, 24, 26, 28, 25, 30, 32, 29] }
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeding':
      case 'met':
        return 'text-green-600 bg-green-100';
      case 'meeting':
        return 'text-yellow-600 bg-yellow-100';
      case 'below':
      case 'not-met':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const MetricCard = ({ title, value, subtitle, trend, color = 'blue' }: {
    title: string;
    value: string | number;
    subtitle: string;
    trend?: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        {trend && (
          <div className="text-right">
            <span className="text-sm font-medium text-green-600">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  const ComplianceStatus = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Title III Compliance Status</h2>
        <p className="text-sm text-gray-600">Annual Measurable Achievement Objectives (AMAOs)</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockData.compliance.amaos.map((amao, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{amao.metric}</h3>
                <p className="text-sm text-gray-600">Target: {amao.target}% | Actual: {amao.actual}%</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(amao.status)}`}>
                {amao.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-green-500 text-xl">✓</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Compliance Status: MEETING ALL TARGETS</h3>
              <p className="text-sm text-green-700">
                Last updated: {mockData.compliance.reporting.lastUpdate} | Next report due: {mockData.compliance.reporting.nextDue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EngagementInsights = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Voice AI Platform Insights</h2>
        <p className="text-sm text-gray-600">Real-time engagement data beyond traditional assessments</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Speaking Practice Analytics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Daily Speaking Time</span>
                <span className="text-sm font-medium">12.4 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pronunciation Improvement</span>
                <span className="text-sm font-medium text-green-600">+23.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vocabulary Retention</span>
                <span className="text-sm font-medium text-blue-600">87.3%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Engagement Patterns</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stories Completed/Week</span>
                <span className="text-sm font-medium">3.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time-on-Task Rate</span>
                <span className="text-sm font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Student-Initiated Practice</span>
                <span className="text-sm font-medium text-blue-600">67%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">📊 Key Insight</h4>
          <p className="text-sm text-blue-700">
            Students using Voice AI show 34% faster vocabulary acquisition compared to traditional methods.
            This authentic speaking practice directly supports AMAO 1 proficiency goals.
          </p>
        </div>
      </div>
    </div>
  );

  const SchoolPerformance = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">School Performance Overview</h2>
        <p className="text-sm text-gray-600">ELL outcomes by school site</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ELL Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proficiency Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockData.district.schools.map((school, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{school.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{school.ells}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{school.proficiency}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{school.engagement}/5.0</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(school.status)}`}>
                    {school.status.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Title III ELL Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics for English Language Learner programs</p>

          {/* View Selector */}
          <div className="mt-4 flex space-x-2">
            {[
              { key: 'district', label: 'District Overview' },
              { key: 'school', label: 'School Level' },
              { key: 'teacher', label: 'Teacher View' }
            ].map(view => (
              <button
                key={view.key}
                onClick={() => setSelectedView(view.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedView === view.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* View-Specific Content */}
        {selectedView === 'district' && (
          <>
            {/* District Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total ELL Students"
                value={mockData.district.totalELLs.toLocaleString()}
                subtitle="Across 24 schools"
                trend="+3.2% from last year"
              />
              <MetricCard
                title="Proficiency Rate"
                value={`${mockData.district.actualProficiency}%`}
                subtitle={`Target: ${mockData.district.proficiencyTarget}%`}
                trend="Above target"
              />
              <MetricCard
                title="Engagement Minutes"
                value={`${Math.round(mockData.district.engagementMinutes / 1000)}k`}
                subtitle="Weekly voice AI practice"
                trend="+45% this quarter"
              />
              <MetricCard
                title="Vocabulary Growth"
                value={`+${mockData.district.vocabularyGrowth}%`}
                subtitle="Average per student"
                trend="Exceeding expectations"
              />
            </div>

            {/* District Level - Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <LineChart
                data={mockData.charts.proficiencyTrend}
                title="ELL Proficiency Trend (Academic Year)"
              />
              <PieChart
                data={mockData.charts.languageLevels}
                title="Students by Language Proficiency Level"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <BarChart
                data={mockData.charts.schoolPerformance}
                title="School Performance vs. Targets"
                color="green"
              />
              <ComplianceStatus />
            </div>

            {/* Engagement Heatmap */}
            <div className="mb-8">
              <HeatMap
                data={mockData.charts.engagementHeatmap}
                title="Voice AI Engagement Levels by School & Month (%)"
              />
            </div>

            {/* Enhanced Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <EngagementInsights />
              <SchoolPerformance />
            </div>
          </>
        )}

        {selectedView === 'school' && (
          <>
            {/* School Level Dashboard */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{mockData.school.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockData.school.ellCount}</div>
                  <div className="text-sm text-gray-500">ELL Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mockData.school.teachers}</div>
                  <div className="text-sm text-gray-500">ESL Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{mockData.school.currentProficiency}%</div>
                  <div className="text-sm text-gray-500">Current Proficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{mockData.school.targetProficiency}%</div>
                  <div className="text-sm text-gray-500">Target Proficiency</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <MultiLineChart
                data={mockData.school.weeklyProgress}
                title="Language Skills Progress (4-Week Trend)"
              />
              <PieChart
                data={mockData.charts.languageLevels}
                title="School Language Distribution"
              />
            </div>

            <StudentProgressTable students={mockData.school.students} />
          </>
        )}

        {selectedView === 'teacher' && (
          <>
            {/* Teacher Level Dashboard */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {mockData.teacher.name} - {mockData.teacher.grade}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockData.teacher.students}</div>
                  <div className="text-sm text-gray-500">My Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mockData.teacher.classroom}</div>
                  <div className="text-sm text-gray-500">Classroom</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-500">Class Avg Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{mockData.teacher.certification}</div>
                  <div className="text-sm text-gray-500">Certification</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <BarChart
                data={mockData.teacher.weeklyData.map(d => ({ label: d.day, value: d.engagement }))}
                title="Daily Engagement Levels (This Week)"
                color="blue"
              />
              <InterventionAlerts alerts={mockData.teacher.interventionAlerts} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TeacherStudentCards students={mockData.teacher.myStudents} />
              <LineChart
                data={[
                  { month: 'Week 1', value: 68 },
                  { month: 'Week 2', value: 72 },
                  { month: 'Week 3', value: 78 },
                  { month: 'Week 4', value: 82 },
                  { month: 'Week 5', value: 85 },
                  { month: 'Week 6', value: 88 }
                ]}
                title="Class Average Progress Trend"
              />
            </div>
          </>
        )}

        {/* Action Items */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="ml-3">
                <p className="text-sm text-gray-900">
                  <strong>Washington High School:</strong> Proficiency rate below target. Consider increasing voice AI usage and targeted intervention.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="ml-3">
                <p className="text-sm text-gray-900">
                  <strong>Professional Development:</strong> Schedule ESL teacher training on voice AI integration for Q2.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="ml-3">
                <p className="text-sm text-gray-900">
                  <strong>Success Story:</strong> Roosevelt Elementary's voice AI pilot shows exceptional results - consider district-wide expansion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}