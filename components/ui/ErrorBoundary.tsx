import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId()
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call the error callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could also send error to monitoring service
    // Example: Sentry.captureException(error);
  }

  generateErrorId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId()
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  onRetry: () => void;
  onReload: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  onRetry,
  onReload
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [reportSent, setReportSent] = React.useState(false);

  const handleSendReport = async () => {
    try {
      // Mock sending error report
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportSent(true);
    } catch (err) {
      console.error('Failed to send error report:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full"
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Oops! Something went wrong
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 text-center mb-6">
          We encountered an unexpected error while processing your request. 
          Don&apos;t worry - your data is safe and we&apos;re working to fix the issue.
        </p>

        {/* Error ID */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Error ID:</span>
              <code className="ml-2 text-sm font-mono text-gray-800">{errorId}</code>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(errorId)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <motion.button
            onClick={onRetry}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4c-3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4L17.65,6.35z"/>
            </svg>
            Try Again
          </motion.button>

          <motion.button
            onClick={onReload}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4c-3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4L17.65,6.35z"/>
            </svg>
            Reload Page
          </motion.button>
        </div>

        {/* Error Report */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Help us improve</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          </div>

          {!reportSent ? (
            <motion.button
              onClick={handleSendReport}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Send Error Report
            </motion.button>
          ) : (
            <div className="text-center text-green-600 text-sm">
              ✓ Error report sent successfully. Thank you!
            </div>
          )}

          {/* Error Details */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="space-y-4">
                {error && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Error Message:</h4>
                    <code className="text-xs bg-red-50 text-red-800 p-2 rounded block overflow-x-auto">
                      {error.message}
                    </code>
                  </div>
                )}

                {error?.stack && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Stack Trace:</h4>
                    <pre className="text-xs bg-gray-100 text-gray-800 p-2 rounded overflow-x-auto max-h-40">
                      {error.stack}
                    </pre>
                  </div>
                )}

                {errorInfo?.componentStack && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Component Stack:</h4>
                    <pre className="text-xs bg-gray-100 text-gray-800 p-2 rounded overflow-x-auto max-h-40">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Help Links */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center mb-3">
            Need help? Contact our support team:
          </p>
          <div className="flex justify-center space-x-4 text-xs">
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700">
              Email Support
            </a>
            <span className="text-gray-300">•</span>
            <a href="/help" className="text-blue-600 hover:text-blue-700">
              Help Center
            </a>
            <span className="text-gray-300">•</span>
            <a href="/status" className="text-blue-600 hover:text-blue-700">
              System Status
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Hook for handling errors in functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You can dispatch to error reporting service here
    // Example: reportError(error, errorInfo);
  };
};

export default ErrorBoundary;