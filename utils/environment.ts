/**
 * Environment utilities for backend URL configuration
 */

export function getBackendURL(): string {
  // Check multiple possible environment variables
  const backendUrl = 
    process.env.BACKEND_URL || 
    process.env.NEXT_PUBLIC_BACKEND_URL || 
    'http://localhost:8000';
  
  return backendUrl;
}