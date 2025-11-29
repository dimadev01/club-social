import type { Session } from '@supabase/supabase-js';

import { useState } from 'react';

import { supabase } from '../shared/lib/supabase';

export const useSupabaseSession = () => {
  const [session, setSession] = useState<null | Session>(null);
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
