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
    const { email } = req.body;

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Get client IP and user agent
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Insert email into database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO early_access_signups (email, ip_address, user_agent, source)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [email, ipAddress, userAgent, 'encanto_ai_landing']
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ 
          message: 'Email already registered',
          alreadyRegistered: true 
        });
      }

      return res.status(200).json({ 
        message: 'Successfully registered for early access',
        id: result.rows[0].id
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error saving early access signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 