import type { NextApiRequest, NextApiResponse } from 'next';

const aiDemoAnswers: Record<string, { answer: string; followup?: string[] }> = {
  'Which students are at risk?': {
    answer: 'Maria Lopez, Carlos Ruiz, and Emily Chen are at risk due to low engagement and quiz scores.',
    followup: ['Show engagement history', 'Send encouragement']
  },
  'Assign review modules': {
    answer: 'Review modules assigned to all at-risk students.',
    followup: ['View assignments', 'Send reminder']
  },
  'How is Maria Lopez doing?': {
    answer: 'Maria Lopez has missed a few sessions and her quiz scores have dropped. She needs more practice with travel vocabulary and past tense.',
    followup: ['Assign travel vocabulary practice', 'Show quiz history']
  },
  'How is Carlos Ruiz doing?': {
    answer: 'Carlos Ruiz has missed several sessions and is struggling with advanced grammar. Recommend encouragement and review.',
    followup: ['Send encouragement', 'Assign grammar review']
  },
  'How is Emily Chen doing?': {
    answer: 'Emily Chen missed a few sessions and needs to catch up on assignments. She is strong in pronunciation but needs support with attendance and complex sentence structure.',
    followup: ['Assign attendance challenge', 'Show quiz history']
  },
  'How is Priya Singh doing?': {
    answer: 'Priya Singh is excelling in all areas, with perfect attendance and high quiz scores. Ready for advanced conversation practice.',
    followup: ['Assign advanced practice', 'Show quiz history']
  },
  'How is Liam O’Brien doing?': {
    answer: 'Liam O’Brien consistently scores above 90% and shows leadership in group activities. Encourage peer mentoring and continued participation.',
    followup: ['Encourage peer mentoring', 'Show quiz history']
  },
  'Show class trends for grammar': {
    answer: 'Class grammar scores have improved by 8% over the last month. Most common errors: past tense, articles.'
  },
  'Send encouragement': {
    answer: 'Encouragement message sent to all at-risk students.'
  },
  'Assign past tense practice': {
    answer: 'Past tense practice assigned to Maria Lopez.'
  },
  'Show engagement history': {
    answer: 'Maria Lopez: 2 missed sessions, Carlos Ruiz: 3 missed sessions, Emily Chen: 2 missed sessions in last 2 weeks.'
  },
  'Show quiz history': {
    answer: 'Recent quiz scores are available for each student. Maria: 65%, Carlos: 60%, Emily: 68%, Priya: 98%, Liam: 94%.'
  },
  'View assignments': {
    answer: 'You have 3 pending assignments for at-risk students.'
  },
  'Send reminder': {
    answer: 'Reminders sent to all students with pending assignments.'
  },
};

// Add a map of normalized keys for flexible matching
const normalizedKeys: Record<string, string> = {
  'assign review': 'Assign review modules',
  'assign review modules': 'Assign review modules',
  'send encouragement': 'Send encouragement',
  'how is maria lopez doing?': 'How is Maria Lopez doing?',
  'which students are at risk?': 'Which students are at risk?',
  'show class trends for grammar': 'Show class trends for grammar',
  'assign past tense practice': 'Assign past tense practice',
  'show engagement history': 'Show engagement history',
  'show quiz history': 'Show quiz history',
  'view assignments': 'View assignments',
  'send reminder': 'Send reminder',
  'view details': 'View assignments', // for demo
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }
  // Simulate error for demo
  if (question.toLowerCase().includes('error')) {
    return res.status(500).json({ error: 'AI model failed to respond. Please try again.' });
  }
  // Normalize question for flexible matching
  const norm = question.trim().toLowerCase();
  const mapped = normalizedKeys[norm];
  const ai = aiDemoAnswers[mapped || question] || { answer: 'Sorry, I do not have an answer for that (demo).' };
  setTimeout(() => {
    res.status(200).json(ai);
  }, 800);
} 