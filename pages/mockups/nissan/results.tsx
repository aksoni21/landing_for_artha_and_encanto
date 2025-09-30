import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Download } from 'lucide-react';

interface MockAssessmentData {
  candidate: {
    name: string;
    email: string;
    position: string;
    assessmentDate: string;
  };
  audioUrl: string;
  transcript: string;
  placement_result: {
    overall_score: number;
    placement_level: string;
    cefr_level: string;
    description: string;
    component_scores: {
      pronunciation: number;
      fluency: number;
      vocabulary: number;
      grammar: number;
      confidence: number;
    };
    recommendations: string[];
  };
  fluency_analysis: {
    words_per_minute: number;
    total_pauses: number;
    filler_words_count: number;
    self_corrections: number;
  };
  mistakes: Array<{
    type: string;
    category: string;
    original: string;
    correction: string;
    description?: string;
  }>;
  strengths: Array<{
    area: string;
    description: string;
    example: string;
    level: 'good' | 'excellent' | 'outstanding';
  }>;
}

// Mock data for demo
const mockData: MockAssessmentData = {
  candidate: {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@gmail.com',
    position: 'Technical Architect - Mexico Operations',
    assessmentDate: 'September 22, 2025'
  },
  audioUrl: '#', // In real implementation, this would be an actual audio URL
  transcript: 'I work... I working in the company, eh, for many time. The system... the systems is very... how to say... eh... complicated? I make... I maked some... some things for the computer. Is very difficult because... eh... the data is much and... and the server sometimes no work good. We have problem with... eh... how to say... the people who use the system, they want fast but... eh... is not possible always. I try to... to fix but... eh... the technology is complicated for me.',
  placement_result: {
    overall_score: 42,
    placement_level: 'Elementary',
    cefr_level: 'A2',
    description: 'Basic English communication with significant room for improvement. Can express simple ideas but struggles with complex grammar and fluency.',
    component_scores: {
      pronunciation: 58,
      fluency: 35,
      vocabulary: 48,
      grammar: 31,
      confidence: 45
    },
    recommendations: [
      'Focus on basic grammar patterns and verb conjugations',
      'Practice speaking without filler words to improve fluency',
      'Expand core business vocabulary',
      'Work on sentence structure and word order'
    ]
  },
  fluency_analysis: {
    words_per_minute: 85,
    total_pauses: 18,
    filler_words_count: 12,
    self_corrections: 3
  },
  mistakes: [
    {
      type: 'Verb Tense Mixing',
      category: 'Grammar',
      original: 'I work... I working in the company',
      correction: 'I work in the company (or: I am working in the company)',
      description: 'Choose either simple present or present continuous, not both'
    },
    {
      type: 'Irregular Past Tense',
      category: 'Grammar',
      original: 'I maked some things',
      correction: 'I made some things',
      description: 'Past tense of "make" is "made", not "maked"'
    },
    {
      type: 'Filler Words',
      category: 'Fluency',
      original: '"eh" used 12 times',
      correction: 'Try to pause silently instead of using filler words',
      description: 'Excessive filler words interrupt communication flow'
    },
    {
      type: 'Subject-Verb Agreement',
      category: 'Grammar',
      original: 'the server sometimes no work good',
      correction: 'the server sometimes does not work well',
      description: 'Use auxiliary verb "does" for negative statements'
    },
    {
      type: 'Word Order',
      category: 'Grammar',
      original: 'the data is much',
      correction: 'there is a lot of data',
      description: 'English word order differs from Spanish - use "a lot of" for quantities'
    }
  ],
  strengths: [
    {
      area: 'Willingness to Communicate',
      description: 'Shows effort to express technical concepts despite language barriers',
      example: 'Attempted to describe complex system work: "I make... some things for the computer"',
      level: 'good'
    },
    {
      area: 'Basic Technical Vocabulary',
      description: 'Demonstrates knowledge of fundamental technical terms',
      example: 'Successfully used words like "system", "server", "data", and "technology"',
      level: 'good'
    },
    {
      area: 'Problem Recognition',
      description: 'Able to identify and discuss technical challenges',
      example: 'Recognized system complexity: "the technology is complicated" and performance issues',
      level: 'good'
    },
    {
      area: 'Persistence in Communication',
      description: 'Continued speaking despite language difficulties',
      example: 'Used phrases like "how to say..." to work through vocabulary gaps while maintaining communication',
      level: 'good'
    }
  ]
};

