import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import AssessmentPartnerLayout from '../../components/assessment/AssessmentPartnerLayout';
import CascoAntiguoAssessment from '../../components/assessment/CascoAntiguoAssessment';

interface AssessmentPartnerConfig {
  partner_id: string;
  name: string;
  language: string;
  branding: {
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background_image?: string;
  };
  ui_text: {
    language: string;
    welcome_title: string;
    welcome_subtitle: string;
    recording_instructions: string;
    recording_button: string;
    stop_button: string;
    submit_button: string;
    success_message: string;
    error_message: string;
    duration_warning: string;
  };
  recording_duration: {
    min_seconds: number;
    max_seconds: number;
    warning_at: number;
  };
}

interface AssessmentPartnerPageProps {
  partner: string;
  config: AssessmentPartnerConfig | null;
  error?: string;
}

const AssessmentPartnerPage: React.FC<AssessmentPartnerPageProps> = ({ partner, config, error }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (error || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-4">
        <Head>
          <title>Partner Not Found - EncantoSpeak</title>
        </Head>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center"
        >
          <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Partner Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || `Assessment partner "${partner}" not found or not configured.`}
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

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{config.ui_text.welcome_title} - {config.name}</title>
        <meta name="description" content={`Language assessment for ${config.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Partner-specific favicon */}
        {config.branding.logo_url && (
          <link rel="icon" href={config.branding.logo_url} />
        )}

        {/* Custom theme colors for mobile browsers */}
        <meta name="theme-color" content={config.branding.primary_color} />
        <meta name="msapplication-navbutton-color" content={config.branding.primary_color} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Open Graph meta tags */}
        <meta property="og:title" content={`${config.ui_text.welcome_title} - ${config.name}`} />
        <meta property="og:description" content={`Language assessment for ${config.name}`} />
        <meta property="og:type" content="website" />

        {/* Preload partner assets */}
        {config.branding.logo_url && (
          <link rel="preload" href={config.branding.logo_url} as="image" />
        )}
        {config.branding.background_image && (
          <link rel="preload" href={config.branding.background_image} as="image" />
        )}
      </Head>

      <AssessmentPartnerLayout config={config}>
        {renderAssessmentComponent(partner, config)}
      </AssessmentPartnerLayout>
    </>
  );
};

function renderAssessmentComponent(partner: string, config: AssessmentPartnerConfig) {
  switch (partner) {
    case 'casco-antiguo':
    case 'casco_antiguo':
      return <CascoAntiguoAssessment config={config} />;

    default:
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Assessment Coming Soon
          </h2>
          <p className="text-gray-600">
            Assessment functionality for {config.name} is being prepared.
          </p>
        </motion.div>
      );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { partner } = context.params as { partner: string };

  try {
    // Fetch partner configuration from Next.js API route
    const host = context.req.headers.host || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const response = await fetch(`${protocol}://${host}/api/assessment/config/${partner}`);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          props: {
            partner,
            config: null,
            error: `Assessment partner "${partner}" not found.`
          }
        };
      }

      throw new Error(`API responded with status: ${response.status}`);
    }

    const config = await response.json();

    return {
      props: {
        partner,
        config
      }
    };
  } catch (error) {
    console.error('Error fetching partner config:', error);

    // Fallback to hardcoded config for development
    if (partner === 'casco-antiguo' || partner === 'casco_antiguo') {
      const fallbackConfig = {
        partner_id: 'casco_antiguo',
        name: 'Casco Antiguo Spanish School',
        language: 'spanish',
        branding: {
          logo_url: '/partners/casco-antiguo/casco_antiguo_logo.png',
          primary_color: '#1a365d',
          secondary_color: '#2d5a87',
          accent_color: '#ed8936',
          background_image: '/partners/casco-antiguo/background.jpg'
        },
        ui_text: {
          language: 'english',
          welcome_title: 'Spanish Language Assessment',
          welcome_subtitle: 'Casco Antiguo Spanish School',
          recording_instructions: 'Please speak in Spanish for 30-60 seconds about any topic you like. You can talk about your hobbies, family, plans, work, or anything that comes to mind.',
          recording_button: 'Start Recording',
          stop_button: 'Stop Recording',
          submit_button: 'Submit Assessment',
          success_message: 'Thank you! Your assessment has been submitted successfully. The school will receive the results via email.',
          error_message: 'Sorry, there was an error. Please try again.',
          duration_warning: 'You have {seconds} seconds remaining'
        },
        recording_duration: {
          min_seconds: 15,
          max_seconds: 60,
          warning_at: 50
        }
      };

      return {
        props: {
          partner,
          config: fallbackConfig
        }
      };
    }

    return {
      props: {
        partner,
        config: null,
        error: 'Unable to load partner configuration. Please try again later.'
      }
    };
  }
};

export default AssessmentPartnerPage;