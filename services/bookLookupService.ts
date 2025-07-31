export interface BookInfo {
  title: string;
  authors: string[];
  publishedDate: string;
  genre?: string;
  description?: string;
}

export interface BookLookupResult {
  found: boolean;
  books: BookInfo[];
  error?: string;
}

class BookLookupService {
  private readonly baseUrl = 'https://www.googleapis.com/books/v1/volumes';
  private readonly maxResults = 5;

  /**
   * Search for books by title using Google Books API
   */
  async searchBooks(title: string): Promise<BookLookupResult> {
    if (!title.trim()) {
      return { found: false, books: [], error: 'Book title is required' };
    }

    try {
      const query = title.trim();
      
      // Try multiple search strategies for better results
      const searchQueries = [
        `intitle:"${query}"`, // Exact title match
        `"${query}"`, // General exact phrase search
        query, // Flexible search
      ];

      for (const searchQuery of searchQueries) {
        const encodedQuery = encodeURIComponent(searchQuery);
        const url = `${this.baseUrl}?q=${encodedQuery}&maxResults=${this.maxResults}&printType=books`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          continue; // Try next search query
        }

        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const books: BookInfo[] = data.items.map((item: any) => ({
            title: item.volumeInfo.title || title,
            authors: item.volumeInfo.authors || [],
            publishedDate: item.volumeInfo.publishedDate || '',
            genre: item.volumeInfo.categories?.[0] || undefined,
            description: item.volumeInfo.description || undefined,
          }));

          // Filter results to prioritize relevance
          const relevantBooks = this.filterRelevantBooks(books, query);
          
          if (relevantBooks.length > 0) {
            return { found: true, books: relevantBooks };
          }
        }
      }
      
      return { found: false, books: [], error: 'No matching books found' };
    } catch (error) {
      console.error('Book lookup error:', error);
      return { 
        found: false, 
        books: [], 
        error: error instanceof Error ? error.message : 'Failed to lookup book information' 
      };
    }
  }

  /**
   * Filter and rank books by relevance to the search query
   */
  private filterRelevantBooks(books: BookInfo[], query: string): BookInfo[] {
    const queryLower = query.toLowerCase();
    
    return books
      .map(book => ({
        ...book,
        relevanceScore: this.calculateRelevance(book, queryLower)
      }))
      .filter(book => book.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, this.maxResults);
  }

  /**
   * Calculate relevance score for a book
   */
  private calculateRelevance(book: BookInfo, queryLower: string): number {
    const titleLower = book.title.toLowerCase();
    let score = 0;

    // Exact title match gets highest score
    if (titleLower === queryLower) {
      score += 100;
    }
    
    // Title contains the full query
    else if (titleLower.includes(queryLower)) {
      score += 80;
    }
    
    // Query words appear in title
    else {
      const queryWords = queryLower.split(/\s+/);
      const titleWords = titleLower.split(/\s+/);
      const matchingWords = queryWords.filter(qw => 
        titleWords.some(tw => tw.includes(qw) || qw.includes(tw))
      );
      score += (matchingWords.length / queryWords.length) * 60;
    }

    // Boost score if author name is well-known
    if (book.authors.some(author => 
      author.toLowerCase().includes('brown') || 
      author.toLowerCase().includes('brené') ||
      author.toLowerCase().includes('brene')
    )) {
      score += 10;
    }

    return score;
  }

  /**
   * Get the best match from search results
   */
  getBestMatch(books: BookInfo[], originalTitle: string): BookInfo | null {
    if (books.length === 0) return null;

    // Find exact title match first
    const exactMatch = books.find(book => 
      book.title.toLowerCase() === originalTitle.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    // Find partial title match
    const partialMatch = books.find(book => 
      book.title.toLowerCase().includes(originalTitle.toLowerCase()) ||
      originalTitle.toLowerCase().includes(book.title.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    // Return first result as fallback
    return books[0];
  }

  /**
   * Extract year from published date
   */
  extractYear(publishedDate: string): string {
    if (!publishedDate) return '';
    
    // Handle different date formats: "2004", "2004-03", "2004-03-15"
    const yearMatch = publishedDate.match(/^\d{4}/);
    return yearMatch ? yearMatch[0] : '';
  }

  /**
   * Format authors array into a single string
   */
  formatAuthors(authors: string[]): string {
    if (!authors || authors.length === 0) return '';
    
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(' & ');
    
    // For 3+ authors, show first author + "et al."
    return `${authors[0]} et al.`;
  }

  /**
   * Get popular/classic books that might not need API lookup
   */
  getPopularBooks(): Record<string, Omit<BookInfo, 'title'>> {
    return {
      // Classics
      'alexander hamilton': {
        authors: ['Ron Chernow'],
        publishedDate: '2004',
        genre: 'Biography'
      },
      'to kill a mockingbird': {
        authors: ['Harper Lee'],
        publishedDate: '1960',
        genre: 'Fiction'
      },
      '1984': {
        authors: ['George Orwell'],
        publishedDate: '1949',
        genre: 'Dystopian Fiction'
      },
      'pride and prejudice': {
        authors: ['Jane Austen'],
        publishedDate: '1813',
        genre: 'Romance'
      },
      'the great gatsby': {
        authors: ['F. Scott Fitzgerald'],
        publishedDate: '1925',
        genre: 'Fiction'
      },
      'moby dick': {
        authors: ['Herman Melville'],
        publishedDate: '1851',
        genre: 'Adventure Fiction'
      },
      'jane eyre': {
        authors: ['Charlotte Brontë'],
        publishedDate: '1847',
        genre: 'Gothic Fiction'
      },
      'wuthering heights': {
        authors: ['Emily Brontë'],
        publishedDate: '1847',
        genre: 'Gothic Fiction'
      },
      
      // Brené Brown books
      'rising strong': {
        authors: ['Brené Brown'],
        publishedDate: '2015',
        genre: 'Self-Help'
      },
      'dare to lead': {
        authors: ['Brené Brown'],
        publishedDate: '2018',
        genre: 'Leadership'
      },
      'the gifts of imperfection': {
        authors: ['Brené Brown'],
        publishedDate: '2010',
        genre: 'Self-Help'
      },
      'daring greatly': {
        authors: ['Brené Brown'],
        publishedDate: '2012',
        genre: 'Self-Help'
      },
      'braving the wilderness': {
        authors: ['Brené Brown'],
        publishedDate: '2017',
        genre: 'Self-Help'
      },
      'atlas of the heart': {
        authors: ['Brené Brown'],
        publishedDate: '2021',
        genre: 'Psychology'
      },
      
      // More popular contemporary books
      'atomic habits': {
        authors: ['James Clear'],
        publishedDate: '2018',
        genre: 'Self-Help'
      },
      'educated': {
        authors: ['Tara Westover'],
        publishedDate: '2018',
        genre: 'Memoir'
      },
      'becoming': {
        authors: ['Michelle Obama'],
        publishedDate: '2018',
        genre: 'Memoir'
      }
    };
  }

  /**
   * Quick lookup for popular books, fallback to API
   */
  async lookupBook(title: string): Promise<BookLookupResult> {
    const normalizedTitle = title.toLowerCase().trim();
    const popularBooks = this.getPopularBooks();
    
    // Check popular books first (faster, no API call needed)
    if (popularBooks[normalizedTitle]) {
      const bookInfo = popularBooks[normalizedTitle];
      return {
        found: true,
        books: [{
          title,
          ...bookInfo
        }]
      };
    }

    // Fallback to API search
    return this.searchBooks(title);
  }
}

export const bookLookupService = new BookLookupService();