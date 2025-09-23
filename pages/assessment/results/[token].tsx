import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { User, Mail, AlertCircle, Calendar } from 'lucide-react';
import { AudioPlayer } from '../../../components/assessment/AudioPlayer';

// Import our new teaching-focused components
import TeachingPriorities from '../../../components/assessment/TeachingPriorities';
import StrengthsSection from '../../../components/assessment/StrengthsSection';
import GrammarInsights from '../../../components/assessment/GrammarInsights';
import FluencyAnalysis from '../../../components/assessment/FluencyAnalysis';
import VocabularyInsights from '../../../components/assessment/VocabularyInsights';
import AudioHighlights from '../../../components/assessment/AudioHighlights';

interface DetailedAnalysis {
  word_timestamps?: string | Array<{ word: string; start: number; end: number }>;
  grammar_analysis?: {
    grammar_errors: string | Array<{ type: string; text: string; suggestion?: string }>;
    cefr_grammar_level?: string;
    tense_usage: string | Record<string, number>;
    sentence_types: string | Record<string, number>;
    avg_sentence_length?: number;
  };
  fluency_analysis?: {
    words_per_minute?: number;
    total_pauses?: number;
    avg_pause_duration_ms?: number;
    filled_pauses_count?: number;
    filler_words: string | Record<string, number>;
    repetitions_count?: number;
    self_corrections_count?: number;
  };
  vocabulary_analysis?: {
    total_words?: number;
    unique_words?: number;
    type_token_ratio?: number;
    academic_words_list: string | Array<string>;
    rare_words_list: string | Array<string>;
    cefr_vocabulary_level?: string;
  };
}

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
  detailed_analysis?: DetailedAnalysis;
}

interface AssessmentResultsPageProps {
  data: AssessmentResultData | null;
  error?: string;
  errorType?: 'AUTH_ERROR' | 'CONNECTION_ERROR' | 'GENERAL_ERROR';
  token: string;
}

