"use client";

import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MessageCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getCoachFeedback } from "@/lib/coach";
import type { StrategyCascade, CoachResponse } from "@/app/app/page";

interface CascadeInputProps {
  stepKey: keyof StrategyCascade;
  value: string;
  onChange: (value: string) => void;
  onCoachResponse: (response: CoachResponse) => void;
  setIsLoading: (loading: boolean) => void;
  cascade: StrategyCascade;
}

// Contextual help content for Winning Aspiration
const HELP_CONTENT = {
  title: "Crafting Your Winning Aspiration",
  description: "Your winning aspiration is your organization's purpose and strategic intent. It should be inspiring, specific, and actionable.",
  guidelines: [
    "Be specific about what success looks like in 3-5 years",
    "Focus on outcomes that matter to customers and stakeholders", 
    "Make it aspirational but achievable",
    "Avoid vague language like 'be the best' or 'increase market share'",
    "Connect to your organization's unique purpose and values"
  ],
  examples: [
    "Transform how small businesses access financial services by providing instant, AI-powered lending decisions",
    "Become the trusted partner for sustainable packaging solutions that help brands reduce environmental impact by 50%",
    "Democratize access to quality education by making personalized learning available to 10 million students globally"
  ]
};

export function CascadeInput({ 
  stepKey, 
  value, 
  onChange, 
  onCoachResponse, 
  setIsLoading,
  cascade 
}: CascadeInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [errors, setErrors] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // Debounced update to parent component
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Validation
  const validateInput = useCallback((input: string): string[] => {
    const errors: string[] = [];
    
    if (input.trim().length < 50) {
      errors.push("Your winning aspiration should be at least 50 characters to provide sufficient detail.");
    }
    
    if (input.trim().length > 500) {
      errors.push("Try to keep your winning aspiration under 500 characters for clarity and focus.");
    }

    // Check for vague language
    const vagueTerms = ["best", "leading", "top", "great", "excellent", "good"];
    const hasVagueTerms = vagueTerms.some(term => 
      input.toLowerCase().includes(term)
    );
    
    if (hasVagueTerms) {
      errors.push("Avoid vague terms like 'best' or 'leading'. Be specific about what you want to achieve.");
    }

    return errors;
  }, []);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setLocalValue(newValue);
    const validationErrors = validateInput(newValue);
    setErrors(validationErrors);
  };

  // Get coach feedback
  const handleGetCoachFeedback = async () => {
    if (!localValue.trim() || errors.length > 0) return;

    setIsLoading(true);
    try {
      const response = await getCoachFeedback(stepKey, cascade);
      onCoachResponse(response);
    } catch (error) {
      console.error("Failed to get coach feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Help Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
              Guidance
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
            >
              {showHelp ? "Hide" : "Show"} Details
            </Button>
          </div>
          <CardDescription>
            {HELP_CONTENT.description}
          </CardDescription>
        </CardHeader>
        
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Guidelines:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {HELP_CONTENT.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {guideline}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Example Winning Aspirations:</h4>
                  <div className="space-y-2">
                    {HELP_CONTENT.examples.map((example, index) => (
                      <div key={index} className="text-sm text-gray-600 italic bg-white p-3 rounded border-l-4 border-blue-300">
                        "{example}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </Card>

      {/* Input Section */}
      <div className="space-y-4">
        <Label htmlFor="winning-aspiration" className="text-lg font-medium">
          Your Winning Aspiration
        </Label>
        
        <Textarea
          id="winning-aspiration"
          placeholder="Describe your winning aspiration in detail. What does success look like for your organization? Be specific about the outcomes you want to achieve and the impact you want to make..."
          value={localValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="min-h-32 text-base leading-relaxed resize-none"
          maxLength={500}
        />
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{localValue.length}/500 characters</span>
          <span>{localValue.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Coach Feedback Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGetCoachFeedback}
            disabled={!localValue.trim() || errors.length > 0}
            className="px-6"
            variant="outline"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Ask the Coach for Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}