import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Download, CheckCircle, XCircle } from 'lucide-react';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

const translations: Translations = {
  // Header
  agentPlatform: { en: 'Agent Performance Platform', es: 'Plataforma de Desempeño de Agentes' },
  confidentialQA: { en: 'Confidential QA Report', es: 'Reporte QA Confidencial' },
  internalUse: { en: 'Internal Use Only', es: 'Solo Uso Interno' },
  assessmentComplete: { en: 'Assessment Complete', es: 'Evaluación Completa' },
  // Candidate info
  candidate: { en: 'Candidate', es: 'Candidato' },
  email: { en: 'Email', es: 'Correo' },
  assessmentDate: { en: 'Assessment Date', es: 'Fecha de Evaluación' },
  rolePlayAssessment: { en: 'Role-Play Assessment', es: 'Evaluación de Simulación' },
  // Overall score
  overallPerformance: { en: 'Overall Performance Score', es: 'Puntuación General de Desempeño' },
  excellentPerformance: { en: 'Excellent Agent Performance', es: 'Excelente Desempeño del Agente' },
  scoreDescription: { en: 'Strong performance across all key metrics with clear brand alignment', es: 'Desempeño sólido en todas las métricas clave con clara alineación de marca' },
  // Performance breakdown
  performanceBreakdown: { en: 'Performance Breakdown', es: 'Desglose de Desempeño' },
  clarityPronunciation: { en: 'Clarity & Pronunciation', es: 'Claridad y Pronunciación' },
  speechClarity: { en: 'Speech clarity and articulation', es: 'Claridad del habla y articulación' },
  professionalismTone: { en: 'Professionalism & Tone', es: 'Profesionalismo y Tono' },
  professionalDemeanor: { en: 'Professional demeanor', es: 'Comportamiento profesional' },
  empathyBrand: { en: 'Empathy & Brand Alignment', es: 'Empatía y Alineación de Marca' },
  customerConnection: { en: 'Customer connection', es: 'Conexión con el cliente' },
  pacingConfidence: { en: 'Pacing & Confidence', es: 'Ritmo y Confianza' },
  communicationFlow: { en: 'Communication flow', es: 'Fluidez de comunicación' },
  // Video section
  recordedResponse: { en: 'Recorded Response', es: 'Respuesta Grabada' },
  sampleVideo: { en: 'Sample Video Response', es: 'Respuesta de Video de Muestra' },
  duration: { en: 'Duration', es: 'Duración' },
  transcript: { en: 'Transcript', es: 'Transcripción' },
  downloadVideo: { en: 'Download Video', es: 'Descargar Video' },
  // Keyword analysis
  keywordAnalysis: { en: 'Keyword Analysis', es: 'Análisis de Palabras Clave' },
  scenario: { en: 'Scenario', es: 'Escenario' },
  completionRate: { en: 'Completion Rate', es: 'Tasa de Completitud' },
  // Competitive comparison
  whyDifferent: { en: 'Why This Assessment is Different', es: 'Por Qué Esta Evaluación es Diferente' },
  traditionalTest: { en: 'Traditional English Test', es: 'Prueba Tradicional de Inglés' },
  overallScore: { en: 'Overall Score', es: 'Puntuación General' },
  thisCandidate: { en: 'This candidate scores', es: 'Este candidato obtiene' },
  inEnglish: { en: 'in English proficiency', es: 'en dominio del inglés' },
  noInsight: { en: 'No insight into empathy or customer service skills', es: 'Sin información sobre empatía o habilidades de servicio al cliente' },
  noMeasure: { en: 'Doesn\'t measure brand alignment or professional tone', es: 'No mide alineación de marca o tono profesional' },
  oneDimensional: { en: 'One-dimensional scoring provides limited coaching insight', es: 'Puntuación unidimensional proporciona información limitada para coaching' },
  noVerify: { en: 'No way to verify actual communication in job context', es: 'Sin forma de verificar comunicación real en contexto laboral' },
  ssgPlatform: { en: 'SSG Performance Platform', es: 'Plataforma de Desempeño SSG' },
  measuresEmpathy: { en: 'Measures empathy & customer connection', es: 'Mide empatía y conexión con el cliente' },
  testsBrand: { en: 'Tests brand alignment & professional tone', es: 'Prueba alineación de marca y tono profesional' },
  multiDimensional: { en: 'Multi-dimensional scores enable targeted coaching', es: 'Puntuaciones multidimensionales permiten coaching dirigido' },
  rolePlaySimulation: { en: 'Role-play simulation shows real job performance', es: 'Simulación de rol muestra desempeño laboral real' },
  ssgAdvantage: { en: 'The SSG Advantage', es: 'La Ventaja SSG' },
  traditionalTell: { en: 'Traditional English assessments tell you', es: 'Las evaluaciones tradicionales de inglés te dicen' },
  ifSpeakEnglish: { en: 'if someone can speak English', es: 'si alguien puede hablar inglés' },
  platformTells: { en: 'The SSG Agent Performance Platform tells you', es: 'La Plataforma de Desempeño de Agentes SSG te dice' },
  howWellPerform: { en: 'how well they will perform their job', es: 'qué tan bien realizarán su trabajo' },
  measuringSkills: { en: 'measuring the skills your clients actually care about: empathy, brand alignment, and effective customer communication.', es: 'midiendo las habilidades que a tus clientes realmente les importan: empatía, alineación de marca y comunicación efectiva con el cliente.' },
  // Strengths and development
  keyStrengths: { en: 'Key Strengths', es: 'Fortalezas Clave' },
  coachingOpportunities: { en: 'Coaching Opportunities', es: 'Oportunidades de Coaching' },
  // QA assessment
  qaAssessment: { en: 'QA Assessment: APPROVED', es: 'Evaluación QA: APROBADO' },
  recommendedFor: { en: 'Recommended for Client Assignment', es: 'Recomendado para Asignación a Cliente' },
  demonstrates: { en: 'demonstrates excellent performance across all key agent metrics. Strong empathy, clear communication, and professional tone make this candidate well-suited for premium brand representation. Keyword analysis shows solid execution of critical service recovery elements.', es: 'demuestra excelente desempeño en todas las métricas clave del agente. Fuerte empatía, comunicación clara y tono profesional hacen que este candidato sea adecuado para representación de marca premium. El análisis de palabras clave muestra sólida ejecución de elementos críticos de recuperación de servicio.' },
  readyForAssignment: { en: 'Ready for immediate client assignment', es: 'Listo para asignación inmediata a cliente' },
  minimalCoaching: { en: 'Minimal coaching required', es: 'Coaching mínimo requerido' },
  // Footer
  confidentialPlatform: { en: 'Agent Performance Platform - Confidential', es: 'Plataforma de Desempeño de Agentes - Confidencial' },
  privacyPolicy: { en: 'Privacy Policy', es: 'Política de Privacidad' },
  clearDemoData: { en: 'Clear Demo Data', es: 'Limpiar Datos de Demo' }
};

