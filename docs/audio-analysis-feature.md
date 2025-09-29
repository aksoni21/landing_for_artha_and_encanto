# ESL/EFL Audio Analysis Feature

## Overview
A web-based feature that allows users to upload audio recordings of ESL/EFL students via mobile devices (iPhone/Android) for comprehensive English proficiency analysis.

## Core Analysis Metrics

### 1. Grammar Complexity
- **Tense Usage**: Track progression from simple present → past → continuous → perfect aspects
- **Sentence Structures**: Analyze simple → compound → complex sentences with subordinate clauses
- **Advanced Grammar**: Detect conditionals, passive voice, and modal verb usage
- **Measurement**: Parse syntax trees with spaCy, pattern matching for tense markers, dependency parsing

### 2. Vocabulary Analysis
- **Word Frequency Levels**: Compare against common word lists (1000 → 2000 → 3000+ words)
- **Academic Vocabulary**: Track usage of academic word list (AWL) terms
- **Lexical Features**: Identify collocations, phrasal verbs, and idiomatic expressions
- **Diversity Metrics**: Calculate type-token ratio (TTR)
- **Measurement**: Compare against SUBTLEXus frequency database, n-gram analysis

### 3. Fluency Metrics
- **Speech Rate**: Words per minute calculation
- **Pause Analysis**: Frequency and duration of pauses (>250ms)
- **Disfluencies**: Track filler words ("um", "uh"), self-corrections, false starts
- **Consistency**: Measure speech rate variations
- **Measurement**: Use speech-to-text timestamps, audio signal processing

### 4. Pronunciation & Phonetics
- **Phoneme Accuracy**: Compare expected vs actual pronunciation
- **Prosody**: Analyze stress patterns and intonation
- **L1 Interference**: Detect native language influence patterns
- **Measurement**: Forced alignment, pitch tracking, formant analysis

### 5. Discourse Competence
- **Coherence Markers**: Track usage of discourse markers (firstly, however, therefore)
- **Topic Development**: Analyze logical flow and organization
- **Register Awareness**: Detect formal vs informal language use
- **Measurement**: Keyword spotting, sentence embedding similarity

## Technical Architecture

### Frontend (Mobile-Optimized)
- React/Vue responsive web application
- Web Audio API for recording
- Drag-and-drop file upload
- Real-time processing indicators
- Interactive results dashboard

### Backend Services

#### API Gateway
- REST endpoints for file upload
- WebSocket for processing updates
- Authentication and rate limiting
- File validation (format, size, duration)

#### Processing Pipeline
1. **Audio Preprocessing**
   - Noise reduction
   - Audio normalization
   - Voice Activity Detection (VAD)
   - Chunking for long files

2. **Speech Recognition**
   - Primary: Google Cloud Speech-to-Text
   - Alternatives: AWS Transcribe, Azure Speech Services
   - Self-hosted: OpenAI Whisper
   - Output: Transcription with word-level timestamps

3. **Analysis Microservices**
   - Grammar Analyzer (spaCy/NLTK)
   - Vocabulary Analyzer (custom with frequency DB)
   - Fluency Analyzer (timestamp-based algorithms)
   - Pronunciation Analyzer (acoustic models)

4. **Scoring Engine**
   - Aggregate all metrics
   - Map to CEFR levels (A1-C2)
   - Generate comparative insights

### Data Layer
- **PostgreSQL**: User data, analysis results, frequency databases
- **S3/Cloud Storage**: Audio file storage
- **Redis**: Processing queue, caching
- **Elasticsearch**: Historical analysis search

### Infrastructure
- Kubernetes for service orchestration
- Message queue (RabbitMQ/Kafka) for async processing
- CDN for static assets
- Auto-scaling for compute services

## External Resources

### Speech Recognition APIs
- Google Cloud Speech-to-Text
- AWS Transcribe
- Azure Speech Services
- AssemblyAI
- OpenAI Whisper (self-hosted)

### Linguistic Resources (Self-Hosted)
- **SUBTLEXus**: Word frequency database
- **NGSL**: New General Service List (core vocabulary)
- **AWL**: Academic Word List
- **CEFR-J**: CEFR-aligned wordlists
- **WordNet**: Semantic relationships (via NLTK)

### Open-Source Tools
- **spaCy**: Grammar parsing, POS tagging
- **NLTK**: Tokenization, linguistic analysis
- **LanguageTool**: Grammar checking (API or self-hosted)
- **TextStat**: Readability metrics
- **pronouncing**: CMU pronunciation dictionary

## Implementation Notes

### Custom Components
1. **Frequency Analyzer**: Query SUBTLEXus data stored in PostgreSQL
2. **CEFR Mapper**: Map vocabulary/grammar to CEFR levels using CEFR-J
3. **Grammar Complexity Scorer**: Analyze spaCy parse trees
4. **Fluency Calculator**: Process transcription timestamps
5. **Pronunciation Scorer**: Implement phoneme alignment scoring

### Data Processing
- Pre-process all wordlists into indexed PostgreSQL tables
- Cache common queries in Redis
- Build rule engines for grammar pattern detection
- Create CEFR-aligned scoring rubrics

### Performance Considerations
- Implement audio chunking for files > 5 minutes
- Use job queues for async processing
- Cache analysis results for similar inputs
- Implement progressive loading for UI

## CEFR Level Mapping
- **A1-A2**: Simple tenses, basic vocabulary (GSL 1000)
- **B1-B2**: Perfect tenses, phrasal verbs, AWL usage
- **C1-C2**: Complex conditionals, idiomatic expressions, sophisticated discourse markers

## Future Enhancements
- Real-time analysis during recording
- Peer comparison features
- Progress tracking over time
- Personalized learning recommendations
- Multi-language support