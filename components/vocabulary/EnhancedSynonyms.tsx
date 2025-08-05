import React, { useState } from 'react';

interface EnhancedSynonymsProps {
  synonyms: {
    simple: string[];
    complex: string[];
  };
  word: string;
}

const EnhancedSynonyms: React.FC<EnhancedSynonymsProps> = ({ synonyms }) => {
  const [activeTab, setActiveTab] = useState<'simple' | 'complex'>('simple');

  // Always show as a "Possible Feature" - the component handles empty data gracefully

  const hasSimple = synonyms.simple && synonyms.simple.length > 0;
  const hasComplex = synonyms.complex && synonyms.complex.length > 0;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
        🔄 Webster Synonyms (Possible Feature)
      </h4>
      
      {/* Tab Navigation */}
      {hasSimple && hasComplex && (
        <div className="flex space-x-1 mb-3">
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTab === 'simple'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-100'
            }`}
          >
            📝 Simple
          </button>
          <button
            onClick={() => setActiveTab('complex')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTab === 'complex'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-100'
            }`}
          >
            🎓 Advanced
          </button>
        </div>
      )}
      
      {/* Synonyms Display */}
      <div className="space-y-2">
        {(activeTab === 'simple' && hasSimple) && (
          <div>
            <div className="flex flex-wrap gap-2">
              {synonyms.simple.map((synonym, index) => (
                <span
                  key={index}
                  className="bg-white text-green-800 px-2 py-1 rounded-full text-xs border border-green-200 hover:bg-green-100 transition-colors cursor-default"
                >
                  {synonym}
                </span>
              ))}
            </div>
            <p className="text-xs text-green-600 mt-2">
              💡 Simple alternatives perfect for everyday conversation
            </p>
          </div>
        )}
        
        {(activeTab === 'complex' && hasComplex) && (
          <div>
            <div className="flex flex-wrap gap-2">
              {synonyms.complex.map((synonym, index) => (
                <span
                  key={index}
                  className="bg-white text-green-800 px-2 py-1 rounded-full text-xs border border-green-200 hover:bg-green-100 transition-colors cursor-default"
                >
                  {synonym}
                </span>
              ))}
            </div>
            <p className="text-xs text-green-600 mt-2">
              🎓 Advanced synonyms for academic and literary contexts
            </p>
          </div>
        )}
        
        {/* Show single category if only one exists */}
        {hasSimple && !hasComplex && (
          <div>
            <div className="flex flex-wrap gap-2">
              {synonyms.simple.map((synonym, index) => (
                <span
                  key={index}
                  className="bg-white text-green-800 px-2 py-1 rounded-full text-xs border border-green-200 hover:bg-green-100 transition-colors cursor-default"
                >
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {!hasSimple && hasComplex && (
          <div>
            <div className="flex flex-wrap gap-2">
              {synonyms.complex.map((synonym, index) => (
                <span
                  key={index}
                  className="bg-white text-green-800 px-2 py-1 rounded-full text-xs border border-green-200 hover:bg-green-100 transition-colors cursor-default"
                >
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {!hasSimple && !hasComplex && (
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white text-green-800 px-2 py-1 rounded-full text-xs border border-green-200">
                large
              </span>
              <span className="bg-white text-green-800 px-2 py-1 rounded-full text-xs border border-green-200">
                extensive
              </span>
              <span className="bg-white text-green-800 px-2 py-1 rounded-full text-xs border border-green-200">
                comprehensive
              </span>
            </div>
            <p className="text-xs text-green-600 mt-2">
              📝 Demo synonyms - Real Webster synonyms would appear here
            </p>
          </div>
        )}
        
        <div className="text-xs text-green-600 bg-white p-2 rounded border mt-3">
          <strong>Webster Thesaurus:</strong> Professional synonyms from Merriam-Webster&apos;s Collegiate Thesaurus, 
          contextually ranked for literary comprehension
        </div>
      </div>
    </div>
  );
};

export default EnhancedSynonyms;