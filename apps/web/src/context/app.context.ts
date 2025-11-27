import type { SessionData } from 'react-router';

import { createContext, useContext } from 'react';

interface AppContextType {
  session: null | SessionData;
}

export const AppContext = createContext<AppContextType>({
  session: null,
});

export const useAppContext = () => {
  return useContext(AppContext);
};
