import { Sparkles, Zap, Brain } from "lucide-react";

export function WelcomeStep() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-3">Welcome to Podgenius!</h3>
        <p className="text-muted-foreground mb-6">
          We&apos;ll help you create personalized podcast briefings from your emails, calendar, and interests. 
          This setup takes just a few minutes.
        </p>
        
        <div className="grid gap-4 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">AI-Powered Research</h4>
              <p className="text-xs text-muted-foreground">
                Our AI researches your topics and creates engaging content
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Lightning Fast</h4>
              <p className="text-xs text-muted-foreground">
                Generate your daily briefing in minutes, not hours
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Personalized Content</h4>
              <p className="text-xs text-muted-foreground">
                Tailored to your interests, schedule, and communication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 