import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactLinks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      try {
        const response = await fetch('http://localhost:8000/save_email_lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            source: 'contact_page'
          }),
        });

        if (response.ok) {
          console.log('✅ Email lead saved successfully');
          setIsSubmitted(true);
          setTimeout(() => {
            setIsModalOpen(false);
            setIsSubmitted(false);
            setUserEmail('');
          }, 2000);
        } else {
          console.error('❌ Failed to save email lead');
          // Still show success to user, but log the error
          setIsSubmitted(true);
          setTimeout(() => {
            setIsModalOpen(false);
            setIsSubmitted(false);
            setUserEmail('');
          }, 2000);
        }
      } catch (error) {
        console.error('❌ Error saving email lead:', error);
        // Still show success to user, but log the error
        setIsSubmitted(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          setUserEmail('');
        }, 2000);
      }
    }
  };

  const socialLinks = [
    
    {
      name: 'LinkedIn - Encanto AI',
      url: 'https://www.linkedin.com/company/encanto-ai/',
      icon: '💼',
      description: 'Connect with Encanto AI on LinkedIn'
    },{
      name: 'LinkedIn - Ankur Anthony',
      url: 'https://www.linkedin.com/in/ankurksoni/',
      icon: '💼',
      description: 'Connect with Ankur Anthony on LinkedIn'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/encanto_speak_ai?igsh=aWdhMmJnNTNoeTR1&utm_source=qr',
      icon: '📷',
      description: 'Connect with us on Instagram'
    },
    
  ];

  const appLinks = [
    {
      name: 'iOS App Store',
      url: 'https://apps.apple.com/us/app/encanto-ai/id6747835824', // Replace with actual App Store URL when available
      icon: '📱',
      description: 'Download for iPhone & iPad',
      available: true
    },
    {
      name: 'Google Play Store',
      url: '#', // Replace with actual Play Store URL when available
      icon: '🤖',
      description: 'Download for Android',
      available: false
    },
    {
      name: 'Web App',
      url: 'https://www.encantospeak.com/dashboard_ai',
      icon: '💻',
      description: 'Try in your browser',
      available: true
    }
  ];
  const demoLinks = [
    {
      name: 'Demo',
      url: 'https://www.encantospeak.com/teacher-stories',
      icon: '🌐',
      description: 'Check out our teacher AI assistant demo',
      isExternal: true
    },
    {
      name: 'Email for personalized demo',
      url: '#',
      icon: '✉️',
      description: 'Send us a message',
      isExternal: false,
      onClick: () => setIsModalOpen(true)
    }
  ];
  return (
    <>
      <Head>
        <title>Contact & Links - Encanto AI</title>
        <meta name="description" content="Connect with Speak Encanto - AI speaking partners for students, AI assistant for teachers. Find all our social links and app downloads." />
        <meta name="keywords" content="Encanto AI, contact, social media, app download, ESOL, language learning" />
        <link rel="icon" type="image/svg+xml" href="/encanto-ai-assets/favicon-e.svg" />
        <link rel="icon" type="image/x-icon" href="/encanto-ai-assets/favicon.ico" />
        <meta property="og:title" content="Contact & Links - Encanto AI" />
        <meta property="og:description" content="AI speaking partners for students, AI assistant for teachers" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors font-medium hover:underline bg-blue-50 px-3 py-2 rounded-lg">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Encanto AI
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              AI speaking partners for students, AI assistant for teachers
            </p>
            
          </div>

          {/* Contact & Social Links */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Connect With Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-200 group cursor-pointer transform hover:scale-[1.02] active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{link.icon}</span>
                    <div>
                      <h3 className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                        {link.name} →
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* App Downloads */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Get the App
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {appLinks.map((app, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl p-6 shadow-md border-2 ${
                    app.available 
                      ? 'border-blue-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer transform hover:scale-[1.02] active:scale-95' 
                      : 'border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {app.available ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="text-center">
                        <span className="text-4xl mb-3 block">{app.icon}</span>
                        <h3 className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors mb-2">
                          {app.name} →
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {app.description}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl mb-3 block">{app.icon}</span>
                      <h3 className="font-semibold text-gray-500 mb-2">
                        {app.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Coming Soon
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Demo Links */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Demo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {demoLinks.map((demo, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer transform hover:scale-[1.02] active:scale-95"
                  onClick={demo.onClick}
                >
                  {demo.isExternal ? (
                    <a
                      href={demo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="text-center">
                        <span className="text-4xl mb-3 block">{demo.icon}</span>
                        <h3 className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors mb-2">
                          {demo.name} →
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {demo.description}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="text-center group">
                      <span className="text-4xl mb-3 block">{demo.icon}</span>
                      <h3 className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors mb-2">
                        {demo.name} →
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {demo.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* About Section */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              About Encanto AI
            </h2>
            <p className="text-gray-600 text-center leading-relaxed">
              We&apos;re revolutionizing language learning with AI-powered conversation partners that provide 
              personalized speaking practice for students and intelligent teaching assistance for educators. 
              Perfect for ESOL classrooms and language learning environments.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2024 Encanto AI. Making language barriers disappear.
            </p>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">✉️</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h3>
              <p className="text-gray-600 mb-4">
                Contact me directly at: 
                <br />
                <span className="font-semibold text-blue-600">ankur.soni@encantospeak.com</span>
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your email address (so I can contact you):
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <p className="text-gray-600">Thanks! I'll be in touch soon.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}