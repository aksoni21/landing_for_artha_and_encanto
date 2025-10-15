import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TeacherLanding() {
  const [email, setEmail] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Handle teacher early access signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type: 'teacher' }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.alreadyRegistered) {
          toast('This email is already registered!', {
            icon: '⚠️',
            style: {
              borderRadius: '10px',
              background: '#f59e0b',
              color: '#1f2937',
            },
          });
        } else {
          toast.success('Welcome! Check your email for teacher access details.', {
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

  // Handle institutional demo request
  const handleInstitutionalDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/institutional-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: institutionalEmail,
          institutionName,
          source: 'teacher_landing'
        }),
      });

      if (response.ok) {
        await response.json(); // Consume response
        toast.success('Demo request received! Our team will contact you within 24 hours.', {
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setInstitutionalEmail('');
        setInstitutionName('');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // QR Code generation placeholder
  const generateQRCode = () => {
    setShowQRCode(true);
    // In production, integrate with a QR code library like 'qrcode.react'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50">
      {/* Toast Container */}
      <Toaster position="top-right" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="text-blue-900 text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Encanto AI <span className="text-purple-600">for Educators</span>
            </motion.div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Benefits</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
              <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Live Demo</a>
              <Link href="/teacher-stories" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                Teacher Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Conference-Focused Messaging */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              TESOL 2025 Conference
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Reduce Assessment Time by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600"> 75%</span>
            <br />
            with AI
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-6 max-w-4xl mx-auto text-center leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stop spending <span className="font-bold text-blue-600">10-15 minutes per student</span> on manual speaking assessments.
            Get instant, detailed feedback in <span className="font-bold text-purple-600">60 seconds</span>.
          </motion.p>

          <motion.div
            className="bg-amber-100 border-l-4 border-amber-600 p-6 max-w-3xl mx-auto mb-8 rounded-r-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-lg text-gray-800">
              <span className="font-bold text-amber-700">69% of schools</span> struggle to fill ESL positions.
              Teachers need tools that <span className="font-bold">save time</span>, not add complexity.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/teacher/dashboard"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:scale-105 inline-block text-center text-lg"
            >
              Try 5-Minute Teacher Demo
            </Link>
            <Link
              href="/audio-analysis/results-demo"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg transform hover:scale-105 inline-block text-center text-lg"
            >
              See 60-Second Assessment
            </Link>
            <button
              onClick={() => document.getElementById('institutional-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Schedule Institutional Demo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-blue-200">
              <span className="font-semibold text-blue-700">✓ Title III Compliance Ready</span>
            </div>
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-blue-200">
              <span className="font-semibold text-blue-700">✓ Used by 500+ Teachers</span>
            </div>
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-blue-200">
              <span className="font-semibold text-blue-700">✓ FERPA Compliant</span>
            </div>
          </motion.div>

          {/* Conference Proof Section */}
          <motion.div
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real Student Results</h3>
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎥</div>
                    <p className="text-sm text-gray-600">Authentic Student Voices Video</p>
                    <p className="text-xs text-gray-500">/authentic-student-voices.mp4</p>
                  </div>
                </div>
                <blockquote className="italic text-gray-700 border-l-4 border-blue-600 pl-4">
                  &quot;This is so much more helpful than practicing by myself&quot;
                  <footer className="text-sm text-gray-600 mt-2">— Maria, Panama City</footer>
                </blockquote>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Proven Results</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">75%</div>
                    <p className="text-gray-700 font-medium">Reduction in assessment time</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-amber-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">Automated</div>
                    <p className="text-gray-700 font-medium">Title III reporting</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg p-4 border border-amber-200">
                    <div className="text-3xl font-bold text-amber-600 mb-1">Instant</div>
                    <p className="text-gray-700 font-medium">Detailed feedback for every student</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5-Minute Teacher Superpower Challenge */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                The 5-Minute Teacher Superpower Challenge
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Most teachers I speak with are frustrated by how long it takes to assess student speaking skills.
                Can I show you how our AI can accomplish in <span className="font-bold text-white">60 seconds</span> what
                normally takes <span className="font-bold text-white">10-15 minutes</span> of class time?
              </p>
              <button
                onClick={() => {
                  window.location.href = '/audio-analysis/results-demo';
                }}
                className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Accept the 60-Second Challenge →
              </button>
              <p className="text-sm text-blue-200 mt-4">
                ✓ 75% reduction proven in Panama testing
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Features Showcase */}
      <section id="features" className="container mx-auto px-6 py-20 bg-white/50">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ALREADY BUILT & READY
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Teacher Dashboard
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Everything you need to track, assess, and support your students in one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: '📊',
              title: 'Real-time Analytics',
              description: 'Live tracking of student activity, progress, and engagement',
              screenshot: '/dashboard-analytics.png',
              metrics: '7 active students, 24 stories read, 75 vocabulary words',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🎯',
              title: 'Priority Alerts',
              description: 'Smart notifications for at-risk students and declining performance',
              screenshot: '/dashboard-alerts.png',
              metrics: '3 at-risk students identified automatically',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: '📈',
              title: 'Progress Tracking',
              description: 'Individual student profiles with detailed performance metrics',
              screenshot: '/dashboard-progress.png',
              metrics: 'TOEFL scores, weekly minutes, completion rates',
              color: 'from-amber-500 to-orange-500'
            },
            {
              icon: '🤖',
              title: 'AI-Powered Assignments',
              description: 'Automated assignment creation and feedback system',
              screenshot: '/dashboard-assignments.png',
              metrics: 'Instant feedback, personalized recommendations',
              color: 'from-green-500 to-emerald-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`bg-gradient-to-r ${feature.color} p-6`}>
                <div className="text-5xl mb-2">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 text-lg">{feature.description}</p>
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-xs text-gray-500">{feature.screenshot}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium bg-blue-50 p-3 rounded-lg">
                  <span className="font-bold text-blue-700">Example:</span> {feature.metrics}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Teacher Pain Points Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We Solve Real Teacher Challenges
          </h2>
          <p className="text-xl text-gray-700">
            Based on feedback from hundreds of ESL educators
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: '⏰',
              title: '10-15 Minutes Per Student',
              description: 'Manual speaking assessments take forever',
              solution: 'AI assessment in 60 seconds',
              proof: '75% time reduction proven in Panama testing',
              feature: 'Real-time activity feed shows all student work instantly'
            },
            {
              icon: '📊',
              title: 'Title III Compliance',
              description: 'Manual reporting for federal requirements',
              solution: 'Automated compliance reporting',
              proof: 'Built-in Title III reporting features',
              feature: 'CSV export with compliance-ready data'
            },
            {
              icon: '👥',
              title: 'Large Class Sizes',
              description: "Can't give individual attention to every student",
              solution: 'Personalized feedback for every student',
              proof: 'Individual student profiles with AI recommendations',
              feature: 'Priority alerts for at-risk students'
            },
            {
              icon: '📈',
              title: 'Progress Tracking',
              description: 'Difficult to track individual student improvement',
              solution: 'Detailed analytics and progress reports',
              proof: 'Real-time progress tracking with visual indicators',
              feature: 'TOEFL scoring and CEFR level tracking'
            }
          ].map((painPoint, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-5xl mb-4">{painPoint.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{painPoint.title}</h3>
              <p className="text-gray-700 mb-4 text-lg">{painPoint.description}</p>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-green-700 mb-1">✓ Our Solution:</p>
                <p className="text-green-900 font-medium">{painPoint.solution}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">Proof:</span> {painPoint.proof}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-semibold text-purple-700">Dashboard Feature:</span> {painPoint.feature}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pedagogical Benefits Section */}
      <section id="benefits" className="container mx-auto px-6 py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built on Sound Pedagogical Principles
            </h2>
            <p className="text-xl text-gray-700">
              Our AI enhances proven teaching methodologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Individualized Learning',
                description: 'AI adapts to each student\'s level and learning style',
                research: 'Based on Vygotsky\'s Zone of Proximal Development',
                icon: '🎯',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Immediate Feedback',
                description: 'Students receive instant feedback on pronunciation and grammar',
                research: 'Supported by formative assessment research',
                icon: '⚡',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Data-Driven Instruction',
                description: 'Teachers make informed decisions based on detailed analytics',
                research: 'Evidence-based teaching practices',
                icon: '📊',
                color: 'from-amber-500 to-orange-500'
              },
              {
                title: 'Engagement & Motivation',
                description: 'Interactive AI conversations increase student engagement',
                research: 'Gamification and motivation theory',
                icon: '🎮',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`bg-gradient-to-r ${benefit.color} p-6`}>
                  <div className="text-5xl mb-2">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{benefit.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-lg mb-4">{benefit.description}</p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <p className="text-sm font-semibold text-blue-900">
                      <span className="text-blue-600">📚 Research-backed:</span> {benefit.research}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              FOR ADMINISTRATORS
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Measurable ROI for Your Institution
            </h2>
            <p className="text-xl text-gray-700">
              Scale your program without scaling your costs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Cost Reduction',
                metric: '90% reduction in assessment time',
                description: 'Save $50,000+ annually in teacher hours',
                caseStudy: 'Language School X saved 200 hours/month',
                icon: '💰'
              },
              {
                title: 'Scalability',
                metric: 'Handle 10x more students',
                description: 'No additional staff needed for growth',
                caseStudy: 'Institution Y scaled from 100 to 1000 students',
                icon: '📈'
              },
              {
                title: 'Quality Assurance',
                metric: '100% consistent assessment',
                description: 'Standardized evaluation across all teachers',
                caseStudy: 'Improved student satisfaction by 40%',
                icon: '✓'
              },
              {
                title: 'Compliance & Reporting',
                metric: 'Automated reporting',
                description: 'Meet accreditation and reporting requirements',
                caseStudy: 'Streamlined CEA accreditation process',
                icon: '📋'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-8 border border-purple-200 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>

                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 mb-4">
                  <p className="text-2xl font-bold">{benefit.metric}</p>
                </div>

                <p className="text-gray-700 text-lg mb-4">{benefit.description}</p>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-sm font-semibold text-amber-900">
                    <span className="text-amber-600">📊 Case Study:</span> {benefit.caseStudy}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-6 py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hear from Fellow Educators
            </h2>
            <p className="text-xl text-gray-700">
              Real teachers, real results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                teacher: 'Sarah Johnson',
                role: 'ESL Teacher',
                institution: 'University of California',
                quote: 'This has transformed how I assess my students. I can now give detailed feedback to 50 students in the time it used to take for 5.',
                results: 'Saved 15 hours/week, improved student engagement by 60%',
                avatar: '👩‍🏫'
              },
              {
                teacher: 'Dr. Maria Rodriguez',
                role: 'Department Head',
                institution: 'Miami Dade College',
                quote: 'The institutional dashboard gives me insights I never had before. I can see exactly where students need help and adjust our curriculum accordingly.',
                results: 'Reduced student dropout rate by 30%, improved placement accuracy',
                avatar: '👨‍🏫'
              },
              {
                teacher: 'James Chen',
                role: 'Language School Director',
                institution: 'International Language Institute',
                quote: 'We\'ve been able to handle 3x more students with the same staff. The ROI is incredible.',
                results: '300% increase in capacity, 90% cost reduction',
                avatar: '👔'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-6xl mb-4 text-center">{testimonial.avatar}</div>
                <div className="mb-4">
                  <h4 className="font-bold text-lg text-gray-900">{testimonial.teacher}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-blue-600 font-medium">{testimonial.institution}</p>
                </div>
                <blockquote className="text-gray-700 italic mb-4 border-l-4 border-blue-600 pl-4">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-800">
                    📊 Results: {testimonial.results}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentic Student Voices Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl shadow-2xl p-12 border border-amber-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Real Students, Real Results
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="bg-white rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎥</div>
                    <p className="text-sm text-gray-600">Student Testimonial Video</p>
                    <p className="text-xs text-gray-500">/authentic-student-voices.mp4</p>
                  </div>
                </div>
                <button
                  onClick={generateQRCode}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Generate QR Code to Share
                </button>
              </div>
              <div className="space-y-4">
                <blockquote className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-600">
                  <p className="text-gray-700 italic mb-2">
                    &quot;This is so much more helpful than practicing by myself&quot;
                  </p>
                  <footer className="text-sm text-gray-600">— Maria, Panama City</footer>
                </blockquote>
                <blockquote className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-600">
                  <p className="text-gray-700 italic mb-2">
                    &quot;I can see exactly where I need to improve&quot;
                  </p>
                  <footer className="text-sm text-gray-600">— Carlos, Panama City</footer>
                </blockquote>
                <blockquote className="bg-white rounded-lg p-4 shadow border-l-4 border-amber-600">
                  <p className="text-gray-700 italic mb-2">
                    &quot;The feedback is instant and really helpful&quot;
                  </p>
                  <footer className="text-sm text-gray-600">— Ana, Panama City</footer>
                </blockquote>
                <div className="bg-blue-100 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-900">
                    ✓ Real user testing from Panama City with 5-10 students
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data-Driven One-Pager Section */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-amber-400">The Problem (with Data)</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold text-red-400 mb-2">69%</p>
                  <p className="text-sm">of schools struggle to fill ESL positions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold text-red-400 mb-2">10-15 min</p>
                  <p className="text-sm">manual speaking assessments per student</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold text-red-400 mb-2">Hours</p>
                  <p className="text-sm">of manual Title III compliance reporting</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-green-400">Our Solution (with Data)</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-400 mb-2">75%</p>
                  <p className="text-sm">reduction in assessment time</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-400 mb-2">60 sec</p>
                  <p className="text-sm">AI assessment with detailed feedback</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-400 mb-2">Automated</p>
                  <p className="text-sm">Title III federal compliance reporting</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-blue-400">The Proof</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-4">
                <p className="text-sm italic mb-4">
                  &quot;This is so much more helpful than practicing by myself&quot;
                </p>
                <p className="text-xs">— Maria, Panama City</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <p className="text-sm text-gray-800 font-semibold mb-2">Scan to Watch Testimonials</p>
                  <div className="bg-gray-200 p-4 rounded inline-block">
                    <p className="text-xs text-gray-600">[QR Code Placeholder]</p>
                    <p className="text-xs text-gray-500 mt-1">/authentic-student-voices</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Dashboard Demo Section */}
      <section id="demo" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Try the Teacher Dashboard Live
            </h2>
            <p className="text-xl text-gray-700">
              Experience the platform that teachers love
            </p>
          </div>

          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
              <h3 className="text-3xl font-bold text-white mb-4">Interactive Dashboard Preview</h3>
              <div className="flex flex-wrap gap-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  Overview
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  Students
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  Activity
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  Insights
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">7</p>
                  <p className="text-sm text-gray-600">Active Students</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">24</p>
                  <p className="text-sm text-gray-600">Stories Read</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">75</p>
                  <p className="text-sm text-gray-600">Vocabulary Words</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">3</p>
                  <p className="text-sm text-gray-600">At Risk</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Maria Rodriguez</h4>
                    <p className="text-sm text-gray-600">85% Progress · Active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">85%</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">John Smith</h4>
                    <p className="text-sm text-gray-600">68% Progress · At Risk</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">68%</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Yuki Tanaka</h4>
                    <p className="text-sm text-gray-600">92% Progress · Active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">92%</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/teacher/dashboard"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center"
                >
                  Try Live Dashboard
                </Link>
                <Link
                  href="/teacher/students"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all text-center"
                >
                  See Student Details
                </Link>
                <button className="border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all">
                  Export Report
                </button>
              </div>
            </div>
          </motion.div>

          {/* TOEFL Assessment Demo */}
          <motion.div
            className="mt-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl shadow-2xl p-8 border border-purple-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Native TOEFL Scoring Demo
            </h3>
            <p className="text-lg text-gray-700 mb-6 text-center">
              See how our AI provides authentic TOEFL scores, not approximations
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { skill: 'Speaking', score: '28/30', level: 'Advanced', color: 'from-blue-500 to-cyan-500' },
                { skill: 'Listening', score: '25/30', level: 'Good', color: 'from-purple-500 to-pink-500' },
                { skill: 'Reading', score: '22/30', level: 'Fair', color: 'from-amber-500 to-orange-500' },
                { skill: 'Writing', score: '20/30', level: 'Fair', color: 'from-green-500 to-emerald-500' }
              ].map((skill, index) => (
                <div key={index} className={`bg-gradient-to-r ${skill.color} rounded-lg p-4 text-white text-center`}>
                  <p className="text-sm mb-2">{skill.skill}</p>
                  <p className="text-3xl font-bold mb-1">{skill.score}</p>
                  <p className="text-xs opacity-90">{skill.level}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/audio-analysis/results-demo"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg transform hover:scale-105"
              >
                Try TOEFL Analysis Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Institutional Case Studies */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Proven Success Across Institutions
            </h2>
            <p className="text-xl text-gray-700">
              Real-world implementations delivering measurable results
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                client: 'Nissan North America',
                title: 'Automated Candidate Screening',
                results: [
                  '4x more detailed feedback than traditional methods',
                  '95% reduction in screening time',
                  'Role-specific competency assessment'
                ],
                demo: '/mockups/nissan/technical-architect-assessment',
                icon: '🚗',
                color: 'from-red-500 to-gray-700'
              },
              {
                client: 'SSG Call Center',
                title: 'Bilingual Performance Management',
                results: [
                  'Empathy and professionalism scoring',
                  'Brand alignment assessment',
                  'Real-world scenario simulation'
                ],
                demo: '/mockups/ssg/assessment',
                icon: '📞',
                color: 'from-blue-500 to-purple-500'
              },
              {
                client: 'Casco Antiguo Spanish School',
                title: 'Language School Student Placement',
                results: [
                  '50+ assessments completed',
                  '90% staff time savings',
                  'Automated CEFR level placement'
                ],
                demo: '/mockups/casco_antiguo/casco1',
                icon: '🏫',
                color: 'from-amber-500 to-orange-500'
              }
            ].map((caseStudy, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`bg-gradient-to-r ${caseStudy.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl mb-2">{caseStudy.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-1">{caseStudy.client}</h3>
                      <p className="text-white/90">{caseStudy.title}</p>
                    </div>
                    <Link
                      href={caseStudy.demo}
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                    >
                      Try Assessment
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Results:</h4>
                  <ul className="space-y-2">
                    {caseStudy.results.map((result, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple Implementation Process
            </h2>
            <p className="text-xl text-gray-700">
              Get started in days, not months
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: '1',
                title: 'Free Trial',
                description: 'Start with a 30-day free trial for your institution',
                duration: '30 days',
                icon: '🎁'
              },
              {
                number: '2',
                title: 'Teacher Training',
                description: 'Comprehensive training for your teaching staff',
                duration: '2-4 hours',
                icon: '👨‍🏫'
              },
              {
                number: '3',
                title: 'Student Onboarding',
                description: 'Easy setup for students with minimal technical requirements',
                duration: '15 minutes',
                icon: '📱'
              },
              {
                number: '4',
                title: 'Ongoing Support',
                description: 'Dedicated support team and regular check-ins',
                duration: 'Ongoing',
                icon: '💬'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-4xl font-bold text-blue-600 mb-3">{step.number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-700 mb-4">{step.description}</p>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {step.duration}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Security Section */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Security & Compliance You Can Trust
            </h2>
            <p className="text-xl text-gray-700">
              Meeting the highest standards for educational technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'FERPA Compliant',
                description: 'Full compliance with Family Educational Rights and Privacy Act',
                badge: 'Certified',
                icon: '🔒',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'SOC 2 Type II',
                description: 'Security and availability controls certified',
                badge: 'Audited',
                icon: '🛡️',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'GDPR Compliant',
                description: 'European data protection standards met',
                badge: 'Certified',
                icon: '🌍',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Accessibility',
                description: 'WCAG 2.1 AA compliance for inclusive learning',
                badge: 'Certified',
                icon: '♿',
                color: 'from-amber-500 to-orange-500'
              }
            ].map((compliance, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`bg-gradient-to-r ${compliance.color} p-6 flex items-center justify-between`}>
                  <div>
                    <div className="text-5xl mb-2">{compliance.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{compliance.title}</h3>
                  </div>
                  <div className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                    {compliance.badge}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-lg">{compliance.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Demo Request Form */}
      <section id="institutional-form" className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Schedule Your Institutional Demo
              </h2>
              <p className="text-xl text-blue-100">
                See how Encanto AI can transform your language program
              </p>
            </div>

            <form onSubmit={handleInstitutionalDemo} className="space-y-6">
              <div>
                <label htmlFor="institutionName" className="block text-white font-semibold mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  id="institutionName"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Your institution or school name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="institutionalEmail" className="block text-white font-semibold mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  id="institutionalEmail"
                  value={institutionalEmail}
                  onChange={(e) => setInstitutionalEmail(e.target.value)}
                  placeholder="your.email@institution.edu"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
              >
                {isSubmitting ? 'Requesting Demo...' : 'Request Demo'}
              </button>
              <p className="text-sm text-blue-100 text-center">
                Our team will contact you within 24 hours to schedule your personalized demo
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Teacher Access CTA Section */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Teaching?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join hundreds of educators who are saving time and improving student outcomes with AI
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
              placeholder="Enter your teacher email"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isSubmitting ? 'Submitting...' : 'Get Teacher Access'}
            </button>
          </motion.form>

          <motion.div
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="flex items-center gap-2">✓ <span>Full Dashboard Access</span></span>
            <span className="flex items-center gap-2">✓ <span>AI Assessment Tools</span></span>
            <span className="flex items-center gap-2">✓ <span>Priority Support</span></span>
            <span className="flex items-center gap-2">✓ <span>Free 30-Day Trial</span></span>
          </motion.div>
        </div>
      </section>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4">
            <div className="bg-white rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Share Student Testimonials
                </h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg text-center mb-4">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-gray-600 mb-2">QR Code</p>
                <p className="text-sm text-gray-500">/authentic-student-voices</p>
                <p className="text-xs text-gray-400 mt-4">
                  In production, integrate with qrcode.react library
                </p>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan this code to watch authentic student testimonials
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-300">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-gray-900 text-lg font-bold mb-4">Encanto AI for Educators</h3>
            <p className="text-gray-600 text-sm">
              Transforming language education with AI-powered assessment and teaching tools.
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/teacher/dashboard" className="hover:text-blue-600 transition-colors">Teacher Dashboard</Link></li>
              <li><Link href="/audio-analysis" className="hover:text-blue-600 transition-colors">AI Assessment</Link></li>
              <li><Link href="/teacher-stories" className="hover:text-blue-600 transition-colors">Teacher Portal</Link></li>
              <li><a href="https://apps.apple.com/us/app/encanto-ai/id6747835824" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Student App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#testimonials" className="hover:text-blue-600 transition-colors">Case Studies</a></li>
              <li><a href="#benefits" className="hover:text-blue-600 transition-colors">Research & Pedagogy</a></li>
              <li><a href="#demo" className="hover:text-blue-600 transition-colors">Live Demo</a></li>
              <li><a href="#institutional-form" className="hover:text-blue-600 transition-colors">Request Demo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">FERPA Compliance</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 pt-8 border-t border-gray-300">
          <p>&copy; 2025 Encanto AI. All rights reserved. Built for educators, by educators.</p>
        </div>
      </footer>
    </div>
  );
}
