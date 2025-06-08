import { createClient } from '@supabase/supabase-js';

// TODO: Add these environment variables to your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface StrategyCascadeRecord {
  id: string;
  user_id: string;
  winning_aspiration: string;
  where_to_play: string;
  how_to_win: string;
  core_capabilities: string;
  management_systems: string;
  created_at: string;
  updated_at: string;
}

export interface CoachResponseRecord {
  id: string;
  cascade_id: string;
  step_name: string;
  feedback: string;
  questions: string[];
  suggestions: string[];
  created_at: string;
}

// Database functions
export class SupabaseService {
  // Save strategy cascade (with upsert for autosave)
  static async saveCascade(userId: string, cascade: any): Promise<StrategyCascadeRecord | null> {
    try {
      const { data, error } = await supabase
        .from('strategy_cascades')
        .upsert({
          user_id: userId,
          winning_aspiration: cascade.winningAspiration,
          where_to_play: cascade.whereToPlay,
          how_to_win: cascade.howToWin,
          core_capabilities: cascade.coreCapabilities,
          management_systems: cascade.managementSystems,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving cascade:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error saving cascade:', error);
      return null;
    }
  }

  // Load strategy cascade
  static async loadCascade(userId: string): Promise<StrategyCascadeRecord | null> {
    try {
      const { data, error } = await supabase
        .from('strategy_cascades')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading cascade:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Unexpected error loading cascade:', error);
      return null;
    }
  }

  // Save coach response
  static async saveCoachResponse(
    cascadeId: string, 
    response: any
  ): Promise<CoachResponseRecord | null> {
    try {
      const { data, error } = await supabase
        .from('coach_responses')
        .insert({
          cascade_id: cascadeId,
          step_name: response.stepName,
          feedback: response.feedback,
          questions: response.questions,
          suggestions: response.suggestions,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving coach response:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error saving coach response:', error);
      return null;
    }
  }

  // Load coach responses for a cascade
  static async loadCoachResponses(cascadeId: string): Promise<CoachResponseRecord[]> {
    try {
      const { data, error } = await supabase
        .from('coach_responses')
        .select('*')
        .eq('cascade_id', cascadeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading coach responses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error loading coach responses:', error);
      return [];
    }
  }
}

/*
TODO: Create these tables in Supabase:

-- Strategy Cascades table
CREATE TABLE strategy_cascades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  winning_aspiration TEXT DEFAULT '',
  where_to_play TEXT DEFAULT '',
  how_to_win TEXT DEFAULT '',
  core_capabilities TEXT DEFAULT '',
  management_systems TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach Responses table  
CREATE TABLE coach_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cascade_id UUID REFERENCES strategy_cascades(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  feedback TEXT NOT NULL,
  questions TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE strategy_cascades ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your auth setup)
CREATE POLICY "Users can manage their own cascades" ON strategy_cascades
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view coach responses for their cascades" ON coach_responses
  FOR SELECT USING (
    CASCADE_id IN (
      SELECT id FROM strategy_cascades WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "System can insert coach responses" ON coach_responses
  FOR INSERT WITH CHECK (true);
*/