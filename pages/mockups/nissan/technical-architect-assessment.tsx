import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

interface AudioVisualizerProps {
  isRecording: boolean;
  stream: MediaStream | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isRecording || !stream || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        ctx.fillStyle = '#C5282F'; // Nissan red
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [isRecording, stream]);

  if (!isRecording) return null;

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={60}
      className="w-full h-15 bg-gray-100 rounded-md"
    />
  );
};

const NissanTechnicalArchitectAssessment: React.FC = () => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      };

      recorder.start();
      setRecordingState('recording');
      setTimeLeft(60);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
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
    setTimeLeft(60);
    setAudioBlob(null);
    setAudioUrl('');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const submitAssessment = () => {
    // Demo submission - redirect to results page
    setTimeout(() => {
      window.location.href = '/nissan-eng/results';
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 15) return 'text-orange-600';
    return 'text-gray-700';
  };

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
                  <p className="text-lg text-blue-600 font-medium">Language Proficiency Screening</p>
                </div>
              </div>

              {/* Demo Results Link */}
              <div className="hidden md:block">
                <a
                  href="/nissan-eng/results"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="mr-2">📊</span>
                  View Sample Results
                </a>
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
                Technical Architect Assessment
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <p className="text-xl text-gray-700 mb-8 text-center leading-relaxed">
              Welcome to the next step in your application process. This focused assessment evaluates your
              <span className="font-semibold text-blue-600"> technical communication skills</span> for the Technical Architect role.
            </p>

            {/* Instructions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-3">Prepare Your Answer</h3>
                </div>
                <p className="text-gray-700">Review the technical prompt below. You will have 60 seconds to showcase your expertise.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-3">Grant Access</h3>
                </div>
                <p className="text-gray-700">Click &apos;Start Recording&apos; and allow microphone access when prompted.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-bold text-gray-900 ml-3">Record & Submit</h3>
                </div>
                <p className="text-gray-700">You can review your response and re-record once before final submission.</p>
              </div>
            </div>
          </div>

          {/* Assessment Prompt */}
          <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 rounded-xl p-8 mb-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-indigo-900">Assessment Prompt</h3>
            </div>
            <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-md">
              <p className="text-gray-800 text-xl leading-relaxed font-medium">
                In up to 60 seconds, please describe a <span className="text-indigo-600 font-bold">complex system architecture</span> you have designed.
                What were the <span className="text-purple-600 font-bold">key trade-offs</span> you had to make?
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  60 seconds maximum
                </span>
              </div>
            </div>
          </div>

          {/* Recording Module */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              {recordingState === 'idle' && (
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button
                    onClick={startRecording}
                    className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    <span className="w-3 h-3 bg-white rounded-full mr-3"></span>
                    Start Recording
                  </button>
                </div>
              )}

              {recordingState === 'recording' && (
                <div className="space-y-6">
                  <div className={`text-4xl font-bold ${getTimerColor()}`}>
                    {formatTime(timeLeft)}
                  </div>

                  <AudioVisualizer isRecording={true} stream={mediaStream} />

                  <button
                    onClick={stopRecording}
                    className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    <span className="w-3 h-3 bg-white mr-3"></span>
                    Stop Recording
                  </button>
                </div>
              )}

              {recordingState === 'recorded' && (
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <p className="text-gray-700">Recording complete! You can listen to your response below:</p>

                  {audioUrl && (
                    <div className="max-w-sm mx-auto">
                      <audio controls className="w-full">
                        <source src={audioUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={submitAssessment}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      Submit Assessment
                    </button>
                    <button
                      onClick={reRecord}
                      className="px-8 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
                    >
                      Re-record
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