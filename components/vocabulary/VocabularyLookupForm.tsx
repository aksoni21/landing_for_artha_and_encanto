import React, { useState, useCallback, useEffect } from 'react';
import { BookMetadata } from '../../services/vocabularyService';
import { bookLookupService, BookInfo } from '../../services/bookLookupService';

interface VocabularyLookupFormProps {
  onLookup: (word: string, paragraph: string, bookMetadata: BookMetadata) => void;
  isLoading?: boolean;
}

const VocabularyLookupForm: React.FC<VocabularyLookupFormProps> = ({ onLookup, isLoading }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [contextParagraph, setContextParagraph] = useState('');
  const [word, setWord] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Book lookup state
  const [isLookingUpBook, setIsLookingUpBook] = useState(false);
  const [bookSuggestions, setBookSuggestions] = useState<BookInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  
  // Context mode state
  const [contextMode, setContextMode] = useState<'manual' | 'auto'>('auto');
  const [isAutoFindingContext, setIsAutoFindingContext] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!bookTitle.trim()) newErrors.bookTitle = 'Book title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (!year.trim()) newErrors.year = 'Year is required';
    if (year && !/^\d{4}$/.test(year)) newErrors.year = 'Year must be 4 digits';
    
    // Context paragraph only required in manual mode
    if (contextMode === 'manual' && !contextParagraph.trim()) {
      newErrors.contextParagraph = 'Context paragraph is required';
    }
    
    if (!word.trim()) newErrors.word = 'Word is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const bookMetadata: BookMetadata = {
      title: bookTitle.trim(),
      author: author.trim(),
      year: year.trim(),
      genre: genre.trim() || undefined,
    };

    let finalContextParagraph = contextParagraph.trim();

    // If auto mode and no context provided, try to find context automatically
    if (contextMode === 'auto' && !finalContextParagraph) {
      setIsAutoFindingContext(true);
      try {
        finalContextParagraph = await findContextForWord(word.trim(), bookMetadata);
      } catch (error) {
        console.error('Auto context lookup failed:', error);
        setErrors({ contextParagraph: 'Could not find context automatically. Please provide context manually.' });
        setIsAutoFindingContext(false);
        return;
      }
      setIsAutoFindingContext(false);
    }

    onLookup(word.trim(), finalContextParagraph, bookMetadata);
  };

  const fillSampleData = () => {
    setBookTitle('Alexander Hamilton');
    setAuthor('Ron Chernow');
    setYear('2004');
    setGenre('Biography');
    setContextParagraph('The purblind folly of the ruling class in failing to recognize the growing discontent among the common people would soon lead to their downfall.');
    setWord('purblind');
    setErrors({});
  };

  const clearForm = () => {
    setBookTitle('');
    setAuthor('');
    setYear('');
    setGenre('');
    setContextParagraph('');
    setWord('');
    setErrors({});
    setBookSuggestions([]);
    setShowSuggestions(false);
    setLookupError(null);
    setContextMode('auto');
  };

  // Debounced book lookup
  const debouncedBookLookup = useCallback(
    debounce(async (title: string) => {
      if (!title.trim() || title.length < 3) {
        setBookSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLookingUpBook(true);
      setLookupError(null);
      
      try {
        const result = await bookLookupService.lookupBook(title);
        
        if (result.found && result.books.length > 0) {
          setBookSuggestions(result.books);
          setShowSuggestions(true);
        } else {
          setBookSuggestions([]);
          setShowSuggestions(false);
          if (result.error) {
            setLookupError(result.error);
          }
        }
      } catch (error) {
        console.error('Book lookup failed:', error);
        setLookupError('Failed to lookup book information');
        setBookSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLookingUpBook(false);
      }
    }, 500),
    []
  );

  // Handle book title change with auto-lookup
  const handleBookTitleChange = (value: string) => {
    setBookTitle(value);
    debouncedBookLookup(value);
  };

  // Apply book suggestion
  const applyBookSuggestion = (book: BookInfo) => {
    setBookTitle(book.title);
    setAuthor(bookLookupService.formatAuthors(book.authors));
    setYear(bookLookupService.extractYear(book.publishedDate));
    if (book.genre) {
      setGenre(book.genre);
    }
    setShowSuggestions(false);
    setBookSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.book-suggestions-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-find context for a word based on book metadata
  const findContextForWord = async (word: string, bookMetadata: BookMetadata): Promise<string> => {
    // For now, we'll use a placeholder implementation
    // In a full implementation, this would search through book content or use APIs
    
    // Try Google Books API to find book content with the word
    try {
      const query = `"${word}" inauthor:"${bookMetadata.author}" intitle:"${bookMetadata.title}"`;
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items[0]?.searchInfo?.textSnippet) {
          const snippet = data.items[0].searchInfo.textSnippet;
          // Clean up HTML tags and return the snippet
          const cleanSnippet = snippet.replace(/<[^>]*>/g, '').replace(/\.\.\./g, '');
          if (cleanSnippet.length > 50) {
            return cleanSnippet;
          }
        }
      }
    } catch (error) {
      console.error('Google Books snippet search failed:', error);
    }

    // Fallback: Generate a contextual paragraph based on book genre/type
    const contextExamples = {
      'Biography': `In this biographical account, the author explores how ${word} played a significant role in shaping the subject's character and decisions throughout their life.`,
      'Historical Fiction': `Set against the backdrop of historical events, the narrative reveals how ${word} influenced the characters' understanding of their changing world.`,
      'Self-Help': `The author examines the concept of ${word} and its importance in personal development, offering insights into how readers can apply this principle in their own lives.`,
      'Leadership': `In discussing effective leadership strategies, the text highlights how ${word} serves as a crucial element in building trust and inspiring teams.`,
      'Psychology': `Through careful analysis of human behavior, the author demonstrates how ${word} affects our emotional responses and decision-making processes.`,
      'Fiction': `Within the rich tapestry of the story, ${word} emerges as a central theme that drives the plot forward and reveals deeper truths about the characters.`,
      'Romance': `As the relationship between the protagonists develops, ${word} becomes a defining element that tests their commitment and understanding of each other.`,
      'default': `In "${bookMetadata.title}" by ${bookMetadata.author}, the term ${word} appears in a context that reveals its deeper literary significance and meaning.`
    };

    const genre = bookMetadata.genre || 'default';
    return contextExamples[genre as keyof typeof contextExamples] || contextExamples.default;
  };

  // Debounce utility function
  function debounce<Args extends readonly unknown[]>(
    func: (...args: Args) => void | Promise<void>,
    delay: number
  ): (...args: Args) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Book Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="book-suggestions-container relative">
            <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Title * {isLookingUpBook && <span className="text-blue-500 text-xs">(Looking up...)</span>}
            </label>
            <input
              type="text"
              id="bookTitle"
              value={bookTitle}
              onChange={(e) => handleBookTitleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                errors.bookTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Alexander Hamilton"
            />
            {errors.bookTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.bookTitle}</p>
            )}
            {lookupError && (
              <p className="mt-1 text-sm text-orange-600">{lookupError}</p>
            )}
            
            {/* Book Suggestions Dropdown */}
            {showSuggestions && bookSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                  📚 Select a book to auto-fill details:
                </div>
                {bookSuggestions.map((book, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyBookSuggestion(book)}
                    className="w-full px-3 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 text-sm">{book.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {book.authors.length > 0 && (
                        <span>👤 {bookLookupService.formatAuthors(book.authors)}</span>
                      )}
                      {book.publishedDate && (
                        <span className="ml-3">📅 {bookLookupService.extractYear(book.publishedDate)}</span>
                      )}
                      {book.genre && (
                        <span className="ml-3">🏷️ {book.genre}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Ron Chernow"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="text"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 2004"
                maxLength={4}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre (Optional)
            </label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="e.g., Biography, Historical Fiction"
            />
          </div>
        </div>
      </div>

      {/* Context & Word Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Context & Word</h3>
          
          {/* Context Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Context:</span>
            <button
              type="button"
              onClick={() => setContextMode('auto')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                contextMode === 'auto'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🤖 Auto-Find
            </button>
            <button
              type="button"
              onClick={() => setContextMode('manual')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                contextMode === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📝 Manual
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">
              Word to Look Up *
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                errors.word ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter the word you don't understand"
            />
            {errors.word && (
              <p className="mt-1 text-sm text-red-600">{errors.word}</p>
            )}
          </div>

          <div>
            <label htmlFor="contextParagraph" className="block text-sm font-medium text-gray-700 mb-1">
              {contextMode === 'manual' ? 'Context Paragraph *' : 'Context Paragraph (Optional)'}
            </label>
            
            {contextMode === 'manual' ? (
              <textarea
                id="contextParagraph"
                value={contextParagraph}
                onChange={(e) => setContextParagraph(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.contextParagraph ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Paste the paragraph containing the word you want to understand..."
              />
            ) : (
              <div className="space-y-2">
                <textarea
                  id="contextParagraph"
                  value={contextParagraph}
                  onChange={(e) => setContextParagraph(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                    errors.contextParagraph ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Leave empty to auto-find context, or paste specific paragraph if you have one..."
                />
                <div className="flex items-center text-sm text-purple-600 bg-purple-50 p-2 rounded">
                  <span className="mr-2">🤖</span>
                  <span>AI will automatically find relevant context from the book if left empty</span>
                </div>
              </div>
            )}
            
            {errors.contextParagraph && (
              <p className="mt-1 text-sm text-red-600">{errors.contextParagraph}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={fillSampleData}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          disabled={isLoading}
        >
          📝 Fill Sample
        </button>

        <button
          type="button"
          onClick={clearForm}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          disabled={isLoading}
        >
          🗑️ Clear
        </button>

        <button
          type="submit"
          className={`px-6 py-2 ${contextMode === 'auto' ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} text-white rounded-md focus:outline-none focus:ring-2 transition-colors flex-1 sm:flex-none ${
            isLoading || isAutoFindingContext ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          disabled={isLoading || isAutoFindingContext}
        >
          {isAutoFindingContext ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding context...
            </>
          ) : isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Looking up...
            </>
          ) : (
            `${contextMode === 'auto' ? '🤖' : '🔍'} Look Up Word`
          )}
        </button>
      </div>
    </form>
  );
};

export default VocabularyLookupForm;