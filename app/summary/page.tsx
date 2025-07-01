"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle,
  Edit3
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExportButton } from "@/components/ExportButton";
import type { StrategyCascade, CoachComment } from "@/types";

const STRATEGY_STEPS = [
  {
    key: "winningAspiration" as keyof StrategyCascade,
    title: "Winning Aspiration",
    description: "Your purpose and strategic intent",
    icon: "🎯",
  },
  {
    key: "whereToPlay" as keyof StrategyCascade,
    title: "Where to Play",
    description: "Your market focus and boundaries",
    icon: "🗺️",
  },
  {
    key: "howToWin" as keyof StrategyCascade,
    title: "How to Win",
    description: "Your competitive advantage",
    icon: "🏆",
  },
  {
    key: "coreCapabilities" as keyof StrategyCascade,
    title: "Core Capabilities",
    description: "Key strengths to build and maintain",
    icon: "⚡",
  },
  {
    key: "managementSystems" as keyof StrategyCascade,
    title: "Management Systems",
    description: "Supporting infrastructure and processes",
    icon: "⚙️",
  },
];

export default function StrategySummary() {
  const [cascade, setCascade] = useState<StrategyCascade>({
    winningAspiration: "",
    whereToPlay: "",
    howToWin: "",
    coreCapabilities: "",
    managementSystems: "",
  });

  const [coachComments, setCoachComments] = useState<CoachComment[]>([]);

  // TODO: Load saved cascade and coach comments from Supabase
  useEffect(() => {
    // Mock data for demonstration - replace with actual Supabase load
    setCascade({
      winningAspiration: "Transform how small businesses access financial services by providing instant, AI-powered lending decisions that enable growth and success.",
      whereToPlay: "Serve small business owners (1-50 employees) in the US who struggle with traditional bank lending, focusing on e-commerce businesses needing working capital under $100K.",
      howToWin: "Win through instant lending decisions powered by AI analysis of real-time business data, providing funding in 24 hours versus weeks for traditional lenders.",
      coreCapabilities: "Excel at real-time data integration, machine learning model development, risk assessment, regulatory compliance, digital UX design, and partnership development.",
      managementSystems: "Implement real-time risk monitoring dashboards, regulatory compliance tracking, customer success metrics, data governance protocols, and agile development processes.",
    });

    // Mock coach comments
    setCoachComments([
      {
        step: "Winning Aspiration",
        message: "Your aspiration is specific and customer-focused. Consider adding measurable outcomes to make it even more concrete."
      },
      {
        step: "Where to Play",
        message: "Good market focus on small businesses. The geographic and size boundaries are clear and actionable."
      },
      {
        step: "How to Win",
        message: "Strong competitive advantage through speed and AI. Consider how you'll maintain this advantage as competitors catch up."
      },
      {
        step: "Core Capabilities",
        message: "These capabilities directly enable your competitive advantage. Focus on building the AI and data capabilities first."
      },
      {
        step: "Management Systems",
        message: "Your systems align well with your capabilities. Consider adding customer feedback loops to improve your AI models."
      }
    ]);
  }, []);

  // Calculate completion status
  const completedSteps = STRATEGY_STEPS.filter(step => cascade[step.key].trim().length > 0);
  const completionPercentage = Math.round((completedSteps.length / STRATEGY_STEPS.length) * 100);
  const isComplete = completedSteps.length === STRATEGY_STEPS.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/app" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <Target className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">AI Strategy Coach</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <CheckCircle className="mr-1 h-4 w-4" />
                {completionPercentage}% Complete
              </Badge>
              {/* TODO: Add user menu with Clerk */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Strategy Cascade
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A complete view of your five strategic choices using the Playing to Win framework.
            Review your cascade and export it for team alignment and implementation.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center space-x-4 mb-8"
        >
          <ExportButton 
            cascade={cascade}
            coachComments={coachComments}
            disabled={!isComplete}
          />
          <Button variant="outline" disabled className="px-6">
            <MessageCircle className="mr-2 h-4 w-4" />
            Ask the Coach (Coming Soon)
          </Button>
          <Link href="/app">
            <Button variant="outline" className="px-6">
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Strategy
            </Button>
          </Link>
        </motion.div>

        {/* Completion Notice */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <p className="text-amber-800 text-center">
                  Complete all five steps to enable PDF export and full strategy analysis.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Strategy Cascade Cards */}
        <div className="space-y-6">
          {STRATEGY_STEPS.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{step.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">
                        {step.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                    <Badge 
                      variant={cascade[step.key].trim() ? "default" : "secondary"}
                      className="px-2 py-1"
                    >
                      {cascade[step.key].trim() ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {cascade[step.key].trim() ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 leading-relaxed">
                        {cascade[step.key]}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-500 italic">
                        This section has not been completed yet.
                      </p>
                      <Link href="/app">
                        <Button variant="outline" size="sm" className="mt-2">
                          Complete This Step
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Connector Line (except for last item) */}
              {index < STRATEGY_STEPS.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-px h-6 bg-gradient-to-b from-blue-300 to-blue-500"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Strategy Coherence Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900">
                Strategy Coherence Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {completionPercentage}%
                </div>
                <p className="text-gray-600">
                  Strategy Completion
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Completed Steps:</strong> {completedSteps.length} of {STRATEGY_STEPS.length}
                </p>
                {isComplete ? (
                  <p className="text-green-600 font-medium">
                    🎉 Congratulations! Your strategy cascade is complete.
                  </p>
                ) : (
                  <p className="text-amber-600">
                    Complete all five steps to unlock full strategy analysis and PDF export.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-center mt-12 pb-8"
        >
          <p className="text-sm text-gray-500">
            Built with the Playing to Win framework by A.G. Lafley and Roger Martin
          </p>
        </motion.div>
      </div>
    </div>
  );
}