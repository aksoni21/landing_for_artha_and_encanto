#!/usr/bin/env node

/**
 * Assessment Test Runner
 * Runs comprehensive tests for assessment functionality
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.TEST_API_URL || 'http://localhost:8000',
  headless: process.env.TEST_HEADLESS !== 'false',
  browser: process.env.TEST_BROWSER || 'chromium',
  timeout: parseInt(process.env.TEST_TIMEOUT) || 60000,
  retries: parseInt(process.env.TEST_RETRIES) || 2,
  parallel: parseInt(process.env.TEST_PARALLEL) || 1
};

// Test suites
const TEST_SUITES = {
  unit: {
    description: 'Unit tests for assessment components',
    command: 'npm',
    args: ['run', 'test:unit:assessment']
  },
  integration: {
    description: 'Integration tests for assessment APIs',
    command: 'npm',
    args: ['run', 'test:integration:assessment']
  },
  e2e: {
    description: 'End-to-end assessment workflow tests',
    command: 'npx',
    args: [
      'playwright', 'test',
      'tests/assessment/e2e-workflow.test.js',
      '--config=tests/assessment/playwright.config.js',
      `--timeout=${TEST_CONFIG.timeout}`,
      `--retries=${TEST_CONFIG.retries}`,
      `--workers=${TEST_CONFIG.parallel}`,
      TEST_CONFIG.headless ? '--headed=false' : '--headed=true'
    ]
  },
  performance: {
    description: 'Performance tests for assessment pages',
    command: 'npx',
    args: [
      'lighthouse',
      `${TEST_CONFIG.baseUrl}/assessment/casco_antiguo`,
      '--output=json',
      '--output-path=./reports/assessment-lighthouse.json',
      '--preset=desktop',
      '--throttling.cpuSlowdownMultiplier=1',
      '--throttling.requestLatencyMs=0',
      '--throttling.downloadThroughputKbps=0',
      '--throttling.uploadThroughputKbps=0'
    ]
  },
  accessibility: {
    description: 'Accessibility tests for assessment interface',
    command: 'npx',
    args: [
      'axe-core',
      `${TEST_CONFIG.baseUrl}/assessment/casco_antiguo`,
      '--output=./reports/assessment-a11y.json'
    ]
  }
};

// Results tracking
let results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

/**
 * Run a single test suite
 */
async function runTestSuite(name, suite) {
  console.log(`\n🚀 Running ${suite.description}...`);
  console.log(`Command: ${suite.command} ${suite.args.join(' ')}`);

  return new Promise((resolve) => {
    const startTime = Date.now();
    const child = spawn(suite.command, suite.args, {
      stdio: 'pipe',
      env: {
        ...process.env,
        ...TEST_CONFIG
      }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      const success = code === 0;

      const result = {
        suite: name,
        description: suite.description,
        success,
        code,
        duration,
        stdout,
        stderr
      };

      if (success) {
        console.log(`✅ ${suite.description} passed (${duration}ms)`);
        results.passed++;
      } else {
        console.log(`❌ ${suite.description} failed (${duration}ms)`);
        results.failed++;
      }

      results.details.push(result);
      resolve(result);
    });
  });
}

/**
 * Setup test environment
 */
async function setupTestEnvironment() {
  console.log('🔧 Setting up test environment...');

  // Create reports directory
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Create screenshots directory
  const screenshotsDir = path.join(process.cwd(), 'tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Check if services are running
  try {
    const fetch = (await import('node-fetch')).default;

    // Check frontend
    await fetch(TEST_CONFIG.baseUrl);
    console.log(`✅ Frontend service running at ${TEST_CONFIG.baseUrl}`);

    // Check backend API
    await fetch(`${TEST_CONFIG.apiUrl}/health`);
    console.log(`✅ Backend API running at ${TEST_CONFIG.apiUrl}`);
  } catch (error) {
    console.warn(`⚠️  Service check failed: ${error.message}`);
    console.warn('Some tests may fail if services are not running');
  }
}

/**
 * Generate test report
 */
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      baseUrl: TEST_CONFIG.baseUrl,
      apiUrl: TEST_CONFIG.apiUrl,
      browser: TEST_CONFIG.browser,
      node: process.version
    },
    summary: {
      total: results.passed + results.failed + results.skipped,
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      passRate: Math.round((results.passed / (results.passed + results.failed)) * 100) || 0
    },
    suites: results.details
  };

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'reports/assessment-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Generate summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`Total Suites: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed} ✅`);
  console.log(`Failed: ${report.summary.failed} ❌`);
  console.log(`Skipped: ${report.summary.skipped} ⏭️`);
  console.log(`Pass Rate: ${report.summary.passRate}%`);
  console.log(`\nDetailed report: ${reportPath}`);

  return report;
}

/**
 * Main test runner
 */
async function main() {
  const args = process.argv.slice(2);
  const suitesToRun = args.length > 0 ? args : Object.keys(TEST_SUITES);

  console.log('🧪 Assessment Test Runner');
  console.log('=========================');
  console.log(`Running suites: ${suitesToRun.join(', ')}`);
  console.log(`Configuration: ${JSON.stringify(TEST_CONFIG, null, 2)}`);

  try {
    await setupTestEnvironment();

    // Run test suites
    for (const suiteName of suitesToRun) {
      if (!TEST_SUITES[suiteName]) {
        console.warn(`⚠️  Unknown test suite: ${suiteName}`);
        results.skipped++;
        continue;
      }

      await runTestSuite(suiteName, TEST_SUITES[suiteName]);
    }

    // Generate report
    const report = generateReport();

    // Exit with appropriate code
    process.exit(report.summary.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Test runner interrupted');
  generateReport();
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runTestSuite,
  generateReport,
  TEST_SUITES,
  TEST_CONFIG
};