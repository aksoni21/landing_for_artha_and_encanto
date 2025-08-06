-- =====================================================
-- AUDIO ANALYSIS FEATURE MIGRATION
-- =====================================================
-- Run this migration in your Supabase SQL Editor to add
-- audio analysis functionality to existing databases
-- =====================================================

-- =====================================================
-- AUDIO ANALYSIS TABLES
-- =====================================================

-- Audio recordings metadata
CREATE TABLE IF NOT EXISTS audio_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES auth.users(id),
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    duration_seconds FLOAT NOT NULL,
    format VARCHAR(20) NOT NULL,
    sample_rate INTEGER,
    upload_source VARCHAR(50) NOT NULL DEFAULT 'web',
    processing_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio analysis sessions
CREATE TABLE IF NOT EXISTS audio_analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID REFERENCES audio_recordings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_cefr_level VARCHAR(10),
    overall_score FLOAT CHECK (overall_score >= 0 AND overall_score <= 100),
    analysis_type VARCHAR(50) NOT NULL DEFAULT 'comprehensive',
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    analysis_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speech transcriptions with timestamps
CREATE TABLE IF NOT EXISTS speech_transcriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    full_text TEXT NOT NULL,
    word_timestamps JSONB NOT NULL DEFAULT '[]',
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    language_code VARCHAR(10) NOT NULL DEFAULT 'en',
    transcription_service VARCHAR(50) NOT NULL,
    alternative_transcriptions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grammar analysis results
CREATE TABLE IF NOT EXISTS grammar_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    tense_usage JSONB NOT NULL DEFAULT '{}',
    sentence_types JSONB NOT NULL DEFAULT '{}',
    complexity_score FLOAT CHECK (complexity_score >= 0 AND complexity_score <= 10),
    avg_sentence_length FLOAT,
    subordination_index FLOAT,
    passive_voice_percentage FLOAT,
    modal_verb_usage JSONB DEFAULT '{}',
    conditional_structures JSONB DEFAULT '{}',
    grammar_errors JSONB DEFAULT '[]',
    cefr_grammar_level VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vocabulary analysis results
CREATE TABLE IF NOT EXISTS vocabulary_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    total_words INTEGER NOT NULL,
    unique_words INTEGER NOT NULL,
    type_token_ratio FLOAT,
    lexical_diversity FLOAT,
    word_frequency_distribution JSONB NOT NULL DEFAULT '{}',
    academic_words_count INTEGER DEFAULT 0,
    academic_words_list JSONB DEFAULT '[]',
    rare_words_count INTEGER DEFAULT 0,
    rare_words_list JSONB DEFAULT '[]',
    collocations JSONB DEFAULT '[]',
    phrasal_verbs JSONB DEFAULT '[]',
    idioms JSONB DEFAULT '[]',
    cefr_vocabulary_level VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fluency analysis results
