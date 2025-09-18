import React from 'react';
import { motion } from 'framer-motion';

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

interface AssessmentPartnerLayoutProps {
  config: AssessmentPartnerConfig;
  children: React.ReactNode;
}

const AssessmentPartnerLayout: React.FC<AssessmentPartnerLayoutProps> = ({ config, children }) => {
  const { branding, ui_text } = config;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: branding.background_image
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${branding.background_image})`
          : `linear-gradient(135deg, ${branding.primary_color}, ${branding.secondary_color})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md border-b border-white/20"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {branding.logo_url && (
                <img
                  src={branding.logo_url}
                  alt={config.name}
                  className="h-24 w-auto rounded-md"
                />
              )}
              {/* <div>
                <h1 className="text-white text-2xl font-bold">
                  {ui_text.welcome_title}
                </h1>
                <p className="text-white/80 text-sm">
                  {ui_text.welcome_subtitle}
                </p>
              </div> */}
            </div>

            {/* Language indicator */}
            {/* <div className="bg-white/20 rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium capitalize">
                {config.language}
              </span>
            </div>*/}
          </div> 
        </div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-white/60 text-sm">
            <p>© 2025 EncantoSpeak</p>
            <p>Powered by AI Language Assessment</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :root {
          --partner-primary: ${branding.primary_color};
          --partner-secondary: ${branding.secondary_color};
          --partner-accent: ${branding.accent_color};
        }
      `}</style>
    </div>
  );
};

export default AssessmentPartnerLayout;