"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SupabaseService } from './supabase';
import type { CascadeRecord, StrategyCascade } from '@/types/cascade';

export function useCascade(cascadeId?: string) {
  const { user } = useUser();
  const [cascade, setCascade] = useState<CascadeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cascade on mount
  useEffect(() => {
    if (!user || !cascadeId) {
      setIsLoading(false);
      return;
    }

    loadCascade();
  }, [user, cascadeId]);

  const loadCascade = async () => {
    if (!user || !cascadeId) return;

    try {
      setIsLoading(true);
      const data = await SupabaseService.getCascade(cascadeId, user.id);
      setCascade(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load cascade:', err);
      setError('Failed to load cascade');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCascade = async (updates: Partial<CascadeRecord>) => {
    if (!user || !cascadeId || !cascade) return;

    try {
      const updatedCascade = await SupabaseService.updateCascade(
        cascadeId,
        user.id,
        updates
      );
      setCascade(updatedCascade);
      return updatedCascade;
    } catch (err) {
      console.error('Failed to update cascade:', err);
      throw err;
    }
  };

  const updateName = async (name: string) => {
    return updateCascade({ name });
  };

  const updateCascadeJson = async (cascade_json: StrategyCascade) => {
    return updateCascade({ cascade_json });
  };

  const deleteCascade = async () => {
    if (!user || !cascadeId) return;

    try {
      await SupabaseService.deleteCascade(cascadeId, user.id);
    } catch (err) {
      console.error('Failed to delete cascade:', err);
      throw err;
    }
  };

  return {
    cascade,
    isLoading,
    error,
    updateName,
    updateCascadeJson,
    deleteCascade,
    reload: loadCascade,
  };
}