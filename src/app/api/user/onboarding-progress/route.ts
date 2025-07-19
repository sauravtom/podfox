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

    const { step, data } = await request.json();

    await updateUserData(userId, {
      onboardingStep: step,
      interests: data.interests || [],
      gmailConnected: data.gmailConnected || false,
      calendarConnected: data.calendarConnected || false,
    });

    return NextResponse.json({
      success: true,
      message: 'Progress saved successfully'
    });

  } catch (error) {
    console.error('Error saving onboarding progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
} 