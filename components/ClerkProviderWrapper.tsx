"use client";

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

function ClerkSupabaseBridge({ children }: { children: ReactNode }) {
  const { getToken, userId } = useAuth();

  useEffect(() => {
    const setSupabaseAuth = async () => {
      if (userId) {
        try {
          const token = await getToken({ template: 'supabase' });
          if (token) {
            await supabase.auth.setSession({
              access_token: token,
              refresh_token: '',
            });
          }
        } catch (error) {
          console.error('Error setting Supabase auth:', error);
        }
      } else {
        // Clear Supabase session when user is not authenticated
        await supabase.auth.signOut();
      }
    };

    setSupabaseAuth();
  }, [getToken, userId]);

  return <>{children}</>;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ClerkSupabaseBridge>
        {children}
      </ClerkSupabaseBridge>
    </ClerkProvider>
  );
}