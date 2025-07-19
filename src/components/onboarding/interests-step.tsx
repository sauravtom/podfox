"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, X, Sparkles } from "lucide-react";

interface InterestsStepProps {
  interests: string[];
  onInterestsChange: (interests: string[]) => void;
}

const suggestedInterests = [
  "Technology",
  "Artificial Intelligence",
  "Startups",
  "Business",
  "Finance",
  "Health & Wellness",
  "Science",
  "Politics",
  "Climate Change",
  "Cryptocurrency",
  "Software Development",
  "Marketing",
  "Productivity",
  "Design",
  "Sports",
  "Travel"
];

export function InterestsStep({ interests, onInterestsChange }: InterestsStepProps) {
  const [newInterest, setNewInterest] = useState("");

  const addInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest && !interests.includes(trimmedInterest)) {
      onInterestsChange([...interests, trimmedInterest]);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    onInterestsChange(interests.filter(interest => interest !== interestToRemove));
  };

  const handleAddCustomInterest = () => {
    if (newInterest.trim()) {
      addInterest(newInterest);
      setNewInterest("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomInterest();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">What interests you?</h3>
        <p className="text-muted-foreground text-sm">
          Select topics you&apos;d like to hear about in your daily briefings. Choose at least one to continue.
        </p>
      </div>

      {/* Selected Interests */}
      {interests.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Your Selected Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge 
                key={interest} 
                variant="default" 
                className="px-3 py-1 text-sm flex items-center gap-1"
              >
                {interest}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeInterest(interest)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Interest */}
      <div className="space-y-2">
        <Label htmlFor="custom-interest" className="text-sm font-medium">
          Add Your Own
        </Label>
        <div className="flex gap-2">
          <Input
            id="custom-interest"
            placeholder="Enter a topic you're interested in..."
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleAddCustomInterest}
            disabled={!newInterest.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Suggested Interests */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Popular Topics</Label>
        <div className="flex flex-wrap gap-2">
          {suggestedInterests.map((interest) => (
            <Button
              key={interest}
              variant={interests.includes(interest) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (interests.includes(interest)) {
                  removeInterest(interest);
                } else {
                  addInterest(interest);
                }
              }}
              className="text-xs"
            >
              {interest}
            </Button>
          ))}
        </div>
      </div>

      {interests.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">
            Select at least one topic to continue
          </p>
        </div>
      )}
    </div>
  );
} 