/**
 * Unit tests for UltimateAnalysisDashboard component
 * Tests integration of all analysis components and overall dashboard functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UltimateAnalysisDashboard } from '../../components/analysis/UltimateAnalysisDashboard';

// Mock all sub-components
jest.mock('../../components/analysis/PronunciationFeedback', () => ({
  PronunciationFeedback: ({ pronunciationData, onPhonemeSelect }: any) => (
    <div data-testid="pronunciation-feedback">
      <div>Pronunciation Score: {pronunciationData.overall_accuracy}%</div>
      <button onClick={() => onPhonemeSelect?.({ phoneme: '/θ/', severity: 'high' })}>
        Select Phoneme
      </button>
    </div>
  )
}));

jest.mock('../../components/analysis/FluencyAnalysis', () => ({
  FluencyAnalysis: ({ fluencyData, onWordSelect }: any) => (
    <div data-testid="fluency-analysis">
      <div>Fluency Score: {fluencyData.fluency_score}</div>
      <button onClick={() => onWordSelect?.({ word: 'test', start: 1.0, end: 1.5 })}>
        Select Word
      </button>
    </div>
  )
}));

jest.mock('../../components/analysis/GrammarExplanations', () => ({
  GrammarExplanations: ({ grammarData, onErrorSelect }: any) => (
    <div data-testid="grammar-explanations">
      <div>Grammar Errors: {grammarData.errors.length}</div>
      <button onClick={() => onErrorSelect?.({ errorType: 'subject_verb_agreement', severity: 'high' })}>
        Select Error
      </button>
    </div>
  )
}));

jest.mock('../../components/analysis/VocabularyInsights', () => ({
  VocabularyInsights: ({ vocabularyData, onWordSelect }: any) => (
    <div data-testid="vocabulary-insights">
      <div>Vocabulary Level: {vocabularyData.overall_level}</div>
      <button onClick={() => onWordSelect?.({ word: 'complex', level: 'C1' })}>
        Select Vocabulary
      </button>
    </div>
  )
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('UltimateAnalysisDashboard Component', () => {
  const mockAnalysisData = {
    grammar: {
      errors: [
        {
          error_type: 'subject_verb_agreement',
          original: 'I are going',
          corrected: 'I am going',
          severity: 'high',
          cefr_level: 'A1'
        }
      ],
      complexity_score: 3.2,
      overall_cefr_level: 'B1'
    },
    pronunciation: {
      overall_accuracy: 78.5,
      rhythm_score: 82.0,
      intonation_score: 75.0,
      problematic_sounds: [
        {
          phoneme: '/θ/',
          severity: 'high',
          word_examples: ['think', 'this']
        }
      ]
    },
    fluency: {
      fluency_score: 68.5,
      words_per_minute: 145,
      pause_stats: {
        total_pauses: 8,
        avg_pause_duration: 0.42
      },
      filler_words: { 'um': 3, 'uh': 2 }
    },
    vocabulary: {
      overall_level: 'B2',
      advanced_words: [
        { word: 'sophisticated', level: 'C1', frequency: 'low' }
      ],
      suggestions: ['Expand technical vocabulary']
    }
  };

  const mockAudioUrl = 'mock-audio-url.wav';
  const mockTranscriptionWords = [
    { word: 'I', start: 0.0, end: 0.2, confidence: 0.95 },
    { word: 'think', start: 0.5, end: 0.9, confidence: 0.88 },
    { word: 'this', start: 1.2, end: 1.6, confidence: 0.92 }
  ];
  const mockTranscriptionText = 'I think this is a test sentence';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all analysis components', () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check all main components are rendered
    expect(screen.getByTestId('pronunciation-feedback')).toBeInTheDocument();
    expect(screen.getByTestId('fluency-analysis')).toBeInTheDocument();
    expect(screen.getByTestId('grammar-explanations')).toBeInTheDocument();
    expect(screen.getByTestId('vocabulary-insights')).toBeInTheDocument();
  });

  test('displays overall performance summary', () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check overall scores
    expect(screen.getByText(/Pronunciation Score: 78.5%/)).toBeInTheDocument();
    expect(screen.getByText(/Fluency Score: 68.5/)).toBeInTheDocument();
    expect(screen.getByText(/Grammar Errors: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Vocabulary Level: B2/)).toBeInTheDocument();
  });

  test('handles tab navigation between analysis types', async () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check initial tab (should be overview)
    expect(screen.getByTestId('tab-overview')).toHaveClass('active');

    // Click pronunciation tab
    const pronunciationTab = screen.getByTestId('tab-pronunciation');
    fireEvent.click(pronunciationTab);

    await waitFor(() => {
      expect(screen.getByTestId('tab-pronunciation')).toHaveClass('active');
      expect(screen.getByTestId('tab-overview')).not.toHaveClass('active');
    });
  });

  test('shows comprehensive performance metrics', () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check performance metrics section
    expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();

    // Check individual metrics
    expect(screen.getByText(/Overall Performance/)).toBeInTheDocument();
    expect(screen.getByText(/Areas for Improvement/)).toBeInTheDocument();
    expect(screen.getByText(/Strengths/)).toBeInTheDocument();
  });

  test('handles cross-component interactions', async () => {
    const mockOnFocus = jest.fn();

    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
        onFocusArea={mockOnFocus}
      />
    );

    // Click on phoneme in pronunciation component
    const phonemeButton = screen.getByText(/Select Phoneme/);
    fireEvent.click(phonemeButton);

    await waitFor(() => {
      expect(mockOnFocus).toHaveBeenCalledWith({
        type: 'phoneme',
        data: { phoneme: '/θ/', severity: 'high' }
      });
    });
  });

  test('provides unified improvement recommendations', () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check improvement recommendations section
    expect(screen.getByTestId('improvement-recommendations')).toBeInTheDocument();

    // Should show prioritized recommendations from all analysis types
    expect(screen.getByText(/Priority Recommendations/)).toBeInTheDocument();
    expect(screen.getByText(/1\./)).toBeInTheDocument(); // First priority
    expect(screen.getByText(/2\./)).toBeInTheDocument(); // Second priority
  });

  test('displays progress tracking and historical data', () => {
    const mockHistoricalData = [
      {
        date: '2024-01-01',
        pronunciation: 75,
        fluency: 65,
        grammar: 8, // error count
        vocabulary: 'B1'
      },
      {
        date: '2024-01-15',
        pronunciation: 78.5,
        fluency: 68.5,
        grammar: 1,
        vocabulary: 'B2'
      }
    ];

    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
        historicalData={mockHistoricalData}
      />
    );

    // Check progress tracking section
    expect(screen.getByTestId('progress-tracking')).toBeInTheDocument();
    expect(screen.getByText(/Progress Over Time/)).toBeInTheDocument();

    // Should show improvement trends
    expect(screen.getByText(/Improving/)).toBeInTheDocument();
  });

  test('supports export functionality for comprehensive reports', () => {
    const mockOnExport = jest.fn();

    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
        onExport={mockOnExport}
      />
    );

    // Check export options
    const exportButton = screen.getByTestId('export-report');
    fireEvent.click(exportButton);

    // Should show export format options
    expect(screen.getByText(/Export Format/)).toBeInTheDocument();

    // Click PDF export
    const pdfExport = screen.getByText(/PDF Report/);
    fireEvent.click(pdfExport);

    expect(mockOnExport).toHaveBeenCalledWith({
      format: 'pdf',
      includeAudio: true,
      sections: ['grammar', 'pronunciation', 'fluency', 'vocabulary']
    });
  });

  test('handles practice mode integration', async () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
        practiceMode={true}
      />
    );

    // Check practice mode indicators
    expect(screen.getByTestId('practice-mode')).toBeInTheDocument();
    expect(screen.getByText(/Practice Mode Active/)).toBeInTheDocument();

    // Should show practice exercises
    expect(screen.getByText(/Recommended Exercises/)).toBeInTheDocument();
  });

  test('displays overall CEFR assessment', () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check CEFR assessment section
    expect(screen.getByTestId('cefr-assessment')).toBeInTheDocument();
    expect(screen.getByText(/Current Level: B1-B2/)).toBeInTheDocument();

    // Should show progression pathway
    expect(screen.getByText(/Next Level Goals/)).toBeInTheDocument();
  });

  test('provides real-time audio synchronization', async () => {
    const mockOnTimeUpdate = jest.fn();

    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
        onTimeUpdate={mockOnTimeUpdate}
        currentTime={1.2}
      />
    );

    // Should highlight current word across all components
    const currentWord = screen.getByTestId('current-word-indicator');
    expect(currentWord).toBeInTheDocument();
    expect(currentWord).toHaveTextContent('this'); // Word at 1.2s
  });

  test('handles error states gracefully', () => {
    const incompleteData = {
      grammar: null,
      pronunciation: mockAnalysisData.pronunciation,
      fluency: null,
      vocabulary: mockAnalysisData.vocabulary
    };

    render(
      <UltimateAnalysisDashboard
        analysisData={incompleteData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Should show error states for missing components
    expect(screen.getByText(/Grammar analysis unavailable/)).toBeInTheDocument();
    expect(screen.getByText(/Fluency analysis unavailable/)).toBeInTheDocument();

    // Should still show available analyses
    expect(screen.getByTestId('pronunciation-feedback')).toBeInTheDocument();
    expect(screen.getByTestId('vocabulary-insights')).toBeInTheDocument();
  });

  test('supports customizable dashboard layout', async () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
        customizable={true}
      />
    );

    // Check layout customization options
    const layoutButton = screen.getByTestId('customize-layout');
    fireEvent.click(layoutButton);

    await waitFor(() => {
      expect(screen.getByText(/Customize Dashboard/)).toBeInTheDocument();
      expect(screen.getByText(/Drag to reorder/)).toBeInTheDocument();
    });
  });

  test('integrates with learning management system', () => {
    const mockOnSave = jest.fn();

    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
        onSaveProgress={mockOnSave}
      />
    );

    // Save progress button
    const saveButton = screen.getByTestId('save-progress');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      timestamp: expect.any(String),
      analysisData: mockAnalysisData,
      overallScore: expect.any(Number)
    });
  });

  test('provides accessibility features', () => {
    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check ARIA labels and roles
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Check keyboard navigation
    const firstTab = screen.getByTestId('tab-overview');
    firstTab.focus();
    expect(document.activeElement).toBe(firstTab);
  });

  test('handles mobile responsive layout', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <UltimateAnalysisDashboard
        analysisData={mockAnalysisData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check mobile-specific elements
    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-container')).toHaveClass('mobile-layout');
  });
});

// Test dashboard utilities
describe('UltimateAnalysisDashboard Utils', () => {
  test('calculates overall performance score correctly', () => {
    const { calculateOverallScore } = require('../../components/analysis/UltimateAnalysisDashboard');

    const scores = {
      pronunciation: 78.5,
      fluency: 68.5,
      grammar: 85, // Based on error count
      vocabulary: 75 // Based on level
    };

    const overall = calculateOverallScore(scores);

    expect(overall).toBeCloseTo(76.75, 1); // Average of all scores
  });

  test('prioritizes recommendations correctly', () => {
    const { prioritizeRecommendations } = require('../../components/analysis/UltimateAnalysisDashboard');

    const recommendations = [
      { type: 'grammar', severity: 'high', impact: 'high' },
      { type: 'pronunciation', severity: 'medium', impact: 'high' },
      { type: 'fluency', severity: 'low', impact: 'medium' }
    ];

    const prioritized = prioritizeRecommendations(recommendations);

    expect(prioritized[0].type).toBe('grammar'); // High severity, high impact
    expect(prioritized[1].type).toBe('pronunciation'); // Medium severity, high impact
    expect(prioritized[2].type).toBe('fluency'); // Low severity, medium impact
  });

  test('generates progress trends correctly', () => {
    const { generateProgressTrends } = require('../../components/analysis/UltimateAnalysisDashboard');

    const historicalData = [
      { date: '2024-01-01', pronunciation: 70, fluency: 60 },
      { date: '2024-01-15', pronunciation: 75, fluency: 65 },
      { date: '2024-02-01', pronunciation: 78.5, fluency: 68.5 }
    ];

    const trends = generateProgressTrends(historicalData);

    expect(trends.pronunciation.direction).toBe('improving');
    expect(trends.fluency.direction).toBe('improving');
    expect(trends.pronunciation.rate).toBeGreaterThan(0);
  });
});