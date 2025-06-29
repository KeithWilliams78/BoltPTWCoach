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

// API Request/Response Types
export interface ExportPDFRequest {
  cascade: StrategyCascade;
  coachComments: CoachComment[];
}

export interface ExportPDFResponse {
  success: boolean;
  error?: string;
}