import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Admin-only routes
const adminRoutes = ['/templates', '/branding', '/users', '/settings'];
// Admin + Partner routes
const adminPartnerRoutes = ['/audit-trail'];

export default withAuth(
  function middleware(req) {
    const token = req?.nextauth?.token as any;
    const role = token?.role ?? 'Staff';
    const path = req?.nextUrl?.pathname ?? '';

    // Admin-only check
    for (const route of adminRoutes) {
      if (path.startsWith(route)) {
        if (role !== 'Admin') {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    }

    // Admin + Partner check
    for (const route of adminPartnerRoutes) {
      if (path.startsWith(route)) {
        if (!['Admin', 'Partner'].includes(role)) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clients/:path*',
    '/engagements/:path*',
    '/data-entry/:path*',
    '/documents/:path*',
    '/history/:path*',
    '/templates/:path*',
    '/branding/:path*',
    '/users/:path*',
    '/audit-trail/:path*',
    '/settings/:path*',
  ],
};
