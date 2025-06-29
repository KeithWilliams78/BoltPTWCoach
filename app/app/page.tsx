"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CascadeInput } from "@/components/CascadeInput";
import { CoachSidebar } from "@/components/CoachSidebar";
import { NameInput } from "@/components/NameInput";
import { useToast } from "@/hooks/use-toast";
import { useCascade } from "@/lib/useCascade";
import type { StrategyCascade, CoachResponse } from "@/app/app/page";

// Strategy Cascade structure (existing)
export interface StrategyCascade {
  winningAspiration: string;
  whereToPlay: string;
  howToWin: string;
  coreCapabilities: string;
  managementSystems: string;
}

// Coach response structure (existing)
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
    helperPath: "/content/help/core-capabilities.md",
    minChars: 40,
  },
  {
    id: 5,
    title: "Management Systems",
    description: "What management systems are required? Design supporting infrastructure.",
    key: "managementSystems" as keyof StrategyCascade,
    label: "Management Systems",
    helperPath: "/content/help/management-systems.md",
    minChars: 40,
  },
];

export default function StrategyWizard() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const cascadeId = searchParams.get('id');
  const { cascade: cascadeRecord, isLoading, updateName, updateCascadeJson } = useCascade(cascadeId || undefined);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [localCascade, setLocalCascade] = useState<StrategyCascade>({
    winningAspiration: "",
    whereToPlay: "",
    howToWin: "",
    coreCapabilities: "",
    managementSystems: "",
  });
  const [coachResponses, setCoachResponses] = useState<CoachResponse[]>([]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);

  // Load cascade data when available
  useEffect(() => {
    if (cascadeRecord) {
      setLocalCascade(cascadeRecord.cascade_json);
    }
  }, [cascadeRecord]);

  // Redirect to dashboard if no cascade ID provided
  useEffect(() => {
    if (!isLoading && !cascadeId) {
      router.push('/dashboard');
    }
  }, [cascadeId, isLoading, router]);

  // Calculate progress percentage
  const progress = (currentStep / STEPS.length) * 100;
  const currentStepData = STEPS.find(step => step.id === currentStep)!;

  // Handle step navigation
  const goToNextStep = async () => {
    const currentValue = localCascade[currentStepData.key];
    
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

    // Save to database before advancing
    try {
      await updateCascadeJson(localCascade);
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all steps - navigate to summary
      router.push(`/summary?id=${cascadeId}`);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle cascade updates (local state only)
  const updateLocalCascade = (key: keyof StrategyCascade, value: string) => {
    setLocalCascade(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle coach response
  const handleCoachResponse = async (response: CoachResponse) => {
    setCoachResponses(prev => [response, ...prev]);
    
    // Save to database when getting coach feedback
    try {
      await updateCascadeJson(localCascade);
    } catch (error) {
      console.error('Failed to save cascade after coach response:', error);
    }
  };

  // Handle coach API errors
  const handleCoachError = (error: string) => {
    toast({
      title: "Coach Unavailable",
      description: "Unable to get coach feedback right now. Your input has been saved.",
      variant: "destructive",
    });
  };

  // Handle name updates
  const handleNameUpdate = async (newName: string) => {
    if (!cascadeRecord) return;
    
    // Check if trying to export with default name
    if (newName.match(/^Draft/i)) {
      // Allow saving draft names, just warn about export
    }
    
    await updateName(newName);
  };

  // Auto-save functionality (local only - database saves on Next/Coach)
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      // Local autosave only - database saves on explicit actions
      console.log("Local autosave:", localCascade);
    }, 3000);

    return () => clearTimeout(saveTimer);
  }, [localCascade]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your strategy cascade...</p>
        </div>
      </div>
    );
  }

  if (!cascadeRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Strategy cascade not found.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          {/* Header */}
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="flex items-center space-x-2">
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

              {/* Strategy Name - Only show on Step 1 */}
              {currentStep === 1 && (
                <div className="mb-8">
                  <NameInput
                    value={cascadeRecord.name}
                    onChange={handleNameUpdate}
                  />
                </div>
              )}

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
                      <CascadeInput
                        stepKey={currentStepData.key}
                        label={currentStepData.label}
                        helperPath={currentStepData.helperPath}
                        minChars={currentStepData.minChars}
                        value={localCascade[currentStepData.key]}
                        onChange={(value) => updateLocalCascade(currentStepData.key, value)}
                        onCoachResponse={handleCoachResponse}
                        onCoachError={handleCoachError}
                        setIsLoading={setIsCoachLoading}
                        cascade={localCascade}
                      />
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
                  <Button
                    onClick={goToNextStep}
                    className="px-6"
                  >
                    {currentStep === STEPS.length ? 'Complete Strategy' : 'Next'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Coach Sidebar */}
            <CoachSidebar 
              responses={coachResponses} 
              isLoading={isCoachLoading}
              currentStep={currentStepData.title}
            />
          </div>
        </div>
      </SignedIn>
      
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}