import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recordingId } = req.query;

  if (!recordingId || typeof recordingId !== 'string') {
    return res.status(400).json({ error: 'Recording ID is required' });
  }

  try {
    // Forward request to Python backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/audio/resubmit/${recordingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to resubmit recording',
        details: errorData
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error resubmitting recording:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}