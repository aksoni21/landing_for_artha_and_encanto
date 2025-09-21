import { NextApiRequest, NextApiResponse } from 'next';
import { getBackendURL } from '../../../../utils/environment';

const BACKEND_URL = getBackendURL();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  console.log('🎯 Assessment Results API Route Called');
  console.log('📝 Request Method:', req.method);
  console.log('🔗 Backend URL:', BACKEND_URL);
  console.log('🎫 Token:', token);

  if (req.method !== 'GET') {
    console.log('❌ Wrong method, returning 405');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BACKEND_URL) {
    console.log('❌ Backend URL not configured');
    return res.status(500).json({ error: 'Backend URL not configured' });
  }

  if (!token || typeof token !== 'string') {
    console.log('❌ Invalid token');
    return res.status(400).json({ error: 'Invalid token' });
  }

  try {
    const backendEndpoint = `${BACKEND_URL}/api/partners/casco_antiguo/results/${token}`;
    console.log('🚀 Calling backend endpoint:', backendEndpoint);

    // Try to fetch results from backend using the same endpoint pattern
    const response = await fetch(backendEndpoint);

    console.log('📡 Backend response status:', response.status);
    console.log('📡 Backend response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      console.log('❌ Backend returned error status:', response.status);
      const errorText = await response.text();
      console.log('❌ Backend error details:', errorText);

      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid or expired access token.' });
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    console.log('✅ Backend response successful');
    const data = await response.json();
    console.log('📋 Backend response data:', JSON.stringify(data, null, 2));
    return res.status(200).json(data);

  } catch (error) {
    console.error('💥 Error fetching assessment results:', error);
    console.error('💥 Error type:', typeof error);
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({
      error: 'Unable to load assessment results. The link may be invalid or expired.'
    });
  }
}