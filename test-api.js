#!/usr/bin/env node

/**
 * Test script to debug the /api/audio/upload endpoint
 * Usage: node test-api.js
 */

const fs = require('fs');
const FormData = require('form-data');

// Create a simple test audio file (silence in WebM format)
function createTestAudioFile() {
  const testFile = './test-audio.webm';
  
  // Create a minimal WebM header for testing
  const webmHeader = Buffer.from([
    0x1A, 0x45, 0xDF, 0xA3, // EBML header
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, // size
    0x42, 0x86, 0x81, 0x01, // EBMLVersion
    0x42, 0xF7, 0x81, 0x01, // EBMLReadVersion  
    0x42, 0xF2, 0x81, 0x04, // EBMLMaxIDLength
    0x42, 0xF3, 0x81, 0x08, // EBMLMaxSizeLength
    0x42, 0x82, 0x88, 0x77, 0x65, 0x62, 0x6D, 0x00, // DocType: webm
    0x42, 0x87, 0x81, 0x02, // DocTypeVersion
    0x42, 0x85, 0x81, 0x02, // DocTypeReadVersion
  ]);
  
  fs.writeFileSync(testFile, webmHeader);
  return testFile;
}

async function testAPIRoute() {
  console.log('🧪 Starting API Route Test...\n');
  
  try {
    // Test 1: Simple GET request (should return 405)
    console.log('📋 Test 1: GET request (should return 405)');
    const getResponse = await fetch('http://localhost:3000/api/audio/upload', {
      method: 'GET'
    });
    console.log('✅ GET Status:', getResponse.status, getResponse.statusText);
    
    if (getResponse.status === 405) {
      console.log('✅ GET test passed - correctly returned 405\n');
    } else {
      console.log('❌ GET test failed - expected 405\n');
    }
    
    // Test 2: POST without file (should return 400)
    console.log('📋 Test 2: POST without file (should return 400)');
    const emptyFormData = new FormData();
    const emptyPostResponse = await fetch('http://localhost:3000/api/audio/upload', {
      method: 'POST',
      body: emptyFormData
    });
    console.log('✅ Empty POST Status:', emptyPostResponse.status, emptyPostResponse.statusText);
    
    // Test 3: POST with test audio file
    console.log('📋 Test 3: POST with test audio file');
    
    const testFile = createTestAudioFile();
    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(testFile), {
      filename: 'test-audio.webm',
      contentType: 'audio/webm'
    });
    
    console.log('📤 Sending file upload request...');
    
    const uploadResponse = await fetch('http://localhost:3000/api/audio/upload', {
      method: 'POST',
      headers: formData.getHeaders(), // This sets the correct multipart/form-data header
      body: formData
    });
    
    console.log('📡 Upload Status:', uploadResponse.status, uploadResponse.statusText);
    console.log('📋 Response Headers:', Object.fromEntries(uploadResponse.headers.entries()));
    
    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      console.log('✅ Upload Response:', result);
    } else {
      const errorText = await uploadResponse.text();
      console.log('❌ Upload Error:', errorText);
    }
    
    // Clean up
    fs.unlinkSync(testFile);
    console.log('🧹 Cleaned up test file');
    
  } catch (error) {
    console.error('💥 Test script error:', error);
    console.error('💥 Make sure your Next.js dev server is running on localhost:3000');
  }
}

// Test if Next.js server is running
async function checkServerRunning() {
  try {
    const response = await fetch('http://localhost:3000/api/hello');
    if (response.ok) {
      console.log('✅ Next.js server is running\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Next.js server is not running on localhost:3000');
    console.log('❌ Please start it with: npm run dev\n');
    return false;
  }
}

// Test Python backend connectivity
async function testPythonBackend() {
  console.log('🐍 Testing Python backend connectivity...');
  try {
    const response = await fetch('http://localhost:8000/health');
    if (response.ok) {
      console.log('✅ Python backend is running on localhost:8000');
      const health = await response.json();
      console.log('📋 Backend Health:', health);
    } else {
      console.log('⚠️ Python backend responded with status:', response.status);
    }
  } catch (error) {
    console.log('❌ Python backend not reachable on localhost:8000');
    console.log('❌ Error:', error.message);
  }
  console.log('');
}

// Main execution
(async () => {
  console.log('🚀 Audio Upload API Test Suite\n');
  
  const serverRunning = await checkServerRunning();
  if (!serverRunning) {
    process.exit(1);
  }
  
  await testPythonBackend();
  await testAPIRoute();
  
  console.log('🏁 Test completed!');
})();