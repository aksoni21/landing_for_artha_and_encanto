import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

interface Voice {
  id: string;
  name: string;
  description?: string;
  language?: string;
}

const PINNED_VOICES: Voice[] = [
  { id: '6f84f4b8-58a2-430c-8c79-688dad597532', name: 'Brooke (English)', language: 'en' },
  { id: '71a7ad14-091c-4e8e-a314-022ece01c121', name: 'Default Tutor', language: 'en' },
  { id: '5c5ad5e7-1020-476b-8b91-fdcbe9cc313c', name: 'Spanish', language: 'es' },
  { id: '95d51f79-c397-46f9-b49a-23763d3eaa2d', name: 'Hindi', language: 'hi' },
];
const PINNED_IDS = new Set(PINNED_VOICES.map(v => v.id));

interface Chunk {
  text: string;
  paragraphStart: boolean;
}

function splitIntoChunks(text: string, maxLen = 400): Chunk[] {
  if (!text.trim()) return [];

  const chunks: Chunk[] = [];
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const trimmed = paragraphs[pi].trim();
    const isNewParagraph = pi > 0;

    if (trimmed.length <= maxLen) {
      chunks.push({ text: trimmed, paragraphStart: isNewParagraph });
      continue;
    }

    // Try splitting by sentences
    const sentences = trimmed.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) {
      let current = '';
      let isFirst = true;
      for (const s of sentences) {
        if (current && current.length + s.length + 1 > maxLen) {
          chunks.push({ text: current.trim(), paragraphStart: isFirst && isNewParagraph });
          current = s;
          isFirst = false;
        } else {
          current = current ? `${current} ${s}` : s;
        }
      }
      if (current.trim()) {
        chunks.push({ text: current.trim(), paragraphStart: isFirst && isNewParagraph });
      }
    } else {
      // No sentence breaks — split at word boundary
      let remaining = trimmed;
      let isFirst = true;
      while (remaining.length > maxLen) {
        let splitIdx = remaining.lastIndexOf(' ', maxLen);
        if (splitIdx <= 0) splitIdx = maxLen;
        chunks.push({ text: remaining.slice(0, splitIdx).trim(), paragraphStart: isFirst && isNewParagraph });
        remaining = remaining.slice(splitIdx).trim();
        isFirst = false;
      }
      if (remaining.trim()) {
        chunks.push({ text: remaining.trim(), paragraphStart: isFirst && isNewParagraph });
      }
    }
  }

  return chunks;
}

