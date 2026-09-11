import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('mock_session')?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Redirect logged-in users away from login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    if (session === 'ADMIN') return NextResponse.redirect(new URL('/dashboard', request.url));
    if (session === 'STAFF') return NextResponse.redirect(new URL('/staff/staff-dashboard', request.url));
    if (session === 'CUSTOMER') return NextResponse.redirect(new URL('/customer/my-dashboard', request.url));
    return NextResponse.next();
  }

  // 2. Admin Routes
  const isAdminRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/bookings') || 
    pathname.startsWith('/communities') || 
    pathname.startsWith('/vehicles') || 
    pathname.startsWith('/services') || 
    pathname === '/staff' || // Admin staff management
    pathname.startsWith('/expenses') || 
    pathname.startsWith('/revenue') || 
    pathname.startsWith('/settings') || 
    pathname.startsWith('/profile');
    
  if (isAdminRoute) {
    if (session !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }
  }

  // 3. Staff Routes (Starts with /staff/staff-)
  if (pathname.startsWith('/staff/staff-')) {
    if (session !== 'STAFF') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }
  }

  // 4. Customer Routes
  if (pathname.startsWith('/customer')) {
    if (session !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/bookings/:path*', '/communities/:path*', '/vehicles/:path*', '/services/:path*', '/staff/:path*', '/expenses/:path*', '/revenue/:path*', '/settings/:path*', '/profile/:path*', '/customer/:path*'],
}