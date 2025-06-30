import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { CascadeResponse, UpdateCascadeRequest } from '@/types/cascade';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CascadeResponse>
) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid cascade ID' });
  }

  // Verify authentication using the current Clerk method
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const supabase = createServerSupabaseClient();

  try {
    switch (req.method) {
      case 'GET':
        // Get cascade
        const { data: cascade, error: getError } = await supabase
          .from('cascades')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (getError) {
          if (getError.code === 'PGRST116') {
            return res.status(404).json({ success: false, error: 'Cascade not found' });
          }
          throw getError;
        }

        return res.status(200).json({ success: true, data: cascade });

      case 'PATCH':
        // Update cascade
        const updates: UpdateCascadeRequest = req.body;
        
        const { data: updatedCascade, error: updateError } = await supabase
          .from('cascades')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();

        if (updateError) {
          if (updateError.code === 'PGRST116') {
            return res.status(404).json({ success: false, error: 'Cascade not found' });
          }
          throw updateError;
        }

        return res.status(200).json({ success: true, data: updatedCascade });

      case 'DELETE':
        // Delete cascade
        const { error: deleteError } = await supabase
          .from('cascades')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (deleteError) {
          throw deleteError;
        }

        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}