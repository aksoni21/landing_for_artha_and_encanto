/**
 * Unit tests for FluencyAnalysis component
 * Tests speech timeline, pause visualization, and fluency metrics
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FluencyAnalysis } from '../../components/analysis/FluencyAnalysis';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    rect: ({ ...props }: any) => <rect {...props} />,
    circle: ({ ...props }: any) => <circle {...props} />,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options, ...props }: any) => (
    <div data-testid="fluency-timeline-chart" {...props}>
      Mock Chart: {JSON.stringify(data.labels)}
    </div>
  ),
}));

describe('FluencyAnalysis Component', () => {
  const mockFluencyData = {
    fluency_score: 68.5,
    words_per_minute: 145,
    pause_stats: {
      total_pauses: 8,
      avg_pause_duration: 0.42,
      long_pauses: 3,
      filled_pauses: 2
    },
    filler_words: {
      'um': 3,
      'uh': 2,
      'like': 1
    },
    pause_categories: [
      {
        type: 'lexical_retrieval',
        count: 4,
        avg_duration_ms: 380,
        examples: ["before 'computer'", "before 'science'"],
        severity: 'medium'
      },
      {
        type: 'planning_pause',
        count: 3,
        avg_duration_ms: 520,
        examples: ["before complex clause"],
        severity: 'high'
      },
      {
        type: 'breathing_pause',
        count: 1,
        avg_duration_ms: 200,
        examples: ["natural breathing"],
        severity: 'low'
      }
    ],
    fluency_breakdown_causes: [
      {
        cause: 'lexical_retrieval_difficulty',
        evidence: 'pauses before technical vocabulary',
        frequency: 'high',
        recommendation: 'expand technical vocabulary through practice'
      },
      {
        cause: 'planning_load_complex_structures',
        evidence: 'longer pauses before multi-clause sentences',
        frequency: 'medium',
        recommendation: 'practice clause combining fluently'
      }
    ],
    improvement_priorities: [
      'Reduce filler word usage (um, uh, like)',
      'Practice smooth transitions between clauses',
      'Build automaticity for high-frequency academic vocabulary'
    ],
    confidence_timeline: [
      { time: 0.5, confidence: 0.85 },
      { time: 1.0, confidence: 0.72 },
      { time: 1.5, confidence: 0.68 },
      { time: 2.0, confidence: 0.74 },
      { time: 2.5, confidence: 0.81 },
      { time: 3.0, confidence: 0.77 }
    ]
  };

  const mockTranscriptionWords = [
    { word: 'I', start: 0.0, end: 0.2, confidence: 0.95 },
    { word: 'think', start: 0.5, end: 0.9, confidence: 0.88 },
    { word: 'that', start: 1.2, end: 1.5, confidence: 0.92 },
    { word: 'um', start: 1.8, end: 2.1, confidence: 0.65 },
    { word: 'computer', start: 2.5, end: 3.1, confidence: 0.78 },
    { word: 'science', start: 3.4, end: 4.0, confidence: 0.82 },
    { word: 'is', start: 4.3, end: 4.5, confidence: 0.94 },
    { word: 'very', start: 4.8, end: 5.2, confidence: 0.91 },
    { word: 'interesting', start: 5.5, end: 6.3, confidence: 0.76 }
  ];

  const mockAudioDuration = 6.5;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders fluency score with appropriate color coding', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check fluency score display
    expect(screen.getByText(/68\.5/)).toBeInTheDocument();
    expect(screen.getByText(/Fluency Score/)).toBeInTheDocument();

    // Check score color coding (68.5 should be yellow/orange for "needs improvement")
    const scoreElement = screen.getByTestId('fluency-score');
    expect(scoreElement).toHaveClass('score-needs-improvement');
  });

  test('displays speech rate and timing metrics', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check words per minute
    expect(screen.getByText(/145/)).toBeInTheDocument();
    expect(screen.getByText(/words per minute/)).toBeInTheDocument();

    // Check pause statistics
    expect(screen.getByText(/8 pauses/)).toBeInTheDocument();
    expect(screen.getByText(/0\.42s avg/)).toBeInTheDocument();
  });

  test('visualizes pause timeline with interactive elements', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check timeline visualization
    expect(screen.getByTestId('speech-timeline')).toBeInTheDocument();

    // Check word blocks in timeline
    const wordBlocks = screen.getAllByTestId(/word-block/);
    expect(wordBlocks.length).toBeGreaterThan(0);

    // Check pause indicators
    const pauseIndicators = screen.getAllByTestId(/pause-indicator/);
    expect(pauseIndicators.length).toBeGreaterThan(0);
  });

  test('categorizes pauses with severity levels', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check pause categories section
    expect(screen.getByText(/Pause Analysis/)).toBeInTheDocument();

    // Check specific pause types
    expect(screen.getByText(/Lexical Retrieval/)).toBeInTheDocument();
    expect(screen.getByText(/Planning Pause/)).toBeInTheDocument();
    expect(screen.getByText(/Breathing Pause/)).toBeInTheDocument();

    // Check severity indicators
    expect(screen.getByText(/High Impact/)).toBeInTheDocument(); // Planning pause
    expect(screen.getByText(/Medium Impact/)).toBeInTheDocument(); // Lexical retrieval
    expect(screen.getByText(/Low Impact/)).toBeInTheDocument(); // Breathing
  });

  test('shows filler word analysis with frequency counts', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check filler words section
    expect(screen.getByText(/Filler Words/)).toBeInTheDocument();

    // Check individual filler word counts
    expect(screen.getByText(/um.*3/)).toBeInTheDocument();
    expect(screen.getByText(/uh.*2/)).toBeInTheDocument();
    expect(screen.getByText(/like.*1/)).toBeInTheDocument();

    // Check filler word highlighting in transcript
    const fillerWord = screen.getByTestId('word-um');
    expect(fillerWord).toHaveClass('filler-word');
  });

  test('displays confidence timeline with interactive chart', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check confidence timeline chart
    expect(screen.getByTestId('fluency-timeline-chart')).toBeInTheDocument();

    // Check confidence metrics
    expect(screen.getByText(/Confidence Timeline/)).toBeInTheDocument();
  });

  test('shows fluency breakdown causes with evidence', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check breakdown causes section
    expect(screen.getByText(/Fluency Breakdown Analysis/)).toBeInTheDocument();

    // Check specific causes
    expect(screen.getByText(/lexical_retrieval_difficulty/)).toBeInTheDocument();
    expect(screen.getByText(/planning_load_complex_structures/)).toBeInTheDocument();

    // Check evidence and recommendations
    expect(screen.getByText(/pauses before technical vocabulary/)).toBeInTheDocument();
    expect(screen.getByText(/expand technical vocabulary/)).toBeInTheDocument();
  });

  test('provides improvement priorities in actionable format', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check improvement priorities section
    expect(screen.getByText(/Improvement Priorities/)).toBeInTheDocument();

    const priorities = screen.getAllByTestId(/priority-item/);
    expect(priorities).toHaveLength(3);

    expect(priorities[0]).toHaveTextContent(/Reduce filler word usage/);
    expect(priorities[1]).toHaveTextContent(/Practice smooth transitions/);
    expect(priorities[2]).toHaveTextContent(/Build automaticity/);
  });

  test('handles timeline interaction and word selection', async () => {
    const mockOnWordSelect = jest.fn();

    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
        onWordSelect={mockOnWordSelect}
      />
    );

    // Click on a word in the timeline
    const wordBlock = screen.getByTestId('word-block-computer');
    fireEvent.click(wordBlock);

    expect(mockOnWordSelect).toHaveBeenCalledWith({
      word: 'computer',
      start: 2.5,
      end: 3.1,
      confidence: 0.78
    });
  });

  test('shows pause detail modal when pause is clicked', async () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Click on a pause indicator
    const pauseIndicator = screen.getAllByTestId(/pause-indicator/)[0];
    fireEvent.click(pauseIndicator);

    await waitFor(() => {
      expect(screen.getByText(/Pause Details/)).toBeInTheDocument();
      expect(screen.getByText(/Duration:/)).toBeInTheDocument();
      expect(screen.getByText(/Type:/)).toBeInTheDocument();
    });
  });

  test('filters timeline by confidence threshold', async () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Adjust confidence threshold slider
    const confidenceSlider = screen.getByTestId('confidence-threshold');
    fireEvent.change(confidenceSlider, { target: { value: '0.8' } });

    await waitFor(() => {
      // Words with confidence < 0.8 should be highlighted differently
      const lowConfidenceWords = screen.getAllByTestId(/word-block.*low-confidence/);
      expect(lowConfidenceWords.length).toBeGreaterThan(0);
    });
  });

  test('calculates and displays fluency metrics accurately', () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Check calculated metrics
    expect(screen.getByTestId('speaking-time')).toHaveTextContent(/5\.2s/); // Total speaking time
    expect(screen.getByTestId('pause-time')).toHaveTextContent(/1\.3s/); // Total pause time
    expect(screen.getByTestId('speech-ratio')).toHaveTextContent(/80%/); // Speaking time ratio
  });

  test('handles empty or minimal fluency data', () => {
    const minimalData = {
      fluency_score: 95,
      words_per_minute: 160,
      pause_stats: {
        total_pauses: 0,
        avg_pause_duration: 0,
        long_pauses: 0,
        filled_pauses: 0
      },
      filler_words: {},
      pause_categories: [],
      fluency_breakdown_causes: [],
      improvement_priorities: [],
      confidence_timeline: []
    };

    render(
      <FluencyAnalysis
        fluencyData={minimalData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
      />
    );

    // Should show positive feedback for excellent fluency
    expect(screen.getByText(/Excellent fluency!/)).toBeInTheDocument();
    expect(screen.getByText(/No significant fluency issues/)).toBeInTheDocument();
  });

  test('provides real-time feedback during playback', async () => {
    const mockOnTimeUpdate = jest.fn();

    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
        onTimeUpdate={mockOnTimeUpdate}
        currentTime={2.5}
      />
    );

    // Current word should be highlighted
    const currentWord = screen.getByTestId('word-block-computer');
    expect(currentWord).toHaveClass('current-word');

    // Progress indicator should be visible
    const progressIndicator = screen.getByTestId('timeline-progress');
    expect(progressIndicator).toBeInTheDocument();
  });

  test('exports fluency report data', () => {
    const mockOnExport = jest.fn();

    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
        onExport={mockOnExport}
      />
    );

    // Click export button
    const exportButton = screen.getByText(/Export Report/);
    fireEvent.click(exportButton);

    expect(mockOnExport).toHaveBeenCalledWith({
      type: 'fluency',
      data: mockFluencyData,
      format: 'pdf'
    });
  });

  test('integrates with practice mode', async () => {
    render(
      <FluencyAnalysis
        fluencyData={mockFluencyData}
        transcriptionWords={mockTranscriptionWords}
        audioDuration={mockAudioDuration}
        practiceMode={true}
      />
    );

    // Practice mode specific features
    expect(screen.getByText(/Practice Mode/)).toBeInTheDocument();
    expect(screen.getByText(/Focus Areas/)).toBeInTheDocument();

    // Practice exercises should be available
    const practiceButton = screen.getByText(/Practice Filler Reduction/);
    fireEvent.click(practiceButton);

    await waitFor(() => {
      expect(screen.getByText(/Filler Word Exercise/)).toBeInTheDocument();
    });
  });
});

// Test utilities for fluency analysis
describe('FluencyAnalysis Utils', () => {
  test('calculates pause statistics correctly', () => {
    const { calculatePauseStats } = require('../../components/analysis/FluencyAnalysis');

    const words = [
      { start: 0.0, end: 0.5 },
      { start: 1.0, end: 1.5 }, // 0.5s pause
      { start: 2.2, end: 2.8 }, // 0.7s pause
      { start: 3.0, end: 3.4 }  // 0.2s pause
    ];

    const stats = calculatePauseStats(words);

    expect(stats.total_pauses).toBe(3);
    expect(stats.avg_pause_duration).toBeCloseTo(0.47, 2);
    expect(stats.long_pauses).toBe(1); // >0.5s
  });

  test('identifies filler words correctly', () => {
    const { identifyFillerWords } = require('../../components/analysis/FluencyAnalysis');

    const words = [
      { word: 'I', start: 0.0, end: 0.2 },
      { word: 'um', start: 0.5, end: 0.8 },
      { word: 'think', start: 1.0, end: 1.3 },
      { word: 'uh', start: 1.5, end: 1.8 },
      { word: 'like', start: 2.0, end: 2.3 }
    ];

    const fillerCounts = identifyFillerWords(words);

    expect(fillerCounts.um).toBe(1);
    expect(fillerCounts.uh).toBe(1);
    expect(fillerCounts.like).toBe(1);
  });

  test('calculates speaking rate correctly', () => {
    const { calculateSpeakingRate } = require('../../components/analysis/FluencyAnalysis');

    const words = [
      { word: 'test', start: 0.0, end: 0.5 },
      { word: 'sentence', start: 1.0, end: 1.8 },
      { word: 'here', start: 2.0, end: 2.4 }
    ];
    const totalDuration = 3.0;

    const rate = calculateSpeakingRate(words, totalDuration);

    expect(rate).toBe(60); // 3 words in 3 seconds = 60 WPM
  });

  test('categorizes pause types based on context', () => {
    const { categorizePause } = require('../../components/analysis/FluencyAnalysis');

    const pauseContext = {
      duration: 0.6,
      precedingWord: 'um',
      followingWord: 'computer',
      speechRate: 150
    };

    const category = categorizePause(pauseContext);

    expect(category.type).toBe('lexical_retrieval');
    expect(category.severity).toBe('medium');
  });
});