import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { OnboardingData } from "@/app/onboarding/page";

interface CompleteStepProps {
  data: OnboardingData;
}

export function CompleteStep({ data }: CompleteStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CheckCircle className="h-8 w-8" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-3">You&apos;re All Set!</h3>
        <p className="text-muted-foreground mb-6">
          Congratulations! Your Podgenius account is configured and ready to generate personalized podcast briefings.
        </p>
        
        <div className="space-y-4 text-left">
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Your Setup Summary
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Topics Selected:</span>
                <Badge variant="secondary">{data.interests.length} topics</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  Gmail Integration:
                </span>
                <Badge variant={data.gmailConnected ? "default" : "outline"}>
                  {data.gmailConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Calendar Integration:
                </span>
                <Badge variant={data.calendarConnected ? "default" : "outline"}>
                  {data.calendarConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
            </div>
          </div>
          
          {data.interests.length > 0 && (
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-3 text-sm">Your Selected Topics:</h4>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-2 text-sm text-blue-800 dark:text-blue-200">What&apos;s Next?</h4>
            <div className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3" />
                <span>Generate your first podcast briefing</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3" />
                <span>View episodes in your YouTube playlist</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3" />
                <span>Customize settings anytime in your dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 