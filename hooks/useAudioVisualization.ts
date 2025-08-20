import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioQualityMetrics {
  audioLevel: number;
  rmsLevel: number;
  peakLevel: number;
  qualityStatus: 'good' | 'quiet' | 'loud' | 'very_quiet' | 'clipping';
  recommendation?: string;
}

interface UseAudioVisualizationOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
}

interface UseAudioVisualizationReturn {
  audioLevel: number;
  qualityMetrics: AudioQualityMetrics;
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
  const [qualityMetrics, setQualityMetrics] = useState<AudioQualityMetrics>({
    audioLevel: 0,
    rmsLevel: -Infinity,
    peakLevel: -Infinity,
    qualityStatus: 'good'
  });
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
    setQualityMetrics({
      audioLevel: 0,
      rmsLevel: -Infinity,
      peakLevel: -Infinity,
      qualityStatus: 'good'
    });
    setError(null);
  }, []);

  const assessAudioQuality = useCallback((rmsDb: number, peakDb: number): AudioQualityMetrics['qualityStatus'] => {
    if (peakDb > -1) return 'clipping';
    if (rmsDb < -40) return 'very_quiet';
    if (rmsDb < -25) return 'quiet';
    if (rmsDb > -8) return 'loud';
    return 'good';
  }, []);

  const getRecommendation = useCallback((status: AudioQualityMetrics['qualityStatus']): string | undefined => {
    switch (status) {
      case 'very_quiet': return 'Speak louder or move closer to microphone';
      case 'quiet': return 'Speak a bit louder for better quality';
      case 'loud': return 'Lower your voice or move back from microphone';
      case 'clipping': return 'Audio is too loud - reduce input level';
      default: return undefined;
    }
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current || !isActive) {
      setAudioLevel(0);
      setQualityMetrics(prev => ({
        ...prev,
        audioLevel: 0,
        rmsLevel: -Infinity,
        peakLevel: -Infinity,
        qualityStatus: 'good',
        recommendation: undefined
      }));
      return;
    }

    const freqDataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(freqDataArray);
    
    const timeDataArray = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(timeDataArray);
    
    const freqAverage = freqDataArray.reduce((sum, value) => sum + value, 0) / freqDataArray.length;
    const visualLevel = freqAverage / 255;
    
    let sumSquares = 0;
    let peak = 0;
    
    for (let i = 0; i < timeDataArray.length; i++) {
      const sample = (timeDataArray[i] - 128) / 128;
      sumSquares += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }
    
    const rms = Math.sqrt(sumSquares / timeDataArray.length);
    const rmsDb = rms > 0 ? 20 * Math.log10(Math.max(rms, 0.00001)) : -100;
    const peakDb = peak > 0 ? 20 * Math.log10(Math.max(peak, 0.00001)) : -100;
    
    const qualityStatus = assessAudioQuality(rmsDb, peakDb);
    const recommendation = getRecommendation(qualityStatus);
    
    setAudioLevel(visualLevel);
    setQualityMetrics({
      audioLevel: visualLevel,
      rmsLevel: rmsDb,
      peakLevel: peakDb,
      qualityStatus,
      recommendation
    });
    
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, [isActive, assessAudioQuality, getRecommendation]);

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
    qualityMetrics,
    isSupported,
    error
  };
};

export default useAudioVisualization;