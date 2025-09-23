import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, Star, AlertTriangle, BookOpen } from 'lucide-react';

interface AudioHighlight {
  timestamp: number;
  type: 'strength' | 'improvement' | 'example';
  description: string;
  text: string;
  category?: string;
}

interface AudioHighlightsProps {
  highlights: AudioHighlight[];
  audioUrl: string;
  primaryColor?: string;
  onTimestampClick?: (timestamp: number) => void;
}

const AudioHighlights: React.FC<AudioHighlightsProps> = ({
  highlights,
  primaryColor = '#1a365d',
  onTimestampClick
}) => {
  const [playingTimestamp, setPlayingTimestamp] = useState<number | null>(null);

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <Star size={18} className="text-green-600" />;
      case 'improvement':
        return <AlertTriangle size={18} className="text-orange-600" />;
      case 'example':
        return <BookOpen size={18} className="text-blue-600" />;
      default:
        return <Volume2 size={18} className="text-gray-600" />;
    }
  };

  const getHighlightStyle = (type: string) => {
    switch (type) {
      case 'strength':
        return 'border-green-200 bg-green-50';
      case 'improvement':
        return 'border-orange-200 bg-orange-50';
      case 'example':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getHighlightBadge = (type: string) => {
    switch (type) {
      case 'strength':
        return { text: 'Strength', style: 'bg-green-100 text-green-800' };
      case 'improvement':
        return { text: 'Practice', style: 'bg-orange-100 text-orange-800' };
      case 'example':
        return { text: 'Example', style: 'bg-blue-100 text-blue-800' };
      default:
        return { text: 'Note', style: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleTimestampClick = (timestamp: number) => {
    setPlayingTimestamp(timestamp);
    if (onTimestampClick) {
      onTimestampClick(timestamp);
    }
  };

  const groupedHighlights = highlights.reduce((groups, highlight) => {
    const type = highlight.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(highlight);
    return groups;
  }, {} as Record<string, AudioHighlight[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Volume2 size={24} style={{ color: primaryColor }} />
        <h2 className="text-xl font-bold text-gray-800">Audio Highlights</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {highlights.length} moments
        </span>
      </div>

      {highlights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Volume2 size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No specific audio highlights available for this assessment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Show all highlights in chronological order */}
          {highlights
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((highlight, index) => {
              const badge = getHighlightBadge(highlight.type);

              return (
                <motion.div
                  key={`${highlight.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${getHighlightStyle(highlight.type)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getHighlightIcon(highlight.type)}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.style}`}>
                        {badge.text}
                      </span>
                      {highlight.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {highlight.category}
                        </span>
                      )}
                    </div>

                    {/* <button
                      onClick={() => handleTimestampClick(highlight.timestamp)}
                      className="flex items-center space-x-2 bg-white border border-gray-300 hover:border-gray-400 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                    >
                      {playingTimestamp === highlight.timestamp ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                      <span>{formatTimestamp(highlight.timestamp)}</span>
                    </button> */}
                  </div>

                  <p className="text-gray-800 mb-2 font-medium">
                    {highlight.description}
                  </p>

                  {highlight.text && (
                    <div className="bg-white/70 p-3 rounded border italic text-gray-700">
                      &quot;{highlight.text}&quot;
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>
      )}

      {/* Summary by type */}
      {Object.keys(groupedHighlights).length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Summary</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(groupedHighlights).map(([type, items]) => {
              const badge = getHighlightBadge(type);
              return (
                <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${badge.style.includes('green') ? 'text-green-600' :
                    badge.style.includes('orange') ? 'text-orange-600' : 'text-blue-600'}`}>
                    {items.length}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {type === 'improvement' ? 'Areas to Practice' : `${type}s`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          🎧 <strong>How to use:</strong> Click on any timestamp to jump to that moment in the audio.
          Use these examples to give specific feedback and demonstrate points during lessons.
        </p>
      </div>
    </motion.div>
  );
};

export default AudioHighlights;