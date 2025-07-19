import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    console.log(`[Onboarding Status API] Request from user: ${userId}`);

    if (!userId) {
      console.log(`[Onboarding Status API] No user ID provided`);
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const userData = await getUserData(userId);
    console.log(`[Onboarding Status API] User data:`, userData);

    if (!userData) {
      console.log(`[Onboarding Status API] No user data found, returning incomplete status`);
      return NextResponse.json({
        completed: false,
        step: 0,
        data: null
      });
    }

    const response = {
      completed: userData.onboardingCompleted,
      step: userData.onboardingStep,
      data: {
        interests: userData.interests,
        gmailConnected: userData.gmailConnected,
        calendarConnected: userData.calendarConnected,
      }
    };

    console.log(`[Onboarding Status API] Returning:`, response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('[Onboarding Status API] Error getting onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to get onboarding status' },
      { status: 500 }
    );
  }
} 