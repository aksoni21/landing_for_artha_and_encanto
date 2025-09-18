import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AcademicHeritageTheme } from '../../../components/assessment/theme-variants/AcademicHeritageTheme';

const theme4Config = {
  partner_id: 'casco_antiguo',
  name: 'Casco Antiguo Spanish School',
  language: 'spanish',
  branding: {
    logo_url: '/partners/casco-antiguo/casco_antiguo_logo.png',
    primary_color: '#002147',
    secondary_color: '#B8860B',
    accent_color: '#228B22',
    background_gradient: 'linear-gradient(135deg, #F7F3E9 0%, #E6D7B7 100%)'
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

export default function Theme4AcademicHeritage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Theme 4: Academic Heritage - Spanish Assessment</title>
        <meta name="description" content="Academic Heritage theme mockup" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style jsx global>{`
          .theme4-heading { font-family: 'Crimson Text', serif; }
          .theme4-body { font-family: 'Open Sans', sans-serif; }
        `}</style>
      </Head>

          <AcademicHeritageTheme config={theme4Config} />
    </>
  );
}