CREATE TABLE IF NOT EXISTS fluency_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    words_per_minute FLOAT NOT NULL,
    speech_rate_consistency FLOAT,
    total_pauses INTEGER,
    pause_frequency_per_minute FLOAT,
    avg_pause_duration_ms FLOAT,
    long_pauses_count INTEGER,
    filled_pauses_count INTEGER,
    filler_words JSONB DEFAULT '{}',
    repetitions_count INTEGER,
    self_corrections_count INTEGER,
    false_starts_count INTEGER,
    fluency_score FLOAT CHECK (fluency_score >= 0 AND fluency_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pronunciation analysis results
CREATE TABLE IF NOT EXISTS pronunciation_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    overall_accuracy_score FLOAT CHECK (overall_accuracy_score >= 0 AND overall_accuracy_score <= 100),
    phoneme_accuracy JSONB DEFAULT '{}',
    stress_pattern_accuracy FLOAT,
    intonation_score FLOAT,
    rhythm_score FLOAT,
    connected_speech_score FLOAT,
    l1_interference_patterns JSONB DEFAULT '[]',
    problematic_sounds JSONB DEFAULT '[]',
    prosody_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discourse analysis results
CREATE TABLE IF NOT EXISTS discourse_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    coherence_score FLOAT CHECK (coherence_score >= 0 AND coherence_score <= 100),
    cohesion_score FLOAT CHECK (cohesion_score >= 0 AND cohesion_score <= 100),
    discourse_markers_used JSONB DEFAULT '[]',
    topic_transitions_count INTEGER,
    topic_maintenance_score FLOAT,
    register_appropriateness VARCHAR(50),
    pragmatic_competence_score FLOAT,
    turn_taking_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Overall analysis summary
CREATE TABLE IF NOT EXISTS audio_analysis_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recording_id UUID REFERENCES audio_recordings(id) ON DELETE CASCADE,
    overall_cefr_level VARCHAR(10) NOT NULL,
    grammar_cefr_level VARCHAR(10),
    vocabulary_cefr_level VARCHAR(10),
    fluency_score FLOAT,
    pronunciation_score FLOAT,
    discourse_score FLOAT,
    strengths JSONB DEFAULT '[]',
    areas_for_improvement JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    detailed_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student progress history
CREATE TABLE IF NOT EXISTS student_progress_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES audio_analysis_sessions(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    cefr_level VARCHAR(10) NOT NULL,
    grammar_score FLOAT,
    vocabulary_score FLOAT,
    fluency_score FLOAT,
    pronunciation_score FLOAT,
    discourse_score FLOAT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REFERENCE DATA TABLES
-- =====================================================

-- Word frequency database (SUBTLEXus)
CREATE TABLE IF NOT EXISTS word_frequency_database (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(100) NOT NULL UNIQUE,
    frequency BIGINT NOT NULL,
    frequency_per_million FLOAT NOT NULL,
    log_frequency FLOAT,
    pos_tags JSONB DEFAULT '[]',
    word_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic Word List (AWL)
CREATE TABLE IF NOT EXISTS academic_word_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(100) NOT NULL,
    headword VARCHAR(100) NOT NULL,
    sublist INTEGER NOT NULL CHECK (sublist >= 1 AND sublist <= 10),
    word_family JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(word)
);

-- CEFR word levels
CREATE TABLE IF NOT EXISTS cefr_word_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(100) NOT NULL,
    cefr_level VARCHAR(10) NOT NULL,
    pos_tag VARCHAR(20),
    word_family JSONB DEFAULT '[]',
    example_sentences JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(word, cefr_level)
);

-- Discourse markers reference
CREATE TABLE IF NOT EXISTS discourse_markers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marker VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    function VARCHAR(100) NOT NULL,
    register VARCHAR(50),
    cefr_level VARCHAR(10),
    examples JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Audio analysis indexes
CREATE INDEX IF NOT EXISTS idx_audio_recordings_user_id ON audio_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_recordings_teacher_id ON audio_recordings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_audio_recordings_processing_status ON audio_recordings(processing_status);
CREATE INDEX IF NOT EXISTS idx_audio_recordings_created_at ON audio_recordings(created_at);

CREATE INDEX IF NOT EXISTS idx_audio_analysis_sessions_recording_id ON audio_analysis_sessions(recording_id);
CREATE INDEX IF NOT EXISTS idx_audio_analysis_sessions_user_id ON audio_analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_analysis_sessions_status ON audio_analysis_sessions(status);
CREATE INDEX IF NOT EXISTS idx_audio_analysis_sessions_cefr_level ON audio_analysis_sessions(overall_cefr_level);

CREATE INDEX IF NOT EXISTS idx_speech_transcriptions_session_id ON speech_transcriptions(session_id);
CREATE INDEX IF NOT EXISTS idx_grammar_analysis_session_id ON grammar_analysis(session_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_analysis_session_id ON vocabulary_analysis(session_id);
CREATE INDEX IF NOT EXISTS idx_fluency_analysis_session_id ON fluency_analysis(session_id);
CREATE INDEX IF NOT EXISTS idx_pronunciation_analysis_session_id ON pronunciation_analysis(session_id);
CREATE INDEX IF NOT EXISTS idx_discourse_analysis_session_id ON discourse_analysis(session_id);
CREATE INDEX IF NOT EXISTS idx_audio_analysis_summary_session_id ON audio_analysis_summary(session_id);
CREATE INDEX IF NOT EXISTS idx_audio_analysis_summary_user_id ON audio_analysis_summary(user_id);

CREATE INDEX IF NOT EXISTS idx_student_progress_history_user_id ON student_progress_history(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_history_assessment_date ON student_progress_history(assessment_date);

-- Reference data indexes
CREATE INDEX IF NOT EXISTS idx_word_frequency_database_word ON word_frequency_database(word);
CREATE INDEX IF NOT EXISTS idx_word_frequency_database_frequency ON word_frequency_database(frequency_per_million);
CREATE INDEX IF NOT EXISTS idx_academic_word_list_word ON academic_word_list(word);
CREATE INDEX IF NOT EXISTS idx_academic_word_list_headword ON academic_word_list(headword);
CREATE INDEX IF NOT EXISTS idx_cefr_word_levels_word ON cefr_word_levels(word);
CREATE INDEX IF NOT EXISTS idx_cefr_word_levels_level ON cefr_word_levels(cefr_level);
CREATE INDEX IF NOT EXISTS idx_discourse_markers_marker ON discourse_markers(marker);
CREATE INDEX IF NOT EXISTS idx_discourse_markers_category ON discourse_markers(category);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Create update trigger for audio_recordings if function exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_audio_recordings_updated_at
            BEFORE UPDATE ON audio_recordings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all audio analysis tables
ALTER TABLE audio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE fluency_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE discourse_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_analysis_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress_history ENABLE ROW LEVEL SECURITY;

-- Audio recordings policies
CREATE POLICY "Users can view their own audio recordings" ON audio_recordings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audio recordings" ON audio_recordings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audio recordings" ON audio_recordings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student recordings" ON audio_recordings
    FOR SELECT USING (auth.uid() = teacher_id);

-- Audio analysis sessions policies
CREATE POLICY "Users can view their own analysis sessions" ON audio_analysis_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis sessions" ON audio_analysis_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Speech transcriptions policies (inherit from sessions)
CREATE POLICY "Users can view their transcriptions" ON speech_transcriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_analysis_sessions 
            WHERE audio_analysis_sessions.id = speech_transcriptions.session_id 
            AND audio_analysis_sessions.user_id = auth.uid()
        )
    );

-- Grammar analysis policies (inherit from sessions)
CREATE POLICY "Users can view their grammar analysis" ON grammar_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_analysis_sessions 
            WHERE audio_analysis_sessions.id = grammar_analysis.session_id 
            AND audio_analysis_sessions.user_id = auth.uid()
        )
    );

