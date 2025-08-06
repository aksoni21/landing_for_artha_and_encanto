import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useAudioVisualization from '../../hooks/useAudioVisualization';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 900, // 15 minutes default
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use custom hook for audio visualization
  const { audioLevel, isSupported: isVisualizationSupported, error: visualizationError } = useAudioVisualization(
    streamRef.current,
    isRecording && !isPaused
  );

  useEffect(() => {
    // Check if browser supports required APIs
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Audio recording not supported in this browser');
      return;
    }

    // Check microphone permission status
    navigator.permissions?.query({ name: 'microphone' as PermissionName }).then((result) => {
      setPermissionStatus(result.state === 'granted' ? 'granted' : 'pending');
      
      result.onchange = () => {
        setPermissionStatus(result.state === 'granted' ? 'granted' : 'denied');
      };
    });

    return () => {
      cleanup();
    };
  }, []);


  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    console.log('🎙️ Starting recording...');
    try {
      // Request microphone access
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });
      console.log('✅ Microphone access granted');

      streamRef.current = stream;
      setPermissionStatus('granted');
      console.log('✅ Audio stream setup complete');

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob, duration);
      };

      // Start recording
      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setDuration(0);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            toast('Maximum recording duration reached', { icon: '⏱️' });
          }
          return newDuration;
        });
      }, 1000);

      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionStatus('denied');
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      cleanup();
      toast.success('Recording completed');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        
        // Resume timer
        intervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
        
        toast('Recording resumed', { icon: '▶️' });
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        
        // Pause timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        toast('Recording paused', { icon: '⏸️' });
      }
    }
  };


  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPermissionMessage = () => {
    if (visualizationError && !isVisualizationSupported) {
      return 'Audio visualization not supported, but recording will work normally.';
    }
    
    switch (permissionStatus) {
      case 'denied':
        return 'Microphone access denied. Please enable microphone permissions to record audio.';
      case 'pending':
        return 'Click the record button to request microphone access.';
      case 'granted':
        return 'Ready to record!';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Audio Recorder</h3>
        <p className="text-sm text-gray-600">{getPermissionMessage()}</p>
      </div>

      {/* Visual Feedback */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Audio Level Visualizer */}
          <motion.div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
              isRecording && !isPaused
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-gray-50'
            }`}
            animate={{
              scale: isRecording && !isPaused ? 1 + (audioLevel * 0.3) : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            {/* Microphone Icon */}
            <svg
              className={`w-10 h-10 ${
                isRecording && !isPaused ? 'text-red-500' : 'text-gray-400'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </motion.div>

          {/* Recording Pulse Animation */}
          <AnimatePresence>
            {isRecording && !isPaused && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Duration Display */}
      <div className="text-center mb-6">
        <div className={`text-2xl font-mono font-bold ${
          isRecording ? 'text-red-600' : 'text-gray-600'
        }`}>
          {formatDuration(duration)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Max: {formatDuration(maxDuration)}
        </div>
      </div>

      {/* Audio Level Bar */}
      {isRecording && (
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-full rounded-full"
              style={{ width: `${audioLevel * 100}%` }}
              animate={{ width: `${audioLevel * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="text-xs text-center text-gray-500 mt-1">
            Audio Level: {Math.round(audioLevel * 100)}%
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <motion.button
            onClick={startRecording}
            disabled={permissionStatus === 'denied'}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
              permissionStatus === 'denied'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
            }`}
            whileHover={permissionStatus !== 'denied' ? { scale: 1.05 } : {}}
            whileTap={permissionStatus !== 'denied' ? { scale: 0.95 } : {}}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Start Recording
          </motion.button>
        ) : (
          <div className="flex gap-3">
            {/* Pause/Resume Button */}
            <motion.button
              onClick={pauseRecording}
              className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Resume
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  Pause
                </>
              )}
            </motion.button>

            {/* Stop Button */}
            <motion.button
              onClick={stopRecording}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z"/>
              </svg>
              Stop
            </motion.button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center justify-center gap-2 text-red-700 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {isPaused ? 'Recording paused' : 'Recording in progress...'}
            </div>
            <div className="text-center text-xs text-red-600 mt-1">
              Speak clearly into your microphone
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioRecorder;