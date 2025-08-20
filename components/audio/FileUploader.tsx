import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { audioAnalysisConfig } from '../../config/audio-analysis.config';
import { audioAnalyzer, AudioAnalysisResult } from '../../utils/audioQualityAnalysis';

interface FileUploaderProps {
  onFileSelect: (file: File, audioUrl: string) => void;
  className?: string;
}

interface UploadedFile {
  file: File;
  url: string;
  duration: number | null;
  size: string;
  error?: string;
  qualityAnalysis?: AudioAnalysisResult;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  className = '',
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    const maxSizeBytes = audioAnalysisConfig.upload.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${audioAnalysisConfig.upload.maxFileSizeMB}MB limit`
      };
    }

    // Check file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !audioAnalysisConfig.upload.supportedFormats.includes(fileExtension)) {
      return {
        valid: false,
        error: `Unsupported format. Supported: ${audioAnalysisConfig.upload.supportedFormats.join(', ')}`
      };
    }

    return { valid: true };
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load audio metadata'));
      });
      
      audio.src = url;
    });
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);

    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setUploadedFile({
          file,
          url: '',
          duration: null,
          size: formatFileSize(file.size),
          error: validation.error
        });
        toast.error(validation.error!);
        return;
      }

      // Get audio duration
      let duration: number | null = null;
      try {
        duration = await getAudioDuration(file);
        
        // Check duration limit
        if (duration > audioAnalysisConfig.upload.maxDurationMinutes * 60) {
          throw new Error(`Duration exceeds ${audioAnalysisConfig.upload.maxDurationMinutes} minute limit`);
        }
      } catch (error) {
        console.warn('Could not get audio duration:', error);
        // Continue without duration - not critical
      }

      // Create object URL for preview
      const url = URL.createObjectURL(file);

      // Analyze audio quality
      let qualityAnalysis: AudioAnalysisResult | undefined;
      try {
        qualityAnalysis = await audioAnalyzer.analyzeFile(file);
        
        // Show quality feedback based on analysis
        if (qualityAnalysis.qualityStatus === 'good') {
          toast.success(`✅ Audio quality is good!`);
        } else if (qualityAnalysis.qualityStatus === 'clipping') {
          toast.error(`❌ Warning: Audio is clipping. Consider re-recording with lower levels.`, {
            duration: 6000
          });
        } else if (qualityAnalysis.qualityStatus === 'very_quiet') {
          toast(`⚠️ Audio is very quiet. The system will try to normalize it during processing.`, {
            icon: '⚠️',
            duration: 5000
          });
        } else if (qualityAnalysis.qualityStatus === 'quiet') {
          toast(`⚠️ Audio is quiet but should work. Consider re-recording with higher volume for best results.`, {
            icon: '⚠️',
            duration: 5000
          });
        }
      } catch (error) {
        console.warn('Audio quality analysis failed:', error);
        // Continue without quality analysis - not critical for upload
      }

      const processedFile: UploadedFile = {
        file,
        url,
        duration,
        size: formatFileSize(file.size),
        qualityAnalysis
      };

      setUploadedFile(processedFile);
      onFileSelect(file, url);
      
      toast.success(`File uploaded: ${file.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUploadedFile({
        file,
        url: '',
        duration: null,
        size: formatFileSize(file.size),
        error: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await processFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'audio/*': audioAnalysisConfig.upload.supportedFormats.map(ext => `.${ext}`)
    },
    multiple: false,
    maxSize: audioAnalysisConfig.upload.maxFileSizeMB * 1024 * 1024
  });

