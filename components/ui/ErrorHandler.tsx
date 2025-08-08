import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export type ErrorType = 
  | 'network'
  | 'validation' 
  | 'permission'
  | 'upload'
  | 'processing'
  | 'authentication'
  | 'quota'
  | 'server'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string | number;
  retryable?: boolean;
  actions?: ErrorAction[];
}

export interface ErrorAction {
  label: string;
  action: () => void;
  primary?: boolean;
  destructive?: boolean;
}

interface ErrorHandlerProps {
  error: AppError | null;
  onDismiss: () => void;
  onRetry?: () => void;
  className?: string;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  onDismiss,
  onRetry,
  className = '',
}) => {
  if (!error) return null;

  const getErrorIcon = (type: ErrorType) => {
    const iconMap = {
      network: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
        </svg>
      ),
      validation: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
      ),
      permission: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      ),
      upload: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          <path d="M12 14l4-4h-3V7h-2v3H8l4 4z"/>
        </svg>
      ),
      processing: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,4A8,8 0 0,1 20,12C20,16.42 16.42,20 12,20A8,8 0 0,1 4,12C4,7.58 7.58,4 12,4M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          <path d="M12,6V12L16.5,16.5"/>
        </svg>
      ),
      authentication: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7M12 17.5C9.97 17.5 8.25 16.22 7.5 14.4C7.5 12.6 11.5 11.7 12 11.7C12.5 11.7 16.5 12.6 16.5 14.4C15.75 16.22 14.03 17.5 12 17.5Z"/>
        </svg>
      ),
      quota: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
      ),
      server: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M5,2V6H7V2H5M5,10V14H7V10H5M5,18V22H7V18H5M9,2V6H19V2H9M9,10V14H19V10H9M9,18V22H19V18H9Z"/>
        </svg>
      ),
      unknown: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
      ),
    };

    return iconMap[type] || iconMap.unknown;
  };

  const getErrorColor = (type: ErrorType) => {
    const colorMap = {
      network: 'text-orange-600',
      validation: 'text-yellow-600',
      permission: 'text-purple-600',
      upload: 'text-blue-600',
      processing: 'text-indigo-600',
      authentication: 'text-red-600',
      quota: 'text-pink-600',
      server: 'text-gray-600',
      unknown: 'text-red-600',
    };

    return colorMap[type] || colorMap.unknown;
  };

  const getErrorTitle = (type: ErrorType) => {
    const titleMap = {
      network: 'Connection Problem',
      validation: 'Invalid Input',
      permission: 'Permission Denied',
      upload: 'Upload Failed',
      processing: 'Processing Error',
      authentication: 'Authentication Required',
      quota: 'Quota Exceeded',
      server: 'Server Error',
      unknown: 'Unexpected Error',
    };

    return titleMap[type] || titleMap.unknown;
  };

  const getErrorSuggestions = (type: ErrorType) => {
    const suggestionMap = {
      network: [
        'Check your internet connection',
        'Try refreshing the page',
        'Disable VPN if active',
        'Clear browser cache'
      ],
      validation: [
        'Check your input format',
        'Ensure all required fields are filled',
        'Remove special characters if not allowed',
        'Check file size and format requirements'
      ],
      permission: [
        'Allow microphone access in browser settings',
        'Check browser permissions',
        'Try using a different browser',
        'Ensure HTTPS connection'
      ],
      upload: [
        'Check file size (max 50MB)',
        'Ensure supported format (MP3, WAV, etc.)',
        'Try a different file',
        'Check internet connection'
      ],
      processing: [
        'Try again in a moment',
        'Check if audio is clear',
        'Ensure sufficient audio length',
        'Contact support if issue persists'
      ],
      authentication: [
        'Log in to your account',
        'Clear browser cookies',
        'Try logging out and back in',
        'Reset your password if needed'
      ],
      quota: [
        'Upgrade your plan for more usage',
        'Wait until quota resets',
        'Delete old files to free up space',
        'Contact support for assistance'
      ],
      server: [
        'Our team has been notified',
        'Try again in a few minutes',
        'Check our status page',
        'Contact support if urgent'
      ],
      unknown: [
        'Try refreshing the page',
        'Clear browser cache',
        'Try a different browser',
        'Contact support with error details'
      ],
    };

    return suggestionMap[type] || suggestionMap.unknown;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Error Icon and Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`${getErrorColor(error.type)} flex-shrink-0`}>
              {getErrorIcon(error.type)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {getErrorTitle(error.type)}
              </h3>
              {error.code && (
                <span className="text-sm text-gray-500">
                  Code: {error.code}
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2">{error.message}</p>
            {error.details && (
              <p className="text-sm text-gray-500">{error.details}</p>
            )}
          </div>

          {/* Suggestions */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">What you can try:</h4>
            <ul className="space-y-2">
              {getErrorSuggestions(error.type).map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Custom Actions */}
            {error.actions && error.actions.length > 0 && (
              <div className="space-y-2">
                {error.actions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                      action.primary
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : action.destructive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Default Actions */}
            <div className="grid grid-cols-2 gap-3">
              {error.retryable && onRetry && (
                <motion.button
                  onClick={onRetry}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4c-3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4L17.65,6.35z"/>
                  </svg>
                  Retry
                </motion.button>
              )}
              
              <motion.button
                onClick={onDismiss}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Dismiss
              </motion.button>
            </div>
          </div>

          {/* Help Link */}
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-gray-500 mb-2">
              Still having trouble?
            </p>
            <a
              href="/support"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Utility functions for common error scenarios
export const createError = (type: ErrorType, message: string, options?: Partial<AppError>): AppError => ({
  type,
  message,
  retryable: true,
  ...options,
});

export const handleNetworkError = (error: unknown): AppError => {
  if (!navigator.onLine) {
    return createError('network', 'You appear to be offline. Please check your internet connection.');
  }
  
  return createError('network', 'Network request failed. Please try again.', {
    details: error instanceof Error ? error.message : 'Unknown network error',
    retryable: true
  });
};

export const handleValidationError = (message: string, field?: string): AppError => {
  return createError('validation', message, {
    details: field ? `Field: ${field}` : undefined,
    retryable: false
  });
};

export const handlePermissionError = (permission: string): AppError => {
  return createError('permission', `${permission} permission is required to continue.`, {
    retryable: true,
    actions: [
      {
        label: 'Grant Permission',
        action: () => {
          // Trigger permission request
          if (permission === 'microphone') {
            navigator.mediaDevices.getUserMedia({ audio: true });
          }
        },
        primary: true
      }
    ]
  });
};

export const handleUploadError = (error: unknown, fileSize?: number, maxSize?: number): AppError => {
  if (fileSize && maxSize && fileSize > maxSize) {
    return createError('upload', 'File is too large for upload.', {
      details: `File size: ${Math.round(fileSize / 1024 / 1024)}MB, Max: ${Math.round(maxSize / 1024 / 1024)}MB`,
      retryable: false
    });
  }
  
  return createError('upload', 'File upload failed. Please try again.', {
    details: error instanceof Error ? error.message : 'Unknown upload error',
    retryable: true
  });
};

// Toast notifications for less critical errors
export const showErrorToast = (error: AppError) => {
  toast.error(error.message, {
    duration: 5000,
    position: 'top-center',
    style: {
      background: '#FEF2F2',
      color: '#DC2626',
      border: '1px solid #FECACA',
    },
  });
};

export default ErrorHandler;