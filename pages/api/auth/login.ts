import type { NextApiRequest, NextApiResponse } from 'next';
import { authService, LoginResponse } from '../../../services/authService';

export interface LoginRequest {
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { username, password }: LoginRequest = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Attempt login
    const result = await authService.login(username.trim(), password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Debug: Log the generated token
    // console.log('🔑 Generated JWT token:', result.token);

    // Return success response
    res.status(200).json(result);
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}