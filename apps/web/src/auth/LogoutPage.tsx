import { useEffect } from 'react';

import { supabase } from '@/shared/lib/supabase';

export function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
    };

    logout();
  }, []);

  return <div>Logging out...</div>;
}
