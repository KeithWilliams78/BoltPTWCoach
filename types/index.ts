// Strategy Cascade Types
export interface StrategyCascade {
  winningAspiration: string;
  whereToPlay: string;
  howToWin: string;
  coreCapabilities: string;
  managementSystems: string;
}

// Coach Comment Types
export interface CoachComment {
  step: string;
  message: string;
  timestamp?: Date;
}

// Coach Response Types
export interface CoachResponse {
  stepName: string;
  feedback: string;
  questions: string[];
  suggestions: string[];
  timestamp: Date;
}

// PDF Export Types
export interface ExportPDFRequest {
  cascade: StrategyCascade;
  coachComments?: CoachComment[];
}

export interface ExportPDFResponse {
  success: boolean;
  error?: string;
}