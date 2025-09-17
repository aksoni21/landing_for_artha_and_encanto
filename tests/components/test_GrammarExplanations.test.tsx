/**
 * Unit tests for GrammarExplanations component
 * Tests error visualization, practice mode, and pedagogical explanations
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GrammarExplanations } from '../../components/analysis/GrammarExplanations';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock syntax highlighting
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, ...props }: any) => (
    <pre data-testid="syntax-highlight" {...props}>{children}</pre>
  ),
}));

describe('GrammarExplanations Component', () => {
  const mockGrammarData = {
    errors: [
      {
        error_type: 'subject_verb_agreement',
        original: 'I are going to school',
        corrected: 'I am going to school',
        explanation: 'The subject "I" requires the verb "am", not "are". This is a fundamental rule of subject-verb agreement in English.',
        severity: 'high',
        cefr_level: 'A1',
        practice_suggestion: 'Practice conjugating the verb "to be" with different subjects (I am, you are, he/she/it is, we are, they are)',
        l1_specific: true,
        pedagogical_note: 'This is a common error for Spanish speakers because Spanish uses "soy" for "I am" which sounds similar to "are"',
        grammar_rule: {
          rule_name: 'Subject-Verb Agreement',
          rule_description: 'The verb must agree with its subject in number and person',
          examples: [
            { correct: 'I am happy', incorrect: 'I are happy' },
            { correct: 'She is tall', incorrect: 'She are tall' }
          ]
        }
      },
      {
        error_type: 'article_usage',
        original: 'I want to study the computer science',
        corrected: 'I want to study computer science',
        explanation: 'Academic subjects and fields of study typically do not require the definite article "the"',
        severity: 'medium',
        cefr_level: 'B1',
        practice_suggestion: 'Learn which subjects use articles (the history of Rome) vs. which don\'t (computer science, mathematics)',
        l1_specific: false,
        pedagogical_note: 'Article usage with academic subjects is one of the most challenging aspects for learners',
        grammar_rule: {
          rule_name: 'Article Usage with Academic Subjects',
          rule_description: 'Most academic subjects do not use definite articles',
          examples: [
            { correct: 'I study mathematics', incorrect: 'I study the mathematics' },
            { correct: 'She loves physics', incorrect: 'She loves the physics' }
          ]
        }
      },
      {
        error_type: 'preposition_usage',
        original: 'I am interested on this topic',
        corrected: 'I am interested in this topic',
        explanation: 'The adjective "interested" is followed by the preposition "in", not "on"',
        severity: 'medium',
        cefr_level: 'A2',
        practice_suggestion: 'Memorize common adjective-preposition combinations: interested in, good at, afraid of',
        l1_specific: true,
        pedagogical_note: 'Spanish speakers often use "en" (on) instead of "in" due to direct translation',
        grammar_rule: {
          rule_name: 'Adjective-Preposition Combinations',
          rule_description: 'Certain adjectives are always followed by specific prepositions',
          examples: [
            { correct: 'good at math', incorrect: 'good in math' },
            { correct: 'afraid of spiders', incorrect: 'afraid from spiders' }
          ]
        }
      }
    ],
    complexity_score: 3.8,
    tense_usage: {
      present: 5,
      past: 2,
      future: 3,
      present_perfect: 1
    },
    sentence_types: {
      simple: 4,
      compound: 2,
      complex: 3
    },
    overall_cefr_level: 'B1'
  };

  const mockTranscriptionText = 'I are going to school. I want to study the computer science because I am interested on this topic.';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders grammar errors with severity indicators', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check error count display
    expect(screen.getByText(/3 grammar issues found/)).toBeInTheDocument();

    // Check individual errors
    expect(screen.getByText(/Subject-Verb Agreement/)).toBeInTheDocument();
    expect(screen.getByText(/Article Usage/)).toBeInTheDocument();
    expect(screen.getByText(/Preposition Usage/)).toBeInTheDocument();

    // Check severity indicators
    expect(screen.getByText(/High Priority/)).toBeInTheDocument();
    expect(screen.getAllByText(/Medium Priority/)).toHaveLength(2);
  });

  test('displays before/after corrections with highlighting', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check original vs corrected text
    expect(screen.getByText(/I are going/)).toBeInTheDocument();
    expect(screen.getByText(/I am going/)).toBeInTheDocument();

    expect(screen.getByText(/the computer science/)).toBeInTheDocument();
    expect(screen.getByText(/computer science/)).toBeInTheDocument();

    // Check highlighting classes
    const originalText = screen.getByTestId('original-text-0');
    const correctedText = screen.getByTestId('corrected-text-0');

    expect(originalText).toHaveClass('error-highlight');
    expect(correctedText).toHaveClass('correction-highlight');
  });

  test('shows detailed explanations with grammar rules', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check explanation text
    expect(screen.getByText(/The subject "I" requires the verb "am"/)).toBeInTheDocument();
    expect(screen.getByText(/Academic subjects and fields of study/)).toBeInTheDocument();

    // Check grammar rule sections
    expect(screen.getByText(/Grammar Rule/)).toBeInTheDocument();
    expect(screen.getByText(/The verb must agree with its subject/)).toBeInTheDocument();
  });

  test('displays CEFR levels for each error', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check CEFR level badges
    expect(screen.getByText(/A1/)).toBeInTheDocument();
    expect(screen.getByText(/B1/)).toBeInTheDocument();
    expect(screen.getByText(/A2/)).toBeInTheDocument();

    // Check overall CEFR assessment
    expect(screen.getByText(/Overall Level: B1/)).toBeInTheDocument();
  });

  test('shows L1-specific notes and interference patterns', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
        userL1="spanish"
      />
    );

    // Check L1-specific sections
    expect(screen.getByText(/L1 Interference/)).toBeInTheDocument();
    expect(screen.getByText(/Spanish speakers/)).toBeInTheDocument();
    expect(screen.getByText(/soy.*sounds similar/)).toBeInTheDocument();

    // Check L1-specific indicators
    const l1SpecificErrors = screen.getAllByTestId(/error.*l1-specific/);
    expect(l1SpecificErrors.length).toBe(2); // Two L1-specific errors
  });

  test('provides practice suggestions and exercises', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check practice suggestions
    expect(screen.getByText(/Practice conjugating the verb "to be"/)).toBeInTheDocument();
    expect(screen.getByText(/Learn which subjects use articles/)).toBeInTheDocument();

    // Check practice mode toggle
    const practiceButton = screen.getByText(/Practice Mode/);
    expect(practiceButton).toBeInTheDocument();

    fireEvent.click(practiceButton);

    // Should show practice exercises
    expect(screen.getByText(/Grammar Exercises/)).toBeInTheDocument();
  });

  test('toggles between explanation and practice modes', async () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Initially in explanation mode
    expect(screen.getByText(/Grammar Explanations/)).toBeInTheDocument();

    // Switch to practice mode
    const practiceToggle = screen.getByTestId('mode-toggle');
    fireEvent.click(practiceToggle);

    await waitFor(() => {
      expect(screen.getByText(/Grammar Practice/)).toBeInTheDocument();
      expect(screen.getByText(/Complete the exercises/)).toBeInTheDocument();
    });
  });

  test('provides interactive grammar exercises', async () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
        practiceMode={true}
      />
    );

    // Check exercise questions
    expect(screen.getByText(/Fill in the correct verb/)).toBeInTheDocument();

    // Check interactive elements
    const exerciseInput = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(exerciseInput, { target: { value: 'am' } });

    const checkButton = screen.getByText(/Check Answer/);
    fireEvent.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
    });
  });

  test('shows grammar complexity analysis', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check complexity score
    expect(screen.getByText(/Complexity Score: 3\.8/)).toBeInTheDocument();

    // Check tense usage breakdown
    expect(screen.getByText(/Tense Usage/)).toBeInTheDocument();
    expect(screen.getByText(/Present: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Past: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Future: 3/)).toBeInTheDocument();

    // Check sentence type analysis
    expect(screen.getByText(/Sentence Types/)).toBeInTheDocument();
    expect(screen.getByText(/Simple: 4/)).toBeInTheDocument();
    expect(screen.getByText(/Compound: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Complex: 3/)).toBeInTheDocument();
  });

  test('filters errors by type and severity', async () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Filter by high priority only
    const severityFilter = screen.getByTestId('severity-filter');
    fireEvent.change(severityFilter, { target: { value: 'high' } });

    await waitFor(() => {
      // Should only show high priority errors
      expect(screen.getByText(/Subject-Verb Agreement/)).toBeInTheDocument();
      expect(screen.queryByText(/Article Usage/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Preposition Usage/)).not.toBeInTheDocument();
    });
  });

  test('provides contextual error highlighting in text', () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Check highlighted text with error positions
    const highlightedText = screen.getByTestId('highlighted-transcript');
    expect(highlightedText).toBeInTheDocument();

    // Check individual error highlights
    const errorHighlights = screen.getAllByTestId(/error-highlight/);
    expect(errorHighlights).toHaveLength(3);

    // Check click interaction
    fireEvent.click(errorHighlights[0]);

    // Should focus on the corresponding error explanation
    expect(screen.getByTestId('error-explanation-0')).toHaveClass('focused');
  });

  test('tracks practice progress and performance', async () => {
    const mockOnProgress = jest.fn();

    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
        practiceMode={true}
        onProgress={mockOnProgress}
      />
    );

    // Complete a practice exercise
    const exerciseInput = screen.getByTestId('exercise-input-0');
    fireEvent.change(exerciseInput, { target: { value: 'am' } });

    const submitButton = screen.getByText(/Submit/);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnProgress).toHaveBeenCalledWith({
        errorType: 'subject_verb_agreement',
        correct: true,
        attempts: 1
      });
    });
  });

  test('handles empty grammar data gracefully', () => {
    const emptyData = {
      errors: [],
      complexity_score: 0,
      tense_usage: {},
      sentence_types: {},
      overall_cefr_level: 'A1'
    };

    render(
      <GrammarExplanations
        grammarData={emptyData}
        transcriptionText={mockTranscriptionText}
      />
    );

    // Should show positive feedback
    expect(screen.getByText(/Excellent grammar!/)).toBeInTheDocument();
    expect(screen.getByText(/No grammar errors detected/)).toBeInTheDocument();
  });

  test('exports grammar analysis report', () => {
    const mockOnExport = jest.fn();

    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
        onExport={mockOnExport}
      />
    );

    // Click export button
    const exportButton = screen.getByText(/Export Analysis/);
    fireEvent.click(exportButton);

    expect(mockOnExport).toHaveBeenCalledWith({
      type: 'grammar',
      data: mockGrammarData,
      format: 'detailed'
    });
  });

  test('integrates with overall learning dashboard', () => {
    const mockOnErrorSelect = jest.fn();

    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
        onErrorSelect={mockOnErrorSelect}
      />
    );

    // Click on an error
    const errorCard = screen.getByTestId('error-card-0');
    fireEvent.click(errorCard);

    expect(mockOnErrorSelect).toHaveBeenCalledWith({
      errorType: 'subject_verb_agreement',
      severity: 'high',
      cefrLevel: 'A1'
    });
  });

  test('provides adaptive difficulty in practice mode', async () => {
    render(
      <GrammarExplanations
        grammarData={mockGrammarData}
        transcriptionText={mockTranscriptionText}
        practiceMode={true}
        adaptiveDifficulty={true}
      />
    );

    // Complete several exercises correctly
    for (let i = 0; i < 3; i++) {
      const input = screen.getByTestId(`exercise-input-${i}`);
      fireEvent.change(input, { target: { value: 'correct answer' } });

      const submitButton = screen.getByText(/Submit/);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Correct!/)).toBeInTheDocument();
      });
    }

    // Should increase difficulty
    await waitFor(() => {
      expect(screen.getByText(/Advanced Exercise/)).toBeInTheDocument();
    });
  });
});

// Test utilities for grammar explanations
describe('GrammarExplanations Utils', () => {
  test('categorizes errors by severity correctly', () => {
    const { categorizeErrorsBySeverity } = require('../../components/analysis/GrammarExplanations');

    const errors = mockGrammarData.errors;
    const categorized = categorizeErrorsBySeverity(errors);

    expect(categorized.high).toHaveLength(1);
    expect(categorized.medium).toHaveLength(2);
    expect(categorized.low).toHaveLength(0);
  });

  test('highlights errors in text correctly', () => {
    const { highlightErrorsInText } = require('../../components/analysis/GrammarExplanations');

    const text = 'I are going to school';
    const error = {
      original: 'I are going',
      corrected: 'I am going'
    };

    const highlighted = highlightErrorsInText(text, [error]);

    expect(highlighted).toContain('<span class="error-highlight">');
    expect(highlighted).toContain('I are going');
  });

  test('generates practice exercises from errors', () => {
    const { generatePracticeExercises } = require('../../components/analysis/GrammarExplanations');

    const errors = mockGrammarData.errors.slice(0, 1); // Just first error
    const exercises = generatePracticeExercises(errors);

    expect(exercises).toHaveLength(1);
    expect(exercises[0].type).toBe('fill_in_blank');
    expect(exercises[0].question).toContain('I ___ going');
    expect(exercises[0].correctAnswer).toBe('am');
  });

  test('calculates CEFR level from errors', () => {
    const { calculateOverallCEFRLevel } = require('../../components/analysis/GrammarExplanations');

    const errors = mockGrammarData.errors;
    const level = calculateOverallCEFRLevel(errors);

    expect(level).toBe('B1'); // Should be the most common level
  });
});