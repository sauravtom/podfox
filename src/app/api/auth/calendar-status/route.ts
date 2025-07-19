import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const userData = await getUserData(userId);
    const connected = userData?.calendarConnected || false;

    return NextResponse.json({
      connected,
      calendar: connected ? 'Primary Calendar' : null
    });

  } catch (error) {
    console.error('Error getting Calendar status:', error);
    return NextResponse.json(
      { error: 'Failed to get Calendar status' },
      { status: 500 }
    );
  }
} 