// Bilingual keyword analysis
const getScenarioKeywords = (language: 'en' | 'es'): ScenarioKeywords[] => [
  {
    role: language === 'en' ? 'Customer Care - Consumer Electronics' : 'Atención al Cliente - Electrónica de Consumo',
    keywords: [
      { label: language === 'en' ? 'Acknowledged Customer Frustration' : 'Reconoció Frustración del Cliente', checked: true },
      { label: language === 'en' ? 'Expressed Empathy/Apologized' : 'Expresó Empatía/Disculpó', checked: true },
      { label: language === 'en' ? 'Offered Clear Resolution Path' : 'Ofreció Camino de Resolución Claro', checked: true },
      { label: language === 'en' ? 'Set Expectations for Next Steps' : 'Estableció Expectativas para Próximos Pasos', checked: false },
      { label: language === 'en' ? 'Maintained Professional Tone' : 'Mantuvo Tono Profesional', checked: true },
      { label: language === 'en' ? 'Used Brand-Appropriate Language' : 'Usó Lenguaje Apropiado de Marca', checked: true }
    ]
  },
  {
    role: language === 'en' ? 'B2B Sales - Retail E-commerce' : 'Ventas B2B - E-commerce Minorista',
    keywords: [
      { label: language === 'en' ? 'Professional Opening/Greeting' : 'Apertura/Saludo Profesional', checked: true },
      { label: language === 'en' ? 'Referenced Previous Conversation' : 'Hizo Referencia a Conversación Previa', checked: true },
      { label: language === 'en' ? 'Asked Qualifying Questions' : 'Hizo Preguntas Calificativas', checked: false },
      { label: language === 'en' ? 'Highlighted Clear Value Proposition' : 'Destacó Propuesta de Valor Clara', checked: true },
      { label: language === 'en' ? 'Created Urgency/Next Steps' : 'Creó Urgencia/Próximos Pasos', checked: true },
      { label: language === 'en' ? 'Professional Close with Timeline' : 'Cierre Profesional con Cronograma', checked: true }
    ]
  }
];

