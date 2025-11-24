import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'teacher'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.alreadyRegistered) {
          toast('You\'re already on the waitlist!', {
            icon: '✓',
            style: {
              borderRadius: '10px',
              background: '#f59e0b',
              color: '#1f2937',
            },
          });
        } else {
          toast.success('Welcome to the waitlist! Check your email to stay up-to-date on our progress.', {
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
        });
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title color="black">Join the Waitlist - Encanto AI</title>
        <meta name="description" content="Join the Encanto AI waitlist and get early access to AI-powered language learning tools." />
        <link rel="icon" type="image/svg+xml" href="/encanto-ai-assets/favicon-e.svg" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50">
        <Toaster position="top-right" />

        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-blue-200 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <motion.div
                  className="text-blue-900 text-2xl font-bold cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Encanto AI
                </motion.div>
              </Link>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Check out our platform &rarr;
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section with Video */}
        <section className="relative px-6 py-20 min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-70"
              preload="auto"
            >
              <source src="/class_learning_optimized.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-purple-50/60 to-amber-50/70"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto max-w-2xl relative z-10 text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-black mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              Join the Waitlist
            </motion.h1>

            <motion.p
              className="text-xl text-gray-900 mb-8 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
            >
              Get early access to AI-powered language learning
            </motion.p>

            {/* Email Form */}
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-gray-700 px-4 py-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-lg"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-600">and</span>
                </div>
              </div>

              {/* Schedule Meeting CTA */}
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-3">
                  Have questions or just want to chat?
                </p>
                <a
                  href="https://calendly.com/ankur-soni-encantospeak/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Schedule a Call with the Founder
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
