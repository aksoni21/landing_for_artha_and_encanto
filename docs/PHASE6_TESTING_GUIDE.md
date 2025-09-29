# Phase 6: Frontend Testing Guide

## 📋 Overview
This guide provides step-by-step instructions to test all Phase 6 frontend components for the ESL/EFL Audio Analysis application.

## 🚀 Prerequisites

### 1. Install Dependencies
```bash
cd face-landing
npm install

# Install additional dependencies for audio proxy routes
npm install formidable node-fetch form-data
npm install --save-dev @types/formidable
```

### 2. Environment Variables
**No frontend environment variables needed!** 

The frontend uses secure API proxy routes that connect to your Python backend server-side.

If your Python backend isn't running on `localhost:8000`, update your existing `.env.local`:
```env
# Only needed if Python backend runs on different port/host
BACKEND_URL=http://localhost:8000
```

**🏗️ Architecture Note**: Frontend → `/api/audio/*` proxy routes → Python backend (Phase 4/5). All secure server-side!

### 3. Start the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

---

## 🧪 Component Testing Steps

### 1. **Audio Recording Interface** (`AudioRecorder.tsx`)

#### Steps to Test:
1. Navigate to `http://localhost:3000/audio-analysis`
2. Look for the **Audio Recorder** component on the left side
3. **Test Permission Flow:**
   - Click "Start Recording" button
   - Browser should prompt for microphone permission
   - Grant permission and verify the status message updates
4. **Test Recording:**
   - Click "Start Recording" again
   - Verify the following:
     - Red recording indicator appears
     - Timer starts counting
     - Audio level visualization shows your voice level
     - Microphone icon pulses
5. **Test Pause/Resume:**
   - While recording, click "Pause" button
   - Verify timer stops and status shows "Recording paused"
   - Click "Resume" and verify recording continues
6. **Test Stop:**
   - Click "Stop" button
   - Verify recording completes and success message appears
7. **Test Maximum Duration:**
   - Start a new recording
   - Let it run for 15+ minutes (or modify `maxDuration` prop to test faster)
   - Verify automatic stop at max duration

#### Expected Results:
- ✅ Microphone permission request works
- ✅ Visual feedback during recording (pulse animation, level meter)
- ✅ Timer displays correctly
- ✅ Pause/Resume functionality works
- ✅ Audio level responds to voice input
- ✅ Recording stops at maximum duration

---

### 2. **File Upload Component** (`FileUploader.tsx`)

#### Steps to Test:
1. Look for the **Upload Audio File** component on the right side
2. **Test Drag and Drop:**
   - Drag an audio file (MP3, WAV, etc.) onto the upload area
   - Verify the area highlights when hovering
   - Drop the file and verify upload success
3. **Test Click to Browse:**
   - Click the upload area
   - Select an audio file from your computer
   - Verify file uploads successfully
4. **Test File Validation:**
   - Try uploading a non-audio file (e.g., PDF)
   - Verify error message appears
   - Try uploading a file larger than 50MB
   - Verify size error appears
5. **Test File Display:**
   - After successful upload, verify:
     - File name is displayed
     - File size is shown
     - Duration is calculated (if available)
6. **Test Remove File:**
   - Click "Remove File" button
   - Verify file is removed and upload area resets

#### Expected Results:
- ✅ Drag and drop works smoothly
- ✅ File validation catches invalid formats
- ✅ Size validation works (50MB limit)
- ✅ File metadata displays correctly
- ✅ Error messages are clear and helpful

---

### 3. **Audio Preview & Playback** (`AudioPreview.tsx`)

#### Steps to Test:
1. Upload an audio file or complete a recording
2. **Test Playback Controls:**
   - Click the play button
   - Verify audio plays
   - Click pause and verify audio pauses
3. **Test Seek Functionality:**
   - Click on different positions in the progress bar
   - Verify audio jumps to clicked position
4. **Test Skip Controls:**
   - Click "Skip backward 10s" button
   - Verify audio rewinds 10 seconds
   - Click "Skip forward 10s" button
   - Verify audio advances 10 seconds
5. **Test Volume Control:**
   - Adjust the volume slider
   - Verify volume changes accordingly
   - Mute and unmute using volume control
6. **Test Waveform Visualization:**
   - Verify animated waveform displays during playback
   - Check that progress indicator moves with playback
