"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import Link from "next/link";
import { CascadeInput } from "@/components/CascadeInput";
import { CoachSidebar } from "@/components/CoachSidebar";
import { useToast } from "@/hooks/use-toast";

// Strategy Cascade structure
export interface StrategyCascade {
  winningAspiration: string;
  whereToPlay: string;
  howToWin: string;
  coreCapabilities: string;
  managementSystems: string;
}

// Coach response structure
export interface CoachResponse {
  stepName: string;
  feedback: string;
  questions: string[];
  suggestions: string[];
  timestamp: Date;
}

const STEPS = [
  {
    id: 1,
    title: "Winning Aspiration",
    description: "What is your winning aspiration? Define your purpose and strategic intent.",
    key: "winningAspiration" as keyof StrategyCascade,
    label: "Your Winning Aspiration",
    helperPath: "/content/help/winning-aspiration.md",
    minChars: 50,
  },
  {
    id: 2,
    title: "Where to Play",
    description: "Where will you play? Choose your market focus and boundaries.",
    key: "whereToPlay" as keyof StrategyCascade,
    label: "Where to Play",
    helperPath: "/content/help/where-to-play.md",
    minChars: 40,
  },
  {
    id: 3,
    title: "How to Win",
    description: "How will you win? Define your competitive advantage.",
    key: "howToWin" as keyof StrategyCascade,
    label: "How to Win",
    helperPath: "/content/help/how-to-win.md",
    minChars: 40,
  },
  {
    id: 4,
    title: "Core Capabilities",
    description: "What capabilities must be in place? Identify key strengths to build.",
    key: "coreCapabilities" as keyof StrategyCascade,
    label: "Core Capabilities",
    helperPath: "/content/help/core-capabilities.md", // TODO: Create this file
    minChars: 40,
  },
  {
    id: 5,
    title: "Management Systems",
    description: "What management systems are required? Design supporting infrastructure.",
    key: "managementSystems" as keyof StrategyCascade,
    label: "Management Systems",
    helperPath: "/content/help/management-systems.md", // TODO: Create this file
    minChars: 40,
  },
];

export default function StrategyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cascade, setCascade] = useState<StrategyCascade>({
    winningAspiration: "",
    whereToPlay: "",
    howToWin: "",
    coreCapabilities: "",
    managementSystems: "",
  });
  const [coachResponses, setCoachResponses] = useState<CoachResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate progress percentage
  const progress = (currentStep / STEPS.length) * 100;
  const currentStepData = STEPS.find(step => step.id === currentStep)!;

  // Handle step navigation
  const goToNextStep = () => {
    const currentValue = cascade[currentStepData.key];
    
    // Validate current step before advancing
    if (!currentValue.trim()) {
      toast({
        title: "Input Required",
        description: `Please complete the ${currentStepData.title} step before continuing.`,
        variant: "destructive",
      });
      return;
    }

    if (currentValue.trim().length < currentStepData.minChars) {
      toast({
        title: "More Detail Needed",
        description: `Please provide at least ${currentStepData.minChars} characters for ${currentStepData.title}.`,
        variant: "destructive",
      });
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle cascade updates
  const updateCascade = (key: keyof StrategyCascade, value: string) => {
    setCascade(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle coach response
  const handleCoachResponse = (response: CoachResponse) => {
    setCoachResponses(prev => [response, ...prev]);
  };

  // Handle coach API errors
  const handleCoachError = (error: string) => {
    toast({
      title: "Coach Unavailable",
      description: "Unable to get coach feedback right now. Your input has been saved.",
      variant: "destructive",
    });
  };

  // Auto-save functionality (TODO: Implement with Supabase)
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      // TODO: Implement autosave to Supabase
      console.log("Auto-saving cascade:", cascade);
    }, 3000);

    return () => clearTimeout(saveTimer);
  }, [cascade]);

  // TODO: Load saved cascade on component mount
  useEffect(() => {
    // TODO: Load from Supabase if user is authenticated
    console.log("TODO: Load saved cascade from Supabase");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <Target className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">AI Strategy Coach</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {STEPS.length}
              </span>
              {/* TODO: Add user menu with Clerk */}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Strategy Cascade Builder</h1>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep === step.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : currentStep > step.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {step.id}
                </button>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-gray-900">
                    {currentStepData.title}
                  </CardTitle>
                  <p className="text-center text-gray-600 text-lg">
                    {currentStepData.description}
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Steps 1, 2, and 3 - Implemented */}
                  {(currentStep >= 1 && currentStep <= 3) && (
                    <CascadeInput
                      stepKey={currentStepData.key}
                      label={currentStepData.label}
                      helperPath={currentStepData.helperPath}
                      minChars={currentStepData.minChars}
                      value={cascade[currentStepData.key]}
                      onChange={(value) => updateCascade(currentStepData.key, value)}
                      onCoachResponse={handleCoachResponse}
                      onCoachError={handleCoachError}
                      setIsLoading={setIsLoading}
                      cascade={cascade}
                    />
                  )}
                  
                  {/* Steps 4-5 - TODO: Implement */}
                  {currentStep > 3 && (
                    <div className="text-center py-16">
                      <h3 className="text-xl font-semibold text-gray-600 mb-4">
                        Step {currentStep}: {currentStepData.title}
                      </h3>
                      <p className="text-gray-500 mb-8">
                        This step will be implemented in the next phase.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-sm text-gray-600">
                          TODO: Implement {currentStepData.title} input form with:
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          <li>• Contextual help content from {currentStepData.helperPath}</li>
                          <li>• Input validation (min {currentStepData.minChars} characters)</li>
                          <li>• AI coach integration with step context</li>
                          <li>• Cross-step analysis with previous choices</li>
                          <li>• Autosave functionality</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex space-x-4">
              {currentStep === STEPS.length ? (
                <Button className="px-8" disabled>
                  {/* TODO: Implement PDF export */}
                  Export PDF (Coming Soon)
                </Button>
              ) : (
                <Button
                  onClick={goToNextStep}
                  className="px-6"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Coach Sidebar */}
        <CoachSidebar 
          responses={coachResponses} 
          isLoading={isLoading}
          currentStep={currentStepData.title}
        />
      </div>
    </div>
  );
}