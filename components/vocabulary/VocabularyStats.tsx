import React from 'react';
import { VocabularyStats as VocabularyStatsType } from '../../services/vocabularyService';

interface VocabularyStatsProps {
  stats: VocabularyStatsType | null;
  isLoading?: boolean;
}

const VocabularyStats: React.FC<VocabularyStatsProps> = ({ stats, isLoading }) => {
  const formatLastLookup = (lastLookup?: string) => {
    if (!lastLookup) return 'Never';
    
    const date = new Date(lastLookup);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const calculateStreakInfo = () => {
    if (!stats || !stats.recent_activity || stats.recent_activity.length === 0) {
      return { currentStreak: 0, weeklyTotal: 0 };
    }

    // Calculate current streak
    let currentStreak = 0;
    const sortedActivity = stats.recent_activity.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (let i = 0; i < sortedActivity.length; i++) {
      const activityDate = new Date(sortedActivity[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (activityDate.toDateString() === expectedDate.toDateString() && sortedActivity[i].lookups > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate weekly total
    const weeklyTotal = stats.recent_activity.reduce((total, day) => total + day.lookups, 0);

    return { currentStreak, weeklyTotal };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No statistics available yet</p>
      </div>
    );
  }

  const { currentStreak, weeklyTotal } = calculateStreakInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Vocabulary Progress</h2>
        <p className="text-gray-600">Track your literary vocabulary journey</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Lookups</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total_lookups}</p>
              <p className="text-xs text-gray-500">words explored</p>
            </div>
            <span className="text-3xl">🔍</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Words</p>
              <p className="text-2xl font-bold text-green-600">{stats.unique_words}</p>
              <p className="text-xs text-gray-500">vocabulary size</p>
            </div>
            <span className="text-3xl">📝</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Books Read</p>
              <p className="text-2xl font-bold text-purple-600">{stats.books_read}</p>
              <p className="text-xs text-gray-500">literary sources</p>
            </div>
            <span className="text-3xl">📚</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-orange-600">{weeklyTotal}</p>
              <p className="text-xs text-gray-500">lookups</p>
            </div>
            <span className="text-3xl">⚡</span>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 7-Day Activity</h3>
        <div className="relative">
          <div className="flex items-end justify-between h-40 space-x-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateString = date.toISOString().split('T')[0];
              const dayData = stats.recent_activity.find(d => d.date === dateString);
              const lookups = dayData ? dayData.lookups : 0;
              const maxLookups = Math.max(...stats.recent_activity.map(d => d.lookups), 1);
              const height = (lookups / maxLookups) * 100;
              const isToday = i === 6;

              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative h-32 flex items-end">
                    <div className="w-full flex flex-col items-center">
                      {lookups > 0 && (
                        <span className="text-xs font-medium text-gray-700 mb-1">
                          {lookups}
                        </span>
                      )}
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isToday ? 'bg-blue-600' : 'bg-blue-400'
                        }`}
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${isToday ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                    {isToday ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Learning Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Learning Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">🔥 Current Streak:</span>
            <span className="font-semibold text-lg">
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">📅 Last Lookup:</span>
            <span className="font-semibold text-lg">
              {formatLastLookup(stats.last_lookup)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">📈 Weekly Average:</span>
            <span className="font-semibold text-lg">
              {Math.round(weeklyTotal / 7 * 10) / 10} per day
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">📚 Words per Book:</span>
            <span className="font-semibold text-lg">
              {stats.books_read > 0 ? Math.round(stats.total_lookups / stats.books_read) : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏅 Milestones</h3>
        
        <div className="space-y-3">
          <div className={`flex items-center p-4 rounded-lg ${
            stats.unique_words >= 10 ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <span className="text-2xl mr-3">
              {stats.unique_words >= 10 ? '✅' : '⭕'}
            </span>
            <div className="flex-1">
              <p className="font-medium">Vocabulary Explorer</p>
              <p className="text-sm text-gray-600">Learn 10 unique words ({stats.unique_words}/10)</p>
            </div>
          </div>
          
          <div className={`flex items-center p-4 rounded-lg ${
            stats.total_lookups >= 25 ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <span className="text-2xl mr-3">
              {stats.total_lookups >= 25 ? '✅' : '⭕'}
            </span>
            <div className="flex-1">
              <p className="font-medium">Word Detective</p>
              <p className="text-sm text-gray-600">Perform 25 lookups ({stats.total_lookups}/25)</p>
            </div>
          </div>
          
          <div className={`flex items-center p-4 rounded-lg ${
            stats.books_read >= 3 ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <span className="text-2xl mr-3">
              {stats.books_read >= 3 ? '✅' : '⭕'}
            </span>
            <div className="flex-1">
              <p className="font-medium">Literary Scholar</p>
              <p className="text-sm text-gray-600">Read from 3 books ({stats.books_read}/3)</p>
            </div>
          </div>
          
          <div className={`flex items-center p-4 rounded-lg ${
            weeklyTotal >= 10 ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <span className="text-2xl mr-3">
              {weeklyTotal >= 10 ? '✅' : '⭕'}
            </span>
            <div className="flex-1">
              <p className="font-medium">Weekly Warrior</p>
              <p className="text-sm text-gray-600">10 lookups this week ({weeklyTotal}/10)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyStats;