// -----storytime feature additions-----
import React, { useState, useEffect } from 'react';
import { StoryVocabulary } from '../../services/storytime_storyService';
import storyService from '../../services/storytime_storyService';
import { VocabularyLookupForm } from '../vocabulary/VocabularyLookupForm';
import { BookMetadata } from '../../services/vocabularyService';

interface StoryVocabularyProps {
  storyId: string;
  storyTitle: string;
  storyAuthor?: string;
  extractedWords: StoryVocabulary[];
  onWordLookup: (word: string, definition?: string) => void;
  userId?: string;
}

const StorytimeVocabulary: React.FC<StoryVocabularyProps> = ({
  storyId,
  storyTitle,
  storyAuthor,
  extractedWords,
  onWordLookup,
  userId
}) => {
  const [vocabulary, setVocabulary] = useState<StoryVocabulary[]>(extractedWords);
  const [selectedWord, setSelectedWord] = useState<StoryVocabulary | null>(null);
  const [showLookupForm, setShowLookupForm] = useState(false);
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'word' | 'difficulty' | 'frequency'>('difficulty');
  const [masteredWords, setMasteredWords] = useState<Set<string>>(new Set());
  const [reviewingWords, setReviewingWords] = useState<Set<string>>(new Set());

  // Load vocabulary if not provided
  useEffect(() => {
    if (!extractedWords || extractedWords.length === 0) {
      loadVocabulary();
    }
  }, [storyId]);

  const loadVocabulary = async () => {
    try {
      const words = await storyService.getStoryVocabulary(storyId, userId);
      setVocabulary(words);
    } catch (error) {
      console.error('Failed to load vocabulary:', error);
    }
  };

  // Sort vocabulary based on selected criteria
  const sortedVocabulary = [...vocabulary].sort((a, b) => {
    switch (sortBy) {
      case 'word':
        return (a.word || '').localeCompare(b.word || '');
      case 'difficulty':
        return (b.difficulty_level || 0) - (a.difficulty_level || 0);
      case 'frequency':
        return (a.frequency_rank || 999) - (b.frequency_rank || 999);
      default:
        return 0;
    }
  });

  // Filter by difficulty level if selected
  const filteredVocabulary = filterLevel
    ? sortedVocabulary.filter(word => word.difficulty_level === filterLevel)
    : sortedVocabulary;

  // Handle word selection for detailed view
  const handleWordSelect = (word: StoryVocabulary) => {
    setSelectedWord(word);
    onWordLookup(word.word, word.definition);
  };

  // Open vocabulary lookup form for advanced lookup
  const openLookupForm = (word: StoryVocabulary) => {
    setSelectedWord(word);
    setShowLookupForm(true);
  };

  // Mark word as mastered
  const markAsMastered = (wordId: string) => {
    setMasteredWords(prev => new Set(prev).add(wordId));
    setReviewingWords(prev => {
      const newSet = new Set(prev);
      newSet.delete(wordId);
      return newSet;
    });
  };

  // Mark word for review
  const markForReview = (wordId: string) => {
    setReviewingWords(prev => new Set(prev).add(wordId));
    setMasteredWords(prev => {
      const newSet = new Set(prev);
      newSet.delete(wordId);
      return newSet;
    });
  };

  // Get difficulty label and color
  const getDifficultyLabel = (level?: number) => {
    if (!level) return { label: 'Unknown', color: 'gray' };
    const labels = {
      1: { label: 'A1', color: 'green' },
      2: { label: 'A2', color: 'lime' },
      3: { label: 'B1', color: 'yellow' },
      4: { label: 'B2', color: 'orange' },
      5: { label: 'C1', color: 'red' },
      6: { label: 'C2', color: 'purple' }
    };
    return labels[level as keyof typeof labels] || { label: 'Unknown', color: 'gray' };
  };

  // Create book metadata for vocabulary lookup
  const bookMetadata: BookMetadata = {
    title: storyTitle,
    author: storyAuthor || 'Unknown',
    year: new Date().getFullYear().toString(),
    genre: 'Story'
  };

  return (
    <div className="story-vocabulary-container">
      {/* Header and Controls */}
      <div className="vocabulary-header bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">Story Vocabulary</h2>
        
        <div className="controls flex flex-wrap gap-4">
          {/* Sort Control */}
          <div className="sort-control">
            <label className="text-sm font-medium mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border rounded px-3 py-1"
            >
              <option value="word">Alphabetical</option>
              <option value="difficulty">Difficulty</option>
              <option value="frequency">Frequency</option>
            </select>
          </div>

          {/* Filter by Difficulty */}
          <div className="filter-control">
            <label className="text-sm font-medium mr-2">Filter:</label>
            <select
              value={filterLevel || ''}
              onChange={(e) => setFilterLevel(e.target.value ? Number(e.target.value) : null)}
              className="border rounded px-3 py-1"
            >
              <option value="">All Levels</option>
              <option value="1">A1 - Beginner</option>
              <option value="2">A2 - Elementary</option>
              <option value="3">B1 - Intermediate</option>
              <option value="4">B2 - Upper Intermediate</option>
              <option value="5">C1 - Advanced</option>
              <option value="6">C2 - Proficiency</option>
            </select>
          </div>

          {/* Statistics */}
          <div className="stats flex items-center gap-4 ml-auto">
            <span className="text-sm">
              <strong>{filteredVocabulary.length}</strong> words
            </span>
            <span className="text-sm text-green-600">
              <strong>{masteredWords.size}</strong> mastered
            </span>
            <span className="text-sm text-yellow-600">
              <strong>{reviewingWords.size}</strong> reviewing
            </span>
          </div>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="vocabulary-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocabulary.map((word) => {
          const difficulty = getDifficultyLabel(word.difficulty_level);
          const isMastered = masteredWords.has(word.id);
          const isReviewing = reviewingWords.has(word.id);
          
          return (
            <div
              key={word.id}
              className={`vocabulary-card bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                isMastered ? 'border-2 border-green-500' : 
                isReviewing ? 'border-2 border-yellow-500' : ''
              }`}
              onClick={() => handleWordSelect(word)}
            >
              {/* Word Header */}
              <div className="word-header flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{word.word}</h3>
                <span className={`difficulty-badge px-2 py-1 rounded text-xs font-medium bg-${difficulty.color}-100 text-${difficulty.color}-800`}>
                  {difficulty.label}
                </span>
              </div>

              {/* Definition */}
              {word.definition && (
                <p className="definition text-sm text-gray-700 mb-2 line-clamp-2">
                  {word.definition}
                </p>
              )}

              {/* Context */}
              {word.context_sentence && (
                <p className="context text-xs text-gray-500 italic mb-3 line-clamp-2">
                  "{word.context_sentence}"
                </p>
              )}

              {/* Actions */}
              <div className="actions flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLookupForm(word);
                  }}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Full Lookup
                </button>
                
                {!isMastered && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsMastered(word.id);
                    }}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Mastered
                  </button>
                )}
                
                {!isReviewing && !isMastered && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markForReview(word.id);
                    }}
                    className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Word Detail Modal */}
      {selectedWord && !showLookupForm && (
        <div className="word-detail-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="modal-content bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="modal-header flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedWord.word}</h2>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {selectedWord.definition && (
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Definition:</h3>
                <p className="text-gray-700">{selectedWord.definition}</p>
              </div>
            )}
            
            {selectedWord.context_sentence && (
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Context from story:</h3>
                <p className="text-gray-700 italic">"{selectedWord.context_sentence}"</p>
              </div>
            )}
            
            <div className="modal-actions flex gap-3 mt-6">
              <button
                onClick={() => openLookupForm(selectedWord)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Advanced Lookup
              </button>
              <button
                onClick={() => setSelectedWord(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary Lookup Form Modal */}
      {showLookupForm && selectedWord && (
        <div className="lookup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="modal-content bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="modal-header flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Advanced Vocabulary Lookup</h2>
              <button
                onClick={() => {
                  setShowLookupForm(false);
                  setSelectedWord(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <VocabularyLookupForm
              initialWord={selectedWord.word}
              initialContext={selectedWord.context_sentence || ''}
              bookMetadata={bookMetadata}
              onLookupComplete={(result) => {
                console.log('Lookup complete:', result);
                setShowLookupForm(false);
                setSelectedWord(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Study Tips */}
      <div className="study-tips mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Vocabulary Study Tips:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Click on words to see detailed definitions</li>
          <li>• Use "Full Lookup" for etymology and advanced analysis</li>
          <li>• Mark words as "Mastered" when you know them well</li>
          <li>• Use "Review" for words you want to practice more</li>
          <li>• Filter by difficulty to focus on appropriate level words</li>
        </ul>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default StorytimeVocabulary;