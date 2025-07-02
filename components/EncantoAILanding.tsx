import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function EncantoAILanding() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.alreadyRegistered) {
          toast('This email is already registered for early access!', {
            icon: '⚠️',
            style: {
              borderRadius: '10px',
              background: '#fbbf24',
              color: '#1f2937',
            },
          });
        } else {
          toast.success('Thank you! You\'ve been added to our early access list.', {
            duration: 5000,
            style: {
              borderRadius: '10px',
              background: '#10b981',
              color: '#ffffff',
            },
          });
          setEmail('');
        }
      } else {
        toast.error('Something went wrong. Please try again.', {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error('Something went wrong. Please try again.', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#ffffff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = [
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸', description: 'Natural conversations in Spanish' },
    { id: 'german', name: 'German', flag: '🇩🇪', description: 'Practice German with AI tutor' },
    { id: 'esl', name: 'ESL', flag: '🇺🇸', description: 'Learn English as a Second Language' }
  ];

  const features = [
    {
      icon: '🎤',
      title: 'Real-time Voice Conversations',
      description: 'Practice speaking naturally with AI tutors through crystal-clear voice conversations'
    },
    {
      icon: '🌍',
      title: 'Mixed Language Support',
      description: 'Start in English, transition to your target language at your own pace'
    },
    {
      icon: '📊',
      title: 'Learning Analytics',
      description: 'Track your progress, vocabulary growth, and conversation skills over time'
    },
    {
      icon: '🏆',
      title: 'Gamified Learning',
      description: 'Earn achievements, complete daily challenges, and stay motivated'
    },
    {
      icon: '🎯',
      title: 'Personalized Experience',
      description: 'AI adapts to your skill level and learning preferences'
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Practice anywhere, anytime with our intuitive mobile app'
    }
  ];

  const conversationExample = {
    spanish: [
      { speaker: 'You', message: 'Hello, how are you today?' },
      { speaker: 'AI Tutor', message: '¡Hola! Estoy muy bien, gracias. ¿Y tú? ¿Cómo estás?' },
      { speaker: 'You', message: 'I\'m good, thank you. Can we practice ordering food?' },
      { speaker: 'AI Tutor', message: '¡Por supuesto! Vamos a practicar cómo pedir comida en un restaurante.' }
    ],
    german: [
      { speaker: 'You', message: 'Hello, how are you today?' },
      { speaker: 'AI Tutor', message: 'Hallo! Mir geht es sehr gut, danke. Und dir? Wie geht es dir?' },
      { speaker: 'You', message: 'I\'m good, thank you. Can we practice ordering food?' },
      { speaker: 'AI Tutor', message: 'Natürlich! Lass uns üben, wie man Essen in einem Restaurant bestellt.' }
    ],
    esl: [
      { speaker: 'You', message: 'Hello, how are you today?' },
      { speaker: 'AI Tutor', message: 'Hello! I\'m doing great, thank you. How about you? How are you feeling?' },
      { speaker: 'You', message: 'I\'m good, thank you. Can we practice ordering food?' },
      { speaker: 'AI Tutor', message: 'Absolutely! Let\'s practice ordering food at a restaurant. This is a very useful skill!' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl font-bold">Encanto AI</div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-white hover:text-cyan-300 transition-colors">Features</a>
            <a href="#demo" className="text-white hover:text-cyan-300 transition-colors">Demo</a>
            <a href="#languages" className="text-white hover:text-cyan-300 transition-colors">Languages</a>
            <a href="#contact" className="text-white hover:text-cyan-300 transition-colors">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-white text-sm font-medium mb-4">
              🎤 Voice-First Language Learning
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Master Languages Through
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Natural Conversations</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Practice Spanish, German, and English with AI tutors in real-time voice conversations. 
            Speak naturally, learn effortlessly, and track your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg">
              Start Your First Conversation
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">
              Watch Demo
            </button>
          </div>
          
          {/* Language Selector */}
          <div className="flex justify-center space-x-4">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedLanguage === lang.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">See It In Action</h2>
          <p className="text-xl text-gray-300">Experience a real conversation with our AI tutor</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Live Conversation</span>
              </div>
              <div className="text-gray-400 text-sm">
                {languages.find(l => l.id === selectedLanguage)?.flag} {languages.find(l => l.id === selectedLanguage)?.name}
              </div>
            </div>
            
            <div className="space-y-4">
              {conversationExample[selectedLanguage as keyof typeof conversationExample].map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.speaker === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                      msg.speaker === 'You'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">{msg.speaker}</div>
                    <div>{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Encanto AI?</h2>
          <p className="text-xl text-gray-300">Revolutionary features that make language learning natural and effective</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Available Languages</h2>
          <p className="text-xl text-gray-300">Start with these languages, more coming soon</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {languages.map((lang) => (
            <div key={lang.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-6xl mb-4">{lang.flag}</div>
              <h3 className="text-2xl font-semibold text-white mb-4">{lang.name}</h3>
              <p className="text-gray-300 mb-6">{lang.description}</p>
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Native-level conversations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Grammar corrections</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Cultural context</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Mixed language support</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Trusted by Language Learners</h2>
          <p className="text-xl text-gray-300">Join thousands of students improving their language skills</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-bold text-white mb-2">85%</h3>
            <p className="text-gray-300">Improvement in speaking confidence</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-2xl font-bold text-white mb-2">15 min</h3>
            <p className="text-gray-300">Average daily practice time</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">3x</h3>
            <p className="text-gray-300">Faster learning compared to traditional methods</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Language Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of language learners who are already speaking with confidence
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Get Early Access'}
            </button>
          </form>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>📱 iOS & Android</span>
            <span>🌐 Web Version</span>
            <span>🎧 Voice-First</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/20">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 Encanto AI. All rights reserved.</p>
          <div className="mt-2 space-x-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 