"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  Trash2, 
  Edit3,
  Calendar,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { SupabaseService } from "@/lib/supabase";
import { CascadeTable } from "@/components/CascadeTable";
import type { CascadeRecord } from "@/types/cascade";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [cascades, setCascades] = useState<CascadeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  // Load user's cascades
  useEffect(() => {
    if (user) {
      loadCascades();
    }
  }, [user]);

  const loadCascades = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await SupabaseService.getUserCascades(user.id);
      setCascades(data);
    } catch (error) {
      console.error('Failed to load cascades:', error);
      toast({
        title: "Error",
        description: "Failed to load your strategy cascades.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCascade = async () => {
    if (!user) return;

    try {
      setIsCreating(true);
      const newCascade = await SupabaseService.createCascade(user.id);
      
      toast({
        title: "Success",
        description: "New strategy cascade created.",
      });

      // Navigate to the new cascade
      router.push(`/app?id=${newCascade.id}`);
    } catch (error) {
      console.error('Failed to create cascade:', error);
      toast({
        title: "Error",
        description: "Failed to create new cascade.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCascade = async (cascadeId: string) => {
    if (!user) return;

    try {
      await SupabaseService.deleteCascade(cascadeId, user.id);
      
      // Remove from local state
      setCascades(prev => prev.filter(c => c.id !== cascadeId));
      
      toast({
        title: "Success",
        description: "Strategy cascade deleted.",
      });
    } catch (error) {
      console.error('Failed to delete cascade:', error);
      toast({
        title: "Error",
        description: "Failed to delete cascade.",
        variant: "destructive",
      });
    }
  };

  const getCompletionStatus = (cascade: CascadeRecord) => {
    const steps = [
      cascade.cascade_json.winningAspiration,
      cascade.cascade_json.whereToPlay,
      cascade.cascade_json.howToWin,
      cascade.cascade_json.coreCapabilities,
      cascade.cascade_json.managementSystems,
    ];
    
    const completed = steps.filter(step => step && step.trim().length > 0).length;
    return { completed, total: 5, percentage: Math.round((completed / 5) * 100) };
  };

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while user data is not available
  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Strategy Coach</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'User'}
              </span>
              {/* TODO: Add user menu with sign out */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Strategy Cascades
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Manage your Playing to Win strategy cascades. Create new strategies, 
            continue working on drafts, or review completed cascades.
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1">
              <FileText className="mr-1 h-4 w-4" />
              {cascades.length} {cascades.length === 1 ? 'Strategy' : 'Strategies'}
            </Badge>
          </div>
          <Button 
            onClick={handleCreateCascade}
            disabled={isCreating}
            className="px-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isCreating ? 'Creating...' : 'New Strategy Cascade'}
          </Button>
        </motion.div>

        {/* Cascades List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your strategy cascades...</p>
            </div>
          ) : cascades.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Strategy Cascades Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first Playing to Win strategy cascade to get started.
                </p>
                <Button onClick={handleCreateCascade} disabled={isCreating}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Strategy
                </Button>
              </CardContent>
            </Card>
          ) : (
            <CascadeTable 
              cascades={cascades}
              onDelete={handleDeleteCascade}
              getCompletionStatus={getCompletionStatus}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}