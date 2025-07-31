import React from 'react';

interface RichExamplesProps {
  word: string;
  examples: string[];
  source: string;
}

const RichExamples: React.FC<RichExamplesProps> = ({ word, examples, source }) => {
  // Always show as a "Possible Feature" even if no examples are available yet

  const highlightWord = (text: string, targetWord: string) => {
    const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-blue-200 text-blue-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
        📚 Literary Examples (Possible Feature)
      </h4>
      
      <div className="space-y-3">
        {examples && examples.length > 0 ? (
          <>
            {examples.slice(0, 3).map((example, index) => (
              <div key={index} className="bg-white p-3 rounded border border-blue-100">
                <p className="text-sm text-gray-800 leading-relaxed italic">
                  "{highlightWord(example, word)}"
                </p>
              </div>
            ))}
            
            {examples.length > 3 && (
              <div className="text-xs text-blue-500 text-center">
                + {examples.length - 3} more examples available
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-3 rounded border border-blue-100">
            <p className="text-sm text-gray-800 leading-relaxed italic">
              "The building's high ceilings and <mark className="bg-blue-200 text-blue-900 px-1 rounded">{word}</mark> spaces create an impressive atmosphere."
            </p>
            <p className="text-xs text-blue-500 mt-2">📝 Demo example - Real examples would appear here</p>
          </div>
        )}
        
        <div className="text-xs text-blue-600 bg-white p-2 rounded border">
          <strong>Source:</strong> {source === 'webster' ? 'Merriam-Webster Dictionary' : 'Professional Dictionary'} - 
          Real usage examples from published literature and authoritative sources
        </div>
      </div>
    </div>
  );
};

export default RichExamples;