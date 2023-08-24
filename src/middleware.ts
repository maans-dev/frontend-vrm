import { withAuth } from 'next-auth/middleware';
import { hasRole } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth?.token;

    if (!token) return NextResponse.next();

    let authorized = false;

    if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/support') {
      authorized = (token.roles as string[])?.length > 0;
    }

    if (
      req.nextUrl.pathname.includes('/canvass') ||
      req.nextUrl.pathname.includes('/capture')
    ) {
      authorized = hasRole(Roles.Canvass, token?.roles as string[]);
    }

    if (req.nextUrl.pathname.includes('/membership')) {
      authorized = hasRole(Roles.Membership, token?.roles as string[]);
    }

    if (
      req.nextUrl.pathname.includes('/sheets') ||
      req.nextUrl.pathname.includes('/sheet-gen-approval')
    ) {
      authorized = hasRole(Roles.SheetGen, token?.roles as string[]);
    }

    if (req.nextUrl.pathname.includes('/comms')) {
      authorized = hasRole(Roles.BulkComms, token?.roles as string[]);
    }

    if (req.nextUrl.pathname.includes('/cleanup')) {
      authorized = hasRole(Roles.VoterEdit, token?.roles as string[]);
    }

    if (req.nextUrl.pathname.includes('/my-activity')) {
      authorized = true;
    }

    if (req.nextUrl.pathname.includes('/activity-reports')) {
      authorized = hasRole(Roles.ActivityReport, token?.roles as string[]);
    }

    if (req.nextUrl.pathname.startsWith('/api/download')) {
      authorized = (token.roles as string[])?.length > 0;
    }

    if (!req.nextUrl.pathname.includes('403') && !authorized) {
      return NextResponse.rewrite(new URL('/403', req.url));
    }
  }
);

export const config = {
  matcher: ['/((?!image/*|themes/*|favicon.ico|404|403|auth/*|api/health).*)'],
};
