import { NextRequest, NextResponse } from 'next/server';
import { updateUserData } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    console.log(`[Complete Onboarding API] Request from user: ${userId}`);

    if (!userId) {
      console.log(`[Complete Onboarding API] No user ID provided`);
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log(`[Complete Onboarding API] Request data:`, data);

    await updateUserData(userId, {
      onboardingCompleted: true,
      interests: data.interests || [],
      gmailConnected: data.gmailConnected || false,
      calendarConnected: data.calendarConnected || false,
    });

    console.log(`[Complete Onboarding API] Onboarding completed for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully'
    });

  } catch (error) {
    console.error('[Complete Onboarding API] Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
} 