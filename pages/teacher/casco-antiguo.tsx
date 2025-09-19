import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Calendar, User, Mail, Play, Pause, Download, BarChart3, Clock, FileText, ExternalLink, Globe, X, Volume2 } from 'lucide-react';

interface AssessmentRecord {
  id: string;
  file_url: string;
  duration_seconds: number;
  processing_status: string;
  partner_name: string;
  student_name?: string;
  assessment_type: string;
  created_at: string;
  hour_uploaded: number;
}

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

const translations: Translations = {
  title: {
    en: 'Teacher Dashboard',
    es: 'Panel de Profesores'
  },
  subtitle: {
    en: 'Casco Antiguo Spanish School - Speaking Assessments',
    es: 'Casco Antiguo Spanish School - Evaluaciones de Expresión Oral'
  },
  loading: {
    en: 'Loading assessments...',
    es: 'Cargando evaluaciones...'
  },
  retry: {
    en: 'Retry',
    es: 'Reintentar'
  },
  refresh: {
    en: 'Refresh',
    es: 'Actualizar'
  },
  newAssessment: {
    en: 'New Assessment',
    es: 'Nueva Evaluación'
  },
  totalToday: {
    en: 'Total Today',
    es: 'Total Hoy'
  },
  completed: {
    en: 'Completed',
    es: 'Completadas'
  },
  processing: {
    en: 'Processing',
    es: 'Procesando'
  },
  averageDuration: {
    en: 'Average Duration',
    es: 'Duración Promedio'
  },
  recentAssessments: {
    en: 'Recent Assessments',
    es: 'Evaluaciones Recientes'
  },
  assessmentsSubtitle: {
    en: 'Student assessments from today',
    es: 'Evaluaciones de estudiantes del día de hoy'
  },
  noAssessments: {
    en: 'No assessments found for today',
    es: 'No se encontraron evaluaciones para hoy'
  },
  assessmentLink: {
    en: 'Students can take assessments at:',
    es: 'Los estudiantes pueden realizar evaluaciones en:'
  },
  assessmentLinkText: {
    en: 'assessment link',
    es: 'enlace de evaluación'
  },
  student: {
    en: 'Student',
    es: 'Estudiante'
  },
  dateTime: {
    en: 'Date/Time',
    es: 'Fecha/Hora'
  },
  duration: {
    en: 'Duration',
    es: 'Duración'
  },
  status: {
    en: 'Status',
    es: 'Estado'
  },
  actions: {
    en: 'Actions',
    es: 'Acciones'
  },
  anonymous: {
    en: 'Anonymous',
    es: 'Anónimo'
  },
  statusCompleted: {
    en: 'Completed',
    es: 'Completada'
  },
  statusProcessing: {
    en: 'Processing',
    es: 'Procesando'
  },
  statusError: {
    en: 'Error',
    es: 'Error'
  },
  audio: {
    en: 'Audio',
    es: 'Audio'
  },
  results: {
    en: 'Results',
    es: 'Resultados'
  },
  instructionsTitle: {
    en: 'Instructions for Teachers',
    es: 'Instrucciones para Profesores'
  },
  instructionAssessmentLink: {
    en: 'Assessment link for students:',
    es: 'Enlace de evaluación para estudiantes:'
  },
  instructionAudio: {
    en: 'Audio: Click "Audio" to listen to the student recording',
    es: 'Audio: Haz clic en "Audio" para escuchar la grabación del estudiante'
  },
  instructionResults: {
    en: 'Results: Click "Results" to view complete analysis (only available when completed)',
    es: 'Resultados: Haz clic en "Resultados" para ver el análisis completo (solo disponible cuando está completada)'
  },
  instructionRefresh: {
    en: 'Auto-refresh: Page updates automatically, or use the "Refresh" button',
    es: 'Actualización automática: La página se actualiza automáticamente, o usa el botón "Actualizar"'
  }
};

const CascoAntiguoTeacherDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('es');

  // Audio modal state
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<AssessmentRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the existing endpoint that filters for partner assessments
      const response = await fetch('http://localhost:8000/api/audio/today-uploads');

      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const data = await response.json();

      // Filter for Casco Antiguo assessments
      const cascoAssessments = (data.uploads || []).filter((assessment: AssessmentRecord) =>
        assessment.partner_name === 'Casco Antiguo Spanish School' ||
        assessment.assessment_type === 'partner_assessment'
      );

      setAssessments(cascoAssessments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return new Date(dateString).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openAudioModal = (assessment: AssessmentRecord) => {
    setCurrentAudio(assessment);
    setAudioModalOpen(true);
    setIsPlaying(false);
  };

  const closeAudioModal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioModalOpen(false);
    setCurrentAudio(null);
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const viewResults = async (recordingId: string) => {
    try {
      // Try to open results directly
      const resultsUrl = `/api/audio/results/${recordingId}`;

      // Test if results are available first
      const response = await fetch(resultsUrl);

      if (response.ok) {
        window.open(resultsUrl, '_blank');
      } else {
        // Show user-friendly error message
        const errorData = await response.json().catch(() => ({}));

        const message = language === 'es'
          ? `Resultados no disponibles aún. \nEstado: ${errorData.detail || 'Error desconocido'}\nID: ${recordingId}`
          : `Results not available yet. \nStatus: ${errorData.detail || 'Unknown error'}\nID: ${recordingId}`;

        alert(message);
      }
    } catch (error) {
      console.error('Error viewing results:', error);
      const message = language === 'es'
        ? 'Error al cargar los resultados. Por favor intenta de nuevo más tarde.'
        : 'Error loading results. Please try again later.';

      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchAssessments}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  const completedAssessments = assessments.filter(a => a.processing_status === 'completed');
  const processingAssessments = assessments.filter(a => a.processing_status === 'processing');

  return (
    <>
      <Head>
        <title>{t('title')} - Casco Antiguo Spanish School</title>
        <meta name="description" content={t('subtitle')} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {t('title')}
                  </h1>
                  <p className="text-gray-600">{t('subtitle')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === 'es'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ES
                  </button>
                </div>

                <button
                  onClick={fetchAssessments}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <BarChart3 size={16} />
                  <span>{t('refresh')}</span>
                </button>
                <a
                  href="http://localhost:3000/?subdomain=casco-antiguo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <ExternalLink size={16} />
                  <span>{t('newAssessment')}</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('totalToday')}</p>
                  <p className="text-3xl font-bold text-gray-900">{assessments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('completed')}</p>
                  <p className="text-3xl font-bold text-green-600">{completedAssessments.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('processing')}</p>
                  <p className="text-3xl font-bold text-yellow-600">{processingAssessments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('averageDuration')}</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {assessments.length > 0 ?
                      formatDuration(assessments.reduce((sum, a) => sum + a.duration_seconds, 0) / assessments.length)
                      : '0:00'
                    }
                  </p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>
          </div>

          {/* Assessments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{t('recentAssessments')}</h2>
              <p className="text-sm text-gray-600">{t('assessmentsSubtitle')}</p>
            </div>

            {assessments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('noAssessments')}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {t('assessmentLink')}{' '}
                  <a
                    href="http://localhost:3000/?subdomain=casco-antiguo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 underline"
                  >
                    {t('assessmentLinkText')}
                  </a>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('student')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('dateTime')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('duration')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assessments.map((assessment) => (
                      <tr key={assessment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-8 w-8 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {assessment.student_name || t('anonymous')}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {assessment.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(assessment.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDuration(assessment.duration_seconds)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.processing_status)}`}>
                            {assessment.processing_status === 'completed' ? t('statusCompleted') :
                             assessment.processing_status === 'processing' ? t('statusProcessing') :
                             assessment.processing_status === 'failed' ? t('statusError') :
                             assessment.processing_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openAudioModal(assessment)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                          >
                            <Play size={14} />
                            <span>{t('audio')}</span>
                          </button>
                          {assessment.processing_status === 'completed' && (
                            <button
                              onClick={() => viewResults(assessment.id)}
                              className="text-green-600 hover:text-green-900 inline-flex items-center space-x-1"
                            >
                              <BarChart3 size={14} />
                              <span>{t('results')}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Instructions for Teachers */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-3">{t('instructionsTitle')}</h3>
            <div className="space-y-2 text-blue-700">
              <p>• <strong>{t('instructionAssessmentLink')}</strong> <code>localhost:3000/?subdomain=casco-antiguo</code></p>
              <p>• {t('instructionAudio')}</p>
              <p>• {t('instructionResults')}</p>
              <p>• {t('instructionRefresh')}</p>
            </div>
          </motion.div> */}
        </main>

        {/* Audio Modal */}
        {audioModalOpen && currentAudio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('audio')} - {currentAudio.student_name || t('anonymous')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(currentAudio.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeAudioModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Audio Player */}
              <div className="space-y-4">
                <audio
                  ref={audioRef}
                  src={currentAudio.file_url}
                  onEnded={handleAudioEnded}
                  className="w-full"
                  controls
                />

                {/* Custom Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={toggleAudio}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors flex items-center justify-center"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <div className="text-sm text-gray-600">
                    {t('duration')}: {formatDuration(currentAudio.duration_seconds)}
                  </div>
                </div>

                {/* Assessment Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">{t('student')}:</span>
                      <div className="font-medium text-gray-500">{currentAudio.student_name || t('anonymous')}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">{t('status')}:</span>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentAudio.processing_status)}`}>
                          {currentAudio.processing_status === 'completed' ? t('statusCompleted') :
                           currentAudio.processing_status === 'processing' ? t('statusProcessing') :
                           currentAudio.processing_status === 'failed' ? t('statusError') :
                           currentAudio.processing_status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">ID:</span>
                      <div className="font-mono text-xs text-gray-500">{currentAudio.id.slice(0, 8)}...</div>
                    </div>
                    <div>
                      <span className="text-gray-500">{t('duration')}:</span>
                      <div className="font-medium text-gray-500">{formatDuration(currentAudio.duration_seconds)}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  {/* <a
                    href={currentAudio.file_url}
                    download={`assessment_${currentAudio.id}.wav`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </a> */}

                  {currentAudio.processing_status === 'completed' && (
                    <button
                      onClick={() => {
                        viewResults(currentAudio.id);
                        closeAudioModal();
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <BarChart3 size={16} />
                      <span>{t('results')}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default CascoAntiguoTeacherDashboard;