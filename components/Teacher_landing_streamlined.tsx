import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DistrictsSection from './DistrictsSection';

export default function TeacherLandingStreamlined() {
  const [email, setEmail] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        await response.json();
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
              Encanto AI 
            </motion.div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Meet Our Teachers</a>
              <Link href="/title3/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">District Dashboard</Link>
              <button
                onClick={() => document.getElementById('institutional-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Schedule Institutional Demo
              </button>
              {/* <Link href="/teacher-stories" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                Teacher Login
              </Link> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Conference-Focused Messaging */}
      <section className="relative px-6 py-20 overflow-hidden">
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
            <p className="absolute inset-0 flex items-center justify-center text-gray-700 text-sm">
              Video not supported
            </p>
          </video>
          {/* Gradient overlay to blend with light background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-purple-50/60 to-amber-50/70"></div>
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
              TESOL 2025 Conference
            </span>
          </motion.div> */}

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 text-center drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            Students Too Nervous.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 drop-shadow-xl"> Teachers Too Busy.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white mb-6 max-w-4xl mx-auto text-center leading-relaxed drop-shadow-md bg-black/50 backdrop-blur-sm rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We solved both. Students get <span className="font-bold text-blue-300">unlimited judgment-free speaking practice</span>.
            Teachers get <span className="font-bold text-purple-300">automated assessments</span> with
            <span className="font-bold text-amber-300"> detailed speaking data and instant feedback</span>.
          </motion.p>

          {/* <motion.div
            className="bg-amber-100/95 backdrop-blur-sm border-l-4 border-amber-600 p-6 max-w-3xl mx-auto mb-8 rounded-r-lg shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-lg text-gray-900 font-medium">
              <span className="font-bold text-amber-700">69% of schools</span> struggle to fill ESL positions.
              Teachers need tools that <span className="font-bold">save time</span>, not add complexity.
            </p>
          </motion.div> */}

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
              href="https://apps.apple.com/us/app/encanto-ai/id6747835824"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-pink-800 transition-all duration-300 shadow-lg transform hover:scale-105 inline-block text-center text-lg"
            >
              📱 Download Student App
            </Link>
            <Link
              href="/audio-analysis/results-demo"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg transform hover:scale-105 inline-block text-center text-lg"
            >
              See Demo Assessment Results
            </Link>
            
            {/* <button
              onClick={() => document.getElementById('institutional-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Schedule Institutional Demo
            </button> */}
          </motion.div>

          {/* Trust Indicators */}
          {/* <motion.div
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
          </motion.div> */}

          {/* Testimonials Carousel Section */}
          <TestimonialsCarousel />
        </div>
      </section>

      {/* 5-Minute Teacher Superpower Challenge */}
      {/* <section className="container mx-auto px-6 py-20">
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
      </section> */}

      {/* Dashboard Features Showcase */}
      <section id="features" className="container mx-auto px-6 py-20 bg-white/50">
        <div className="text-center mb-16">
          {/* <motion.span
            className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ALREADY BUILT & READY
          </motion.span> */}
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
              icon: '📚',
              title: 'AI-Powered Stories',
              description: 'Interactive stories that adapt to each student\'s level with real-time engagement tracking',
              metrics: '24 stories read, personalized difficulty, instant comprehension feedback',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🗣️',
              title: 'Speaking Assessment',
              description: 'Instant AI feedback on pronunciation, fluency, and speaking skills',
              metrics: '60-second assessments, detailed feedback, TOEFL scoring',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: '🏫',
              title: 'District-Level Analytics',
              description: 'Title III compliance tracking, AMAO reporting, and multi-school performance monitoring',
              metrics: 'Track proficiency rates, engagement scores, and student outcomes across all schools',
              color: 'from-amber-500 to-orange-500'
            },            {
              icon: '📊',
              title: 'Student Analytics',
              description: 'Real-time dashboard showing exactly how each student is performing',
              metrics: '7 active students, progress tracking, engagement metrics',
              color: 'from-purple-500 to-pink-500'
            },

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
                <p className="text-sm text-gray-600 font-medium bg-blue-50 p-3 rounded-lg">
                  <span className="font-bold text-blue-700">Example:</span> {feature.metrics}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Meet Our Teachers Section */}
      <section id="testimonials" className="container mx-auto px-6 py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Teachers
            </h2>
            <p className="text-xl text-gray-700">
              Who helped develop this product to solve real teacher problems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Amber */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4 text-center">👩🏼‍🏫</div>
              <div className="mb-4 text-center">
                <h4 className="font-bold text-xl text-gray-900">Amber</h4>
                <p className="text-sm text-gray-600">Private English Tutor & Business Owner</p>
                <p className="text-sm text-blue-600 font-medium">WaiGuo Friends English LLC</p>
              </div>
              <blockquote className="text-gray-700 mb-4 border-l-4 border-blue-600 pl-4 text-sm leading-relaxed">
                &quot;When the team asked me about my biggest time eaters as a private English tutor and business owner, I had a huge list. I knew AI could help save me time and provide quick feedback and direction for my students, but I didn&apos;t know how to do it. Encanto AI put it together! The app starts with comprehensible input through stories that I can assign or the student can generate based off of skill level and interest. From there, the student has access to all the definitions, can put his or her own flashcards together, practice pronunciation, and begin chatting with the AI for speaking practice on that topic. Everything the student does and struggles with is sent directly to my dashboard so I can quickly see what each student needs help in before class. Before Encanto AI, I did all of this for EACH student. Now, it&apos;s possible to focus my energy on specific improvement points rather than spending class time &apos;testing&apos; how well the student has grasped the concept to determine whether we can move on. This is a powerful tool!&quot;
              </blockquote>
            </motion.div>

            {/* Moriar */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-6xl mb-4 text-center">👩🏽‍🏫</div>
              <div className="mb-4 text-center">
                <h4 className="font-bold text-xl text-gray-900">Mariar</h4>
                <p className="text-sm text-gray-600">English Tutor</p>
                <p className="text-sm text-blue-600 font-medium">ESL Teacher, Georgia School District</p>
              </div>
              <blockquote className="text-gray-700 mb-4 border-l-4 border-blue-600 pl-4 text-sm leading-relaxed">
                &quot;As an English tutor working with diverse learners, I needed a way to give my students more speaking practice between our sessions. Encanto AI solved that problem perfectly. My students can practice conversations on topics we&apos;ve covered in class, and I can review their recordings to see exactly where they need help. The AI-generated stories at different reading levels are especially valuable - they give students engaging content matched to their exact proficiency level. What really stands out is the speaking section after each story. Students can summarize what they read, discuss the themes, or practice retelling the story in their own words. This builds both comprehension and speaking skills at the same time. What I love most is that students aren&apos;t afraid to make mistakes with the AI, so they practice more and come to our sessions with more confidence. It&apos;s like having a teaching assistant available 24/7 for each student.&quot;
              </blockquote>
            </motion.div>
          </div>
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
              icon: '👥',
              title: 'Large Class Sizes',
              description: "Can't track how each student is doing individually",
              solution: 'Real-time analytics for every student',
              proof: 'See exactly how each student is performing with stories, speaking, and vocabulary'
            },
            {
              icon: '📚',
              title: 'Engagement Tracking',
              description: 'Hard to know if students are actually learning from stories',
              solution: 'AI-powered stories with engagement tracking',
              proof: 'See which stories students read, how long they spent, comprehension scores'
            },
            {
              icon: '🗣️',
              title: 'Speaking Assessment',
              description: 'No way to assess speaking skills consistently',
              solution: 'AI-powered speaking assessments with instant feedback',
              proof: '60-second assessments with detailed pronunciation and fluency feedback'
            },
            {
              icon: '📊',
              title: 'Student Data',
              description: 'No visibility into student progress and performance',
              solution: 'Complete dashboard with student analytics',
              proof: 'Real-time tracking of stories read, vocabulary learned, speaking practice'
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

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">Proof:</span> {painPoint.proof}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Dashboard Demo Section */}
      {/* <section id="demo" className="container mx-auto px-6 py-20">
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
        </div>
      </section> */}

      {/* Districts Section */}
      <DistrictsSection />

      {/* Unified Contact Section */}
      <section id="institutional-form" className="container mx-auto px-6 py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get Started with Encanto AI
            </motion.h2>
            <motion.p
              className="text-xl text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Whether you&apos;re a teacher or district administrator, we&apos;re here to help
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Individual Teachers */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">👩‍🏫</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Individual/Private Teachers</h3>
                <p className="text-gray-600">Get immediate access to the teacher dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="teacherEmail" className="block text-gray-700 font-semibold mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="teacherEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your company.com or school email"
                    className="w-full text-gray-700 px-4 py-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Teacher Access'}
                </button>
              </form>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">✓ Full Dashboard Access</div>
                <div className="flex items-center gap-2">✓ AI Assessment Tools</div>
                <div className="flex items-center gap-2">✓ Student Progress Tracking</div>
              </div>
            </motion.div>

            {/* District/School Admins */}
            <motion.div
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏫</div>
                <h3 className="text-2xl font-bold mb-2">For Districts & Schools</h3>
                <p className="text-blue-100">Schedule a personalized demo for your institution</p>
              </div>

              <form onSubmit={handleInstitutionalDemo} className="space-y-4">
                <div>
                  <label htmlFor="institutionName" className="block font-semibold mb-2">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    id="institutionName"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Your school or district"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="institutionalEmail" className="block font-semibold mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="institutionalEmail"
                    value={institutionalEmail}
                    onChange={(e) => setInstitutionalEmail(e.target.value)}
                    placeholder="admin@district.edu"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isSubmitting ? 'Requesting Demo...' : 'Schedule Demo'}
                </button>
                <p className="text-sm text-blue-100 text-center">
                  We&apos;ll contact you within 24 hours
                </p>
              </form>

              <div className="mt-6 space-y-2 text-sm text-blue-100">
                <div className="flex items-center gap-2">✓ Title III Compliance Tracking</div>
                <div className="flex items-center gap-2">✓ Multi-School Analytics</div>
                <div className="flex items-center gap-2">✓ Custom Implementation Plan</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
              <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
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

// Testimonials Carousel Component
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "David Gold",
      location: "Casco Antiguo Spanish School, Panama",
      role: "School Owner & Director",
      quote: "Before working with Encanto AI, we only had written assessments for our Spanish students. Now we can also provide speaking assessments, which gives us a much better picture of each student's actual language ability. The AI assessment takes about 60 seconds and gives us detailed feedback on pronunciation and fluency along with a transcript. It's been very helpful for placement decisions.",
      avatar: "👨🏼",
      language: "Spanish School"
    },
    {
      name: "Ana",
      location: "Panama City",
      role: "English Student",
      quote: "I can practice speaking English anytime I want without feeling nervous. The AI gives me helpful feedback on my pronunciation that my teacher can review later.",
      avatar: "👩🏻‍🎓",
      language: "Learning English"
    },
    {
      name: "Shanida",
      location: "Panama City",
      role: "English Student",
      quote: "This is so much more helpful than practicing by myself. I love getting instant feedback on my grammar and fluency. It's like having a tutor available 24/7.",
      avatar: "👩🏾‍🎓",
      language: "Learning English"
    },
    {
      name: "Michael",
      location: "Miami",
      role: "Spanish Student",
      quote: "Learning Spanish with Encanto AI has been incredible. The speaking practice helps me build confidence before I use Spanish in real conversations.",
      avatar: "👨🏼‍🎓",
      language: "Learning Spanish"
    },
    {
      name: "Karla Castillo",
      location: "Spanish Panama Language School",
      role: "Academic Director",
      quote: "The speaking assessments have transformed how we evaluate our students' progress. We can now track speaking development alongside reading and writing skills. Our teachers love having access to the detailed pronunciation analysis and transcripts - it saves hours of manual assessment work each week.",
      avatar: "👩🏽‍🏫",
      language: "Spanish School"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Hear from Our Users
      </h3>

      {/* Carousel Container */}
      <div className="relative">
        {/* Testimonial Card */}
        <div className="min-h-[300px] flex items-center justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
              {/* Avatar and Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{testimonials[currentIndex].avatar}</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonials[currentIndex].location}
                  </p>
                  <p className="text-xs text-purple-600 font-medium mt-1">
                    {testimonials[currentIndex].language}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-gray-700 italic border-l-4 border-blue-600 pl-4 mb-4">
                &quot;{testimonials[currentIndex].quote}&quot;
              </blockquote>

              {/* Role */}
              <p className="text-sm text-gray-600 font-medium">
                — {testimonials[currentIndex].role}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Previous testimonial"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Next testimonial"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-blue-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Stats Section Below Carousel */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Proven Results</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">Practice</div>
            <p className="text-gray-700 font-medium text-sm">Situational conversations</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-amber-50 rounded-lg p-4 border border-purple-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">Instant</div>
            <p className="text-gray-700 font-medium text-sm">Detailed feedback for every student</p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg p-4 border border-amber-200 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-1">60 sec</div>
            <p className="text-gray-700 font-medium text-sm">Complete speaking assessment</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
