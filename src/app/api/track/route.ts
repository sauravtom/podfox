
import { NextResponse } from 'next/server';
import wandb from '@wandb/sdk';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Initialize a new wandb run
    await wandb.init({
      project: 'nextjs-app', // Name of your project
      config: {
        framework: 'Next.js',
      },
    });

    // Log custom data
    wandb.log({
      event_name: 'user_signup',
      user_id: body.userId,
      timestamp: new Date().toISOString(),
    });

    // It's important to call finish() to ensure all data is sent
    await wandb.finish();

    return NextResponse.json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error tracking event' }, { status: 500 });
  }
}
