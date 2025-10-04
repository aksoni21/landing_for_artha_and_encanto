import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

const translations: Translations = {
  // Header
  agentPlatform: {
    en: 'Agent Performance Platform',
    es: 'Plataforma de Desempeño de Agentes'
  },
  viewSampleResults: {
    en: 'View Sample Results',
    es: 'Ver Resultados de Muestra'
  },
  // Welcome section
  clientSimulation: {
    en: 'Client Simulation Assessment',
    es: 'Evaluación de Simulación de Cliente'
  },
  assessmentDescription: {
    en: 'This assessment evaluates your ability to handle real client scenarios with',
    es: 'Esta evaluación mide tu habilidad para manejar escenarios reales de clientes con'
  },
  professionalismEmpathy: {
    en: 'professionalism, empathy, and brand alignment',
    es: 'profesionalismo, empatía y alineación con la marca'
  },
  progressiveScenarios: {
    en: 'Select a role and complete',
    es: 'Selecciona un rol y completa'
  },
  threeScenarios: {
    en: '3 progressive scenarios',
    es: '3 escenarios progresivos'
  },
  respondingLive: {
    en: 'responding as if you\'re on live calls.',
    es: 'respondiendo como si estuvieras en llamadas en vivo.'
  },
  // Instructions
  selectRole: {
    en: 'Select Role',
    es: 'Seleccionar Rol'
  },
  selectRoleDesc: {
    en: 'Choose Customer Care or B2B Sales scenario.',
    es: 'Elige escenario de Atención al Cliente o Ventas B2B.'
  },
  prepare15s: {
    en: 'Prepare (15s)',
    es: 'Preparar (15s)'
  },
  prepareDesc: {
    en: 'Review scenario and gather your thoughts.',
    es: 'Revisa el escenario y organiza tus ideas.'
  },
  respond2min: {
    en: 'Respond (2min)',
    es: 'Responder (2min)'
  },
  respondDesc: {
    en: 'Deliver your response on video.',
    es: 'Entrega tu respuesta en video.'
  },
  // Scenario display
  clientScenario: {
    en: 'Client Scenario',
    es: 'Escenario del Cliente'
  },
  questionOf: {
    en: 'Question',
    es: 'Pregunta'
  },
  of: {
    en: 'of',
    es: 'de'
  },
  context: {
    en: 'Context:',
    es: 'Contexto:'
  },
  scenario: {
    en: 'Scenario:',
    es: 'Escenario:'
  },
  yourTask: {
    en: 'Your Task:',
    es: 'Tu Tarea:'
  },
  // Idle state
  questionCompleted: {
    en: 'Question',
    es: 'Pregunta'
  },
  completed: {
    en: 'Completed!',
    es: 'Completada!'
  },
  excellentWork: {
    en: 'Excellent work. Let\'s continue with the next scenario.',
    es: 'Excelente trabajo. Continuemos con el siguiente escenario.'
  },
  selectYourRole: {
    en: 'Select Your Role (3 Questions Per Role)',
    es: 'Selecciona Tu Rol (3 Preguntas Por Rol)'
  },
  performanceTip: {
    en: 'Performance Tip:',
    es: 'Consejo de Desempeño:'
  },
  scenarioRevealed: {
    en: 'The scenario will be revealed when you click below.',
    es: 'El escenario se revelará cuando hagas clic abajo.'
  },
  nextScenarioRevealed: {
    en: 'The next scenario will be revealed when you click below.',
    es: 'El siguiente escenario se revelará cuando hagas clic abajo.'
  },
  prepareSeconds: {
    en: 'You\'ll have 15 seconds to prepare before recording begins automatically.',
    es: 'Tendrás 15 segundos para prepararte antes de que la grabación comience automáticamente.'
  },
  startSimulation: {
    en: 'Start',
    es: 'Iniciar'
  },
  revealNextScenario: {
    en: 'Reveal Next Scenario',
    es: 'Revelar Siguiente Escenario'
  },
  // Preparing state
  prepareYourResponse: {
    en: 'Prepare Your Response',
    es: 'Prepara Tu Respuesta'
  },
  recordingStarts: {
    en: 'Recording starts in',
    es: 'La grabación comienza en'
  },
  seconds: {
    en: 'seconds',
    es: 'segundos'
  },
  // Recording state
  recording: {
    en: 'Recording...',
    es: 'Grabando...'
  },
  timeRemaining: {
    en: 'Time Remaining',
    es: 'Tiempo Restante'
  },
  stopRecording: {
    en: 'Stop Recording',
    es: 'Detener Grabación'
  },
  // Recorded state
  simulationComplete: {
    en: 'Complete!',
    es: 'Completa!'
  },
  allScenariosComplete: {
    en: 'All Scenarios Complete!',
    es: '¡Todos los Escenarios Completos!'
  },
  reviewResponse: {
    en: 'Review your response below:',
    es: 'Revisa tu respuesta a continuación:'
  },
  continueNext: {
    en: 'Continue to Next Question →',
    es: 'Continuar a Siguiente Pregunta →'
  },
  viewAnalysis: {
    en: 'View Performance Analysis',
    es: 'Ver Análisis de Desempeño'
  },
  tryAgain: {
    en: 'Try Again',
    es: 'Intentar de Nuevo'
  },
  // Permissions
  cameraPermission: {
    en: 'Camera & Microphone Permission Required',
    es: 'Se Requiere Permiso de Cámara y Micrófono'
  },
  grantPermission: {
    en: 'Grant Permission',
    es: 'Otorgar Permiso'
  }
};

