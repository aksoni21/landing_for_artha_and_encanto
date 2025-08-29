// -----storytime feature additions-----
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story } from '../../services/storytime_storyService';
import storyService from '../../services/storytime_storyService';

type AssessmentType = 'comprehension' | 'vocabulary' | 'fluency' | 'writing';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correct_answer?: string | number;
  points: number;
  explanation?: string;
}

interface Assessment {
  id: string;
  type: AssessmentType;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // minutes
  totalPoints: number;
}

interface UserAnswer {
  questionId: string;
  answer: string | number;
}

interface AssessmentResult {
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  feedback: {
    overall: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
}

interface StoryAssessmentProps {
  story: Story;
  assessmentType: AssessmentType;
  userId: string;
  onComplete: (result: AssessmentResult) => void;
}

const StoryAssessment: React.FC<StoryAssessmentProps> = ({
  story,
  assessmentType,
  userId,
  onComplete
}) => {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Generate assessment based on story and type
  useEffect(() => {
    const assessment = generateAssessment(story, assessmentType);
    setCurrentAssessment(assessment);
    if (assessment.timeLimit) {
      setTimeRemaining(assessment.timeLimit * 60); // Convert to seconds
    }
  }, [story, assessmentType]);

  // Timer countdown
  useEffect(() => {
    if (!isStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, timeRemaining]);

  const startAssessment = () => {
    setIsStarted(true);
    setStartTime(new Date());
  };

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, answer };
        return updated;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const getCurrentAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer;
  };

