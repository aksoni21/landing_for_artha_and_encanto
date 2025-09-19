import { NextApiRequest, NextApiResponse } from 'next';

// interface TodayUpload {
//   id: string;
//   file_url: string;
//   duration_seconds: number;
//   processing_status: string;
//   partner_name?: string;
//   student_name?: string;
//   created_at: string;
//   error_message?: string;
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward request to Python backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/audio/today-uploads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to fetch today uploads',
        details: errorData
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching today uploads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}