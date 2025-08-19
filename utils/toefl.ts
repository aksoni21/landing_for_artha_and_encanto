/**
 * TOEFL iBT (Test of English as a Foreign Language - Internet Based Test) utilities
 * TOEFL scores range from 0-120 (30 points each for Reading, Listening, Speaking, Writing)
 */

/**
 * Convert a 0-100 percentage score to TOEFL iBT scale (0-120)
 */
export function scoreToToefl(score: number): number {
  // Convert 0-100 score to 0-120 TOEFL scale
  const toeflScore = Math.round((score / 100) * 120);
  return Math.min(120, Math.max(0, toeflScore));
}

/**
 * Convert TOEFL score to proficiency level description
 */
export function toeflToLevel(toeflScore: number): string {
  if (toeflScore >= 114) return 'Proficient (C2)';
  if (toeflScore >= 95) return 'Advanced (C1)';
  if (toeflScore >= 72) return 'Upper Intermediate (B2)';
  if (toeflScore >= 43) return 'Intermediate (B1)';
  if (toeflScore >= 32) return 'Elementary (A2)';
  return 'Beginner (A1)';
}

/**
 * Get TOEFL band/range for a score
 */
export function getToeflBand(toeflScore: number): ToeflBand {
  if (toeflScore >= 114) return TOEFL_BANDS[5]; // Proficient
  if (toeflScore >= 95) return TOEFL_BANDS[4];  // Advanced
  if (toeflScore >= 72) return TOEFL_BANDS[3];  // Upper Intermediate
  if (toeflScore >= 43) return TOEFL_BANDS[2];  // Intermediate
  if (toeflScore >= 32) return TOEFL_BANDS[1];  // Elementary
  return TOEFL_BANDS[0]; // Beginner
}

/**
 * Convert CEFR level to approximate TOEFL score range
 */
export function cefrToToeflRange(cefr: string): { min: number; max: number } {
  switch (cefr) {
    case 'C2': return { min: 114, max: 120 };
    case 'C1': return { min: 95, max: 113 };
    case 'B2': return { min: 72, max: 94 };
    case 'B1': return { min: 43, max: 71 };
    case 'A2': return { min: 32, max: 42 };
    case 'A1': return { min: 0, max: 31 };
    default: return { min: 43, max: 71 }; // Default to B1
  }
}

/**
 * Calculate section scores (Reading, Listening, Speaking, Writing)
 * Each section is worth 30 points in TOEFL iBT
 */
export function calculateSectionScores(scores: {
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  discourse: number;
}): {
  reading: number;
  listening: number;
  speaking: number;
  writing: number;
  total: number;
} {
  // Map our component scores to TOEFL sections
  // This is an approximation based on skill correlation
  
  // Reading: primarily vocabulary and grammar
  const reading = Math.round(((scores.vocabulary + scores.grammar) / 2 / 100) * 30);
  
  // Listening: combination of vocabulary and discourse
  const listening = Math.round(((scores.vocabulary + scores.discourse) / 2 / 100) * 30);
  
  // Speaking: fluency, pronunciation, and discourse
  const speaking = Math.round(((scores.fluency + scores.pronunciation + scores.discourse) / 3 / 100) * 30);
  
  // Writing: grammar, vocabulary, and discourse
  const writing = Math.round(((scores.grammar + scores.vocabulary + scores.discourse) / 3 / 100) * 30);
  
  return {
    reading: Math.min(30, Math.max(0, reading)),
    listening: Math.min(30, Math.max(0, listening)),
    speaking: Math.min(30, Math.max(0, speaking)),
    writing: Math.min(30, Math.max(0, writing)),
    total: Math.min(120, reading + listening + speaking + writing)
  };
}

/**
 * TOEFL Score Bands with descriptions
 */
export const TOEFL_BANDS: ToeflBand[] = [
  {
    level: 'Beginner',
    cefrEquivalent: 'A1',
    minScore: 0,
    maxScore: 31,
    color: 'from-red-400 to-red-600',
    description: 'Basic understanding of English',
    recommendation: 'Focus on fundamental vocabulary and grammar'
  },
  {
    level: 'Elementary',
    cefrEquivalent: 'A2',
    minScore: 32,
    maxScore: 42,
    color: 'from-orange-400 to-orange-600',
    description: 'Can understand simple conversations',
    recommendation: 'Practice everyday communication'
  },
  {
    level: 'Intermediate',
    cefrEquivalent: 'B1',
    minScore: 43,
    maxScore: 71,
    color: 'from-yellow-400 to-yellow-600',
    description: 'Can communicate in familiar situations',
    recommendation: 'Expand vocabulary and complex structures'
  },
  {
    level: 'Upper Intermediate',
    cefrEquivalent: 'B2',
    minScore: 72,
    maxScore: 94,
    color: 'from-green-400 to-green-600',
    description: 'Can express ideas clearly and understand main ideas',
    recommendation: 'Practice academic and professional English'
  },
  {
    level: 'Advanced',
    cefrEquivalent: 'C1',
    minScore: 95,
    maxScore: 113,
    color: 'from-blue-400 to-blue-600',
    description: 'Can use English effectively for academic purposes',
    recommendation: 'Refine nuanced expression and comprehension'
  },
  {
    level: 'Proficient',
    cefrEquivalent: 'C2',
    minScore: 114,
    maxScore: 120,
    color: 'from-purple-400 to-purple-600',
    description: 'Near-native proficiency',
    recommendation: 'Maintain skills through regular practice'
  }
];

export interface ToeflBand {
  level: string;
  cefrEquivalent: string;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
  recommendation: string;
}

export type ToeflLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced' | 'Proficient';