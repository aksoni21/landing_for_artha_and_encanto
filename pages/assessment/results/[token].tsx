import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { User, Mail, AlertCircle, Calendar } from 'lucide-react';
import { AudioPlayer } from '../../../components/assessment/AudioPlayer';

// Import our new teaching-focused components (commented out - not currently used)
// import TeachingPriorities from '../../../components/assessment/TeachingPriorities';
// import StrengthsSection from '../../../components/assessment/StrengthsSection';
// import GrammarInsights from '../../../components/assessment/GrammarInsights';
// import FluencyAnalysis from '../../../components/assessment/FluencyAnalysis';
// import VocabularyInsights from '../../../components/assessment/VocabularyInsights';
// import AudioHighlights from '../../../components/assessment/AudioHighlights';

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

// Transform score-based data to teaching-focused data (commented out - not used)
/* const transformToTeachingData = (scoreData: AssessmentResultData) => {
  // Extract real scores
  const grammarScore: string = typeof scoreData.placement_result.component_scores.grammar === 'string'
    ? scoreData.placement_result.component_scores.grammar
    : '';
  const fluencyScore = scoreData.placement_result.component_scores.fluency || '';
  const vocabularyScore: string = typeof scoreData.placement_result.component_scores.vocabulary === 'string'
    ? scoreData.placement_result.component_scores.vocabulary
    : '';
  const pronunciationScore = scoreData.placement_result.component_scores.pronunciation || '';

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
}; */

