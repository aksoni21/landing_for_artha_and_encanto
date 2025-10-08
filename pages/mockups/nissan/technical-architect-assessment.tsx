import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

// Unified Assessment Prompts - Each role has 2 questions (language-focused + scenario-focused)
const unifiedAssessmentPrompts = [
  {
    role: 'Technical Solutions Architect',
    questions: [
      'In up to 3 minutes, please describe a complex system architecture you have designed. What were the key trade-offs you had to make and how did you communicate these decisions to stakeholders?',
      'Follow-up scenario: A production system you designed is experiencing severe performance issues during peak hours. Walk me through how you would diagnose the problem, communicate with the team, and implement a solution under pressure.'
    ]
  },
  {
    role: 'Customer Service Representative',
    questions: [
      'In up to 3 minutes, tell me about your customer service experience. What strategies do you use to handle difficult conversations and ensure customer satisfaction?',
      'Follow-up scenario: A customer calls very upset because their Nissan vehicle delivery has been delayed by 2 weeks and they need it for an important trip. They\'re threatening to cancel. Walk me through how you would handle this call.'
    ]
  },
  // {
  //   role: 'Sales Representative',
  //   questions: [
  //     'In up to 3 minutes, describe your sales experience and approach. What techniques do you use to understand customer needs and build trust?',
  //     'Follow-up scenario: You\'re pitching the Nissan Ariya to a potential customer who is concerned about the higher price compared to gas vehicles and worried about charging infrastructure. Convince them of the value and try to close the sale.'
  //   ]
  // },
  {
    role: 'Business Analyst',
    questions: [
      'In up to 3 minutes, explain how you manage complex projects and communicate with cross-functional teams. Provide a specific example of a challenging project you successfully delivered.',
      'Follow-up scenario: You need to cut 20% from your project budget, which means reducing headcount or delaying key features. Walk through how you would make this decision, communicate it to your team, and handle pushback from a senior engineer who threatens to quit.'
    ]
  },
  {
    role: 'Financial Project Manager',
    questions: [
      'In up to 3 minutes, explain how you manage project budgets and communicate financial updates to stakeholders. What systems do you use to track spending and forecast risks?',
      'Follow-up scenario: You discover that a project has gone 30% over budget due to scope creep. Your executive sponsor is upset and demanding answers. Walk me through how you would communicate this situation and present your corrective action plan.'
    ]
  },
  // {
  //   role: 'Technical Support Engineer',
  //   questions: [
  //     'In up to 3 minutes, describe your technical support experience. How do you approach troubleshooting complex issues and communicating technical problems to non-technical stakeholders?',
  //     'Follow-up scenario: A production system is down at 3 AM and customers can\'t access their accounts. You just got paged. Walk me through your immediate response, how you would diagnose the issue, and how you would communicate with customers and management during the outage.'
  //   ]
  // },
  {
    role: 'Quality Assurance Lead',
    questions: [
      'In up to 3 minutes, describe your QA philosophy and approach to ensuring product quality. How do you balance speed of delivery with thorough testing?',
      'Follow-up scenario: Two days before a major release, you discover a critical bug that could affect customer safety. The executive team is pressuring you to ship on time, but Engineering claims the bug is low priority. How would you advocate for the right decision and who would you escalate to?'
    ]
  }
];

