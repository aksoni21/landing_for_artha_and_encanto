import { useState, useRef, useEffect, useCallback } from 'react';

interface UseAudioVisualizationOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
}

interface UseAudioVisualizationReturn {
  audioLevel: number;
  isSupported: boolean;
  error: string | null;
}

export const useAudioVisualization = (
  mediaStream: MediaStream | null,
  isActive: boolean,
  options: UseAudioVisualizationOptions = {}
): UseAudioVisualizationReturn => {
  const {
    fftSize = 256,
    smoothingTimeConstant = 0.8
  } = options;

  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setAudioLevel(0);
    setError(null);
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current || !isActive) {
      setAudioLevel(0);
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average / 255); // Normalize to 0-1
    
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, [isActive]);

  const setupAudioContext = useCallback(async (stream: MediaStream) => {
    try {
      cleanup();

      // Check browser support
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        setIsSupported(false);
        setError('Web Audio API not supported in this browser');
        return;
      }

      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Resume context if suspended (required in some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create analyser
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = fftSize;
      analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;

      // Connect stream to analyser
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      setIsSupported(true);
      setError(null);
    } catch (err) {
      console.error('Failed to setup audio context:', err);
      setError('Failed to setup audio visualization');
      setIsSupported(false);
      cleanup();
    }
  }, [cleanup, fftSize, smoothingTimeConstant]);

  // Setup audio context when stream becomes available
  useEffect(() => {
    if (mediaStream && isActive) {
      setupAudioContext(mediaStream);
    } else {
      cleanup();
    }

    return cleanup;
  }, [mediaStream, isActive, setupAudioContext, cleanup]);

  // Start/stop audio level monitoring
  useEffect(() => {
    if (isActive && analyserRef.current) {
      updateAudioLevel();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setAudioLevel(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, updateAudioLevel]);

  return {
    audioLevel,
    isSupported,
    error
  };
};

export default useAudioVisualization;