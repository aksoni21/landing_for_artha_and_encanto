// -----storytime feature additions-----
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import storyService, { Story } from '../../services/storytime_storyService';

const StoriesPage: React.FC = () => {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock user ID for now - in production, get from auth context
  const userId = 'test-user-123';

  useEffect(() => {
    loadStories();
  }, [selectedGenre, selectedDifficulty]);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedDifficulty) params.difficulty_level = selectedDifficulty;
      
      const fetchedStories = await storyService.getStories(params);
      setStories(fetchedStories);
    } catch (err) {
      setError('Failed to load stories. Please try again.');
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommended = async () => {
    setLoading(true);
    setError(null);
    try {
      const recommendedStories = await storyService.getRecommendedStories(userId);
      setStories(recommendedStories);
    } catch (err) {
      setError('Failed to load recommended stories.');
      console.error('Error loading recommended stories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter stories by search term
  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract unique genres from stories
  const genres = Array.from(new Set(stories.map(s => s.genre).filter(Boolean)));

  return (
    <div className="stories-page min-h-screen bg-gray-50">
      {/* Header */}
      <div className="header bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Story Library</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty || ''}
              onChange={(e) => setSelectedDifficulty(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="1">A1 - Beginner</option>
              <option value="2">A2 - Elementary</option>
              <option value="3">B1 - Intermediate</option>
              <option value="4">B2 - Upper Intermediate</option>
              <option value="5">C1 - Advanced</option>
              <option value="6">C2 - Proficiency</option>
            </select>

            {/* Recommended Button */}
            <button
              onClick={loadRecommended}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Show Recommended
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No stories found matching your criteria.</p>
          </div>
        ) : (
          <div className="stories-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Story Card Component
const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  const getDifficultyColor = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-lime-100 text-lime-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800',
      6: 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyLabel = (level: number) => {
    return storyService.mapDifficultyToCEFR(level);
  };

  return (
    <Link href={`/stories/${story.id}`} className="story-card block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{story.title}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(story.difficulty_level)}`}>
            {getDifficultyLabel(story.difficulty_level)}
          </span>
        </div>

        {/* Author and Genre */}
        <div className="text-sm text-gray-600 mb-3">
          {story.author && <p>By {story.author}</p>}
          {story.genre && <p className="text-xs">{story.genre}</p>}
        </div>

        {/* Story Preview */}
        <p className="text-gray-700 line-clamp-3 mb-4">
          {story.content.substring(0, 150)}...
        </p>

        {/* Metadata */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex gap-3">
            {story.word_count && (
              <span>📝 {story.word_count} words</span>
            )}
            {story.estimated_reading_time && (
              <span>⏱️ {story.estimated_reading_time} min</span>
            )}
          </div>
          {story.audio_url && (
            <span className="text-blue-600">🎧 Audio available</span>
          )}
        </div>

        {/* Progress indicator if available */}
        {story.user_progress && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span className="font-medium">{story.user_progress.overall_completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${story.user_progress.overall_completion}%` }}
              />
            </div>
          </div>
        )}
    </Link>
  );
};

export default StoriesPage;