  const removeFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Audio File</h3>
        <p className="text-sm text-gray-600">
          Drag and drop an audio file or click to browse
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive && !isDragReject
            ? 'border-blue-400 bg-blue-50'
            : isDragReject
            ? 'border-red-400 bg-red-50'
            : uploadedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing file...</p>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-4"
            >
              {uploadedFile.error ? (
                <div className="text-center">
                  <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <h4 className="text-lg font-semibold text-red-600 mb-2">Upload Error</h4>
                  <p className="text-red-600 mb-4">{uploadedFile.error}</p>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </motion.button>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                  <h4 className="text-lg font-semibold text-green-600 mb-2">File Uploaded</h4>
                  <p className="text-gray-700 font-medium mb-2">{uploadedFile.file.name}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Size: {uploadedFile.size}</p>
                    {uploadedFile.duration && (
                      <p>Duration: {formatDuration(uploadedFile.duration)}</p>
                    )}
                  </div>
                  
                  {/* Smart Quality Status Card */}
                  {uploadedFile.qualityAnalysis && (
                    <div className="mt-4 space-y-3">
                      {/* Main Status Card */}
                      <div className={`p-4 rounded-lg border-l-4 ${
                        uploadedFile.qualityAnalysis.qualityStatus === 'good' ? 'bg-green-50 border-green-400' :
                        uploadedFile.qualityAnalysis.qualityStatus === 'clipping' ? 'bg-red-50 border-red-400' :
                        'bg-yellow-50 border-yellow-400'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className={`text-sm font-semibold ${
                              uploadedFile.qualityAnalysis.qualityStatus === 'good' ? 'text-green-800' :
                              uploadedFile.qualityAnalysis.qualityStatus === 'clipping' ? 'text-red-800' :
                              'text-yellow-800'
                            }`}>
                              {uploadedFile.qualityAnalysis.qualityStatus === 'good' ? '✨ Perfect Audio Quality' :
                               uploadedFile.qualityAnalysis.qualityStatus === 'clipping' ? '⚠️ Audio Issue Detected' :
                               uploadedFile.qualityAnalysis.qualityStatus === 'very_quiet' ? '🔊 Audio Volume Low' :
                               '🔊 Audio Volume Could Be Better'}
                            </div>
                            <div className={`text-xs mt-1 ${
                              uploadedFile.qualityAnalysis.qualityStatus === 'good' ? 'text-green-700' :
                              uploadedFile.qualityAnalysis.qualityStatus === 'clipping' ? 'text-red-700' :
                              'text-yellow-700'
                            }`}>
                              {uploadedFile.qualityAnalysis.qualityStatus === 'good' ? 
                                'Your audio is at optimal levels for analysis' :
                                uploadedFile.qualityAnalysis.qualityStatus === 'clipping' ?
                                'Audio distortion detected - may affect results' :
                                `Audio is ${uploadedFile.qualityAnalysis.qualityStatus.replace('_', ' ')} (${uploadedFile.qualityAnalysis.rmsLevel.toFixed(0)}dB)`}
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            uploadedFile.qualityAnalysis.qualityStatus === 'good' ? 'bg-green-100 text-green-800' :
                            uploadedFile.qualityAnalysis.qualityStatus === 'clipping' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {uploadedFile.qualityAnalysis.qualityStatus === 'good' ? 'READY' :
                             uploadedFile.qualityAnalysis.qualityStatus === 'clipping' ? 'NEEDS ATTENTION' :
                             'WILL FIX'}
                          </div>
                        </div>
                      </div>

                      {/* Auto-Fix Notice for Quiet Audio */}
                      {(uploadedFile.qualityAnalysis.qualityStatus === 'very_quiet' || uploadedFile.qualityAnalysis.qualityStatus === 'quiet') && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-blue-800 text-sm font-medium">
                            <span className="text-base">🤖</span>
                            AI Auto-Enhancement Enabled
                          </div>
                          <div className="text-blue-700 text-xs mt-1">
                            Don't worry! Our system will automatically boost your audio during processing for optimal analysis results.
                          </div>
                        </div>
                      )}

                      {/* Action Required for Clipping */}
                      {uploadedFile.qualityAnalysis.qualityStatus === 'clipping' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-red-800 text-sm font-medium">
                            <span className="text-base">⚠️</span>
                            Action Recommended
                          </div>
                          <div className="text-red-700 text-xs mt-1">
                            For best results, consider re-recording with lower input levels to avoid distortion.
                          </div>
                        </div>
                      )}

                      {/* Technical Details (Collapsible) */}
                      <details className="text-xs text-gray-600">
                        <summary className="cursor-pointer hover:text-gray-800 font-medium">
                          📊 Technical Details
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
                          <div>RMS Level: {uploadedFile.qualityAnalysis.rmsLevel.toFixed(1)}dB</div>
                          <div>Peak Level: {uploadedFile.qualityAnalysis.peakLevel.toFixed(1)}dB</div>
                          <div>Optimal Range: -25 to -8 dB RMS</div>
                        </div>
                      </details>
                    </div>
                  )}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove File
                  </motion.button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <svg
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDragActive && !isDragReject ? 'text-blue-500' : 'text-gray-400'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              <p className={`text-lg font-semibold mb-2 ${
                isDragActive && !isDragReject ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {isDragActive && !isDragReject
                  ? 'Drop your audio file here'
                  : isDragReject
                  ? 'Invalid file type'
                  : 'Upload Audio File'
                }
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {isDragReject
                  ? `Supported formats: ${audioAnalysisConfig.upload.supportedFormats.join(', ')}`
                  : 'or click to browse your computer'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Requirements */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">File Requirements:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Supported formats: {audioAnalysisConfig.upload.supportedFormats.join(', ')}</li>
          <li>• Maximum size: {audioAnalysisConfig.upload.maxFileSizeMB}MB</li>
          <li>• Maximum duration: {audioAnalysisConfig.upload.maxDurationMinutes} minutes</li>
          <li>• For best results, use clear audio with minimal background noise</li>
        </ul>
      </div>

      {/* Upload Tips */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">💡 Tips for Better Analysis:</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Record in a quiet environment</li>
          <li>• Use a good quality microphone if possible</li>
          <li>• Include varied sentence structures for comprehensive analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;