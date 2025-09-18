# Casco Antiguo Spanish School - Partner Assets

This directory contains branding assets for Casco Antiguo Spanish School assessment portal.

## Required Assets

### Logo Files
- `logo.png` - Main logo (recommended: 200x60px, transparent background)
- `logo-white.png` - White version for dark backgrounds
- `favicon.ico` - Favicon for browser tab (32x32px)

### Background Images
- `background.jpg` - Hero background image (recommended: 1920x1080px)
- `background-mobile.jpg` - Mobile optimized background (optional)

### Color Scheme
Based on assessment_partners.py configuration:
- Primary: #1a365d (Dark Blue)
- Secondary: #2d5a87 (Medium Blue)
- Accent: #ed8936 (Orange)

## Asset Guidelines

### Logo Requirements
- Format: PNG with transparent background
- Minimum size: 150px width
- Should be legible at small sizes
- Include both horizontal and stacked versions if available

### Background Image Requirements
- Format: JPG (optimized for web)
- Resolution: At least 1920x1080px
- File size: Under 500KB for optimal loading
- Should have enough contrast for white text overlay
- Consider mobile responsiveness

### File Naming Convention
- Use lowercase with hyphens
- Be descriptive: `casco-antiguo-logo-horizontal.png`
- Include variant info: `logo-white.png`, `logo-dark.png`

## Usage

These assets are automatically loaded by the assessment portal based on the configuration in:
- `brains/config/assessment_partners.py`
- Frontend components in `components/assessment/`

## Adding New Assets

1. Place files in this directory
2. Update the configuration in `assessment_partners.py`
3. Test with the assessment portal at: `assessment/casco-antiguo`

## Optimization

Assets should be optimized for web:
- Images: Use tools like TinyPNG or ImageOptim
- SVG preferred for logos when possible
- Consider WebP format for modern browser support