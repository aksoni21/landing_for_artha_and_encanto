import React from 'react';
import { motion } from 'framer-motion';
import { Target, MessageSquare, BookOpen, Clock } from 'lucide-react';

interface PriorityItem {
  id: string;
  icon: 'speaking' | 'grammar' | 'vocabulary' | 'fluency';
  title: string;
  description: string;
  examples?: string[];
}

interface TeachingPrioritiesProps {
  priorities: PriorityItem[];
  primaryColor?: string;
}

const TeachingPriorities: React.FC<TeachingPrioritiesProps> = ({
  priorities,
  primaryColor = '#1a365d'
}) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'speaking':
        return <MessageSquare size={24} />;
      case 'grammar':
        return <BookOpen size={24} />;
      case 'vocabulary':
        return <BookOpen size={24} />;
      case 'fluency':
        return <Clock size={24} />;
      default:
        return <Target size={24} />;
    }
  };

  const getIconColor = (index: number) => {
    const colors = ['#ef4444', '#f59e0b', '#10b981']; // red, amber, green
    return colors[index] || primaryColor;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Target size={24} style={{ color: primaryColor }} />
        <h2 className="text-2xl font-bold text-gray-800">
          Focus on These 3 Things This Week
        </h2>
      </div>

      <div className="space-y-4">
        {priorities.slice(0, 3).map((priority, index) => (
          <motion.div
            key={priority.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg border-l-4 bg-gray-50"
            style={{ borderLeftColor: getIconColor(index) }}
          >
            <div
              className="p-2 rounded-full text-white flex-shrink-0"
              style={{ backgroundColor: getIconColor(index) }}
            >
              {getIcon(priority.icon)}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className="font-bold text-lg"
                  style={{ color: getIconColor(index) }}
                >
                  {index + 1}.
                </span>
                <h3 className="font-semibold text-gray-800">
                  {priority.title}
                </h3>
              </div>

              <p className="text-gray-700 mb-2">
                {priority.description}
              </p>

              {priority.examples && priority.examples.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600 space-y-1">
                    {priority.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-gray-400">•</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {example}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          💡 <strong>Teaching Tip:</strong> Focus on one priority at a time during lessons.
          Students learn better with concentrated practice than trying to fix everything at once.
        </p>
      </div> */}
    </motion.div>
  );
};

export default TeachingPriorities;