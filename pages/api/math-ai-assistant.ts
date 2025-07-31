import type { NextApiRequest, NextApiResponse } from 'next';

const aiDemoAnswers: Record<string, { answer: string; followup?: string[] }> = {
  'Which students are at risk in math?': {
    answer: 'Aarav Patel and Sara Khan are at risk due to low quiz scores and missed assignments in math.',
    followup: ['Show math engagement history', 'Send encouragement']
  },
  'Assign math review': {
    answer: 'Math review modules assigned to all at-risk students.',
    followup: ['View math assignments', 'Send reminder']
  },
  'How is Aarav Patel doing?': {
    answer: 'Aarav struggles with linear equations and word problems. Needs more practice and support.',
    followup: ['Assign linear equations review', 'Show quiz history']
  },
  'How is Sara Khan doing?': {
    answer: 'Sara missed 2 quizzes and needs help with geometry basics and shapes.',
    followup: ['Assign geometry basics review', 'Show quiz history']
  },
  'How is Rohan Mehta doing?': {
    answer: 'Rohan is excelling in algebra and consistently scores above 85%.',
    followup: ['Assign advanced algebra practice', 'Show quiz history']
  },
  'How is Emily Wang doing?': {
    answer: 'Emily shows strong understanding of geometry and helps classmates.',
    followup: ['Encourage peer mentoring', 'Show quiz history']
  },
  'Show class trends for algebra': {
    answer: 'Class algebra scores have improved by 6% over the last month. Most common errors: solving for x, word problems.'
  },
  'Send encouragement': {
    answer: 'Encouragement message sent to all at-risk math students.'
  },
  'Assign linear equations review': {
    answer: 'Linear equations review assigned to Aarav Patel.'
  },
  'Assign geometry basics review': {
    answer: 'Geometry basics review assigned to Sara Khan.'
  },
  'Show math engagement history': {
    answer: 'Aarav: 1 missed assignment, Sara: 2 missed quizzes in last 2 weeks.'
  },
  'Show quiz history': {
    answer: 'Recent math quiz scores: Aarav: 60%, Sara: 58%, Rohan: 90%, Emily: 95%.'
  },
  'View math assignments': {
    answer: 'You have 2 pending math assignments for at-risk students.'
  },
  'Send reminder': {
    answer: 'Reminders sent to all students with pending math assignments.'
  },
};

const normalizedKeys: Record<string, string> = {
  'assign math review': 'Assign math review',
  'send encouragement': 'Send encouragement',
  'how is aarav patel doing?': 'How is Aarav Patel doing?',
  'how is sara khan doing?': 'How is Sara Khan doing?',
  'how is rohan mehta doing?': 'How is Rohan Mehta doing?',
  'how is emily wang doing?': 'How is Emily Wang doing?',
  'which students are at risk in math?': 'Which students are at risk in math?',
  'show class trends for algebra': 'Show class trends for algebra',
  'assign linear equations review': 'Assign linear equations review',
  'assign geometry basics review': 'Assign geometry basics review',
  'show math engagement history': 'Show math engagement history',
  'show quiz history': 'Show quiz history',
  'view math assignments': 'View math assignments',
  'send reminder': 'Send reminder',
  'view details': 'View math assignments',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }
  if (question.toLowerCase().includes('error')) {
    return res.status(500).json({ error: 'AI model failed to respond. Please try again.' });
  }
  const norm = question.trim().toLowerCase();
  const mapped = normalizedKeys[norm];
  const ai = aiDemoAnswers[mapped || question] || { answer: 'Sorry, I do not have an answer for that (math demo).' };
  setTimeout(() => {
    res.status(200).json(ai);
  }, 800);
} 