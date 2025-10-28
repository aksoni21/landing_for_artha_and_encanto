import { motion } from 'framer-motion';

interface KPICardData {
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

interface PopulationSummaryProps {
  totalELs: number;
  newELs: number;
  ltels: number;
  rfeps: number;
  awaitingService: number;
  growthPercentage: number;
  onKPIClick?: (category: string) => void;
}

export default function PopulationSummary({
  totalELs,
  newELs,
  ltels,
  rfeps,
  awaitingService,
  growthPercentage,
  onKPIClick
}: PopulationSummaryProps) {
  const kpiCards: KPICardData[] = [
    {
      title: 'Total EL Students',
      value: totalELs,
      icon: '👥',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      onClick: () => onKPIClick?.('all')
    },
    {
      title: 'New ELs (This Year)',
      value: newELs,
      icon: '🆕',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      onClick: () => onKPIClick?.('new')
    },
    {
      title: 'LTELs',
      value: ltels,
      icon: '⏰',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      trend: { value: 2, direction: 'down' },
      onClick: () => onKPIClick?.('ltel')
    },
    {
      title: 'RFEP Students',
      value: rfeps,
      icon: '🎓',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      trend: { value: 3, direction: 'up' },
      onClick: () => onKPIClick?.('rfep')
    },
    {
      title: 'Awaiting Service',
      value: awaitingService,
      icon: '⏳',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      onClick: () => onKPIClick?.('awaiting')
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Population Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bgColor} rounded-lg shadow-md border-l-4 ${card.borderColor} p-5 cursor-pointer hover:shadow-lg transition-all`}
              onClick={card.onClick}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{card.icon}</span>
                {card.trend && (
                  <div className={`flex items-center text-xs font-medium ${
                    card.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{card.trend.direction === 'up' ? '↑' : '↓'}</span>
                    <span className="ml-1">{card.trend.value}</span>
                  </div>
                )}
              </div>
              <div className={`text-3xl font-bold ${card.color} mb-1`}>
                {card.value}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {card.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Student Growth Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Student Growth & Proficiency</h3>
            <p className="text-sm text-gray-600">EL students meeting annual growth targets (WIDA)</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{growthPercentage}%</div>
            <div className="text-xs text-gray-500">Meeting Growth</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Progress toward 80% goal</span>
            <span>{growthPercentage}% / 80%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(growthPercentage / 80) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                growthPercentage >= 80 ? 'bg-green-500' :
                growthPercentage >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">{growthPercentage}%</div>
              <div className="text-xs text-gray-600">Meeting Growth</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">{100 - growthPercentage}%</div>
              <div className="text-xs text-gray-600">Below Target</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
