import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { User, Mail, AlertCircle } from 'lucide-react';

// Import our new teaching-focused components
import TeachingPriorities from '../../../components/assessment/TeachingPriorities';
import StrengthsSection from '../../../components/assessment/StrengthsSection';
import GrammarInsights from '../../../components/assessment/GrammarInsights';
import FluencyAnalysis from '../../../components/assessment/FluencyAnalysis';
import VocabularyInsights from '../../../components/assessment/VocabularyInsights';
import AudioHighlights from '../../../components/assessment/AudioHighlights';
import { AudioPlayer } from '../../../components/assessment/AudioPlayer';

// Updated interface for teaching-focused data
interface TeachingAssessmentData {
  assessment_id: string;
  partner_id: string;
  student_name?: string;
  student_email?: string;
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

  // Teaching-focused analysis results
  teaching_analysis: {
    // Priority areas for immediate focus
    priority_areas: Array<{
      id: string;
      icon: 'speaking' | 'grammar' | 'vocabulary' | 'fluency';
      title: string;
      description: string;
      examples?: string[];
    }>;

    // Student strengths
    strengths: Array<{
      category: string;
      description: string;
      examples?: string[];
    }>;

    // Grammar patterns and errors
    grammar_analysis: {
      grammar_errors: Array<{
        type: string;
        example: string;
        correction: string;
        count: number;
      }>;
      grammar_strengths: string[];
      tense_usage: Record<string, number>;
      sentence_types: Record<string, number>;
      avg_sentence_length: number;
    };

    // Fluency patterns
    fluency_analysis: {
      words_per_minute: number;
      total_pauses: number;
      avg_pause_duration_ms: number;
      filled_pauses_count: number;
      filler_words: Array<{ word: string; count: number }>;
      repetitions_count: number;
      self_corrections_count: number;
    };

    // Vocabulary insights
    vocabulary_analysis: {
      total_words: number;
      unique_words: number;
      type_token_ratio: number;
      academic_words: string[];
      rare_words: string[];
      repetitive_words: Array<{ word: string; count: number }>;
      vocabulary_level: string;
    };

    // Audio highlights
    audio_highlights: Array<{
      timestamp: number;
      type: 'strength' | 'improvement' | 'example';
      description: string;
      text: string;
      category?: string;
    }>;

    // Overall confidence assessment
    confidence_level: string;
  };
}

interface TeachingResultsPageProps {
  data: TeachingAssessmentData | null;
  error?: string;
  token: string;
}

const TeachingFocusedResultsPage: React.FC<TeachingResultsPageProps> = ({ data, error, token }) => {
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

  const handleTimestampClick = (timestamp: number) => {
    // Here you would seek the audio player to this timestamp
    // This would require updating the AudioPlayer component to support seeking
    console.log('Timestamp clicked:', timestamp);
  };

  if (error || !data) {
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
          <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'Invalid or expired access token.'}
          </p>
          <a
            href="https://encantospeak.com"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to EncantoSpeak
          </a>
        </motion.div>
      </div>
    );
  }

  const { teaching_analysis, partner_config } = data;

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
          </motion.div>

          {/* Teaching Priorities - Most Important */}
          <TeachingPriorities
            priorities={teaching_analysis.priority_areas}
            primaryColor={partner_config.branding.primary_color}
          />

          {/* Strengths Section - Build Confidence */}
          <StrengthsSection
            strengths={teaching_analysis.strengths}
            overallConfidenceLevel={teaching_analysis.confidence_level}
            primaryColor={partner_config.branding.primary_color}
          />

          {/* Two-column layout for detailed analysis */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Grammar Insights */}
              <GrammarInsights
                grammarErrors={teaching_analysis.grammar_analysis.grammar_errors}
                grammarStrengths={teaching_analysis.grammar_analysis.grammar_strengths}
                tenseUsage={teaching_analysis.grammar_analysis.tense_usage}
                sentenceTypes={teaching_analysis.grammar_analysis.sentence_types}
                averageSentenceLength={teaching_analysis.grammar_analysis.avg_sentence_length}
                primaryColor={partner_config.branding.primary_color}
              />

              {/* Vocabulary Insights */}
              <VocabularyInsights
                totalWords={teaching_analysis.vocabulary_analysis.total_words}
                uniqueWords={teaching_analysis.vocabulary_analysis.unique_words}
                typeTokenRatio={teaching_analysis.vocabulary_analysis.type_token_ratio}
                academicWords={teaching_analysis.vocabulary_analysis.academic_words}
                rareWords={teaching_analysis.vocabulary_analysis.rare_words}
                repetitiveWords={teaching_analysis.vocabulary_analysis.repetitive_words}
                vocabularyLevel={teaching_analysis.vocabulary_analysis.vocabulary_level}
                primaryColor={partner_config.branding.primary_color}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Fluency Analysis */}
              <FluencyAnalysis
                wordsPerMinute={teaching_analysis.fluency_analysis.words_per_minute}
                totalPauses={teaching_analysis.fluency_analysis.total_pauses}
                averagePauseDuration={teaching_analysis.fluency_analysis.avg_pause_duration_ms}
                filledPausesCount={teaching_analysis.fluency_analysis.filled_pauses_count}
                fillerWords={teaching_analysis.fluency_analysis.filler_words}
                repetitionsCount={teaching_analysis.fluency_analysis.repetitions_count}
                selfCorrectionsCount={teaching_analysis.fluency_analysis.self_corrections_count}
                primaryColor={partner_config.branding.primary_color}
              />

              {/* Audio Highlights */}
              <AudioHighlights
                highlights={teaching_analysis.audio_highlights}
                audioUrl={audioUrl}
                primaryColor={partner_config.branding.primary_color}
                onTimestampClick={handleTimestampClick}
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
      if (response.status === 401) {
        return {
          props: {
            data: null,
            error: 'Invalid or expired access token.',
            token
          }
        };
      }

      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform score-based data to teaching-focused data
    // This would be done by the backend in a real implementation
    const teachingData = transformToTeachingData(data);

    return {
      props: {
        data: teachingData,
        token
      }
    };
  } catch (error) {
    console.error('Error fetching assessment results:', error);

    return {
      props: {
        data: null,
        error: 'Unable to load assessment results. The link may be invalid or expired.',
        token
      }
    };
  }
};

