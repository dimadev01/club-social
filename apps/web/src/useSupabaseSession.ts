import type { SessionData } from 'react-router';

import { useState } from 'react';

import { supabase } from './supabase/client';

export const useSupabaseSession = () => {
  const [session, setSession] = useState<null | SessionData>(null);
  const [isLoading, setIsLoading] = useState(true);

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      setSession(session);
    } else if (event === 'SIGNED_OUT') {
      setSession(null);
    }

    setIsLoading(false);
  });

  return { isLoading, session };
};
