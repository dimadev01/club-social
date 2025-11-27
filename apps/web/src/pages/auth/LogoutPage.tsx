import { useEffect } from 'react';

import { supabase } from '@/supabase/client';

export function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
    };

    logout();
  }, []);

  return <div>Logging out...</div>;
}
