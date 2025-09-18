/**
 * Assessment Test Helpers
 * Utility functions for testing assessment workflows
 */

/**
 * Mock MediaRecorder for testing audio recording
 */
export function mockMediaRecorder() {
  return `
    window.MediaRecorder = class MockMediaRecorder extends EventTarget {
      constructor(stream, options) {
        super();
        this.stream = stream;
        this.options = options;
        this.state = 'inactive';
        this.chunks = [];
      }

      start(timeslice) {
        this.state = 'recording';
        this.dispatchEvent(new Event('start'));

        // Simulate data collection
        this.interval = setInterval(() => {
          const mockData = new Blob(['mock audio data'], { type: 'audio/webm' });
          this.dispatchEvent(new CustomEvent('dataavailable', { detail: { data: mockData } }));
          this.chunks.push(mockData);
        }, timeslice || 1000);
      }

      stop() {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.state = 'inactive';
        this.dispatchEvent(new Event('stop'));
      }

      pause() {
        this.state = 'paused';
        this.dispatchEvent(new Event('pause'));
      }

      resume() {
        this.state = 'recording';
        this.dispatchEvent(new Event('resume'));
      }
    };

    navigator.mediaDevices.getUserMedia = (constraints) => {
      return Promise.resolve(new MediaStream());
    };
  `;
}

/**
 * Create mock assessment data for testing
 */
export function createMockAssessmentData(overrides = {}) {
  return {
    assessment_id: 'test-assessment-' + Math.random().toString(36).substr(2, 9),
    partner_id: 'casco_antiguo',
    student_name: 'Test Student',
    student_email: 'test@example.com',
    placement_result: {
      overall_score: 75,
      placement_level: 'Intermediate',
      description: 'Estudiante con nivel intermedio de español',
      component_scores: {
        pronunciation: 70,
        fluency: 75,
        vocabulary: 80,
        grammar: 72,
        confidence: 78
      },
      recommendations: [
        'Practicar conversaciones más complejas',
        'Estudiar gramática avanzada',
        'Enfocarse en expresiones idiomáticas'
      ]
    },
    assessment_date: new Date().toISOString(),
    partner_config: {
      name: 'Casco Antiguo Spanish School',
      branding: {
        primary_color: '#1a365d',
        secondary_color: '#2d5a87',
        accent_color: '#ed8936'
      }
    },
    audio_url: '/api/partners/casco_antiguo/audio/test-audio',
    ...overrides
  };
}

/**
 * Wait for assessment processing to complete
 */
export async function waitForAssessmentCompletion(page, timeout = 30000) {
  await page.waitForSelector('text=¡Evaluación Completada!', { timeout });
}

/**
 * Complete a full assessment recording flow
 */
export async function completeAssessmentFlow(page, options = {}) {
  const {
    studentName = 'Test Student',
    studentEmail = 'test@example.com',
    recordingDuration = 31000,
    skipSubmission = false
  } = options;

  // Fill student info
  if (studentName) {
    await page.fill('input[placeholder*="nombre"]', studentName);
  }
  if (studentEmail) {
    await page.fill('input[placeholder*="email"]', studentEmail);
  }

  // Start recording
  await page.click('button:has-text("Comenzar Grabación")');
  await page.waitForSelector('text=Grabando');

  // Wait for recording duration
  await page.waitForTimeout(recordingDuration);

  // Stop recording
  await page.click('button:has-text("Detener Grabación")');
  await page.waitForSelector('text=Revisar Grabación');

  if (!skipSubmission) {
    // Submit assessment
    await page.click('button:has-text("Enviar Evaluación")');
  }

  return {
    studentName,
    studentEmail,
    recordingDuration
  };
}

/**
 * Setup API mocks for assessment flow
 */
export function setupAssessmentApiMocks(page, options = {}) {
  const {
    shouldFailAnalysis = false,
    shouldFailConfig = false,
    customResults = null
  } = options;

  // Mock partner config API
  if (!shouldFailConfig) {
    page.route('**/api/assessment/config/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          partner_id: 'casco_antiguo',
          name: 'Casco Antiguo Spanish School',
          language: 'spanish',
          branding: {
            logo_url: '/partners/casco-antiguo/placeholder.svg',
            primary_color: '#1a365d',
            secondary_color: '#2d5a87',
            accent_color: '#ed8936'
          },
          ui_text: {
            language: 'spanish',
            welcome_title: 'Evaluación de Español',
            welcome_subtitle: 'Casco Antiguo Spanish School',
            recording_instructions: 'Habla en español sobre cualquier tema que quieras durante 30-60 segundos.',
            recording_button: 'Comenzar Grabación',
            stop_button: 'Detener Grabación',
            submit_button: 'Enviar Evaluación',
            success_message: '¡Gracias! Tu evaluación ha sido enviada exitosamente.',
            error_message: 'Lo sentimos, hubo un error. Por favor intenta de nuevo.',
            duration_warning: 'Tienes {seconds} segundos restantes'
          },
          recording_duration: {
            min_seconds: 30,
            max_seconds: 60,
            warning_at: 50
          }
        })
      });
    });
  }

  // Mock analysis API
  if (!shouldFailAnalysis) {
    page.route('**/api/partners/*/analyze', route => {
      const results = customResults || {
        assessment_id: 'test-assessment-123',
        status: 'completed',
        message: 'Assessment completed successfully',
        access_token: 'test-token-123'
      };

      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(results)
        });
      }, 2000); // Simulate processing time
    });
  } else {
    page.route('**/api/partners/*/analyze', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Analysis failed' })
      });
    });
  }

  // Mock results API
  page.route('**/api/partners/*/results/*', route => {
    const mockData = createMockAssessmentData();
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData)
    });
  });
}

/**
 * Validate assessment page elements
 */
export async function validateAssessmentPage(page, partnerId = 'casco_antiguo') {
  // Check basic page elements
  await expect(page.locator('h1')).toContainText('Evaluación de Español');
  await expect(page.locator('text=Casco Antiguo Spanish School')).toBeVisible();

  // Check form elements
  await expect(page.locator('input[placeholder*="nombre"]')).toBeVisible();
  await expect(page.locator('input[placeholder*="email"]')).toBeVisible();
  await expect(page.locator('button:has-text("Comenzar Grabación")')).toBeVisible();

  // Check instructions
  await expect(page.locator('text=Habla en español')).toBeVisible();
}

/**
 * Performance measurement helpers
 */
export class PerformanceTracker {
  constructor() {
    this.metrics = {};
  }

  start(label) {
    this.metrics[label] = { start: Date.now() };
  }

  end(label) {
    if (this.metrics[label]) {
      this.metrics[label].end = Date.now();
      this.metrics[label].duration = this.metrics[label].end - this.metrics[label].start;
    }
  }

  getDuration(label) {
    return this.metrics[label]?.duration || 0;
  }

  getAllMetrics() {
    return this.metrics;
  }
}

/**
 * Screenshot helpers for debugging failed tests
 */
export async function captureScreenshotOnFailure(page, testName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `failure-${testName}-${timestamp}.png`;
  await page.screenshot({ path: `tests/screenshots/${filename}` });
  console.log(`Screenshot saved: ${filename}`);
}