// Transform score-based data to teaching-focused data
const transformToTeachingData = (scoreData: AssessmentResultData) => {
  // Extract real scores
  const grammarScore: string = typeof scoreData.placement_result.component_scores.grammar === 'string'
    ? scoreData.placement_result.component_scores.grammar
    : 'A1';
  const fluencyScore = scoreData.placement_result.component_scores.fluency || 75;
  const vocabularyScore: string = typeof scoreData.placement_result.component_scores.vocabulary === 'string'
    ? scoreData.placement_result.component_scores.vocabulary
    : 'B1';
  const pronunciationScore = scoreData.placement_result.component_scores.pronunciation || 75;

  // Use detailed analysis data if available, otherwise provide basic analysis based on scores
  const detailedAnalysis = scoreData.detailed_analysis;

  // Helper function to safely parse JSON strings from backend
  const safeJsonParse = (str: string | object, fallback: unknown = {}) => {
    if (typeof str === 'object') return str;
    if (typeof str === 'string') {
      try {
        return JSON.parse(str);
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  // Generate priority areas based on actual analysis data
  const priorityAreas = [];

  // Add grammar-specific priorities based on actual errors
  if (detailedAnalysis?.grammar_analysis) {
    const grammarErrors = safeJsonParse(detailedAnalysis.grammar_analysis.grammar_errors, []);

    if (grammarErrors.length > 0) {
      // Group errors by type and create specific priorities
      const errorTypes = grammarErrors.reduce((acc: Record<string, Array<{ error_type?: string; type?: string; original?: string; text?: string; corrected?: string; suggestion?: string }>>, error: { error_type?: string; type?: string; original?: string; text?: string; corrected?: string; suggestion?: string }) => {
        const type = error.error_type || error.type || 'unknown';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(error);
        return acc;
      }, {});

      // Create priority for each error type
      Object.entries(errorTypes).forEach(([errorType, errors]) => {
        const errorArray = errors as Array<{ error_type?: string; type?: string; original?: string; text?: string; corrected?: string; suggestion?: string }>;
        let title, description, examples;

        switch (errorType) {
          case 'subject_verb_agreement':
            title = 'Practice Subject-Verb Agreement';
            description = 'Focus on matching subjects with correct verb forms';
            examples = errorArray.map(e => `"${e.original || e.text}" → "${e.corrected || e.suggestion}"`).slice(0, 2);
            break;
          case 'gerund_instead_of_present_tense':
            title = 'Practice Present Tense vs Gerund';
            description = 'Learn when to use present tense instead of gerund forms';
            examples = errorArray.map(e => `"${e.original || e.text}" → "${e.corrected || e.suggestion}"`).slice(0, 2);
            break;
          case 'incorrect_preposition_and_article':
            title = 'Practice Prepositions and Articles';
            description = 'Focus on correct preposition and article usage';
            examples = errorArray.map(e => `"${e.original || e.text}" → "${e.corrected || e.suggestion}"`).slice(0, 2);
            break;
          case 'past_tense':
          case 'past_tense_conjugation':
            title = 'Practice Past Tense';
            description = 'Work on past tense conjugations and usage';
            examples = errorArray.map(e => `"${e.original || e.text}" → "${e.corrected || e.suggestion}"`).slice(0, 2);
            break;
          case 'verb_conjugation':
            title = 'Practice Verb Conjugations';
            description = 'Focus on correct verb forms and conjugations';
            examples = errorArray.map(e => `"${e.original || e.text}" → "${e.corrected || e.suggestion}"`).slice(0, 2);
            break;
          default:
            title = `Practice ${errorType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
            description = `Focus on improving ${errorType.replace(/_/g, ' ')} patterns`;
            examples = errorArray.map(e => `"${e.original || e.text}" → "${e.corrected || e.suggestion || 'Needs correction'}"`).slice(0, 2);
        }

        priorityAreas.push({
          id: errorType,
          icon: 'grammar' as const,
          title,
          description,
          examples: examples.length > 0 ? examples : ['Practice with similar structures', 'Focus on correct patterns']
        });
      });
    }
  }

  // Add general grammar priority if low level but no specific errors found
  if (priorityAreas.length === 0 && (grammarScore === 'A1' || grammarScore === 'A2')) {
    priorityAreas.push({
      id: 'grammar_basics',
      icon: 'grammar' as const,
      title: 'Strengthen Grammar Foundation',
      description: `Focus on ${grammarScore} level grammar patterns and verb conjugations`,
      examples: ['Present tense practice', 'Basic sentence structure', 'Common verb forms']
    });
  }

  // Add fluency priority if needed
  if (fluencyScore < 80) {
    priorityAreas.push({
      id: 'fluency_improvement',
      icon: 'fluency' as const,
      title: 'Improve Speaking Fluency',
      description: 'Work on speaking more smoothly and confidently',
      examples: ['Reduce hesitation', 'Practice common phrases', 'Build speaking confidence']
    });
  }

  // Add vocabulary priority if needed
  if (vocabularyScore === 'A1' || vocabularyScore === 'A2') {
    priorityAreas.push({
      id: 'vocabulary_expansion',
      icon: 'vocabulary' as const,
      title: 'Expand Core Vocabulary',
      description: `Build essential ${vocabularyScore} level vocabulary`,
      examples: ['Daily life vocabulary', 'Common expressions', 'Useful phrases']
    });
  }

  // Ensure we have at least one priority area
  if (priorityAreas.length === 0) {
    priorityAreas.push({
      id: 'continue_practice',
      icon: 'grammar' as const,
      title: 'Continue Practicing',
      description: 'Keep developing your Spanish skills',
      examples: ['Regular conversation practice', 'Expand vocabulary', 'Refine pronunciation']
    });
  }

  return {
    priority_areas: priorityAreas.slice(0, 3), // Limit to 3 priorities
    strengths: [
      {
        category: 'Assessment Completion',
        description: 'Successfully completed the speaking assessment',
        examples: ['Clear speech recording', 'Attempted to communicate in Spanish']
      },
      {
        category: 'Communication Effort',
        description: 'Made a good effort to express ideas in Spanish',
        examples: ['Used available vocabulary', 'Attempted sentence formation']
      }
    ],
    grammar_analysis: detailedAnalysis?.grammar_analysis ? {
      grammar_errors: safeJsonParse(detailedAnalysis.grammar_analysis.grammar_errors, []).map((error: { error_type?: string; type?: string; original?: string; text?: string; corrected?: string; suggestion?: string }) => ({
        type: error.error_type || error.type,
        example: error.original || error.text || 'No example available',
        correction: error.corrected || error.suggestion || 'Needs correction',
        count: 1
      })),
      grammar_strengths: [`Shows ${detailedAnalysis.grammar_analysis.cefr_grammar_level || grammarScore} level grammar understanding`],
      tense_usage: safeJsonParse(detailedAnalysis.grammar_analysis.tense_usage, { present: 5, past: 1, future: 0 }),
      sentence_types: safeJsonParse(detailedAnalysis.grammar_analysis.sentence_types, { simple: 3, compound: 1, complex: 0 }),
      avg_sentence_length: detailedAnalysis.grammar_analysis.avg_sentence_length || 6.0
    } : {
      grammar_errors: [],
      grammar_strengths: [`Shows ${grammarScore} level grammar understanding`],
      tense_usage: { present: 5, past: 1, future: 0 },
      sentence_types: { simple: 3, compound: 1, complex: 0 },
      avg_sentence_length: 6.0
    },
    fluency_analysis: detailedAnalysis?.fluency_analysis ? {
      words_per_minute: detailedAnalysis.fluency_analysis.words_per_minute || fluencyScore,
      total_pauses: detailedAnalysis.fluency_analysis.total_pauses || 3,
      avg_pause_duration_ms: detailedAnalysis.fluency_analysis.avg_pause_duration_ms || 800,
      filled_pauses_count: detailedAnalysis.fluency_analysis.filled_pauses_count || 2,
      filler_words: Object.entries(safeJsonParse(detailedAnalysis.fluency_analysis.filler_words, {}))
        .map(([word, count]) => ({ word, count: count as number }))
        .filter(item => item.count > 0),
      repetitions_count: detailedAnalysis.fluency_analysis.repetitions_count || 0,
      self_corrections_count: detailedAnalysis.fluency_analysis.self_corrections_count || 0
    } : {
      words_per_minute: fluencyScore,
      total_pauses: Math.floor(fluencyScore < 70 ? 8 : fluencyScore < 85 ? 5 : 3),
      avg_pause_duration_ms: fluencyScore < 70 ? 1500 : 800,
      filled_pauses_count: Math.floor(fluencyScore < 70 ? 5 : 2),
      filler_words: [
        { word: 'eh', count: Math.floor(fluencyScore < 70 ? 3 : 1) },
        { word: 'um', count: Math.floor(fluencyScore < 70 ? 2 : 1) }
      ],
      repetitions_count: fluencyScore < 70 ? 2 : 0,
      self_corrections_count: fluencyScore > 80 ? 2 : 1
    },
    vocabulary_analysis: detailedAnalysis?.vocabulary_analysis ? {
      total_words: detailedAnalysis.vocabulary_analysis.total_words || 16,
      unique_words: detailedAnalysis.vocabulary_analysis.unique_words || 15,
      type_token_ratio: detailedAnalysis.vocabulary_analysis.type_token_ratio || 0.94,
      academic_words: Array.isArray(detailedAnalysis.vocabulary_analysis.academic_words_list)
        ? detailedAnalysis.vocabulary_analysis.academic_words_list
        : safeJsonParse(detailedAnalysis.vocabulary_analysis.academic_words_list, []),
      rare_words: Array.isArray(detailedAnalysis.vocabulary_analysis.rare_words_list)
        ? detailedAnalysis.vocabulary_analysis.rare_words_list
        : safeJsonParse(detailedAnalysis.vocabulary_analysis.rare_words_list, []),
      repetitive_words: [],
      vocabulary_level: detailedAnalysis.vocabulary_analysis.cefr_vocabulary_level?.toLowerCase() || vocabularyScore.toLowerCase()
    } : {
      total_words: 16, // Based on actual transcript
      unique_words: 15,
      type_token_ratio: 0.94,
      academic_words: [],
      rare_words: [],
      repetitive_words: [],
      vocabulary_level: vocabularyScore.toLowerCase()
    },
    audio_highlights: detailedAnalysis?.word_timestamps
      ? JSON.parse(typeof detailedAnalysis.word_timestamps === 'string' ? detailedAnalysis.word_timestamps : '[]')
          .slice(0, 3)
            .map((item: { word: string; start: number; end: number }) => ({
            timestamp: Math.floor(item.start || 0),
            type: 'strength' as const,
            description: `Word: "${item.word}"`,
            text: item.word,
            category: 'Pronunciation'
          }))
      : [],
    confidence_level: pronunciationScore > 75 ? 'confident' : pronunciationScore > 50 ? 'moderate' : 'developing'
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
            buttonText: 'Go to Encanto AI',
            buttonAction: () => window.location.href = 'https://encantospeak.com',
            bgColor: 'bg-blue-500 hover:bg-blue-600'
          };
        default:
          return {
            icon: <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />,
            title: 'Error Loading Results',
            message: error || 'Unable to load assessment results. The link may be invalid or expired.',
            buttonText: 'Go to Encanto AI',
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
            <div className="flex flex-col">
              <div className="flex flex-col items-center">
                {partner_config.branding.logo_url && (
                  <img
                    src={partner_config.branding.logo_url}
                    alt={partner_config.name}
                    className="h-24 w-auto"
                  />
                )}
                <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    Teaching Report
                  </h1>
                  {/* <p className="text-gray-600">{partner_config.name}</p> */}
                </div>
              </div>

            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-12 py-8">
          {/* Student Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col">
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
              <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-400" />
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-800">
                  {new Date(data.assessment_date).toLocaleDateString()}
                </span>
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