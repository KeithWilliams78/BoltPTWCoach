// Database types for Supabase
export interface CascadeRecord {
  id: string;
  user_id: string;
  name: string;
  cascade_json: StrategyCascade;
  created_at: string;
  updated_at: string;
}

// Strategy Cascade Types (existing)
export interface StrategyCascade {
  winningAspiration: string;
  whereToPlay: string;
  howToWin: string;
  coreCapabilities: string;
  managementSystems: string;
}

// Coach Comment Types (existing)
export interface CoachComment {
  step: string;
  message: string;
  timestamp?: Date;
}

// API Request/Response Types
export interface CreateCascadeRequest {
  name?: string;
}

export interface UpdateCascadeRequest {
  name?: string;
  cascade_json?: StrategyCascade;
}

export interface CascadeResponse {
  success: boolean;
  data?: CascadeRecord;
  error?: string;
}