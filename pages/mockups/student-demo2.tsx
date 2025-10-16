import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function StudentDemo2() {
  const [activeTab, setActiveTab] = useState<'stories' | 'speaking' | 'vocabulary' | 'progress'>('stories');
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [lastViewedStory, setLastViewedStory] = useState<number>(1); // Default to first story
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Simulate recording
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingProgress(0);
    const interval = setInterval(() => {
      setRecordingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          setTimeout(() => setShowFeedback(true), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const stories = [
    {
      id: 1,
      title: 'A Day at the Market',
      level: 'Beginner',
      duration: '5 min',
      progress: 100,
      emoji: '🛒',
      color: 'from-blue-500 to-cyan-500',
      firstSentenceEnglish: 'Today I went to the local market to buy fresh vegetables for dinner.',
      firstSentenceSpanish: 'Hoy fui al mercado local para comprar verduras frescas para la cena.',
    },
    {
      id: 2,
      title: 'Making New Friends',
      level: 'Beginner',
      duration: '7 min',
      progress: 65,
      emoji: '🤝',
      color: 'from-purple-500 to-pink-500',
      firstSentenceEnglish: 'I met a new friend at school today and we had a great conversation.',
      firstSentenceSpanish: 'Conocí a un nuevo amigo en la escuela hoy y tuvimos una gran conversación.',
    },
    {
      id: 3,
      title: 'The Lost Puppy',
      level: 'Intermediate',
      duration: '10 min',
      progress: 0,
      emoji: '🐕',
      color: 'from-amber-500 to-orange-500',
      firstSentenceEnglish: 'Yesterday I found a small puppy wandering alone in the park.',
      firstSentenceSpanish: 'Ayer encontré un cachorro pequeño vagando solo en el parque.',
    },
  ];

  const vocabularyWords = [
    { word: 'mercado', translation: 'market', mastery: 90, emoji: '🏪' },
    { word: 'amigo', translation: 'friend', mastery: 85, emoji: '👋' },
    { word: 'perro', translation: 'dog', mastery: 75, emoji: '🐕' },
    { word: 'casa', translation: 'house', mastery: 95, emoji: '🏠' },
    { word: 'comida', translation: 'food', mastery: 80, emoji: '🍽️' },
  ];

  return (
    <div className="min-h-screen bg-white md:bg-gradient-to-br md:from-gray-800 md:via-gray-900 md:to-black md:py-12 md:px-4">
      {/* Back to Home Link - Outside Phone (Desktop Only) */}
      <div className="hidden md:block max-w-md mx-auto mb-6">
        <Link href="/" className="text-white hover:text-purple-400 font-medium flex items-center gap-2 transition-colors">
          ← Back to Home
        </Link>
        <h1 className="text-white text-2xl font-bold mt-2">Encanto AI Student Experience</h1>
        <p className="text-gray-400 text-sm">Interactive mobile app demo</p>
      </div>

      {/* Phone Mockup - Desktop, Direct Content - Mobile */}
      <div className="w-full md:max-w-md md:mx-auto">
        {/* Phone Frame - Desktop Only */}
        <div className="relative md:bg-gray-900 md:rounded-[3rem] md:shadow-2xl md:p-3 md:border-8 md:border-gray-800">
          {/* Phone Notch - Desktop Only */}
          <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-50"></div>

          {/* Phone Screen / Content Area */}
          <div className="bg-white md:rounded-[2.5rem] overflow-hidden relative flex flex-col h-screen md:h-[min(90vh,900px)]">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {/* Header */}
              <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="px-4 md:px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        E
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Encanto AI</h2>
                        <p className="text-xs text-gray-600">Student Experience</p>
                      </div>
                    </div>
                    {/* Mobile Back Link */}
                    <Link href="/" className="md:hidden text-purple-600 hover:text-purple-700 font-medium text-sm">
                      ← Home
                    </Link>
                  </div>
                </div>
              </header>

              <div className="px-4 md:px-6 py-6 md:py-8 pb-20 md:pb-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                {/* Student Profile Card */}
                <motion.div
                  className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 mb-4 md:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                      M
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">Maria Rodriguez</h3>
                      <p className="text-xs md:text-sm text-gray-600">Learning Spanish · Level 2</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl p-2 md:p-3 text-center border border-blue-200">
                      <div className="text-xl md:text-2xl font-bold text-blue-600">24</div>
                      <div className="text-xs text-gray-600">Stories</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-xl p-2 md:p-3 text-center border border-purple-200">
                      <div className="text-xl md:text-2xl font-bold text-purple-600">127</div>
                      <div className="text-xs text-gray-600">Words</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl p-2 md:p-3 text-center border border-amber-200">
                      <div className="text-xl md:text-2xl font-bold text-amber-600">15</div>
                      <div className="text-xs text-gray-600">Days</div>
                    </div>
                  </div>
                </motion.div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-1.5 md:p-2 mb-4 md:mb-6 flex gap-1 md:gap-2">
                  {(['stories', 'speaking', 'vocabulary', 'progress'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setSelectedStory(null);
                        setShowFeedback(false);
                      }}
                      className={`flex-1 py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {tab === 'stories' && '📚'}
                      {tab === 'speaking' && '🎤'}
                      {tab === 'vocabulary' && '📖'}
                      {tab === 'progress' && '📊'}
                      <div className="text-xs mt-1 capitalize hidden sm:block">{tab}</div>
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                  {/* Stories Tab */}
                  {activeTab === 'stories' && !selectedStory && (
                    <motion.div
                      key="stories"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Your Stories</h3>
                      {stories.map((story, index) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          onClick={() => {
                            setSelectedStory(story.id);
                            setLastViewedStory(story.id);
                          }}
                          className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-300"
                        >
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${story.color} rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0`}>
                              {story.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">{story.title}</h4>
                              <div className="flex gap-2 mb-3">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  {story.level}
                                </span>
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                  {story.duration}
                                </span>
                              </div>
                              {story.progress > 0 && (
                                <div>
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{story.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`bg-gradient-to-r ${story.color} h-2 rounded-full transition-all`}
                                      style={{ width: `${story.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Story Detail View */}
                  {activeTab === 'stories' && selectedStory && (
                    <motion.div
                      key="story-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <button
                        onClick={() => setSelectedStory(null)}
                        className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 mb-4"
                      >
                        ← Back to Stories
                      </button>
                      {(() => {
                        const story = stories.find((s) => s.id === selectedStory);
                        if (!story) return null;
                        return (
                          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8">
                            <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${story.color} rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl md:text-5xl mx-auto mb-4 md:mb-6`}>
                              {story.emoji}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">{story.title}</h3>

                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                              <p className="text-gray-800 leading-relaxed mb-4">
                                <span className="font-semibold text-purple-600">English:</span> Today I went to the local market to buy fresh vegetables for dinner. The market was very busy with many people shopping.
                              </p>
                              <p className="text-gray-800 leading-relaxed">
                                <span className="font-semibold text-pink-600">Spanish:</span> Hoy fui al mercado local para comprar verduras frescas para la cena. El mercado estaba muy ocupado con muchas personas comprando.
                              </p>
                            </div>

                            <div className="space-y-3">
                              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                                🔊 Listen to Story
                              </button>
                              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg">
                                🎤 Practice Speaking
                              </button>
                              <button className="w-full border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all">
                                📖 Learn Vocabulary
                              </button>
                            </div>

                            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">⭐</span>
                                <span className="font-bold text-amber-800">Key Vocabulary</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white rounded-lg p-2 text-sm">
                                  <div className="font-semibold text-gray-900">mercado</div>
                                  <div className="text-gray-600 text-xs">market</div>
                                </div>
                                <div className="bg-white rounded-lg p-2 text-sm">
                                  <div className="font-semibold text-gray-900">verduras</div>
                                  <div className="text-gray-600 text-xs">vegetables</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* Speaking Tab */}
                  {activeTab === 'speaking' && (() => {
                    const practiceStory = stories.find((s) => s.id === lastViewedStory) || stories[0];
                    return (
                      <motion.div
                        key="speaking"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Speaking Practice</h3>

                        {!showFeedback ? (
                          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8">
                            <div className="text-center mb-6">
                              <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center relative">
                                {isRecording ? (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="text-5xl md:text-6xl"
                                  >
                                    🎤
                                  </motion.div>
                                ) : (
                                  <div className="text-5xl md:text-6xl">🎤</div>
                                )}
                              </div>

                              <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Practice This Phrase</h4>
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-200">
                                <p className="text-base md:text-lg font-semibold text-purple-800 mb-2">
                                  &quot;{practiceStory.firstSentenceEnglish}&quot;
                                </p>
                                <p className="text-sm text-gray-600">
                                  {practiceStory.firstSentenceSpanish}
                                </p>
                              </div>

                            {isRecording ? (
                              <div className="mb-6">
                                <div className="text-lg font-semibold text-purple-600 mb-2">Recording...</div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                                    style={{ width: `${recordingProgress}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={handleStartRecording}
                                disabled={recordingProgress === 100}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                              >
                                {recordingProgress === 100 ? 'Processing...' : '🎤 Start Recording'}
                              </button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">💡</span>
                                <span className="text-sm font-medium text-blue-900">
                                  Tip: Speak clearly and at a natural pace
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-3xl shadow-xl p-8"
                        >
                          <div className="text-center mb-6">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-5xl">
                              ✓
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Great Job!</h4>
                            <p className="text-gray-600">Here&apos;s your AI feedback</p>
                          </div>

                          <div className="space-y-4 mb-6">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-green-900">Pronunciation</span>
                                <span className="text-2xl font-bold text-green-600">92%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
                              </div>
                              <p className="text-xs text-green-800 mt-2">Excellent pronunciation of &quot;llamo&quot;!</p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-blue-900">Fluency</span>
                                <span className="text-2xl font-bold text-blue-600">88%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '88%' }} />
                              </div>
                              <p className="text-xs text-blue-800 mt-2">Good pace, slight pause detected</p>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-purple-900">Confidence</span>
                                <span className="text-2xl font-bold text-purple-600">95%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '95%' }} />
                              </div>
                              <p className="text-xs text-purple-800 mt-2">Very confident delivery!</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                setShowFeedback(false);
                                setRecordingProgress(0);
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                            >
                              🎤 Try Again
                            </button>
                            <button className="w-full border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all">
                              Next Phrase →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                    );
                  })()}

                  {/* Vocabulary Tab */}
                  {activeTab === 'vocabulary' && (
                    <motion.div
                      key="vocabulary"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Your Vocabulary</h3>

                      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-200">
                            <div className="text-3xl font-bold text-purple-600">127</div>
                            <div className="text-sm text-gray-600">Words Learned</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-200">
                            <div className="text-3xl font-bold text-blue-600">87%</div>
                            <div className="text-sm text-gray-600">Avg Mastery</div>
                          </div>
                        </div>
                      </div>

                      {vocabularyWords.map((word, index) => (
                        <motion.div
                          key={word.word}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all"
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="text-4xl">{word.emoji}</div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-xl font-bold text-gray-900">{word.translation}</h4>
                                <span className="text-lg font-semibold text-purple-600">{word.mastery}%</span>
                              </div>
                              <p className="text-gray-600">{word.word}</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                              style={{ width: `${word.mastery}%` }}
                            />
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 bg-purple-50 text-purple-700 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-all">
                              🔊 Listen
                            </button>
                            <button className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all">
                              🎤 Practice
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Progress Tab */}
                  {activeTab === 'progress' && (
                    <motion.div
                      key="progress"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Your Progress</h3>

                      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">This Week</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                            <div className="text-3xl font-bold text-blue-600">5</div>
                            <div className="text-sm text-gray-600">Stories Read</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                            <div className="text-3xl font-bold text-purple-600">42</div>
                            <div className="text-sm text-gray-600">Words Learned</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="text-3xl font-bold text-green-600">18</div>
                            <div className="text-sm text-gray-600">Speaking Sessions</div>
                          </div>
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                            <div className="text-3xl font-bold text-amber-600">2.5h</div>
                            <div className="text-sm text-gray-600">Practice Time</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Daily Streak</h4>
                        <div className="flex justify-center gap-2 mb-4">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                            <div
                              key={index}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                                index < 5
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600 mb-1">5</div>
                          <div className="text-sm text-gray-600">Day Streak! 🔥</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Achievement Badges</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🏆</div>
                            <div className="text-xs font-semibold text-gray-900">First Story</div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl mb-2">⭐</div>
                            <div className="text-xs font-semibold text-gray-900">5 Day Streak</div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎤</div>
                            <div className="text-xs font-semibold text-gray-900">Speaking Pro</div>
                          </div>
                          <div className="text-center opacity-50">
                            <div className="text-4xl mb-2">🌟</div>
                            <div className="text-xs font-semibold text-gray-400">10 Day Streak</div>
                          </div>
                          <div className="text-center opacity-50">
                            <div className="text-4xl mb-2">📚</div>
                            <div className="text-xs font-semibold text-gray-400">50 Stories</div>
                          </div>
                          <div className="text-center opacity-50">
                            <div className="text-4xl mb-2">💎</div>
                            <div className="text-xs font-semibold text-gray-400">Master</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Navigation - Fixed on mobile, absolute in phone frame on desktop */}
            <div className="fixed md:absolute bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-full bg-white/95 md:bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50">
              <div className="px-4 md:px-6 py-2.5 md:py-3 pb-safe">
                <div className="flex justify-around items-center max-w-md mx-auto md:max-w-none">
                  <button
                    onClick={() => {
                      setActiveTab('stories');
                      setSelectedStory(null);
                      setShowFeedback(false);
                    }}
                    className={`flex flex-col items-center gap-0.5 md:gap-1 ${activeTab === 'stories' ? 'text-purple-600' : 'text-gray-400'}`}
                  >
                    <span className="text-xl md:text-2xl">📚</span>
                    <span className="text-[10px] md:text-xs font-semibold">Stories</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('speaking');
                      setSelectedStory(null);
                      setShowFeedback(false);
                    }}
                    className={`flex flex-col items-center gap-0.5 md:gap-1 ${activeTab === 'speaking' ? 'text-purple-600' : 'text-gray-400'}`}
                  >
                    <span className="text-xl md:text-2xl">🎤</span>
                    <span className="text-[10px] md:text-xs font-semibold">Practice</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('vocabulary');
                      setSelectedStory(null);
                      setShowFeedback(false);
                    }}
                    className={`flex flex-col items-center gap-0.5 md:gap-1 ${activeTab === 'vocabulary' ? 'text-purple-600' : 'text-gray-400'}`}
                  >
                    <span className="text-xl md:text-2xl">📝</span>
                    <span className="text-[10px] md:text-xs font-semibold">Test Prep</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('progress');
                      setSelectedStory(null);
                      setShowFeedback(false);
                    }}
                    className={`flex flex-col items-center gap-0.5 md:gap-1 ${activeTab === 'progress' ? 'text-purple-600' : 'text-gray-400'}`}
                  >
                    <span className="text-xl md:text-2xl">⚙️</span>
                    <span className="text-[10px] md:text-xs font-semibold">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