7. **Test Action Buttons:**
   - Click "Start Analysis" button
   - Verify analysis begins
   - Click "Remove" button
   - Verify audio is removed

#### Expected Results:
- ✅ Play/Pause works correctly
- ✅ Seek bar allows jumping to any position
- ✅ Skip forward/backward works (±10 seconds)
- ✅ Volume control adjusts audio level
- ✅ Time display updates during playback
- ✅ Waveform visualization animates

---

### 4. **Processing Status Updates** (`ProcessingStatus.tsx`)

#### Steps to Test:
1. Upload or record audio
2. Click "Start Analysis" to begin processing
3. **Monitor Processing Steps:**
   - Verify each step shows:
     - Step name and description
     - Processing animation (spinner)
     - Progress percentage
     - Completion checkmark
4. **Test Time Tracking:**
   - Verify elapsed time counter increments
   - Check estimated time remaining updates
   - Verify step completion count
5. **Test Cancel Function:**
   - During processing, click the X button
   - Verify processing stops
   - Confirm cancellation dialog (if implemented)
6. **Test Error Handling:**
   - Disconnect internet during processing (to simulate error)
   - Verify error state displays
   - Check "Retry Analysis" button appears

#### Expected Results:
- ✅ All 7 processing steps display correctly
- ✅ Progress bars animate smoothly
- ✅ Time estimates are reasonable
- ✅ Cancel button stops processing
- ✅ Error states show helpful messages
- ✅ Retry functionality works

---

### 5. **CEFR Level Indicator** (`CEFRLevelIndicator.tsx`)

#### Steps to Test:
1. Complete an audio analysis
2. **Verify Main Display:**
   - CEFR level badge (A1-C2) displays prominently
   - Level name shows (e.g., "Upper Intermediate")
   - Description text is accurate
3. **Check Score Display:**
   - Overall score (0-100) is visible
   - Confidence percentage shows
4. **Test Progress Bar:**
   - CEFR progress bar shows current level highlighted
   - All 6 levels (A1-C2) are visible
   - Current level is emphasized
5. **Verify Next Level Progress:**
   - "Progress to next level" section shows
   - Percentage to next level is calculated
   - Progress bar fills appropriately
6. **Test Animations:**
   - Refresh page and verify entrance animations
   - Check badge rotation animation
   - Verify progress bars animate on load

#### Expected Results:
- ✅ CEFR level displays correctly (A1-C2)
- ✅ Confidence score shown as percentage
- ✅ Progress visualization is clear
- ✅ Animations are smooth
- ✅ Level descriptions are accurate
- ✅ Next level progress is calculated

---

### 6. **Component Scores Dashboard** (`ComponentScores.tsx`)

#### Steps to Test:
1. After analysis completes, find the Component Scores section
2. **Verify Component Cards:**
   - 5 components display: Grammar, Vocabulary, Fluency, Pronunciation, Discourse
   - Each shows:
     - Icon and title
     - Circular progress indicator
     - Score out of 100
     - CEFR level
     - Confidence percentage
3. **Test Interactive Elements:**
   - Hover over component cards
   - Verify hover effects (slight scale/shadow)
4. **Check Details Section:**
   - Verify strengths are listed
   - Check areas for improvement shown
   - Example sentences display (if available)
5. **Test Summary Statistics:**
   - Average score calculation is correct
   - Strong areas count is accurate
   - Focus areas identified correctly
6. **Test Responsive Layout:**
   - Resize browser window
   - Verify cards reflow properly
   - Check mobile layout (single column)

#### Expected Results:
- ✅ All 5 components display with scores
- ✅ Circular progress indicators match scores
- ✅ Color coding reflects performance (green/yellow/red)
- ✅ Hover effects work smoothly
- ✅ Details expand/collapse properly
- ✅ Summary statistics are accurate

---

### 7. **Progress Charts** (`ProgressCharts.tsx`)

#### Steps to Test:
1. Look for the Progress Analytics section
2. **Test Chart Types:**
   - Click "Line" - verify line chart displays
   - Click "Radar" - verify spider chart displays
   - Click "Bar" - verify bar chart displays
   - Click "Comparison" - verify pie chart displays
