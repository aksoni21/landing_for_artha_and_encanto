import React, { useState, useEffect } from 'react';
import { VocabularyHistoryItem } from '../../services/vocabularyService';

interface VocabularyHistoryProps {
  history: VocabularyHistoryItem[];
  onWordClick?: (item: VocabularyHistoryItem) => void;
  isLoading?: boolean;
}

const VocabularyHistory: React.FC<VocabularyHistoryProps> = ({ history, onWordClick, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<VocabularyHistoryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    filterHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, searchQuery, selectedFilter]);

  const filterHistory = () => {
    let filtered = [...history];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.word.toLowerCase().includes(query) ||
        item.book_title.toLowerCase().includes(query) ||
        item.context_paragraph.toLowerCase().includes(query)
      );
    }

    // Apply time filter
    const now = new Date();
    if (selectedFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= today
      );
    } else if (selectedFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= weekAgo
      );
    }

    setFilteredHistory(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getContextPreview = (paragraph: string, word: string) => {
    const wordIndex = paragraph.toLowerCase().indexOf(word.toLowerCase());
    if (wordIndex === -1) return paragraph.substring(0, 150) + '...';
    
    const start = Math.max(0, wordIndex - 75);
    const end = Math.min(paragraph.length, wordIndex + word.length + 75);
    const preview = paragraph.substring(start, end);
    
    return (start > 0 ? '...' : '') + preview + (end < paragraph.length ? '...' : '');
  };

  const highlightWord = (text: string, word: string) => {
    const parts = text.split(new RegExp(`(${word})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === word.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-semibold px-1 rounded">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Get unique books for quick filters
  const getUniqueBooks = () => {
    const books = [...new Set(history.map(item => item.book_title))];
    return books.slice(0, 5);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Vocabulary History</h2>
        <p className="text-gray-600 mb-4">
          {filteredHistory.length} word{filteredHistory.length !== 1 ? 's' : ''} in your learning journey
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words, books, or context..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setSelectedFilter('today')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedFilter('week')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
        </div>

        {/* Recent Books */}
        {getUniqueBooks().length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">📖 Recent Books:</p>
            <div className="flex flex-wrap gap-2">
              {getUniqueBooks().map((book, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(book)}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  {book}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* History List */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">
              {searchQuery ? 'No matches found' : 'No vocabulary history yet'}
            </p>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <div
              key={`${item.word}-${item.created_at}-${index}`}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onWordClick && onWordClick(item)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    &ldquo;{item.word}&rdquo;
                  </h3>
                  <p className="text-sm text-gray-600">
                    📖 {item.book_title}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(item.created_at)}
                </p>
              </div>

              <div className="mb-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                {highlightWord(getContextPreview(item.context_paragraph, item.word), item.word)}
              </div>

              <p className="text-sm text-gray-600 italic">
                {item.selected_definition}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VocabularyHistory;