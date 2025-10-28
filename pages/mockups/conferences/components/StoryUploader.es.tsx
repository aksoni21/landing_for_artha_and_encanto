import { useState } from 'react';
import toast from 'react-hot-toast';

interface StoryUploaderProps {
  onStoryUploaded: (story: { title: string; content: string; author: string }) => void;
  onCancel: () => void;
}

export default function StoryUploaderES({ onStoryUploaded, onCancel }: StoryUploaderProps) {
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
      toast.error('Por favor sube un archivo .txt, .doc, o .docx');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setStory({ ...story, content });
      toast.success('¡Contenido del archivo cargado exitosamente!');
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!story.title.trim()) {
      toast.error('Por favor ingresa un título para la historia');
      return;
    }

    if (!story.content.trim()) {
      toast.error('Por favor proporciona el contenido de la historia');
      return;
    }

    if (!story.author.trim()) {
      toast.error('Por favor ingresa el nombre del autor');
      return;
    }

    toast.success('¡Historia subida exitosamente!');
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
          <p className="text-sm font-medium text-blue-800">Subir Historia Existente</p>
          <p className="text-xs text-blue-700">Agrega una historia de tu biblioteca o fuente externa</p>
        </div>
      </div>

      {/* Upload Method Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Método de Carga
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
            📝 Pegar Texto
          </button>
          <button
            onClick={() => setUploadMethod('file')}
            className={`p-3 rounded-lg border-2 transition-all font-medium ${
              uploadMethod === 'file'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            📄 Subir Archivo
          </button>
        </div>
      </div>

      {/* Story Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título de la Historia <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={story.title}
          onChange={(e) => setStory({ ...story, title: e.target.value })}
          placeholder="Ingresa el título de la historia..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Autor <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={story.author}
          onChange={(e) => setStory({ ...story, author: e.target.value })}
          placeholder="Ingresa el nombre del autor..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Story Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenido de la Historia <span className="text-red-500">*</span>
        </label>

        {uploadMethod === 'paste' ? (
          <textarea
            value={story.content}
            onChange={(e) => setStory({ ...story, content: e.target.value })}
            placeholder="Pega el contenido de tu historia aquí..."
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
                  Haz clic para subir o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Archivos .txt, .doc, o .docx
                </p>
              </div>
            </label>
            {story.content && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ Archivo cargado exitosamente</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Story Stats */}
      {story.content && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Estadísticas de la Historia</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Conteo de Palabras</p>
              <p className="text-lg font-semibold text-gray-900">{wordCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Tiempo Est. de Lectura</p>
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
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>📤</span>
          Subir Historia
        </button>
      </div>
    </div>
  );
}