// Role-based scenarios for call center simulation - 3 questions per role (bilingual)
const getCallCenterScenarios = (language: 'en' | 'es') => [
  {
    role: language === 'en' ? 'Customer Care - Consumer Electronics' : 'Atención al Cliente - Electrónica de Consumo',
    icon: '📱',
    color: 'blue',
    questions: [
      {
        title: language === 'en' ? 'Product Issue Resolution' : 'Resolución de Problema del Producto',
        scenario: language === 'en'
          ? 'A customer is furious because their brand-new, expensive television has a line across the screen. They purchased it only 2 days ago for a special event that is happening tonight. They are demanding an immediate replacement and threatening to leave a negative review and switch to a competitor.'
          : 'Un cliente está furioso porque su televisor nuevo y costoso tiene una línea en la pantalla. Lo compró hace solo 2 días para un evento especial que sucede esta noche. Está exigiendo un reemplazo inmediato y amenazando con dejar una reseña negativa y cambiar a un competidor.',
        context: language === 'en'
          ? 'You represent a premium consumer electronics brand known for quality and customer service.'
          : 'Representas una marca premium de electrónica de consumo conocida por su calidad y servicio al cliente.',
        taskPrompt: language === 'en'
          ? 'In up to 2 minutes, respond to this customer as if you are on a live call. Show empathy, acknowledge their frustration, and provide a clear path forward that aligns with the brand\'s commitment to quality service.'
          : 'En hasta 2 minutos, responde a este cliente como si estuvieras en una llamada en vivo. Muestra empatía, reconoce su frustración y proporciona un camino claro que se alinee con el compromiso de la marca con el servicio de calidad.',
      },
      {
        title: language === 'en' ? 'Escalation & Compensation Request' : 'Escalación y Solicitud de Compensación',
        scenario: language === 'en'
          ? 'The customer from the previous call now says your replacement offer isn\'t enough. They\'ve already told their family about the issue, missed their special event, and want additional compensation beyond the standard warranty - specifically a full refund PLUS a discount on their next purchase. They\'re saying they\'ll post about this experience on social media.'
          : 'El cliente de la llamada anterior ahora dice que tu oferta de reemplazo no es suficiente. Ya le contó a su familia sobre el problema, perdió su evento especial y quiere compensación adicional más allá de la garantía estándar - específicamente un reembolso completo MÁS un descuento en su próxima compra. Dicen que publicarán sobre esta experiencia en redes sociales.',
        context: language === 'en'
          ? 'You need to balance customer satisfaction with company policy. Standard escalations allow for expedited shipping and a one-time service credit, but not full refunds for used products.'
          : 'Necesitas equilibrar la satisfacción del cliente con la política de la empresa. Las escalaciones estándar permiten envío expedito y un crédito de servicio único, pero no reembolsos completos para productos usados.',
        taskPrompt: language === 'en'
          ? 'In up to 2 minutes, handle this escalation. Show empathy while managing expectations within company guidelines. Your goal is to retain this customer.'
          : 'En hasta 2 minutos, maneja esta escalación. Muestra empatía mientras gestionas expectativas dentro de las pautas de la empresa. Tu objetivo es retener a este cliente.',
      },
      {
        title: language === 'en' ? 'Retention - Cancel Threat' : 'Retención - Amenaza de Cancelación',
        scenario: language === 'en'
          ? 'The customer is now threatening to cancel their premium membership (worth $200/year) and return all products purchased in the last 6 months. They\'re comparing your service to a competitor who "would never treat customers this way." You can see in their account that they\'ve been a loyal customer for 3 years with $5,000+ in total purchases.'
          : 'El cliente ahora amenaza con cancelar su membresía premium (valor de $200/año) y devolver todos los productos comprados en los últimos 6 meses. Están comparando tu servicio con un competidor que "nunca trataría a los clientes de esta manera". Puedes ver en su cuenta que han sido un cliente leal durante 3 años con más de $5,000 en compras totales.',
        context: language === 'en'
          ? 'Retaining this high-value customer is crucial. You have authority to offer membership extensions, expedited support, or small account credits.'
          : 'Retener a este cliente de alto valor es crucial. Tienes autoridad para ofrecer extensiones de membresía, soporte expedito o pequeños créditos en la cuenta.',
        taskPrompt: language === 'en'
          ? 'In up to 2 minutes, de-escalate and retain this customer. Acknowledge their loyalty, address their concerns, and provide a solution that preserves the relationship.'
          : 'En hasta 2 minutos, desescala y retén a este cliente. Reconoce su lealtad, aborda sus preocupaciones y proporciona una solución que preserve la relación.',
      }
    ]
  },
  {
    role: language === 'en' ? 'B2B Sales - Retail E-commerce' : 'Ventas B2B - E-commerce Minorista',
    icon: '💼',
    color: 'purple',
    questions: [
      {
        title: language === 'en' ? 'Follow-Up Call' : 'Llamada de Seguimiento',
        scenario: language === 'en'
          ? 'You are following up with a potential client who showed interest in your e-commerce platform 2 weeks ago. They run a mid-sized retail business and are currently using a competitor\'s solution. They mentioned concerns about migration complexity and training their team on a new system.'
          : 'Estás haciendo seguimiento con un cliente potencial que mostró interés en tu plataforma de e-commerce hace 2 semanas. Dirigen un negocio minorista de tamaño mediano y actualmente usan la solución de un competidor. Mencionaron preocupaciones sobre la complejidad de la migración y capacitar a su equipo en un nuevo sistema.',
        context: language === 'en'
          ? 'You represent a modern e-commerce platform known for ease of use and excellent customer support.'
          : 'Representas una plataforma moderna de e-commerce conocida por su facilidad de uso y excelente soporte al cliente.',
        taskPrompt: language === 'en'
          ? 'In up to 2 minutes, make your follow-up pitch. Address their concerns, demonstrate value, and create urgency to move forward with a demo or trial.'
          : 'En hasta 2 minutos, haz tu presentación de seguimiento. Aborda sus preocupaciones, demuestra valor y crea urgencia para avanzar con una demostración o prueba.',
      },
      {
        title: language === 'en' ? 'Objection Handling - Pricing' : 'Manejo de Objeciones - Precio',
        scenario: language === 'en'
          ? 'The prospect is interested but says your platform is 40% more expensive than their current solution. They like the features but need to justify the cost to their CFO. They\'re asking "Why should we pay more for something we\'re already getting?" They have a quarterly budget meeting next week.'
          : 'El prospecto está interesado pero dice que tu plataforma es 40% más cara que su solución actual. Les gustan las características pero necesitan justificar el costo a su CFO. Preguntan "¿Por qué deberíamos pagar más por algo que ya tenemos?" Tienen una reunión de presupuesto trimestral la próxima semana.',
        context: language === 'en'
          ? 'Your platform has better analytics, 24/7 support, and typically increases conversion rates by 15-25%. You can offer a 3-month pilot program.'
          : 'Tu plataforma tiene mejores análisis, soporte 24/7 y típicamente aumenta las tasas de conversión en 15-25%. Puedes ofrecer un programa piloto de 3 meses.',
        taskPrompt: language === 'en'
          ? 'In up to 2 minutes, handle the pricing objection. Focus on ROI and value, not just features. Create urgency around their upcoming budget meeting.'
          : 'En hasta 2 minutos, maneja la objeción de precio. Enfócate en ROI y valor, no solo en características. Crea urgencia en torno a su próxima reunión de presupuesto.',
      },
      {
        title: language === 'en' ? 'Closing - Getting Commitment' : 'Cierre - Obtener Compromiso',
        scenario: language === 'en'
          ? 'The prospect loves your platform and the pilot program idea. However, they\'re hesitant to commit today, saying they "need to think about it" and "discuss with the team." You sense they\'re talking to competitors. They keep saying "we\'ll get back to you."'
          : 'Al prospecto le encanta tu plataforma y la idea del programa piloto. Sin embargo, dudan en comprometerse hoy, diciendo que "necesitan pensarlo" y "discutirlo con el equipo". Sientes que están hablando con competidores. Siguen diciendo "te contactaremos".',
        context: language === 'en'
          ? 'This is a qualified buyer with authority and budget. Your Q4 goal is at stake. You can offer implementation support and a limited-time discount for decisions made this week.'
          : 'Este es un comprador calificado con autoridad y presupuesto. Tu objetivo del Q4 está en juego. Puedes ofrecer soporte de implementación y un descuento por tiempo limitado para decisiones tomadas esta semana.',
        taskPrompt: language === 'en'
          ? 'In up to 2 minutes, close this deal. Address their hesitation, create urgency, and secure a commitment to move forward with the pilot program.'
          : 'En hasta 2 minutos, cierra este trato. Aborda su vacilación, crea urgencia y asegura un compromiso para avanzar con el programa piloto.',
      }
    ]
  }
];

