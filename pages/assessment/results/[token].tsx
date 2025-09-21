import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Calendar, User, Mail, Play, Pause, Download, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface AssessmentResultData {
  assessment_id: string;
  partner_id: string;
  student_name?: string;
  student_email?: string;
  placement_result: {
    overall_score: number;
    placement_level: string;
    description: string;
    component_scores: {
      pronunciation: number;
      fluency: number;
      vocabulary: number;
      grammar: number;
      confidence: number;
    };
    recommendations: string[];
  };
  assessment_date: string;
  partner_config: {
    name: string;
    branding: {
      primary_color: string;
      secondary_color: string;
      accent_color: string;
      logo_url?: string;
    };
  };
  audio_url: string;
}

interface AssessmentResultsPageProps {
  data: AssessmentResultData | null;
  error?: string;
  token: string;
}

const AssessmentResultsPage: React.FC<AssessmentResultsPageProps> = ({ data, error, token }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (data?.audio_url) {
      const audio = new Audio(data.audio_url + `?token=${token}`);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error('Audio loading failed');
        setIsPlaying(false);
      };
      setAudioElement(audio);

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [data?.audio_url, token]);

  const toggleAudio = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play().catch((error) => {
        console.error('Audio play failed:', error);
      });
      setIsPlaying(true);
    }
  };

  const downloadAudio = () => {
    if (data?.audio_url) {
      const link = document.createElement('a');
      link.href = data.audio_url + `?token=${token}`;
      link.download = `assessment_${data.assessment_id}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'beginner+': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Head>
          <title>Assessment Results - Error</title>
        </Head>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center"
        >
          <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'Invalid or expired access token.'}
          </p>
          <a
            href="https://encantospeak.com"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to EncantoSpeak
          </a>
        </motion.div>
      </div>
    );
  }

  const { placement_result, partner_config } = data;

  return (
    <>
      <Head>
        <title>Assessment Results - {partner_config.name}</title>
        <meta name="description" content={`Assessment results for ${data.student_name || 'Student'}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {partner_config.branding.logo_url && (
                  <img
                    src={partner_config.branding.logo_url}
                    alt={partner_config.name}
                    className="h-12 w-auto"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Assessment Results
                  </h1>
                  <p className="text-gray-600">{partner_config.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Assessment ID</p>
                <p className="font-mono text-sm text-gray-800">
                  {data.assessment_id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Student Info & Audio */}
            <div className="lg:col-span-1 space-y-6">
              {/* Student Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Student Information</h2>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {data.student_name || 'Not provided'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {data.student_email || 'Not provided'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(data.assessment_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Audio Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Audio Recording</h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={toggleAudio}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button
                      onClick={downloadAudio}
                      className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
                    >
                      <Download size={20} />
                    </button>

                    <span className="text-gray-600 text-sm">
                      {isPlaying ? 'Playing...' : 'Click to play recording'}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      High-quality audio recording of the student&apos;s Spanish speech sample.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrendingUp size={24} style={{ color: partner_config.branding.primary_color }} />
                    <h2 className="text-2xl font-bold">Assessment Results</h2>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1" style={{ color: partner_config.branding.primary_color }}>
                        {placement_result.overall_score}
                      </div>
                      <div className="text-gray-600">Overall Score</div>
                    </div>

                    <div className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getLevelColor(placement_result.placement_level)}`}>
                        {placement_result.placement_level}
                      </div>
                      <div className="text-gray-600 mt-1">Placement Level</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-4 italic">
                    {placement_result.description}
                  </p>
                </div>
              </motion.div>

              {/* Component Scores */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Component Scores</h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(placement_result.component_scores).map(([component, score]) => (
                    <div key={component} className="text-center">
                      <div className={`text-2xl font-bold mb-1 px-3 py-2 rounded-lg ${getScoreColor(score)}`}>
                        {score}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {component}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Learning Recommendations</h3>

                <div className="space-y-3">
                  {(() => {
                    // Handle recommendations that might be a JSON string or array
                    let recommendations: string[] = [];
                    const rawRecommendations = placement_result.recommendations;

                    if (typeof rawRecommendations === 'string') {
                      try {
                        recommendations = JSON.parse(rawRecommendations);
                      } catch {
                        recommendations = [rawRecommendations]; // Fallback to single string
                      }
                    } else if (Array.isArray(rawRecommendations)) {
                      recommendations = rawRecommendations;
                    }

                    if (!Array.isArray(recommendations)) {
                      recommendations = [];
                    }
                    return recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            <p>Assessment powered by EncantoSpeak AI</p>
            <p className="mt-1">
              This assessment link will expire and is intended for authorized school staff only.
            </p>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.params as { token: string };

  try {
    // Use the Next.js API route which will proxy to the backend
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://encantospeak.com';

    const response = await fetch(`${baseUrl}/api/assessment/results/${token}`);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          props: {
            data: null,
            error: 'Invalid or expired access token.',
            token
          }
        };
      }

      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        data,
        token
      }
    };
  } catch (error) {
    console.error('Error fetching assessment results:', error);

    return {
      props: {
        data: null,
        error: 'Unable to load assessment results. The link may be invalid or expired.',
        token
      }
    };
  }
};

export default AssessmentResultsPage;