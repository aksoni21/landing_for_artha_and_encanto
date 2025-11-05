import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid token in the URL hash
    const checkSession = async () => {
      const hash = window.location.hash;

      if (!hash || !hash.includes('access_token')) {
        setMessage('Invalid or expired reset link. Please request a new password reset.');
        setMessageType('error');
        return;
      }

      // If we have an access token, the session should be valid
      setIsValidSession(true);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      // Extract access token from URL hash
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // Remove the # at the start
      const accessToken = params.get('access_token');

      if (!accessToken) {
        setMessage('Invalid reset link. Please request a new password reset.');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      // Call Supabase auth API directly to update password
      const response = await fetch(
        'https://pticzmruhsicgramuddac.supabase.co/auth/v1/user',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aWN6bXJ1aHNpY2dyYW11ZGRhYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMyMDE4MTY3LCJleHAiOjIwNDc1OTQxNjd9.xWd3jZV7n4aqpvnEEO2eEwNXx4xKQB5rB_Dk5wgHIZY'
          },
          body: JSON.stringify({
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      // Success!
      setMessage('Password reset successful! Redirecting...');
      setMessageType('success');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error: any) {
      console.error('Password reset error:', error);
      setMessage(error.message || 'Failed to reset password. Please try again.');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - Encanto Speak AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-900 p-5">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎯</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600 text-sm">Enter your new password below</p>
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

          {isValidSession ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-gray-900 font-semibold mb-2 text-sm">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-gray-600">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-900 font-semibold mb-2 text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    Resetting Password...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          <div className="mt-8 text-center pt-6 border-t border-gray-200">
            <a
              href="https://www.encantospeak.com"
              className="text-purple-600 hover:underline font-semibold"
            >
              Back to Encanto Speak AI
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
