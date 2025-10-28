import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AIStoryGeneratorES from './AIStoryGenerator.es';
import StoryUploaderES from './StoryUploader.es';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  progress: number;
  avgScore: number;
  toefl: number;
  weeklyMinutes: number;
  lastActivity: string;
  storiesCompleted: number;
  strugglingWith: string;
  strength: string;
}

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export default function CreateAssignmentModalES({ isOpen, onClose, students }: CreateAssignmentModalProps) {
  const [step, setStep] = useState<'select-method' | 'ai-generate' | 'upload' | 'vowel-lesson' | 'grammar-assignment' | 'assign'>('select-method');
  const [generatedStory, setGeneratedStory] = useState<{ title: string; content: string; author: string } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [assignmentType, setAssignmentType] = useState<'story' | 'vowel' | 'grammar'>('story');
  const [recommendedVowel, setRecommendedVowel] = useState<string>('');
  const [recommendedGrammar, setRecommendedGrammar] = useState<string>('');

  // Set default due date to one week from today
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [assignmentDetails, setAssignmentDetails] = useState({
    dueDate: getDefaultDueDate(),
    instructions: '',
    difficulty: 3
  });

  // Analyze students on mount to determine recommended lessons
  useEffect(() => {
    if (!isOpen) return;

    // Analyze student struggles to recommend vowel lesson
    const vowelStrugglers = students.filter(s => {
      const struggles = s.strugglingWith.toLowerCase();
      return struggles.includes('pronunciación') ||
             struggles.includes('habla') ||
             struggles.includes('fonética') ||
             struggles.includes('vocal');
    });

    if (vowelStrugglers.length > 0) {
      // Recommend Vocal A as it's most common
      setRecommendedVowel('Vocal A (casa, papa)');
    }

    // Analyze student struggles to recommend grammar topic
    const grammarCounts: { [key: string]: number } = {};
    students.forEach(s => {
      const struggles = s.strugglingWith.toLowerCase();
      if (struggles.includes('pretérito')) {
        grammarCounts['Pretérito Simple'] = (grammarCounts['Pretérito Simple'] || 0) + 1;
      }
      if (struggles.includes('subjuntivo')) {
        grammarCounts['Modo Subjuntivo'] = (grammarCounts['Modo Subjuntivo'] || 0) + 1;
      }
      if (struggles.includes('ser') || struggles.includes('estar')) {
        grammarCounts['Ser vs Estar'] = (grammarCounts['Ser vs Estar'] || 0) + 1;
      }
      if (struggles.includes('por') || struggles.includes('para')) {
        grammarCounts['Por vs Para'] = (grammarCounts['Por vs Para'] || 0) + 1;
      }
      if (struggles.includes('verbo') || struggles.includes('gramática')) {
        grammarCounts['Presente Simple'] = (grammarCounts['Presente Simple'] || 0) + 1;
      }
    });

    // Find the grammar topic with most struggling students
    const topGrammar = Object.entries(grammarCounts).sort((a, b) => b[1] - a[1])[0];
    if (topGrammar) {
      setRecommendedGrammar(topGrammar[0]);
    }
  }, [isOpen, students]);

  // Auto-select students who struggle with the story's topic
  const autoSelectStudents = (story: { title: string; content: string; author: string }) => {
    // Extract key topics from the story title and content
    const storyText = (story.title + ' ' + story.content).toLowerCase();

    // Find students who struggle with topics related to the story
    const strugglingStudents = students.filter(student => {
      const struggles = student.strugglingWith.toLowerCase();

      // Check for vowel-related struggles (Spanish)
      if (storyText.includes('vocal') || storyText.includes('pronunciación')) {
        if (struggles.includes('pronunciación') || struggles.includes('habla') ||
            struggles.includes('fonética') || struggles.includes('vocal')) return true;
      }

      // Check for specific Spanish vowel sounds
      if ((storyText.includes('vocal: a') || storyText.includes('lección de vocal')) &&
          (struggles.includes('vocal') || struggles.includes('pronunciación'))) return true;

      // Check for grammar-related struggles (Spanish)
      if (storyText.includes('gramática') || storyText.includes('práctica de gramática')) {
        if (struggles.includes('gramática') || struggles.includes('verbo') ||
            struggles.includes('conjugación') || struggles.includes('tiempo')) return true;
      }

      // Check for specific Spanish grammar topics
      if (storyText.includes('presente simple') && (struggles.includes('presente') || struggles.includes('verbo'))) return true;
      if (storyText.includes('pretérito') && struggles.includes('pretérito')) return true;
      if (storyText.includes('presente continuo') && struggles.includes('presente')) return true;
      if (storyText.includes('subjuntivo') && struggles.includes('subjuntivo')) return true;
      if (storyText.includes('ser vs estar') && (struggles.includes('ser') || struggles.includes('estar'))) return true;
      if (storyText.includes('por vs para') && (struggles.includes('por') || struggles.includes('para'))) return true;
      if (storyText.includes('comparativos') && struggles.includes('gramática')) return true;
      if (storyText.includes('concordancia') && struggles.includes('verbo')) return true;

      // Check for common Spanish grammar topics
      if (storyText.includes('verbo') && struggles.includes('verbo')) return true;
      if (storyText.includes('gramática') && struggles.includes('gramática')) return true;
      if (storyText.includes('ser') && struggles.includes('ser')) return true;
      if (storyText.includes('estar') && struggles.includes('estar')) return true;
      if (storyText.includes('por') && struggles.includes('por')) return true;
      if (storyText.includes('para') && struggles.includes('para')) return true;

      // Auto-select at-risk students with low progress
      if (student.status === 'En Riesgo' || student.progress < 50) return true;

      // Auto-select students with low weekly minutes (need more practice)
      if (student.weeklyMinutes < 30) return true;

      return false;
    }).map(s => s.id);

    // Limit to maximum 4 students to avoid overwhelming
    setSelectedStudents(strugglingStudents.slice(0, 4));
  };

  const handleStoryCreated = (story: { title: string; content: string; author: string }) => {
    setGeneratedStory(story);
    autoSelectStudents(story);
    setStep('assign');
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignStory = () => {
    if (selectedStudents.length === 0) {
      toast.error('Por favor selecciona al menos un estudiante');
      return;
    }

    if (!assignmentDetails.dueDate) {
      toast.error('Por favor establece una fecha de vencimiento');
      return;
    }

    const studentNames = students
      .filter(s => selectedStudents.includes(s.id))
      .map(s => s.name)
      .join(', ');

    toast.success(`¡Historia "${generatedStory?.title}" asignada a ${studentNames}!`);
    handleClose();
  };

  const handleClose = () => {
    setStep('select-method');
    setGeneratedStory(null);
    setSelectedStudents([]);
    setAssignmentDetails({ dueDate: getDefaultDueDate(), instructions: '', difficulty: 3 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-white">Crear Nueva Tarea</h2>
              <p className="text-purple-100 text-sm">
                {step === 'select-method' && 'Elige cómo crear tu historia'}
                {step === 'ai-generate' && 'Generar historia con IA'}
                {step === 'upload' && 'Subir historia existente'}
                {step === 'assign' && 'Asignar a estudiantes'}
              </p>
            </div>
            <button onClick={handleClose} className="text-white text-2xl hover:text-gray-200">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`flex items-center gap-2 ${step === 'select-method' ? 'text-purple-600' : step === 'assign' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 'select-method' ? 'bg-purple-100' : step === 'assign' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Elegir Método</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center gap-2 ${(step === 'ai-generate' || step === 'upload') ? 'text-purple-600' : step === 'assign' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${(step === 'ai-generate' || step === 'upload') ? 'bg-purple-100' : step === 'assign' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Crear Historia</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center gap-2 ${step === 'assign' ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 'assign' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Asignar</span>
                </div>
              </div>
            </div>

            {/* Select Method Step */}
            {step === 'select-method' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <button
                  onClick={() => {
                    setAssignmentType('story');
                    setStep('ai-generate');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">✨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Generar Historia con IA</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Crea una historia personalizada usando IA basada en tus requisitos, nivel de dificultad y áreas de enfoque.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Rápido</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Personalizable</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Adaptativo</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAssignmentType('story');
                    setStep('upload');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Subir Historia Existente</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Sube una historia de tu biblioteca o pega texto de una fuente externa.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Rápido</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Flexible</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Reutilizable</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAssignmentType('vowel');
                    setStep('vowel-lesson');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗣️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Crear Lección de Vocales</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Diseña una lección enfocada en pronunciación de vocales con ejercicios y actividades prácticas.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Pronunciación</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Habla</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Fonética</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAssignmentType('grammar');
                    setStep('grammar-assignment');
                  }}
                  className="group p-8 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Crear Tarea de Gramática</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Construye una tarea completa de gramática con reglas, ejemplos y ejercicios de práctica.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Gramática</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Estructura</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Escritura</span>
                  </div>
                </button>
              </motion.div>
            )}

            {/* AI Generate Step */}
            {step === 'ai-generate' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AIStoryGeneratorES
                  onStoryGenerated={handleStoryCreated}
                  onCancel={() => setStep('select-method')}
                />
              </motion.div>
            )}

            {/* Upload Step */}
            {step === 'upload' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StoryUploaderES
                  onStoryUploaded={handleStoryCreated}
                  onCancel={() => setStep('select-method')}
                />
              </motion.div>
            )}

            {/* Vowel Lesson Step */}
            {step === 'vowel-lesson' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-xl">🗣️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Lección de Pronunciación de Vocales</p>
                    <p className="text-xs text-green-700">Crea una lección enfocada en sonidos y pronunciación de vocales</p>
                  </div>
                </div>

                {recommendedVowel && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900 mb-1">Recomendación de IA</p>
                        <p className="text-sm text-blue-800">
                          Basado en las necesidades de los estudiantes, recomendamos la lección <strong>{recommendedVowel}</strong>.
                          Varios estudiantes tienen dificultades con la pronunciación y los sonidos vocales.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Sonido de Vocal</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Vocal A (casa, papa)', 'Vocal E (mesa, pelo)', 'Vocal I (niño, silla)', 'Vocal O (boca, oso)', 'Vocal U (uva, luna)'].map((vowel) => {
                      const isRecommended = vowel === recommendedVowel;
                      return (
                        <button
                          key={vowel}
                          onClick={() => {
                            const lessonContent = {
                              title: `Lección de ${vowel.split(' (')[0]}`,
                              content: `Practica el sonido de ${vowel} con estas palabras y actividades:\n\nPalabras para practicar:\n• ${vowel.match(/\(([^)]+)\)/)?.[1]}\n\nActividades:\n1. Escucha y repite\n2. Identifica el sonido en oraciones\n3. Practica con pares mínimos\n4. Grábate practicando`,
                              author: 'Creado por Profesor'
                            };
                            handleStoryCreated(lessonContent);
                          }}
                          className={`p-4 bg-white border-2 rounded-lg hover:shadow-md transition-all text-left relative ${
                            isRecommended
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-green-500'
                          }`}
                        >
                          {isRecommended && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              Recomendado
                            </div>
                          )}
                          <div className="font-semibold text-gray-900 text-sm">{vowel.split(' (')[0]}</div>
                          <div className="text-xs text-gray-600 mt-1">{vowel.match(/\(([^)]+)\)/)?.[1]}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setStep('select-method')}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}

            {/* Grammar Assignment Step */}
            {step === 'grammar-assignment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">Tarea de Gramática</p>
                    <p className="text-xs text-orange-700">Crea una tarea completa de práctica de gramática</p>
                  </div>
                </div>

                {recommendedGrammar && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900 mb-1">Recomendación de IA</p>
                        <p className="text-sm text-blue-800">
                          Basado en las necesidades de los estudiantes, recomendamos la tarea de <strong>{recommendedGrammar}</strong>.
                          Múltiples estudiantes tienen dificultades con este concepto gramatical.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Tema de Gramática</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { topic: 'Presente Simple', desc: 'Rutinas y hábitos diarios' },
                      { topic: 'Pretérito Simple', desc: 'Acciones completadas en el pasado' },
                      { topic: 'Presente Continuo', desc: 'Acciones que ocurren ahora' },
                      { topic: 'Modo Subjuntivo', desc: 'Deseos, dudas y emociones' },
                      { topic: 'Ser vs Estar', desc: 'Usos y diferencias' },
                      { topic: 'Por vs Para', desc: 'Preposiciones y sus usos' },
                      { topic: 'Comparativos y Superlativos', desc: 'Comparar cosas' },
                      { topic: 'Concordancia Sujeto-Verbo', desc: 'Formas singular y plural' },
                    ].map((item) => {
                      const isRecommended = item.topic === recommendedGrammar;
                      return (
                        <button
                          key={item.topic}
                          onClick={() => {
                            const grammarContent = {
                              title: `Práctica de Gramática: ${item.topic}`,
                              content: `Completa ejercicios de gramática sobre ${item.topic}\n\n${item.desc}\n\nEjercicios:\n1. Completar los espacios (10 preguntas)\n2. Corrección de errores (5 oraciones)\n3. Crear tus propias oraciones (5 ejemplos)\n4. Práctica de escritura usando la regla gramatical`,
                              author: 'Creado por Profesor'
                            };
                            handleStoryCreated(grammarContent);
                          }}
                          className={`p-4 bg-white border-2 rounded-lg hover:shadow-md transition-all text-left relative ${
                            isRecommended
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-orange-500'
                          }`}
                        >
                          {isRecommended && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              Recomendado
                            </div>
                          )}
                          <div className="font-semibold text-gray-900 text-sm">{item.topic}</div>
                          <div className="text-xs text-gray-600 mt-1">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setStep('select-method')}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}

            {/* Assign Step */}
            {step === 'assign' && generatedStory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Story Preview */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{generatedStory.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">por {generatedStory.author}</p>
                  <div className="bg-white rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedStory.content.substring(0, 300)}...</p>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Vencimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={assignmentDetails.dueDate}
                      onChange={(e) => setAssignmentDetails({ ...assignmentDetails, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrucciones para Estudiantes (Opcional)
                    </label>
                    <textarea
                      value={assignmentDetails.instructions}
                      onChange={(e) => setAssignmentDetails({ ...assignmentDetails, instructions: e.target.value })}
                      placeholder="Ej., Enfócate en el uso del pretérito mientras lees..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Estudiantes <span className="text-red-500">*</span>
                  </label>
                  {selectedStudents.length > 0 && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>{selectedStudents.length} estudiante{selectedStudents.length !== 1 ? 's' : ''}</strong> seleccionado{selectedStudents.length !== 1 ? 's' : ''} automáticamente según necesidades de aprendizaje y progreso
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                    {students.map((student) => {
                      const isAutoSelected = selectedStudents.includes(student.id);
                      return (
                        <label
                          key={student.id}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            isAutoSelected
                              ? 'bg-purple-50 border-purple-500'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isAutoSelected}
                            onChange={() => toggleStudentSelection(student.id)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{student.name}</p>
                              {student.status === 'En Riesgo' && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">En Riesgo</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              Progreso: {student.progress}% • Nivel: {student.toefl}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Dificultad con: {student.strugglingWith}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setStep('select-method')}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={handleAssignStory}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <span>✓</span>
                    Asignar a {selectedStudents.length} Estudiante{selectedStudents.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
