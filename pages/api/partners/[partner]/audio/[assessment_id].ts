import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { partner, assessment_id } = req.query;
  const { token } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!partner || !assessment_id) {
    return res.status(400).json({ message: 'Missing partner or assessment_id' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    // Construct the backend audio URL with token
    const audioUrl = `${backendUrl}/api/partners/${partner}/audio/${assessment_id}${token ? `?token=${token}` : ''}`;

    console.log('🎵 Audio API Route Called');
    console.log('📝 Request Method:', req.method);
    console.log('🔗 Backend URL:', backendUrl);
    console.log('🎯 Partner:', partner);
    console.log('📁 Assessment ID:', assessment_id);
    console.log('🎫 Token:', token);
    console.log('🚀 Fetching audio from:', audioUrl);

    // Fetch audio from backend
    const response = await fetch(audioUrl);

    if (!response.ok) {
      console.log('❌ Backend audio response failed:', response.status);
      return res.status(response.status).json({
        message: 'Failed to fetch audio from backend',
        status: response.status
      });
    }

    console.log('✅ Backend audio response successful');

    // Get the audio data as buffer
    const audioBuffer = await response.arrayBuffer();

    // Set appropriate headers for audio
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength.toString());

    // Optional: Set cache headers
    res.setHeader('Cache-Control', 'private, max-age=3600');

    // Send the audio data
    res.status(200);
    res.end(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('❌ Error fetching audio:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    });
  }
}