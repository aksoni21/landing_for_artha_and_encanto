import type { NextApiRequest, NextApiResponse } from 'next';

let cachedVoices: Voice[] | null = null;

interface Voice {
  id: string;
  name: string;
  description?: string;
  language?: string;
}
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CARTESIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'CARTESIA_API_KEY not configured' });
  }

  if (cachedVoices && Date.now() - cacheTime < CACHE_TTL) {
    return res.json(cachedVoices);
  }

  try {
    const response = await fetch('https://api.cartesia.ai/voices', {
      headers: {
        'X-API-Key': apiKey,
        'Cartesia-Version': '2024-06-10',
      },
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Cartesia voices error:', response.status, errBody);
      return res.status(response.status).json({ error: errBody });
    }

    const data = await response.json();
    const voiceList = Array.isArray(data) ? data : data.voices || data.data || [];

    cachedVoices = voiceList;
    cacheTime = Date.now();
    res.json(voiceList);
  } catch (error) {
    console.error('Voices error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch voices' });
  }
}
