/**
 * Environment utilities for backend URL configuration
 */

export function getBackendURL(): string {
  // For client-side (browser), MUST use NEXT_PUBLIC_ prefix
  // This is the key: process.env.BACKEND_URL is NOT available in browser
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    'http://localhost:8000';

  console.log('🔍 Backend URL:', backendUrl); // Debug log
  return backendUrl;
}