import Head from 'next/head';
import Link from 'next/link';

export default function ContactLinks() {
  const socialLinks = [
    {
      name: 'Website',
      url: 'https://www.speakencanto.com',
      icon: '🌐',
      description: 'Visit our main website'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/anthony-soni',
      icon: '💼',
      description: 'Connect professionally'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/speakencanto',
      icon: '🐦',
      description: 'Follow our updates'
    },
    {
      name: 'Email',
      url: 'mailto:anthony@speakencanto.com',
      icon: '✉️',
      description: 'Send us a message'
    }
  ];

  const appLinks = [
    {
      name: 'iOS App Store',
      url: '#', // Replace with actual App Store URL when available
      icon: '📱',
      description: 'Download for iPhone & iPad',
      available: false
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
      url: 'https://www.speakencanto.com',
      icon: '💻',
      description: 'Try in your browser',
      available: true
    }
  ];

  return (
    <>
      <Head>
        <title>Contact & Links - Speak Encanto</title>
        <meta name="description" content="Connect with Speak Encanto - AI speaking partners for students, AI assistant for teachers. Find all our social links and app downloads." />
        <meta name="keywords" content="Speak Encanto, contact, social media, app download, ESOL, language learning" />
        <link rel="icon" type="image/svg+xml" href="/encanto-ai-assets/favicon-e.svg" />
        <link rel="icon" type="image/x-icon" href="/encanto-ai-assets/favicon.ico" />
        <meta property="og:title" content="Contact & Links - Speak Encanto" />
        <meta property="og:description" content="AI speaking partners for students, AI assistant for teachers" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Speak Encanto
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              AI speaking partners for students, AI assistant for teachers
            </p>
            <p className="text-gray-500">
              Connect with us and download our app
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
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{link.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {link.name}
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
                  className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 ${
                    app.available 
                      ? 'hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer' 
                      : 'opacity-60'
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
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {app.name}
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

          {/* About Section */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              About Speak Encanto
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
              © 2024 Speak Encanto. Making language barriers disappear.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}