export default function ReadPage() {
  const [text, setText] = useState('');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [voiceId, setVoiceId] = useState(PINNED_VOICES[0].id);
  const [voices, setVoices] = useState<Voice[]>(PINNED_VOICES);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState('');

  // Refs for stable access in callbacks
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Chunk[]>([]);
  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(-1);
  const speedRef = useRef(1);
  const voiceIdRef = useRef(PINNED_VOICES[0].id);
  const abortRef = useRef<AbortController | null>(null);
  const prefetchRef = useRef<Map<number, Blob>>(new Map());
  const audioUrlRef = useRef<string | null>(null);
  const currentChunkElRef = useRef<HTMLSpanElement | null>(null);

  // Sync refs
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { voiceIdRef.current = voiceId; }, [voiceId]);

  // Update playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  // Auto-scroll to current chunk
  useEffect(() => {
    currentChunkElRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentChunkIndex]);

  // Fetch voices on mount
  useEffect(() => {
    fetch('/api/voices')
      .then(r => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((data: Voice[] | { error: string }) => {
        if (Array.isArray(data)) {
          const apiVoices = data
            .filter((v: Voice) => v.id && v.name && !PINNED_IDS.has(v.id))
            .sort((a, b) => a.name.localeCompare(b.name));
          setVoices([...PINNED_VOICES, ...apiVoices]);
        } else if ('error' in data) {
          setConfigError(String(data.error));
        }
      })
      .catch(() => {
        // Keep pinned voices, just show warning
        setConfigError('Could not load full voice list. Using saved voices.');
      });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      audioRef.current?.pause();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  // --- Audio playback engine ---

  const fetchAudio = async (chunkText: string, signal?: AbortSignal): Promise<Blob> => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chunkText, voice_id: voiceIdRef.current }),
      signal,
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'TTS request failed');
    }
    return response.blob();
  };

  const prefetchChunk = (index: number) => {
    if (index >= chunksRef.current.length || prefetchRef.current.has(index)) return;
    fetchAudio(chunksRef.current[index].text).then(blob => {
      prefetchRef.current.set(index, blob);
    }).catch(() => { /* prefetch failure is non-critical */ });
  };

  const playChunk = async (index: number) => {
    if (!isPlayingRef.current || index >= chunksRef.current.length) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunkIndex(-1);
      currentIndexRef.current = -1;
      setIsLoadingAudio(false);
      return;
    }

    currentIndexRef.current = index;
    setCurrentChunkIndex(index);
    setError('');

    try {
      let blob: Blob;

      if (prefetchRef.current.has(index)) {
        blob = prefetchRef.current.get(index)!;
        prefetchRef.current.delete(index);
      } else {
        setIsLoadingAudio(true);
        const controller = new AbortController();
        abortRef.current = controller;
        blob = await fetchAudio(chunksRef.current[index].text, controller.signal);
      }

      setIsLoadingAudio(false);
      if (!isPlayingRef.current) return;

      // Prefetch next chunk
      prefetchChunk(index + 1);

      // Clean up previous audio
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);

      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;

      const audio = new Audio(url);
      audio.playbackRate = speedRef.current;
      audioRef.current = audio;

      audio.onended = () => {
        if (isPlayingRef.current) playChunk(index + 1);
      };

      audio.onerror = () => {
        setError('Audio playback error');
        if (isPlayingRef.current) playChunk(index + 1);
      };

      await audio.play();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to generate audio');
      setIsLoadingAudio(false);
      if (isPlayingRef.current) {
        setTimeout(() => playChunk(index + 1), 1000);
      }
    }
  };

  // --- Control handlers ---

  const handlePlay = () => {
    if (!text.trim()) return;
    const newChunks = splitIntoChunks(text);
    if (newChunks.length === 0) return;
    chunksRef.current = newChunks;
    setChunks(newChunks);
    prefetchRef.current.clear();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    playChunk(0);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    audioRef.current?.play();
    setIsPaused(false);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    isPlayingRef.current = false;
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    prefetchRef.current.clear();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(-1);
    currentIndexRef.current = -1;
    setIsLoadingAudio(false);
    setChunks([]);
  };

  const handleNext = () => {
    if (currentIndexRef.current >= chunksRef.current.length - 1) return;
    abortRef.current?.abort();
    audioRef.current?.pause();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    playChunk(currentIndexRef.current + 1);
  };

  const handlePrevious = () => {
    if (currentIndexRef.current <= 0) return;
    abortRef.current?.abort();
    audioRef.current?.pause();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    playChunk(currentIndexRef.current - 1);
  };

  const jumpToChunk = (index: number) => {
    if (!isPlaying && !isPaused) return;
    abortRef.current?.abort();
    audioRef.current?.pause();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    playChunk(index);
  };

  // Stable ref for actions (for keyboard handler)
  const actionsRef = useRef({ handlePlay, handlePause, handleResume, handleStop, handleNext, handlePrevious });
  actionsRef.current = { handlePlay, handlePause, handleResume, handleStop, handleNext, handlePrevious };

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlayingRef.current && audioRef.current && !audioRef.current.paused) {
          actionsRef.current.handlePause();
        } else if (isPlayingRef.current && audioRef.current?.paused) {
          actionsRef.current.handleResume();
        } else if (!isPlayingRef.current) {
          actionsRef.current.handlePlay();
        }
      } else if (e.code === 'Escape') {
        actionsRef.current.handleStop();
      } else if (e.code === 'ArrowRight' && isPlayingRef.current) {
        e.preventDefault();
        actionsRef.current.handleNext();
      } else if (e.code === 'ArrowLeft' && isPlayingRef.current) {
        e.preventDefault();
        actionsRef.current.handlePrevious();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // --- Derived values ---
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const readingTimeMin = Math.ceil(wordCount / 150);
  const progress = chunks.length > 0 && currentChunkIndex >= 0
    ? ((currentChunkIndex + 1) / chunks.length) * 100
    : 0;
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <>
      <Head>
        <title>Text Reader</title>
        <meta name="description" content="Paste any text and listen to it read aloud with natural AI voices." />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-lg font-semibold text-gray-900">Text Reader</h1>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Voice selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="voice-select" className="text-sm text-gray-500">Voice</label>
                <select
                  id="voice-select"
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-[200px]"
                  disabled={isPlaying && !isPaused}
                >
                  {voices.length === 0 && <option value="">Loading...</option>}
                  <optgroup label="Saved Voices">
                    {PINNED_VOICES.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </optgroup>
                  {voices.length > PINNED_VOICES.length && (
                    <optgroup label="All Voices">
                      {voices.filter(v => !PINNED_IDS.has(v.id)).map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
              {/* Speed selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="speed-select" className="text-sm text-gray-500">Speed</label>
                <select
                  id="speed-select"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {speedOptions.map(s => (
                    <option key={s} value={s}>{s}x</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Config error */}
        {configError && (
          <div className="max-w-3xl mx-auto px-4 mt-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              {configError}
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col">
          {/* Text area / Reading view */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[50vh]">
            {isPlaying || isPaused ? (
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto text-lg leading-relaxed text-gray-800">
                {chunks.map((chunk, i) => (
                  <span key={i}>
                    {chunk.paragraphStart && <span className="block h-5" />}
                    <span
                      ref={i === currentChunkIndex ? currentChunkElRef : undefined}
                      onClick={() => jumpToChunk(i)}
                      className={`cursor-pointer transition-colors duration-200 rounded-sm px-0.5 -mx-0.5 ${
                        i === currentChunkIndex
                          ? 'bg-yellow-200 text-gray-900'
                          : i < currentChunkIndex
                          ? 'text-gray-400'
                          : 'text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {chunk.text}
                    </span>
                    {' '}
                  </span>
                ))}
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to listen to it read aloud..."
                className="w-full flex-1 p-6 sm:p-8 text-lg leading-relaxed text-gray-800 resize-none focus:outline-none placeholder-gray-400"
              />
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3 px-1 text-sm text-gray-500">
            <span>{wordCount.toLocaleString()} words</span>
            <span>{charCount.toLocaleString()} chars</span>
            {wordCount > 0 && <span>~{readingTimeMin} min</span>}
            {chunks.length > 0 && currentChunkIndex >= 0 && (
              <span className="ml-auto font-medium text-gray-700">
                {currentChunkIndex + 1} / {chunks.length}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {(isPlaying || isPaused) && (
            <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={!isPlaying && !isPaused}
              className="p-2.5 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous (Left arrow)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            {/* Play / Pause */}
            {isPlaying && !isPaused ? (
              <button
                onClick={handlePause}
                className="p-3.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg"
                title="Pause (Space)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              </button>
            ) : isPaused ? (
              <button
                onClick={handleResume}
                className="p-3.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg"
                title="Resume (Space)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handlePlay}
                disabled={!text.trim() || !!configError}
                className="p-3.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-lg"
                title="Play (Space)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={!isPlaying && !isPaused}
              className="p-2.5 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next (Right arrow)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* Stop */}
            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="p-2.5 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Stop (Esc)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>

          {/* Loading indicator */}
          {isLoadingAudio && (
            <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
              <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating audio...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          {!isPlaying && !isPaused && text.trim() && !configError && (
            <p className="mt-6 text-center text-xs text-gray-400">
              Space to play &middot; Arrow keys to navigate &middot; Esc to stop
            </p>
          )}
        </main>
      </div>
    </>
  );
}
