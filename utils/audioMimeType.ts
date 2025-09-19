/**
 * Detects the best supported MIME type for MediaRecorder across different platforms
 * @returns {string} The best supported MIME type, or empty string for browser default
 */
export const detectBestAudioMimeType = (): string => {
  // Check for MIME type support with fallback chain
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    return 'audio/webm';
  } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    return 'audio/webm;codecs=opus';
  } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
    return 'audio/mp4';
  } else if (MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')) {
    return 'audio/mp4;codecs=mp4a.40.2';
  } else if (MediaRecorder.isTypeSupported('audio/mpeg')) {
    return 'audio/mpeg';
  } else if (MediaRecorder.isTypeSupported('audio/wav')) {
    return 'audio/wav';
  } else {
    // Use browser default without specifying MIME type
    return '';
  }
};

/**
 * Creates MediaRecorder options with the best supported MIME type
 * @returns {MediaRecorderOptions} Options object for MediaRecorder constructor
 */
export const createMediaRecorderOptions = (): MediaRecorderOptions => {
  const mimeType = detectBestAudioMimeType();
  return mimeType ? { mimeType } : {};
};