const SSGAssessment: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('ssg_language');
    if (savedLanguage === 'en' || savedLanguage === 'es') {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (newLang: 'en' | 'es') => {
    setLanguage(newLang);
    localStorage.setItem('ssg_language', newLang);
  };
  const [recordingState, setRecordingState] = useState<'idle' | 'preparing' | 'countdown' | 'recording' | 'recorded'>('idle');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for call center simulation
  const [preparationTime, setPreparationTime] = useState(15); // 15 second prep time
  const [countdownTime, setCountdownTime] = useState(3);
  const [scenarioRevealed, setScenarioRevealed] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track which question (0, 1, or 2)
  // Removed unused videoBlob state
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]); // Store all video recordings
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Translation helper
  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  // Get scenarios based on current language
  const callCenterScenarios = getCallCenterScenarios(language);

  // Connect video stream to video element
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  }, [mediaStream, recordingState]);

  // Preparation timer
  useEffect(() => {
    if (recordingState === 'preparing' && preparationTime > 0) {
      timerRef.current = setTimeout(() => {
        setPreparationTime(preparationTime - 1);
      }, 1000);
    } else if (preparationTime === 0 && recordingState === 'preparing') {
      setRecordingState('countdown');
      setCountdownTime(3);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [recordingState, preparationTime]);

  // Countdown timer
  useEffect(() => {
    if (recordingState === 'countdown' && countdownTime > 0) {
      timerRef.current = setTimeout(() => {
        setCountdownTime(countdownTime - 1);
      }, 1000);
    } else if (countdownTime === 0 && recordingState === 'countdown') {
      startRecording();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [recordingState, countdownTime]);

  // Recording timer
  useEffect(() => {
    if (recordingState === 'recording' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && recordingState === 'recording') {
      stopRecording();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [recordingState, timeLeft]);

  const revealScenarioAndBegin = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      setMediaStream(stream);
      setScenarioRevealed(true);
      setRecordingState('preparing');
      setPreparationTime(15);
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      alert('Unable to access camera and microphone. Please check your permissions.');
    }
  };

  const startRecording = () => {
    if (!mediaStream) return;

    const recorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    mediaRecorder.current = recorder;

    const videoChunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(videoChunks, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        localStorage.setItem('ssg_demo_video', reader.result as string);
        localStorage.setItem('ssg_demo_scenario', selectedScenario.toString());
      };

      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    };

    recorder.start();
    setRecordingState('recording');
    setTimeLeft(120);
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recordingState === 'recording') {
      mediaRecorder.current.stop();
      setRecordingState('recorded');
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  const reRecord = () => {
    setRecordingState('idle');
    setScenarioRevealed(false);
    setTimeLeft(120);
    setPreparationTime(15);
    setCountdownTime(3);
    // Removed setVideoBlob call
    setVideoUrl('');
    localStorage.removeItem('ssg_demo_video');
    localStorage.removeItem('ssg_demo_scenario');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const submitAssessment = () => {
    // Save current video to completed videos
    if (videoUrl) {
      setCompletedVideos([...completedVideos, videoUrl]);
    }

    // Check if there are more questions
    const totalQuestions = callCenterScenarios[selectedScenario].questions.length;
    if (currentQuestionIndex < totalQuestions - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecordingState('idle');
      setScenarioRevealed(false);
      // Removed setVideoBlob call
      setVideoUrl('');
      setTimeLeft(120);
      setPreparationTime(15);
      setCountdownTime(3);
    } else {
      // All questions completed, go to results
      setTimeout(() => {
        window.location.href = '/ssg/results';
      }, 500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 20) return 'text-red-600';
    if (timeLeft <= 45) return 'text-orange-600';
    return 'text-gray-700';
  };

  const currentScenario = callCenterScenarios[selectedScenario];
  const currentQuestion = currentScenario.questions[currentQuestionIndex];

  return (
    <>
      <Head>
        <title>SSG Agent Performance Platform - Role Simulation</title>
        <meta name="description" content="Call Center Agent Performance Assessment" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">SSG</span>
                </div>
                <div>
                  <h1 className=" hidden text-2xl font-bold text-gray-900">Support Services Group</h1>
                  <p className="text-lg text-indigo-600 font-medium">{t('agentPlatform')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
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

                <Link
                  href="/mockups/ssg/results"
                  className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <span className="mr-2">📊</span>
                  {t('viewSampleResults')}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className=" mx-auto px-4 py-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
                <span className="text-white text-3xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('clientSimulation')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <p className="text-xl text-gray-700 mb-4 text-center leading-relaxed">
              {t('assessmentDescription')}
              <span className="font-semibold text-indigo-600"> {t('professionalismEmpathy')}</span>.
            </p>
            {/* <p className="text-base text-gray-600 mb-8 text-center">
              {t('progressiveScenarios')} <span className="font-semibold">{t('threeScenarios')}</span>, {t('respondingLive')}
            </p> */}

            {/* Instructions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 border border-indigo-200">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-2 text-sm">{t('selectRole')}</h3>
                </div>
                <p className="text-gray-700 text-xs">{t('selectRoleDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-9 h-9 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-2 text-sm">{t('prepare15s')}</h3>
                </div>
                <p className="text-gray-700 text-xs">{t('prepareDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 border border-cyan-200">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-9 h-9 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-2 text-sm">{t('respond2min')}</h3>
                </div>
                <p className="text-gray-700 text-xs">{t('respondDesc')}</p>
              </div>
            </div>
          </div>

          {/* Scenario Display - Hidden until revealed */}
          {scenarioRevealed && (
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 rounded-xl p-8 mb-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">{currentScenario.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-900">
                      {t('questionOf')} {currentQuestionIndex + 1} {t('of')} {currentScenario.questions.length}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium">{currentScenario.role}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  {currentQuestion.title}
                </div>
              </div>
              <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-md mb-4">
                <p className="text-sm font-semibold text-indigo-700 mb-2">{t('context')}</p>
                <p className="text-gray-700 mb-4">{currentQuestion.context}</p>
                <p className="text-sm font-semibold text-indigo-700 mb-2">{t('scenario')}</p>
                <p className="text-gray-800 text-lg leading-relaxed font-medium mb-4">
                  {currentQuestion.scenario}
                </p>
                <p className="text-sm font-semibold text-indigo-700 mb-2">{t('yourTask')}</p>
                <p className="text-gray-800 leading-relaxed">
                  {currentQuestion.taskPrompt}
                </p>
              </div>
            </div>
          )}

          {/* Recording Module */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              {/* IDLE STATE */}
              {recordingState === 'idle' && (
                <div className="space-y-6">
                  {/* Question Progress Indicator - Show on subsequent questions */}
                  {currentQuestionIndex > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                      <div className="flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-xl font-bold text-green-900">
                          {t('questionCompleted')} {currentQuestionIndex} {t('completed')}
                        </h3>
                      </div>
                      <p className="text-center text-green-700">
                        {t('excellentWork')}
                      </p>
                    </div>
                  )}

                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>

                  {/* Role Selector - Only show on first question */}
                  {currentQuestionIndex === 0 && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{t('selectYourRole')}</h3>
                      <div className="space-y-3">
                        {callCenterScenarios.map((scenario, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedScenario(index)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              selectedScenario === index
                                ? 'border-indigo-500 bg-indigo-100 shadow-md'
                                : 'border-gray-200 bg-white hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="text-3xl mr-3">{scenario.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedScenario === index ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                                  }`}>
                                    {selectedScenario === index && (
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className={`font-semibold ${selectedScenario === index ? 'text-indigo-900' : 'text-gray-700'}`}>
                                    {scenario.role}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      ⚡ <strong>{t('performanceTip')}</strong> {currentQuestionIndex === 0 ? t('scenarioRevealed') : t('nextScenarioRevealed')} {t('prepareSeconds')}
                    </p>
                  </div>

                  <button
                    onClick={revealScenarioAndBegin}
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {currentQuestionIndex === 0 ? t('startSimulation') : t('revealNextScenario')}
                  </button>
                </div>
              )}

              {/* PREPARING STATE */}
              {recordingState === 'preparing' && (
                <div className="space-y-6">
                  <div className="relative mx-auto max-w-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full rounded-xl shadow-2xl border-4 border-indigo-500"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                      CAMERA CHECK
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('prepareYourResponse')}</h3>
                    <div className="text-5xl font-bold text-indigo-600 mb-2">{preparationTime}{t('seconds')}</div>
                    <p className="text-gray-700">{t('recordingStarts')} {preparationTime} {t('seconds')}</p>
                  </div>
                </div>
              )}

              {/* COUNTDOWN STATE */}
              {recordingState === 'countdown' && (
                <div className="space-y-6">
                  <div className="relative mx-auto max-w-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full rounded-xl shadow-2xl border-4 border-orange-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-9xl font-bold text-white drop-shadow-2xl animate-pulse">
                        {countdownTime}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-4">
                    <p className="text-xl font-bold text-orange-800">Starting in {countdownTime}...</p>
                  </div>
                </div>
              )}

              {/* RECORDING STATE */}
              {recordingState === 'recording' && (
                <div className="space-y-6">
                  <div className="relative mx-auto max-w-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full rounded-xl shadow-2xl border-4 border-red-600 bg-black"
                    />
                    <div className="absolute top-4 right-4 flex items-center bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg animate-pulse">
                      <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                      LIVE
                    </div>
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg font-mono text-2xl font-bold">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6">
                    <p className="text-sm font-semibold text-gray-600 mb-2">{t('timeRemaining')}</p>
                    <div className={`text-4xl font-bold mb-4 ${getTimerColor()}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <button
                      onClick={stopRecording}
                      className="inline-flex items-center px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                      {t('stopRecording')}
                    </button>
                  </div>
                </div>
              )}

              {/* RECORDED STATE */}
              {recordingState === 'recorded' && (
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <p className="text-xl font-bold text-gray-900">
                    {currentQuestionIndex < currentScenario.questions.length - 1
                      ? `${t('questionOf')} ${currentQuestionIndex + 1} ${t('simulationComplete')}`
                      : t('allScenariosComplete')}
                  </p>
                  <p className="text-gray-700">{t('reviewResponse')}</p>

                  {videoUrl && (
                    <div className="max-w-2xl mx-auto">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full rounded-xl shadow-2xl border-2 border-gray-300"
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center space-x-4">
                    <button
                      onClick={submitAssessment}
                      className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      {currentQuestionIndex < currentScenario.questions.length - 1
                        ? t('continueNext')
                        : t('viewAnalysis')}
                    </button>
                    <br />
                    <button
                      onClick={reRecord}
                      className="px-8 py-4 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-lg rounded-xl transition-colors duration-200"
                    >
                      {t('tryAgain')}
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-8">
            <Link
                  href="/mockups/ssg/results"
                  className=" lg:inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <span className="mr-2">📊</span>
                  {t('viewSampleResults')}
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Support Services Group |
              <a href="#" className="text-indigo-600 hover:text-indigo-700 ml-1">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SSGAssessment;