  const nextQuestion = () => {
    if (currentAssessment && currentQuestionIndex < currentAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!currentAssessment || !startTime) return;

    setIsSubmitting(true);
    try {
      // Calculate results
      const result = calculateResults(currentAssessment, answers, startTime);
      
      // Submit to backend
      await storyService.submitAssessment(currentAssessment.id, 
        answers.map(a => ({ question_id: a.questionId, answer: a.answer }))
      );
      
      onComplete(result);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!currentAssessment) return 0;
    return ((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100;
  };

  if (!currentAssessment) {
    return <div className="loading">Preparing assessment...</div>;
  }

  if (!isStarted) {
    return (
      <div className="assessment-intro bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">{currentAssessment.title}</h2>
        <p className="text-gray-700 mb-6">{currentAssessment.description}</p>
        
        <div className="assessment-details grid md:grid-cols-3 gap-6 mb-8">
          <div className="detail-card text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{currentAssessment.questions.length}</div>
            <div className="text-sm text-blue-800">Questions</div>
          </div>
          <div className="detail-card text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{currentAssessment.totalPoints}</div>
            <div className="text-sm text-green-800">Total Points</div>
          </div>
          <div className="detail-card text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {currentAssessment.timeLimit ? `${currentAssessment.timeLimit} min` : 'No limit'}
            </div>
            <div className="text-sm text-orange-800">Time Limit</div>
          </div>
        </div>

        <div className="instructions mb-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Read each question carefully before answering</li>
            <li>• You can navigate between questions using the buttons</li>
            <li>• Make sure to answer all questions before submitting</li>
            {currentAssessment.timeLimit && (
              <li>• The assessment will auto-submit when time runs out</li>
            )}
            <li>• Your progress is not saved until you submit</li>
          </ul>
        </div>

        <button
          onClick={startAssessment}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  const currentQuestion = currentAssessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentAssessment.questions.length - 1;

  return (
    <div className="story-assessment">
      {/* Header with progress and timer */}
      <div className="assessment-header bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{currentAssessment.title}</h2>
          {currentAssessment.timeLimit && (
            <div className={`text-lg font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        
        <div className="progress-section">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {currentAssessment.questions.length}</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="progress-bar bg-gray-200 h-2 rounded-full">
            <div
              className="progress-fill bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card bg-white shadow-lg rounded-lg p-8 mb-6">
        <div className="question-header mb-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full ml-4">
              {currentQuestion.points} pt{currentQuestion.points !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="question-content">
          {currentQuestion.type === 'multiple_choice' && (
            <div className="multiple-choice space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    getCurrentAnswer(currentQuestion.id) === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={index}
                    checked={getCurrentAnswer(currentQuestion.id) === index}
                    onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true_false' && (
            <div className="true-false space-y-3">
              {['True', 'False'].map((option, index) => (
                <label
                  key={option}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    getCurrentAnswer(currentQuestion.id) === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={index}
                    checked={getCurrentAnswer(currentQuestion.id) === index}
                    onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'short_answer' && (
            <input
              type="text"
              value={getCurrentAnswer(currentQuestion.id) || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          )}

          {currentQuestion.type === 'essay' && (
            <textarea
              value={getCurrentAnswer(currentQuestion.id) || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Write your detailed answer here..."
              rows={8}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="question-dots flex gap-2">
            {currentAssessment.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : answers.some(a => a.questionId === currentAssessment.questions[index].id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Next →
            </button>
          )}
        </div>

        {/* Answer Summary */}
        <div className="answer-summary mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Answered: <span className="font-medium">{answers.length}</span> of{' '}
            <span className="font-medium">{currentAssessment.questions.length}</span> questions
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate assessments based on story content
const generateAssessment = (story: Story, type: AssessmentType): Assessment => {
  const baseId = `${story.id}_${type}`;
  
  switch (type) {
    case 'comprehension':
      return {
        id: baseId,
        type: 'comprehension',
        title: 'Reading Comprehension Assessment',
        description: `Test your understanding of "${story.title}" with these comprehension questions.`,
        timeLimit: Math.max(10, Math.min(30, Math.ceil((story.word_count || 500) / 100))),
        questions: generateComprehensionQuestions(story),
        totalPoints: 0
      };
    
    case 'vocabulary':
      return {
        id: baseId,
        type: 'vocabulary',
        title: 'Vocabulary Assessment',
        description: `Test your knowledge of key vocabulary from "${story.title}".`,
        timeLimit: 15,
        questions: generateVocabularyQuestions(story),
        totalPoints: 0
      };
    
    case 'fluency':
      return {
        id: baseId,
        type: 'fluency',
        title: 'Language Fluency Assessment',
        description: `Demonstrate your language fluency through various tasks based on "${story.title}".`,
        timeLimit: 25,
        questions: generateFluencyQuestions(story),
        totalPoints: 0
      };
    
    case 'writing':
      return {
        id: baseId,
        type: 'writing',
        title: 'Writing Skills Assessment',
        description: `Show your writing abilities through tasks inspired by "${story.title}".`,
        timeLimit: 45,
        questions: generateWritingQuestions(story),
        totalPoints: 0
      };
    
    default:
      throw new Error(`Unknown assessment type: ${type}`);
  }
};

// Helper functions for generating different types of questions
const generateComprehensionQuestions = (story: Story): Question[] => {
  // In a real implementation, these would be dynamically generated based on story content
  // For now, providing template questions that would be customized per story
  return [
    {
      id: 'comp_1',
      type: 'multiple_choice',
      question: 'What is the main theme of the story?',
      options: ['Friendship', 'Adventure', 'Learning', 'Family'],
      correct_answer: 0,
      points: 5
    },
    {
      id: 'comp_2',
      type: 'true_false',
      question: 'The story has a happy ending.',
      correct_answer: 0,
      points: 3
    },
    {
      id: 'comp_3',
      type: 'short_answer',
      question: 'Who is the main character in the story?',
      points: 4
    }
  ];
};

const generateVocabularyQuestions = (story: Story): Question[] => {
  return [
    {
      id: 'vocab_1',
      type: 'multiple_choice',
      question: 'In the context of the story, what does "determination" mean?',
      options: ['Giving up easily', 'Staying focused on goals', 'Being confused', 'Moving quickly'],
      correct_answer: 1,
      points: 4
    }
  ];
};

const generateFluencyQuestions = (story: Story): Question[] => {
  return [
    {
      id: 'fluency_1',
      type: 'essay',
      question: 'Explain the moral of the story and how it applies to real life.',
      points: 15
    }
  ];
};

const generateWritingQuestions = (story: Story): Question[] => {
  return [
    {
      id: 'writing_1',
      type: 'essay',
      question: 'Write an alternative ending to the story. Explain why you chose this ending.',
      points: 20
    }
  ];
};

const calculateResults = (assessment: Assessment, answers: UserAnswer[], startTime: Date): AssessmentResult => {
  let correctAnswers = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  assessment.questions.forEach(question => {
    totalPoints += question.points;
    const answer = answers.find(a => a.questionId === question.id);
    
    if (answer && question.correct_answer !== undefined) {
      if (answer.answer === question.correct_answer) {
        correctAnswers++;
        earnedPoints += question.points;
      }
    }
  });

  const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

  return {
    score: earnedPoints,
    maxScore: totalPoints,
    percentage: Math.round(percentage),
    correctAnswers,
    totalQuestions: assessment.questions.length,
    timeSpent,
    feedback: generateFeedback(percentage, assessment.type)
  };
};

const generateFeedback = (percentage: number, type: AssessmentType) => {
  const level = percentage >= 90 ? 'excellent' : 
                percentage >= 80 ? 'good' : 
                percentage >= 70 ? 'satisfactory' : 
                percentage >= 60 ? 'needs_improvement' : 'poor';

  const feedback = {
    excellent: {
      overall: 'Excellent work! You have a strong understanding of the material.',
      strengths: ['Strong comprehension', 'Good attention to detail', 'Excellent vocabulary knowledge'],
      improvements: ['Continue reading challenging texts', 'Share your knowledge with others'],
      recommendations: ['Try more advanced stories', 'Consider helping other learners']
    },
    good: {
      overall: 'Good job! You understand most of the material well.',
      strengths: ['Solid understanding', 'Good effort', 'Clear thinking'],
      improvements: ['Review missed concepts', 'Practice regularly'],
      recommendations: ['Read similar difficulty stories', 'Focus on weak areas']
    },
    satisfactory: {
      overall: 'You have a basic understanding but there\'s room for improvement.',
      strengths: ['Shows effort', 'Understanding core concepts'],
      improvements: ['Review the story again', 'Practice more', 'Ask for help when needed'],
      recommendations: ['Re-read the story', 'Try easier stories first', 'Use vocabulary tools']
    },
    needs_improvement: {
      overall: 'You may need additional support to fully understand the material.',
      strengths: ['Attempting all questions', 'Showing willingness to learn'],
      improvements: ['Review fundamental concepts', 'Practice more frequently', 'Seek additional help'],
      recommendations: ['Start with easier stories', 'Use guided reading', 'Practice vocabulary daily']
    },
    poor: {
      overall: 'Consider reviewing the story and practicing more before trying again.',
      strengths: ['Participated in assessment', 'Room for growth'],
      improvements: ['Review basic concepts', 'Practice fundamental skills', 'Get additional support'],
      recommendations: ['Start with very basic stories', 'Work with a tutor', 'Practice daily']
    }
  };

  return feedback[level];
};

export default StoryAssessment;