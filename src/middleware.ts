import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserData } from "@/lib/storage";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)"
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isApiRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth.protect();
    
    if (userId) {
      try {
        console.log(`[Middleware] Checking onboarding status for user: ${userId}`);
        
        const userData = await getUserData(userId);
        console.log(`[Middleware] User data:`, userData);

        if (!userData) {
          console.log(`[Middleware] No user data found, allowing onboarding access`);
          if (isDashboardRoute(req)) {
            console.log(`[Middleware] No user data, redirecting dashboard to onboarding`);
            return NextResponse.redirect(new URL('/onboarding', req.url));
          }
          return;
        }

        const onboardingCompleted = userData.onboardingCompleted;
        console.log(`[Middleware] Onboarding completed:`, onboardingCompleted);
        
        if (onboardingCompleted === true) {
          if (isOnboardingRoute(req)) {
            console.log(`[Middleware] Onboarding completed, redirecting to dashboard`);
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        } else {
          if (isDashboardRoute(req)) {
            console.log(`[Middleware] Onboarding not completed, redirecting to onboarding`);
            return NextResponse.redirect(new URL('/onboarding', req.url));
          }
        }
      } catch (error) {
        console.error('[Middleware] Error checking onboarding status:', error);
        if (isDashboardRoute(req)) {
          console.log(`[Middleware] Error occurred, redirecting dashboard to onboarding`);
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}; 