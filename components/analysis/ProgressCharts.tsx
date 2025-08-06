import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface HistoricalData {
  date: string;
  overallScore: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  discourse: number;
  cefrLevel: string;
  sessionDuration: number;
}

interface ProgressChartsProps {
  historicalData: HistoricalData[];
  currentScores: {
    grammar: number;
    vocabulary: number;
    fluency: number;
    pronunciation: number;
    discourse: number;
  };
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
  className?: string;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  historicalData,
  currentScores,
  timeframe,
  onTimeframeChange,
  className = '',
}) => {
  const [activeChart, setActiveChart] = useState<'line' | 'radar' | 'bar' | 'comparison'>('line');

  const colors = {
    grammar: '#ef4444',
    vocabulary: '#f59e0b',
    fluency: '#10b981',
    pronunciation: '#3b82f6',
    discourse: '#8b5cf6',
    overall: '#6b7280'
  };

  const cefrColors = {
    'A1': '#ef4444',
    'A2': '#f59e0b',
    'B1': '#eab308',
    'B2': '#22c55e',
    'C1': '#3b82f6',
    'C2': '#8b5cf6'
  };

  // Prepare data for radar chart
  const radarData = [
    { component: 'Grammar', score: currentScores.grammar, fullMark: 100 },
    { component: 'Vocabulary', score: currentScores.vocabulary, fullMark: 100 },
    { component: 'Fluency', score: currentScores.fluency, fullMark: 100 },
    { component: 'Pronunciation', score: currentScores.pronunciation, fullMark: 100 },
    { component: 'Discourse', score: currentScores.discourse, fullMark: 100 },
  ];

  // Prepare data for component comparison
  const comparisonData = Object.entries(currentScores).map(([component, score]) => ({
    component: component.charAt(0).toUpperCase() + component.slice(1),
    score,
    target: getTargetScore(component),
    improvement: score - getPreviousScore(component),
  }));

  // Prepare CEFR distribution data
  const cefrDistribution = getCEFRDistribution(historicalData);

  function getTargetScore(component: string): number {
    // Mock target scores based on next CEFR level
    const targets = {
      grammar: 85,
      vocabulary: 80,
      fluency: 75,
      pronunciation: 78,
      discourse: 82
    };
    return targets[component as keyof typeof targets] || 80;
  }

  function getPreviousScore(component: string): number {
    if (historicalData.length < 2) return currentScores[component as keyof typeof currentScores];
    const previousData = historicalData[historicalData.length - 2];
    return previousData[component as keyof typeof previousData] as number || 0;
  }

  function getCEFRDistribution(data: HistoricalData[]) {
    const distribution: Record<string, number> = {};
    data.forEach(entry => {
      distribution[entry.cefrLevel] = (distribution[entry.cefrLevel] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([level, count]) => ({
      name: level,
      value: count,
      percentage: Math.round((count / data.length) * 100)
    }));
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeframe === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeframe === 'month') {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${Math.round(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Progress Analytics</h3>
          <p className="text-sm text-gray-600">Track your improvement over time</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Chart Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['line', 'radar', 'bar', 'comparison'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveChart(type as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeChart === type
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => onTimeframeChange(period as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  timeframe === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-80 w-full"
      >
        {activeChart === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Line
                type="monotone"
                dataKey="overallScore"
                stroke={colors.overall}
                strokeWidth={3}
                dot={{ fill: colors.overall, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors.overall, strokeWidth: 2 }}
                name="Overall"
              />
              <Line
                type="monotone"
                dataKey="grammar"
                stroke={colors.grammar}
                strokeWidth={2}
                dot={{ fill: colors.grammar, r: 3 }}
                name="Grammar"
              />
              <Line
                type="monotone"
                dataKey="vocabulary"
                stroke={colors.vocabulary}
                strokeWidth={2}
                dot={{ fill: colors.vocabulary, r: 3 }}
                name="Vocabulary"
              />
              <Line
                type="monotone"
                dataKey="fluency"
                stroke={colors.fluency}
                strokeWidth={2}
                dot={{ fill: colors.fluency, r: 3 }}
                name="Fluency"
              />
              <Line
                type="monotone"
                dataKey="pronunciation"
                stroke={colors.pronunciation}
                strokeWidth={2}
                dot={{ fill: colors.pronunciation, r: 3 }}
                name="Pronunciation"
              />
              <Line
                type="monotone"
                dataKey="discourse"
                stroke={colors.discourse}
                strokeWidth={2}
                dot={{ fill: colors.discourse, r: 3 }}
                name="Discourse"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'radar' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="component" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <Radar
                name="Current Scores"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Target"
                dataKey="fullMark"
                stroke="#e5e7eb"
                fill="#e5e7eb"
                fillOpacity={0.1}
                strokeWidth={1}
                strokeDasharray="5 5"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="component"
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar 
                dataKey="score" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Current Score"
              />
              <Bar 
                dataKey="target" 
                fill="#e5e7eb"
                radius={[4, 4, 0, 0]}
                name="Target Score"
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'comparison' && cefrDistribution.length > 0 && (
          <div className="flex justify-center items-center h-full">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={cefrDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cefrDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={cefrColors[entry.name as keyof typeof cefrColors] || '#6b7280'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {historicalData.length > 1 
                ? Math.round(((historicalData[historicalData.length - 1].overallScore - historicalData[0].overallScore) / historicalData[0].overallScore) * 100)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-600">Total Improvement</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {historicalData.length}
            </div>
            <div className="text-sm text-gray-600">Sessions Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {historicalData.length > 0 
                ? Math.round(historicalData.reduce((sum, session) => sum + session.sessionDuration, 0) / 60)
                : 0
              }
            </div>
            <div className="text-sm text-gray-600">Minutes Practiced</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {historicalData.length > 0 ? historicalData[historicalData.length - 1].cefrLevel : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      {historicalData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-semibold text-gray-800 mb-3">📊 Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {generateInsights(historicalData, currentScores).map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span className="text-gray-600">{insight}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

function generateInsights(historicalData: HistoricalData[], currentScores: any): string[] {
  const insights: string[] = [];
  
  if (historicalData.length < 2) {
    return ['Complete more sessions to see detailed progress insights.'];
  }

  const latest = historicalData[historicalData.length - 1];
  const previous = historicalData[historicalData.length - 2];
  
  // Overall improvement
  const overallChange = latest.overallScore - previous.overallScore;
  if (overallChange > 5) {
    insights.push(`Excellent progress! Your overall score improved by ${Math.round(overallChange)} points.`);
  } else if (overallChange > 0) {
    insights.push(`Steady improvement with a ${Math.round(overallChange)} point increase.`);
  }

  // Component insights
  const components = ['grammar', 'vocabulary', 'fluency', 'pronunciation', 'discourse'];
  const improvements = components.map(comp => ({
    component: comp,
    change: (latest[comp as keyof typeof latest] as number) - (previous[comp as keyof typeof previous] as number)
  })).sort((a, b) => b.change - a.change);

  const bestImprovement = improvements[0];
  if (bestImprovement.change > 3) {
    insights.push(`${bestImprovement.component} showed the most improvement (+${Math.round(bestImprovement.change)} points).`);
  }

  // Consistency insights
  const recentSessions = historicalData.slice(-5);
  const variance = recentSessions.length > 1 ? 
    Math.sqrt(recentSessions.reduce((sum, session) => sum + Math.pow(session.overallScore - latest.overallScore, 2), 0) / recentSessions.length) : 0;
  
  if (variance < 5) {
    insights.push('Your performance has been very consistent recently.');
  }

  // Frequency insights
  if (historicalData.length >= 4) {
    const avgSessionsPerWeek = historicalData.length / 4; // Assuming 4-week period
    if (avgSessionsPerWeek >= 2) {
      insights.push('Great practice frequency - you\'re maintaining regular sessions.');
    }
  }

  return insights.slice(0, 4); // Limit to 4 insights
}

export default ProgressCharts;