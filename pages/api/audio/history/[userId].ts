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
  const { limit } = req.query;
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (limit) {
      queryParams.append('limit', limit as string);
    }
    
    const url = `${BACKEND_URL}/api/audio/history/${userId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    // Forward the request to the Python backend
    const backendResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      }
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        // Return empty array for no history instead of error
        return res.status(200).json([]);
      }
      
      const errorData = await backendResponse.json().catch(() => ({ 
        error: 'Failed to fetch history' 
      }));
      
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    // Return empty array on error to not break the UI
    return res.status(200).json([]);
  }
}