// Temporary transformation function - this would be done in the backend
function transformToTeachingData(scoreData: unknown): TeachingAssessmentData {
  // This is a placeholder transformation
  // In reality, the backend would provide the detailed teaching analysis
  const data = scoreData as Record<string, unknown>; // Type assertion for placeholder function
  return {
    assessment_id: data.assessment_id as string,
    partner_id: data.partner_id as string,
    student_name: data.student_name as string,
    student_email: data.student_email as string,
    assessment_date: data.assessment_date as string,
    partner_config: data.partner_config as { name: string; branding: { primary_color: string; secondary_color: string; accent_color: string; logo_url?: string } },
    audio_url: data.audio_url as string,
    teaching_analysis: {
      priority_areas: [
        {
          id: 'past_tense',
          icon: 'grammar',
          title: 'Practice Past Tense',
          description: 'Used present tense instead of past 6 times',
          examples: ['\"Yo fue\" → \"Yo fui\"', '\"Ella tiene\" → \"Ella tuvo\"']
        },
        {
          id: 'pauses',
          icon: 'fluency',
          title: 'Reduce Hesitation',
          description: '8 long pauses when searching for words',
          examples: ['Practice common phrases', 'Build vocabulary confidence']
        },
        {
          id: 'emotions',
          icon: 'vocabulary',
          title: 'Expand Emotion Words',
          description: 'Only used \"bueno\" and \"malo\"',
          examples: ['emocionante', 'frustrante', 'satisfactorio']
        }
      ],
      strengths: [
        {
          category: 'Complex Sentences',
          description: 'Uses sophisticated sentence structures with \"porque\" and \"aunque\"',
          examples: ['\"Aunque es difícil, porque me gusta...\"']
        },
        {
          category: 'Self-Monitoring',
          description: 'Self-corrects pronunciation showing good awareness',
          examples: ['4 successful self-corrections']
        },
        {
          category: 'Advanced Vocabulary',
          description: 'Uses sophisticated words appropriately',
          examples: ['perseverancia', 'desafío', 'específicamente']
        }
      ],
      grammar_analysis: {
        grammar_errors: [
          {
            type: 'Past Tense Conjugation',
            example: 'Yo fue al mercado',
            correction: 'Yo fui al mercado',
            count: 3
          },
          {
            type: 'Missing Articles',
            example: 'Voy a universidad',
            correction: 'Voy a la universidad',
            count: 5
          }
        ],
        grammar_strengths: [
          'Perfect use of subjunctive mood',
          'Good command of reflexive verbs',
          'Complex sentence structures'
        ],
        tense_usage: { present: 15, past: 3, future: 2, subjunctive: 4 },
        sentence_types: { simple: 8, compound: 5, complex: 7 },
        avg_sentence_length: 12.5
      },
      fluency_analysis: {
        words_per_minute: 145,
        total_pauses: 12,
        avg_pause_duration_ms: 1800,
        filled_pauses_count: 8,
        filler_words: [
          { word: 'este', count: 6 },
          { word: 'como', count: 4 },
          { word: 'umm', count: 3 }
        ],
        repetitions_count: 4,
        self_corrections_count: 4
      },
      vocabulary_analysis: {
        total_words: 180,
        unique_words: 95,
        type_token_ratio: 0.53,
        academic_words: ['principalmente', 'específicamente', 'perseverancia'],
        rare_words: ['desafío', 'perseverancia', 'meticulous'],
        repetitive_words: [
          { word: 'bueno', count: 7 },
          { word: 'malo', count: 3 },
          { word: 'muy', count: 5 }
        ],
        vocabulary_level: 'intermediate'
      },
      audio_highlights: [
        {
          timestamp: 23,
          type: 'strength',
          description: 'Excellent use of subjunctive mood',
          text: 'Espero que tengas un buen día',
          category: 'Grammar'
        },
        {
          timestamp: 75,
          type: 'improvement',
          description: 'Past tense confusion - good learning opportunity',
          text: 'Ayer yo fue al mercado',
          category: 'Grammar'
        },
        {
          timestamp: 123,
          type: 'example',
          description: 'Self-correction in action - great awareness!',
          text: 'Es muy... muy interesante',
          category: 'Fluency'
        }
      ],
      confidence_level: 'moderate'
    }
  };
}

export default TeachingFocusedResultsPage;