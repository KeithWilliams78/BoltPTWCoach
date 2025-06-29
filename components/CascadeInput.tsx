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
  label: string;
  helperPath: string;
  minChars: number;
  value: string;
  onChange: (value: string) => void;
  onCoachResponse: (response: CoachResponse) => void;
  onCoachError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  cascade: StrategyCascade;
}

// Helper content mapping - TODO: Load from actual markdown files
const HELP_CONTENT: Record<string, any> = {
  "/content/help/winning-aspiration.md": {
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
  },
  "/content/help/where-to-play.md": {
    title: "Defining Where to Play",
    description: "Your 'Where to Play' choices define the specific markets, customer segments, and competitive arenas where you will focus your efforts.",
    guidelines: [
      "Be specific about customer segments - Who exactly are you serving?",
      "Define geographic boundaries - Which markets, regions, or locations?",
      "Choose product/service categories - What offerings will you focus on?",
      "Consider distribution channels - How will you reach customers?",
      "Set competitive boundaries - Which competitors will you face directly?"
    ],
    examples: [
      "Serve small business owners (1-50 employees) in the US who struggle with traditional bank lending, focusing on e-commerce businesses needing working capital under $100K",
      "Target mid-market consumer brands ($10M-$500M revenue) in North America committed to sustainability, focusing on food & beverage packaging",
      "Focus on enterprise software companies (500+ employees) in English-speaking markets who need AI-powered customer support automation"
    ]
  },
  "/content/help/how-to-win.md": {
    title: "Defining Your Competitive Advantage",
    description: "Your 'How to Win' strategy defines the specific competitive advantage that will enable you to succeed in your chosen markets.",
    guidelines: [
      "Define your unique value proposition - What makes you different and better?",
      "Identify your competitive advantages - What can you do that others cannot?",
      "Consider cost vs. differentiation - Will you compete on price, uniqueness, or both?",
      "Think about sustainability - How will you maintain your advantage over time?",
      "Connect to customer needs - How does your advantage create value for customers?"
    ],
    examples: [
      "Win through instant lending decisions powered by AI analysis of real-time business data, providing funding in 24 hours versus weeks for traditional lenders",
      "Win by offering the industry's most comprehensive sustainability solution with bio-based materials, lifecycle tracking, and regulatory compliance support",
      "Win through superior AI accuracy (95% vs. 70% industry average) with seamless integration and self-learning capabilities"
    ]
  }
};

export function CascadeInput({ 
  stepKey, 
  label,
  helperPath,
  minChars,
  value, 
  onChange, 
  onCoachResponse,
  onCoachError,
  setIsLoading,
  cascade 
}: CascadeInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [errors, setErrors] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // Get help content for current step
  const helpContent = HELP_CONTENT[helperPath] || {
    title: "Strategic Guidance",
    description: "Complete this section with thoughtful detail.",
    guidelines: [],
    examples: []
  };

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
    
    if (input.trim().length < minChars) {
      errors.push(`Please provide at least ${minChars} characters for sufficient detail.`);
    }
    
    if (input.trim().length > 500) {
      errors.push("Try to keep your response under 500 characters for clarity and focus.");
    }

    // Step-specific validation
    if (stepKey === 'winningAspiration') {
      const vagueTerms = ["best", "leading", "top", "great", "excellent", "good"];
      const hasVagueTerms = vagueTerms.some(term => 
        input.toLowerCase().includes(term)
      );
      
      if (hasVagueTerms) {
        errors.push("Avoid vague terms like 'best' or 'leading'. Be specific about what you want to achieve.");
      }
    }

    if (stepKey === 'whereToPlay') {
      const hasBroadTerms = /everyone|all|any|general/i.test(input);
      if (hasBroadTerms && input.length < 100) {
        errors.push("Avoid being too broad. Be specific about your target segments and markets.");
      }
    }

    if (stepKey === 'howToWin') {
      const hasGenericTerms = /better|faster|cheaper|quality/i.test(input);
      if (hasGenericTerms && input.length < 80) {
        errors.push("Avoid generic advantages. Be specific about what makes you uniquely competitive.");
      }
    }

    return errors;
  }, [minChars, stepKey]);

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
      onCoachError("Unable to get coach feedback at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic placeholder based on step
  const getPlaceholder = () => {
    switch (stepKey) {
      case 'winningAspiration':
        return "Describe your winning aspiration in detail. What does success look like for your organization? Be specific about the outcomes you want to achieve and the impact you want to make...";
      case 'whereToPlay':
        return "Define where you will compete. Which customer segments, markets, geographies, and product categories will you focus on? Be specific about your boundaries...";
      case 'howToWin':
        return "Explain how you will win in your chosen markets. What unique competitive advantages will enable you to succeed? What makes you different and better than alternatives...";
      default:
        return "Provide detailed information for this strategic choice...";
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
            {helpContent.description}
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
                {helpContent.guidelines.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Guidelines:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {helpContent.guidelines.map((guideline: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {guideline}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {helpContent.examples.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                    <div className="space-y-2">
                      {helpContent.examples.map((example: string, index: number) => (
                        <div key={index} className="text-sm text-gray-600 italic bg-white p-3 rounded border-l-4 border-blue-300">
                          "{example}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </Card>

      {/* Input Section */}
      <div className="space-y-4">
        <Label htmlFor={`input-${stepKey}`} className="text-lg font-medium">
          {label}
        </Label>
        
        <Textarea
          id={`input-${stepKey}`}
          placeholder={getPlaceholder()}
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