// Bilingual mock data
const getMockData = (language: 'en' | 'es') => ({
  candidate: {
    name: 'Jessica Martinez',
    email: 'jessica.martinez@email.com',
    role: language === 'en' ? 'Customer Care - Consumer Electronics' : 'Atención al Cliente - Electrónica de Consumo',
    assessmentDate: language === 'en' ? 'October 2, 2025' : '2 de Octubre, 2025'
  },
  videoUrl: '#',
  transcript: language === 'en'
    ? 'I completely understand how frustrating it must be to have a brand new television with a line across the screen. I sincerely apologize for this experience. What I\'d like to do right away is arrange for a replacement unit to be shipped to you, and we\'ll also provide a prepaid return label for the defective TV. I can have the new unit to you within 2 business days. Would that work for you? I want to make sure we get this resolved as quickly as possible.'
    : 'Comprendo completamente lo frustrante que debe ser tener un televisor nuevo con una línea en la pantalla. Me disculpo sinceramente por esta experiencia. Lo que me gustaría hacer de inmediato es organizar el envío de una unidad de reemplazo, y también proporcionaremos una etiqueta de devolución prepagada para el TV defectuoso. Puedo tener la nueva unidad en 2 días hábiles. ¿Le funcionaría eso? Quiero asegurarme de que resolvamos esto lo más rápido posible.',
  performance: {
    overall_score: 9.2,
    sub_scores: {
      clarity_pronunciation: 9.5,
      professionalism_tone: 9.0,
      empathy_brand: 8.8,
      pacing_confidence: 9.3
    },
    strengths: language === 'en' ? [
      'Excellent empathy and acknowledgment of customer frustration',
      'Clear articulation of resolution steps with specific timeline',
      'Maintained professional, calm tone throughout response',
      'Strong brand alignment with customer-first language'
    ] : [
      'Excelente empatía y reconocimiento de la frustración del cliente',
      'Articulación clara de pasos de resolución con cronograma específico',
      'Mantuvo tono profesional y calmado durante toda la respuesta',
      'Fuerte alineación de marca con lenguaje centrado en el cliente'
    ],
    areas_for_development: language === 'en' ? [
      'Could strengthen call-to-action with more explicit next step confirmation',
      'Consider adding brief explanation of why issue occurred (builds trust)'
    ] : [
      'Podría fortalecer la llamada a la acción con confirmación de próximo paso más explícita',
      'Considerar agregar breve explicación de por qué ocurrió el problema (genera confianza)'
    ]
  }
});

interface KeywordCheck {
  label: string;
  checked: boolean;
}

interface ScenarioKeywords {
  role: string;
  keywords: KeywordCheck[];
}

