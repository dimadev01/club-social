import { useEffect } from 'react';

import { Centered } from '@/components/Centered';
import { supabase } from '@/supabase/client';

export function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
    };

    logout();
  }, []);

  return <Centered>Logging out...</Centered>;
}
