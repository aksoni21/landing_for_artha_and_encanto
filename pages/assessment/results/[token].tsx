import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { User, Mail, AlertCircle } from 'lucide-react';
import { AudioPlayer } from '../../../components/assessment/AudioPlayer';

// Import our new teaching-focused components
import TeachingPriorities from '../../../components/assessment/TeachingPriorities';
import StrengthsSection from '../../../components/assessment/StrengthsSection';
import GrammarInsights from '../../../components/assessment/GrammarInsights';
import FluencyAnalysis from '../../../components/assessment/FluencyAnalysis';
import VocabularyInsights from '../../../components/assessment/VocabularyInsights';
import AudioHighlights from '../../../components/assessment/AudioHighlights';

interface AssessmentResultData {
  assessment_id: string;
  partner_id: string;
  student_name?: string;
  student_email?: string;
  placement_result: {
    overall_score: number;
    placement_level: string;
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
  assessment_date: string;
  partner_config: {
    name: string;
    branding: {
      primary_color: string;
      secondary_color: string;
      accent_color: string;
      logo_url?: string;
    };
  };
  audio_url: string;
  transcript?: string;
}

interface AssessmentResultsPageProps {
  data: AssessmentResultData | null;
  error?: string;
  errorType?: 'AUTH_ERROR' | 'CONNECTION_ERROR' | 'GENERAL_ERROR';
  token: string;
}

// Transform score-based data to teaching-focused data
const transformToTeachingData = (scoreData: AssessmentResultData) => {
  return {
    priority_areas: [
      {
        id: 'past_tense',
        icon: 'grammar' as const,
        title: 'Practice Past Tense',
        description: 'Focus on past tense conjugations and usage patterns',
        examples: ['\"Yo fue\" → \"Yo fui\"', '\"Ella tiene\" → \"Ella tuvo\"']
      },
      {
        id: 'pauses',
        icon: 'fluency' as const,
        title: 'Reduce Hesitation',
        description: 'Work on reducing long pauses when searching for words',
        examples: ['Practice common phrases', 'Build vocabulary confidence']
      },
      {
        id: 'emotions',
        icon: 'vocabulary' as const,
        title: 'Expand Emotion Words',
        description: 'Develop richer emotional vocabulary beyond basic words',
        examples: ['emocionante', 'frustrante', 'satisfactorio']
      }
    ],
    strengths: [
      {
        category: 'Self-Monitoring',
        description: 'Shows good awareness by self-correcting mistakes',
        examples: ['Self-corrections during speech']
      },
      {
        category: 'Confidence',
        description: 'Speaks with confidence and attempts complex ideas',
        examples: ['Maintains steady pace', 'Uses varied sentence structures']
      }
    ],
    grammar_analysis: {
      grammar_errors: [
        {
          type: 'Past Tense Conjugation',
          example: 'Yo fue al mercado',
          correction: 'Yo fui al mercado',
          count: 3
        }
      ],
      grammar_strengths: ['Shows understanding of sentence structure', 'Attempts complex grammar'],
      tense_usage: { present: 15, past: 3, future: 2 },
      sentence_types: { simple: 8, compound: 5, complex: 7 },
      avg_sentence_length: 12.5
    },
    fluency_analysis: {
      words_per_minute: scoreData.placement_result.component_scores.fluency || 120,
      total_pauses: 8,
      avg_pause_duration_ms: 1500,
      filled_pauses_count: 5,
      filler_words: [
        { word: 'este', count: 4 },
        { word: 'umm', count: 3 }
      ],
      repetitions_count: 2,
      self_corrections_count: 3
    },
    vocabulary_analysis: {
      total_words: 150,
      unique_words: 85,
      type_token_ratio: 0.57,
      academic_words: ['principalmente', 'específicamente'],
      rare_words: ['perseverancia', 'desafío'],
      repetitive_words: [
        { word: 'muy', count: 6 },
        { word: 'bueno', count: 4 }
      ],
      vocabulary_level: scoreData.placement_result.placement_level?.toLowerCase() || 'intermediate'
    },
    audio_highlights: [
      {
        timestamp: 15,
        type: 'strength' as const,
        description: 'Good use of complex sentence structure',
        text: 'Sample text from audio',
        category: 'Grammar'
      },
      {
        timestamp: 45,
        type: 'improvement' as const,
        description: 'Past tense confusion - learning opportunity',
        text: 'Sample text with error',
        category: 'Grammar'
      }
    ],
    confidence_level: 'moderate'
  };
};

const AssessmentResultsPage: React.FC<AssessmentResultsPageProps> = ({ data, error, errorType, token }) => {
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    if (data?.audio_url) {
      setAudioUrl(data.audio_url + `?token=${token}`);
    }
  }, [data?.audio_url, token]);

  const downloadAudio = () => {
    if (audioUrl && data) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `assessment_${data.assessment_id}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error || !data) {
    // Determine error display based on error type
    const getErrorDisplay = () => {
      switch (errorType) {
        case 'CONNECTION_ERROR':
          return {
            icon: <div className="text-6xl mb-4">🔌</div>,
            title: 'Server Connection Error',
            message: error || 'Cannot connect to the assessment server. Please try again later.',
            buttonText: 'Refresh Page',
            buttonAction: () => window.location.reload(),
            bgColor: 'bg-orange-500 hover:bg-orange-600'
          };
        case 'AUTH_ERROR':
          return {
            icon: <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />,
            title: 'Access Denied',
            message: error || 'Invalid or expired access token.',
            buttonText: 'Go to EncantoSpeak',
            buttonAction: () => window.location.href = 'https://encantospeak.com',
            bgColor: 'bg-blue-500 hover:bg-blue-600'
          };
        default:
          return {
            icon: <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />,
            title: 'Error Loading Results',
            message: error || 'Unable to load assessment results. The link may be invalid or expired.',
            buttonText: 'Go to EncantoSpeak',
            buttonAction: () => window.location.href = 'https://encantospeak.com',
            bgColor: 'bg-blue-500 hover:bg-blue-600'
          };
      }
    };

    const errorDisplay = getErrorDisplay();

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Head>
          <title>Assessment Results - Error</title>
        </Head>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center"
        >
          {errorDisplay.icon}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {errorDisplay.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {errorDisplay.message}
          </p>
          {errorType === 'CONNECTION_ERROR' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Developer note:</strong> Make sure the backend server is running
              </p>
            </div>
          )}
          <button
            onClick={errorDisplay.buttonAction}
            className={`${errorDisplay.bgColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
          >
            {errorDisplay.buttonText}
          </button>
        </motion.div>
      </div>
    );
  }

  const { partner_config } = data;

  // Transform the score-based data to teaching-focused format
  const teachingData = transformToTeachingData(data);

  return (
    <>
      <Head>
        <title>Teaching Report - {partner_config.name}</title>
        <meta name="description" content={`Teaching insights for ${data.student_name || 'Student'}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {partner_config.branding.logo_url && (
                  <img
                    src={partner_config.branding.logo_url}
                    alt={partner_config.name}
                    className="h-12 w-auto"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Teaching Report
                  </h1>
                  <p className="text-gray-600">{partner_config.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">Assessment Date</p>
                <p className="font-medium">
                  {new Date(data.assessment_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Student Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <User size={20} className="text-gray-400" />
                  <span className="text-gray-600">Student:</span>
                  <span className="font-semibold text-gray-800">
                    {data.student_name || 'Not provided'}
                  </span>
                </div>
                {data.student_email && (
                  <div className="flex items-center space-x-3">
                    <Mail size={20} className="text-gray-400" />
                    <span className="font-medium text-gray-700">
                      {data.student_email}
                    </span>
                  </div>
                )}
              </div>

              {/* Audio Player */}
              <div className="flex items-center space-x-4">
                {audioUrl && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <AudioPlayer
                      audioUrl={audioUrl}
                      onDownload={downloadAudio}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Section */}
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">📝</span>
                <h3 className="text-lg font-semibold text-gray-800">
                  Student&apos;s Response Transcript
                </h3>
              </div>
              {data.transcript ? (
                <div
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  style={{ borderColor: partner_config.branding.primary_color + '33' }}
                >
                  <div className="text-gray-700 leading-relaxed italic">
                    &quot;{data.transcript}&quot;
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    💡 Teachers can reference specific phrases from this transcript in their lessons
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-gray-500 text-center py-4">
                    <span className="text-3xl mb-2 block">🎤</span>
                    <p className="text-sm">
                      Transcript not available for this assessment.
                    </p>
                    <p className="text-xs mt-2 text-gray-400">
                      This may be from an older assessment before transcript generation was implemented.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Teaching Priorities - Most Important */}
          <TeachingPriorities
            priorities={teachingData.priority_areas}
            primaryColor={partner_config.branding.primary_color}
          />

          {/* Strengths Section - Build Confidence */}
          <StrengthsSection
            strengths={teachingData.strengths}
            overallConfidenceLevel={teachingData.confidence_level}
            primaryColor={partner_config.branding.primary_color}
          />

          {/* Two-column layout for detailed analysis */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Grammar Insights */}
              <GrammarInsights
                grammarErrors={teachingData.grammar_analysis.grammar_errors}
                grammarStrengths={teachingData.grammar_analysis.grammar_strengths}
                tenseUsage={teachingData.grammar_analysis.tense_usage}
                sentenceTypes={teachingData.grammar_analysis.sentence_types}
                averageSentenceLength={teachingData.grammar_analysis.avg_sentence_length}
                primaryColor={partner_config.branding.primary_color}
              />

              {/* Vocabulary Insights */}
              <VocabularyInsights
                totalWords={teachingData.vocabulary_analysis.total_words}
                uniqueWords={teachingData.vocabulary_analysis.unique_words}
                typeTokenRatio={teachingData.vocabulary_analysis.type_token_ratio}
                academicWords={teachingData.vocabulary_analysis.academic_words}
                rareWords={teachingData.vocabulary_analysis.rare_words}
                repetitiveWords={teachingData.vocabulary_analysis.repetitive_words}
                vocabularyLevel={teachingData.vocabulary_analysis.vocabulary_level}
                primaryColor={partner_config.branding.primary_color}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Fluency Analysis */}
              <FluencyAnalysis
                wordsPerMinute={teachingData.fluency_analysis.words_per_minute}
                totalPauses={teachingData.fluency_analysis.total_pauses}
                averagePauseDuration={teachingData.fluency_analysis.avg_pause_duration_ms}
                filledPausesCount={teachingData.fluency_analysis.filled_pauses_count}
                fillerWords={teachingData.fluency_analysis.filler_words}
                repetitionsCount={teachingData.fluency_analysis.repetitions_count}
                selfCorrectionsCount={teachingData.fluency_analysis.self_corrections_count}
                primaryColor={partner_config.branding.primary_color}
              />

              {/* Audio Highlights */}
              <AudioHighlights
                highlights={teachingData.audio_highlights}
                audioUrl={audioUrl}
                primaryColor={partner_config.branding.primary_color}
                onTimestampClick={(timestamp) => {
                  // Here you would seek the audio player to this timestamp
                  console.log('Seeking to:', timestamp);
                }}
              />
            </div>
          </div>

          {/* Footer with Teaching Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              🎯 Next Steps for This Student
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">This Week:</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Focus on top priority area</li>
                  <li>• Celebrate their strengths</li>
                  <li>• Practice specific examples</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 mb-2">This Month:</h4>
                <ul className="text-purple-700 space-y-1">
                  <li>• Build on identified strengths</li>
                  <li>• Address grammar patterns</li>
                  <li>• Expand vocabulary systematically</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Ongoing:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Regular speaking practice</li>
                  <li>• Confidence building activities</li>
                  <li>• Track progress over time</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Assessment Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Teaching report powered by Encanto AI</p>
            <p className="mt-1">
              This detailed analysis is designed to help teachers provide targeted, effective instruction.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.params as { token: string };

  try {
    // Use the Next.js API route which will proxy to the backend
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://encantospeak.com';

    const response = await fetch(`${baseUrl}/api/assessment/results/${token}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error', errorType: 'GENERAL_ERROR' }));

      if (response.status === 401) {
        return {
          props: {
            data: null,
            error: errorData.error || 'Invalid or expired access token.',
            errorType: 'AUTH_ERROR',
            token
          }
        };
      }

      if (response.status === 503) {
        return {
          props: {
            data: null,
            error: errorData.error || 'Cannot connect to assessment server.',
            errorType: 'CONNECTION_ERROR',
            token
          }
        };
      }

      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        data,
        token
      }
    };
  } catch (error) {
    console.error('Error fetching assessment results:', error);

    return {
      props: {
        data: null,
        error: 'Unable to load assessment results. The link may be invalid or expired.',
        errorType: 'GENERAL_ERROR',
        token
      }
    };
  }
};

export default AssessmentResultsPage;