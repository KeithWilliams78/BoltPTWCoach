"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Brain, 
  ChevronRight, 
  Clock, 
  HelpCircle,
  Lightbulb,
  Target,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoachResponse } from "@/app/app/page";

interface CoachSidebarProps {
  responses: CoachResponse[];
  isLoading: boolean;
  currentStep: string;
}

export function CoachSidebar({ responses, isLoading, currentStep }: CoachSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<CoachResponse | null>(null);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-96'} transition-all duration-300 ease-in-out border-l bg-white/90 backdrop-blur-sm`}>
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">AI Coach</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        
        {!isCollapsed && (
          <p className="text-sm text-gray-600 mt-1">
            Strategic guidance for: <span className="font-medium">{currentStep}</span>
          </p>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex flex-col h-[calc(100vh-120px)]">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-blue-700">Coach is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {responses.length === 0 && !isLoading && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Help</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Start by entering your winning aspiration, then ask the coach for feedback. 
                  The AI will help you refine your strategic thinking with thoughtful questions 
                  and challenges.
                </p>
              </div>
            </div>
          )}

          {/* Responses List */}
          {responses.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <AnimatePresence>
                  {responses.map((response, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedResponse(response)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center">
                              <Target className="mr-1 h-4 w-4 text-blue-600" />
                              {response.stepName}
                            </CardTitle>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatTime(response.timestamp)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                            {response.feedback}
                          </p>
                          
                          {response.questions.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center text-xs font-medium text-gray-700">
                                <HelpCircle className="mr-1 h-3 w-3" />
                                Key Questions ({response.questions.length})
                              </div>
                              <div className="text-xs text-gray-600">
                                {response.questions[0]}
                                {response.questions.length > 1 && (
                                  <span className="text-gray-400"> +{response.questions.length - 1} more</span>
                                )}
                              </div>
                            </div>
                          )}

                          {response.suggestions.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center text-xs font-medium text-gray-700 mb-1">
                                <Lightbulb className="mr-1 h-3 w-3" />
                                Suggestions ({response.suggestions.length})
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {response.suggestions.slice(0, 2).map((suggestion, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {suggestion.length > 20 ? `${suggestion.substring(0, 20)}...` : suggestion}
                                  </Badge>
                                ))}
                                {response.suggestions.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{response.suggestions.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}

          {/* Detailed Response Modal */}
          <AnimatePresence>
            {selectedResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedResponse(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{selectedResponse.stepName} Feedback</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedResponse(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Coach Feedback</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {selectedResponse.feedback}
                        </p>
                      </div>

                      {selectedResponse.questions.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-medium mb-2 flex items-center">
                              <HelpCircle className="mr-1 h-4 w-4" />
                              Strategic Questions
                            </h4>
                            <ul className="space-y-2">
                              {selectedResponse.questions.map((question, idx) => (
                                <li key={idx} className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                  {question}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                      {selectedResponse.suggestions.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-medium mb-2 flex items-center">
                              <Lightbulb className="mr-1 h-4 w-4" />
                              Suggestions
                            </h4>
                            <ul className="space-y-2">
                              {selectedResponse.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}