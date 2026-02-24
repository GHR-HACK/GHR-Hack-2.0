import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/lib/jwt';

export function withAuth(handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return NextResponse.json(
          { error: 'Missing authorization token' },
          { status: 401 }
        );
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Call the actual handler with the verified user
      return await handler(request, decoded);
    } catch (error) {
      console.error('❌ Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }
  };
}
