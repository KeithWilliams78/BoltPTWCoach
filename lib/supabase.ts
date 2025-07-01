import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key)
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Database helper functions
export class SupabaseService {
  // Create new cascade
  static async createCascade(userId: string, name?: string): Promise<any> {
    const defaultName = name || `Draft - ${new Date().toLocaleString()}`;
    
    const { data, error } = await supabase
      .from('cascades')
      .insert({
        user_id: userId,
        name: defaultName,
        cascade_json: {
          winningAspiration: '',
          whereToPlay: '',
          howToWin: '',
          coreCapabilities: '',
          managementSystems: '',
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase create error:', error);
      throw new Error(`Failed to create cascade: ${error.message}`);
    }
    return data;
  }

  // Get user's cascades
  static async getUserCascades(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('cascades')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase get cascades error:', error);
      throw new Error(`Failed to load cascades: ${error.message}`);
    }
    return data || [];
  }

  // Get single cascade
  static async getCascade(cascadeId: string, userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('cascades')
      .select('*')
      .eq('id', cascadeId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Supabase get cascade error:', error);
      throw new Error(`Failed to load cascade: ${error.message}`);
    }
    return data;
  }

  // Update cascade
  static async updateCascade(cascadeId: string, userId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('cascades')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cascadeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Failed to update cascade: ${error.message}`);
    }
    return data;
  }

  // Delete cascade
  static async deleteCascade(cascadeId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('cascades')
      .delete()
      .eq('id', cascadeId)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Failed to delete cascade: ${error.message}`);
    }
  }
}

/*
IMPORTANT: Make sure you have created this table in Supabase:

-- Cascades table
CREATE TABLE cascades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  cascade_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cascades ENABLE ROW LEVEL SECURITY;

-- RLS Policy for user access
CREATE POLICY "Users can manage their own cascades" ON cascades
  FOR ALL USING (auth.jwt() ->> 'sub' = user_id);

-- Index for performance
CREATE INDEX idx_cascades_user_id ON cascades(user_id);
CREATE INDEX idx_cascades_updated_at ON cascades(updated_at DESC);
*/