// Helper function to render mistakes section
const renderMistakes = (data: AssessmentResultData) => {
  const detailedAnalysis = data.detailed_analysis;
  const allMistakes: Array<{
    type: string;
    category: string;
    original: string;
    correction: string;
    description?: string;
  }> = [];

  // Helper function to safely parse JSON strings from backend
  const safeJsonParse = (str: string | object | Array<unknown>, fallback: unknown = []) => {
    if (Array.isArray(str)) return str;
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

  // Extract grammar mistakes
  if (detailedAnalysis?.grammar_analysis?.grammar_errors) {
    const grammarErrors = safeJsonParse(detailedAnalysis.grammar_analysis.grammar_errors, []);
    (grammarErrors as Array<{error_type?: string; type?: string; original?: string; text?: string; corrected?: string; suggestion?: string; description?: string}>).forEach((error) => {
      allMistakes.push({
        type: error.error_type || error.type || 'Grammar Error',
        category: 'Grammar',
        original: error.original || error.text || 'N/A',
        correction: error.corrected || error.suggestion || 'Needs correction',
        description: error.description
      });
    });
  }

  // Extract fluency issues (filler words, repetitions)
  if (detailedAnalysis?.fluency_analysis) {
    const fluencyAnalysis = detailedAnalysis.fluency_analysis;

    // Filler words
    if (fluencyAnalysis.filler_words) {
      const fillerWords = safeJsonParse(fluencyAnalysis.filler_words, {});
      Object.entries(fillerWords).forEach(([word, count]) => {
        if ((count as number) > 2) { // Only show if used frequently
          allMistakes.push({
            type: 'Filler Words',
            category: 'Fluency',
            original: `"${word}" used ${count} times`,
            correction: 'Try to pause silently instead of using filler words',
            description: 'Using too many filler words can interrupt the flow of speech'
          });
        }
      });
    }

    // Excessive repetitions
    if (fluencyAnalysis.repetitions_count && fluencyAnalysis.repetitions_count > 2) {
      allMistakes.push({
        type: 'Word Repetitions',
        category: 'Fluency',
        original: `${fluencyAnalysis.repetitions_count} repetitions detected`,
        correction: 'Take your time to think before speaking to reduce repetitions',
        description: 'Frequent repetitions can indicate uncertainty or lack of vocabulary'
      });
    }
  }

  // Extract vocabulary issues
  if (detailedAnalysis?.vocabulary_analysis) {
    const vocabAnalysis = detailedAnalysis.vocabulary_analysis;

    // Low vocabulary diversity
    if (vocabAnalysis.type_token_ratio && vocabAnalysis.type_token_ratio < 0.7) {
      allMistakes.push({
        type: 'Limited Vocabulary Variety',
        category: 'Vocabulary',
        original: `Repeated similar words frequently`,
        correction: 'Try using synonyms and varied expressions',
        description: 'Using more diverse vocabulary will make your speech more engaging'
      });
    }
  }

  // If no specific mistakes found, provide general feedback
  if (allMistakes.length === 0) {
    const overallScore = data.placement_result.overall_score;
    if (overallScore < 70) {
      allMistakes.push({
        type: 'General Improvement Areas',
        category: 'Overall',
        original: 'Several areas need attention',
        correction: 'Focus on basic grammar patterns and vocabulary building',
        description: 'Continue practicing to build confidence and fluency'
      });
    }
  }

  if (allMistakes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <p className="text-lg font-medium text-gray-700 mb-2">Excellent work!</p>
        <p className="text-gray-600">No significant mistakes were detected in your Spanish speech. Keep up the great work!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allMistakes.map((mistake, index) => (
        <div
          key={index}
          className="border border-red-200 rounded-lg p-4 bg-red-50"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {mistake.category}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">{mistake.type}</h4>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-red-700">What you said: </span>
                  <span className="text-sm text-red-600 font-mono bg-red-100 px-2 py-1 rounded">
                    {mistake.original}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-green-700">Better way: </span>
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
  );
};

// Helper function to render strengths section
const renderStrengths = (data: AssessmentResultData) => {
  const detailedAnalysis = data.detailed_analysis;
  const componentScores = data.placement_result.component_scores;
  const overallScore = data.placement_result.overall_score;
  const transcript = data.transcript || '';

  const strengths: Array<{
    area: string;
    description: string;
    example: string;
    level: 'good' | 'excellent' | 'outstanding';
  }> = [];

  // Helper function to safely parse JSON strings from backend
  const safeJsonParse = (str: string | object | Array<unknown>, fallback: unknown = []) => {
    if (Array.isArray(str)) return str;
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

  // Grammar strengths
  if (componentScores.grammar >= 70) {
    const level = componentScores.grammar >= 90 ? 'outstanding' : componentScores.grammar >= 80 ? 'excellent' : 'good';
    strengths.push({
      area: 'Grammar Understanding',
      description: 'You demonstrate solid grammatical knowledge in your speech',
      example: transcript.length > 20
        ? `Your sentence structure in "${transcript.slice(0, 50)}..." shows good grammar control`
        : 'You used correct verb forms and sentence structures',
      level
    });
  }

  // Pronunciation strengths
  if (componentScores.pronunciation >= 70) {
    const level = componentScores.pronunciation >= 90 ? 'outstanding' : componentScores.pronunciation >= 80 ? 'excellent' : 'good';
    strengths.push({
      area: 'Clear Pronunciation',
      description: 'Your Spanish pronunciation is quite clear and understandable',
      example: 'Most of your words were pronounced correctly, making you easy to understand',
      level
    });
  }

  // Fluency strengths
  if (componentScores.fluency >= 70) {
    const level = componentScores.fluency >= 90 ? 'outstanding' : componentScores.fluency >= 80 ? 'excellent' : 'good';
    const wordsPerMinute = detailedAnalysis?.fluency_analysis?.words_per_minute || componentScores.fluency;
    strengths.push({
      area: 'Speaking Fluency',
      description: 'You speak at a natural pace without too many hesitations',
      example: `Your speaking rhythm of approximately ${Math.round(wordsPerMinute)} words per minute is quite natural`,
      level
    });
  }

  // Vocabulary strengths
  if (componentScores.vocabulary >= 70) {
    const level = componentScores.vocabulary >= 90 ? 'outstanding' : componentScores.vocabulary >= 80 ? 'excellent' : 'good';
    const uniqueWords = detailedAnalysis?.vocabulary_analysis?.unique_words || 'several';
    strengths.push({
      area: 'Vocabulary Usage',
      description: 'You used appropriate vocabulary for your level',
      example: `You demonstrated knowledge of ${uniqueWords} different Spanish words and expressions`,
      level
    });
  }

  // Confidence/effort strengths
  if (componentScores.confidence >= 60) {
    const level = componentScores.confidence >= 90 ? 'outstanding' : componentScores.confidence >= 75 ? 'excellent' : 'good';
    strengths.push({
      area: 'Communication Confidence',
      description: 'You showed good confidence in expressing yourself in Spanish',
      example: 'You completed the full assessment without major hesitation, showing willingness to communicate',
      level
    });
  }

  // Specific vocabulary achievements
  if (detailedAnalysis?.vocabulary_analysis?.academic_words_list) {
    const academicWords = safeJsonParse(detailedAnalysis.vocabulary_analysis.academic_words_list, []);
    if (academicWords.length > 0) {
      strengths.push({
        area: 'Advanced Vocabulary',
        description: 'You used some sophisticated vocabulary words',
        example: `Words like "${academicWords.slice(0, 3).join('", "')}" show advanced vocabulary knowledge`,
        level: 'excellent'
      });
    }
  }

  // Grammar achievements
  if (detailedAnalysis?.grammar_analysis?.tense_usage) {
    const tenseUsage = safeJsonParse(detailedAnalysis.grammar_analysis.tense_usage, {});
    const tenseCount = Object.keys(tenseUsage).length;
    if (tenseCount > 1) {
      const tenses = Object.keys(tenseUsage).join(', ');
      strengths.push({
        area: 'Verb Tense Variety',
        description: 'You successfully used different verb tenses',
        example: `You correctly used ${tenses} tenses, showing good grammatical range`,
        level: 'good'
      });
    }
  }

  // Self-correction ability
  if (detailedAnalysis?.fluency_analysis?.self_corrections_count && detailedAnalysis.fluency_analysis.self_corrections_count > 0) {
    strengths.push({
      area: 'Self-Correction Skills',
      description: 'You caught and corrected your own mistakes while speaking',
      example: `You made ${detailedAnalysis.fluency_analysis.self_corrections_count} self-corrections, showing good language awareness`,
      level: 'excellent'
    });
  }

  // Overall achievement
  if (overallScore >= 80) {
    strengths.push({
      area: 'Overall Spanish Proficiency',
      description: 'Your overall Spanish level is quite impressive',
      example: `Your overall score of ${overallScore}/100 demonstrates strong Spanish communication skills`,
      level: 'outstanding'
    });
  }

  // If no specific strengths found, provide encouraging general feedback
  if (strengths.length === 0) {
    strengths.push({
      area: 'Courage to Communicate',
      description: 'You took the initiative to speak in Spanish',
      example: 'Completing this assessment shows your commitment to learning and improving your Spanish',
      level: 'good'
    });
  }

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
    <div className="space-y-4">
      {strengths.map((strength, index) => (
        <div
          key={index}
          className={`border rounded-lg p-4 ${getLevelColor(strength.level)}`}
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
  );
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

  // Transform the score-based data to teaching-focused format (commented out - not used)
  // const teachingData = transformToTeachingData(data);

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

          {/* COMMENTED OUT - DETAILED ANALYSIS SECTIONS */}
          {/*
          <TeachingPriorities
            priorities={teachingData.priority_areas}
            primaryColor={partner_config.branding.primary_color}
          />

          <StrengthsSection
            strengths={teachingData.strengths}
            overallConfidenceLevel={teachingData.confidence_level}
            primaryColor={partner_config.branding.primary_color}
          />

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <GrammarInsights
                grammarErrors={teachingData.grammar_analysis.grammar_errors}
                grammarStrengths={teachingData.grammar_analysis.grammar_strengths}
                tenseUsage={teachingData.grammar_analysis.tense_usage}
                sentenceTypes={teachingData.grammar_analysis.sentence_types}
                averageSentenceLength={teachingData.grammar_analysis.avg_sentence_length}
                primaryColor={partner_config.branding.primary_color}
              />

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

            <div className="space-y-8">
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

              <AudioHighlights
                highlights={teachingData.audio_highlights}
                audioUrl={audioUrl}
                primaryColor={partner_config.branding.primary_color}
                onTimestampClick={(timestamp) => {
                  console.log('Seeking to:', timestamp);
                }}
              />
            </div>
          </div>
          */}

          {/* NEW SIMPLIFIED SECTIONS */}

          {/* Mistakes Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-semibold text-gray-800">Areas for Improvement</h2>
            </div>

            {renderMistakes(data)}
          </motion.div>

          {/* Strengths Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl">⭐</span>
              <h2 className="text-xl font-semibold text-gray-800">What You&apos;re Doing Well</h2>
            </div>

            {renderStrengths(data)}
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