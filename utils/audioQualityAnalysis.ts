/**
 * Complete implementation of client-side audio analysis
 */

export interface AudioAnalysisResult {
  rmsLevel: number;
  peakLevel: number;
  duration: number;
  sampleRate: number;
  qualityStatus: 'good' | 'quiet' | 'loud' | 'very_quiet' | 'clipping';
  recommendation?: string;
}

export class ClientAudioAnalyzer {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
  }

  async analyzeFile(file: File): Promise<AudioAnalysisResult> {
    if (!this.audioContext) {
      throw new Error('Web Audio API not supported');
    }

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      return this.analyzeAudioBuffer(audioBuffer);
    } catch (error) {
      console.error('Error analyzing audio file:', error);
      throw new Error('Failed to analyze audio file');
    }
  }

  private analyzeAudioBuffer(audioBuffer: AudioBuffer): AudioAnalysisResult {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    let sumSquares = 0;
    let peak = 0;

    for (let i = 0; i < channelData.length; i++) {
      const sample = channelData[i];
      sumSquares += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }

    const rms = Math.sqrt(sumSquares / channelData.length);
    const rmsLevel = rms > 0 ? 20 * Math.log10(Math.max(rms, 0.00001)) : -100;
    const peakLevel = peak > 0 ? 20 * Math.log10(Math.max(peak, 0.00001)) : -100;

    const qualityStatus = this.assessAudioQuality(rmsLevel, peakLevel);
    const recommendation = this.getRecommendation(qualityStatus);

    return {
      rmsLevel,
      peakLevel,
      duration,
      sampleRate,
      qualityStatus,
      recommendation
    };
  }

  private assessAudioQuality(rmsDb: number, peakDb: number): AudioAnalysisResult['qualityStatus'] {
    if (peakDb > -0.1) return 'clipping';
    if (rmsDb < -40) return 'very_quiet';
    if (rmsDb < -25) return 'quiet';
    if (rmsDb > -8) return 'loud';
    return 'good';
  }

  private getRecommendation(status: AudioAnalysisResult['qualityStatus']): string | undefined {
    switch (status) {
      case 'very_quiet':
        return 'Audio is very quiet and may affect analysis accuracy. Consider re-recording with higher volume.';
      case 'quiet':
        return 'Audio is quiet but should work. For better results, consider re-recording with higher volume.';
      case 'loud':
        return 'Audio levels are high but acceptable. Consider reducing input level for future recordings.';
      case 'clipping':
        return 'Audio is clipping and may cause distortion. Please re-record with lower input levels.';
      default:
        return undefined;
    }
  }

  getQualityScore(analysis: AudioAnalysisResult): number {
    switch (analysis.qualityStatus) {
      case 'good': return 100;
      case 'quiet': return 75;
      case 'loud': return 85;
      case 'very_quiet': return 40;
      case 'clipping': return 30;
      default: return 50;
    }
  }

  needsNormalization(analysis: AudioAnalysisResult): boolean {
    return analysis.qualityStatus === 'quiet' || analysis.qualityStatus === 'very_quiet';
  }

  cleanup(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const audioAnalyzer = new ClientAudioAnalyzer();
export const cleanupAudioAnalyzer = () => audioAnalyzer.cleanup();