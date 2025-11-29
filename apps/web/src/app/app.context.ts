import type { Session } from '@supabase/supabase-js';

import { createContext, useContext } from 'react';

interface AppContextType {
  session: null | Session;
}

export const AppContext = createContext<AppContextType>({
  session: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};
