// -----storytime feature additions-----
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryResponse {
  id: string;
  user_id: string;
  story_id: string;
  response_type: 'summary' | 'retelling' | 'analysis' | 'creative';
  skill_type: 'speaking' | 'writing';
  content?: string;
  audio_url?: string;
  audio_duration?: number;
  created_at: string;
  author: {
    username: string;
    level?: string;
  };
  peer_reviews: PeerReviewData[];
  quality_score?: number;
}

interface PeerReviewData {
  reviewer_id: string;
  reviewer_name: string;
  score: number; // 1-5 scale
  feedback: string;
  strengths: string[];
  improvements: string[];
  created_at: string;
}

interface ReviewData {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface PeerReviewProps {
  responses: StoryResponse[];
  currentUserId: string;
  storyTitle: string;
  onReviewSubmit: (responseId: string, review: ReviewData) => void;
}

const PeerReview: React.FC<PeerReviewProps> = ({
  responses,
  currentUserId,
  storyTitle,
  onReviewSubmit
}) => {
  const [selectedResponse, setSelectedResponse] = useState<StoryResponse | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({
    score: 3,
    feedback: '',
    strengths: [],
    improvements: []
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'writing' | 'speaking'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score'>('newest');

  // Filter out current user's responses for peer review
  const reviewableResponses = responses.filter(r => r.user_id !== currentUserId);
  
  // Apply filters
  const filteredResponses = reviewableResponses.filter(response => {
    if (filter === 'all') return true;
    return response.skill_type === filter;
  });

  // Apply sorting
  const sortedResponses = [...filteredResponses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'score':
        return (b.quality_score || 0) - (a.quality_score || 0);
      default:
        return 0;
    }
  });

  const handleStartReview = (response: StoryResponse) => {
    setSelectedResponse(response);
    setShowReviewForm(true);
    setReviewData({
      score: 3,
      feedback: '',
      strengths: [],
      improvements: []
    });
  };

  const handleSubmitReview = () => {
    if (!selectedResponse || !reviewData.feedback.trim()) return;

    onReviewSubmit(selectedResponse.id, reviewData);
    setShowReviewForm(false);
    setSelectedResponse(null);
  };

  const addStrength = (strength: string) => {
    if (strength.trim() && !reviewData.strengths.includes(strength.trim())) {
      setReviewData(prev => ({
        ...prev,
        strengths: [...prev.strengths, strength.trim()]
      }));
    }
  };

  const addImprovement = (improvement: string) => {
    if (improvement.trim() && !reviewData.improvements.includes(improvement.trim())) {
      setReviewData(prev => ({
        ...prev,
        improvements: [...prev.improvements, improvement.trim()]
      }));
    }
  };

  const removeStrength = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }));
  };

  const removeImprovement = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="peer-review">
      {/* Header and Controls */}
      <div className="header bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Peer Review - {storyTitle}</h2>
        
        <div className="controls flex flex-wrap gap-4 items-center">
          <div className="filter-control">
            <label className="text-sm font-medium mr-2">Show:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Responses</option>
              <option value="writing">Writing Only</option>
              <option value="speaking">Speaking Only</option>
            </select>
          </div>

          <div className="sort-control">
            <label className="text-sm font-medium mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border rounded px-3 py-1"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score">Highest Score</option>
            </select>
          </div>

          <div className="stats text-sm text-gray-600 ml-auto">
            <span className="font-medium">{sortedResponses.length}</span> responses available for review
          </div>
        </div>
      </div>

      {/* Responses Grid */}
      <div className="responses-grid space-y-4 mb-6">
        {sortedResponses.length === 0 ? (
          <div className="no-responses bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No responses available for review at this time.</p>
            <p className="text-sm text-gray-500 mt-2">
              Come back when other learners have submitted their work!
            </p>
          </div>
        ) : (
          sortedResponses.map((response) => (
            <ResponseCard
              key={response.id}
              response={response}
              currentUserId={currentUserId}
              onStartReview={handleStartReview}
            />
          ))
        )}
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && selectedResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="review-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="modal-header flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">Review Response</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Original Response Display */}
              <div className="original-response bg-gray-50 rounded-lg p-4 mb-6">
                <div className="response-meta flex justify-between items-center mb-3">
                  <div>
                    <span className="font-medium">By: {selectedResponse.author.username}</span>
                    {selectedResponse.author.level && (
                      <span className="ml-2 text-sm text-gray-600">({selectedResponse.author.level})</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedResponse.skill_type === 'writing' ? '✍️ Writing' : '🗣️ Speaking'} • {selectedResponse.response_type}
                  </div>
                </div>

                {selectedResponse.skill_type === 'writing' && selectedResponse.content && (
                  <div className="writing-content">
                    <p className="text-gray-800 leading-relaxed">{selectedResponse.content}</p>
                  </div>
                )}

                {selectedResponse.skill_type === 'speaking' && selectedResponse.audio_url && (
                  <div className="audio-content">
                    <audio controls className="w-full">
                      <source src={selectedResponse.audio_url} type="audio/mpeg" />
                      Your browser does not support audio playback.
                    </audio>
                    {selectedResponse.audio_duration && (
                      <p className="text-sm text-gray-600 mt-2">
                        Duration: {Math.floor(selectedResponse.audio_duration / 60)}:{(selectedResponse.audio_duration % 60).toString().padStart(2, '0')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div className="review-form space-y-6">
                {/* Overall Score */}
                <div className="score-section">
                  <label className="block text-sm font-medium mb-2">Overall Score</label>
                  <div className="score-buttons flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => setReviewData(prev => ({ ...prev, score }))}
                        className={`w-12 h-12 rounded-full border-2 font-bold ${
                          reviewData.score === score
                            ? 'border-blue-500 bg-blue-100 text-blue-700'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="score-labels flex justify-between text-xs text-gray-500 mt-1">
                    <span>Needs Work</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="strengths-section">
                  <label className="block text-sm font-medium mb-2">Strengths (What did they do well?)</label>
                  <div className="strength-input flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add a strength..."
                      className="flex-1 border rounded px-3 py-2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addStrength(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addStrength(input.value);
                        input.value = '';
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="strength-tags flex flex-wrap gap-2">
                    {reviewData.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {strength}
                        <button
                          onClick={() => removeStrength(index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div className="improvements-section">
                  <label className="block text-sm font-medium mb-2">Areas for Improvement</label>
                  <div className="improvement-input flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Suggest an improvement..."
                      className="flex-1 border rounded px-3 py-2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addImprovement(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addImprovement(input.value);
                        input.value = '';
                      }}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="improvement-tags flex flex-wrap gap-2">
                    {reviewData.improvements.map((improvement, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {improvement}
                        <button
                          onClick={() => removeImprovement(index)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* General Feedback */}
                <div className="feedback-section">
                  <label className="block text-sm font-medium mb-2">General Feedback</label>
                  <textarea
                    value={reviewData.feedback}
                    onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Provide constructive feedback to help them improve..."
                    className="w-full h-32 border rounded px-3 py-2 resize-none"
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="submit-section flex justify-end gap-3">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!reviewData.feedback.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Guidelines */}
      <div className="review-guidelines mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Peer Review Guidelines:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be constructive and kind - focus on helping others improve</li>
          <li>• Give specific examples when pointing out strengths or areas for improvement</li>
          <li>• Consider the writer's/speaker's level and effort</li>
          <li>• Balance positive feedback with helpful suggestions</li>
          <li>• Remember that peer review helps you learn too!</li>
        </ul>
      </div>
    </div>
  );
};

// Response Card Component
const ResponseCard: React.FC<{
  response: StoryResponse;
  currentUserId: string;
  onStartReview: (response: StoryResponse) => void;
}> = ({ response, currentUserId, onStartReview }) => {
  // Check if current user has already reviewed this response
  const hasReviewed = response.peer_reviews.some(review => review.reviewer_id === currentUserId);
  
  return (
    <div className="response-card bg-white shadow-md rounded-lg p-6">
      <div className="response-header flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">
            {response.skill_type === 'writing' ? '✍️' : '🗣️'} {response.response_type} Response
          </h3>
          <p className="text-sm text-gray-600">
            By: {response.author.username}
            {response.author.level && ` (${response.author.level})`}
          </p>
        </div>
        <div className="response-meta text-right text-sm text-gray-500">
          <p>{new Date(response.created_at).toLocaleDateString()}</p>
          {response.quality_score && (
            <p className="font-medium">Score: {response.quality_score.toFixed(1)}/5</p>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div className="content-preview mb-4">
        {response.skill_type === 'writing' && response.content && (
          <p className="text-gray-700 line-clamp-3">
            {response.content.substring(0, 200)}
            {response.content.length > 200 && '...'}
          </p>
        )}
        
        {response.skill_type === 'speaking' && response.audio_url && (
          <div className="audio-preview">
            <p className="text-gray-700 mb-2">Audio Response</p>
            {response.audio_duration && (
              <p className="text-sm text-gray-600">
                Duration: {Math.floor(response.audio_duration / 60)}:{(response.audio_duration % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Existing Reviews Summary */}
      {response.peer_reviews.length > 0 && (
        <div className="existing-reviews mb-4">
          <p className="text-sm text-gray-600">
            {response.peer_reviews.length} review{response.peer_reviews.length !== 1 ? 's' : ''} •{' '}
            Average score: {(response.peer_reviews.reduce((sum, r) => sum + r.score, 0) / response.peer_reviews.length).toFixed(1)}/5
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="action-section">
        {hasReviewed ? (
          <span className="text-green-600 text-sm font-medium">✓ You've reviewed this</span>
        ) : (
          <button
            onClick={() => onStartReview(response)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Review This Response
          </button>
        )}
      </div>
    </div>
  );
};

export default PeerReview;