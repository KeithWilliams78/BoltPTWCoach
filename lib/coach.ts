import type { StrategyCascade, CoachResponse } from "@/app/app/page";

// Mock AI Coach Service - Replace with actual API integration
export class CoachService {
  
  // Simulate API delay
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate contextual feedback based on step and input
  static async generateFeedback(
    stepKey: keyof StrategyCascade,
    cascade: StrategyCascade
  ): Promise<CoachResponse> {
    
    // Simulate API call delay
    await this.delay(1500 + Math.random() * 1000);

    const input = cascade[stepKey];
    
    // Step-specific coaching logic
    switch (stepKey) {
      case 'winningAspiration':
        return this.generateWinningAspirationFeedback(input);
      
      case 'whereToPlay':
        return this.generateWhereToPlayFeedback(input, cascade.winningAspiration);
      
      case 'howToWin':
        return this.generateHowToWinFeedback(input, cascade.winningAspiration, cascade.whereToPlay);
      
      case 'coreCapabilities':
        return this.generateCapabilitiesFeedback(input, cascade);
      
      case 'managementSystems':
        return this.generateSystemsFeedback(input, cascade);
      
      default:
        throw new Error(`Unknown step: ${stepKey}`);
    }
  }

  // Winning Aspiration specific feedback
  private static generateWinningAspirationFeedback(input: string): CoachResponse {
    const feedback = this.analyzeWinningAspiration(input);
    
    const challengingQuestions = [
      "Is this aspiration bold enough to inspire your team and differentiate you from competitors?",
      "What would success look like in concrete, measurable terms?",
      "How does this aspiration connect to a genuine customer need or market opportunity?",
      "What assumptions are you making about the market or your capabilities?",
      "If you achieved this aspiration, what would be fundamentally different about your organization?"
    ];

    const suggestions = [
      "Consider adding specific timeframes or metrics",
      "Make it more customer-focused",
      "Clarify the unique value you'll create",
      "Ensure it's ambitious but achievable",
      "Connect to your organization's core purpose"
    ];

    return {
      stepName: "Winning Aspiration",
      feedback,
      questions: this.selectRandomItems(challengingQuestions, 3),
      suggestions: this.selectRandomItems(suggestions, 3),
      timestamp: new Date()
    };
  }

  // Where to Play specific feedback with cross-step analysis
  private static generateWhereToPlayFeedback(input: string, aspiration: string): CoachResponse {
    const feedback = this.analyzeWhereToPlay(input, aspiration);
    
    const challengingQuestions = [
      "Are these market choices specific enough to guide resource allocation decisions?",
      "How do these segments align with your winning aspiration?",
      "What makes you believe you can win in these specific markets?",
      "Are you being too broad or too narrow in your market definition?",
      "Which of these choices will be hardest for competitors to replicate?"
    ];

    const suggestions = [
      "Define customer segments more precisely",
      "Consider geographic or channel boundaries",
      "Evaluate market size vs. competitive intensity",
      "Ensure alignment with your winning aspiration",
      "Think about adjacency opportunities"
    ];

    return {
      stepName: "Where to Play",
      feedback,
      questions: this.selectRandomItems(challengingQuestions, 3),
      suggestions: this.selectRandomItems(suggestions, 3),
      timestamp: new Date()
    };
  }

  // How to Win specific feedback with cross-step analysis
  private static generateHowToWinFeedback(input: string, aspiration: string, whereToPlay: string): CoachResponse {
    const feedback = this.analyzeHowToWin(input, aspiration, whereToPlay);
    
    const challengingQuestions = [
      "Is this competitive advantage sustainable, or can competitors easily copy it?",
      "How does this advantage directly create value for the customers you defined in 'Where to Play'?",
      "What would make it difficult for competitors to replicate your approach?",
      "Are you competing on cost, differentiation, or both - and is that the right choice?",
      "How will you maintain and strengthen this advantage over time?"
    ];

    const suggestions = [
      "Make your competitive advantage more specific and unique",
      "Connect your advantage to customer outcomes",
      "Consider barriers to imitation",
      "Align with your market choices",
      "Think about capability requirements"
    ];

    return {
      stepName: "How to Win",
      feedback,
      questions: this.selectRandomItems(challengingQuestions, 3),
      suggestions: this.selectRandomItems(suggestions, 3),
      timestamp: new Date()
    };
  }

