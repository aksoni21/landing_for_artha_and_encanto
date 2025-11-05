import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ShareStory() {
  const router = useRouter();
  const { storyId, title } = router.query;

  const [email, setEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Call backend API to send email
      const response = await fetch('/api/share-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: email,
          senderName: senderName || 'A friend',
          storyTitle: title || 'this story',
          storyId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Story shared successfully! They will receive an email with a link to download the app.');
        setMessageType('success');
        setEmail('');
        setSenderName('');
      } else {
        setMessage(data.message || 'Failed to share story. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Share error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Share Story - Encanto Speak AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📤</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Share This Story</h1>
            <p className="text-gray-600 text-sm">
              Invite someone to read &quot;{title || 'this story'}&quot; on Encanto Speak AI
            </p>
          </div>

          {message && (
            <div
              className={`mb-5 p-4 rounded-lg text-sm ${
                messageType === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="senderName" className="block text-gray-700 font-semibold mb-2 text-sm">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm">
                Recipient&apos;s Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="friend@example.com"
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-semibold text-base transition-all ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Invitation'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>They&apos;ll receive an email with a link to download Encanto Speak AI and read the story!</p>
          </div>
        </div>
      </div>
    </>
  );
}
