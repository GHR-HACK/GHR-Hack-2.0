import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        supabaseUrl: supabaseUrl ? '✓ Set' : '✗ Missing',
        anonKey: anonKey ? '✓ Set' : '✗ Missing',
      });
    }

    // Test connection to Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/teams?limit=1`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    return NextResponse.json({
      status: 'success',
      supabaseUrl,
      anonKeySet: true,
      connectionStatus: response.ok ? 'Connected' : `Error: ${response.status}`,
      responseStatus: response.status,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
