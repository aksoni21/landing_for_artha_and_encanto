import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🎯 API Route Called: /api/audio/status/[sessionId]');
  console.log('📝 Request Method:', req.method);
  console.log('🔗 Backend URL:', BACKEND_URL);
  console.log('📋 Session ID:', req.query.sessionId);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    console.log('🚀 Forwarding to Python backend:', `${BACKEND_URL}/api/audio/status/${sessionId}`);

    const response = await fetch(`${BACKEND_URL}/api/audio/status/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward auth header if present
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      }
    });

    console.log('📡 Python backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Python backend error:', errorText);
      return res.status(response.status).json({ 
        error: 'Backend request failed',
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('✅ Python backend response successful');
    console.log('📋 Status data:', data);

    res.status(200).json(data);
  } catch (error) {
    console.error('💥 Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}