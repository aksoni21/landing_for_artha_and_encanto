import React, { useState } from 'react';
import { VocabularyResult, Definition } from '../../services/vocabularyService';
import PronunciationPlayer from './PronunciationPlayer';
import RichExamples from './RichExamples';
import EnhancedSynonyms from './EnhancedSynonyms';

interface VocabularyResultDisplayProps {
  result: VocabularyResult;
  onClose?: () => void;
}

const VocabularyResultDisplay: React.FC<VocabularyResultDisplayProps> = ({ result, onClose }) => {
  const [showAllDefinitions, setShowAllDefinitions] = useState(false);
  const [showEtymology, setShowEtymology] = useState(false);

  const renderDefinition = (definition: Definition, isPrimary: boolean = false) => (
    <div
      key={`${definition.source}-${definition.text.substring(0, 20)}`}
      className={`border-l-4 p-4 rounded-r-lg ${
        isPrimary ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${isPrimary ? 'text-blue-700' : 'text-gray-600'}`}>
            {definition.source === 'free_dictionary' ? '📚 Free Dictionary' : '📖 Webster'}
          </span>
          {definition.part_of_speech && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded text-black">
              {definition.part_of_speech}
            </span>
          )}
        </div>
        {definition.historical && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
            📜 Historical
          </span>
        )}
      </div>

      <p className={`${isPrimary ? 'text-base font-medium' : 'text-sm'} text-gray-800 mb-2`}>
        {definition.text}
      </p>

      {definition.examples && definition.examples.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-1">💡 Example:</p>
          {definition.examples.slice(0, 2).map((example, index) => (
            <p key={index} className="text-sm text-gray-600 italic">
              &ldquo;{example}&rdquo;
            </p>
          ))}
        </div>
      )}

      {isPrimary && definition.etymology && (
        <div className="mt-3">
          <button
            onClick={() => setShowEtymology(!showEtymology)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            📚 Etymology {showEtymology ? '▲' : '▼'}
          </button>
          {showEtymology && (
            <div className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-700">
              {definition.etymology}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSynonyms = () => {
    const hasSimple = result.synonyms.simple && result.synonyms.simple.length > 0;
    const hasComplex = result.synonyms.complex && result.synonyms.complex.length > 0;

    if (!hasSimple && !hasComplex) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Synonyms</h3>
        
        {hasSimple && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">✨ Simple Alternatives:</h4>
            <div className="flex flex-wrap gap-2">
              {result.synonyms.simple.map((synonym, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasComplex && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">🎓 Advanced Alternatives:</h4>
            <div className="flex flex-wrap gap-2">
              {result.synonyms.complex.map((synonym, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContextAnalysis = () => {
    const analysis = result.context_analysis;
    if (!analysis) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Literary Context</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-black">
          {analysis.literary_period && (
            <div>
              <p className="text-sm text-gray-600">Period:</p>
              <p className="font-medium capitalize">
                <span
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {analysis.literary_period.replace('_', ' ')}
                </span>
              </p>
            </div>
          )}
          
          {analysis.formality_level && (
            <div>
              <p className="text-sm text-gray-600">Formality:</p>
              <p className="font-medium capitalize">
                <span
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {analysis.formality_level}
                </span>
              </p>
            </div>
          )}
          
          {analysis.sentence_complexity && (
            <div>
              <p className="text-sm text-gray-600">Complexity:</p>
              <p className="font-medium capitalize">
                <span
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {analysis.sentence_complexity}
                </span>
              </p>
            </div>
          )}
        </div>

        {analysis.archaic_indicators && analysis.archaic_indicators.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">📜 Archaic Language Detected:</p>
            <p className="text-sm text-amber-700 italic">
              {analysis.archaic_indicators.join(', ')}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Debug logging for API response
  console.log('🔍 VocabularyResultDisplay result:', result);
  console.log('🔍 primary_definition:', result.primary_definition);
  console.log('🔍 audio_url field:', result.primary_definition.audio_url);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 text-center relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <h2 className="text-3xl font-bold mb-2">&ldquo;{result.word}&rdquo;</h2>
        <p className="text-blue-100">
          {result.other_definitions.length + 1} definition{result.other_definitions.length > 0 ? 's' : ''} found
        </p>
      </div>

      {/* Primary Definition */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Primary Definition</h3>
        {renderDefinition(result.primary_definition, true)}
      </div>

      {/* Usage Note */}
      {result.usage_note && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Usage Note</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">{result.usage_note}</p>
          </div>
        </div>
      )}

      {/* Synonyms */}
      {renderSynonyms()}

      {/* Alternative Definitions */}
      {result.other_definitions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={() => setShowAllDefinitions(!showAllDefinitions)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              📚 Alternative Definitions ({result.other_definitions.length})
            </h3>
            <span className="text-gray-500">
              {showAllDefinitions ? '▲' : '▼'}
            </span>
          </button>
          
          {showAllDefinitions && (
            <div className="mt-4 space-y-3">
              {result.other_definitions.map((definition) => 
                renderDefinition(definition)
              )}
            </div>
          )}
        </div>
      )}

      {/* Context Analysis */}
      {renderContextAnalysis()}

      {/* Enhanced Features Section */}
      <div className="space-y-4">
        {/* Pronunciation Player */}
        <PronunciationPlayer 
          word={result.word}
          pronunciation={result.primary_definition.pronunciation}
          audioUrl={result.primary_definition.audio_url}
        />
        {/* Debug info */}
        <div style={{ display: 'none' }}>
          Debug primary_definition: {JSON.stringify(result.primary_definition, null, 2)}
        </div>
        <script dangerouslySetInnerHTML={{
          __html: `console.log('🔍 Full result object:', ${JSON.stringify(result, null, 2)});`
        }} />
        
        {/* Rich Examples */}
        <RichExamples 
          word={result.word}
          examples={result.primary_definition.examples || []}
          source={result.primary_definition.source}
        />
        
        {/* Enhanced Synonyms */}
        <EnhancedSynonyms 
          synonyms={result.synonyms}
          word={result.word}
        />
      </div>
    </div>
  );
};

export default VocabularyResultDisplay;