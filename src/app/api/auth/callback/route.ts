import { NextRequest, NextResponse } from 'next/server';
import { getTokens } from '@/lib/google-auth';
import { updateUserData } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const userId = searchParams.get('userId');

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing authorization code or state' },
        { status: 400 }
      );
    }

    const tokens = await getTokens(code);
    
    if (userId) {
      const isGmail = state.startsWith('gmail-');
      const isCalendar = state.startsWith('calendar-');
      
      await updateUserData(userId, {
        googleTokens: tokens,
        ...(isGmail && { gmailConnected: true }),
        ...(isCalendar && { calendarConnected: true }),
      });
    }

    return new Response(`
      <html>
        <body>
          <script>
            window.close();
          </script>
          <p>Authorization successful! You can close this window.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return NextResponse.json(
      { error: 'OAuth callback failed' },
      { status: 500 }
    );
  }
} 