  // Core Capabilities specific feedback with comprehensive cross-step analysis
  private static generateCapabilitiesFeedback(input: string, cascade: StrategyCascade): CoachResponse {
    const feedback = this.analyzeCoreCapabilities(input, cascade);
    
    const challengingQuestions = [
      "Do these capabilities directly enable your 'How to Win' strategy, or are they just nice to have?",
      "Which of these capabilities would be hardest for competitors to replicate or acquire?",
      "What's your plan for building capabilities you don't currently have?",
      "How do these capabilities work together to create competitive advantage?",
      "Are you trying to be excellent at too many things instead of focusing on what matters most?"
    ];

    const suggestions = [
      "Focus on capabilities that directly enable your competitive advantage",
      "Identify which capabilities to build vs. buy vs. partner for",
      "Consider how capabilities reinforce each other",
      "Prioritize capabilities that are hard to imitate",
      "Plan for capability development timelines and investment"
    ];

    return {
      stepName: "Core Capabilities",
      feedback,
      questions: this.selectRandomItems(challengingQuestions, 3),
      suggestions: this.selectRandomItems(suggestions, 3),
      timestamp: new Date()
    };
  }

  // Management Systems specific feedback with comprehensive five-step analysis
  private static generateSystemsFeedback(input: string, cascade: StrategyCascade): CoachResponse {
    const feedback = this.analyzeManagementSystems(input, cascade);
    
    const challengingQuestions = [
      "Do these management systems directly enable your core capabilities, or are they just standard business processes?",
      "How will these systems help you maintain your competitive advantage over time?",
      "What's missing from your systems that could prevent successful strategy execution?",
      "How will you measure whether your strategy is working and make necessary adjustments?",
      "Are these systems aligned with your organizational culture and capabilities?"
    ];

    const suggestions = [
      "Focus on systems that directly support your strategic choices",
      "Include measurement and feedback mechanisms",
      "Consider organizational design and governance needs",
      "Plan for system integration and data flow",
      "Think about change management and capability development"
    ];

    return {
      stepName: "Management Systems",
      feedback,
      questions: this.selectRandomItems(challengingQuestions, 3),
      suggestions: this.selectRandomItems(suggestions, 3),
      timestamp: new Date()
    };
  }

  // Analyze winning aspiration content
  private static analyzeWinningAspiration(input: string): string {
    const length = input.length;
    const hasMetrics = /\d+/.test(input);
    const hasTimeframe = /(year|month|by 20\d{2})/i.test(input);
    const hasCustomerFocus = /(customer|client|user)/i.test(input);
    
    let feedback = "I've reviewed your winning aspiration. ";

    if (length < 100) {
      feedback += "Consider expanding on your vision to provide more clarity about what success looks like. ";
    }

    if (!hasCustomerFocus) {
      feedback += "Think about how this aspiration directly benefits your customers or creates value for them. ";
    }

    if (!hasTimeframe) {
      feedback += "Adding a timeframe can help make your aspiration more concrete and actionable. ";
    }

    if (!hasMetrics) {
      feedback += "Consider including measurable outcomes to make your aspiration more specific. ";
    }

    feedback += "Remember, a strong winning aspiration should inspire action while being specific enough to guide strategic decisions. What matters most is that it represents a meaningful and achievable stretch for your organization.";

    return feedback;
  }

  // Analyze where to play with cross-step validation
  private static analyzeWhereToPlay(input: string, aspiration: string): string {
    const length = input.length;
    const hasSegments = /(segment|customer|target)/i.test(input);
    const hasGeography = /(market|region|country|global|local)/i.test(input);
    const hasBoundaries = /(focus|specific|exclude|not)/i.test(input);
    const isTooGeneral = /(everyone|all|any|general)/i.test(input);
    
    let feedback = "I've analyzed your 'Where to Play' choices";
    
    // Cross-step analysis
    if (aspiration) {
      const aspirationWords = aspiration.toLowerCase().split(/\s+/);
      const inputWords = input.toLowerCase().split(/\s+/);
      const commonWords = aspirationWords.filter(word => 
        inputWords.includes(word) && word.length > 3
      );
      
      if (commonWords.length > 0) {
        feedback += " and I can see good alignment with your winning aspiration. ";
      } else {
        feedback += ". Consider how these market choices directly support your winning aspiration. ";
      }
    } else {
      feedback += ". ";
    }

    if (isTooGeneral) {
      feedback += "Be more specific about your target segments - 'everyone' is rarely a winning strategy. ";
    }

    if (!hasSegments) {
      feedback += "Define your customer segments more clearly - who exactly are you serving? ";
    }

    if (!hasGeography) {
      feedback += "Consider adding geographic boundaries to focus your efforts. ";
    }

    if (!hasBoundaries) {
      feedback += "Strong 'Where to Play' choices include what you won't do - consider your boundaries. ";
    }

    if (length < 80) {
      feedback += "Expand on your market choices to provide clearer strategic direction. ";
    }

    feedback += "Remember, effective 'Where to Play' choices should be specific enough to guide resource allocation and narrow enough to build competitive advantage.";

    return feedback;
  }

