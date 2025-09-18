import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { VibrantHistoricTheme } from '../../../components/assessment/theme-variants/VibrantHistoricTheme';

const theme1Config = {
  partner_id: 'casco_antiguo',
  name: 'Casco Antiguo Spanish School',
  language: 'spanish',
  branding: {
    logo_url: '/partners/casco-antiguo/casco_antiguo_logo.png',
    primary_color: '#D35400',
    secondary_color: '#1ABC9C',
    accent_color: '#FDEBD0',
    background_gradient: 'linear-gradient(135deg, #FDEBD0 0%, #F39C12 100%)'
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

export default function Theme1VibrantHistoric() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Theme 1: Vibrant Historic - Spanish Assessment</title>
        <meta name="description" content="Vibrant Historic Casco Viejo theme mockup" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style jsx global>{`
          .theme1-heading { font-family: 'Playfair Display', serif; }
          .theme1-body { font-family: 'Montserrat', sans-serif; }
        `}</style>
      </Head>

          <VibrantHistoricTheme config={theme1Config} />
        
    </>
  );
}