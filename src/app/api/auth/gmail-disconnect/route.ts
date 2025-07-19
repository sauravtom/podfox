import { NextRequest, NextResponse } from 'next/server';
import { updateUserData } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    await updateUserData(userId, {
      gmailConnected: false,
      googleTokens: undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Gmail disconnected successfully'
    });

  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail' },
      { status: 500 }
    );
  }
} 