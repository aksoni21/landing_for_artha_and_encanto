import { NextApiRequest, NextApiResponse } from 'next';
import { getBackendURL } from '../../../utils/environment';

const BACKEND_URL = getBackendURL();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🎯 API Route Called: /api/teacher/students');
  console.log('📝 Request Method:', req.method);
  console.log('🔗 Backend URL:', BACKEND_URL);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BACKEND_URL) {
    return res.status(500).json({ error: 'Backend URL not configured' });
  }

  try {
    const { teacher_id } = req.query;

    if (!teacher_id) {
      return res.status(400).json({ error: 'teacher_id is required' });
    }

    console.log('🚀 Forwarding to Python backend:', `${BACKEND_URL}/api/teacher/students`);

    // Forward to Python backend
    const response = await fetch(
      `${BACKEND_URL}/api/teacher/students?teacher_id=${teacher_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && {
            'Authorization': req.headers.authorization
          })
        }
      }
    );

    console.log('📡 Python backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error details:', errorText);
      return res.status(response.status).json({
        error: 'Failed to fetch students data',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      });
    }

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    console.error('💥 ERROR in API route:', error);

    return res.status(500).json({
      error: 'Failed to fetch students data',
      details: process.env.NODE_ENV === 'development'
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined
    });
  }
}
