import { useState } from 'react';
import { ComplianceTask, BudgetExpenditure, mockBudgetData } from '../../data/complianceData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Compliance Tracker Component
export function ComplianceTracker({ tasks }: { tasks: ComplianceTask[] }) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMandate, setFilterMandate] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterMandate !== 'all' && task.mandateLevel !== filterMandate) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      'Complete': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMandateBadge = (mandate: string) => {
    const colors = {
      'Title III': 'bg-blue-100 text-blue-800',
      'Federal': 'bg-purple-100 text-purple-800',
      'State': 'bg-indigo-100 text-indigo-800',
    };
    return colors[mandate as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Compliance Task Tracker</h2>
        <p className="text-sm text-gray-600">Monitor compliance deadlines and requirements</p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b bg-gray-50 flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
        <select
          value={filterMandate}
          onChange={(e) => setFilterMandate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Mandates</option>
          <option value="Title III">Title III</option>
          <option value="Federal">Federal</option>
          <option value="State">State</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Task</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mandate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.task}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getMandateBadge(task.mandateLevel)}`}>
                    {task.mandateLevel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{task.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Funding View Component
export function FundingView({ expenditures }: { expenditures: BudgetExpenditure[] }) {
  const pieData = [
    { name: 'Spent', value: mockBudgetData.spent, color: '#3b82f6' },
    { name: 'Remaining', value: mockBudgetData.allocated - mockBudgetData.spent, color: '#e5e7eb' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Title III Funding</h2>
        <p className="text-sm text-gray-600">Budget allocation and expenditure tracking</p>
      </div>

      <div className="p-6">
        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Allocated</div>
            <div className="text-2xl font-bold text-blue-900">
              ${mockBudgetData.allocated.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 font-medium">Spent</div>
            <div className="text-2xl font-bold text-green-900">
              ${mockBudgetData.spent.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 font-medium">Remaining</div>
            <div className="text-2xl font-bold text-gray-900">
              ${(mockBudgetData.allocated - mockBudgetData.spent).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expenditures Table */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Expenditures</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Category</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenditures.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-600">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">{exp.category}</td>
                    <td className="px-3 py-2 text-gray-600">{exp.description}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">
                      ${exp.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        exp.complianceStatus === 'Compliant'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {exp.complianceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
