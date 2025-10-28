import { useState } from 'react';
import toast from 'react-hot-toast';

interface StoryUploaderProps {
  onStoryUploaded: (story: { title: string; content: string; author: string }) => void;
  onCancel: () => void;
}

export default function StoryUploader({ onStoryUploaded, onCancel }: StoryUploaderProps) {
  const [story, setStory] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file'>('paste');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      toast.error('Please upload a .txt, .doc, or .docx file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setStory({ ...story, content });
      toast.success('File content loaded successfully!');
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!story.title.trim()) {
      toast.error('Please enter a story title');
      return;
    }

    if (!story.content.trim()) {
      toast.error('Please provide story content');
      return;
    }

    if (!story.author.trim()) {
      toast.error('Please enter the author name');
      return;
    }

    toast.success('Story uploaded successfully!');
    onStoryUploaded(story);
  };

  const wordCount = story.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min

  return (
    <div className="space-y-6">
      {/* Demo Badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
        <span className="text-xl">📚</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-800">Upload Existing Story</p>
          <p className="text-xs text-blue-700">Add a story from your library or external source</p>
        </div>
      </div>

      {/* Upload Method Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setUploadMethod('paste')}
            className={`p-3 rounded-lg border-2 transition-all font-medium ${
              uploadMethod === 'paste'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            📝 Paste Text
          </button>
          <button
            onClick={() => setUploadMethod('file')}
            className={`p-3 rounded-lg border-2 transition-all font-medium ${
              uploadMethod === 'file'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            📄 Upload File
          </button>
        </div>
      </div>

      {/* Story Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Story Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={story.title}
          onChange={(e) => setStory({ ...story, title: e.target.value })}
          placeholder="Enter story title..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={story.author}
          onChange={(e) => setStory({ ...story, author: e.target.value })}
          placeholder="Enter author name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Story Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Story Content <span className="text-red-500">*</span>
        </label>

        {uploadMethod === 'paste' ? (
          <textarea
            value={story.content}
            onChange={(e) => setStory({ ...story, content: e.target.value })}
            placeholder="Paste your story content here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            rows={12}
          />
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="text-5xl">📁</div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  .txt, .doc, or .docx files
                </p>
              </div>
            </label>
            {story.content && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ File loaded successfully</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Story Stats */}
      {story.content && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Story Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Word Count</p>
              <p className="text-lg font-semibold text-gray-900">{wordCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Est. Reading Time</p>
              <p className="text-lg font-semibold text-gray-900">{estimatedReadingTime} min</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>📤</span>
          Upload Story
        </button>
      </div>
    </div>
  );
}
