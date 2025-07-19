import { clerkClient } from '@clerk/nextjs/server';

export interface UserData {
  userId: string;
  interests: string[];
  gmailConnected: boolean;
  calendarConnected: boolean;
  onboardingCompleted: boolean;
  onboardingStep: number;
  googleTokens?: {
    access_token?: string | null;
    refresh_token?: string | null;
    scope?: string | null;
    token_type?: string | null;
    expiry_date?: number | null;
  };
}

export async function getUserData(userId: string): Promise<UserData | null> {
  console.log(`[Storage] Getting user data for: ${userId}`);
  
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.privateMetadata as any;
    
    if (!metadata || Object.keys(metadata).length === 0) {
      console.log(`[Storage] No user data found in metadata`);
      return null;
    }

    const userData: UserData = {
      userId,
      interests: metadata.interests || [],
      gmailConnected: metadata.gmailConnected || false,
      calendarConnected: metadata.calendarConnected || false,
      onboardingCompleted: metadata.onboardingCompleted || false,
      onboardingStep: metadata.onboardingStep || 0,
      googleTokens: metadata.googleTokens || undefined,
    };

    console.log(`[Storage] User data found:`, userData);
    return userData;
  } catch (error) {
    console.error(`[Storage] Error getting user data:`, error);
    return null;
  }
}

export async function setUserData(userId: string, data: Partial<UserData>) {
  console.log(`[Storage] Setting user data for: ${userId}`, data);
  
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const currentMetadata = user.privateMetadata as any;
    
    const defaults = {
      interests: [],
      gmailConnected: false,
      calendarConnected: false,
      onboardingCompleted: false,
      onboardingStep: 0,
    };
    
    const updatedMetadata = {
      ...defaults,
      ...currentMetadata,
      ...data,
      userId,
    };

    await client.users.updateUserMetadata(userId, {
      privateMetadata: updatedMetadata,
    });

    console.log(`[Storage] User data saved for: ${userId}`, updatedMetadata);
    return updatedMetadata as UserData;
  } catch (error) {
    console.error(`[Storage] Error setting user data:`, error);
    throw error;
  }
}

export async function updateUserData(userId: string, data: Partial<UserData>) {
  console.log(`[Storage] Updating user data for: ${userId}`, data);
  return await setUserData(userId, data);
} 