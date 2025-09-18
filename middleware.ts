import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleAssessmentSubdomain } from './middleware/assessment/subdomain-router';

export function middleware(request: NextRequest) {
  // Handle assessment subdomains first
  const assessmentResponse = handleAssessmentSubdomain(request);
  if (assessmentResponse) {
    return assessmentResponse;
  }

  // Handle other middleware logic here (existing partner routes, etc.)

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};