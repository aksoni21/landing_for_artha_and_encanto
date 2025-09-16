import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // For now, return mock data since we need to implement the actual database query
    const mockErrorData = {
      grammar_analysis: {
        grammar_errors: [
          "Subject-verb disagreement: 'I was' should be 'I were'",
          "Incorrect tense: 'I have went' should be 'I have gone'",
          "Missing article: 'I go to school' should be 'I go to the school'"
        ]
      },
      pronunciation_analysis: {
        problematic_sounds: [
          { phoneme: '/θ/', example: 'think', difficulty: 'high' },
          { phoneme: '/v/', example: 'very', difficulty: 'medium' }
        ],
        l1_interference_patterns: [
          { pattern: 'Spanish /b/ → English /v/', examples: ['very', 'voice'] }
        ]
      },
      fluency_analysis: {
        repetitions_count: 3,
        self_corrections_count: 2,
        false_starts_count: 1,
        filler_words: {
          'um': 5,
          'uh': 3,
          'like': 7
        }
      }
    };

    res.status(200).json(mockErrorData);
  } catch (error) {
    console.error('Error fetching error analysis:', error);
    res.status(500).json({ error: 'Failed to fetch error analysis' });
  }
}