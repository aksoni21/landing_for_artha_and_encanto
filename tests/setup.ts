/**
 * Test setup configuration for React Testing Library and Jest
 * Configures global test environment for the Ultimate Quality Audio Analysis UI components
 */

import '@testing-library/jest-dom';

// Mock ResizeObserver (used by some charting libraries)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver (used by Framer Motion)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia (used for responsive design)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock URL.createObjectURL (used for audio/file handling)
global.URL.createObjectURL = jest.fn().mockImplementation(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Canvas API (used by Chart.js)
HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Increase timeout for integration tests
jest.setTimeout(10000);

// Global test helpers
global.createMockAudioContext = () => ({
  createAnalyser: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    fftSize: 2048,
    frequencyBinCount: 1024,
    getByteFrequencyData: jest.fn(),
    getFloatFrequencyData: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    gain: { value: 1 },
  })),
  createBufferSource: jest.fn(() => ({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    buffer: null,
  })),
  decodeAudioData: jest.fn(),
  destination: {},
  sampleRate: 44100,
  currentTime: 0,
  state: 'running',
  suspend: jest.fn(),
  resume: jest.fn(),
  close: jest.fn(),
});

// Mock Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => global.createMockAudioContext());
global.webkitAudioContext = jest.fn().mockImplementation(() => global.createMockAudioContext());

// Mock File API
global.File = jest.fn().mockImplementation((chunks, filename, options) => ({
  name: filename,
  size: chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  type: options?.type || 'application/octet-stream',
  lastModified: Date.now(),
  arrayBuffer: jest.fn(),
  slice: jest.fn(),
  stream: jest.fn(),
  text: jest.fn(),
}));

global.FileReader = jest.fn().mockImplementation(() => ({
  readAsDataURL: jest.fn(),
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  result: null,
  error: null,
  readyState: 0,
}));

// Mock Blob
global.Blob = jest.fn().mockImplementation((chunks, options) => ({
  size: chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  type: options?.type || '',
  arrayBuffer: jest.fn(),
  slice: jest.fn(),
  stream: jest.fn(),
  text: jest.fn(),
}));

// Console warning suppression for known issues
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes?.('React.createFactory') ||
    args[0]?.includes?.('componentWillReceiveProps') ||
    args[0]?.includes?.('"defaultProps" is deprecated')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Error boundary for test debugging
global.TestErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return children;
  } catch (error) {
    console.error('Test Error Boundary caught:', error);
    return <div data-testid="error-boundary">Test Error: {error.message}</div>;
  }
};

export {};