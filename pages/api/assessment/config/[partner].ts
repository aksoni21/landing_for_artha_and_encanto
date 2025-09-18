import { NextApiRequest, NextApiResponse } from 'next';

// Assessment partner configurations
const assessmentPartnerConfigs = {
  'casco-antiguo': {
    partner_id: 'casco_antiguo',
    name: 'Casco Antiguo Spanish School',
    language: 'spanish',
    branding: {
      logo_url: '/partners/casco-antiguo/placeholder.svg',
      primary_color: '#1a365d',
      secondary_color: '#2d5a87',
      accent_color: '#ed8936'
    },
    ui_text: {
      language: 'english',
      welcome_title: 'Spanish Language Assessment',
      welcome_subtitle: 'Casco Antiguo Spanish School',
      recording_instructions: 'Please speak in Spanish for 30-60 seconds about any topic you like. You can talk about your hobbies, family, plans, work, or anything that comes to mind.',
      recording_button: 'Start Recording',
      stop_button: 'Stop Recording',
      submit_button: 'Submit Assessment',
      success_message: 'Thank you! Your assessment has been submitted successfully. The school will receive the results via email.',
      error_message: 'Sorry, there was an error. Please try again.',
      duration_warning: 'You have {seconds} seconds remaining'
    },
    recording_duration: {
      min_seconds: 30,
      max_seconds: 60,
      warning_at: 50
    }
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { partner } = req.query;

  if (!partner || typeof partner !== 'string') {
    return res.status(400).json({ error: 'Partner parameter is required' });
  }

  const config = assessmentPartnerConfigs[partner as keyof typeof assessmentPartnerConfigs];

  if (!config) {
    return res.status(404).json({ error: `Assessment partner "${partner}" not found` });
  }

  res.status(200).json(config);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}