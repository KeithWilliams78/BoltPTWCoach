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

  // TODO: Implement remaining step feedback generators
  private static generateCapabilitiesFeedback(input: string, cascade: StrategyCascade): CoachResponse {
    return {
      stepName: "Core Capabilities",
      feedback: "This step will identify the key capabilities needed to execute your strategy.",
      questions: ["What capabilities are critical?", "What do you need to build?"],
      suggestions: ["Map required skills", "Identify capability gaps"],
      timestamp: new Date()
    };
  }

  private static generateSystemsFeedback(input: string, cascade: StrategyCascade): CoachResponse {
    return {
      stepName: "Management Systems",
      feedback: "This step will design the systems and processes to support your strategy.",
      questions: ["What systems enable success?", "How will you measure progress?"],
      suggestions: ["Design measurement systems", "Plan organizational support"],
      timestamp: new Date()
    };
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
5. Implement comprehensive cross-step analysis (alignment between all three steps)
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