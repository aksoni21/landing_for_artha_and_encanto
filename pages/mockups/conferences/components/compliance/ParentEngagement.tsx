import { ParentCommunication } from '../../data/complianceData';

interface ParentEngagementProps {
  communications: ParentCommunication[];
}

export default function ParentEngagement({ communications }: ParentEngagementProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      'Sent': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Follow-up Needed': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMethodIcon = (method: string) => {
    const icons = {
      'Email': '📧',
      'Letter': '✉️',
      'Phone': '📞',
      'Meeting': '👥',
    };
    return icons[method as keyof typeof icons] || '📋';
  };

  // Summary statistics
  const stats = {
    total: communications.length,
    sent: communications.filter(c => c.status === 'Sent').length,
    pending: communications.filter(c => c.status === 'Pending').length,
    followup: communications.filter(c => c.status === 'Follow-up Needed').length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Parent Engagement & Communication</h2>
        <p className="text-sm text-gray-600">Track parent outreach and communication compliance</p>
      </div>

      {/* Summary Stats */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600">Total Communications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            <div className="text-xs text-gray-600">Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.followup}</div>
            <div className="text-xs text-gray-600">Need Follow-up</div>
          </div>
        </div>
      </div>

      {/* Communication Log */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Communications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Student</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Template</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Method</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Language</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {communications.map((comm) => (
                <tr key={comm.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-600">
                    {new Date(comm.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">{comm.studentName}</td>
                  <td className="px-3 py-2 text-gray-600">{comm.template}</td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1">
                      {getMethodIcon(comm.method)}
                      <span className="text-gray-600">{comm.method}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{comm.language}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(comm.status)}`}>
                      {comm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Parent Events</h3>
        <div className="space-y-2">
          {[
            { name: 'Family Literacy Night', date: '2025-11-15', attendees: 'Expected: 50' },
            { name: 'ESL Parent Advisory Meeting', date: '2025-11-10', attendees: 'Expected: 15' },
            { name: 'Multilingual Parent Conference', date: '2025-12-05', attendees: 'Expected: 75' },
          ].map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div>
                <div className="font-medium text-gray-900">{event.name}</div>
                <div className="text-xs text-gray-600">{event.attendees}</div>
              </div>
              <div className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
