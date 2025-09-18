/**
 * End-to-End Assessment Workflow Tests
 * Tests the complete flow from student recording to staff email notification
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.TEST_API_URL || 'http://localhost:8000',
  partnerId: 'casco_antiguo',
  subdomain: 'casco-antiguo',
  testEmail: 'test@cascoantiguospanish.com'
};

test.describe('Casco Antiguo Assessment Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test environment
    await page.goto(`${TEST_CONFIG.baseUrl}/assessment/${TEST_CONFIG.partnerId}`);
  });

  test('Complete student assessment flow', async ({ page }) => {
    // 1. Landing page loads correctly
    await expect(page.locator('h1')).toContainText('Evaluación de Español');
    await expect(page.locator('text=Casco Antiguo Spanish School')).toBeVisible();

    // 2. Student can enter optional information
    await page.fill('input[placeholder*="nombre"]', 'Juan Pérez');
    await page.fill('input[placeholder*="email"]', 'juan.perez@email.com');

    // 3. Recording functionality works
    await page.click('button:has-text("Comenzar Grabación")');

    // Wait for recording to start
    await expect(page.locator('text=Grabando')).toBeVisible();
    await expect(page.locator('.animate-pulse')).toBeVisible();

    // Simulate recording for minimum duration (30 seconds)
    await page.waitForTimeout(31000);

    // 4. Stop recording
    await page.click('button:has-text("Detener Grabación")');

    // 5. Preview and validation
    await expect(page.locator('text=Revisar Grabación')).toBeVisible();
    await expect(page.locator('audio')).toBeVisible();
    await expect(page.locator('text=Válida')).toBeVisible();

    // 6. Submit assessment
    await page.click('button:has-text("Enviar Evaluación")');

    // 7. Processing state
    await expect(page.locator('text=Procesando Evaluación')).toBeVisible();

    // 8. Success state
    await expect(page.locator('text=¡Evaluación Completada!')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=La escuela recibirá un correo')).toBeVisible();
  });

  test('Recording validation works correctly', async ({ page }) => {
    // Start recording
    await page.click('button:has-text("Comenzar Grabación")');

    // Stop recording too early (less than 30 seconds)
    await page.waitForTimeout(15000);
    await page.click('button:has-text("Detener Grabación")');

    // Should show validation error
    await expect(page.locator('text=Muy corta')).toBeVisible();
    await expect(page.locator('text=debe ser de al menos')).toBeVisible();

    // Submit button should be disabled
    await expect(page.locator('button:has-text("Enviar Evaluación")')).toBeDisabled();
  });

  test('Maximum duration enforcement', async ({ page }) => {
    // Start recording
    await page.click('button:has-text("Comenzar Grabación")');

    // Wait for warning (at 50 seconds)
    await page.waitForTimeout(50000);
    await expect(page.locator('text=segundos restantes')).toBeVisible();

    // Wait for auto-stop (at 60 seconds)
    await page.waitForTimeout(11000);
    await expect(page.locator('text=Revisar Grabación')).toBeVisible();
  });

  test('Retry functionality works', async ({ page }) => {
    // Complete a recording
    await page.click('button:has-text("Comenzar Grabación")');
    await page.waitForTimeout(31000);
    await page.click('button:has-text("Detener Grabación")');

    // Click retry
    await page.click('button:has-text("Grabar de Nuevo")');

    // Should be back to welcome screen
    await expect(page.locator('h2:has-text("Evaluación de Español")')).toBeVisible();
    await expect(page.locator('button:has-text("Comenzar Grabación")')).toBeVisible();
  });

  test('Subdomain routing works', async ({ page }) => {
    // Test subdomain simulation (for local development)
    await page.goto(`${TEST_CONFIG.baseUrl}?subdomain=${TEST_CONFIG.subdomain}`);

    // Should redirect to assessment page
    expect(page.url()).toContain(`/assessment/${TEST_CONFIG.partnerId}`);
    await expect(page.locator('text=Evaluación de Español')).toBeVisible();
  });

  test('Error handling works', async ({ page }) => {
    // Mock API failure
    await page.route(`**/api/partners/${TEST_CONFIG.partnerId}/analyze`, route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    // Complete recording flow
    await page.fill('input[placeholder*="nombre"]', 'Test User');
    await page.click('button:has-text("Comenzar Grabación")');
    await page.waitForTimeout(31000);
    await page.click('button:has-text("Detener Grabación")');
    await page.click('button:has-text("Enviar Evaluación")');

    // Should show error state
    await expect(page.locator('text=Error')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Intentar de Nuevo")')).toBeVisible();
  });
});

test.describe('Assessment Results Viewing', () => {
  const mockToken = 'test-token-123456789';
  const mockResultsData = {
    assessment_id: 'test-assessment-id',
    partner_id: 'casco_antiguo',
    student_name: 'Juan Pérez',
    student_email: 'juan.perez@email.com',
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
    audio_url: `/api/partners/casco_antiguo/audio/test-assessment-id`
  };

  test.beforeEach(async ({ page }) => {
    // Mock the results API
    await page.route(`**/api/partners/casco_antiguo/results/${mockToken}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResultsData)
      });
    });
  });

  test('Staff can view assessment results with valid token', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseUrl}/assessment/results/${mockToken}`);

    // Check results display
    await expect(page.locator('text=Assessment Results')).toBeVisible();
    await expect(page.locator('text=Juan Pérez')).toBeVisible();
    await expect(page.locator('text=75')).toBeVisible(); // Overall score
    await expect(page.locator('text=Intermediate')).toBeVisible();

    // Check component scores
    await expect(page.locator('text=70')).toBeVisible(); // Pronunciation
    await expect(page.locator('text=75')).toBeVisible(); // Fluency
    await expect(page.locator('text=80')).toBeVisible(); // Vocabulary

    // Check recommendations
    await expect(page.locator('text=Practicar conversaciones más complejas')).toBeVisible();
  });

  test('Invalid token shows error', async ({ page }) => {
    // Override mock to return 401
    await page.route('**/api/partners/*/results/*', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid token' })
      });
    });

    await page.goto(`${TEST_CONFIG.baseUrl}/assessment/results/invalid-token`);

    await expect(page.locator('text=Access Denied')).toBeVisible();
    await expect(page.locator('text=Invalid or expired access token')).toBeVisible();
  });

  test('Audio playback controls work', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseUrl}/assessment/results/${mockToken}`);

    // Check audio controls
    await expect(page.locator('button:has([data-testid="play-icon"])')).toBeVisible();
    await expect(page.locator('button:has([data-testid="download-icon"])')).toBeVisible();

    // Mock audio element
    await page.addInitScript(() => {
      window.HTMLAudioElement.prototype.play = () => Promise.resolve();
      window.HTMLAudioElement.prototype.pause = () => {};
    });

    // Test play button
    await page.click('button:has([data-testid="play-icon"])');
    // Should change to pause icon (implementation dependent)
  });
});

