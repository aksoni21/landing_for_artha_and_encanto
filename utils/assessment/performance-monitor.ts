/**
 * Assessment Performance Monitoring Utilities
 * Track and optimize assessment workflow performance
 */

import React from 'react';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class AssessmentPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private thresholds = {
    pageLoad: 3000,        // 3 seconds
    apiResponse: 5000,     // 5 seconds
    audioProcessing: 30000, // 30 seconds
    recordingStart: 1000,  // 1 second
    submission: 10000      // 10 seconds
  };

  /**
   * Start tracking a performance metric
   */
  start(name: string, metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  /**
   * End tracking and calculate duration
   */
  end(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Check against thresholds
    this.checkThreshold(name, duration);

    return duration;
  }

  /**
   * Get metric by name
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Check if metric exceeds threshold
   */
  private checkThreshold(name: string, duration: number): void {
    const threshold = this.getThresholdForMetric(name);
    if (threshold && duration > threshold) {
      console.warn(
        `Performance warning: ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
      );

      // Send to analytics if available
      this.reportSlowMetric(name, duration, threshold);
    }
  }

  /**
   * Get threshold for specific metric type
   */
  private getThresholdForMetric(name: string): number | null {
    if (name.includes('page-load')) return this.thresholds.pageLoad;
    if (name.includes('api-')) return this.thresholds.apiResponse;
    if (name.includes('audio-processing')) return this.thresholds.audioProcessing;
    if (name.includes('recording-start')) return this.thresholds.recordingStart;
    if (name.includes('submission')) return this.thresholds.submission;

    return null;
  }

  /**
   * Report slow metrics for monitoring
   */
  private reportSlowMetric(name: string, duration: number, threshold: number): void {
    // Could integrate with analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_warning', {
        metric_name: name,
        duration_ms: Math.round(duration),
        threshold_ms: threshold,
        page_path: window.location.pathname
      });
    }
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const metrics = this.getAllMetrics();
    const completedMetrics = metrics.filter(m => m.duration !== undefined);

    if (completedMetrics.length === 0) {
      return 'No performance metrics recorded';
    }

    let report = 'Assessment Performance Report:\n';
    report += '=====================================\n';

    completedMetrics.forEach(metric => {
      const threshold = this.getThresholdForMetric(metric.name);
      const status = threshold && metric.duration! > threshold ? '⚠️  SLOW' : '✅ OK';

      report += `${metric.name}: ${metric.duration!.toFixed(2)}ms ${status}\n`;
    });

    const avgDuration = completedMetrics.reduce((sum, m) => sum + m.duration!, 0) / completedMetrics.length;
    report += `\nAverage Duration: ${avgDuration.toFixed(2)}ms\n`;

    return report;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

// Global instance
export const performanceMonitor = new AssessmentPerformanceMonitor();

/**
 * Higher-order component for automatic performance tracking
 */
export function withPerformanceTracking<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    React.useEffect(() => {
      performanceMonitor.start(`component-${componentName}-mount`);

      return () => {
        performanceMonitor.end(`component-${componentName}-mount`);
      };
    }, []);

    return React.createElement(Component, props);
  };
}

/**
 * Hook for tracking custom performance metrics
 */
export function usePerformanceTracking() {
  return {
    start: (name: string, metadata?: Record<string, any>) =>
      performanceMonitor.start(name, metadata),
    end: (name: string) =>
      performanceMonitor.end(name),
    getMetric: (name: string) =>
      performanceMonitor.getMetric(name),
    generateReport: () =>
      performanceMonitor.generateReport()
  };
}

/**
 * Track audio recording performance
 */
export function trackAudioRecording() {
  return {
    startRecording: () => {
      performanceMonitor.start('recording-start');
      performanceMonitor.start('recording-session');
    },

    recordingStarted: () => {
      performanceMonitor.end('recording-start');
    },

    stopRecording: () => {
      performanceMonitor.end('recording-session');
      performanceMonitor.start('audio-processing');
    },

    processingComplete: () => {
      performanceMonitor.end('audio-processing');
    },

    submissionStart: () => {
      performanceMonitor.start('submission');
    },

    submissionComplete: () => {
      performanceMonitor.end('submission');
    }
  };
}

/**
 * Track API call performance
 */
export async function trackApiCall<T>(
  name: string,
  apiCall: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  performanceMonitor.start(`api-${name}`, metadata);

  try {
    const result = await apiCall();
    performanceMonitor.end(`api-${name}`);
    return result;
  } catch (error) {
    performanceMonitor.end(`api-${name}`);
    throw error;
  }
}

/**
 * Web Vitals tracking for assessment pages
 */
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals (commented out - requires web-vitals package)
  // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
  //   getCLS(console.log);
  //   getFID(console.log);
  //   getFCP(console.log);
  //   getLCP(console.log);
  //   getTTFB(console.log);
  // }).catch(() => {
  //   // web-vitals not available, continue without it
  // });
}

export default performanceMonitor;