const NissanTechnicalArchitectAssessment: React.FC = () => {
  const [recordingState, setRecordingState] = useState<'idle' | 'preparing' | 'countdown' | 'recording' | 'recorded'>('idle');
  const [timeLeft, setTimeLeft] = useState(180); // 180 seconds = 3 minutes
  const [preparationTime, setPreparationTime] = useState(10); // 10 second prep time
  const [countdownTime, setCountdownTime] = useState(3); // 3-2-1 countdown
  const [promptRevealed, setPromptRevealed] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track which question (0 or 1)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  // Removed unused videoBlob state
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]); // Store all video recordings
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Connect video stream to video element when stream is available or state changes
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      // Ensure video is playing
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  }, [mediaStream, recordingState]);

  // Preparation timer (15 seconds after revealing prompt)
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [recordingState, preparationTime]);

  // Countdown timer (3-2-1 before recording)
  useEffect(() => {
    if (recordingState === 'countdown' && countdownTime > 0) {
      timerRef.current = setTimeout(() => {
        setCountdownTime(countdownTime - 1);
      }, 1000);
    } else if (countdownTime === 0 && recordingState === 'countdown') {
      startRecording();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [recordingState, timeLeft]);

  const revealPromptAndBegin = async () => {
    try {
      // Stop any playing audio when starting recording
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);

      // Request camera and microphone permissions
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

      // Set stream (useEffect will connect it to video element)
      setMediaStream(stream);

      // Reveal prompt and start preparation countdown
      setPromptRevealed(true);
      setRecordingState('preparing');
      setPreparationTime(10);
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

      // Store in localStorage for results page
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        localStorage.setItem('nissan_demo_video', reader.result as string);
      };

      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    };

    recorder.start();
    setRecordingState('recording');
    setTimeLeft(180);
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
    // Stop any playing audio
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);

    setRecordingState('idle');
    setPromptRevealed(false);
    setTimeLeft(180);
    setPreparationTime(10);
    setCountdownTime(3);
    // Removed setVideoBlob call
    setVideoUrl('');
    localStorage.removeItem('nissan_demo_video');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const submitAssessment = () => {
    // Stop any playing audio
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);

    // Save current video to completed videos
    if (videoUrl) {
      setCompletedVideos([...completedVideos, videoUrl]);
    }

    // Check if there are more questions
    const totalQuestions = unifiedAssessmentPrompts[selectedPrompt].questions.length;
    if (currentQuestionIndex < totalQuestions - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecordingState('idle');
      setPromptRevealed(false);
      // Removed setVideoBlob call
      setVideoUrl('');
      setTimeLeft(180);
      setPreparationTime(10);
      setCountdownTime(3);
    } else {
      // All questions completed - go to results
      setTimeout(() => {
        window.location.href = '/mockups/nissan/results';
      }, 500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-orange-600';
    return 'text-gray-700';
  };

  const playPromptAudio = () => {
    // Stop any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      unifiedAssessmentPrompts[selectedPrompt].questions[currentQuestionIndex]
    );

    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopPromptAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Nissan North America - Language Proficiency Screening</title>
        <meta name="description" content="Technical Architect English Language Assessment" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* Nissan Logo Placeholder */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-red-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">N</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Nissan North America</h1>
                  <div className="flex items-center space-x-3">
                    <p className="text-lg text-blue-600 font-medium">Candidate Pre-Screening Assessment</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      VERIFIED ASSESSMENT
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Results Link */}
              <div className="hidden md:block">
                <Link
                  href="/mockups/nissan/results"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="mr-2">📊</span>
                  View Sample Results
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <span className="text-white text-3xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Candidate Pre-Screening Assessment
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <p className="text-xl text-gray-700 mb-4 text-center leading-relaxed">
              Welcome to the next step in your application process. This assessment evaluates your
              <span className="font-semibold text-blue-600"> communication skills and job-specific competencies</span> through role-tailored questions.
            </p>
            <p className="text-base text-gray-600 mb-8 text-center">
              You&apos;ll answer <strong>2 questions</strong>: an experience-based question and a scenario-based follow-up. Each response can be up to 3 minutes.
            </p>

            {/* Instructions */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-2 text-sm">Select Role</h3>
                </div>
                <p className="text-gray-700 text-xs">Choose the position you&apos;re applying for.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-9 h-9 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-2 text-sm">Initial Question</h3>
                </div>
                <p className="text-gray-700 text-xs">Answer the first question (up to 3 min).</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-2 text-sm">Follow-Up</h3>
                </div>
                <p className="text-gray-700 text-xs">Answer the follow-up question (up to 3 min).</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-2 text-sm">Submit</h3>
                </div>
                <p className="text-gray-700 text-xs">Complete and submit your assessment.</p>
              </div>
            </div>
          </div>

          {/* Assessment Prompt - Hidden until revealed */}
          {promptRevealed && (
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 rounded-xl p-8 mb-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-900">
                      Question {currentQuestionIndex + 1} of {unifiedAssessmentPrompts[selectedPrompt].questions.length}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium">{unifiedAssessmentPrompts[selectedPrompt].role}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  {currentQuestionIndex === 0 ? 'EXPERIENCE' : 'SCENARIO'}
                </div>
              </div>
              <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-md">
                <p className="text-gray-800 text-xl leading-relaxed font-medium mb-4">
                  {unifiedAssessmentPrompts[selectedPrompt].questions[currentQuestionIndex]}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Up to 3 minutes
                  </span>
                  <button
                    onClick={isPlayingAudio ? stopPromptAudio : playPromptAudio}
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      isPlayingAudio
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                        </svg>
                        Stop Audio
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                        Play Question Audio
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Recording Module */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              {/* IDLE STATE - Reveal Prompt Button */}
              {recordingState === 'idle' && (
                <div className="space-y-6">
                  {/* Question Progress Indicator */}
                  {currentQuestionIndex > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                      <div className="flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-xl font-bold text-green-800">Question 1 Complete!</h3>
                      </div>
                      <p className="text-center text-gray-700">Great job! Let&apos;s move on to the follow-up question.</p>
                    </div>
                  )}

                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>

                  {/* Prompt Selector - Only show on first question */}
                  {currentQuestionIndex === 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Select Your Role</h3>
                    <div className="space-y-3">
                      {unifiedAssessmentPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPrompt(index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedPrompt === index
                              ? 'border-blue-500 bg-blue-100 shadow-md'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              selectedPrompt === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                              {selectedPrompt === index && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`font-semibold ${selectedPrompt === index ? 'text-blue-900' : 'text-gray-700'}`}>
                              {prompt.role}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  )}

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      ⚠️ <strong>Anti-Cheating Notice:</strong> The {currentQuestionIndex === 0 ? 'prompt' : 'follow-up question'} will be revealed when you click below.
                      You&apos;ll have 10 seconds to prepare before recording automatically begins.
                    </p>
                  </div>
                  <button
                    onClick={revealPromptAndBegin}
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {currentQuestionIndex === 0 ? 'Reveal Prompt & Begin' : 'Reveal Follow-Up Question'}
                  </button>
                </div>
              )}

              {/* PREPARING STATE - 10 Second Countdown with Video Preview */}
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
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                      LIVE PREVIEW
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Preparation Time</h3>
                    <div className="text-5xl font-bold text-blue-600 mb-2">{preparationTime}s</div>
                    <p className="text-gray-700">Recording will start automatically when timer reaches 0</p>
                  </div>
                </div>
              )}

              {/* COUNTDOWN STATE - 3-2-1 Countdown */}
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
                    <p className="text-xl font-bold text-orange-800">Recording starting in {countdownTime}...</p>
                  </div>
                </div>
              )}

              {/* RECORDING STATE - Active Recording */}
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
                      REC
                    </div>
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg font-mono text-2xl font-bold">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6">
                    <div className={`text-4xl font-bold mb-2 ${getTimerColor()}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-gray-700 mb-4">Speak clearly and naturally</p>
                    <button
                      onClick={stopRecording}
                      className="inline-flex items-center px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                      Stop Recording
                    </button>
                  </div>
                </div>
              )}

              {/* RECORDED STATE - Playback */}
              {recordingState === 'recorded' && (
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <p className="text-xl font-bold text-gray-900">Recording Complete!</p>
                  <p className="text-gray-700">Review your video response below:</p>

                  {videoUrl && (
                    <div className="max-w-2xl mx-auto">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full rounded-xl shadow-2xl border-2 border-gray-300"
                      />
                    </div>
                  )}

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={submitAssessment}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      {currentQuestionIndex < unifiedAssessmentPrompts[selectedPrompt].questions.length - 1
                        ? 'Continue to Next Question →'
                        : 'Submit Assessment'}
                    </button>
                    <button
                      onClick={reRecord}
                      className="px-8 py-4 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-lg rounded-xl transition-colors duration-200"
                    >
                      Record Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Nissan North America, Inc. |
              <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NissanTechnicalArchitectAssessment;