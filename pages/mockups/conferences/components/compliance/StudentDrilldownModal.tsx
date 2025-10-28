import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '../../data/complianceData';

interface StudentDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  title: string;
  filterCategory?: string;
}

export default function StudentDrilldownModal({
  isOpen,
  onClose,
  students,
  title,
  filterCategory
}: StudentDrilldownModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = [...students];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.school.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [students, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Complete': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Needs Update': 'bg-orange-100 text-orange-800',
      'Missing': 'bg-red-100 text-red-800',
      'Sent': 'bg-green-100 text-green-800',
      'Current': 'bg-green-100 text-green-800',
      'Due Soon': 'bg-yellow-100 text-yellow-800',
    };

    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCompliancePercentage = (student: Student) => {
    return Math.round((student.serviceMinutes / student.requiredMinutes) * 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-blue-100 text-sm">{filteredAndSortedStudents.length} student{filteredAndSortedStudents.length !== 1 ? 's' : ''} found</p>
            </div>
            <button
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search and Actions */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search by name, ID, or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export List
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {[
                    { key: 'id', label: 'ID' },
                    { key: 'name', label: 'Name' },
                    { key: 'school', label: 'School' },
                    { key: 'grade', label: 'Grade' },
                    { key: 'program', label: 'Program' },
                    { key: 'yearsInProgram', label: 'Years In' },
                    { key: 'lastScore', label: 'Score' },
                    { key: 'hlsStatus', label: 'HLS' },
                    { key: 'ilpStatus', label: 'ILP' },
                    { key: 'parentNotification', label: 'Parent' },
                    { key: 'assessmentStatus', label: 'Assessment' },
                    { key: 'serviceMinutes', label: 'Compliance' }
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort(key as keyof Student)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {sortField === key && (
                          <span className="text-blue-600">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{student.name}</div>
                      {student.isLTEL && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">LTEL</span>
                      )}
                      {student.isNewEL && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">New</span>
                      )}
                      {student.isRFEP && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-1">RFEP</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.school}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{student.grade}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.program}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{student.yearsInProgram}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-semibold ${
                        student.lastScore >= 4.5 ? 'text-green-600' :
                        student.lastScore >= 3.5 ? 'text-blue-600' :
                        student.lastScore >= 2.5 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {student.lastScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(student.hlsStatus)}`}>
                        {student.hlsStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(student.ilpStatus)}`}>
                        {student.ilpStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(student.parentNotification)}`}>
                        {student.parentNotification}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(student.assessmentStatus)}`}>
                        {student.assessmentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              getCompliancePercentage(student) >= 100 ? 'bg-green-500' :
                              getCompliancePercentage(student) >= 80 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(getCompliancePercentage(student), 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {getCompliancePercentage(student)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedStudents.length} of {students.length} students
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