// API Integration Tests
test.describe('API Integration', () => {
  test('Partner config API works', async ({ request }) => {
    const response = await request.get(`${TEST_CONFIG.baseUrl}/api/assessment/config/${TEST_CONFIG.partnerId}`);

    expect(response.status()).toBe(200);

    const config = await response.json();
    expect(config.partner_id).toBe(TEST_CONFIG.partnerId);
    expect(config.name).toBe('Casco Antiguo Spanish School');
    expect(config.language).toBe('spanish');
  });

  test('Invalid partner returns 404', async ({ request }) => {
    const response = await request.get(`${TEST_CONFIG.baseUrl}/api/assessment/config/invalid-partner`);
    expect(response.status()).toBe(404);
  });
});

// Performance Tests
test.describe('Performance', () => {
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(`${TEST_CONFIG.baseUrl}/assessment/${TEST_CONFIG.partnerId}`);
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('Assessment submission performance', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseUrl}/assessment/${TEST_CONFIG.partnerId}`);

    // Mock quick recording
    await page.evaluate(() => {
      // Mock MediaRecorder for testing
      window.MediaRecorder = class MockMediaRecorder {
        constructor() {
          this.state = 'inactive';
        }
        start() {
          this.state = 'recording';
          setTimeout(() => {
            this.ondataavailable({ data: new Blob(['test'], { type: 'audio/wav' }) });
            this.onstop();
          }, 100);
        }
        stop() {
          this.state = 'inactive';
        }
      };

      navigator.mediaDevices.getUserMedia = () =>
        Promise.resolve(new MediaStream());
    });

    const startTime = Date.now();

    // Submit assessment
    await page.click('button:has-text("Comenzar Grabación")');
    await page.waitForTimeout(100);
    await page.click('button:has-text("Detener Grabación")');
    await page.click('button:has-text("Enviar Evaluación")');

    // Wait for completion
    await expect(page.locator('text=¡Evaluación Completada!')).toBeVisible({ timeout: 30000 });

    const submissionTime = Date.now() - startTime;

    // Should complete within 30 seconds
    expect(submissionTime).toBeLessThan(30000);
  });
});