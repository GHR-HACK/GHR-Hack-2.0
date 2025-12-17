import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, we'll handle authentication on the client side
  // In a production app, you'd want server-side authentication here

  // You could add additional security checks here, like rate limiting
  // or checking for valid admin tokens

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
