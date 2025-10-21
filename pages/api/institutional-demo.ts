import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Database connection using Supabase environment variables
const pool = new Pool({
  host: process.env.SUPABASE_DB_HOST,
  port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  database: process.env.SUPABASE_DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, institutionName, source } = req.body;

    // Validate required fields
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (!institutionName || institutionName.trim().length === 0) {
      return res.status(400).json({ message: 'Institution name is required' });
    }

    // Get client IP and user agent
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Insert demo request into database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO early_access_signups (email, institution_name, ip_address, user_agent, source, signup_type)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email, signup_type) DO UPDATE
         SET institution_name = EXCLUDED.institution_name
         RETURNING id`,
        [email, institutionName.trim(), ipAddress, userAgent, source || 'teacher_landing', 'institutional']
      );

      return res.status(200).json({
        message: 'Demo request submitted successfully',
        id: result.rows[0].id
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error saving institutional demo request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
