import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CaribbeanSunsetTheme } from '../../../components/assessment/theme-variants/CaribbeanSunsetTheme';

const theme5Config = {
  partner_id: 'casco_antiguo',
  name: 'Casco Antiguo Spanish School',
  language: 'spanish',
  branding: {
    logo_url: '/partners/casco-antiguo/casco_antiguo_logo.png',
    primary_color: '#FF7F50',
    secondary_color: '#006994',
    accent_color: '#32CD32',
    background_gradient: 'linear-gradient(135deg, #F4A460 0%, #FF7F50 50%, #4B0082 100%)'
  },
  ui_text: {
    language: 'english',
    welcome_title: 'Spanish Language Assessment',
    welcome_subtitle: 'Casco Antiguo Spanish School',
    recording_instructions: 'Please speak in Spanish for 15-60 seconds about any topic you like. You can talk about your hobbies, family, plans, work, or anything that comes to mind.',
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

export default function Theme5CaribbeanSunset() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 to-purple-400 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Theme 5: Caribbean Sunset - Spanish Assessment</title>
        <meta name="description" content="Caribbean Sunset theme mockup" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style jsx global>{`
          .theme5-heading { font-family: 'Nunito', sans-serif; }
          .theme5-body { font-family: 'Nunito', sans-serif; }
        `}</style>
      </Head>

 
          <CaribbeanSunsetTheme config={theme5Config} />
    </>
  );
}