const SSGResultsPage: React.FC = () => {
  const [language, setLanguage] = React.useState<'en' | 'es'>('en');
  const [videoUrl, setVideoUrl] = React.useState<string>('');
  const [selectedScenario, setSelectedScenario] = React.useState(0);

  // Translation helper
  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  // Get data based on current language
  const scenarioKeywords = getScenarioKeywords(language);
  const mockData = getMockData(language);

  React.useEffect(() => {
    // Load video, scenario, and language from localStorage
    const savedVideo = localStorage.getItem('ssg_demo_video');
    const savedScenario = localStorage.getItem('ssg_demo_scenario');
    const savedLanguage = localStorage.getItem('ssg_language');

    if (savedVideo) {
      setVideoUrl(savedVideo);
    }
    if (savedScenario) {
      setSelectedScenario(parseInt(savedScenario));
    }
    if (savedLanguage === 'en' || savedLanguage === 'es') {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (newLang: 'en' | 'es') => {
    setLanguage(newLang);
    localStorage.setItem('ssg_language', newLang);
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'agent-assessment-video.webm';
      link.click();
    } else {
      alert('Video download initiated (demo functionality)');
    }
  };

  const clearDemoData = () => {
    if (confirm('This will clear all demo video data from localStorage. Continue?')) {
      localStorage.removeItem('ssg_demo_video');
      localStorage.removeItem('ssg_demo_scenario');
      setVideoUrl('');
      alert('Demo data cleared successfully!');
    }
  };

  // Calculate percentage for radial charts
  const getRadialPercentage = (score: number) => {
    return (score / 10) * 100;
  };

  return (
    <>
      <Head>
        <title>Agent Performance Report - {mockData.candidate.name} | SSG</title>
        <meta name="description" content="Agent Performance QA Dashboard" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-xl border-b border-gray-200 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-4 py-6  ">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">SSG</span>
                </div>
                <div >
                  <h1 className="hidden sm:block text-2xl font-bold text-gray-900">Support Services Group</h1>
                  <p className="text-lg text-purple-600 font-medium">{t('agentPlatform')}</p>
                </div>
              </div>
              <div className="flex items-center ">
                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('es')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === 'es'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ES
                  </button>
                </div>
                <div className="text-right">
                  {/* <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 rounded-lg border border-purple-200 mb-2">
                    <p className="text-sm font-semibold text-gray-700">{t('confidentialQA')}</p>
                    <p className="text-xs text-gray-500">{t('internalUse')}</p>
                  </div> */}
                  {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
                    <p className="text-xs font-semibold text-green-800">✓ {t('assessmentComplete')}</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className=" mx-auto px-4 py-4">
          {/* Back Button */}
          <div className="mb-6">
            <a
              href="/ssg"
              className="  inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {language === 'en' ? 'Back to Assessment' : 'Volver a Evaluación'}
            </a>
          </div>

          {/* Candidate Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4"></div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {mockData.candidate.name}
                  </h2>
                </div>
                <p className="text-xl text-gray-700 mb-2">{mockData.candidate.role}</p>
              </div>
              <div className="sm:block hidden bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-xl shadow-lg">
                <span className="text-white font-bold text-lg">Role-Play Assessment</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Candidate</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-pink-700">Email</p>
                    <p className="font-bold text-gray-900 text-sm">{mockData.candidate.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-700">Assessment Date</p>
                    <p className="font-bold text-gray-900">{mockData.candidate.assessmentDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* {t('overallPerformance')} - Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-2xl p-10 mb-8 text-white"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3 opacity-90">{t('overallPerformance')}</h2>
              <div className="text-8xl font-black mb-4 drop-shadow-lg">
                {mockData.performance.overall_score}
                <span className="text-5xl opacity-80">/10</span>
              </div>
              <p className="text-xl font-medium opacity-90">{t('excellentPerformance')}</p>
              <p className="text-sm mt-2 opacity-75">Strong performance across all key metrics with clear brand alignment</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column: Sub-Scores */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Sub-Scores */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                className="bg-white rounded-xl shadow-xl p-8 border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-800">{t('performanceBreakdown')}</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Clarity & Pronunciation */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Clarity & Pronunciation</h4>
                        <p className="text-sm text-blue-700">Speech clarity and articulation</p>
                      </div>
                      <div className="text-3xl">🗣️</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Radial Progress */}
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-blue-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - getRadialPercentage(mockData.performance.sub_scores.clarity_pronunciation) / 100)}`}
                            className="text-blue-600 transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-900">{mockData.performance.sub_scores.clarity_pronunciation}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-blue-900 mb-1">
                          {mockData.performance.sub_scores.clarity_pronunciation}/10
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${getRadialPercentage(mockData.performance.sub_scores.clarity_pronunciation)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professionalism & Tone */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Professionalism & Tone</h4>
                        <p className="text-sm text-purple-700">Professional demeanor</p>
                      </div>
                      <div className="text-3xl">💼</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Radial Progress */}
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-purple-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - getRadialPercentage(mockData.performance.sub_scores.professionalism_tone) / 100)}`}
                            className="text-purple-600 transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-900">{mockData.performance.sub_scores.professionalism_tone}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-purple-900 mb-1">
                          {mockData.performance.sub_scores.professionalism_tone}/10
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${getRadialPercentage(mockData.performance.sub_scores.professionalism_tone)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empathy & Brand Alignment */}
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Empathy & Brand Alignment</h4>
                        <p className="text-sm text-pink-700">Customer connection</p>
                      </div>
                      <div className="text-3xl">❤️</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Radial Progress */}
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-pink-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - getRadialPercentage(mockData.performance.sub_scores.empathy_brand) / 100)}`}
                            className="text-pink-600 transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-pink-900">{mockData.performance.sub_scores.empathy_brand}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-pink-900 mb-1">
                          {mockData.performance.sub_scores.empathy_brand}/10
                        </div>
                        <div className="w-full bg-pink-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${getRadialPercentage(mockData.performance.sub_scores.empathy_brand)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pacing & Confidence */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Pacing & Confidence</h4>
                        <p className="text-sm text-green-700">Communication flow</p>
                      </div>
                      <div className="text-3xl">⚡</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Radial Progress */}
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-green-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - getRadialPercentage(mockData.performance.sub_scores.pacing_confidence) / 100)}`}
                            className="text-green-600 transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-900">{mockData.performance.sub_scores.pacing_confidence}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-green-900 mb-1">
                          {mockData.performance.sub_scores.pacing_confidence}/10
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${getRadialPercentage(mockData.performance.sub_scores.pacing_confidence)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Video Player Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                className="bg-white rounded-xl shadow-xl p-8 border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-800">{t('recordedResponse')}</h3>
                </div>

                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-xl shadow-2xl border-2 border-gray-300 mb-4"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-16 border border-indigo-200 mb-4">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                      <p className="font-semibold text-gray-700 text-lg">Sample Video Response</p>
                      <p className="text-sm text-gray-500 mt-2">Duration: 1:45</p>
                    </div>
                  </div>
                )}

                {/* Transcript */}
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-3">Transcript</h4>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg p-5 border border-amber-200">
                    <p className="text-gray-700 leading-relaxed italic">
                      &quot;{mockData.transcript}&quot;
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex justify-end">
                  <button
                    onClick={downloadVideo}
                    className="flex items-center text-white space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-lg transition-all shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-semibold">Download Video</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: {t('keywordAnalysis')} */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 sticky top-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800">{t('keywordAnalysis')}</h3>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-lg p-4 mb-4 border border-teal-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Scenario:</span> {scenarioKeywords[selectedScenario].role}
                  </p>
                </div>

                <div className="space-y-3">
                  {scenarioKeywords[selectedScenario].keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        keyword.checked
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      {keyword.checked ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm font-medium ${
                        keyword.checked ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {keyword.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Completion Rate</span>
                    <span className="text-lg font-bold text-teal-600">
                      {scenarioKeywords[selectedScenario].keywords.filter(k => k.checked).length}/
                      {scenarioKeywords[selectedScenario].keywords.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(scenarioKeywords[selectedScenario].keywords.filter(k => k.checked).length / scenarioKeywords[selectedScenario].keywords.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Competitive Comparison Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800">{t('whyDifferent')}</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Traditional Assessment */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">📊</span>
                  <h4 className="font-bold text-gray-900 text-xl">Traditional English Test</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-center mb-2">
                      <div className="text-4xl font-bold text-gray-600">8.8</div>
                      <p className="text-sm text-gray-500">Overall Score</p>
                    </div>
                    <p className="text-xs text-gray-500 italic text-center">
                      &quot;This candidate scores 8.8 out of 10 in English proficiency&quot;
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 text-lg">❌</span>
                      <p className="text-sm text-gray-700">No insight into empathy or customer service skills</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 text-lg">❌</span>
                      <p className="text-sm text-gray-700">Doesn&apos;t measure brand alignment or professional tone</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 text-lg">❌</span>
                      <p className="text-sm text-gray-700">One-dimensional scoring provides limited coaching insight</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 text-lg">❌</span>
                      <p className="text-sm text-gray-700">No way to verify actual communication in job context</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SSG Multi-Dimensional Assessment */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border-2 border-purple-300 shadow-lg">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🎯</span>
                  <h4 className="font-bold text-gray-900 text-xl">SSG Performance Platform</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{mockData.performance.sub_scores.clarity_pronunciation}</div>
                        <p className="text-xs text-gray-600">Clarity</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{mockData.performance.sub_scores.professionalism_tone}</div>
                        <p className="text-xs text-gray-600">Professionalism</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-pink-600">{mockData.performance.sub_scores.empathy_brand}</div>
                        <p className="text-xs text-gray-600">Empathy</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-pink-600">{mockData.performance.sub_scores.pacing_confidence}</div>
                        <p className="text-xs text-gray-600">Confidence</p>
                      </div>
                    </div>
                    <div className="text-center pt-3 border-t border-purple-200">
                      <div className="text-3xl font-bold text-purple-600">{mockData.performance.overall_score}</div>
                      <p className="text-xs text-gray-600">Overall Performance</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 text-lg">✅</span>
                      <p className="text-sm text-gray-900 font-medium">Measures empathy & customer connection</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 text-lg">✅</span>
                      <p className="text-sm text-gray-900 font-medium">Tests brand alignment & professional tone</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 text-lg">✅</span>
                      <p className="text-sm text-gray-900 font-medium">Multi-dimensional scores enable targeted coaching</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 text-lg">✅</span>
                      <p className="text-sm text-gray-900 font-medium">Role-play simulation shows real job performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">💡</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">The SSG Advantage</h4>
                  <p className="text-gray-700">
                    Traditional English assessments tell you <span className="font-semibold italic">if someone can speak English</span>.
                    The SSG Agent Performance Platform tells you <span className="font-semibold text-purple-700">how well they will perform their job</span> –
                    measuring the skills your clients actually care about: empathy, brand alignment, and effective customer communication.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Strengths and Development Areas */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}
              className="bg-white rounded-xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-800">{t('keyStrengths')}</h3>
              </div>

              <div className="space-y-4">
                {mockData.performance.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-4 border border-green-200"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">✨</span>
                      <p className="text-gray-800 text-sm leading-relaxed">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Areas for Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              className="bg-white rounded-xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-800">{t('coachingOpportunities')}</h3>
              </div>

              <div className="space-y-4">
                {mockData.performance.areas_for_development.map((area, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">📈</span>
                      <p className="text-gray-800 text-sm leading-relaxed">{area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hiring Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.45 } }}
            className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border-2 border-green-300 p-8 mb-8 shadow-lg"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl">✓</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t('qaAssessment')}</h3>
                <p className="text-green-700 font-medium">Recommended for Client Assignment</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <p className="text-gray-800 leading-relaxed mb-4">
                <span className="font-bold">{mockData.candidate.name}</span> demonstrates excellent performance across all key
                agent metrics. Strong empathy, clear communication, and professional tone make this candidate well-suited for
                premium brand representation. Keyword analysis shows solid execution of critical service recovery elements.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-gray-700">Ready for immediate client assignment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-gray-700">Minimal coaching required</span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Back Button */}
          <div className="mb-6">
            <a
              href="/ssg"
              className=" inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {language === 'en' ? 'Back to Assessment' : 'Volver a Evaluación'}
            </a>
          </div>

        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-purple-900 via-pink-800 to-red-900 border-t">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SSG</span>
                </div>
                <span className="text-white font-bold text-xl">Support Services Group</span>
              </div>
              <div className="text-purple-200 text-sm mb-4">
                © {new Date().getFullYear()} Support Services Group |
                <a href="#" className="text-pink-300 hover:text-pink-200 ml-1">Privacy Policy</a>
                <span className="mx-2">|</span>
                <span className="text-purple-300">Agent Performance Platform - Confidential</span>
              </div>
              {/* Demo Data Cleanup */}
              <div className="sm:block hidden mt-4 pt-4 border-t border-purple-700">
                <button
                  onClick={clearDemoData}
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-purple-200 hover:text-white bg-purple-800 hover:bg-purple-700 border border-purple-600 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Demo Data
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SSGResultsPage;
