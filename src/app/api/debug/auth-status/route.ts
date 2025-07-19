import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    console.log(`[Debug API] Auth status request from user: ${userId}`);

    if (!userId) {
      return NextResponse.json({
        error: 'No user ID provided',
        timestamp: new Date().toISOString(),
      });
    }

    const userData = await getUserData(userId);

    return NextResponse.json({
      userId,
      userData,
      timestamp: new Date().toISOString(),
      headers: {
        authorization: authHeader ? 'present' : 'missing',
        userAgent: request.headers.get('user-agent'),
      },
      url: request.url,
    });

  } catch (error) {
    console.error('[Debug API] Error:', error);
    return NextResponse.json({
      error: 'Failed to get auth status',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 