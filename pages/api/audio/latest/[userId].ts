import type { NextApiRequest, NextApiResponse } from 'next';
import { getBackendURL } from '../../../../utils/environment';

const BACKEND_URL = getBackendURL();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Forward the request to the Python backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/audio/latest/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      }
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return res.status(404).json({ 
          error: 'No analysis results found',
          message: 'Please complete an analysis first.'
        });
      }
      
      const errorData = await backendResponse.json().catch(() => ({ 
        error: 'Failed to fetch latest results' 
      }));
      
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching latest results:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch latest analysis results'
    });
  }
}