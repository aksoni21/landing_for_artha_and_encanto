import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BACKEND_URL) {
    return res.status(500).json({ error: 'Backend URL not configured' });
  }

  try {
    const { file_id, session_id } = req.body;
    
    if (!session_id && !file_id) {
      return res.status(400).json({ error: 'session_id or file_id is required' });
    }
    
    // Use session_id if provided, otherwise file_id
    const analysisId = session_id || file_id;
    console.log('🔍 Checking analysis results for session:', analysisId);
    
    // Check if analysis is complete by calling the status endpoint first
    const statusResponse = await fetch(`${BACKEND_URL}/api/audio/status/${analysisId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!statusResponse.ok) {
      console.error('❌ Status check failed:', statusResponse.status);
      return res.status(statusResponse.status).json({ 
        error: 'Failed to check analysis status' 
      });
    }
    
    const statusData = await statusResponse.json();
    console.log('📊 Status response:', statusData);
    
    if (statusData.status !== 'completed') {
      // Analysis not yet complete - return status info
      return res.status(202).json({
        status: statusData.status,
        progress: statusData.progress || 0,
        message: statusData.current_step || 'Processing...'
      });
    }
    
    // Analysis is complete - get the results
    console.log('✅ Analysis complete, fetching results...');
    const resultsResponse = await fetch(`${BACKEND_URL}/api/audio/analysis/${analysisId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!resultsResponse.ok) {
      const errorText = await resultsResponse.text();
      console.error('❌ Results fetch failed:', errorText);
      return res.status(resultsResponse.status).json({ 
        error: 'Failed to get analysis results', 
        details: process.env.NODE_ENV === 'development' ? errorText : undefined 
      });
    }

    const results = await resultsResponse.json();
    console.log('📋 Analysis results retrieved successfully');
    return res.status(200).json(results);

  } catch (error) {
    console.error('Analysis proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to process analysis request',
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined
    });
  }
}