"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { InterestsStep } from "@/components/onboarding/interests-step";
import { GmailStep } from "@/components/onboarding/gmail-step";
import { CalendarStep } from "@/components/onboarding/calendar-step";
import { WelcomeStep } from "@/components/onboarding/welcome-step";
import { CompleteStep } from "@/components/onboarding/complete-step";
import { useToast } from "@/hooks/use-toast";

export interface OnboardingData {
  interests: string[];
  gmailConnected: boolean;
  calendarConnected: boolean;
}

const steps = [
  { id: "welcome", title: "Welcome", description: "Get started with Podfox" },
  { id: "interests", title: "Interests", description: "Choose your topics" },
  { id: "gmail", title: "Gmail", description: "Connect your email" },
  { id: "calendar", title: "Calendar", description: "Sync your schedule" },
  { id: "complete", title: "Complete", description: "You're all set!" },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    interests: [],
    gmailConnected: false,
    calendarConnected: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkOnboardingStatus = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('[Onboarding Page] Checking onboarding status for user:', user.id);
      const response = await fetch('/api/user/onboarding-status', {
        headers: {
          'Authorization': `Bearer ${user.id}`,
        },
      });
      const data = await response.json();
      console.log('[Onboarding Page] Onboarding status response:', data);
      
      if (data.completed) {
        console.log('[Onboarding Page] Onboarding completed, redirecting to dashboard');
        router.push('/dashboard');
      } else if (data.step !== undefined) {
        console.log('[Onboarding Page] Setting step to:', data.step);
        setCurrentStep(data.step);
        if (data.data) {
          setOnboardingData(data.data);
        }
      }
    } catch (error) {
      console.error('[Onboarding Page] Error checking onboarding status:', error);
    }
  }, [user?.id, router]);

  useEffect(() => {
    if (user?.id) {
      checkOnboardingStatus();
    }
  }, [user?.id, checkOnboardingStatus]);

  const updateOnboardingData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const saveProgress = async () => {
    try {
      await fetch('/api/user/onboarding-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          step: currentStep,
          data: onboardingData,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete onboarding: ${response.status}`);
      }
      
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to Podfox. You're all set to start generating podcasts.",
      });
      
      // Add a small delay to ensure the data is properly saved before redirecting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipOnboarding = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
        body: JSON.stringify({ skipped: true }), // Indicate that onboarding was skipped
      });
      
      toast({
        title: "Onboarding Skipped!",
        description: "You can always complete your setup later from the dashboard.",
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to skip onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      await saveProgress();
    } else {
      await completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "welcome":
        return <WelcomeStep />;
      case "interests":
        return (
          <InterestsStep
            interests={onboardingData.interests}
            onInterestsChange={(interests: string[]) => updateOnboardingData('interests', interests)}
          />
        );
      case "gmail":
        return (
          <GmailStep
            connected={onboardingData.gmailConnected}
            onConnectionChange={(connected) => updateOnboardingData('gmailConnected', connected)}
          />
        );
      case "calendar":
        return (
          <CalendarStep
            connected={onboardingData.calendarConnected}
            onConnectionChange={(connected) => updateOnboardingData('calendarConnected', connected)}
          />
        );
      case "complete":
        return <CompleteStep data={onboardingData} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case "welcome":
        return true;
      case "interests":
        return onboardingData.interests.length > 0;
      case "gmail":
        return true; // Optional step
      case "calendar":
        return true; // Optional step
      case "complete":
        return true;
      default:
        return false;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome to Podfox
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Let's set up your personalized podcast experience
          </p>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep].title}</span>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep < steps.length - 1 && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{currentStep + 1}</span>
                </div>
              )}
              {currentStep === steps.length - 1 && (
                <CheckCircle className="w-8 h-8 text-green-500" />
              )}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 && (
              <Button
                variant="outline"
                onClick={skipOnboarding}
                disabled={isLoading}
              >
                Skip Setup
              </Button>
            )}
            <Button
              onClick={nextStep}
              disabled={!canProceed() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                "Processing..."
              ) : currentStep === steps.length - 1 ? (
                "Complete Setup"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}