const NissanResultsPage: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    // In a real implementation, you'd fetch the actual audio URL
    setAudioUrl(mockData.audioUrl);
  }, []);

  const downloadAudio = () => {
    // Mock download functionality for demo
    alert('Audio download initiated (demo functionality)');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'outstanding': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'outstanding': return '🌟';
      case 'excellent': return '✨';
      case 'good': return '👍';
      default: return '💪';
    }
  };

  return (
    <>
      <Head>
        <title>Assessment Results - {mockData.candidate.name} | Nissan North America</title>
        <meta name="description" content="Technical Architect English Assessment Results" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-xl border-b border-gray-200 backdrop-blur-sm bg-white/95">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-red-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">N</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Nissan North America</h1>
                  <p className="text-lg text-blue-600 font-medium">Technical Assessment Results</p>
                </div>
              </div>
              <div className="text-right bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-700">Confidential HR Document</p>
                <p className="text-xs text-gray-500">For Internal Use Only</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Candidate Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {mockData.candidate.name}
                  </h2>
                </div>
                <p className="text-xl text-gray-700 mb-2">{mockData.candidate.position}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl shadow-lg">
                <span className="text-white font-bold text-lg">Technical Architect Assessment</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Candidate</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Email</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Assessment Date</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.assessmentDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Audio & Transcript Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-800">Audio Recording & Transcript</h3>
              </div>
              <button
                onClick={downloadAudio}
                className="flex items-center text-white space-x-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-xl transition-all shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Download Audio</span>
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Audio Response</h4>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-center h-24">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <p className="font-semibold text-gray-700">Audio Player</p>
                      <p className="text-sm text-gray-500">Duration: 0:58</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Transcript</h4>
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 border border-amber-200 h-36 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed font-medium italic">
                    &quot;{mockData.transcript}&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Assessment Scores Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <span className="text-3xl">📊</span>
              <h2 className="text-2xl font-bold text-gray-800">Assessment Scores</h2>
            </div>

            {/* Overall Score */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Overall English Proficiency</h3>
                  <p className="text-gray-600">{mockData.placement_result.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-indigo-600">{mockData.placement_result.overall_score}/100</div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                      {mockData.placement_result.placement_level}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {mockData.placement_result.cefr_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Score Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mockData.placement_result.overall_score}%` }}
                ></div>
              </div>
            </div>

            {/* Component Scores */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(mockData.placement_result.component_scores).map(([skill, score]) => {
                const getSkillColor = (skillName: string) => {
                  switch (skillName) {
                    case 'pronunciation': return 'from-blue-500 to-blue-600';
                    case 'fluency': return 'from-green-500 to-green-600';
                    case 'vocabulary': return 'from-purple-500 to-purple-600';
                    case 'grammar': return 'from-red-500 to-red-600';
                    case 'confidence': return 'from-yellow-500 to-orange-600';
                    default: return 'from-gray-500 to-gray-600';
                  }
                };

                const getSkillIcon = (skillName: string) => {
                  switch (skillName) {
                    case 'pronunciation': return '🗣️';
                    case 'fluency': return '⚡';
                    case 'vocabulary': return '📚';
                    case 'grammar': return '📝';
                    case 'confidence': return '💪';
                    default: return '📊';
                  }
                };

                return (
                  <div key={skill} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-center mb-3">
                      <div className="text-2xl mb-2">{getSkillIcon(skill)}</div>
                      <h4 className="font-semibold text-gray-900 capitalize">{skill}</h4>
                    </div>
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-gray-900">{score}/100</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${getSkillColor(skill)} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Fluency Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.17 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
              <span className="text-3xl">📈</span>
              <h2 className="text-2xl font-bold text-gray-800">Fluency Analytics</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.words_per_minute}</div>
                  <div className="text-sm font-medium text-blue-700">Words/Minute</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">⏸️</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.total_pauses}</div>
                  <div className="text-sm font-medium text-orange-700">Total Pauses</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">😐</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.filler_words_count}</div>
                  <div className="text-sm font-medium text-red-700">Filler Words</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">✏️</div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.fluency_analysis.self_corrections}</div>
                  <div className="text-sm font-medium text-green-700">Self-Corrections</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              <span className="text-3xl">📈</span>
              <h2 className="text-2xl font-bold text-gray-800">Areas for Development</h2>
            </div>

            <div className="space-y-6">
              {mockData.mistakes.map((mistake, index) => (
                <div
                  key={index}
                  className="border border-orange-200 rounded-xl p-6 bg-gradient-to-br from-orange-50 to-red-50 shadow-md"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {mistake.category}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{mistake.type}</h4>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-orange-700">Current: </span>
                          <span className="text-sm text-orange-600 font-mono bg-orange-100 px-2 py-1 rounded">
                            {mistake.original}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-green-700">Improved: </span>
                          <span className="text-sm text-green-600 font-mono bg-green-100 px-2 py-1 rounded">
                            {mistake.correction}
                          </span>
                        </div>

                        {mistake.description && (
                          <p className="text-sm text-gray-600 italic">{mistake.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Strengths Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              <span className="text-3xl">⭐</span>
              <h2 className="text-2xl font-bold text-gray-800">Communication Strengths</h2>
            </div>

            <div className="space-y-6">
              {mockData.strengths.map((strength, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-6 shadow-md ${getLevelColor(strength.level)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getLevelIcon(strength.level)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{strength.area}</h4>
                      <p className="mb-3 text-sm leading-relaxed">{strength.description}</p>
                      <div className="bg-white/50 rounded-md p-3 border-l-4 border-current">
                        <p className="text-sm italic">&quot;{strength.example}&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* HR Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <span className="text-3xl">💼</span>
              <h2 className="text-2xl font-bold text-gray-800">HR Recommendations</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Development Priorities</h3>
                <div className="space-y-3">
                  {mockData.placement_result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hiring Assessment</h3>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">⚠️</span>
                    <span className="font-bold text-orange-800 text-lg">DEVELOPMENT NEEDED</span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Candidate shows technical knowledge but requires significant English language development before being suitable for client-facing technical roles.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Recommendation:</strong> Consider for internal technical roles with English training program.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Timeline:</strong> Re-assess after 6-12 months of targeted language training.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hiring Recommendation */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">✅</span>
              <h2 className="text-xl font-semibold text-gray-800">Hiring Recommendation</h2>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-lg font-semibold text-green-800 mb-2">PROCEED TO NEXT ROUND</p>
              <p className="text-gray-700 leading-relaxed">
                Candidate demonstrates strong technical communication skills with excellent architecture vocabulary
                and ability to articulate complex trade-offs. Minor grammar refinements can be addressed through
                standard onboarding communication training. Recommended for technical interview phase.
              </p>
            </div>
          </motion.div> */}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 border-t mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-gray-700 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-white font-bold text-xl">Nissan North America</span>
              </div>
              <div className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Nissan North America, Inc. |
                <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">Privacy Policy</a>
                <span className="mx-2">|</span>
                <span className="text-gray-400">Assessment Results - Confidential</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NissanResultsPage;