-- Vocabulary analysis policies (inherit from sessions)
CREATE POLICY "Users can view their vocabulary analysis" ON vocabulary_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_analysis_sessions 
            WHERE audio_analysis_sessions.id = vocabulary_analysis.session_id 
            AND audio_analysis_sessions.user_id = auth.uid()
        )
    );

-- Fluency analysis policies (inherit from sessions)
CREATE POLICY "Users can view their fluency analysis" ON fluency_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_analysis_sessions 
            WHERE audio_analysis_sessions.id = fluency_analysis.session_id 
            AND audio_analysis_sessions.user_id = auth.uid()
        )
    );

-- Pronunciation analysis policies (inherit from sessions)
CREATE POLICY "Users can view their pronunciation analysis" ON pronunciation_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_analysis_sessions 
            WHERE audio_analysis_sessions.id = pronunciation_analysis.session_id 
            AND audio_analysis_sessions.user_id = auth.uid()
        )
    );

-- Discourse analysis policies (inherit from sessions)
CREATE POLICY "Users can view their discourse analysis" ON discourse_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_analysis_sessions 
            WHERE audio_analysis_sessions.id = discourse_analysis.session_id 
            AND audio_analysis_sessions.user_id = auth.uid()
        )
    );

-- Audio analysis summary policies
CREATE POLICY "Users can view their analysis summaries" ON audio_analysis_summary
    FOR SELECT USING (auth.uid() = user_id);

-- Student progress history policies
CREATE POLICY "Users can view their progress history" ON student_progress_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their progress history" ON student_progress_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reference data tables are public read (no RLS needed)
-- But we'll add policies for completeness
ALTER TABLE word_frequency_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_word_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE cefr_word_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE discourse_markers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read reference data
CREATE POLICY "All users can read word frequency data" ON word_frequency_database
    FOR SELECT USING (true);

CREATE POLICY "All users can read academic word list" ON academic_word_list
    FOR SELECT USING (true);

CREATE POLICY "All users can read CEFR word levels" ON cefr_word_levels
    FOR SELECT USING (true);

CREATE POLICY "All users can read discourse markers" ON discourse_markers
    FOR SELECT USING (true);

-- Grant permissions to authenticated users
GRANT ALL ON audio_recordings TO authenticated;
GRANT ALL ON audio_analysis_sessions TO authenticated;
GRANT ALL ON speech_transcriptions TO authenticated;
GRANT ALL ON grammar_analysis TO authenticated;
GRANT ALL ON vocabulary_analysis TO authenticated;
GRANT ALL ON fluency_analysis TO authenticated;
GRANT ALL ON pronunciation_analysis TO authenticated;
GRANT ALL ON discourse_analysis TO authenticated;
GRANT ALL ON audio_analysis_summary TO authenticated;
GRANT ALL ON student_progress_history TO authenticated;
GRANT SELECT ON word_frequency_database TO authenticated;
GRANT SELECT ON academic_word_list TO authenticated;
GRANT SELECT ON cefr_word_levels TO authenticated;
GRANT SELECT ON discourse_markers TO authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Audio analysis tables have been created with proper
-- indexes, RLS policies, and permissions
-- =====================================================