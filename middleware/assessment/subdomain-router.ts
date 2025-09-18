import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Assessment partner subdomain mapping
const ASSESSMENT_SUBDOMAINS = {
  'casco-antiguo': 'casco-antiguo'
};

export function handleAssessmentSubdomain(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Handle assessment subdomains
  for (const [subdomain, partnerId] of Object.entries(ASSESSMENT_SUBDOMAINS)) {
    if (hostname.includes(`${subdomain}.encantospeak.com`)) {
      // Redirect to assessment page with partner parameter
      url.pathname = `/assessment/${partnerId}`;
      return NextResponse.rewrite(url);
    }
  }

  // Handle custom domain redirects for development/testing
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Check for subdomain simulation via header or query param
    const testSubdomain = request.nextUrl.searchParams.get('subdomain');
    if (testSubdomain && testSubdomain in ASSESSMENT_SUBDOMAINS) {
      url.pathname = `/assessment/${ASSESSMENT_SUBDOMAINS[testSubdomain as keyof typeof ASSESSMENT_SUBDOMAINS]}`;
      url.searchParams.delete('subdomain');
      return NextResponse.rewrite(url);
    }
  }

  // No assessment subdomain match
  return null;
}

export function getAssessmentPartnerFromHost(hostname: string): string | null {
  for (const [subdomain, partnerId] of Object.entries(ASSESSMENT_SUBDOMAINS)) {
    if (hostname.includes(`${subdomain}.encantospeak.com`)) {
      return partnerId;
    }
  }
  return null;
}