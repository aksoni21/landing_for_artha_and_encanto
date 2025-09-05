import React from 'react';
import { VocabularyResult } from '../../services/vocabularyService';

interface VocabularyPopupProps {
  result: VocabularyResult | null;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const VocabularyPopup: React.FC<VocabularyPopupProps> = ({
  result,
  isOpen,
  onClose,
  position
}) => {
  if (!isOpen || !result) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl border max-w-md w-full mx-4"
        style={{
          top: position ? Math.min(position.y + 10, window.innerHeight - 400) : '50%',
          left: position ? Math.min(position.x - 150, window.innerWidth - 320) : '50%',
          transform: position ? 'none' : 'translate(-50%, -50%)',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 border-b">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{result.word}</h3>
            {result.primary_definition?.pronunciation && (
              <p className="text-sm text-gray-500">/{result.primary_definition.pronunciation}/</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Primary Definition */}
          {result.primary_definition && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {result.primary_definition.part_of_speech}
                </span>
                {result.primary_definition.relevance_score && (
                  <span className="text-xs text-gray-500">
                    {Math.round(result.primary_definition.relevance_score * 100)}% relevant
                  </span>
                )}
              </div>
              <p className="text-gray-800 mb-2">{result.primary_definition.text}</p>
              
              {/* Examples */}
              {result.primary_definition.examples && result.primary_definition.examples.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Examples:</h4>
                  <ul className="space-y-1">
                    {result.primary_definition.examples.slice(0, 2).map((example, idx) => (
                      <li key={idx} className="text-sm text-gray-600 italic">
                        "{example}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Synonyms */}
          {result.synonyms && (result.synonyms.simple.length > 0 || result.synonyms.complex.length > 0) && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Synonyms:</h4>
              <div className="flex flex-wrap gap-1">
                {[...result.synonyms.simple, ...result.synonyms.complex].slice(0, 6).map((synonym, idx) => (
                  <span 
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Usage Note */}
          {result.usage_note && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Usage Note:</h4>
              <p className="text-sm text-yellow-700">{result.usage_note}</p>
            </div>
          )}

          {/* Context Analysis */}
          {result.context_analysis && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Context Analysis:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {result.context_analysis.literary_period && (
                  <div>
                    <span className="font-medium text-blue-700">Period:</span>
                    <span className="text-blue-600 ml-1">{result.context_analysis.literary_period}</span>
                  </div>
                )}
                {result.context_analysis.formality_level && (
                  <div>
                    <span className="font-medium text-blue-700">Formality:</span>
                    <span className="text-blue-600 ml-1">{result.context_analysis.formality_level}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Etymology */}
          {result.etymology && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Etymology:</h4>
              <p className="text-sm text-gray-600">{result.etymology}</p>
            </div>
          )}

          {/* Other Definitions */}
          {result.other_definitions && result.other_definitions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Other Definitions:</h4>
              <div className="space-y-2">
                {result.other_definitions.slice(0, 2).map((def, idx) => (
                  <div key={idx} className="border-l-2 border-gray-200 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {def.part_of_speech}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{def.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Click outside to close • Powered by AI vocabulary analysis
          </p>
        </div>
      </div>
    </>
  );
};

export default VocabularyPopup;