import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getBackendURL } from '../../utils/environment';

type UserType = 'teacher' | 'student' | 'coordinator' | null;

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  organization: string;
  problem: string;
  user_type: string;
  source: string;
  event: string;
}

export default function ContactLinks() {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    organization: '',
    problem: '',
    event: 'TexTESOL'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchLeads = async (password: string) => {
    setLoadingLeads(true);
    setLeadsError(null);
    try {
      const response = await fetch(`${getBackendURL()}/get_problem_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      if (response.status === 401) {
        setLeadsError('Incorrect password');
        setIsAuthenticated(false);
        return;
      }
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
        setIsAuthenticated(true);
      } else {
        setLeadsError(result.message || 'Failed to fetch leads');
        setIsAuthenticated(false);
      }
    } catch (e) {
      setLeadsError('An error occurred while fetching leads.');
      setIsAuthenticated(false);
      console.error(e);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(password);
  };

  const handleSendIntroEmail = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEmailPopup(true);
  };

  const confirmSendEmail = async () => {
    if (!selectedLead) return;

    setSendingEmail(true);
    try {
      const response = await fetch(`${getBackendURL()}/send_intro_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedLead.name,
          email: selectedLead.email,
          organization: selectedLead.organization,
          user_type: selectedLead.user_type,
          event: selectedLead.event
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setShowEmailPopup(false);
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const backendUrl = getBackendURL();
      // console.log('🔍 Backend URL:', backendUrl);
      const response = await fetch(`${backendUrl}/save_problem_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: selectedUserType,
          source: 'contact_page'
        }),
      });

      if (response.ok) {
        console.log('✅ Feedback saved successfully');
        setIsSubmitted(true);
        setTimeout(() => {
          setSelectedUserType(null);
          setIsSubmitted(false);
          setFormData({ email: '', name: '', organization: '', problem: '', event: 'TexTESOL' });
        }, 3000);
      } else {
        console.error('❌ Failed to save feedback');
        setIsSubmitted(true);
        setTimeout(() => {
          setSelectedUserType(null);
          setIsSubmitted(false);
          setFormData({ email: '', name: '', organization: '', problem: '', event: 'TexTESOL' });
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Error saving feedback:', error);
      setIsSubmitted(true);
      setTimeout(() => {
        setSelectedUserType(null);
        setIsSubmitted(false);
        setFormData({ email: '', name: '', organization: '', problem: '', event: 'TexTESOL' });
      }, 3000);
    }
  };

  const userTypes = [
    {
      type: 'teacher' as UserType,
      icon: '📚',
      title: 'I\'m a Teacher',
      description: 'Share the challenges you face in teaching language learners',
      color: 'blue',
      prompts: [
        'How much time do you spend grading student work?',
        'What\'s your biggest challenge with differentiated instruction?',
        'How do you provide speaking practice to all students?'
      ]
    },
    {
      type: 'coordinator' as UserType,
      icon: '💼',
      title: 'I\'m a District/School Coordinator',
      description: 'Share the operational challenges you\'re facing',
      color: 'purple',
      prompts: [
        'How do you track student progress across classrooms?',
        'What data do you wish you had access to?',
        'What are your biggest concerns about teacher workload?'
      ]
    },    {
      type: 'student' as UserType,
      icon: '🎓',
      title: 'I\'m a Student',
      description: 'Tell us what makes learning difficult for you',
      color: 'green',
      prompts: [
        'What makes it hard to practice speaking?',
        'Do you get enough feedback on your work?',
        'What would help you learn better?'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hoverBorder: 'hover:border-blue-400',
        text: 'text-blue-600',
        hoverText: 'hover:text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700',
        gradient: 'from-blue-50 to-blue-100'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        hoverBorder: 'hover:border-green-400',
        text: 'text-green-600',
        hoverText: 'hover:text-green-700',
        button: 'bg-green-600 hover:bg-green-700',
        gradient: 'from-green-50 to-green-100'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hoverBorder: 'hover:border-purple-400',
        text: 'text-purple-600',
        hoverText: 'hover:text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700',
        gradient: 'from-purple-50 to-purple-100'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <>
      <Head>
        <title>Share Your Challenges - Encanto AI</title>
        {/* <meta name="description" content="Tell us about your challenges with language learning and teaching. We're here to help." /> */}
        <meta name="keywords" content="Encanto AI, feedback, language learning challenges, teaching problems" />
        <link rel="icon" type="image/svg+xml" href="/encanto-ai-assets/favicon-e.svg" />
        <link rel="icon" type="image/x-icon" href="/encanto-ai-assets/favicon.ico" />
        <meta property="og:title" content="Share Your Challenges - Encanto AI" />
        <meta property="og:description" content="We want to hear about your language learning and teaching challenges" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors font-medium hover:underline bg-blue-50 px-3 py-2 rounded-lg">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {showLeads ? 'Leads' : 'We Want to Hear From You'}
            </h1>
            {/* <p className="text-xl text-gray-600 mb-2 max-w-3xl mx-auto">
              Tell us about the challenges you face. Your feedback helps us build better solutions for language learning.
            </p> */}
          </div>

          {showLeads ? (
            isAuthenticated ? (
              <div>
                <button
                  onClick={() => setShowLeads(false)}
                  className="mb-6 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  ← Back to form
                </button>
                {loadingLeads ? (
                  <p>Loading leads...</p>
                ) : leadsError ? (
                  <p className="text-red-500">{leadsError}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border text-black">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Date</th>
                          <th className="py-2 px-4 border-b">Name</th>
                          <th className="py-2 px-4 border-b">Email</th>
                          <th className="py-2 px-4 border-b">Event</th>
                          <th className="py-2 px-4 border-b">Actions</th>
                          {/* <th className="py-2 px-4 border-b">Organization</th> */}
                          {/* <th className="py-2 px-4 border-b">User Type</th> */}
                          {/* <th className="py-2 px-4 border-b">Problem</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id}>
                            <td className="py-2 px-4 border-b">{new Date(lead.created_at).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">{lead.name}</td>
                            <td className="py-2 px-4 border-b">{lead.email}</td>
                            <td className="py-2 px-4 border-b">{lead.event}</td>
                            <td className="py-2 px-4 border-b">
                              <button
                                onClick={() => handleSendIntroEmail(lead)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Send Intro Email
                              </button>
                            </td>
                            {/* <td className="py-2 px-4 border-b">{lead.organization}</td> */}
                            {/* <td className="py-2 px-4 border-b">{lead.user_type}</td> */}
                            {/* <td className="py-2 px-4 border-b">{lead.problem}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                  View Leads
                </button>
              </form>
            )
          ) : !selectedUserType ? (
            <>
              {/* User Type Selection */}
              <div className="mb-16">
                {/* <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Who Are You?
                </h2> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {userTypes.map((user) => {
                    const colors = getColorClasses(user.color);
                    return (
                      <div
                        key={user.type}
                        onClick={() => setSelectedUserType(user.type)}
                        className={`${colors.bg} rounded-2xl p-8 shadow-lg border-2 ${colors.border} ${colors.hoverBorder} cursor-pointer transform hover:scale-105 transition-all duration-300`}
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">{user.icon}</div>
                          <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                            {user.title}
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {user.description}
                          </p>
                          <button className={`w-full ${colors.button} text-white font-semibold py-3 px-6 rounded-lg transition-colors`}>
                            Contact Form →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Why We Ask Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-md border border-indigo-100 mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Why We Ask
                </h2>
                <p className="text-gray-700 text-center leading-relaxed max-w-3xl mx-auto">
                  We&apos;re building AI tools to solve real problems in language education. By understanding your specific challenges, we can create solutions that truly help teachers teach better, students learn faster, and coordinators manage more effectively.
                </p>
              </div>
            </>
          ) : (
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => setSelectedUserType(null)}
                className="mb-6 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                ← Back to selection
              </button>

              {!isSubmitted ? (
                <div className={`bg-gradient-to-br ${getColorClasses(userTypes.find(u => u.type === selectedUserType)?.color || 'blue').gradient} rounded-2xl p-8 shadow-xl border-2 ${getColorClasses(userTypes.find(u => u.type === selectedUserType)?.color || 'blue').border}`}>
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">
                      {userTypes.find(u => u.type === selectedUserType)?.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {userTypes.find(u => u.type === selectedUserType)?.title}
                    </h2>
                    <p className="text-gray-600">
                      {userTypes.find(u => u.type === selectedUserType)?.description}
                    </p>
                  </div>

                  {/* Thought Starters */}
                  {/* <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">Some questions to think about (but feel free to share anything!):</h3>
                    <ul className="space-y-2">
                      {userTypes.find(u => u.type === selectedUserType)?.prompts.map((prompt, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500 mt-3 italic">
                      These are just conversation starters - share whatever challenges matter most to you.
                    </p>
                  </div> */}

                  <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-sm text-gray-700">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedUserType === 'student' ? 'School/Institution' : 'School/District Name'}
                      </label>
                      <input
                        type="text"
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={selectedUserType === 'student' ? 'Lincoln High School' : 'ABC School District'}
                      />
                    </div>

                    <div>
                      <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
                        Conference/Event (optional)
                      </label>
                      <input
                        type="text"
                        id="event"
                        value={formData.event}
                        onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., ACTFL 2024, NABE Conference"
                      />
                    </div>

                    <div>
                      <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                        Notes: (optional)
                      </label>
                      <textarea
                        id="problem"
                        value={formData.problem}
                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none"
                        placeholder="Share as much detail as you'd like."
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full ${getColorClasses(userTypes.find(u => u.type === selectedUserType)?.color || 'blue').button} text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg`}
                    >
                      Submit My Feedback
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
                  <div className="text-green-600 text-6xl mb-6">✓</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
                  <p className="text-gray-600 text-lg mb-2">
                    We really appreciate you taking the time to share your challenges with us.
                  </p>
                  <p className="text-gray-600">
                    We&apos;ll review your feedback and may reach out to learn more.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Prefer to Talk Directly?
              </h2>
              <p className="text-gray-600 mb-4">
                Email the founder at: <a href="mailto:ankur.soni@encantospeak.com" className="text-blue-600 hover:text-blue-700 font-semibold">ankur.soni@encantospeak.com</a>
              </p>
              {/* <div className="flex justify-center gap-6 mt-6">
                <a
                  href="https://www.linkedin.com/company/encanto-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  LinkedIn - Encanto AI →
                </a>
                <a
                  href="https://www.linkedin.com/in/ankurksoni/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  LinkedIn - Ankur Anthony →
                </a>
              </div> */}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2024 Encanto AI. Making language barriers disappear.
            </p>
            <button
              onClick={() => setShowLeads(true)}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              View Leads
            </button>
          </div>
        </div>

        {/* Email Popup Modal */}
        {showEmailPopup && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Intro Email</h2>
              <p className="text-gray-700 mb-6">
                Send intro email to <span className="font-semibold">{selectedLead.name}</span> at{' '}
                <span className="font-semibold text-blue-600">{selectedLead.email}</span>?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEmailPopup(false)}
                  disabled={sendingEmail}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSendEmail}
                  disabled={sendingEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                >
                  {sendingEmail ? 'Sending...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
