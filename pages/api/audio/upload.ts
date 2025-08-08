import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '50mb',
  },
};

const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🎯 API Route Called: /api/audio/upload');
  console.log('📝 Request Method:', req.method);
  console.log('🔗 Backend URL:', BACKEND_URL);
  console.log('📋 Request Headers:', Object.keys(req.headers));
  console.log('📋 Content-Type:', req.headers['content-type']);
  
  if (req.method !== 'POST') {
    console.log('❌ Wrong method, returning 405');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BACKEND_URL) {
    console.log('❌ Backend URL not configured');
    return res.status(500).json({ error: 'Backend URL not configured' });
  }

  console.log('✅ Initial checks passed, proceeding with file parsing...');

  try {
    console.log('📄 Setting up formidable parser...');
    
    // Parse the incoming form data
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      multiples: false,
    });
    console.log('🔄 Starting form parsing...');
    
    const [fields, files] = await new Promise<[Record<string, unknown>, Record<string, FormidableFile | FormidableFile[] | undefined>]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log('❌ Form parsing error:', err);
          reject(err);
        } else {
          console.log('✅ Form parsed successfully');
          console.log('📋 Fields:', Object.keys(fields));
          console.log('📁 Files:', Object.keys(files));
          resolve([fields, files]);
        }
      });
    });

    // Get the uploaded file - try both field names
    let audioFile = files.audio_file as FormidableFile | FormidableFile[];
    if (!audioFile) {
      audioFile = files.file as FormidableFile | FormidableFile[];
    }
    const file = Array.isArray(audioFile) ? audioFile[0] : audioFile;
    
    console.log('🎵 Audio file check:', file ? 'Found' : 'Missing');
    if (file) {
      console.log('📊 File details:', {
        name: file.originalFilename,
        size: file.size,
        type: file.mimetype,
        path: file.filepath
      });
    }
    
    if (!file) {
      console.log('❌ No audio file provided');
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('📦 Creating multipart form data for Python backend...');
    
    // Read file content as buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    console.log('📄 File buffer size:', fileBuffer.length);
    
    // Generate boundary for multipart form data
    const boundary = `----formdata-node-${Math.random().toString(16).slice(2)}`;
    
    // Create multipart form data manually
    const formDataParts = [];
    
    // Add file part
    formDataParts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${file.originalFilename || 'audio.webm'}"\r\n` +
      `Content-Type: ${file.mimetype || 'audio/webm'}\r\n\r\n`
    );
    formDataParts.push(fileBuffer);
    formDataParts.push('\r\n');
    
    // Add user_id field - extract from JWT token or use demo user
    // Try to get user from Authorization header
    const authHeader = req.headers.authorization;
    let userId = '3c64d808-ff9c-4808-a1a2-84ee7c38183c'; // fallback test user
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // For now, decode JWT manually to extract user ID
      try {
        const jwt = await import('jsonwebtoken');
        const payload = jwt.decode(token) as { sub?: string } | null;
        if (payload?.sub) {
          userId = payload.sub; // Use the user ID from JWT token
        }
      } catch {
        console.log('Failed to decode JWT token, using fallback user ID');
      }
    }
    formDataParts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="user_id"\r\n\r\n` +
      userId + '\r\n'
    );
    
    // Add language field if provided
    if (fields.language) {
      console.log('🌐 Language specified:', fields.language);
      formDataParts.push(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="language"\r\n\r\n` +
        fields.language + '\r\n'
      );
    }
    
    // Close form data
    formDataParts.push(`--${boundary}--\r\n`);
    
    // Combine all parts
    const formDataBuffer = Buffer.concat([
      Buffer.from(formDataParts[0]),
      formDataParts[1] as Buffer,
      Buffer.from(formDataParts[2]),
      Buffer.from(formDataParts[3]),
      ...(fields.language ? [Buffer.from(formDataParts[4])] : []),
      Buffer.from(formDataParts[fields.language ? 5 : 4])
    ]);
    
    console.log('🚀 Forwarding to Python backend:', `${BACKEND_URL}/api/audio/upload`);
    console.log('📏 Form data size:', formDataBuffer.length);
    
    // Forward to Python backend
    const response = await fetch(`${BACKEND_URL}/api/audio/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': formDataBuffer.length.toString(),
      },
      body: formDataBuffer,
    });

    console.log('📡 Python backend response status:', response.status);
    console.log('📋 Python backend response headers:', Object.fromEntries(response.headers));

    // Clean up the temporary file
    console.log('🧹 Cleaning up temporary file...');
    fs.unlinkSync(file.filepath);

    if (!response.ok) {
      console.log('❌ Python backend returned error status:', response.status);
      const errorText = await response.text();
      console.log('❌ Error details:', errorText);
      return res.status(response.status).json({ 
        error: 'Upload failed', 
        details: process.env.NODE_ENV === 'development' ? errorText : undefined 
      });
    }

    console.log('✅ Python backend response successful');
    const result = await response.json();
    console.log('📋 Final result:', result);
    return res.status(200).json(result);

  } catch (error) {
    console.error('💥 CRITICAL ERROR in API route:', error);
    console.error('💥 Error type:', typeof error);
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return res.status(500).json({ 
      error: 'Failed to process upload',
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined
    });
  }
}