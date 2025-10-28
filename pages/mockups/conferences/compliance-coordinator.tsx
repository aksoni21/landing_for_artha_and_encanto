import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ActionCenterCard, { generateMockAlerts } from '../../../lib/mockups/conferences/components/compliance/ActionCenterCard';
import PopulationSummary from '../../../lib/mockups/conferences/components/compliance/PopulationSummary';
import StudentDrilldownModal from '../../../lib/mockups/conferences/components/compliance/StudentDrilldownModal';
import { ComplianceTracker, FundingView } from '../../../lib/mockups/conferences/components/compliance/ComplianceFundingViews';
import ParentEngagement from '../../../lib/mockups/conferences/components/compliance/ParentEngagement';
import {
  mockStudents,
  mockComplianceTasks,
  mockBudgetData,
  mockParentCommunications,
  mockStaffingData,
  mockGrowthData,
  schools,
  grades,
  Student
} from '../../../lib/mockups/conferences/data/complianceData';

export default function ComplianceCoordinatorDashboard() {
  // Filters
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');

  // Modal state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalStudents, setModalStudents] = useState<Student[]>([]);

  // Active view
  const [activeView, setActiveView] = useState('dashboard');

  // Filter students based on selected school and grade
  const filteredStudents = useMemo(() => {
    return mockStudents.filter(student => {
      if (selectedSchool !== 'All Schools' && student.school !== selectedSchool) return false;
      if (selectedGrade !== 'All Grades' && student.grade.toString() !== selectedGrade) return false;
      return true;
    });
  }, [selectedSchool, selectedGrade]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    return {
      totalELs: filteredStudents.length,
      newELs: filteredStudents.filter(s => s.isNewEL).length,
      ltels: filteredStudents.filter(s => s.isLTEL).length,
      rfeps: filteredStudents.filter(s => s.isRFEP).length,
      awaitingService: filteredStudents.filter(s => s.serviceMinutes < s.requiredMinutes).length,
    };
  }, [filteredStudents]);

  // Handle KPI card clicks
  const handleKPIClick = (category: string) => {
    let students: Student[] = [];
    let title = '';

    switch (category) {
      case 'all':
        students = filteredStudents;
        title = 'All EL Students';
        break;
      case 'new':
        students = filteredStudents.filter(s => s.isNewEL);
        title = 'New EL Students';
        break;
      case 'ltel':
        students = filteredStudents.filter(s => s.isLTEL);
        title = 'Long-Term EL Students (LTEL)';
        break;
      case 'rfep':
        students = filteredStudents.filter(s => s.isRFEP);
        title = 'RFEP Students';
        break;
      case 'awaiting':
        students = filteredStudents.filter(s => s.serviceMinutes < s.requiredMinutes);
        title = 'Students Awaiting Full Service';
        break;
    }

    setModalStudents(students);
    setModalTitle(title);
    setShowStudentModal(true);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'compliance', label: 'Compliance', icon: '✓' },
    { id: 'funding', label: 'Funding', icon: '💰' },
    { id: 'parent', label: 'Parent Outreach', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">ELL Compliance</h1>
          <p className="text-xs text-blue-200 mt-1">Coordinator Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeView === item.id
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">Demo Coordinator</div>
              <div className="text-xs text-blue-200">District Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ELL Compliance Dashboard</h2>
              <p className="text-sm text-gray-600">Monitor program compliance and student progress</p>
            </div>

            {/* Global Filters */}
            <div className="flex items-center gap-3">
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeView === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Action Center */}
              <ActionCenterCard alerts={generateMockAlerts()} />

              {/* Population Summary & Growth */}
              <PopulationSummary
                totalELs={kpis.totalELs}
                newELs={kpis.newELs}
                ltels={kpis.ltels}
                rfeps={kpis.rfeps}
                awaitingService={kpis.awaitingService}
                growthPercentage={mockGrowthData.meetingGrowth}
                onKPIClick={handleKPIClick}
              />

              {/* Program Compliance & Staffing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Compliance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Service Minutes Met</span>
                      <span className="text-lg font-bold text-green-600">
                        {filteredStudents.filter(s => s.serviceMinutes >= s.requiredMinutes).length}/{filteredStudents.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">ILPs Current</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {filteredStudents.filter(s => s.ilpStatus === 'Active').length}/{filteredStudents.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Assessments Current</span>
                      <span className="text-lg font-bold text-blue-600">
                        {filteredStudents.filter(s => s.assessmentStatus === 'Current').length}/{filteredStudents.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Staffing & Budget</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">ESL Certified Staff</span>
                        <span className="font-semibold">{mockStaffingData.certifiedStaff}/{mockStaffingData.requiredStaff}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: `${mockStaffingData.certificationRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Title III Budget Used</span>
                        <span className="font-semibold">${mockBudgetData.spent.toLocaleString()}/${mockBudgetData.allocated.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(mockBudgetData.spent / mockBudgetData.allocated) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'students' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">All Students</h2>
                  <button
                    onClick={() => {
                      setModalStudents(filteredStudents);
                      setModalTitle('All EL Students');
                      setShowStudentModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Full List
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Showing {filteredStudents.length} students based on current filters
                </p>
              </div>
            </motion.div>
          )}

          {activeView === 'compliance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ComplianceTracker tasks={mockComplianceTasks} />
            </motion.div>
          )}

          {activeView === 'funding' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FundingView expenditures={mockBudgetData.expenditures} />
            </motion.div>
          )}

          {activeView === 'parent' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ParentEngagement communications={mockParentCommunications} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Student Drilldown Modal */}
      <StudentDrilldownModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        students={modalStudents}
        title={modalTitle}
      />
    </div>
  );
}