  // Analyze how to win with cross-step validation
  private static analyzeHowToWin(input: string, aspiration: string, whereToPlay: string): string {
    const length = input.length;
    const hasSpecificAdvantage = /(unique|proprietary|exclusive|patent|technology)/i.test(input);
    const hasCustomerValue = /(value|benefit|outcome|result)/i.test(input);
    const hasGenericTerms = /(better|faster|cheaper|quality|service)/i.test(input);
    const hasSustainability = /(maintain|sustain|defend|barrier)/i.test(input);
    
    let feedback = "I've analyzed your competitive advantage strategy";

    // Cross-step analysis with aspiration
    if (aspiration) {
      const aspirationWords = aspiration.toLowerCase().split(/\s+/);
      const inputWords = input.toLowerCase().split(/\s+/);
      const commonWords = aspirationWords.filter(word => 
        inputWords.includes(word) && word.length > 3
      );
      
      if (commonWords.length > 0) {
        feedback += " and see good connection to your winning aspiration. ";
      } else {
        feedback += ". Consider how this advantage directly enables your winning aspiration. ";
      }
    }

    // Cross-step analysis with where to play
    if (whereToPlay) {
      const whereWords = whereToPlay.toLowerCase().split(/\s+/);
      const inputWords = input.toLowerCase().split(/\s+/);
      const commonWords = whereWords.filter(word => 
        inputWords.includes(word) && word.length > 3
      );
      
      if (commonWords.length > 0) {
        feedback += "I can see alignment with your market choices. ";
      } else {
        feedback += "Think about how this advantage specifically helps you win in your chosen markets. ";
      }
    }

    if (hasGenericTerms && !hasSpecificAdvantage) {
      feedback += "Avoid generic advantages like 'better quality' - be specific about what makes you unique. ";
    }

    if (!hasCustomerValue) {
      feedback += "Connect your advantage to specific customer outcomes and value creation. ";
    }

    if (!hasSustainability) {
      feedback += "Consider how you'll maintain this advantage - what prevents competitors from copying it? ";
    }

    if (length < 80) {
      feedback += "Expand on your competitive advantage to provide clearer strategic direction. ";
    }

    feedback += "Remember, strong competitive advantages are specific, sustainable, and directly create value for your chosen customers.";

    return feedback;
  }

  // Analyze core capabilities with comprehensive cross-step validation
  private static analyzeCoreCapabilities(input: string, cascade: StrategyCascade): string {
    const length = input.length;
    const hasSpecificCapabilities = /(technology|data|process|system|platform)/i.test(input);
    const hasGenericCapabilities = /(management|leadership|teamwork|communication)/i.test(input);
    const hasCapabilityGaps = /(build|develop|acquire|partner|need)/i.test(input);
    const hasIntegration = /(together|combine|integrate|synergy)/i.test(input);
    
    let feedback = "I've analyzed your core capabilities";

    // Cross-step analysis with How to Win
    if (cascade.howToWin) {
      const howToWinWords = cascade.howToWin.toLowerCase().split(/\s+/);
      const inputWords = input.toLowerCase().split(/\s+/);
      const commonWords = howToWinWords.filter(word => 
        inputWords.includes(word) && word.length > 3
      );
      
      if (commonWords.length > 0) {
        feedback += " and can see clear connection to your competitive advantage strategy. ";
      } else {
        feedback += ". Consider how these capabilities directly enable your 'How to Win' strategy. ";
      }
    }

    // Cross-step analysis with Where to Play
    if (cascade.whereToPlay) {
      const whereWords = cascade.whereToPlay.toLowerCase().split(/\s+/);
      const inputWords = input.toLowerCase().split(/\s+/);
      const commonWords = whereWords.filter(word => 
        inputWords.includes(word) && word.length > 3
      );
      
      if (commonWords.length > 0) {
        feedback += "These capabilities align well with your chosen markets. ";
      } else {
        feedback += "Think about how these capabilities help you serve your target markets effectively. ";
      }
    }

    if (hasGenericCapabilities && !hasSpecificCapabilities) {
      feedback += "Focus on distinctive capabilities that create competitive advantage, not generic business skills. ";
    }

    if (!hasCapabilityGaps) {
      feedback += "Consider which capabilities you need to build, buy, or partner for - few organizations have everything they need. ";
    }

    if (!hasIntegration && length > 100) {
      feedback += "Think about how your capabilities work together to create competitive advantage. ";
    }

    if (length < 100) {
      feedback += "Expand on your capability requirements to provide clearer strategic direction. ";
    }

    feedback += "Remember, core capabilities should be distinctive, hard to replicate, and directly enable your competitive advantage in your chosen markets.";

    return feedback;
  }

