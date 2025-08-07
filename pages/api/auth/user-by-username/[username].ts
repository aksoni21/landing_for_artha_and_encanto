import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!BACKEND_URL) {
    return res.status(500).json({ error: 'Backend URL not configured' });
  }

  try {
    console.log(`🔍 Fetching user data for: ${username}`);
    
    // Forward request to Python backend
    const response = await fetch(`${BACKEND_URL}/api/auth/user-by-username/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(`✅ User data retrieved for: ${username}`);
      return res.status(200).json(userData);
    } else if (response.status === 404) {
      console.log(`❌ User not found: ${username}`);
      return res.status(404).json({ error: 'User not found' });
    } else {
      const errorText = await response.text();
      console.error(`❌ Backend error for user ${username}:`, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch user data',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      });
    }

  } catch (error) {
    console.error('Auth proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to process authentication request',
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined
    });
  }
}