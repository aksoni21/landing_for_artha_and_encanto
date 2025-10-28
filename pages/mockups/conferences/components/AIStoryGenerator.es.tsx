import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AIStoryGeneratorProps {
  onStoryGenerated: (story: { title: string; content: string; author: string }) => void;
  onCancel: () => void;
}

export default function AIStoryGeneratorES({ onStoryGenerated, onCancel }: AIStoryGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState({
    difficulty_level: 3,
    word_count: 500,
    topic: '',
    focusAreas: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const difficultyLevels = [
    { value: 1, label: 'Principiante (A1)', color: 'bg-green-100 text-green-800' },
    { value: 2, label: 'Elemental (A2)', color: 'bg-lime-100 text-lime-800' },
    { value: 3, label: 'Intermedio (B1)', color: 'bg-blue-100 text-blue-800' },
    { value: 4, label: 'Intermedio Alto (B2)', color: 'bg-indigo-100 text-indigo-800' },
    { value: 5, label: 'Avanzado (C1)', color: 'bg-purple-100 text-purple-800' },
    { value: 6, label: 'Competente (C2)', color: 'bg-pink-100 text-pink-800' }
  ];

  const focusAreaOptions = [
    'Pretérito',
    'Subjuntivo',
    'Verbos Irregulares',
    'Ser vs Estar',
    'Por vs Para',
    'Vocabulario',
    'Modismos',
    'Español de Negocios',
    'Español Académico',
    'Conversación',
    'Gramática'
  ];

  const toggleFocusArea = (area: string) => {
    setSettings(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleGenerateStory = async () => {
    if (!prompt.trim() && !settings.topic.trim()) {
      toast.error('Por favor proporciona un tema o indicación para la historia');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with demo Spanish stories
    setTimeout(() => {
      const demoStories = [
        {
          title: 'La Llave Perdida',
          content: `María llegaba tarde al trabajo. Agarró su bolso y corrió hacia la puerta, pero algo estaba mal. La llave de su coche no estaba en su lugar habitual. Revisó sus bolsillos, su escritorio, e incluso la encimera de la cocina. Nada.

"¿Dónde la puse?" murmuró para sí misma. El tiempo corría, y su reunión comenzaría en veinte minutos.

Repasó sus pasos de la noche anterior. Recordó llegar a casa, preparar la cena y ver la televisión. Entonces se dio cuenta - ¡se había cambiado de ropa! Corrió a su dormitorio y encontró la llave en el bolsillo de su chaqueta.

Con un suspiro de alivio, María agarró la llave y salió. Llegó al trabajo justo a tiempo, aprendiendo una valiosa lección sobre siempre poner las cosas en su lugar apropiado.`,
          author: 'Generado por IA'
        },
        {
          title: 'Un Día en el Mercado',
          content: `Cada sábado por la mañana, Ana visita el mercado local. Los coloridos puestos están llenos de verduras frescas, pan casero y flores hermosas. Hoy, necesita ingredientes para su famosa sopa de tomate.

"¡Buenos días, Ana!" llamó el señor González desde su puesto de verduras. "Guardé los mejores tomates para ti."

Ana sonrió y examinó los tomates rojos brillantes. Eran perfectos. También compró albahaca fresca, cebollas y ajo. Mientras caminaba por el mercado, se encontró con varios vecinos y amigos.

El mercado no era solo para comprar; era sobre comunidad. La gente compartía recetas, hablaba de su semana y disfrutaba estar juntos. Ana amaba estas mañanas de sábado. Le recordaban que las cosas simples de la vida a menudo traen la mayor alegría.`,
          author: 'Generado por IA'
        },
        {
          title: 'El Primer Día',
          content: `Carlos respiró profundamente antes de entrar al edificio. Era su primer día en su nuevo trabajo, y sentía mariposas en el estómago. La oficina era moderna y luminosa, con gente trabajando en computadoras y charlando en pequeños grupos.

"¡Debes ser Carlos!" dijo una voz amigable. Una mujer con una sonrisa cálida se acercó a él. "Soy Jennifer, tu líder de equipo. ¡Bienvenido!"

Jennifer le mostró a Carlos la oficina, presentándole a sus nuevos colegas. Todos parecían agradables y acogedores. Para la hora del almuerzo, Carlos ya se sentía más cómodo.

Durante la tarde, trabajó en su primera tarea. Era desafiante pero emocionante. Cuando terminó el día, Carlos se dio cuenta de que sus preocupaciones habían sido innecesarias. A veces, los nuevos comienzos dan miedo, pero a menudo llevan a maravillosas oportunidades.`,
          author: 'Generado por IA'
        }
      ];

      const randomStory = demoStories[Math.floor(Math.random() * demoStories.length)];

      setIsGenerating(false);
      toast.success('¡Historia generada exitosamente!');
      onStoryGenerated(randomStory);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Demo Badge */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">Modo Demo</p>
          <p className="text-xs text-yellow-700">La generación de historias usará contenido demo pre-hecho</p>
        </div>
      </div>

      {/* Story Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tema o Indicación de la Historia
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej., Una historia sobre un estudiante aprendiendo a cocinar por primera vez..."
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nivel de Dificultad
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {difficultyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSettings({ ...settings, difficulty_level: level.value })}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                settings.difficulty_level === level.value
                  ? `${level.color} border-current`
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Word Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conteo Aproximado de Palabras: {settings.word_count}
        </label>
        <input
          type="range"
          min="200"
          max="1000"
          step="50"
          value={settings.word_count}
          onChange={(e) => setSettings({ ...settings, word_count: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 text-black rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>200 palabras</span>
          <span>1000 palabras</span>
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Áreas de Enfoque (Opcional)
        </label>
        <div className="flex flex-wrap gap-2">
          {focusAreaOptions.map((area) => (
            <button
              key={area}
              onClick={() => toggleFocusArea(area)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                settings.focusAreas.includes(area)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleGenerateStory}
          disabled={isGenerating}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generando Historia...
            </>
          ) : (
            <>
              <span>✨</span>
              Generar Historia con IA
            </>
          )}
        </button>
      </div>
    </div>
  );
}