  // Analyze management systems with comprehensive five-step validation
  private static analyzeManagementSystems(input: string, cascade: StrategyCascade): string {
    const length = input.length;
    const hasSpecificSystems = /(dashboard|process|system|framework|governance)/i.test(input);
    const hasGenericSystems = /(management|leadership|communication|meetings)/i.test(input);
    const hasMeasurement = /(measure|metric|track|monitor|kpi)/i.test(input);
    const hasAlignment = /(align|coordinate|integrate|connect)/i.test(input);
    
    let feedback = "I've analyzed your management systems across your entire strategy cascade";

    // Comprehensive cross-step analysis
    const allSteps = [cascade.winningAspiration, cascade.whereToPlay, cascade.howToWin, cascade.coreCapabilities];
    const completedSteps = allSteps.filter(step => step && step.trim().length > 0);
    
    if (completedSteps.length >= 3) {
      // Analyze alignment with previous steps
      const allWords = completedSteps.join(' ').toLowerCase().split(/\s+/);
      const inputWords = input.toLowerCase().split(/\s+/);
      const commonWords = allWords.filter(word => 
        inputWords.includes(word) && word.length > 3
      );
      
      if (commonWords.length > 2) {
        feedback += " and can see good alignment with your strategic choices. ";
      } else {
        feedback += ". Consider how these systems directly support your winning aspiration, market choices, competitive advantage, and core capabilities. ";
      }
    }

    // Specific analysis for management systems
    if (cascade.coreCapabilities) {
      const capabilityWords = cascade.coreCapabilities.toLowerCase().split(/\s+/);
      const inputWords = input.toLowerCase().split(/\s+/);
      const commonWords = capabilityWords.filter(word => 
        inputWords.includes(word) && word.length > 3
      );
      
      if (commonWords.length > 0) {
        feedback += "These systems appear designed to enable your core capabilities. ";
      } else {
        feedback += "Think about how these systems will help you build and maintain your core capabilities. ";
      }
    }

    if (hasGenericSystems && !hasSpecificSystems) {
      feedback += "Focus on distinctive management systems that enable your strategy, not generic business processes. ";
    }

    if (!hasMeasurement) {
      feedback += "Consider including measurement and feedback systems to track strategic progress. ";
    }

    if (!hasAlignment && length > 100) {
      feedback += "Think about how these systems will ensure alignment across your organization. ";
    }

    if (length < 100) {
      feedback += "Expand on your management system requirements to provide clearer implementation guidance. ";
    }

    feedback += "Remember, effective management systems should directly enable your strategic choices and provide the infrastructure needed to execute your strategy successfully.";

    return feedback;
  }

  // Utility function to randomly select items from an array
  private static selectRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

// Exported helper function for components
export async function getCoachFeedback(
  stepKey: keyof StrategyCascade,
  cascade: StrategyCascade
): Promise<CoachResponse> {
  return CoachService.generateFeedback(stepKey, cascade);
}

/*
TODO: Replace with actual AI integration

When implementing the real AI coach:

1. Create API endpoint (e.g., /api/coach/feedback)
2. Integrate with OpenAI, Anthropic, or similar AI service
3. Add sophisticated prompt engineering for each strategy step
4. Include step parameter in API calls for contextual coaching
5. Implement comprehensive cross-step analysis (alignment across all five steps)
6. Add conversation history for context
7. Store responses in Supabase for continuity

Example API implementation:

export async function POST(request: Request) {
  const { stepKey, cascade, step } = await request.json();
  
  const prompt = buildPrompt(stepKey, cascade, step);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: COACH_SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });
  
  return Response.json(parseCoachResponse(response));
}
*/