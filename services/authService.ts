import jwt from 'jsonwebtoken';

export interface DemoUser {
  id: string; // UUID from database
  username: string;
  email: string;
  name: string;
  password: string;
}

// Demo users with their actual database UUIDs
// Note: In production, these would come from the database
const DEMO_USERS: DemoUser[] = [
  {
    id: 'ankur8-uuid-placeholder', // This will be replaced with actual UUID from DB query
    username: 'ankur8',
    email: 'ankur8@encanto.ai',
    name: 'Ankur Soni',
    password: '123456'
  }
];

export interface JWTPayload {
  sub: string; // User UUID (database ID)
  aud: string; // Audience - should be "authenticated" for Supabase compatibility
  exp: number; // Expiration timestamp
  email: string;
  role: string;
  iat?: number; // Issued at
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    name: string;
  };
  token?: string;
  error?: string;
}

class AuthService {
  private readonly JWT_SECRET = 'demo-secret-key'; // For demo purposes
  private readonly TOKEN_EXPIRY_HOURS = 24;

  /**
   * Generate a Supabase-compatible JWT token
   */
  generateJWT(user: DemoUser): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      sub: user.id, // User UUID from database
      aud: 'authenticated', // Required by Supabase
      exp: now + (this.TOKEN_EXPIRY_HOURS * 60 * 60), // 24 hours
      email: user.email,
      role: 'authenticated',
      iat: now
    };

    // Create unsigned token since Python backend uses verify_signature: False
    return jwt.sign(payload, '', { algorithm: 'none' });
  }

  /**
   * Validate demo user credentials
   */
  validateCredentials(username: string, password: string): DemoUser | null {
    const user = DEMO_USERS.find(u => 
      u.username === username && u.password === password
    );
    return user || null;
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      // Decode unsigned token (algorithm: 'none')
      const payload = jwt.decode(token) as JWTPayload;
      
      if (!payload) {
        return null;
      }
      
      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      
      return payload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      // For demo purposes, we'll simulate database lookup
      // In production, this would query the actual database
      const user = this.validateCredentials(username, password);
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid username or password'
        };
      }

      // In production, we would query the database to get the actual UUID
      // For now, we'll simulate getting the UUID from the database
      const userWithRealId = await this.getUserFromDatabase(username);
      
      if (!userWithRealId) {
        return {
          success: false,
          error: 'User not found in database'
        };
      }

      // Generate JWT token with the real database UUID
      const token = this.generateJWT(userWithRealId);

      return {
        success: true,
        user: {
          id: userWithRealId.id,
          username: userWithRealId.username,
          email: userWithRealId.email,
          name: userWithRealId.name
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Get user info from the actual database
   * This queries the real database to get the correct UUID
   */
  private async getUserFromDatabase(username: string): Promise<DemoUser | null> {
    try {
      // Query the Python backend to get the real user UUID
      const backendUrl = process.env.BACKEND_URL;
      console.log('🔗 Attempting to fetch from:', `${backendUrl}/api/auth/user-by-username/${username}`);
      const response = await fetch(`${backendUrl}/api/auth/user-by-username/${username}`);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('📊 Database user data:', userData);
        
        // Check if we got a valid user ID
        if (!userData.id) {
          console.error('❌ Database returned user but no ID field:', userData);
          throw new Error('User ID missing from database response');
        }
        
        return {
          id: userData.id, // Real UUID from database
          username: userData.username || username,
          email: userData.email || `${username}@encanto.ai`,
          name: userData.first_name && userData.last_name 
            ? `${userData.first_name} ${userData.last_name}`
            : 'User',
          password: '123456' // We don't need the real password for token generation
        };
      } else {
        console.error('❌ Failed to get user from database:', response.status);
      }
    } catch (error) {
      console.error('❌ Database query error:', error);
    }
    
    // Fallback for demo purposes - use username as ID  
    if (username === 'ankur8') {
      console.log('⚠️ Using username as user ID for demo');
      return {
        id: 'ankur8', // Use username as ID since DB query failed
        username: 'ankur8',
        email: 'ankur8@encanto.ai',
        name: 'Ankur Soni',
        password: '123456'
      };
    }
    
    return null;
  }

  /**
   * Get current user from stored token
   */
  getCurrentUser(): { id: string; username: string; email: string; name: string } | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('supabase.auth.token');
    if (!token) return null;
    
    const payload = this.verifyToken(token);
    if (!payload) return null;
    
    // Try to get user info from stored auth data
    const authData = localStorage.getItem('teacher-auth');
    if (authData) {
      try {
        const user = JSON.parse(authData);
        return {
          id: payload.sub,
          username: user.username || user.email,
          email: payload.email,
          name: user.name
        };
      } catch (e) {
        console.error('Error parsing auth data:', e);
      }
    }
    
    return {
      id: payload.sub,
      username: payload.email.split('@')[0],
      email: payload.email,
      name: 'User'
    };
  }

  /**
   * Logout and clear tokens
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('teacher-auth');
    localStorage.removeItem('supabase.auth.token');
  }
}

export const authService = new AuthService();