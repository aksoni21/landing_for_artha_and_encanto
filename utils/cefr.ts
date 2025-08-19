/**
 * CEFR (Common European Framework of Reference) utilities
 */

export function scoreToCefr(score: number): string {
  if (score >= 85) return 'C2';
  if (score >= 75) return 'C1';
  if (score >= 65) return 'B2';
  if (score >= 55) return 'B1';
  if (score >= 45) return 'A2';
  return 'A1';
}

export function cefrToScore(cefr: string): number {
  switch (cefr) {
    case 'C2': return 90;
    case 'C1': return 80;
    case 'B2': return 70;
    case 'B1': return 60;
    case 'A2': return 50;
    case 'A1': return 40;
    default: return 60; // Default to B1
  }
}

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CefrLevel = typeof CEFR_LEVELS[number];