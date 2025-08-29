// -----storytime feature additions-----
import React from 'react';

interface StoryProgressProps {
  userId: string;
  storyId: string;
  skillsProgress: {
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  };
  overallCompletion: number;
  sessionsCount: number;
  estimatedTimeRemaining?: number; // minutes
}

const StoryProgress: React.FC<StoryProgressProps> = ({
  userId,
  storyId,
  skillsProgress,
  overallCompletion,
  sessionsCount,
  estimatedTimeRemaining
}) => {
  // Get color based on progress percentage
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  // Get skill icon
  const getSkillIcon = (skill: string) => {
    const icons: { [key: string]: string } = {
      reading: '📖',
      listening: '🎧',
      speaking: '🗣️',
      writing: '✍️'
    };
    return icons[skill] || '📚';
  };

  // Calculate average progress
  const averageProgress = Math.round(
    (skillsProgress.reading + skillsProgress.listening + 
     skillsProgress.speaking + skillsProgress.writing) / 4
  );

  return (
    <div className="story-progress bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>

      {/* Overall Progress Ring */}
      <div className="overall-progress flex items-center justify-center mb-8">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#3b82f6"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallCompletion / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold">{overallCompletion}%</span>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Progress Grid */}
      <div className="skills-grid grid grid-cols-2 gap-4 mb-6">
        {Object.entries(skillsProgress).map(([skill, progress]) => (
          <div key={skill} className="skill-card bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSkillIcon(skill)}</span>
                <span className="font-semibold capitalize">{skill}</span>
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="progress-bar bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(progress)} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="statistics grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{sessionsCount}</p>
          <p className="text-sm text-gray-600">Sessions</p>
        </div>
        <div className="stat-card text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{averageProgress}%</p>
          <p className="text-sm text-gray-600">Avg Progress</p>
        </div>
        <div className="stat-card text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {estimatedTimeRemaining || '—'}
          </p>
          <p className="text-sm text-gray-600">Min Remaining</p>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="achievements">
        <h3 className="font-semibold mb-3">Achievements</h3>
        <div className="badges flex gap-2 flex-wrap">
          {overallCompletion >= 25 && (
            <span className="badge bg-bronze-100 text-bronze-800 px-3 py-1 rounded-full text-sm font-medium">
              🥉 25% Complete
            </span>
          )}
          {overallCompletion >= 50 && (
            <span className="badge bg-silver-100 text-silver-800 px-3 py-1 rounded-full text-sm font-medium">
              🥈 Halfway There
            </span>
          )}
          {overallCompletion >= 75 && (
            <span className="badge bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-medium">
              🥇 Almost Done!
            </span>
          )}
          {overallCompletion === 100 && (
            <span className="badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              🏆 Story Master
            </span>
          )}
          {skillsProgress.reading >= 100 && (
            <span className="badge bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              📖 Reading Expert
            </span>
          )}
          {skillsProgress.listening >= 100 && (
            <span className="badge bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              🎧 Listening Pro
            </span>
          )}
          {skillsProgress.speaking >= 100 && (
            <span className="badge bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              🗣️ Speaking Star
            </span>
          )}
          {skillsProgress.writing >= 100 && (
            <span className="badge bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
              ✍️ Writing Wizard
            </span>
          )}
        </div>
      </div>

      {/* Next Steps Recommendations */}
      <div className="next-steps mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Recommended Next Steps</h3>
        <ul className="text-sm space-y-1">
          {skillsProgress.reading < 100 && (
            <li>📖 Continue reading to improve comprehension</li>
          )}
          {skillsProgress.listening < 100 && (
            <li>🎧 Listen to the audio version for pronunciation practice</li>
          )}
          {skillsProgress.speaking < 100 && (
            <li>🗣️ Record yourself retelling the story</li>
          )}
          {skillsProgress.writing < 100 && (
            <li>✍️ Write a summary or creative response</li>
          )}
          {overallCompletion === 100 && (
            <li>🎉 Great job! Try a more challenging story next</li>
          )}
        </ul>
      </div>

      <style jsx>{`
        .bg-bronze-100 { background-color: #f7e5d3; }
        .text-bronze-800 { color: #8b4513; }
        .bg-silver-100 { background-color: #f0f0f0; }
        .text-silver-800 { color: #708090; }
        .bg-gold-100 { background-color: #fff8dc; }
        .text-gold-800 { color: #daa520; }
      `}</style>
    </div>
  );
};

export default StoryProgress;