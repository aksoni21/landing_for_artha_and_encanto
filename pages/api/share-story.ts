import type { NextApiRequest, NextApiResponse } from 'next';

type ShareStoryRequest = {
  recipientEmail: string;
  senderName: string;
  storyTitle: string;
  storyId: string;
};

type ShareStoryResponse = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShareStoryResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { recipientEmail, senderName, storyTitle, storyId }: ShareStoryRequest = req.body;

  // Validate input
  if (!recipientEmail || !storyTitle || !storyId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  try {
    // TODO: Replace with your actual email sending logic
    // For now, we'll use a simple approach - you can integrate with SendGrid, AWS SES, etc.

    // Example email content
    const emailSubject = `${senderName} shared a story with you on Encanto Speak AI!`;
    const emailBody = `
      Hi there!

      ${senderName} wants to share "${storyTitle}" with you on Encanto Speak AI!

      Encanto Speak AI helps you learn Spanish through interactive stories with AI-powered pronunciation feedback.

      📱 Download the app to read this story:

      iOS: https://apps.apple.com/app/encanto-speak-ai/id YOUR_APP_ID
      Android: https://play.google.com/store/apps/details?id=com.encanto.speak

      Start practicing Spanish today!

      ---
      Encanto Speak AI
      https://www.encantospeak.com
    `;

    // Log the email for now (replace with actual email service)
    console.log('=== Share Story Email ===');
    console.log('To:', recipientEmail);
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    console.log('========================');

    // TODO: Send email using your preferred service
    // Example with a generic email service:
    /*
    await sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      text: emailBody,
    });
    */

    return res.status(200).json({
      success: true,
      message: 'Story shared successfully!',
    });
  } catch (error) {
    console.error('Share story error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to share story. Please try again later.',
    });
  }
}
