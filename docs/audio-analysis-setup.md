# Audio Analysis Feature - Setup Guide

## Overview
This feature adds comprehensive ESL/EFL audio analysis capabilities, leveraging the existing STT infrastructure from the brains folder.

## Environment Setup

### 1. Database Setup

Run the migration scripts in Supabase SQL Editor:

```sql
-- First, run the migration
-- Copy contents of: face-landing/migrations/audio_analysis_migration.sql

-- Then, add sample reference data
-- Copy contents of: face-landing/migrations/audio_analysis_seed_data.sql
```

### 2. Environment Variables

No additional environment variables needed! The feature uses:
- Existing `OPENAI_API_KEY` for Whisper STT
- Existing Supabase configuration
- Existing storage setup

### 3. Linguistic Data Import (Optional)

For production use, import comprehensive linguistic data:

```bash
# Install dependencies
cd face-landing
npm install csv-parse

# Run import script
npx ts-node scripts/import-linguistic-data.ts
```

## Integration with Existing Services

### Using Existing STT

The audio analysis feature automatically uses your existing OpenAI Whisper setup:

```typescript
import { transcribeWithWhisper } from '../config/audio-analysis.config';

// Transcribe audio
const transcription = await transcribeWithWhisper(audioBuffer, 'en');
```

### Storage

Audio files are stored in Supabase Storage:
- Bucket: `audio-recordings`
- Max file size: 50MB
- Supported formats: mp3, wav, m4a, webm, ogg

## API Endpoints

The feature will need these API endpoints:

1. **Upload Audio**: `/api/audio/upload`
2. **Get Analysis**: `/api/audio/analysis/:sessionId`
3. **Get Progress History**: `/api/audio/progress/:userId`

## Processing Flow

1. User uploads audio file
2. File stored in Supabase Storage
3. Audio sent to existing Whisper STT
4. Transcription analyzed using spaCy (to be implemented)
5. Results stored in analysis tables
6. CEFR level calculated and returned

## Next Steps

1. Create API endpoints for audio upload
2. Implement linguistic analysis services
3. Create frontend upload component
4. Build results dashboard

## Notes

- The feature reuses existing OpenAI Whisper configuration
- No additional API keys or services needed
- All data stored in existing Supabase instance
- Compatible with current authentication system