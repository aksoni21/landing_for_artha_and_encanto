import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AIStoryGenerator from './AIStoryGenerator';
import StoryUploader from './StoryUploader';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  progress: number;
  avgScore: number;
  toefl: number;
  weeklyMinutes: number;
  lastActivity: string;
  storiesCompleted: number;
  strugglingWith: string;
  strength: string;
}

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export default function CreateAssignmentModal({ isOpen, onClose, students }: CreateAssignmentModalProps) {
  const [step, setStep] = useState<'select-method' | 'ai-generate' | 'upload' | 'vowel-lesson' | 'grammar-assignment' | 'assign'>('select-method');
  const [generatedStory, setGeneratedStory] = useState<{ title: string; content: string; author: string } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [assignmentType, setAssignmentType] = useState<'story' | 'vowel' | 'grammar'>('story');
  const [recommendedVowel, setRecommendedVowel] = useState<string>('');
  const [recommendedGrammar, setRecommendedGrammar] = useState<string>('');

  // Set default due date to one week from today
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [assignmentDetails, setAssignmentDetails] = useState({
    dueDate: getDefaultDueDate(),
    instructions: '',
    difficulty: 3
  });

  // Analyze students on mount to determine recommended lessons
  useEffect(() => {
    if (!isOpen) return;

    // Analyze student struggles to recommend vowel lesson
    const vowelStrugglers = students.filter(s => {
      const struggles = s.strugglingWith.toLowerCase();
      return struggles.includes('pronunciation') ||
             struggles.includes('speaking') ||
             struggles.includes('phonics') ||
             struggles.includes('vowel');
    });

    if (vowelStrugglers.length > 0) {
      // Recommend Short A as it's most common
      setRecommendedVowel('Short A (cat, hat)');
    }

    // Analyze student struggles to recommend grammar topic
    const grammarCounts: { [key: string]: number } = {};
    students.forEach(s => {
      const struggles = s.strugglingWith.toLowerCase();
      if (struggles.includes('past') || struggles.includes('tense')) {
        grammarCounts['Past Simple Tense'] = (grammarCounts['Past Simple Tense'] || 0) + 1;
      }
      if (struggles.includes('verb')) {
        grammarCounts['Modal Verbs'] = (grammarCounts['Modal Verbs'] || 0) + 1;
      }
      if (struggles.includes('grammar')) {
        grammarCounts['Present Simple Tense'] = (grammarCounts['Present Simple Tense'] || 0) + 1;
      }
    });

    // Find the grammar topic with most struggling students
    const topGrammar = Object.entries(grammarCounts).sort((a, b) => b[1] - a[1])[0];
    if (topGrammar) {
      setRecommendedGrammar(topGrammar[0]);
    }
  }, [isOpen, students]);

  // Auto-select students who struggle with the story's topic
  const autoSelectStudents = (story: { title: string; content: string; author: string }) => {
    // Extract key topics from the story title and content
    const storyText = (story.title + ' ' + story.content).toLowerCase();

    // Find students who struggle with topics related to the story
    const strugglingStudents = students.filter(student => {
      const struggles = student.strugglingWith.toLowerCase();

      // Check for vowel-related struggles
      if (storyText.includes('vowel') || storyText.includes('pronunciation')) {
        if (struggles.includes('pronunciation') || struggles.includes('speaking') ||
            struggles.includes('phonics') || struggles.includes('vowel')) return true;
      }

      // Check for specific vowel sounds
      if (storyText.includes('short a') && struggles.includes('vowel')) return true;
      if (storyText.includes('short e') && struggles.includes('vowel')) return true;
      if (storyText.includes('short i') && struggles.includes('vowel')) return true;
      if (storyText.includes('short o') && struggles.includes('vowel')) return true;
      if (storyText.includes('short u') && struggles.includes('vowel')) return true;
      if (storyText.includes('long') && struggles.includes('vowel')) return true;

      // Check for grammar-related struggles
      if (storyText.includes('grammar practice') || storyText.includes('grammar exercises')) {
        if (struggles.includes('grammar') || struggles.includes('tense') ||
            struggles.includes('verb') || struggles.includes('sentence')) return true;
      }

      // Check for specific grammar topics
      if (storyText.includes('present simple') && (struggles.includes('tense') || struggles.includes('verb'))) return true;
      if (storyText.includes('past simple') && struggles.includes('past')) return true;
      if (storyText.includes('present continuous') && struggles.includes('tense')) return true;
      if (storyText.includes('modal verbs') && struggles.includes('verb')) return true;
      if (storyText.includes('articles') && (struggles.includes('grammar') || struggles.includes('article'))) return true;
      if (storyText.includes('prepositions') && (struggles.includes('grammar') || struggles.includes('preposition'))) return true;
      if (storyText.includes('comparative') && struggles.includes('grammar')) return true;
      if (storyText.includes('subject-verb agreement') && struggles.includes('verb')) return true;

      // Check for common story grammar topics
      if (storyText.includes('past') && struggles.includes('past')) return true;
      if (storyText.includes('tense') && struggles.includes('tense')) return true;
      if (storyText.includes('verb') && struggles.includes('verb')) return true;
      if (storyText.includes('grammar') && struggles.includes('grammar')) return true;

      // Auto-select at-risk students with low progress
      if (student.status === 'At Risk' || student.progress < 50) return true;

      // Auto-select students with low weekly minutes (need more practice)
      if (student.weeklyMinutes < 30) return true;

      return false;
    }).map(s => s.id);

    // Limit to maximum 4 students to avoid overwhelming
    setSelectedStudents(strugglingStudents.slice(0, 4));
  };

  const handleStoryCreated = (story: { title: string; content: string; author: string }) => {
    setGeneratedStory(story);
    autoSelectStudents(story);
    setStep('assign');
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignStory = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    if (!assignmentDetails.dueDate) {
      toast.error('Please set a due date');
      return;
    }

    const studentNames = students
      .filter(s => selectedStudents.includes(s.id))
      .map(s => s.name)
      .join(', ');

    toast.success(`Story "${generatedStory?.title}" assigned to ${studentNames}!`);
    handleClose();
  };

  const handleClose = () => {
    setStep('select-method');
    setGeneratedStory(null);
    setSelectedStudents([]);
    setAssignmentDetails({ dueDate: getDefaultDueDate(), instructions: '', difficulty: 3 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-white">Create New Assignment</h2>
              <p className="text-purple-100 text-sm">
                {step === 'select-method' && 'Choose how to create your story'}
                {step === 'ai-generate' && 'Generate story with AI'}
                {step === 'upload' && 'Upload existing story'}
                {step === 'assign' && 'Assign to students'}
              </p>
            </div>
            <button onClick={handleClose} className="text-white text-2xl hover:text-gray-200">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`flex items-center gap-2 ${step === 'select-method' ? 'text-purple-600' : step === 'assign' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 'select-method' ? 'bg-purple-100' : step === 'assign' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Choose Method</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center gap-2 ${(step === 'ai-generate' || step === 'upload') ? 'text-purple-600' : step === 'assign' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${(step === 'ai-generate' || step === 'upload') ? 'bg-purple-100' : step === 'assign' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Create Story</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center gap-2 ${step === 'assign' ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 'assign' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Assign</span>
                </div>
              </div>
            </div>

            {/* Select Method Step */}
            {step === 'select-method' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <button
                  onClick={() => {
                    setAssignmentType('story');
                    setStep('ai-generate');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">✨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Story with AI</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Create a custom story using AI based on your requirements, difficulty level, and focus areas.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Fast</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Customizable</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Adaptive</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAssignmentType('story');
                    setStep('upload');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Existing Story</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload a story from your library or paste text from an external source.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Quick</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Flexible</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Reusable</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAssignmentType('vowel');
                    setStep('vowel-lesson');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗣️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create Vowel Lesson</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Design a focused vowel pronunciation lesson with targeted exercises and practice activities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Pronunciation</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Speaking</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Phonics</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAssignmentType('grammar');
                    setStep('grammar-assignment');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create Grammar Assignment</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Build a comprehensive grammar assignment with rules, examples, and practice exercises.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Grammar</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Structure</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Writing</span>
                  </div>
                </button>
              </motion.div>
            )}

            {/* AI Generate Step */}
            {step === 'ai-generate' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AIStoryGenerator
                  onStoryGenerated={handleStoryCreated}
                  onCancel={() => setStep('select-method')}
                />
              </motion.div>
            )}

            {/* Upload Step */}
            {step === 'upload' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StoryUploader
                  onStoryUploaded={handleStoryCreated}
                  onCancel={() => setStep('select-method')}
                />
              </motion.div>
            )}

            {/* Vowel Lesson Step */}
            {step === 'vowel-lesson' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-xl">🗣️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Vowel Pronunciation Lesson</p>
                    <p className="text-xs text-green-700">Create a focused lesson on vowel sounds and pronunciation</p>
                  </div>
                </div>

                {recommendedVowel && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900 mb-1">AI Recommendation</p>
                        <p className="text-sm text-blue-800">
                          Based on student needs, we recommend <strong>{recommendedVowel}</strong> lesson.
                          Several students are struggling with pronunciation and vowel sounds.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Vowel Sound</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Short A (cat, hat)', 'Short E (bed, red)', 'Short I (sit, big)', 'Short O (hot, dog)', 'Short U (cup, fun)', 'Long A (cake, rain)', 'Long E (bee, see)', 'Long I (ice, time)', 'Long O (boat, go)', 'Long U (cute, use)'].map((vowel) => {
                      const isRecommended = vowel === recommendedVowel;
                      return (
                        <button
                          key={vowel}
                          onClick={() => {
                            const lessonContent = {
                              title: `Vowel Lesson: ${vowel.split(' ')[0]} ${vowel.split(' ')[1]}`,
                              content: `Practice the ${vowel} sound with these words and activities:\n\nWords to practice:\n• ${vowel.match(/\(([^)]+)\)/)?.[1]}\n\nActivities:\n1. Listen and repeat\n2. Identify the sound in sentences\n3. Practice with minimal pairs\n4. Record yourself practicing`,
                              author: 'Teacher Created'
                            };
                            handleStoryCreated(lessonContent);
                          }}
                          className={`p-4 bg-white border-2 rounded-lg hover:shadow-md transition-all text-left relative ${
                            isRecommended
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-green-500'
                          }`}
                        >
                          {isRecommended && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              Recommended
                            </div>
                          )}
                          <div className="font-semibold text-gray-900 text-sm">{vowel.split(' (')[0]}</div>
                          <div className="text-xs text-gray-600 mt-1">{vowel.match(/\(([^)]+)\)/)?.[1]}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setStep('select-method')}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Grammar Assignment Step */}
            {step === 'grammar-assignment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">Grammar Assignment</p>
                    <p className="text-xs text-orange-700">Create a comprehensive grammar practice assignment</p>
                  </div>
                </div>

                {recommendedGrammar && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900 mb-1">AI Recommendation</p>
                        <p className="text-sm text-blue-800">
                          Based on student needs, we recommend <strong>{recommendedGrammar}</strong> assignment.
                          Multiple students are struggling with this grammar concept.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Grammar Topic</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { topic: 'Present Simple Tense', desc: 'Daily routines and habits' },
                      { topic: 'Past Simple Tense', desc: 'Completed actions in the past' },
                      { topic: 'Present Continuous', desc: 'Actions happening now' },
                      { topic: 'Modal Verbs', desc: 'Can, could, should, must' },
                      { topic: 'Articles (a, an, the)', desc: 'Definite and indefinite articles' },
                      { topic: 'Prepositions', desc: 'In, on, at, by, with' },
                      { topic: 'Comparative & Superlative', desc: 'Comparing things' },
                      { topic: 'Subject-Verb Agreement', desc: 'Singular and plural forms' },
                    ].map((item) => {
                      const isRecommended = item.topic === recommendedGrammar;
                      return (
                        <button
                          key={item.topic}
                          onClick={() => {
                            const grammarContent = {
                              title: `Grammar Practice: ${item.topic}`,
                              content: `Complete grammar exercises on ${item.topic}\n\n${item.desc}\n\nExercises:\n1. Fill in the blanks (10 questions)\n2. Error correction (5 sentences)\n3. Create your own sentences (5 examples)\n4. Writing practice using the grammar rule`,
                              author: 'Teacher Created'
                            };
                            handleStoryCreated(grammarContent);
                          }}
                          className={`p-4 bg-white border-2 rounded-lg hover:shadow-md transition-all text-left relative ${
                            isRecommended
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-orange-500'
                          }`}
                        >
                          {isRecommended && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              Recommended
                            </div>
                          )}
                          <div className="font-semibold text-gray-900 text-sm">{item.topic}</div>
                          <div className="text-xs text-gray-600 mt-1">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setStep('select-method')}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Assign Step */}
            {step === 'assign' && generatedStory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Story Preview */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{generatedStory.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">by {generatedStory.author}</p>
                  <div className="bg-white rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedStory.content.substring(0, 300)}...</p>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={assignmentDetails.dueDate}
                      onChange={(e) => setAssignmentDetails({ ...assignmentDetails, dueDate: e.target.value })}
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions for Students (Optional)
                    </label>
                    <textarea
                      value={assignmentDetails.instructions}
                      onChange={(e) => setAssignmentDetails({ ...assignmentDetails, instructions: e.target.value })}
                      placeholder="E.g., Focus on past tense usage while reading..."
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Students <span className="text-red-500">*</span>
                  </label>
                  {selectedStudents.length > 0 && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>{selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''}</strong> auto-selected based on learning needs and progress
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                    {students.map((student) => {
                      const isAutoSelected = selectedStudents.includes(student.id);
                      return (
                        <label
                          key={student.id}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            isAutoSelected
                              ? 'bg-purple-50 border-purple-500'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isAutoSelected}
                            onChange={() => toggleStudentSelection(student.id)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{student.name}</p>
                              {student.status === 'At Risk' && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">At Risk</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              Progress: {student.progress}% • TOEFL: {student.toefl}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Struggles with: {student.strugglingWith}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setStep('select-method')}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleAssignStory}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <span>✓</span>
                    Assign to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
