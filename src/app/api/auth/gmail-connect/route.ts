import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-auth';

export async function POST(request: NextRequest) {
  try {
    const sessionId = Math.random().toString(36).substring(7);
    const authUrl = getAuthUrl(`gmail-${sessionId}`);

    return NextResponse.json({
      success: true,
      auth_url: authUrl,
      session_id: sessionId
    });

  } catch (error) {
    console.error('Error creating Gmail auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to create Gmail authentication URL' },
      { status: 500 }
    );
  }
} 