3. **Test Timeframe Selector:**
   - Click "Week" - verify 7-day view
   - Click "Month" - verify 30-day view
   - Click "Quarter" - verify 90-day view
   - Click "Year" - verify annual view
4. **Test Chart Interactions:**
   - Hover over data points
   - Verify tooltips show detailed information
   - Check legend toggles series on/off
5. **Verify Data Accuracy:**
   - Check that historical data displays
   - Verify trends are calculated correctly
   - Confirm statistics match data
6. **Test Key Insights:**
   - Verify insights section generates
   - Check recommendations are relevant
   - Confirm improvement metrics

#### Expected Results:
- ✅ All 4 chart types render correctly
- ✅ Timeframe switching updates data
- ✅ Interactive tooltips work
- ✅ Legends are clickable
- ✅ Statistics calculate correctly
- ✅ Insights are meaningful

---

### 8. **Error Handling** (`ErrorBoundary.tsx` & `ErrorHandler.tsx`)

#### Steps to Test:
1. **Test Network Errors:**
   - Disconnect internet
   - Try to upload/analyze audio
   - Verify network error displays with suggestions
2. **Test File Validation Errors:**
   - Upload invalid file type
   - Verify validation error with clear message
   - Check suggested actions
3. **Test Permission Errors:**
   - Deny microphone permission
   - Try to record
   - Verify permission error with grant button
4. **Test Recovery Options:**
   - Trigger any error
   - Click "Try Again" button
   - Verify retry works
   - Click "Dismiss" to close error
5. **Test Error Report:**
   - Trigger an error
   - Click "Send Error Report"
   - Verify confirmation message
6. **Test Error Details:**
   - Click "Show details" in error dialog
   - Verify technical details display
   - Check error ID is copyable

#### Expected Results:
- ✅ Error dialogs appear for all error types
- ✅ Error messages are user-friendly
- ✅ Suggestions are helpful and actionable
- ✅ Retry functionality works
- ✅ Error reporting simulates sending
- ✅ Technical details available when needed

---

### 9. **Mobile Responsiveness**

#### Steps to Test:
1. **Test on Mobile Viewport:**
   - Open Chrome DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Select iPhone or Android device
2. **Test Component Layouts:**
   - Audio Recorder - should be full width
   - File Uploader - should stack below recorder
   - Component Scores - should be single column
   - Charts - should be scrollable horizontally if needed
3. **Test Touch Interactions:**
   - Verify buttons are large enough to tap
   - Check swipe gestures work (if implemented)
   - Test long press actions
4. **Test Orientation:**
   - Switch between portrait/landscape
   - Verify layout adjusts properly
5. **Test Performance:**
   - Check animation smoothness
   - Verify no lag on scroll
   - Test audio playback performance

#### Expected Results:
- ✅ All components stack properly on mobile
- ✅ Touch targets are minimum 44x44px
- ✅ Text remains readable
- ✅ Charts are viewable (scroll/zoom)
- ✅ Modals/dialogs fit screen
- ✅ No horizontal overflow

---

### 10. **Backend Integration** (`audioAnalysisService.ts`)

#### Steps to Test:
1. **Test Mock Mode (Development):**
   - Verify analysis works without backend
   - Check mock data generates reasonable scores
   - Confirm recommendations are relevant
2. **Test OpenAI Integration:**
   - Ensure OPENAI_API_KEY is set
   - Upload/record audio
   - Verify transcription works
   - Check word-level timestamps (if available)
3. **Test Service Health Check:**
   - Open browser console
   - Run: `audioAnalysisService.getServiceHealth()`
   - Verify health status returns
4. **Test Historical Data:**
   - Check that historical data loads
   - Verify it displays in charts
   - Test different timeframes
5. **Test Error Handling:**
   - Remove API key temporarily
   - Try analysis
   - Verify graceful error handling
   - Check fallback to simulation mode

#### Expected Results:
- ✅ Mock mode works offline
- ✅ OpenAI transcription succeeds (with valid key)
- ✅ Service health check returns status
- ✅ Historical data loads and displays
- ✅ Errors handled gracefully
- ✅ Fallback mechanisms work

---

## 🎯 Complete User Journey Test

### End-to-End Workflow:
1. **Start Fresh:**
   - Clear browser cache
   - Navigate to `http://localhost:3000/audio-analysis`

