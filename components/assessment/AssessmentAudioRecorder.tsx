import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, RotateCcw, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface AssessmentAudioRecorderProps {
  minDuration: number; // in seconds
  maxDuration: number; // in seconds
  warningAt: number; // when to show warning
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onError: (error: string) => void;
  language?: string;
  disabled?: boolean;
}

type RecorderState = 'idle' | 'recording' | 'paused' | 'finished';

const AssessmentAudioRecorder: React.FC<AssessmentAudioRecorderProps> = ({
  minDuration,
  maxDuration,
  warningAt,
  onRecordingComplete,
  onError,
  language = 'en', // eslint-disable-line @typescript-eslint/no-unused-vars
  disabled = false
}) => {
  const [state, setState] = useState<RecorderState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWarned, setHasWarned] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, [state]);

  // Timer effect
  useEffect(() => {
    if (state === 'recording') {
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;

          // Show warning
          if (newDuration === warningAt && !hasWarned) {
            setHasWarned(true);
            // You could emit a warning event here if needed
          }

          // Auto-stop at max duration
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }

          return newDuration;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state, maxDuration, warningAt, hasWarned, stopRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setState('finished');

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError('Recording error occurred');
        reset();
      };

      mediaRecorder.start(1000); // Collect data every second
      setState('recording');
      setDuration(0);
      setHasWarned(false);

    } catch (error) {
      console.error('Error starting recording:', error);
      onError('Could not access microphone. Please check permissions.');
    }
  };

  // const pauseRecording = () => {
  //   if (mediaRecorderRef.current && state === 'recording') {
  //     mediaRecorderRef.current.pause();
  //     setState('paused');
  //   }
  // };

  // const resumeRecording = () => {
  //   if (mediaRecorderRef.current && state === 'paused') {
  //     mediaRecorderRef.current.resume();
  //     setState('recording');
  //   }
  // };

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setState('idle');
    setDuration(0);
    setAudioBlob(null);
    setAudioUrl('');
    setIsPlaying(false);
    setHasWarned(false);
    mediaRecorderRef.current = null;
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    if (audioBlob && duration >= minDuration) {
      onRecordingComplete(audioBlob, duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (duration < minDuration) return '#ef4444'; // red
    if (duration >= warningAt) return '#f59e0b'; // amber
    return '#10b981'; // green
  };

  const isValidDuration = duration >= minDuration;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Main recorder interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {/* Timer display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-mono font-bold mb-2" style={{ color: getProgressColor() }}>
            {formatTime(duration)}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: getProgressColor(),
                width: `${Math.min((duration / maxDuration) * 100, 100)}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((duration / maxDuration) * 100, 100)}%` }}
            />
          </div>

          <div className="text-sm text-gray-500">
            Min: {formatTime(minDuration)} | Max: {formatTime(maxDuration)}
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex justify-center space-x-4 mb-6">
          {state === 'recording' && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center space-x-2 text-red-500"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording</span>
            </motion.div>
          )}

          {duration >= warningAt && duration < maxDuration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-amber-500"
            >
              <AlertCircle size={16} />
              <span className="text-sm">
                {maxDuration - duration}s remaining
              </span>
            </motion.div>
          )}

          {isValidDuration && state === 'finished' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-green-500"
            >
              <CheckCircle size={16} />
              <span className="text-sm">Ready to submit</span>
            </motion.div>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex justify-center space-x-3">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.button
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                disabled={disabled}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white p-4 rounded-full transition-colors"
              >
                <Mic size={24} />
              </motion.button>
            )}

            {state === 'recording' && (
              <motion.button
                key="stop"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full transition-colors"
              >
                <Square size={24} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Playback and reset buttons for finished recordings */}
          {state === 'finished' && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayback}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-full transition-colors"
              >
                <RotateCcw size={24} />
              </motion.button>

              {isValidDuration && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-colors"
                >
                  <Upload size={24} />
                </motion.button>
              )}
            </>
          )}
        </div>

        {/* Validation message */}
        {state === 'finished' && !isValidDuration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertCircle size={16} />
              <span className="text-sm">
                Recording must be at least {formatTime(minDuration)} long
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AssessmentAudioRecorder;