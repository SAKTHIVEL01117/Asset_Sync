import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@insforge/sdk/ssr/middleware';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Refresh access token via session cookie update
  await updateSession({
    requestCookies: request.cookies as any,
    responseCookies: response.cookies as any
  });

  const pathname = request.nextUrl.pathname;
  
  // Protected workspace routes
  const isProtectedPath = [
    '/dashboard',
    '/assets',
    '/bookings',
    '/maintenance',
    '/audits',
    '/reports',
    '/settings',
    '/organization',
    '/ai-assistant'
  ].some(path => pathname === path || pathname.startsWith(path + '/'));

  // Check presence of insforge session refresh token
  const hasSession = request.cookies.has('insforge_refresh_token');

  if (isProtectedPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/dashboard') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
