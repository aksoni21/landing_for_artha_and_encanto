import { motion } from 'framer-motion';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  dueDate?: string;
  action: string;
}

interface ActionCenterCardProps {
  alerts: Alert[];
  onAlertClick?: (alertId: string) => void;
}

export default function ActionCenterCard({ alerts, onAlertClick }: ActionCenterCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Action Center</h2>
            <p className="text-sm text-gray-600">Urgent compliance alerts and deadlines</p>
          </div>
          {alerts.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white">
              {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">✅</div>
            <p className="text-gray-600 font-medium">All caught up!</p>
            <p className="text-sm text-gray-500 mt-1">No urgent compliance alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${getSeverityColor(alert.severity)}`}
                onClick={() => onAlertClick?.(alert.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{getSeverityIcon(alert.severity)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      {alert.dueDate && (
                        <span className="text-xs font-medium px-2 py-1 bg-white rounded-full whitespace-nowrap">
                          Due: {new Date(alert.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1 text-gray-700">{alert.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="text-sm font-medium hover:underline">
                        {alert.action} →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const generateMockAlerts = (): Alert[] => [
  {
    id: 'A001',
    title: 'Parent Notification Letters Overdue',
    description: '3 students have overdue parent notification letters. Federal compliance requires notification within 30 days.',
    severity: 'high',
    dueDate: '2025-10-15',
    action: 'View Students'
  },
  {
    id: 'A002',
    title: 'LTEL Student Reviews Needed',
    description: '4 students have been classified as Long-Term ELs and require intervention planning meetings.',
    severity: 'high',
    dueDate: '2025-11-15',
    action: 'Schedule Meetings'
  },
  {
    id: 'A003',
    title: 'Service Minutes Below Requirement',
    description: '5 students are not receiving required ESL service minutes. State compliance review is pending.',
    severity: 'medium',
    dueDate: '2025-11-30',
    action: 'Review Schedule'
  },
  {
    id: 'A004',
    title: 'WIDA Assessment Window Opening',
    description: 'Annual WIDA ACCESS testing window opens in 2 weeks. Ensure all materials and staff are prepared.',
    severity: 'medium',
    dueDate: '2025-03-15',
    action: 'View Checklist'
  },
  {
    id: 'A005',
    title: 'Title III Budget Review Due',
    description: 'Quarterly budget reconciliation report must be submitted to comply with Title III requirements.',
    severity: 'low',
    dueDate: '2025-12-01',
    action: 'View Report'
  }
];
