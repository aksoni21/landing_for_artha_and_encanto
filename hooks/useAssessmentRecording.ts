import { useState, useRef, useCallback } from 'react';
import { detectBestAudioMimeType, createMediaRecorderOptions } from '../utils/audioMimeType';

interface UseAssessmentRecordingProps {
  maxDuration: number; // in seconds
  minDuration: number; // in seconds
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onError?: (error: string) => void;
}

export const useAssessmentRecording = ({
  maxDuration,
  minDuration,
  onRecordingComplete,
  onError
}: UseAssessmentRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mimeTypeRef = useRef<string>('');

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });

      streamRef.current = stream;
      setPermissionGranted(true);

      // Detect best MIME type for this platform
      const mimeType = detectBestAudioMimeType();
      mimeTypeRef.current = mimeType;
      console.log('Using MIME type:', mimeType || 'browser default');

      // Create MediaRecorder with platform-appropriate options
      const mediaRecorder = new MediaRecorder(stream, createMediaRecorderOptions());
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: mimeTypeRef.current || 'audio/webm'
        });
        setRecordedBlob(audioBlob);

        if (recordingTime >= minDuration) {
          onRecordingComplete(audioBlob, recordingTime);
        } else {
          onError?.(` Recording too short. Please record for at least ${minDuration} seconds.`);
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setRecordingTime(0);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setPermissionGranted(false);
      onError?.('Failed to access microphone. Please check permissions.');
    }
  }, [maxDuration, minDuration, onRecordingComplete, onError, recordingTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    cleanup();
  }, [cleanup]);

  const resetRecording = useCallback(() => {
    cleanup();
    setIsRecording(false);
    setRecordingTime(0);
    setRecordedBlob(null);
    chunksRef.current = [];
  }, [cleanup]);

  return {
    isRecording,
    recordingTime,
    recordedBlob,
    permissionGranted,
    startRecording,
    stopRecording,
    resetRecording,
    canRecord: permissionGranted !== false && !isRecording,
    isMaxDurationReached: recordingTime >= maxDuration,
    isMinDurationMet: recordingTime >= minDuration
  };
};