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

  // TODO: Implement other step feedback generators
  private static generateWhereToPlayFeedback(input: string, aspiration: string): CoachResponse {
    return {
      stepName: "Where to Play",
      feedback: "This step will focus on defining your market boundaries and customer segments.",
      questions: ["Where will you compete?", "Who are your target customers?"],
      suggestions: ["Define market segments", "Consider geographic boundaries"],
      timestamp: new Date()
    };
  }

  private static generateHowToWinFeedback(input: string, aspiration: string, whereToPlay: string): CoachResponse {
    return {
      stepName: "How to Win",
      feedback: "This step will define your competitive advantage and differentiation strategy.",
      questions: ["What makes you different?", "Why will customers choose you?"],
      suggestions: ["Identify unique strengths", "Consider competitive positioning"],
      timestamp: new Date()
    };
  }

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
4. Implement conversation history for context
5. Add rate limiting and error handling
6. Store responses in Supabase for continuity

Example API implementation:

export async function POST(request: Request) {
  const { stepKey, cascade, conversationHistory } = await request.json();
  
  const prompt = buildPrompt(stepKey, cascade, conversationHistory);
  
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