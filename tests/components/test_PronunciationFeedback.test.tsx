/**
 * Unit tests for PronunciationFeedback component
 * Tests phoneme visualization, L1 interference patterns, and audio playback
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PronunciationFeedback } from '../../components/analysis/PronunciationFeedback';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock audio playback
const mockPlayAudio = jest.fn();
const mockPauseAudio = jest.fn();

// Mock HTML5 Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: mockPlayAudio,
  pause: mockPauseAudio,
  currentTime: 0,
  duration: 10,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

describe('PronunciationFeedback Component', () => {
  const mockPronunciationData = {
    overall_accuracy: 78.5,
    rhythm_score: 82.0,
    intonation_score: 75.0,
    problematic_sounds: [
      {
        phoneme: '/θ/',
        word_examples: ['think', 'this', 'through'],
        acoustic_issue: 'substituted with /s/ or /t/ sound',
        improvement_tip: 'Place tongue between teeth for /θ/ sound',
        severity: 'high',
        audio_segments: [
          { word: 'think', start: 1.2, end: 1.8 },
          { word: 'this', start: 3.5, end: 4.0 }
        ]
      },
      {
        phoneme: '/v/',
        word_examples: ['very', 'visit'],
        acoustic_issue: 'insufficient lip-teeth contact',
        improvement_tip: 'Ensure lower lip touches upper teeth',
        severity: 'medium',
        audio_segments: [
          { word: 'very', start: 2.1, end: 2.6 }
        ]
      }
    ],
    l1_interference_patterns: [
      {
        pattern: 'Spanish /b/ → English /v/',
        examples: ['very', 'visit'],
        frequency: 'high',
        acoustic_evidence: 'Lack of fricative quality in /v/ production',
        improvement_strategy: 'Practice lip-teeth contact exercises'
      }
    ],
    stress_errors: [
      {
        word: 'computer',
        incorrect_stress: 'COM-pu-ter',
        correct_stress: 'com-PU-ter',
        impact: 'intelligibility'
      }
    ],
    improvement_priorities: [
      'Focus on /θ/ sound production in \'think\' and \'this\'',
      'Practice /v/ sound with proper lip-teeth contact',
      'Work on word stress patterns, especially in technical vocabulary'
    ]
  };

  const mockAudioUrl = 'mock-audio-url.wav';
  const mockTranscriptionWords = [
    { word: 'I', start: 0.0, end: 0.2 },
    { word: 'think', start: 1.2, end: 1.8 },
    { word: 'this', start: 3.5, end: 4.0 },
    { word: 'is', start: 4.2, end: 4.5 },
    { word: 'very', start: 2.1, end: 2.6 },
    { word: 'good', start: 4.8, end: 5.2 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders pronunciation feedback with overall scores', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check overall accuracy score
    expect(screen.getByText(/78\.5%/)).toBeInTheDocument();
    expect(screen.getByText(/Overall Accuracy/)).toBeInTheDocument();

    // Check rhythm and intonation scores
    expect(screen.getByText(/82%/)).toBeInTheDocument(); // Rhythm
    expect(screen.getByText(/75%/)).toBeInTheDocument(); // Intonation
  });

  test('displays problematic sounds with severity indicators', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check phoneme display
    expect(screen.getByText('/θ/')).toBeInTheDocument();
    expect(screen.getByText('/v/')).toBeInTheDocument();

    // Check severity indicators
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority')).toBeInTheDocument();

    // Check word examples
    expect(screen.getByText(/think/)).toBeInTheDocument();
    expect(screen.getByText(/this/)).toBeInTheDocument();
    expect(screen.getByText(/very/)).toBeInTheDocument();
  });

  test('shows improvement tips for each problematic sound', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check improvement tips
    expect(screen.getByText(/Place tongue between teeth/)).toBeInTheDocument();
    expect(screen.getByText(/Ensure lower lip touches upper teeth/)).toBeInTheDocument();
  });

  test('displays L1 interference patterns with acoustic evidence', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check L1 interference section
    expect(screen.getByText(/L1 Interference Patterns/)).toBeInTheDocument();
    expect(screen.getByText(/Spanish \/b\/ → English \/v\//)).toBeInTheDocument();
    expect(screen.getByText(/High Frequency/)).toBeInTheDocument();
    expect(screen.getByText(/Lack of fricative quality/)).toBeInTheDocument();
  });

  test('handles audio playback for specific segments', async () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Find and click play button for 'think'
    const playButtons = screen.getAllByLabelText(/Play audio for/);
    const thinkPlayButton = playButtons.find(button =>
      button.getAttribute('aria-label')?.includes('think')
    );

    expect(thinkPlayButton).toBeInTheDocument();

    if (thinkPlayButton) {
      fireEvent.click(thinkPlayButton);

      await waitFor(() => {
        expect(mockPlayAudio).toHaveBeenCalled();
      });
    }
  });

  test('highlights words in transcript when playing audio', async () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Find word 'think' in transcript
    const thinkWord = screen.getByTestId('word-think');
    expect(thinkWord).toBeInTheDocument();

    // Click to play audio segment
    fireEvent.click(thinkWord);

    // Check if word gets highlighted class
    await waitFor(() => {
      expect(thinkWord).toHaveClass('playing');
    });
  });

  test('shows stress error corrections', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check stress errors section
    expect(screen.getByText(/Word Stress Errors/)).toBeInTheDocument();
    expect(screen.getByText(/computer/)).toBeInTheDocument();
    expect(screen.getByText(/COM-pu-ter/)).toBeInTheDocument(); // Incorrect
    expect(screen.getByText(/com-PU-ter/)).toBeInTheDocument(); // Correct
  });

  test('displays improvement priorities in order', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check improvement priorities section
    expect(screen.getByText(/Improvement Priorities/)).toBeInTheDocument();

    const priorities = screen.getAllByTestId(/priority-item/);
    expect(priorities).toHaveLength(3);

    expect(priorities[0]).toHaveTextContent(/Focus on \/θ\/ sound production/);
    expect(priorities[1]).toHaveTextContent(/Practice \/v\/ sound/);
    expect(priorities[2]).toHaveTextContent(/Work on word stress patterns/);
  });

  test('handles missing audio gracefully', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={null}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Should still render content without audio features
    expect(screen.getByText(/Overall Accuracy/)).toBeInTheDocument();
    expect(screen.getByText('/θ/')).toBeInTheDocument();

    // Audio play buttons should be disabled
    const playButtons = screen.queryAllByLabelText(/Play audio for/);
    playButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  test('handles empty problematic sounds array', () => {
    const emptyData = {
      ...mockPronunciationData,
      problematic_sounds: [],
      l1_interference_patterns: [],
      stress_errors: [],
      improvement_priorities: []
    };

    render(
      <PronunciationFeedback
        pronunciationData={emptyData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Should show positive feedback when no issues found
    expect(screen.getByText(/Great pronunciation!/)).toBeInTheDocument();
    expect(screen.getByText(/No major pronunciation issues detected/)).toBeInTheDocument();
  });

  test('toggles detailed view for phoneme issues', async () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Find the first phoneme card
    const phonemeCard = screen.getByTestId('phoneme-θ');

    // Initially, detailed view should be collapsed
    expect(screen.queryByText(/Acoustic Analysis/)).not.toBeInTheDocument();

    // Click to expand
    const expandButton = screen.getByLabelText(/Show details for \/θ\//);
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText(/Acoustic Analysis/)).toBeInTheDocument();
      expect(screen.getByText(/substituted with \/s\/ or \/t\/ sound/)).toBeInTheDocument();
    });
  });

  test('provides practice exercises for each phoneme', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check for practice exercise section
    expect(screen.getByText(/Practice Exercises/)).toBeInTheDocument();

    // Should have exercises for each problematic phoneme
    expect(screen.getByTestId('exercise-θ')).toBeInTheDocument();
    expect(screen.getByTestId('exercise-v')).toBeInTheDocument();
  });

  test('shows visual feedback for pronunciation accuracy', () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check for visual indicators
    const accuracyMeter = screen.getByTestId('accuracy-meter');
    expect(accuracyMeter).toBeInTheDocument();

    // Should show appropriate color coding
    expect(accuracyMeter).toHaveClass('accuracy-good'); // 78.5% is good
  });

  test('filters phonemes by severity level', async () => {
    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
      />
    );

    // Check initial state - should show all phonemes
    expect(screen.getByText('/θ/')).toBeInTheDocument();
    expect(screen.getByText('/v/')).toBeInTheDocument();

    // Filter by high priority only
    const highPriorityFilter = screen.getByLabelText(/Show high priority only/);
    fireEvent.click(highPriorityFilter);

    await waitFor(() => {
      expect(screen.getByText('/θ/')).toBeInTheDocument(); // High priority
      expect(screen.queryByText('/v/')).not.toBeInTheDocument(); // Medium priority, should be hidden
    });
  });

  test('integrates with overall analysis dashboard', () => {
    const mockOnPhonemeSelect = jest.fn();

    render(
      <PronunciationFeedback
        pronunciationData={mockPronunciationData}
        audioUrl={mockAudioUrl}
        transcriptionWords={mockTranscriptionWords}
        onPhonemeSelect={mockOnPhonemeSelect}
      />
    );

    // Click on a phoneme
    const phonemeButton = screen.getByTestId('phoneme-θ');
    fireEvent.click(phonemeButton);

    expect(mockOnPhonemeSelect).toHaveBeenCalledWith({
      phoneme: '/θ/',
      severity: 'high',
      examples: ['think', 'this', 'through']
    });
  });
});

// Test utilities for pronunciation feedback
describe('PronunciationFeedback Utils', () => {
  test('calculates severity color correctly', () => {
    const { getSeverityColor } = require('../../components/analysis/PronunciationFeedback');

    expect(getSeverityColor('high')).toBe('#ef4444'); // Red
    expect(getSeverityColor('medium')).toBe('#f59e0b'); // Orange
    expect(getSeverityColor('low')).toBe('#10b981'); // Green
  });

  test('formats phoneme for display', () => {
    const { formatPhoneme } = require('../../components/analysis/PronunciationFeedback');

    expect(formatPhoneme('/θ/')).toBe('θ');
    expect(formatPhoneme('θ')).toBe('θ');
    expect(formatPhoneme('/v/')).toBe('v');
  });

  test('groups audio segments by phoneme', () => {
    const { groupSegmentsByPhoneme } = require('../../components/analysis/PronunciationFeedback');

    const segments = [
      { phoneme: '/θ/', word: 'think', start: 1.0, end: 1.5 },
      { phoneme: '/θ/', word: 'this', start: 2.0, end: 2.3 },
      { phoneme: '/v/', word: 'very', start: 3.0, end: 3.4 }
    ];

    const grouped = groupSegmentsByPhoneme(segments);

    expect(grouped['/θ/']).toHaveLength(2);
    expect(grouped['/v/']).toHaveLength(1);
  });
});