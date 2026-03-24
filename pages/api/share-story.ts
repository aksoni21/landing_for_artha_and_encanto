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
    const emailSubject = `${senderName} shared a story with you on Encanto Speak AI!`;

    // HTML email body
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 You've Been Invited!</h1>
            </div>
            <div class="content">
              <p>Hi there!</p>
              <p><strong>${senderName}</strong> wants to share <strong>"${storyTitle}"</strong> with you on Encanto Speak AI!</p>
              <p>Encanto Speak AI helps you learn Spanish through interactive stories with AI-powered pronunciation feedback.</p>
              <p style="text-align: center;">
                <a href="https://apps.apple.com/app/encanto-speak-ai/id6738993931" class="button">📱 Download for iOS</a>
              </p>
              <p style="text-align: center; margin-top: 10px;">
                <a href="https://play.google.com/store/apps/details?id=co.encanto.ai" class="button">📱 Download for Android</a>
              </p>
              <p>Start practicing Spanish today!</p>
            </div>
            <div class="footer">
              <p>© 2024 Encanto Speak AI | <a href="https://www.encantospeak.com">www.encantospeak.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via ZeptoMail through backend
    const backendUrl = process.env.BACKEND_URL || 'https://brainssite-production.up.railway.app';
    const emailResponse = await fetch(`${backendUrl}/send_sharemail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_email: recipientEmail,
        subject: emailSubject,
        html_content: htmlBody,
        to_name: recipientEmail.split('@')[0]
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    console.log('✅ Share story email sent to:', recipientEmail);

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
