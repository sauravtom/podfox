"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle, Shield, Clock } from "lucide-react";

interface GmailStepProps {
  connected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export function GmailStep({ connected, onConnectionChange }: GmailStepProps) {
  const { user } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
          const response = await fetch('/api/auth/gmail-connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

      const data = await response.json();

      if (data.auth_url) {
        window.open(data.auth_url, 'gmail_auth', 'width=500,height=600');
        
        const checkConnection = setInterval(() => {
          fetch('/api/auth/gmail-status')
            .then(res => res.json())
            .then(status => {
              if (status.connected) {
                clearInterval(checkConnection);
                onConnectionChange(true);
                setIsConnecting(false);
              }
            })
            .catch(() => {
              clearInterval(checkConnection);
              setError("Failed to check connection status");
              setIsConnecting(false);
            });
        }, 2000);

        setTimeout(() => {
          clearInterval(checkConnection);
          if (!connected) {
            setIsConnecting(false);
          }
        }, 60000);
      } else {
        throw new Error(data.error || "Failed to initiate Gmail connection");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Gmail");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/auth/gmail-disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
      });
      onConnectionChange(false);
    } catch (err) {
      setError("Failed to disconnect Gmail");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Connect Your Gmail</h3>
        <p className="text-muted-foreground text-sm">
          Allow Podgenius to analyze your important emails and newsletters to include relevant insights in your briefings.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {connected ? (
        <div className="space-y-4">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Gmail is successfully connected! We can now analyze your emails for insights.
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect Gmail
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Secure & Private</p>
                <p className="text-muted-foreground">We only read email subjects and metadata, never content</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Clock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Recent Focus</p>
                <p className="text-muted-foreground">We analyze only the last 24 hours of emails</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Mail className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Smart Filtering</p>
                <p className="text-muted-foreground">Only important emails and newsletters are analyzed</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              size="lg"
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Gmail"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This step is optional. You can skip and add it later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 