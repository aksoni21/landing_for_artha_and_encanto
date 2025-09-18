import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Upload } from 'lucide-react';

interface ThemeConfig {
  name: string;
  description: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background: string;
  text_color: string;
  card_bg: string;
  font_heading: string;
  font_body: string;
}

const themes: ThemeConfig[] = [
  {
    name: "Option 1: Vibrant Historic Casco Viejo",
    description: "Warm, welcoming, vibrant yet classy — inspired by old colonial buildings",
    primary_color: "#D35400",
    secondary_color: "#1ABC9C",
    accent_color: "#FDEBD0",
    background: "linear-gradient(135deg, #FDEBD0 0%, #F39C12 100%)",
    text_color: "#2C3E50",
    card_bg: "#FFFFFF",
    font_heading: "Playfair Display",
    font_body: "Montserrat"
  },
  {
    name: "Option 2: Modern Tropical",
    description: "Fresh, energetic, bright with tropical flair representing Panama&apos;s natural beauty",
    primary_color: "#004E89",
    secondary_color: "#007F5F",
    accent_color: "#FF6F61",
    background: "linear-gradient(135deg, #FFF3E2 0%, #1ABC9C 100%)",
    text_color: "#333333",
    card_bg: "#FFFFFF",
    font_heading: "Poppins",
    font_body: "Poppins"
  },
  {
    name: "Option 3: Minimalist Cultural Elegance",
    description: "Sophisticated, focused on cultural heritage with minimalist design",
    primary_color: "#000000",
    secondary_color: "#FFD700",
    accent_color: "#800020",
    background: "linear-gradient(135deg, #FAF9F6 0%, #E8E8E8 100%)",
    text_color: "#000000",
    card_bg: "#FFFFFF",
    font_heading: "Lora",
    font_body: "Roboto"
  },
  {
    name: "Option 4: Academic Heritage",
    description: "Scholarly, trustworthy, traditional - emphasizing educational excellence",
    primary_color: "#002147",
    secondary_color: "#B8860B",
    accent_color: "#228B22",
    background: "linear-gradient(135deg, #F7F3E9 0%, #E6D7B7 100%)",
    text_color: "#002147",
    card_bg: "#FFFFFF",
    font_heading: "Crimson Text",
    font_body: "Open Sans"
  },
  {
    name: "Option 5: Caribbean Sunset",
    description: "Energetic, tropical, inviting - capturing Panama&apos;s vibrant sunset colors",
    primary_color: "#FF7F50",
    secondary_color: "#006994",
    accent_color: "#32CD32",
    background: "linear-gradient(135deg, #F4A460 0%, #FF7F50 100%)",
    text_color: "#FFFFFF",
    card_bg: "rgba(255, 255, 255, 0.95)",
    font_heading: "Nunito",
    font_body: "Nunito"
  }
];

const ThemeMockup: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8 border rounded-lg overflow-hidden shadow-lg">
      {/* Theme Header */}
      <div className="bg-gray-100 p-4 border-b">
        <h3 className="font-bold text-lg text-gray-800">{theme.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
        <div className="flex gap-2 mt-2">
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: theme.primary_color }}
            title="Primary"
          />
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: theme.secondary_color }}
            title="Secondary"
          />
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: theme.accent_color }}
            title="Accent"
          />
        </div>
      </div>

      {/* Mockup Display */}
      <div
        className="min-h-96 p-6 flex flex-col items-center justify-center"
        style={{
          background: theme.background,
          color: theme.text_color,
          fontFamily: theme.font_body
        }}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/partners/casco-antiguo/casco_antiguo_logo.png"
            alt="Casco Antiguo Logo"
            className="h-12 w-auto"
          />
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-xl shadow-lg p-6"
          style={{
            backgroundColor: theme.card_bg,
            color: theme.text_color
          }}
        >
          <h1
            className="text-2xl font-bold text-center mb-2"
            style={{
              fontFamily: theme.font_heading,
              color: theme.primary_color
            }}
          >
            Spanish Language Assessment
          </h1>

          <h2
            className="text-lg text-center mb-4"
            style={{ color: theme.secondary_color }}
          >
            Casco Antiguo Spanish School
          </h2>

          <p className="text-sm text-center mb-6 opacity-80">
            Please speak in Spanish for 30-60 seconds about any topic you like.
          </p>

          {/* Recording Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors shadow-lg"
              style={{
                backgroundColor: theme.primary_color,
                color: theme.card_bg
              }}
            >
              <Mic size={20} />
              Start Recording
            </button>

            {/* Progress Indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: theme.secondary_color,
                  width: '40%'
                }}
              />
            </div>

            {/* Secondary Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border-2 transition-colors"
              style={{
                borderColor: theme.accent_color,
                color: theme.accent_color
              }}
            >
              <Upload size={16} />
              Submit Assessment
            </button>
          </div>
        </motion.div>

        {/* Font Info */}
        <div className="mt-4 text-xs opacity-70 text-center">
          <div>Heading: {theme.font_heading}</div>
          <div>Body: {theme.font_body}</div>
        </div>
      </div>
    </div>
  );
};

export const ThemeMockups: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Casco Antiguo Assessment - UI Theme Options
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the visual theme that best represents your school&apos;s brand and creates
            the ideal experience for your Spanish language assessment platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <ThemeMockup key={index} theme={theme} />
          ))}
        </div>

        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Next Steps</h3>
          <p className="text-gray-600 mb-4">
            Once you select your preferred theme, we&apos;ll implement it across the entire assessment platform.
          </p>
          <div className="text-sm text-gray-500">
            All themes are fully responsive and optimized for desktop, tablet, and mobile devices.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeMockups;