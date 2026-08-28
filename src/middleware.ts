import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('mock_session')?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Redirect logged-in users away from the login page
  if (pathname === '/login') {
    if (session === 'ADMIN') return NextResponse.redirect(new URL('/dashboard', request.url));
    if (session === 'STAFF') return NextResponse.redirect(new URL('/staff/staff-dashboard', request.url));
    if (session === 'CUSTOMER') return NextResponse.redirect(new URL('/customer/my-dashboard', request.url));
    return NextResponse.next();
  }

  // 2. Block access to admin routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/bookings') || pathname.startsWith('/communities') || pathname.startsWith('/vehicles') || pathname.startsWith('/services') || pathname.startsWith('/staff') || pathname.startsWith('/expenses') || pathname.startsWith('/revenue') || pathname.startsWith('/settings') || pathname.startsWith('/profile')) {
    if (session !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Block access to customer routes
  if (pathname.startsWith('/customer')) {
    if (session !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. Block access to staff routes
  if (pathname.startsWith('/staff')) {
    if (session !== 'STAFF') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/bookings/:path*', '/communities/:path*', '/vehicles/:path*', '/services/:path*', '/staff/:path*', '/expenses/:path*', '/revenue/:path*', '/settings/:path*', '/profile/:path*', '/customer/:path*', '/staff/:path*'],
}