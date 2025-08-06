-- =====================================================
-- AUDIO PROCESSING JOBS TABLE
-- =====================================================
-- Add job queue table for background audio processing
-- Run this after the main audio analysis migration

-- Create the audio processing jobs table
CREATE TABLE IF NOT EXISTS audio_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID REFERENCES audio_recordings(id) ON DELETE CASCADE,
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Job metadata
    job_type VARCHAR(50) NOT NULL DEFAULT 'full_analysis',
    priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    
    -- Processing status
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    progress FLOAT DEFAULT 0.0 CHECK (progress >= 0.0 AND progress <= 1.0),
    current_step VARCHAR(100),
    
    -- Timing information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Processing details
    worker_id VARCHAR(100),
    processing_metadata JSONB DEFAULT '{}',
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audio_processing_jobs_status ON audio_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_audio_processing_jobs_priority ON audio_processing_jobs(priority DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_audio_processing_jobs_user_id ON audio_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_processing_jobs_created_at ON audio_processing_jobs(created_at);

-- Index for job queue queries (get next pending job by priority)
CREATE INDEX IF NOT EXISTS idx_audio_processing_jobs_queue 
    ON audio_processing_jobs(status, priority DESC, created_at)
    WHERE status = 'pending';

-- Index for monitoring active jobs
CREATE INDEX IF NOT EXISTS idx_audio_processing_jobs_active
    ON audio_processing_jobs(status, started_at)
    WHERE status IN ('processing', 'pending');

-- Enable RLS
ALTER TABLE audio_processing_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own jobs
CREATE POLICY "Users can view their own processing jobs" ON audio_processing_jobs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own jobs
CREATE POLICY "Users can create their own processing jobs" ON audio_processing_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only system/workers can update job status (this would be updated by service role)
-- We'll allow users to cancel their own jobs
CREATE POLICY "Users can cancel their own jobs" ON audio_processing_jobs
    FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'processing'))
    WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

-- Grant permissions
GRANT SELECT, INSERT ON audio_processing_jobs TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get next pending job (for workers)
CREATE OR REPLACE FUNCTION get_next_audio_processing_job()
RETURNS SETOF audio_processing_jobs AS $$
BEGIN
    RETURN QUERY
    UPDATE audio_processing_jobs 
    SET 
        status = 'processing',
        started_at = NOW(),
        worker_id = 'worker_' || floor(random() * 1000)::text
    WHERE id = (
        SELECT id 
        FROM audio_processing_jobs 
        WHERE status = 'pending' 
            AND (retry_count < max_retries)
        ORDER BY priority DESC, created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Function to mark job as failed and potentially retry
CREATE OR REPLACE FUNCTION fail_audio_processing_job(
    job_id UUID,
    error_msg TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    job_record audio_processing_jobs;
BEGIN
    -- Get current job info
    SELECT * INTO job_record 
    FROM audio_processing_jobs 
    WHERE id = job_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Increment retry count
    UPDATE audio_processing_jobs
    SET 
        retry_count = retry_count + 1,
        error_message = COALESCE(error_msg, error_message),
        status = CASE 
            WHEN retry_count + 1 < max_retries THEN 'pending'
            ELSE 'failed'
        END,
        started_at = CASE 
            WHEN retry_count + 1 < max_retries THEN NULL
            ELSE started_at
        END,
        completed_at = CASE 
            WHEN retry_count + 1 >= max_retries THEN NOW()
            ELSE NULL
        END
    WHERE id = job_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to complete a job
CREATE OR REPLACE FUNCTION complete_audio_processing_job(job_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE audio_processing_jobs
    SET 
        status = 'completed',
        progress = 1.0,
        completed_at = NOW(),
        current_step = 'Completed'
    WHERE id = job_id AND status = 'processing';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to update job progress
CREATE OR REPLACE FUNCTION update_job_progress(
    job_id UUID,
    new_progress FLOAT,
    step_name TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE audio_processing_jobs
    SET 
        progress = new_progress,
        current_step = COALESCE(step_name, current_step),
        processing_metadata = jsonb_set(
            COALESCE(processing_metadata, '{}'),
            '{last_updated}',
            to_jsonb(NOW())
        )
    WHERE id = job_id AND status = 'processing';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE QUERIES FOR MONITORING
-- =====================================================

-- View to get job statistics
CREATE OR REPLACE VIEW audio_job_stats AS
SELECT 
    status,
    COUNT(*) as job_count,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_processing_time_seconds,
    AVG(retry_count) as avg_retries
FROM audio_processing_jobs
GROUP BY status;

-- View to get jobs with timing info
CREATE OR REPLACE VIEW audio_jobs_with_timing AS
SELECT 
    id,
    recording_id,
    session_id,
    user_id,
    job_type,
    status,
    priority,
    progress,
    current_step,
    created_at,
    started_at,
    completed_at,
    CASE 
        WHEN started_at IS NOT NULL AND completed_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (completed_at - started_at))
        ELSE NULL
    END as processing_duration_seconds,
    CASE 
        WHEN started_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (NOW() - started_at))
        ELSE NULL
    END as running_duration_seconds,
    retry_count,
    error_message
FROM audio_processing_jobs;

-- =====================================================
-- CLEANUP FUNCTION (Optional)
-- =====================================================

-- Function to clean up old completed jobs
CREATE OR REPLACE FUNCTION cleanup_old_audio_jobs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete completed jobs older than 30 days
    DELETE FROM audio_processing_jobs 
    WHERE status IN ('completed', 'failed') 
        AND completed_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify table creation
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'audio_processing_jobs';

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'audio_processing_jobs';

-- =====================================================
-- AUDIO PROCESSING JOBS TABLE COMPLETE
-- =====================================================