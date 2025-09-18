import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AssessmentPartnerLayout from '../../../components/assessment/AssessmentPartnerLayout';
import CascoAntiguoAssessment from '../../../components/assessment/CascoAntiguoAssessment';

const theme3Config = {
  partner_id: 'casco_antiguo',
  name: 'Casco Antiguo Spanish School',
  language: 'spanish',
  branding: {
    logo_url: '/partners/casco-antiguo/casco_antiguo_logo.png',
    primary_color: '#004E89',
    secondary_color: '#007F5F',
    accent_color: '#FF6F61',
    background_gradient: 'linear-gradient(135deg, #FFF3E2 0%, #1ABC9C 50%, #004E89 100%)'
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
    min_seconds: 30,
    max_seconds: 60,
    warning_at: 50
  }
};

export default function Theme3MinimalistElegant() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Theme 3: Minimalist Elegant - Spanish Assessment</title>
        <meta name="description" content="Minimalist Cultural Elegance theme mockup" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style jsx global>{`
          .theme3-heading { font-family: 'Poppins', sans-serif; }
          .theme3-body { font-family: 'Poppins', sans-serif; }
        `}</style>
      </Head>

          <AssessmentPartnerLayout config={theme3Config}>
            <CascoAntiguoAssessment config={theme3Config} />
          </AssessmentPartnerLayout>
    </>
  );
}