2. **Record Audio:**
   - Grant microphone permission
   - Record 30-60 seconds of English speech
   - Stop recording

3. **Review Audio:**
   - Play back recording
   - Verify quality
   - Adjust volume if needed

4. **Start Analysis:**
   - Click "Start Analysis"
   - Watch all 7 processing steps complete
   - Wait for results

5. **Review Results:**
   - Check CEFR level (A1-C2)
   - Review component scores
   - Read recommendations
   - Explore historical progress charts

6. **Test Again:**
   - Click "Analyze New Recording"
   - Upload a file this time
   - Complete another analysis
   - Verify historical data updates

### Expected Full Journey Results:
- ✅ Smooth progression through all steps
- ✅ No unexpected errors
- ✅ Results are meaningful and consistent
- ✅ Historical tracking works
- ✅ Can analyze multiple recordings
- ✅ UI remains responsive throughout

---

## 🐛 Common Issues & Solutions

### Issue 1: Microphone Permission Denied
**Solution:** 
- Check browser settings
- Ensure HTTPS or localhost
- Try different browser

### Issue 2: Audio Not Playing
**Solution:**
- Check file format compatibility
- Verify browser audio codec support
- Try different audio file

### Issue 3: Analysis Fails
**Solution:**
- Check OpenAI API key is valid
- Verify internet connection
- Check browser console for errors
- Fallback to mock mode should work

### Issue 4: Charts Not Displaying
**Solution:**
- Check if Recharts is installed: `npm install recharts`
- Verify historical data is loading
- Check browser console for errors

### Issue 5: Mobile Layout Issues
**Solution:**
- Clear browser cache
- Check viewport meta tag
- Test in actual mobile browser
- Use responsive design mode

---

## ✅ Testing Checklist

### Core Functionality
- [ ] Audio recording works
- [ ] File upload accepts valid formats
- [ ] Audio playback controls function
- [ ] Analysis process completes
- [ ] Results display correctly
- [ ] Error handling works

### UI/UX
- [ ] All animations are smooth
- [ ] Responsive design works on mobile
- [ ] Loading states display properly
- [ ] Error messages are helpful
- [ ] Success feedback is clear
- [ ] Navigation is intuitive

### Integration
- [ ] OpenAI API integration works (if configured)
- [ ] Mock mode works offline
- [ ] Historical data loads
- [ ] Service health check works
- [ ] Fallback mechanisms function

### Performance
- [ ] Page loads quickly
- [ ] Audio processing is responsive
- [ ] Charts render without lag
- [ ] No memory leaks observed
- [ ] Mobile performance acceptable

---

## 📊 Performance Benchmarks

### Expected Load Times:
- Initial page load: < 3 seconds
- Audio upload: < 2 seconds
- Analysis start: < 1 second
- Results display: < 1 second
- Chart rendering: < 500ms

### Expected Analysis Duration:
- Transcription: 2-5 seconds
- Component analysis: 1-2 seconds each
- Total analysis: 10-20 seconds

### Memory Usage:
- Idle: < 50MB
- During recording: < 100MB
- During analysis: < 150MB
- With charts: < 200MB

---

## 🚀 Production Readiness Checklist

Before deploying to production:

1. **Environment Variables:**
   - [ ] All API keys configured
   - [ ] Backend URL set correctly
   - [ ] Environment-specific configs

2. **Security:**
   - [ ] API keys not exposed in client
   - [ ] CORS configured properly
   - [ ] Rate limiting implemented

3. **Performance:**
   - [ ] Bundle size optimized
   - [ ] Images/assets compressed
   - [ ] Code splitting implemented
   - [ ] CDN configured

4. **Monitoring:**
   - [ ] Error tracking setup (e.g., Sentry)
   - [ ] Analytics configured
   - [ ] Performance monitoring

5. **Testing:**
   - [ ] All components tested
   - [ ] Cross-browser testing complete
   - [ ] Mobile testing complete
   - [ ] Accessibility testing done

---

## 📝 Notes

- This testing guide covers all Phase 6 components
- For Phase 5 backend testing, refer to `PHASE5_TESTING_GUIDE.md`
- For API documentation, check `API_DOCUMENTATION.md`
- Report bugs at: https://github.com/your-repo/issues

---

**Last Updated:** December 2024
**Version:** 1.0.0
**Phase:** 6 - Frontend Development