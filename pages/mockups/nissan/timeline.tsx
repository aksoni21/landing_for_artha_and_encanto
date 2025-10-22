import React from 'react';
import Link from 'next/link';
import ImplementationCalendar from './components/ImplementationCalendar';

const NissanTimeline = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/mockups/nissan/results"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Results
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            10-Week Implementation Timeline
          </h1>
          <p className="text-lg text-gray-600">
            Start Date: October 27, 2025 • Completion: March 8, 2026
          </p>
        </div>

        {/* Implementation Calendar */}
        <ImplementationCalendar />
      </div>
    </div>
  );
};

export default NissanTimeline;
