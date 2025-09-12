import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EncantoAILanding() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('web');
  const [showDemo, setShowDemo] = useState(false);

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
    { id: 'esl', name: 'ESL', flag: '🇺🇸', description: 'Learn English as a Second Language' },
    { id: 'korean', name: 'Korean', flag: '🇰🇷', description: 'Learn Korean with honorifics and culture' }
  ];


  const combinedFeatures = [
    {
      icon: '🎯',
      title: 'AI-Powered Assessment & Analytics',
      description: 'Instant CEFR/TOEFL scoring with detailed component analysis and comprehensive progress tracking for teachers and students',
      highlight: 'NEW',
      audience: 'Teachers & Students'
    },
    {
      icon: '📚',
      title: 'Complete Curriculum Integration',
      description: 'Seamlessly integrate with existing ESL programs, from individual tutoring to large institutional deployments',
      highlight: 'EDUCATOR TOOLS',
      audience: 'All Environments'
    },
    {
      icon: '💬',
      title: 'Live Conversation Practice',
      description: 'AI-powered speaking sessions with real-time feedback, available on web dashboard and mobile app',
      highlight: '',
      audience: 'Students'
    },
    {
      icon: '📊',
      title: 'Smart Progress Management',
      description: 'Automated student tracking, institutional reporting, and personalized learning paths with gamified engagement',
      highlight: '',
      audience: 'Teachers & Admins'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
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
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="text-white text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Encanto AI
            </motion.div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors">Platform</a>
              {/* <a href="#demo" className="text-gray-300 hover:text-emerald-400 transition-colors">Demo</a> */}
              <a href="#use-cases" className="text-gray-300 hover:text-emerald-400 transition-colors">Use Cases</a>
              {/* <a href="#languages" className="text-gray-300 hover:text-emerald-400 transition-colors">Languages</a> */}
              <Link href="/teacher-stories" className="text-gray-300 hover:text-emerald-400 transition-colors">Teacher Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        {/* Video Background - Plays on all devices */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            preload="auto"
            onLoadStart={() => console.log('🎬 Video started loading')}
            onCanPlay={() => console.log('▶️ Video can play')}
            onPlaying={() => console.log('🎥 Video is playing')}
            onError={(e) => console.error('❌ Video error:', e)}
          >
            <source src="/hero-background-optimized.mp4" type="video/mp4" />
            <p className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Video not supported
            </p>
          </video>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/40 to-emerald-900/30"></div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text font-medium text-sm mb-4">
              AI-Powered Teaching Platform
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Transform Your ESL Teaching with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"> AI-Powered Tools</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered tools for modern ESL teaching. Create lessons, track progress, assess speaking skills.
          </motion.p>

          {/* Platform Tabs */}
          <motion.div 
            className="flex justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-1 flex border border-white/10">
              <button
                onClick={() => setActiveTab('web')}
                className={`px-5 py-2.5 rounded-md transition-all duration-300 text-sm font-medium ${
                  activeTab === 'web'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                Teachers
              </button>
              <button
                onClick={() => setActiveTab('mobile')}
                className={`px-5 py-2.5 rounded-md transition-all duration-300 text-sm font-medium ${
                  activeTab === 'mobile'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                Students
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {activeTab === 'web' ? (
              <a 
                href="https://www.encantospeak.com/dashboard_ai" 
                // href="http://localhost:3000/dashboard_ai"
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 shadow-lg transform hover:scale-105 inline-block text-center"
              >
                Try Dashboard
              </a>
            ) : (
              <a 
                href="https://apps.apple.com/us/app/encanto-ai/id6747835824" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 shadow-lg transform hover:scale-105 inline-block text-center"
              >
                Download App
              </a>
            )}
            <button 
              onClick={() => setShowDemo(true)}
              className="border border-white/30 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Watch Demo
            </button>
          </motion.div>
          
          {/* Language Ticker */}
          <motion.div 
            className="w-full overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-lg py-3 border border-white/10 overflow-hidden">
              <motion.div
                className="flex items-center space-x-8 whitespace-nowrap"
                animate={{ x: [0, -100] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4, 
                  ease: "linear" 
                }}
                style={{ width: "200%" }}
              >
                {/* First set of languages */}
                {languages.map((lang, index) => (
                  <div key={`first-${index}`} className="flex items-center space-x-2 px-4">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-white font-medium">{lang.name}</span>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {languages.map((lang, index) => (
                  <div key={`second-${index}`} className="flex items-center space-x-2 px-4">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-white font-medium">{lang.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Features & Use Cases Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Teaching Platform</h2>
          <p className="text-xl text-gray-300">Powerful educator tools and student engagement across web and mobile</p>
        </div>
        
        {/* Combined Features */}
        <div className="grid md:grid-cols-2 gap-8">
          {combinedFeatures.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-black/40 transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-emerald-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {feature.highlight && (
                <span className="inline-block bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-xs font-bold px-2 py-1 rounded-full mb-4">
                  {feature.highlight}
                </span>
              )}
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <div className="text-sm text-emerald-400 font-medium">
                {feature.audience}
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      {/* Social Proof Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16" >
          <h2 className="text-4xl font-bold text-white mb-4">Trusted by ESL Educators</h2>
          {/* <p className="text-xl text-gray-300">Join hundreds of teachers and institutions transforming language education</p> */}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-bold text-white mb-2">85%</h3>
            <p className="text-gray-300">Of teachers surveyed said this would improve student engagement</p>
          </motion.div>
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-2xl font-bold text-white mb-2">95%</h3>
            <p className="text-gray-300">Teachers said this would reduce grading time</p>
          </motion.div>
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">4x</h3>
            <p className="text-gray-300">More detailed student feedback vs traditional methods</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your ESL Teaching?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join hundreds of educators who are enhancing their teaching with AI-powered language instruction tools
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for educator access"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isSubmitting ? 'Submitting...' : 'Get Educator Access'}
            </button>
          </motion.form>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="flex items-center gap-2">🎓 <span>Teacher Dashboard</span></span>
            <span className="flex items-center gap-2">📱 <span>Student Mobile App</span></span>
            <span className="flex items-center gap-2">📊 <span>AI Assessment Tools</span></span>
            <span className="flex items-center gap-2">🏫 <span>Institutional Support</span></span>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/20">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Encanto AI</h3>
            <p className="text-gray-400 text-sm">
              Revolutionary AI-powered language learning for the modern world.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="http://localhost:3000/teacher-stories" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Web Application</a></li>
              <li><a href="https://apps.apple.com/us/app/encanto-ai/id6747835824" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">iOS App Store</a></li>
              <li><Link href="/audio-analysis" className="hover:text-white transition-colors">Audio Analysis</Link></li>
              <li><Link href="/vocabulary" className="hover:text-white transition-colors">Vocabulary Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 pt-8 border-t border-white/10">
          <p>&copy; 2024 Encanto AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {activeTab === 'web' ? 'Teacher Dashboard Demo' : 'Student Mobile App Demo'}
                </h3>
                <button 
                  onClick={() => setShowDemo(false)}
                  className="text-gray-400 hover:text-white text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className={`relative rounded-lg overflow-hidden ${activeTab === 'web' ? 'aspect-video' : 'aspect-[9/16] max-w-sm mx-auto'}`}>
                <video
                  width="100%"
                  height="100%"
                  controls
                  autoPlay
                  className="absolute inset-0 object-contain"
                >
                  <source src={activeTab === 'web' ? "/FinalWeb_compressed.mp4" : "/AppMusic_compressed.mp4"} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}