import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/authService';

export default function DashboardLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if already logged in (only redirect if explicitly coming from a protected route)
  useEffect(() => {
    // Only auto-redirect if there's a redirect parameter (user was sent here from a protected page)
    const redirectTo = router.query.redirect as string;
    if (redirectTo) {
      const teacherAuth = localStorage.getItem('teacher-auth');
      if (teacherAuth) {
        try {
          const authData = JSON.parse(teacherAuth);
          // Check if login is still valid (within 24 hours)
          const loginTime = new Date(authData.loginTime);
          const now = new Date();
          const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceLogin < 24) {
            router.push(redirectTo);
            return;
          }
        } catch (e) {
          // Invalid auth data, clear it
          localStorage.removeItem('teacher-auth');
          localStorage.removeItem('supabase.auth.token');
        }
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success && result.user && result.token) {
        // Store authentication info
        localStorage.setItem('teacher-auth', JSON.stringify({
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          id: result.user.id,
          loginTime: new Date().toISOString()
        }));
        localStorage.setItem('supabase.auth.token', result.token);
        
        const redirectTo = router.query.redirect as string || '/dashboard_ai';
        router.push(redirectTo);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your connection and try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Teacher Login</h1>
        
        {/* Demo Credentials Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div><strong>Username:</strong> ankur8</div>
            <div><strong>Password:</strong> 123456</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setUsername('ankur8');
              setPassword('123456');
            }}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Click to auto-fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Need access? Contact admin@encanto.ai
        </div>
      </div>
    </div>
  );
} 